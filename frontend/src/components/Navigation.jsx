import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Logo, Icon } from './brand'
import { TLink } from '../lib/transition'

export const links = [
  ['Home', '/'],
  ['About Us', '/about'],
  ['Our Developments', '/developments'],
  ['Landowners', '/landowners'],
  ['Investors', '/investors'],
  ['How It Works', '/how-it-works'],
  ['Contact', '/contact'],
]

export function Navigation() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const toggle = useRef(null)
  const nav = useRef(null)
  const indicator = useRef(null)
  const section = '/' + (pathname.split('/')[1] || '')

  useEffect(() => setOpen(false), [pathname])

  // Condense on scroll; hide when scrolling down, reveal when scrolling up.
  useEffect(() => {
    let last = window.scrollY
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      setScrolled(y > 24)
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 320)
        last = y
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Slide the gold dot to the active link.
  useLayoutEffect(() => {
    const place = () => {
      const active = nav.current?.querySelector('[aria-current="page"]')
      const dot = indicator.current
      if (!dot) return
      if (!active) return dot.style.setProperty('--o', 0)
      const n = nav.current.getBoundingClientRect()
      const a = active.getBoundingClientRect()
      dot.style.setProperty('--x', `${a.left - n.left + a.width / 2 - 2}px`)
      dot.style.setProperty('--o', 1)
    }
    place()
    document.fonts?.ready.then(place)
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [section])

  return (
    <header
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          setOpen(false)
          toggle.current?.focus()
        }
      }}
      data-scrolled={scrolled || open}
      data-hidden={hidden && !open}
      className="site-header z-40 border-b border-forest/10 bg-ivory"
    >
      <div className="mx-auto flex h-[88px] max-w-[1360px] items-center justify-between gap-6 px-6 md:px-10">
        <Logo />
        <nav ref={nav} aria-label="Main navigation" className="relative hidden items-center gap-6 xl:flex">
          {links.map(([label, href]) => (
            <TLink
              key={href}
              href={href}
              aria-current={section === href ? 'page' : undefined}
              className={`motion-nav-link relative py-[35px] text-[11px] font-medium transition hover:text-gold ${
                section === href ? 'text-forest' : 'text-muted'
              }`}
            >
              {label}
            </TLink>
          ))}
          <span ref={indicator} className="nav-indicator" aria-hidden="true" />
        </nav>
        <TLink
          href="/contact"
          label="Contact"
          data-magnetic
          className="motion-button ml-auto hidden items-center gap-5 rounded-[3px] bg-forest px-5 py-3.5 text-[11px] font-medium text-white hover:bg-forest/90 sm:flex xl:ml-0"
        >
          Partner With Buildora
          <Icon className="h-3.5 w-3.5" />
        </TLink>
        <button
          ref={toggle}
          aria-controls="buildora-mobile-menu"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center text-forest xl:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span className="menu-toggle" data-open={open} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>
      <nav
        id="buildora-mobile-menu"
        data-open={open}
        inert={!open ? '' : undefined}
        aria-hidden={!open}
        aria-label="Mobile navigation"
        className="motion-menu absolute left-0 top-full w-full border-b border-forest/20 bg-ivory px-6 pb-6 shadow-lg xl:hidden"
      >
        {links.map(([label, href]) => (
          <TLink
            onClick={() => setOpen(false)}
            key={href}
            href={href}
            aria-current={section === href ? 'page' : undefined}
            className={`flex items-center justify-between border-t border-forest/10 py-3 text-sm ${section === href ? 'font-semibold' : ''}`}
          >
            {label}
            {section === href && <span className="h-1 w-1 rounded-full bg-gold" />}
          </TLink>
        ))}
      </nav>
    </header>
  )
}
