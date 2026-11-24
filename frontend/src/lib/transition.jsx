import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const TransitionContext = createContext({ go: () => {}, state: 'idle' })
export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Cinematic route changes: a forest curtain covers the page, the route swaps, the curtain lifts. */
export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [state, setState] = useState('idle')
  const [label, setLabel] = useState('')
  const busy = useRef(false)

  const go = useCallback(
    (href, title = '') => {
      const url = new URL(href, window.location.origin)
      const same = url.pathname === location.pathname && url.search === location.search
      if (same) {
        window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' })
        return
      }
      if (reducedMotion() || busy.current) {
        navigate(url.pathname + url.search + url.hash)
        window.scrollTo(0, 0)
        return
      }
      busy.current = true
      setLabel(title)
      setState('cover')
      window.setTimeout(() => {
        navigate(url.pathname + url.search + url.hash)
        window.scrollTo(0, 0)
        setState('reveal')
        window.setTimeout(() => {
          setState('idle')
          busy.current = false
        }, 820)
      }, 500)
    },
    [location.pathname, location.search, navigate],
  )

  return (
    <TransitionContext.Provider value={{ go, state }}>
      {children}
      <div className="page-curtain" data-state={state} aria-hidden="true">
        <span className="curtain-label font-heading text-sm font-semibold tracking-[3px] text-ivory/80 uppercase">
          {label}
        </span>
      </div>
    </TransitionContext.Provider>
  )
}

export const usePageTransition = () => useContext(TransitionContext)

/** Drop-in <a> that routes internally through the page transition. */
export function TLink({ href, children, onClick, label, ...rest }) {
  const { go } = usePageTransition()
  const external = /^(https?:|mailto:|tel:)/.test(href)
  return (
    <a
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || external || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        go(href, label ?? (typeof children === 'string' ? children : ''))
      }}
    >
      {children}
    </a>
  )
}
