import { Logo } from './brand'
import { TLink } from '../lib/transition'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest px-6 pb-6 pt-16 text-white">
      <div className="mx-auto grid max-w-[1240px] gap-10 pb-14 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-xs leading-6 text-white/60">
            Transforming land. Creating homes.
            <br />
            Unlocking shared value.
          </p>
        </div>
        <div>
          <h3 className="mb-5 text-xs font-medium">Explore Buildora</h3>
          {[
            ['About us', '/about'],
            ['Our developments', '/developments'],
            ['Construction', '/construction'],
            ['Equipment & machinery', '/equipment'],
            ['How it works', '/how-it-works'],
            ['Community impact', '/impact'],
          ].map(([l, h]) => (
            <TLink key={l} href={h} className="mb-3 block text-xs text-white/60 hover:text-gold">
              {l}
            </TLink>
          ))}
        </div>
        <div>
          <h3 className="mb-5 text-xs font-medium">Build with us</h3>
          {[
            ['For landowners', '/landowners'],
            ['For investors', '/investors'],
            ['Strategic partnerships', '/contact'],
            ['Get in touch', '/contact'],
          ].map(([l, h]) => (
            <TLink key={l} href={h} className="mb-3 block text-xs text-white/60 hover:text-gold">
              {l}
            </TLink>
          ))}
        </div>
        <div>
          <h3 className="mb-5 text-xs font-medium">A shared ambition.</h3>
          <p className="text-xs leading-6 text-white/60">
            Better homes.
            <br />
            Stronger neighbourhoods.
            <br />
            Greater possibilities.
          </p>
        </div>
      </div>
      <p
        aria-hidden="true"
        className="footer-mark pointer-events-none mx-auto -mb-4 max-w-[1240px] select-none font-heading text-[18vw] leading-none font-extrabold tracking-[-0.06em] lg:text-[220px]"
      >
        BUILDORA.
      </p>
      <div className="relative mx-auto max-w-[1240px] border-t border-white/15 pt-6">
        <p className="mb-5 text-xs leading-6 text-white/75">
          <span className="mr-3 inline-block h-px w-6 bg-gold align-middle" aria-hidden="true" />
          Buildora is a division of{' '}
          <a
            href="https://vinklife-production.up.railway.app"
            className="font-semibold text-white underline decoration-gold/60 underline-offset-4 transition-colors hover:text-gold"
            target="_blank"
            rel="noopener"
          >
            VINK Group (Pty) Ltd
          </a>
          , registration number 2018/079316/07.
        </p>
        <div className="flex flex-wrap justify-between gap-4 text-[10px] text-white/45">
          <p>© {new Date().getFullYear()} Buildora. All rights reserved.</p>
          <p>Building Better Communities, Together.</p>
        </div>
      </div>
    </footer>
  )
}
