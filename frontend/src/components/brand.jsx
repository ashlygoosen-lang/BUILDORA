import { Children, Fragment, isValidElement, cloneElement } from 'react'
import { TLink } from '../lib/transition'

export function Icon({ name = 'arrow', className = '' }) {
  const paths = {
    arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
    diagonal: <path d="M5 19 19 5M5 5h14v14" />,
    land: <path d="m3 9 9-5 9 5-9 5-9-5Zm0 5 9 5 9-5M3 18l9 5 9-5" />,
    building: <path d="M5 21V7l8-4v18M13 9h6v12M3 21h19M8 9v1m0 3v1m0 3v1m8-5v1m0 3v1" />,
    people: (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21v-4a6 6 0 0 1 12 0v4M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5v2" />
      </>
    ),
    leaf: <path d="M20 3C8 2 2 9 6 16c7 5 15-1 14-13ZM4 21 16 8" />,
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    check: <path d="m5 12 5 5L20 7" />,
    doc: <path d="M14 3H6v18h12V7l-4-4Zm0 0v4h4M9 13h6m-6 4h6" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    excavator: (
      <>
        <path d="M2 19h11M3 19a2 2 0 0 1 2-2h6a2 2 0 0 1 0 4H5a2 2 0 0 1-2-2Z" />
        <path d="M5 17v-4h5l1 4M7 13V9h3l1 4" />
        <path d="m11 10 5-5 4 4-2 3h-3" />
      </>
    ),
    crane: <path d="M6 21V4m0 0h14M6 4l-3 3h3M6 8l4-4m-4 8 8-8m-8 12 12-12M18 4v5m-1 0h2v3h-2zM3 21h7" />,
    truck: (
      <>
        <path d="M2 16V7h11v9M13 10h4l4 4v2h-2M2 16h2" />
        <circle cx="6.5" cy="17" r="2" />
        <circle cx="16.5" cy="17" r="2" />
        <path d="M9 17h5" />
      </>
    ),
    mixer: (
      <>
        <path d="M3 16V9h4l2 2v5M9 11l9-3 3 4-2 4H9" />
        <circle cx="6" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </>
    ),
    beam: <path d="M3 5h18M3 19h18M12 5v14M7 5v3m10-3v3M7 19v-3m10 3v-3" />,
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
    search: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-4.5-4.5" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
      </>
    ),
    wrench: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6Z" />,
    chevron: <path d="m6 9 6 6 6-6" />,
  }
  return (
    <svg
      className={`h-5 w-5 shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.arrow}
    </svg>
  )
}

export function LogoMark({ size = 33 }) {
  return (
    <svg width={size} height={(size * 38) / 33} viewBox="0 0 33 38" fill="none" aria-hidden="true">
      <path d="M3 33V13L16 5v28H3ZM16 33V17l13-8v24H16Z" stroke="currentColor" strokeWidth="2.5" />
      <path d="M9 17v10m13-8v8" stroke="#D1A66B" strokeWidth="2.5" />
    </svg>
  )
}

export function Logo({ light = false }) {
  return (
    <TLink
      href="/"
      label="Buildora"
      aria-label="Buildora home"
      className={`group inline-flex items-center gap-2.5 ${light ? 'text-white' : 'text-forest'}`}
    >
      <span className="transition-transform duration-500 group-hover:-translate-y-0.5">
        <LogoMark />
      </span>
      <span className="font-heading text-[27px] font-extrabold tracking-[-1.2px]">
        BUILDORA<span className="text-gold">.</span>
      </span>
    </TLink>
  )
}

export function Button({ href, children, secondary = false, gold = false, onClick, type }) {
  const cls = `motion-button group inline-flex min-h-12 items-center justify-center gap-8 rounded-[3px] px-6 py-3.5 text-[13px] font-semibold ${
    secondary
      ? 'border border-forest/25 text-forest hover:bg-forest/5'
      : gold
        ? 'bg-gold text-forest hover:bg-[#dfbc8b]'
        : 'bg-forest text-white hover:bg-[#28574d]'
  }`
  const inner = (
    <>
      {children}
      <Icon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </>
  )
  if (!href)
    return (
      <button type={type || 'button'} onClick={onClick} data-magnetic className={cls}>
        {inner}
      </button>
    )
  return (
    <TLink href={href} data-magnetic className={cls}>
      {inner}
    </TLink>
  )
}

export function Eyebrow({ children, light = false }) {
  return (
    <p
      data-reveal
      className={`motion-eyebrow mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[2.1px] ${
        light ? 'text-gold' : 'text-forest/75'
      }`}
    >
      <span className="h-px w-6 bg-gold" />
      {children}
    </p>
  )
}

/** Splits text children into masked words (keeps <br/> and inline spans) for staggered reveals. */
export function SplitWords({ children }) {
  let i = 0
  const walk = (nodes) =>
    Children.map(nodes, (node) => {
      if (typeof node === 'string' || typeof node === 'number') {
        const parts = String(node).split(/(\s+)/)
        return parts.map((part, k) =>
          /^\s+$/.test(part) || part === '' ? (
            part ? ' ' : null
          ) : (
            <span className="split-word" key={`${i}-${k}`}>
              <span style={{ '--i': i++ }}>{part}</span>
            </span>
          ),
        )
      }
      if (isValidElement(node)) {
        if (node.type === 'br') return node
        if (node.type === Fragment) return walk(node.props.children)
        return cloneElement(node, {}, walk(node.props.children))
      }
      return node
    })
  return <>{walk(children)}</>
}

export function SectionHeading({ children, as: Tag = 'h2', className = '' }) {
  return (
    <Tag
      data-reveal="words"
      className={`font-heading text-[32px] leading-[1.22] font-semibold tracking-[-1.3px] md:text-[42px] ${className}`}
    >
      <SplitWords>{children}</SplitWords>
    </Tag>
  )
}

export function FinalCTA() {
  return (
    <section className="motion-cta bg-[#eae8de] px-6 py-16 md:py-20">
      <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <Eyebrow>Great things begin with a conversation</Eyebrow>
          <SectionHeading>
            Let’s build something
            <br />
            greater, together.
          </SectionHeading>
        </div>
        <div data-reveal className="max-w-sm">
          <p className="mb-6 text-sm leading-7 text-muted">
            Your land. Your investment. Our shared vision.
            <br />
            Let’s explore what we can create together.
          </p>
          <Button href="/contact">Partner With Buildora</Button>
        </div>
      </div>
    </section>
  )
}

const SRCSETS = {
  '/images/buildora-community.webp': '/images/buildora-community-800.webp 800w, /images/buildora-community.webp 1376w',
}
export function Img({ src, alt, className = '', position, eager = false, sizes = '(max-width:767px) 100vw, 1376px' }) {
  return (
    <img
      src={src}
      srcSet={SRCSETS[src]}
      alt={alt}
      sizes={SRCSETS[src] ? sizes : undefined}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      className={`absolute inset-0 h-full w-full ${className}`}
      style={position ? { objectPosition: position } : undefined}
    />
  )
}

/** Responsive photograph (object-cover) with optional srcset from lib/photos. */
export function Photo({ photo, className = '', position, eager = false, sizes = '(max-width:767px) 100vw, 50vw' }) {
  if (!photo) return null
  return (
    <img
      src={photo.src}
      srcSet={photo.srcSet}
      sizes={sizes}
      alt={photo.alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      style={position ? { objectPosition: position } : undefined}
    />
  )
}
