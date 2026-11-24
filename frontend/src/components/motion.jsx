import { useEffect, useRef, useState } from 'react'
import { LogoMark } from './brand'

const mq = (q) => window.matchMedia(q)
const REDUCED = '(prefers-reduced-motion: reduce)'
const PRECISE = '(min-width: 1024px) and (hover: hover) and (pointer: fine)'

/**
 * Scroll reveals, magnetic buttons, 3D card tilt, panel spotlights and hero parallax.
 * Content stays fully visible when JavaScript or motion is unavailable.
 */
export function MotionScene({ children }) {
  const root = useRef(null)

  useEffect(() => {
    const scene = root.current
    if (!scene) return
    const reduced = mq(REDUCED)
    const precise = mq(PRECISE)
    let observer
    let frame = 0
    let magnetic = null
    let tilted = null

    const resetMagnet = () => {
      cancelAnimationFrame(frame)
      magnetic?.style.removeProperty('--magnet-x')
      magnetic?.style.removeProperty('--magnet-y')
      magnetic = null
    }
    const resetTilt = () => {
      tilted?.style.removeProperty('--tilt-x')
      tilted?.style.removeProperty('--tilt-y')
      tilted = null
    }
    const setupReveals = () => {
      observer?.disconnect()
      const elements = scene.querySelectorAll('[data-reveal]')
      elements.forEach((el) => el.removeAttribute('data-motion-state'))
      if (reduced.matches || !('IntersectionObserver' in window)) return
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach(({ target, isIntersecting }) => {
            if (!isIntersecting) return
            target.setAttribute('data-motion-state', 'visible')
            observer?.unobserve(target)
          }),
        { threshold: 0, rootMargin: '0px 0px -40px 0px' },
      )
      elements.forEach((el) => {
        if (el.closest('[data-hero]')) return
        if (el.getBoundingClientRect().bottom < 0) return
        el.setAttribute('data-motion-state', 'pending')
        observer.observe(el)
      })
    }
    // Re-scan when async content (e.g. developments) mounts new [data-reveal] nodes
    const mutation = new MutationObserver((records) => {
      if (reduced.matches || !observer) return
      records.forEach((r) =>
        r.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return
          const found = [...(n.matches('[data-reveal]') ? [n] : []), ...n.querySelectorAll('[data-reveal]')]
          found.forEach((el) => {
            if (el.hasAttribute('data-motion-state') || el.closest('[data-hero]')) return
            el.setAttribute('data-motion-state', 'pending')
            observer.observe(el)
          })
        }),
      )
    })
    mutation.observe(scene, { childList: true, subtree: true })

    const pointerMove = (event) => {
      if (reduced.matches || !precise.matches || event.pointerType !== 'mouse') return
      const t = event.target instanceof Element ? event.target : null

      const target = t?.closest('[data-magnetic]')
      if (target !== magnetic) resetMagnet()
      if (target) {
        magnetic = target
        const r = target.getBoundingClientRect()
        const x = Math.max(-5, Math.min(5, (event.clientX - r.left - r.width / 2) * 0.07))
        const y = Math.max(-3, Math.min(3, (event.clientY - r.top - r.height / 2) * 0.09))
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => {
          target.style.setProperty('--magnet-x', `${x}px`)
          target.style.setProperty('--magnet-y', `${y}px`)
        })
      }

      const card = t?.closest('.project-card')
      if (card !== tilted) resetTilt()
      if (card) {
        tilted = card
        const media = card.firstElementChild
        const r = media.getBoundingClientRect()
        const px = (event.clientX - r.left) / r.width
        const py = (event.clientY - r.top) / r.height
        card.style.setProperty('--tilt-x', `${(0.5 - py) * 5}deg`)
        card.style.setProperty('--tilt-y', `${(px - 0.5) * 6}deg`)
        card.style.setProperty('--sx', `${px * 100}%`)
        card.style.setProperty('--sy', `${py * 100}%`)
      }

      const panel = t?.closest('.partner-panel')
      if (panel) {
        const r = panel.getBoundingClientRect()
        panel.style.setProperty('--mx', `${event.clientX - r.left}px`)
        panel.style.setProperty('--my', `${event.clientY - r.top}px`)
      }

      const hero = t?.closest('[data-hero]')
      const plane = scene.querySelector('.hero-tilt')
      if (plane) {
        if (hero) {
          const r = hero.getBoundingClientRect()
          plane.style.setProperty('--px', `${((event.clientX - r.left) / r.width - 0.5) * -14}px`)
          plane.style.setProperty('--py', `${((event.clientY - r.top) / r.height - 0.5) * -10}px`)
        } else {
          plane.style.removeProperty('--px')
          plane.style.removeProperty('--py')
        }
      }
    }
    const preferenceChanged = () => {
      resetMagnet()
      resetTilt()
      setupReveals()
    }
    setupReveals()
    scene.addEventListener('pointermove', pointerMove, { passive: true })
    scene.addEventListener('pointerleave', resetMagnet)
    scene.addEventListener('focusin', resetMagnet)
    reduced.addEventListener('change', preferenceChanged)
    precise.addEventListener('change', resetMagnet)
    return () => {
      observer?.disconnect()
      mutation.disconnect()
      resetMagnet()
      resetTilt()
      scene.removeEventListener('pointermove', pointerMove)
      scene.removeEventListener('pointerleave', resetMagnet)
      scene.removeEventListener('focusin', resetMagnet)
      reduced.removeEventListener('change', preferenceChanged)
      precise.removeEventListener('change', resetMagnet)
    }
  }, [])

  return (
    <div ref={root} className="motion-scene">
      {children}
    </div>
  )
}

/** Gold hairline showing reading progress. */
export function ScrollProgress() {
  const bar = useRef(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar.current?.style.setProperty('--progress', max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return <div ref={bar} className="scroll-progress" aria-hidden="true" />
}

/** Subtle follower ring for precise pointers; grows over interactive elements. */
export function CursorRing() {
  const ring = useRef(null)
  useEffect(() => {
    if (mq(REDUCED).matches || !mq(PRECISE).matches) return
    const el = ring.current
    let raf = 0
    let x = -100
    let y = -100
    const move = (e) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      el.dataset.visible = 'true'
      el.dataset.active = e.target instanceof Element && e.target.closest('a,button,select,label,[data-magnetic],.project-card') ? 'true' : 'false'
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          el.style.setProperty('--cx', `${x}px`)
          el.style.setProperty('--cy', `${y}px`)
        })
    }
    const leave = () => (el.dataset.visible = 'false')
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [])
  return <div ref={ring} className="cursor-ring" aria-hidden="true" />
}

/** Brand intro on the first visit of a session — never blocks for longer than ~1.7s. */
export function IntroLoader() {
  const [state, setState] = useState(() => {
    try {
      if (mq(REDUCED).matches || sessionStorage.getItem('buildora-intro')) return 'done'
    } catch {
      /* storage unavailable */
    }
    return 'showing'
  })
  const showing = useRef(state === 'showing').current
  useEffect(() => {
    if (!showing) return
    document.documentElement.style.overflow = 'hidden'
    const t1 = setTimeout(() => setState('leaving'), 1550)
    const t2 = setTimeout(() => {
      setState('done')
      document.documentElement.style.overflow = ''
      try {
        sessionStorage.setItem('buildora-intro', '1')
      } catch {
        /* ignore */
      }
    }, 2450)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      document.documentElement.style.overflow = ''
    }
  }, [showing])
  if (state === 'done') return null
  return (
    <div className="intro-loader" data-state={state} aria-hidden="true">
      <div className="flex flex-col items-center gap-6">
        <span className="intro-mark text-ivory" style={{ '--len': 140 }}>
          <LogoMark size={58} />
        </span>
        <span className="intro-word font-heading text-[34px] font-extrabold tracking-[-1.4px]">
          <span>
            BUILDORA<span className="text-gold">.</span>
          </span>
        </span>
        <span className="intro-bar">
          <span />
        </span>
        <span className="intro-tag text-[10px] uppercase tracking-[3px] text-white/55">Land. People. Possibility.</span>
      </div>
    </div>
  )
}

/** Counts up once when scrolled into view. */
export function Counter({ value = 0, suffix = '', duration = 1800 }) {
  const el = useRef(null)
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const node = el.current
    if (!node) return
    if (mq(REDUCED).matches || !('IntersectionObserver' in window)) {
      setShown(value)
      return
    }
    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration)
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
          setShown(Math.round(value * eased))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(node)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration])
  return (
    <span ref={el} className="stat-figure" aria-label={`${value}${suffix}`}>
      {shown}
      {suffix}
    </span>
  )
}
