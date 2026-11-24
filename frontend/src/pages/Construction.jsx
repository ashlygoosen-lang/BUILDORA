import { Button, Eyebrow, SectionHeading, Icon, FinalCTA, Photo, SplitWords } from '../components/brand'
import { EnquiryForm } from '../components/EnquiryForm'
import { photos } from '../lib/photos'
import { usePageMeta } from '../lib/api'

const sectors = [
  ['Residential communities', 'Townhouses, family homes and apartment blocks designed for comfort, light and long-term value.', photos.apartment, 'center'],
  ['Mixed-use & commercial', 'Offices, retail and mixed-use buildings that bring life and business to growing neighbourhoods.', photos.buildingCrane, 'center'],
  ['Steel & structural', 'Steel-frame and reinforced-concrete structures engineered for speed, strength and flexibility.', photos.steel, 'center'],
  ['Industrial & warehousing', 'Warehouses, workshops and light-industrial facilities with practical, efficient layouts.', photos.towerCrane, 'center'],
]

const principles = [
  ['building', 'Modern methods', 'Steel framing, precast elements and efficient concrete systems that shorten programmes and improve quality.'],
  ['leaf', 'Energy-conscious design', 'Natural light, insulation, solar-ready roofs and water-wise fittings that lower running costs.'],
  ['shield', 'Safety & quality', 'Planned site safety, quality inspections at every stage and construction to applicable national building regulations.'],
  ['excavator', 'Our own equipment pipeline', 'Because we source machinery ourselves, the right plant arrives when the programme needs it.'],
]

const process = [
  ['Brief & feasibility', 'We understand your goals, site and budget, and test what is realistically achievable.'],
  ['Design & approvals', 'Architects and engineers develop the design; plans and permits are submitted for the required approvals.'],
  ['Procurement & equipment', 'Materials, subcontractors and machinery are secured — with equipment sourced through our own network.'],
  ['Build', 'Qualified site teams deliver against agreed plans, milestones and quality standards, with regular progress reporting.'],
  ['Handover & aftercare', 'Final inspections, completion documentation and a defined aftercare period after you receive the keys.'],
]

export default function Construction() {
  usePageMeta('Construction', 'Buildora designs and builds modern residential, commercial and industrial buildings.')
  return (
    <main>
      <section className="mx-auto grid max-w-[1240px] gap-10 px-6 pb-16 pt-16 md:pt-24 lg:grid-cols-[1.05fr_1fr] lg:items-end">
        <div className="page-intro">
          <PageIntroInline />
        </div>
        <div className="relative hidden h-[520px] lg:block">
          <div data-reveal="image" className="motion-image absolute right-0 top-0 h-[440px] w-[78%] overflow-hidden rounded">
            <Photo photo={photos.tower} eager sizes="480px" />
          </div>
          <div data-reveal="image" className="motion-image absolute bottom-0 left-0 h-[230px] w-[52%] overflow-hidden rounded border-[6px] border-ivory">
            <Photo photo={photos.cranes} sizes="330px" position="center 35%" />
          </div>
          <span className="hero-seal absolute bottom-[190px] right-[66%] flex h-[78px] w-[78px] items-center justify-center rounded-full bg-forest text-center text-[8px] leading-4 tracking-wider text-white">
            <span className="hero-seal-ring !border-gold/70" aria-hidden="true" />
            DESIGN
            <br />
            &amp; BUILD
          </span>
        </div>
      </section>

      <div className="mx-auto max-w-[1240px] px-6 lg:hidden">
        <div data-reveal="image" className="motion-image relative mb-4 h-[380px] overflow-hidden rounded">
          <Photo photo={photos.tower} eager sizes="100vw" />
        </div>
      </div>

      <section className="bg-[#eeede5] px-6 py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>What we build</Eyebrow>
              <SectionHeading>
                Modern buildings for
                <br />
                the way people live and work.
              </SectionHeading>
            </div>
            <Button href="/developments" secondary>
              Our Development Vision
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {sectors.map(([t, d, photo, pos], i) => (
              <article key={t} data-reveal className={`sector-card group relative overflow-hidden rounded ${i % 2 ? 'md:translate-y-10' : ''}`}>
                <div className="relative h-[300px] overflow-hidden md:h-[380px]">
                  <Photo photo={photo} position={pos} sizes="(max-width:767px) 100vw, 610px" className="transition duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                  <span className="text-[10px] text-gold">0{i + 1}</span>
                  <h3 className="font-heading mt-1 text-2xl font-semibold">{t}</h3>
                  <p className="sector-copy mt-2 max-w-md text-xs leading-6 text-white/75">{d}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow>How we build</Eyebrow>
            <SectionHeading>Built smarter. Built to last.</SectionHeading>
            <p data-reveal className="mt-6 text-sm leading-7 text-muted">
              Modern construction is about more than appearance. It is about efficient methods, durable materials and buildings that
              cost less to live in and maintain.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {principles.map(([icon, t, d]) => (
              <article key={t} data-reveal className="motion-feature border-t border-forest/20 py-7">
                <Icon name={icon} className="mb-6 h-7 w-7 text-[#8a977c]" />
                <h3 className="font-heading mb-3 text-xl font-semibold">{t}</h3>
                <p className="text-sm leading-7 text-muted">{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-forest px-6 py-20 text-white">
        <div className="absolute inset-0 -z-10 opacity-25">
          <Photo photo={photos.steel} sizes="100vw" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest via-forest/90 to-forest/60" />
        <div className="mx-auto max-w-[1240px]">
          <Eyebrow light>From brief to keys</Eyebrow>
          <SectionHeading>
            A clear process,
            <br />
            start to finish.
          </SectionHeading>
          <div className="mt-12 grid gap-8 md:grid-cols-5">
            {process.map(([t, d], i) => (
              <div key={t} data-reveal className="build-step relative pt-8">
                <span className="build-step-line absolute left-0 right-0 top-0 h-px bg-white/20" aria-hidden="true" />
                <span className="absolute -top-[5px] left-0 h-[11px] w-[11px] rounded-full border-2 border-gold bg-forest" aria-hidden="true" />
                <span className="font-heading text-3xl text-gold">0{i + 1}</span>
                <h3 className="font-heading mt-3 text-[17px] font-semibold">{t}</h3>
                <p className="mt-2 text-xs leading-6 text-white/65">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-12 px-6 py-20 md:grid-cols-2">
        <div className="self-center md:order-2">
          <Eyebrow>One integrated partner</Eyebrow>
          <SectionHeading>Land, buildings and machinery — under one roof.</SectionHeading>
          <p data-reveal className="mb-7 mt-6 text-sm leading-7 text-muted">
            Buildora connects land partnerships, construction delivery and equipment sourcing. Fewer hand-offs mean clearer
            accountability, tighter programmes and better value for landowners, investors and clients.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/equipment">Equipment &amp; Machinery</Button>
            <Button href="/how-it-works" secondary>
              The Buildora Model
            </Button>
          </div>
        </div>
        <div data-reveal="image" className="motion-image relative min-h-[380px] overflow-hidden rounded md:order-1">
          <Photo photo={photos.crew} sizes="(max-width:767px) 100vw, 620px" />
        </div>
      </section>

      <section id="project-brief" className="mx-auto max-w-[1240px] scroll-mt-24 px-6 pb-20">
        <div className="mb-8">
          <Eyebrow>Start your project</Eyebrow>
          <SectionHeading>Planning a build? Let’s talk.</SectionHeading>
          <p data-reveal className="mt-4 max-w-2xl text-sm text-muted">
            Share a few details and our team will come back to you to discuss scope, feasibility and next steps. Sending a brief is not a
            commitment.
          </p>
        </div>
        <EnquiryForm kind="Construction" />
      </section>
      <FinalCTA />
    </main>
  )
}

function PageIntroInline() {
  return (
    <>
      <Eyebrow>Construction</Eyebrow>
      <h1 className="font-heading max-w-4xl text-4xl leading-[1.15] font-semibold tracking-[-2px] md:text-6xl">
        <SplitWords>Modern buildings, built to last.</SplitWords>
      </h1>
      <p className="mt-7 max-w-xl text-sm leading-7 text-muted">
        We design and build contemporary residential, commercial and industrial buildings — combining modern construction methods,
        quality materials and our own equipment sourcing to deliver on time and on budget.
      </p>
      <div className="hero-actions mt-9 flex flex-wrap gap-3">
        <Button href="#project-brief">Start Your Project</Button>
        <Button href="/equipment" secondary>
          Equipment &amp; Machinery
        </Button>
      </div>
    </>
  )
}
