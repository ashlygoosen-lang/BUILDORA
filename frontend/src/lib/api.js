import { useEffect, useState } from 'react'

async function request(path, { token, ...opts } = {}) {
  const headers = { ...(opts.headers || {}) }
  if (token) headers.authorization = `Bearer ${token}`
  if (opts.body && !(opts.body instanceof FormData) && typeof opts.body !== 'string') {
    headers['content-type'] = 'application/json'
    opts.body = JSON.stringify(opts.body)
  }
  const res = await fetch(path, { ...opts, headers })
  const data = res.headers.get('content-type')?.includes('json') ? await res.json() : null
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}
export const api = {
  get: (p, o) => request(p, o),
  post: (p, body, o) => request(p, { ...o, method: 'POST', body }),
  put: (p, body, o) => request(p, { ...o, method: 'PUT', body }),
  patch: (p, body, o) => request(p, { ...o, method: 'PATCH', body }),
  del: (p, o) => request(p, { ...o, method: 'DELETE' }),
}

const cache = new Map()
/** Small cached GET hook (data is shared between pages for instant transitions). */
export function useApi(path) {
  const [state, setState] = useState(() => ({ data: cache.get(path), error: null, loading: !cache.has(path) }))
  useEffect(() => {
    let live = true
    if (!path) return
    api
      .get(path)
      .then((data) => {
        cache.set(path, data)
        if (live) setState({ data, error: null, loading: false })
      })
      .catch((error) => live && setState({ data: null, error, loading: false }))
    return () => {
      live = false
    }
  }, [path])
  return state
}
export const clearApiCache = () => cache.clear()

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — BUILDORA` : 'BUILDORA — Building Better Communities, Together'
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
