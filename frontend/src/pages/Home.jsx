import { Button, Eyebrow, SectionHeading, Icon, FinalCTA, Img, Photo } from '../components/brand'
import { photos } from '../lib/photos'
import { Transformation } from '../components/Transformation'
import { Projects } from '../components/Projects'
import { Counter } from '../components/motion'
import { useApi, usePageMeta } from '../lib/api'
import { TLink } from '../lib/transition'

export default function Home() {
  usePageMeta(null, 'Bringing people, land and investment together to build better communities.')
  const { data: projects = [], loading } = useApi('/api/developments')
  const { data: stats } = useApi('/api/stats')

  return (
    <main>
      <section data-hero className="buildora-hero relative isolate mx-auto grid max-w-[1440px] lg:min-h-[620px] lg:grid-cols-[46%_54%]">
        <div className="relative flex flex-col justify-center px-6 py-16 md:px-14 lg:py-20 xl:pl-[max(40px,calc((100vw-1240px)/2))]">
          <div className="hero-ambient" aria-hidden="true">
            <span />
            <span />
          </div>
          <Eyebrow>Land. People. Possibility.</Eyebrow>
          <h1 className="font-heading text-[44px] leading-[1.15] font-semibold tracking-[-2.4px] sm:text-[54px] xl:text-[62px]">
            <span className="hero-line">
              <span>Small Plots.</span>
            </span>
            <span className="hero-line">
              <span>Bigger Possibilities.</span>
            </span>
            <span className="hero-line">
              <span className="hero-accent">Better Communities.</span>
            </span>
          </h1>
          <p className="hero-copy mb-8 mt-6 max-w-[390px] text-[13px] leading-[1.95] text-muted">
            We bring landowners, investors, construction expertise and modern machinery together to transform underutilised
            land into modern residential communities.
          </p>
          <div className="hero-actions flex flex-wrap gap-3">
            <Button href="/landowners">I Own Land</Button>
            <Button href="/investors" secondary>
              I Want to Invest
            </Button>
          </div>
          <div className="hero-note mt-12 flex items-center justify-between gap-3 text-[10px] text-muted">
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-forest/20">
                <Icon name="people" className="h-4 w-4" />
              </span>
              Built on partnership. Designed for shared value.
            </span>
            <span className="hidden items-center gap-3 uppercase tracking-[2px] lg:flex" aria-hidden="true">
              Scroll <span className="scroll-cue" />
            </span>
          </div>
        </div>
        <div className="hero-visual relative min-h-[390px] overflow-hidden lg:min-h-full">
          <div className="hero-tilt absolute -inset-4">
            <div className="hero-image-plane absolute inset-0">
              <Img
                eager
                src="/images/buildora-community.webp"
                alt="Vision of contemporary African residences surrounding a landscaped green courtyard"
                className="object-cover object-[40%_center]"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <div className="hero-caption absolute bottom-8 left-8 right-8 flex items-end justify-between text-white">
            <p className="max-w-56 font-heading text-[20px] font-medium leading-7">
              A new perspective
              <br />
              on what’s possible.
            </p>
            <span className="text-[8px] uppercase tracking-widest text-white/75">Our vision, illustrated</span>
          </div>
          <span className="hero-seal absolute right-6 top-6 flex h-[70px] w-[70px] items-center justify-center rounded-full border border-white/70 text-center text-[8px] leading-4 tracking-wider text-white backdrop-blur-[2px]">
            <span className="hero-seal-ring" aria-hidden="true" />
            BETTER
            <br />
            TOGETHER ↗
          </span>
        </div>
      </section>

      <div className="border-y border-forest/10 bg-[#eeede5] px-6 py-6">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-5 text-[10px] font-medium">
          <span data-reveal className="value-item text-muted">
            A SHARED VISION. A STRONGER FUTURE.
          </span>
          {[
            ['land', 'Unlocking land potential'],
            ['building', 'Building modern structures'],
            ['excavator', 'Sourcing modern machinery'],
            ['people', 'Building lasting partnerships'],
            ['leaf', 'Shaping better communities'],
          ].map(([i, t]) => (
            <span data-reveal className="value-item flex items-center gap-2" key={t}>
              <Icon name={i} className="h-4 w-4 text-[#8b987e]" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto grid max-w-[1240px] gap-10 px-6 py-20 lg:grid-cols-2 lg:px-0">
        <div>
          <Eyebrow>Welcome to Buildora</Eyebrow>
          <SectionHeading>
            Building more than properties.
            <br />
            Transforming communities.
          </SectionHeading>
        </div>
        <div data-reveal className="lg:pl-16">
          <p className="text-[13px] leading-7 text-muted">
            We see opportunity where others see boundaries. By bringing smaller land parcels, people and expertise together, we
            unlock the potential to create something far greater.
          </p>
          <p className="mb-5 mt-3 text-[13px] leading-7 text-muted">
            From the first conversation to the final home, our approach is collaborative, thoughtful and built around shared value.
          </p>
          <TLink
            href="/about"
            label="About Buildora"
            className="group inline-flex items-center gap-4 border-b border-forest/30 pb-2 text-xs font-medium transition-colors hover:border-gold"
          >
            Discover the Buildora difference
            <Icon className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
          </TLink>
        </div>
      </section>

      {stats && (
        <section className="mx-auto max-w-[1240px] px-6 pb-20 lg:px-0" aria-label="Concept portfolio at a glance">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {[
              [stats.developments, '', 'Concept communities', 'in our illustrative portfolio'],
              [stats.homes, '+', 'Homes envisioned', 'across those concepts'],
              [stats.regions, '', 'Provinces explored', 'for consolidated land'],
              [stats.steps, '', 'Step partnership model', 'from plot to community'],
            ].map(([v, s, t, d]) => (
              <div key={t} data-reveal className="stat-item">
                <span className="stat-rule mb-5 block h-px w-full bg-forest/15" />
                <p className="font-heading text-[44px] leading-none font-semibold tracking-[-2px] md:text-[56px]">
                  <Counter value={v} suffix={s} />
                </p>
                <p className="mt-3 text-xs font-semibold">{t}</p>
                <p className="mt-1 text-[11px] text-muted">{d}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-forest px-6 py-20 text-white">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow light>What we do</Eyebrow>
              <SectionHeading>
                Develop. Build. Equip.
                <br />
                One partner, land to keys.
              </SectionHeading>
            </div>
            <p data-reveal className="max-w-sm text-[13px] leading-7 text-white/65">
              From consolidating land to raising modern buildings and putting the right machinery on site, Buildora brings every
              stage together.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ['01', 'Develop', 'Land partnerships that turn small plots into planned communities.', '/how-it-works', null],
              ['02', 'Build', 'Modern residential, commercial and industrial construction.', '/construction', photos.tower],
              ['03', 'Equip', 'Construction equipment and machinery — sourced, delivered, supported.', '/equipment', photos.fleet],
            ].map(([n, t, d, href, photo]) => (
              <TLink key={t} href={href} label={t} data-reveal className="service-card group block">
                <div className="relative h-[340px] overflow-hidden rounded">
                  {photo ? (
                    <Photo photo={photo} sizes="(max-width:767px) 100vw, 410px" className="transition duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]" />
                  ) : (
                    <Img src="/images/buildora-community.webp" alt="Planned residential community vision" className="object-cover object-[30%_center] transition duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <span className="service-arrow absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-forest">
                    <Icon name="diagonal" className="h-4 w-4" />
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="text-[10px] text-gold">{n}</span>
                    <h3 className="font-heading mt-1 text-[28px] font-semibold tracking-[-1px]">{t}</h3>
                    <p className="mt-2 text-xs leading-6 text-white/75">{d}</p>
                  </div>
                </div>
              </TLink>
            ))}
          </div>
        </div>
      </section>

      <Transformation />

      <section className="mx-auto max-w-[1240px] px-6 py-20 lg:px-0">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Spaces for a better tomorrow</Eyebrow>
            <SectionHeading>Communities taking shape.</SectionHeading>
          </div>
          <Button href="/developments" secondary>
            Explore All Developments
          </Button>
        </div>
        <Projects projects={(projects || []).slice(0, 3)} loading={loading} />
        <p className="mt-6 text-[10px] text-muted">
          Concept portfolio · Illustrative projects and imagery, not current sales or investment offers.
        </p>
      </section>

      <section className="grid md:grid-cols-2">
        <div className="partner-panel bg-forest px-8 py-16 text-white lg:px-[max(40px,calc((100vw-1240px)/2))]">
          <Eyebrow light>For landowners</Eyebrow>
          <SectionHeading>
            Your land has
            <br />
            greater potential.
          </SectionHeading>
          <p data-reveal className="mb-7 mt-5 max-w-sm text-xs leading-7 text-white/65">
            You don’t need a large piece of land to be part of something bigger. Discover how a partnership can open new doors.
          </p>
          <Button href="/landowners" gold>
            Explore Your Land’s Potential
          </Button>
        </div>
        <div className="partner-panel bg-[#e4e6db] px-8 py-16 lg:px-16">
          <Eyebrow>For investors</Eyebrow>
          <SectionHeading>
            Invest in the future of
            <br />
            growing communities.
          </SectionHeading>
          <p data-reveal className="mb-7 mt-5 max-w-sm text-xs leading-7 text-muted">
            Connect your capital with thoughtfully structured residential development opportunities and a clear, shared vision.
          </p>
          <Button href="/investors">Explore Investment Opportunities</Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-12 px-6 py-20 md:grid-cols-2 lg:px-0">
        <div data-reveal="image" className="motion-image relative min-h-80 overflow-hidden rounded">
          <Img src="/images/buildora-community.webp" alt="Green landscaped spaces between residential buildings" className="object-cover object-right" />
        </div>
        <div className="self-center md:pl-10">
          <Eyebrow>Our purpose, beyond property</Eyebrow>
          <SectionHeading>
            More than buildings.
            <br />
            We build opportunities.
          </SectionHeading>
          <p data-reveal className="mb-7 mt-6 text-sm leading-7 text-muted">
            Quality homes. Thriving local economies. Neighbourhoods that work better for everyone. This is the future we’re working
            towards.
          </p>
          <Button href="/impact" secondary>
            Our Community Impact
          </Button>
        </div>
      </section>
      <FinalCTA />
    </main>
  )
}
