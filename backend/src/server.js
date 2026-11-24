import express from 'express'
import compression from 'compression'
import multer from 'multer'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { developments, enquiries, DOCS_DIR, MEDIA_DIR, DATA_DIR } from './store.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT) || 4000
const isProd = process.env.NODE_ENV === 'production'
const FRONTEND_DIST = path.resolve(process.env.FRONTEND_DIST || path.join(here, '..', '..', 'frontend', 'dist'))

// ---------- Admin auth (stateless signed tokens) ----------
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@buildora.co.za').toLowerCase()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (isProd ? '' : 'buildora-admin')
const SECRET = process.env.ADMIN_SECRET || crypto.randomBytes(32).toString('hex')
const TOKEN_TTL = 1000 * 60 * 60 * 12

const sign = (body) => crypto.createHmac('sha256', SECRET).update(body).digest('base64url')
const issueToken = () => {
  const body = Buffer.from(JSON.stringify({ sub: ADMIN_EMAIL, exp: Date.now() + TOKEN_TTL })).toString('base64url')
  return `${body}.${sign(body)}`
}
const verifyToken = (token = '') => {
  const [body, mac] = token.split('.')
  if (!body || !mac) return false
  const expected = sign(body)
  if (mac.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return false
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString()).exp > Date.now()
  } catch {
    return false
  }
}
const safeEqual = (a, b) => {
  const x = crypto.createHash('sha256').update(String(a)).digest()
  const y = crypto.createHash('sha256').update(String(b)).digest()
  return crypto.timingSafeEqual(x, y)
}
function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!verifyToken(token)) return res.status(401).json({ error: 'Please sign in again.' })
  next()
}

// Tiny in-memory rate limiter (per IP, per bucket)
const hits = new Map()
const rateLimit = (bucket, max, windowMs) => (req, res, next) => {
  const key = `${bucket}:${req.ip}`
  const now = Date.now()
  const entry = hits.get(key)
  if (!entry || entry.reset < now) hits.set(key, { count: 1, reset: now + windowMs })
  else if (++entry.count > max)
    return res.status(429).json({ error: 'Too many requests. Please wait a few minutes and try again.' })
  next()
}
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of hits) if (v.reset < now) hits.delete(k)
}, 60_000).unref()

// ---------- Validation helpers ----------
const KINDS = ['Landowner', 'Investor', 'Partnership', 'General']
const OWNERSHIP = ['Sole owner', 'Joint owner', 'Authorised representative', 'Other']
const ARRANGEMENTS = [
  'Discuss my options',
  'Completed residential unit',
  'Ownership interest',
  'Financial consideration',
  'Joint development',
]
const STATUSES = ['Proposed', 'Planning', 'Under construction', 'Completed']
const ENQUIRY_STATUSES = ['New', 'In review', 'Contacted', 'Closed']
const text = (v, max = 250) => String(v ?? '').trim().slice(0, max)

function sniff(buf) {
  if (buf.subarray(0, 5).toString() === '%PDF-') return { mime: 'application/pdf', ext: 'pdf' }
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { mime: 'image/jpeg', ext: 'jpg' }
  if (buf.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return { mime: 'image/png', ext: 'png' }
  if (buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP')
    return { mime: 'image/webp', ext: 'webp' }
  return null
}

const upload = (maxBytes) =>
  multer({ storage: multer.memoryStorage(), limits: { fileSize: maxBytes, files: 1, fields: 30 } })

const publicDev = (d) => ({
  id: d.id,
  name: d.name,
  slug: d.slug,
  location: d.location,
  description: d.description,
  type: d.type,
  status: d.status,
  illustrative: !!d.illustrative,
  units: d.units ?? null,
  image: d.image || null,
  imagePosition: d.imagePosition || 'center',
})

// ---------- App ----------
const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(compression())
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  next()
})
app.use(express.json({ limit: '200kb' }))

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'buildora', time: new Date().toISOString() }))

// Public: developments
app.get('/api/developments', (_req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=30')
  res.json(developments.list().map(publicDev))
})
app.get('/api/developments/:slug', (req, res) => {
  const d = developments.bySlug(req.params.slug)
  if (!d) return res.status(404).json({ error: 'Development not found' })
  res.json(publicDev(d))
})

// Public: summary figures drawn from the live portfolio (used by the animated counters)
app.get('/api/stats', (_req, res) => {
  const list = developments.list()
  res.json({
    developments: list.length,
    homes: list.reduce((s, d) => s + (Number(d.units) || 0), 0),
    regions: new Set(list.map((d) => d.location.split(',').pop().trim())).size,
    steps: 7,
  })
})

// Public: enquiries (with optional private land document for landowners)
app.post(
  '/api/enquiries',
  rateLimit('enquiry', 8, 15 * 60_000),
  (req, res, next) =>
    upload(3 * 1024 * 1024).single('document')(req, res, (err) => {
      if (err?.code === 'LIMIT_FILE_SIZE')
        return res.status(400).json({ error: 'Please upload a land document smaller than 3 MB.' })
      if (err) return res.status(400).json({ error: 'We could not read that upload. Please try again.' })
      next()
    }),
  async (req, res) => {
    const b = req.body || {}
    if (text(b.website)) return res.json({ success: true }) // honeypot
    const rawKind = text(b.kind)
    const kind = rawKind === 'General' ? text(b.enquiryType) || 'General' : rawKind
    const landAssessment = rawKind === 'Landowner'
    const fullName = text(b.fullName, 150)
    const email = text(b.email, 250).toLowerCase()
    const consent = b.consent === 'on' || b.consent === 'true' || b.consent === true

    if (!KINDS.includes(kind) || !fullName || !/^\S+@\S+\.\S+$/.test(email) || !consent)
      return res
        .status(400)
        .json({ error: 'Please enter your name, a valid email address and consent to processing.' })

    const plots = Number(text(b.plots))
    if (landAssessment && (!text(b.location) || !text(b.plotSize) || !Number.isInteger(plots) || plots < 1 || plots > 10000))
      return res.status(400).json({ error: 'Please complete the land location, size and number of plots.' })

    let document
    if (req.file && req.file.size > 0) {
      if (kind !== 'Landowner') return res.status(400).json({ error: 'Documents can only be attached to landowner enquiries.' })
      const type = sniff(req.file.buffer)
      if (!type || type.mime === 'image/webp')
        return res.status(400).json({ error: 'Please choose a valid PDF, JPG or PNG document.' })
      const stored = `${crypto.randomUUID()}.${type.ext}`
      fs.writeFileSync(path.join(DOCS_DIR, stored), req.file.buffer)
      document = { file: stored, mime: type.mime, size: req.file.size, name: `ownership-document.${type.ext}` }
    }

    const data = {
      kind,
      fullName,
      email,
      phone: text(b.phone, 50),
      message: text(b.message, 5000),
      consent: true,
      ...(landAssessment
        ? {
            location: text(b.location),
            plotSize: text(b.plotSize, 100),
            plots,
            ownership: OWNERSHIP.includes(text(b.ownership)) ? text(b.ownership) : 'Other',
            arrangement: ARRANGEMENTS.includes(text(b.arrangement)) ? text(b.arrangement) : 'Discuss my options',
          }
        : {}),
      ...(b.development ? { development: text(b.development, 120) } : {}),
      ...(document ? { document } : {}),
    }
    try {
      const e = await enquiries.create(data)
      res.status(201).json({ success: true, reference: e.reference })
    } catch (err) {
      console.error('enquiry save failed', err)
      res.status(500).json({ error: 'We could not save your enquiry. Please check the details and try again.' })
    }
  },
)

// Public media (development images uploaded by admins)
app.use('/media', express.static(MEDIA_DIR, { maxAge: '7d', fallthrough: false }))

// ---------- Admin ----------
app.post('/api/admin/login', rateLimit('login', 10, 15 * 60_000), (req, res) => {
  if (!ADMIN_PASSWORD)
    return res.status(503).json({ error: 'Admin access is not configured. Set ADMIN_PASSWORD on the server.' })
  const { email = '', password = '' } = req.body || {}
  if (!safeEqual(String(email).toLowerCase().trim(), ADMIN_EMAIL) || !safeEqual(password, ADMIN_PASSWORD))
    return res.status(401).json({ error: 'Incorrect email or password.' })
  res.json({ token: issueToken(), email: ADMIN_EMAIL })
})

const admin = express.Router()
admin.use(requireAdmin)

admin.get('/summary', (_req, res) => {
  const all = enquiries.list()
  const byKind = Object.fromEntries(KINDS.map((k) => [k, all.filter((e) => e.kind === k).length]))
  const byStatus = Object.fromEntries(ENQUIRY_STATUSES.map((s) => [s, all.filter((e) => e.status === s).length]))
  res.json({ enquiries: all.length, byKind, byStatus, developments: developments.list().length })
})

admin.get('/enquiries', (req, res) => {
  const { kind, status, q } = req.query
  let list = enquiries.list()
  if (kind && KINDS.includes(kind)) list = list.filter((e) => e.kind === kind)
  if (status && ENQUIRY_STATUSES.includes(status)) list = list.filter((e) => e.status === status)
  if (q) {
    const s = String(q).toLowerCase()
    list = list.filter((e) => [e.fullName, e.email, e.reference, e.location, e.message].some((v) => v?.toLowerCase().includes(s)))
  }
  res.json(list)
})

admin.patch('/enquiries/:id', async (req, res) => {
  const patch = {}
  if (req.body.status !== undefined) {
    if (!ENQUIRY_STATUSES.includes(req.body.status)) return res.status(400).json({ error: 'Unknown status.' })
    patch.status = req.body.status
  }
  if (req.body.notes !== undefined) patch.notes = text(req.body.notes, 5000)
  const e = await enquiries.update(req.params.id, patch)
  if (!e) return res.status(404).json({ error: 'Enquiry not found' })
  res.json(e)
})

admin.delete('/enquiries/:id', async (req, res) => {
  const e = await enquiries.remove(req.params.id)
  if (!e) return res.status(404).json({ error: 'Enquiry not found' })
  if (e.document?.file) fs.rm(path.join(DOCS_DIR, path.basename(e.document.file)), { force: true }, () => {})
  res.json({ success: true })
})

admin.get('/enquiries/:id/document', (req, res) => {
  const e = enquiries.byId(req.params.id)
  if (!e?.document) return res.status(404).json({ error: 'No document attached' })
  res.setHeader('Cache-Control', 'private, no-store')
  res.setHeader('Content-Type', e.document.mime)
  res.setHeader('Content-Disposition', `attachment; filename="${e.reference}-${e.document.name}"`)
  fs.createReadStream(path.join(DOCS_DIR, path.basename(e.document.file))).on('error', () => res.status(404).end()).pipe(res)
})

function readDevelopment(body, existing) {
  const name = text(body.name, 120)
  const location = text(body.location, 160)
  const description = text(body.description, 1200)
  const type = text(body.type, 80)
  const status = text(body.status)
  if (!name || !location || !description || !type) return { error: 'Name, location, type and description are required.' }
  if (!STATUSES.includes(status)) return { error: 'Choose a valid status.' }
  const units = body.units === '' || body.units == null ? null : Number(body.units)
  if (units !== null && (!Number.isInteger(units) || units < 1 || units > 100000))
    return { error: 'Units must be a whole number above zero.' }
  return {
    data: {
      name,
      slug: developments.uniqueSlug(text(body.slug, 80) || name, existing?.id),
      location,
      description,
      type,
      status,
      units,
      illustrative: body.illustrative === true || body.illustrative === 'true' || body.illustrative === 'on',
      imagePosition: text(body.imagePosition, 40) || existing?.imagePosition || 'center',
    },
  }
}
function saveImage(file) {
  const type = sniff(file.buffer)
  if (!type || type.mime === 'application/pdf') return { error: 'Images must be JPG, PNG or WEBP.' }
  const name = `${crypto.randomUUID()}.${type.ext}`
  fs.writeFileSync(path.join(MEDIA_DIR, name), file.buffer)
  return { url: `/media/${name}` }
}
const imageUpload = (req, res, next) =>
  upload(6 * 1024 * 1024).single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'Images must be under 6 MB.' : 'Upload failed.' })
    next()
  })

admin.post('/developments', imageUpload, async (req, res) => {
  const { data, error } = readDevelopment(req.body)
  if (error) return res.status(400).json({ error })
  if (req.file) {
    const img = saveImage(req.file)
    if (img.error) return res.status(400).json({ error: img.error })
    data.image = img.url
  } else data.image = text(req.body.image, 300) || '/images/buildora-community.webp'
  res.status(201).json(await developments.create(data))
})

admin.put('/developments/:id', imageUpload, async (req, res) => {
  const existing = developments.byId(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Development not found' })
  const { data, error } = readDevelopment(req.body, existing)
  if (error) return res.status(400).json({ error })
  if (req.file) {
    const img = saveImage(req.file)
    if (img.error) return res.status(400).json({ error: img.error })
    data.image = img.url
  }
  res.json(await developments.update(existing.id, data))
})

admin.delete('/developments/:id', async (req, res) => {
  const d = await developments.remove(req.params.id)
  if (!d) return res.status(404).json({ error: 'Development not found' })
  res.json({ success: true })
})

app.use('/api/admin', admin)
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }))

// ---------- Frontend (single-service deploy) ----------
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(
    express.static(FRONTEND_DIST, {
      index: false,
      setHeaders: (res, file) => {
        if (file.includes(`${path.sep}assets${path.sep}`)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      },
    }),
  )
  const indexHtml = path.join(FRONTEND_DIST, 'index.html')
  app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(indexHtml))
} else {
  app.get('/', (_req, res) => res.send('Buildora API is running. Build the frontend to serve the site from here.'))
}

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong.' })
})

app.listen(PORT, () => {
  console.log(`Buildora running on http://localhost:${PORT}  (data: ${DATA_DIR})`)
  if (!process.env.ADMIN_PASSWORD) console.warn(isProd ? 'ADMIN_PASSWORD not set — admin login disabled.' : 'Dev admin login: admin@buildora.co.za / buildora-admin')
})
