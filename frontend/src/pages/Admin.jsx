import { useCallback, useEffect, useState } from 'react'
import { api, clearApiCache, usePageMeta } from '../lib/api'
import { Icon, LogoMark } from '../components/brand'
import { APPLICATION_STATUSES, FIELDS } from '../../../shared/application.js'

const KEY = 'buildora-admin-token'
const field = 'mt-1.5 block w-full rounded-sm border border-forest/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest'
const ENQ_STATUSES = ['New', 'In review', 'Contacted', 'Closed']
const DEV_STATUSES = ['Proposed', 'Planning', 'Under construction', 'Completed']
const DETAIL_LABELS = {
  company: 'Company',
  category: 'Category',
  equipment: 'Machine / model',
  quantity: 'Quantity',
  condition: 'Condition',
  acquisition: 'Acquisition',
  timeline: 'Timeline',
  location: 'Location',
  projectType: 'Project type',
  size: 'Size',
  budget: 'Budget',
  stage: 'Stage',
}
const fmt = (d) => new Date(d).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })

export default function Admin() {
  usePageMeta('Admin')
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) || ''
    } catch {
      return ''
    }
  })
  const signOut = () => {
    try {
      sessionStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
    setToken('')
  }
  if (!token)
    return (
      <Login
        onToken={(t) => {
          try {
            sessionStorage.setItem(KEY, t)
          } catch {
            /* ignore */
          }
          setToken(t)
        }}
      />
    )
  return <Dashboard token={token} onSignOut={signOut} />
}

function Login({ onToken }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <main className="admin-shell grid min-h-screen place-items-center bg-forest px-6">
      <form
        className="w-full max-w-sm rounded bg-ivory p-8 shadow-2xl"
        onSubmit={async (e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          setBusy(true)
          setError('')
          try {
            const r = await api.post('/api/admin/login', { email: fd.get('email'), password: fd.get('password') })
            onToken(r.token)
          } catch (err) {
            setError(err.message)
          } finally {
            setBusy(false)
          }
        }}
      >
        <div className="mb-6 flex items-center gap-3 text-forest">
          <LogoMark size={26} />
          <span className="font-heading text-xl font-extrabold">
            BUILDORA<span className="text-gold">.</span> <span className="font-medium text-muted">Admin</span>
          </span>
        </div>
        <label className="block text-xs">
          Email
          <input name="email" type="email" required autoComplete="username" className={field} />
        </label>
        <label className="mt-4 block text-xs">
          Password
          <input name="password" type="password" required autoComplete="current-password" className={field} />
        </label>
        <button disabled={busy} className="motion-button mt-6 w-full rounded-sm bg-forest py-3 text-xs font-semibold text-white disabled:opacity-60">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <p role="alert" className="mt-3 min-h-5 text-xs text-red-700">
          {error}
        </p>
        <a href="/" className="text-[11px] text-muted hover:text-forest">
          ← Back to website
        </a>
      </form>
    </main>
  )
}

function Dashboard({ token, onSignOut }) {
  const [tab, setTab] = useState('applications')
  const [summary, setSummary] = useState(null)
  const auth = { token }
  const guard = useCallback(
    (err) => {
      if (err.status === 401) onSignOut()
      else throw err
    },
    [onSignOut],
  )
  const loadSummary = useCallback(() => api.get('/api/admin/summary', { token }).then(setSummary).catch(guard), [token, guard])
  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  return (
    <main className="admin-shell min-h-screen bg-[#f1efe7]">
      <header className="border-b border-forest/10 bg-forest text-white">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-6">
          <span className="flex items-center gap-3">
            <LogoMark size={22} />
            <span className="font-heading font-extrabold">
              BUILDORA<span className="text-gold">.</span> <span className="font-medium text-white/60">Admin</span>
            </span>
          </span>
          <span className="flex items-center gap-5 text-xs">
            <a href="/" target="_blank" rel="noopener" className="text-white/70 hover:text-gold">
              View site ↗
            </a>
            <button onClick={onSignOut} className="rounded-sm border border-white/25 px-3 py-1.5 hover:bg-white/10">
              Sign out
            </button>
          </span>
        </div>
      </header>
      <div className="mx-auto max-w-[1240px] px-6 py-8">
        {summary && (
          <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-6">
            {[
              ['Applications', summary.applications],
              ['New applications', summary.newApplications],
              ['All enquiries', summary.enquiries],
              ['Landowner', summary.byKind.Landowner],
              ['Investor', summary.byKind.Investor],
              ['Construction', summary.byKind.Construction],
            ].map(([k, v]) => (
              <div key={k} className="rounded bg-white p-4">
                <p className="text-[10px] uppercase tracking-[1.5px] text-muted">{k}</p>
                <p className="font-heading mt-1 text-2xl font-semibold">{v}</p>
              </div>
            ))}
          </div>
        )}
        <div className="mb-6 flex gap-2">
          {[
            ['applications', 'Applications'],
            ['enquiries', 'Enquiries'],
            ['developments', 'Developments'],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              aria-pressed={tab === k}
              className={`motion-filter rounded-full border px-5 py-2 text-xs ${tab === k ? 'border-forest bg-forest text-white' : 'border-forest/20 bg-white'}`}
            >
              {l}
            </button>
          ))}
        </div>
        {tab === 'applications' ? (
          <ApplicationsAdmin auth={auth} guard={guard} onChange={loadSummary} />
        ) : tab === 'enquiries' ? (
          <Enquiries auth={auth} guard={guard} onChange={loadSummary} />
        ) : (
          <DevelopmentsAdmin auth={auth} guard={guard} onChange={loadSummary} />
        )}
      </div>
    </main>
  )
}

function Enquiries({ auth, guard, onChange }) {
  const [list, setList] = useState([])
  const [filters, setFilters] = useState({ kind: '', status: '', q: '' })
  const [open, setOpen] = useState(null)
  const load = useCallback(() => {
    const qs = new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString()
    return api.get(`/api/admin/enquiries${qs ? `?${qs}` : ''}`, auth).then(setList).catch(guard)
  }, [filters, auth.token, guard]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    load()
  }, [load])

  const update = async (id, patch) => {
    const e = await api.patch(`/api/admin/enquiries/${id}`, patch, auth).catch(guard)
    if (e) {
      setList((l) => l.map((x) => (x.id === id ? e : x)))
      setOpen(e)
      onChange()
    }
  }
  const remove = async (id) => {
    if (!confirm('Delete this enquiry and any attached document? This cannot be undone.')) return
    await api.del(`/api/admin/enquiries/${id}`, auth).catch(guard)
    setOpen(null)
    load()
    onChange()
  }
  const download = async (e) => {
    const res = await fetch(`/api/admin/enquiries/${e.id}/document`, { headers: { authorization: `Bearer ${auth.token}` } })
    if (!res.ok) return alert('Document unavailable.')
    const url = URL.createObjectURL(await res.blob())
    const a = Object.assign(document.createElement('a'), { href: url, download: `${e.reference}-${e.document.name}` })
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 2000)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="rounded bg-white">
        <div className="grid gap-3 border-b border-forest/10 p-4 md:grid-cols-[1fr_160px_160px]">
          <input
            placeholder="Search name, email, reference…"
            className={`${field} mt-0`}
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
          <select className={`${field} mt-0`} value={filters.kind} onChange={(e) => setFilters({ ...filters, kind: e.target.value })}>
            <option value="">All types</option>
            {['Landowner', 'Investor', 'Construction', 'Equipment', 'Partnership', 'General'].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
          <select className={`${field} mt-0`} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All statuses</option>
            {ENQ_STATUSES.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>
        {list.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted">No enquiries yet.</p>
        ) : (
          <ul className="divide-y divide-forest/10">
            {list.map((e) => (
              <li key={e.id}>
                <button
                  onClick={() => setOpen(e)}
                  className={`flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors hover:bg-[#f6f3ec] ${open?.id === e.id ? 'bg-[#f6f3ec]' : ''}`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {e.fullName} {e.document && <Icon name="doc" className="inline h-3.5 w-3.5 text-gold" />}
                    </span>
                    <span className="block truncate text-[11px] text-muted">
                      {e.kind} · {e.email} · {fmt(e.createdAt)}
                    </span>
                  </span>
                  <StatusPill status={e.status} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <aside className="h-fit rounded bg-white p-6 lg:sticky lg:top-6">
        {!open ? (
          <p className="text-sm text-muted">Select an enquiry to see the details.</p>
        ) : (
          <div>
            <p className="text-[10px] uppercase tracking-[1.5px] text-muted">
              {open.reference} · {open.kind}
            </p>
            <h2 className="font-heading mt-1 text-xl font-semibold">{open.fullName}</h2>
            <dl className="mt-4 grid grid-cols-[110px_1fr] gap-y-2 text-xs">
              {[
                ['Email', <a key="e" className="underline" href={`mailto:${open.email}`}>{open.email}</a>],
                ['Phone', open.phone || '—'],
                ['Received', fmt(open.createdAt)],
                open.development && ['Development', open.development],
                open.location && ['Land location', open.location],
                open.plotSize && ['Plot size', open.plotSize],
                open.plots && ['Plots', open.plots],
                open.ownership && ['Ownership', open.ownership],
                open.arrangement && ['Arrangement', open.arrangement],
                ...Object.entries(open.details || {})
                  .filter(([, v]) => v !== '' && v != null)
                  .map(([k, v]) => [DETAIL_LABELS[k] || k, v]),
              ]
                .filter(Boolean)
                .map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
            </dl>
            {open.message && <p className="mt-4 whitespace-pre-wrap rounded bg-[#f6f3ec] p-3 text-xs leading-6">{open.message}</p>}
            {open.document && (
              <button onClick={() => download(open)} className="mt-4 inline-flex items-center gap-2 rounded-sm border border-forest/20 px-3 py-2 text-xs hover:bg-forest/5">
                <Icon name="doc" className="h-4 w-4" /> Download ownership document ({Math.round(open.document.size / 1024)} KB)
              </button>
            )}
            <label className="mt-5 block text-xs">
              Status
              <select className={field} value={open.status} onChange={(e) => update(open.id, { status: e.target.value })}>
                {ENQ_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <NotesField key={open.id} value={open.notes} onSave={(notes) => update(open.id, { notes })} />
            <button onClick={() => remove(open.id)} className="mt-6 text-xs text-red-700 hover:underline">
              Delete enquiry
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}

function NotesField({ value, onSave }) {
  const [v, setV] = useState(value || '')
  return (
    <label className="mt-4 block text-xs">
      Internal notes
      <textarea className={field} rows={4} value={v} onChange={(e) => setV(e.target.value)} />
      <button
        type="button"
        disabled={v === (value || '')}
        onClick={() => onSave(v)}
        className="mt-2 rounded-sm bg-forest px-3 py-1.5 text-[11px] text-white disabled:opacity-40"
      >
        Save notes
      </button>
    </label>
  )
}

function StatusPill({ status }) {
  const tone = {
    New: 'bg-gold/20 text-[#7a5a2b]',
    'In review': 'bg-sage/30 text-forest',
    Contacted: 'bg-forest/10 text-forest',
    Closed: 'bg-black/5 text-muted',
  }[status]
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${tone}`}>{status}</span>
}

const emptyDev = { name: '', location: '', type: '', status: 'Proposed', units: '', description: '', illustrative: true, imagePosition: 'center' }

function DevelopmentsAdmin({ auth, guard, onChange }) {
  const [list, setList] = useState([])
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const load = useCallback(() => api.get('/api/developments').then(setList), [])
  useEffect(() => {
    load()
  }, [load])

  const save = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('illustrative', fd.get('illustrative') ? 'true' : 'false')
    const img = fd.get('image')
    if (img instanceof File && img.size === 0) fd.delete('image')
    setBusy(true)
    setError('')
    try {
      if (editing.id) await api.put(`/api/admin/developments/${editing.id}`, fd, auth)
      else await api.post('/api/admin/developments', fd, auth)
      clearApiCache()
      setEditing(null)
      load()
      onChange()
    } catch (err) {
      if (err.status === 401) guard(err)
      else setError(err.message)
    } finally {
      setBusy(false)
    }
  }
  const remove = async (d) => {
    if (!confirm(`Delete “${d.name}” from the website? This cannot be undone.`)) return
    await api.del(`/api/admin/developments/${d.id}`, auth).catch(guard)
    clearApiCache()
    load()
    onChange()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="rounded bg-white">
        <div className="flex items-center justify-between border-b border-forest/10 p-4">
          <p className="text-sm font-medium">{list.length} developments</p>
          <button onClick={() => setEditing({ ...emptyDev })} className="rounded-sm bg-forest px-4 py-2 text-xs font-medium text-white">
            + Add development
          </button>
        </div>
        <ul className="divide-y divide-forest/10">
          {list.map((d) => (
            <li key={d.id} className="flex items-center gap-4 px-4 py-3">
              <img src={d.image} alt="" className="h-12 w-16 shrink-0 rounded-sm object-cover" style={{ objectPosition: d.imagePosition }} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{d.name}</span>
                <span className="block truncate text-[11px] text-muted">
                  {d.location} · {d.status}
                  {d.illustrative ? ' · Illustrative' : ''}
                </span>
              </span>
              <button onClick={() => setEditing(d)} className="text-xs underline">
                Edit
              </button>
              <button onClick={() => remove(d)} className="text-xs text-red-700">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <aside className="h-fit rounded bg-white p-6 lg:sticky lg:top-6">
        {!editing ? (
          <p className="text-sm text-muted">Choose a development to edit, or add a new one.</p>
        ) : (
          <form key={editing.id || 'new'} onSubmit={save} className="grid gap-4">
            <h2 className="font-heading text-lg font-semibold">{editing.id ? 'Edit development' : 'New development'}</h2>
            {[
              ['Name', 'name'],
              ['Location (e.g. Midrand, Gauteng)', 'location'],
              ['Type', 'type'],
            ].map(([l, n]) => (
              <label key={n} className="text-xs">
                {l} *
                <input name={n} required defaultValue={editing[n]} className={field} />
              </label>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs">
                Status
                <select name="status" defaultValue={editing.status} className={field}>
                  {DEV_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs">
                Homes
                <input name="units" type="number" min="1" defaultValue={editing.units ?? ''} className={field} />
              </label>
            </div>
            <label className="text-xs">
              Description *
              <textarea name="description" required rows={4} defaultValue={editing.description} className={field} />
            </label>
            <label className="text-xs">
              Image (JPG, PNG or WEBP, up to 6 MB)
              <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className={field} />
            </label>
            <label className="text-xs">
              Image focus (CSS object-position)
              <input name="imagePosition" defaultValue={editing.imagePosition || 'center'} className={field} />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" name="illustrative" defaultChecked={editing.illustrative} className="accent-forest" />
              Illustrative concept (not an active offer)
            </label>
            <p role="alert" className="min-h-4 text-xs text-red-700">
              {error}
            </p>
            <div className="flex gap-3">
              <button disabled={busy} className="rounded-sm bg-forest px-5 py-2.5 text-xs font-medium text-white disabled:opacity-60">
                {busy ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={() => setEditing(null)} className="rounded-sm border border-forest/20 px-5 py-2.5 text-xs">
                Cancel
              </button>
            </div>
          </form>
        )}
      </aside>
    </div>
  )
}

function ApplicationsAdmin({ auth, guard, onChange }) {
  const [list, setList] = useState([])
  const [filters, setFilters] = useState({ status: '', type: '', country: '', q: '' })
  const [open, setOpen] = useState(null)
  const load = useCallback(() => {
    const qs = new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString()
    return api.get(`/api/admin/applications${qs ? `?${qs}` : ''}`, auth).then(setList).catch(guard)
  }, [filters, auth.token, guard]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    load()
  }, [load])

  const openApp = (id) => api.get(`/api/admin/applications/${id}`, auth).then(setOpen).catch(guard)
  const update = async (patch) => {
    const r = await api.patch(`/api/admin/applications/${open.id}`, patch, auth).catch(guard)
    if (r) {
      await openApp(open.id)
      load()
      onChange()
    }
  }
  const remove = async () => {
    if (!confirm(`Delete application ${open.reference} and all its documents? This cannot be undone.`)) return
    await api.del(`/api/admin/applications/${open.id}`, auth).catch(guard)
    setOpen(null)
    load()
    onChange()
  }
  const download = async (field) => {
    const res = await fetch(`/api/admin/applications/${open.id}/documents/${field}`, { headers: { authorization: `Bearer ${auth.token}` } })
    if (!res.ok) return alert('Document unavailable.')
    const d = open.documents[field]
    const url = URL.createObjectURL(await res.blob())
    const a = Object.assign(document.createElement('a'), { href: url, download: `${open.reference}-${d.file}` })
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 2000)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
      <div className="h-fit rounded bg-white">
        <div className="grid gap-3 border-b border-forest/10 p-4 sm:grid-cols-2">
          <input
            placeholder="Search name, reference, ID, phone…"
            className={`${field} mt-0 sm:col-span-2`}
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
          <select className={`${field} mt-0`} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <select className={`${field} mt-0`} value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
              <option value="">All types</option>
              {['Land', 'Funds', 'Labour'].map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
            <select className={`${field} mt-0`} value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })}>
              <option value="">Both countries</option>
              {['Zambia', 'South Africa'].map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>
        {list.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted">No applications yet.</p>
        ) : (
          <ul className="divide-y divide-forest/10">
            {list.map((a) => (
              <li key={a.id}>
                <button
                  onClick={() => openApp(a.id)}
                  className={`flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors hover:bg-[#f6f3ec] ${open?.id === a.id ? 'bg-[#f6f3ec]' : ''}`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{a.names}</span>
                    <span className="block truncate text-[11px] text-muted">
                      {a.reference} · {a.type} · {a.country} · {fmt(a.createdAt)}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-forest/8 px-2.5 py-1 text-[10px] font-medium">{a.status}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <aside className="rounded bg-white p-6">
        {!open ? (
          <p className="text-sm text-muted">Select an application to review it.</p>
        ) : (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[1.5px] text-muted">
                  {open.reference} · Investor – {open.values.type} · {open.values.country}
                </p>
                <h2 className="font-heading mt-1 text-xl font-semibold">{open.values.names}</h2>
                <p className="text-xs text-muted">Submitted {fmt(open.createdAt)}</p>
              </div>
              <label className="text-xs">
                Status
                <select className={`${field} min-w-52`} value={open.status} onChange={(e) => update({ status: e.target.value })}>
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>

            <ol className="mt-4 flex flex-wrap gap-2 text-[10px]">
              {(open.history || []).map((h, i) => (
                <li key={i} className="rounded-full bg-[#f6f3ec] px-3 py-1">
                  {h.status} · {new Date(h.at).toLocaleDateString('en-ZA')}
                </li>
              ))}
            </ol>

            <h3 className="font-heading mt-6 text-sm font-semibold">Documents</h3>
            <ul className="mt-2 grid gap-2">
              {Object.entries(open.documents || {}).map(([k, d]) => (
                <li key={k}>
                  <button onClick={() => download(k)} className="flex w-full items-center gap-3 rounded border border-forest/15 px-3 py-2 text-left text-xs hover:bg-forest/5">
                    <Icon name="doc" className="h-4 w-4 text-gold" />
                    <span className="flex-1">{FIELDS[k]?.label || k}</span>
                    <span className="text-muted">{Math.max(1, Math.round(d.size / 1024))} KB ↓</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-3">
              {open.sections.map(([title, rows], i) => (
                <details key={title} open={i < 2} className="rounded border border-forest/12">
                  <summary className="cursor-pointer bg-[#f6f3ec] px-4 py-2.5 text-sm font-semibold">
                    {i + 1}. {title}
                  </summary>
                  <dl className="text-xs">
                    {rows.map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[1fr_1.2fr] gap-3 border-t border-forest/8 px-4 py-2">
                        <dt className="text-muted">{k}</dt>
                        <dd className="break-words">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              ))}
              <details className="rounded border border-forest/12">
                <summary className="cursor-pointer bg-[#f6f3ec] px-4 py-2.5 text-sm font-semibold">7. Declarations & signature</summary>
                <dl className="text-xs">
                  {open.declarations.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[1fr_auto] gap-3 border-t border-forest/8 px-4 py-2">
                      <dt className="text-muted">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            </div>

            <NotesField key={open.id} value={open.notes} onSave={(notes) => update({ notes })} />
            <button onClick={remove} className="mt-6 text-xs text-red-700 hover:underline">
              Delete application
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
