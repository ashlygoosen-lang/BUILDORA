import { PageIntro } from '../components/PageContent'
import { Button, Eyebrow, SectionHeading, Icon, FinalCTA, Photo } from '../components/brand'
import { EnquiryForm } from '../components/EnquiryForm'
import { photos } from '../lib/photos'
import { usePageMeta } from '../lib/api'

const categories = [
  ['excavator', 'Earthmoving', 'Excavators, bulldozers, motor graders and TLBs for bulk earthworks, trenching and site preparation.', photos.fleet, '30% center'],
  ['truck', 'Loading & haulage', 'Wheel loaders, tipper trucks and articulated dump trucks to move material efficiently across site.', photos.loader, 'center'],
  ['crane', 'Lifting & cranes', 'Tower cranes, mobile cranes and telehandlers for vertical construction and heavy lifts.', photos.cranes, 'center 30%'],
  ['mixer', 'Concrete equipment', 'Mixer trucks, concrete pumps and batching plants for consistent, on-programme pours.', photos.concrete, 'center'],
  ['beam', 'Structural & access', 'Scaffolding, formwork and steel-erection equipment for safe, fast structural work.', photos.steel, 'center'],
  ['bolt', 'Site support', 'Generators, compressors, compactors and lighting towers that keep every site productive.', photos.towerCrane, 'center'],
]

const steps = [
  ['search', 'Tell us what you need', 'Share the machine, specification, quantity, timeline and delivery site. We help refine the requirement if you are unsure.'],
  ['globe', 'We source the market', 'We approach manufacturers, authorised dealers and vetted sellers locally and internationally, and compare options for you.'],
  ['shield', 'Inspect & verify', 'Machines are checked for condition, hours, service history and documentation before any commitment is made.'],
  ['truck', 'Purchase & logistics', 'We coordinate purchase, shipping, customs clearance and transport to your site, with clear costs quoted in Rand.'],
  ['wrench', 'Delivery & support', 'Handover, commissioning and operator orientation, with access to servicing and parts support where available.'],
]

const machines = [
  'Excavators', 'Bulldozers', 'Motor graders', 'TLBs', 'Wheel loaders', 'Tipper trucks', 'Tower cranes', 'Mobile cranes',
  'Telehandlers', 'Concrete pumps', 'Mixer trucks', 'Batching plants', 'Rollers & compactors', 'Generators', 'Compressors', 'Scaffolding',
]

export default function Equipment() {
  usePageMeta('Equipment & machinery', 'Buildora sources modern construction equipment and machinery — new, quality-used, hire and lease options.')
  return (
    <main>
      <PageIntro
        eyebrow="Equipment & machinery sourcing"
        title="The right machine. On site. On time."
        description="Buildora sources modern construction equipment and machinery — new and quality-used — from trusted manufacturers and dealers, for our own projects and for contractors, developers and municipalities."
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="#equipment-quote">Request a Quote</Button>
          <Button href="/construction" secondary>
            See What We Build
          </Button>
        </div>
      </PageIntro>

      <section className="mx-auto max-w-[1240px] px-6">
        <div data-reveal="image" className="motion-image relative h-[340px] overflow-hidden rounded md:h-[560px]">
          <Photo photo={photos.fleet} eager sizes="(max-width:767px) 100vw, 1240px" position="center 60%" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-white md:bottom-10 md:left-10 md:right-10">
            <p className="max-w-md font-heading text-2xl leading-tight font-semibold md:text-[32px]">Modern machinery, sourced with care and delivered ready to work.</p>
            <div className="flex flex-wrap gap-2 text-[10px] font-medium uppercase tracking-[1.6px]">
              {['New', 'Quality used', 'Hire', 'Lease'].map((t) => (
                <span key={t} className="rounded-full border border-white/40 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="machine-marquee mt-14 border-y border-forest/10 bg-[#eeede5] py-5" aria-label="Machinery we source">
        <div className="machine-track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={copy === 1 ? 'true' : undefined}>
              {machines.map((m) => (
                <li key={m} className="flex items-center gap-10 whitespace-nowrap font-heading text-lg font-semibold text-forest/80 md:text-xl">
                  {m}
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-[1240px] px-6 py-20">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>What we source</Eyebrow>
            <SectionHeading>
              Every machine a modern
              <br />
              site depends on.
            </SectionHeading>
          </div>
          <p data-reveal className="max-w-sm text-[13px] leading-7 text-muted">
            From a single TLB to a full project fleet, we match equipment to the job, the terrain and your budget.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(([icon, title, desc, photo, pos]) => (
            <article key={title} data-reveal className="machine-card group relative overflow-hidden rounded bg-forest text-white">
              <div className="relative h-60 overflow-hidden">
                <Photo photo={photo} position={pos} sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 410px" className="transition duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/10 to-transparent" />
                <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-ivory text-forest transition-transform duration-500 group-hover:rotate-[-8deg]">
                  <Icon name={icon} className="h-5 w-5" />
                </span>
              </div>
              <div className="px-6 pb-7 pt-1">
                <h3 className="font-heading text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-white/65">{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-forest px-6 py-20 text-white">
        <div className="mx-auto max-w-[1240px]">
          <Eyebrow light>How sourcing works</Eyebrow>
          <SectionHeading>
            From requirement to
            <br />
            machine on site.
          </SectionHeading>
          <ol className="mt-12 grid gap-px overflow-hidden rounded bg-white/10 md:grid-cols-5">
            {steps.map(([icon, t, d], i) => (
              <li key={t} data-reveal className="sourcing-step relative bg-forest p-6 transition-colors duration-500 hover:bg-[#1f4a42]">
                <span className="font-heading text-sm text-gold">0{i + 1}</span>
                <Icon name={icon} className="mb-5 mt-6 h-7 w-7 text-gold/90" />
                <h3 className="font-heading text-[17px] font-semibold">{t}</h3>
                <p className="mt-3 text-xs leading-6 text-white/60">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-12 px-6 py-20 md:grid-cols-2">
        <div data-reveal="image" className="motion-image relative min-h-[380px] overflow-hidden rounded">
          <Photo photo={photos.crew} sizes="(max-width:767px) 100vw, 620px" />
        </div>
        <div className="self-center">
          <Eyebrow>Flexible ways to equip</Eyebrow>
          <SectionHeading>Buy, hire or lease — whatever fits the project.</SectionHeading>
          <ul className="mt-8 grid gap-5">
            {[
              ['Buy new', 'Factory-new machines with manufacturer warranty, sourced at competitive pricing.'],
              ['Buy quality used', 'Inspected pre-owned equipment with verified hours and service records.'],
              ['Hire', 'Short- or long-term hire for project peaks, without tying up capital.'],
              ['Lease / rent-to-own', 'Structured payment options, subject to agreement and approval.'],
            ].map(([t, d]) => (
              <li key={t} data-reveal className="flex gap-4 border-b border-forest/12 pb-5">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/25 text-forest">
                  <Icon name="check" className="h-3.5 w-3.5" />
                </span>
                <span>
                  <span className="font-heading block font-semibold">{t}</span>
                  <span className="mt-1 block text-xs leading-6 text-muted">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="equipment-quote" className="mx-auto max-w-[1240px] scroll-mt-24 px-6 pb-20">
        <div className="mb-8">
          <Eyebrow>Get a quote</Eyebrow>
          <SectionHeading>Tell us what you need on site.</SectionHeading>
          <p data-reveal className="mt-4 max-w-2xl text-sm text-muted">
            Quotes are prepared per request in South African Rand. Availability, pricing, import duties and lead times depend on the
            specific machine and market at the time of sourcing.
          </p>
        </div>
        <EnquiryForm kind="Equipment" />
      </section>
      <FinalCTA />
    </main>
  )
}
