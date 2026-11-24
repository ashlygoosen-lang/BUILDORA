import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { seedDevelopments } from './seed.js'

const here = path.dirname(fileURLToPath(import.meta.url))

// On Railway, mount a volume and set DATA_DIR (e.g. /data) so records survive redeploys.
export const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(here, '..', 'data'))
export const DOCS_DIR = path.join(DATA_DIR, 'land-documents') // private, staff only
export const MEDIA_DIR = path.join(DATA_DIR, 'media') // public development images
export const APP_DOCS_DIR = path.join(DATA_DIR, 'application-documents') // private, staff only
const DB_FILE = path.join(DATA_DIR, 'db.json')

for (const dir of [DATA_DIR, DOCS_DIR, MEDIA_DIR, APP_DOCS_DIR]) fs.mkdirSync(dir, { recursive: true })

let db
function load() {
  if (fs.existsSync(DB_FILE)) {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
  } else {
    const now = new Date().toISOString()
    db = {
      developments: seedDevelopments.map((d, i) => ({
        id: crypto.randomUUID(),
        ...d,
        createdAt: new Date(Date.parse(now) + i).toISOString(),
        updatedAt: now,
      })),
      enquiries: [],
      applications: [],
    }
    persist()
  }
  db.developments ??= []
  db.enquiries ??= []
  db.applications ??= []
}

let writing = Promise.resolve()
function persist() {
  // Serialised, atomic writes: write to a temp file then rename over the original.
  const snapshot = JSON.stringify(db, null, 2)
  writing = writing.then(() => {
    const tmp = `${DB_FILE}.${process.pid}.tmp`
    fs.writeFileSync(tmp, snapshot)
    fs.renameSync(tmp, DB_FILE)
  })
  return writing
}

load()

export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

export const developments = {
  list: () => [...db.developments].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  bySlug: (slug) => db.developments.find((d) => d.slug === slug),
  byId: (id) => db.developments.find((d) => d.id === id),
  uniqueSlug(name, ignoreId) {
    const base = slugify(name) || 'development'
    let slug = base
    let n = 2
    while (db.developments.some((d) => d.slug === slug && d.id !== ignoreId)) slug = `${base}-${n++}`
    return slug
  },
  async create(data) {
    const now = new Date().toISOString()
    const doc = { id: crypto.randomUUID(), ...data, createdAt: now, updatedAt: now }
    db.developments.push(doc)
    await persist()
    return doc
  },
  async update(id, data) {
    const doc = this.byId(id)
    if (!doc) return null
    Object.assign(doc, data, { updatedAt: new Date().toISOString() })
    await persist()
    return doc
  },
  async remove(id) {
    const i = db.developments.findIndex((d) => d.id === id)
    if (i < 0) return null
    const [doc] = db.developments.splice(i, 1)
    await persist()
    return doc
  },
}

export const enquiries = {
  list: () => [...db.enquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  byId: (id) => db.enquiries.find((e) => e.id === id),
  async create(data) {
    const now = new Date().toISOString()
    const doc = {
      id: crypto.randomUUID(),
      reference: `BLD-${now.slice(2, 10).replace(/-/g, '')}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
      status: 'New',
      notes: '',
      ...data,
      createdAt: now,
      updatedAt: now,
    }
    db.enquiries.push(doc)
    await persist()
    return doc
  },
  async update(id, data) {
    const doc = this.byId(id)
    if (!doc) return null
    Object.assign(doc, data, { updatedAt: new Date().toISOString() })
    await persist()
    return doc
  },
  async remove(id) {
    const i = db.enquiries.findIndex((e) => e.id === id)
    if (i < 0) return null
    const [doc] = db.enquiries.splice(i, 1)
    await persist()
    return doc
  },
}

export const applications = {
  list: () => [...db.applications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  byId: (id) => db.applications.find((a) => a.id === id),
  async create(doc) {
    const now = new Date().toISOString()
    const full = { status: 'Submitted', notes: '', history: [{ status: 'Submitted', at: now }], ...doc, createdAt: now, updatedAt: now }
    db.applications.push(full)
    await persist()
    return full
  },
  async update(id, data) {
    const doc = this.byId(id)
    if (!doc) return null
    const now = new Date().toISOString()
    if (data.status && data.status !== doc.status) doc.history = [...(doc.history || []), { status: data.status, at: now }]
    Object.assign(doc, data, { updatedAt: now })
    await persist()
    return doc
  },
  async remove(id) {
    const i = db.applications.findIndex((a) => a.id === id)
    if (i < 0) return null
    const [doc] = db.applications.splice(i, 1)
    await persist()
    return doc
  },
}
