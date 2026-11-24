import { Eyebrow, SectionHeading, Icon, FinalCTA, Button, Img, SplitWords } from './brand'
import { EnquiryForm } from './EnquiryForm'
import { Transformation } from './Transformation'
import { usePageMeta } from '../lib/api'
export function PageIntro({ eyebrow, title, description, children }) {
  return (
    <section className="page-intro mx-auto max-w-[1240px] px-6 pb-14 pt-16 md:pt-24">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="font-heading max-w-4xl text-4xl leading-[1.15] font-semibold tracking-[-2px] md:text-6xl">
        <SplitWords>{title}</SplitWords>
      </h1>
      <p className="mt-7 max-w-2xl text-sm leading-7 text-muted">{description}</p>
      {children}
    </section>
  )
}
const steps = [
  [
    'Identify the opportunity',
    'We assess strategically located, underutilised land, its surroundings and potential for well-planned housing.',
  ],
  [
    'Bring landowners together',
    'We listen to owners of neighbouring plots and explore a shared vision, without assuming that one arrangement fits everyone.',
  ],
  [
    'Structure the partnership',
    'Independent legal advice, ownership checks and legally approved consolidation arrangements establish a clear foundation.',
  ],
  [
    'Plan with purpose',
    'Architects and planners design the community. Required planning, environmental and infrastructure approvals are sought before construction.',
  ],
  [
    'Secure investment',
    'Project feasibility, due diligence and appropriate finance structures bring the right investment partners to the table.',
  ],
  [
    'Build the community',
    'Qualified construction teams deliver against agreed plans, quality standards and project milestones.',
  ],
  [
    'Deliver shared value',
    'Completed homes, ownership interests or agreed financial benefits are delivered in line with each signed project agreement.',
  ],
]
const pageData = {
  about: [
    'About Buildora',
    'A bigger vision. A shared future.',
    'We bring people, land, investment, construction expertise and modern machinery together to create communities that make a lasting difference.',
  ],
  landowners: [
    'For landowners',
    'Your land has greater potential.',
    'Your plot could be the beginning of something bigger. By partnering with neighbouring landowners, we can unlock opportunities that may not be possible alone.',
  ],
  investors: [
    'For investors',
    'Invest in the future of growing communities.',
    'Explore a considered approach to residential development, connecting capital with land, local knowledge and development expertise.',
  ],
  'how-it-works': [
    'The Buildora model',
    'Small plots. One shared vision.',
    'A transparent, collaborative journey from fragmented land to thoughtfully planned residential communities.',
  ],
  impact: [
    'Community impact',
    'More than buildings. We build opportunities.',
    'Our ambition goes beyond property. It is about creating places where people belong, local businesses grow and communities thrive.',
  ],
  contact: [
    'Let’s talk',
    'Better begins with a conversation.',
    'Whether you own land, want to invest or share our ambition for better communities, we would love to hear from you.',
  ],
}
function Cards({ items }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map(([t, d], i) => (
        <article key={t} data-reveal className="motion-feature border-t border-forest/20 py-7">
          <Icon
            name={['land', 'building', 'people', 'leaf', 'shield', 'pin'][i % 6]}
            className="mb-6 h-7 w-7 text-[#8a977c]"
          />
          <h3 className="font-heading mb-3 text-xl font-semibold">{t}</h3>
          <p className="text-sm leading-7 text-muted">{d}</p>
        </article>
      ))}
    </div>
  )
}

export function ApplyCallout({ type, title, text }) {
  return (
    <section data-reveal className="apply-callout relative isolate my-14 overflow-hidden rounded bg-forest px-7 py-10 text-white md:px-12 md:py-12">
      <span className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full border border-white/10" aria-hidden="true" />
      <span className="pointer-events-none absolute -right-10 -top-10 -z-10 h-52 w-52 rounded-full border border-gold/25" aria-hidden="true" />
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[2px] text-gold">Housing investor application</p>
          <h2 className="font-heading mt-3 text-[28px] leading-tight font-semibold tracking-[-1px] md:text-[34px]">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-white/70">{text}</p>
        </div>
        <Button href={type ? `/apply?type=${type}` : '/apply'} gold>
          Start Application
        </Button>
      </div>
    </section>
  )
}

export function ContentPage({ page }) {
  const [eyebrow, title, description] = pageData[page]
  usePageMeta(eyebrow === 'Let’s talk' ? 'Contact' : eyebrow, description)
  return (
    <main>
      <PageIntro {...{ eyebrow, title, description }} />
      {page === 'about' && (
        <>
          <section className="mx-auto grid max-w-[1240px] gap-12 px-6 pb-20 md:grid-cols-2">
            <div
              data-reveal="image"
              className="motion-image relative min-h-[400px] overflow-hidden"
            >
              <Img src="/images/buildora-community.webp" alt="Architectural vision of a connected residential community" className="rounded object-cover" />
            </div>
            <div className="self-center">
              <Eyebrow>Who we are</Eyebrow>
              <SectionHeading>Development with people at its heart.</SectionHeading>
              <p className="mt-6 text-sm leading-7 text-muted">
                Buildora is a property development company focused on transforming fragmented,
                underutilised and peri-urban land into modern residential communities. We connect
                individual landowners, investors, architects and construction professionals around a
                common goal.
              </p>
              <p className="mt-4 text-sm leading-7 text-muted">
                Our development philosophy is simple: quality homes and shared opportunity should
                grow together. We prioritise careful planning, responsible partnerships and
                long-term neighbourhood value.
              </p>
              <p className="mt-4 text-sm leading-7 text-muted">
                Alongside development, we build modern residential, commercial and industrial
                buildings, and source the construction equipment and machinery that projects depend
                on — for our own sites and for contractors and clients.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="/construction">Construction</Button>
                <Button href="/equipment" secondary>
                  Equipment &amp; Machinery
                </Button>
              </div>
            </div>
          </section>
          <section className="bg-[#eeede5] px-6 py-16">
            <div className="mx-auto max-w-[1240px]">
              <Cards
                items={[
                  [
                    'Our mission',
                    'To unlock land potential through collaborative development and deliver quality housing for middle-income households.',
                  ],
                  [
                    'Our vision',
                    'More inclusive, connected and thoughtfully planned urban communities, built through shared participation.',
                  ],
                  [
                    'Our values',
                    'Integrity in every agreement. Inclusion in every partnership. Quality in every design. Responsibility for the future.',
                  ],
                ]}
              />
            </div>
          </section>
        </>
      )}
      {page === 'how-it-works' && (
        <>
          <Transformation />
          <section className="mx-auto max-w-[1000px] px-6 py-20">
            {steps.map(([t, d], i) => (
              <div
                key={t}
                data-reveal
                className="motion-step grid grid-cols-[55px_1fr] gap-6 border-b border-forest/15 py-8 md:grid-cols-[100px_1fr]"
              >
                <span className="font-heading text-3xl text-gold">0{i + 1}</span>
                <div>
                  <h2 className="font-heading text-2xl font-semibold">{t}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{d}</p>
                </div>
              </div>
            ))}
            <p className="mt-8 text-xs leading-6 text-muted">
              Every site is different. Participation, approvals, timelines and benefits depend on
              feasibility and project-specific legal agreements. We encourage independent legal and
              financial advice.
            </p>
            <ApplyCallout
              title="Contribute land, funds or labour."
              text="Every contributor receives a home in the completed building. Apply online in 7 steps and upload your documents securely."
            />
          </section>
        </>
      )}
      {page === 'landowners' && (
        <section className="mx-auto max-w-[1240px] px-6 pb-20">
          <div className="mb-14">
            <Cards
              items={[
                [
                  'A completed home',
                  'Contribute eligible land in exchange for a completed residential unit, as agreed for a viable project.',
                ],
                [
                  'An ownership interest',
                  'Explore a structured stake in the development, with clearly documented rights and responsibilities.',
                ],
                [
                  'Financial consideration',
                  'Receive agreed financial compensation, subject to valuation, feasibility and a signed agreement.',
                ],
                [
                  'A joint development partnership',
                  'Work with Buildora through a project-specific partnership that aligns contributions and outcomes.',
                ],
                [
                  'Clear, informed participation',
                  'Ownership verification, independent advice and transparent terms underpin every arrangement.',
                ],
                [
                  'A better neighbourhood',
                  'Your contribution can support planned infrastructure, quality homes and a stronger community.',
                ],
              ]}
            />
          </div>
          <ApplyCallout
            type="Land"
            title="Ready to contribute your land?"
            text="Apply as a landowner investor and receive one house or apartment equivalent to your current home — but improved — on any floor you choose."
          />
          <div className="mb-8">
            <Eyebrow>Take the first step</Eyebrow>
            <SectionHeading>Let’s explore what’s possible.</SectionHeading>
            <p className="mt-4 text-sm text-muted">
              Submitting an enquiry is not a commitment. All land is subject to assessment.
            </p>
          </div>
          <EnquiryForm kind="Landowner" />
        </section>
      )}
      {page === 'investors' && (
        <section className="mx-auto max-w-[1240px] px-6 pb-20">
          <div data-reveal="image" className="motion-image relative mb-12 h-80 overflow-hidden">
            <Img src="/images/buildora-community.webp" alt="Residential development vision" className="rounded object-cover" />
          </div>
          <Cards
            items={[
              [
                'Structured opportunities',
                'Site-specific investment opportunities are supported by an assessment of land, demand, costs and delivery feasibility.',
              ],
              [
                'Disciplined risk management',
                'Title checks, planning reviews, cost evaluation and professional advice help inform decisions. Development investment remains subject to risk.',
              ],
              [
                'Transparent project reporting',
                'Agreed milestones, governance and reporting structures support informed participation throughout development.',
              ],
              [
                'Development pipeline',
                'We assess opportunities as land partnerships and project conditions evolve. Enquire for verified current opportunities.',
              ],
              [
                'Partnership structures',
                'Funding, equity and strategic delivery partnerships are considered according to the requirements of each development.',
              ],
              [
                'Informed decisions',
                'No returns are guaranteed. Investment terms, eligibility and risk disclosures are provided for each specific opportunity.',
              ],
            ]}
          />
          <div className="my-10">
            <Button href="/developments" secondary>
              Explore Our Development Vision
            </Button>
          </div>
          <ApplyCallout
            type="Funds"
            title="Invest funds or materials in a home."
            text="Contribute money or building materials and receive one house or apartment in the building. Citizens of Zambia and South Africa can apply online."
          />
          <EnquiryForm kind="Investor" />
        </section>
      )}
      {page === 'impact' && (
        <section className="mx-auto max-w-[1240px] px-6 pb-20">
          <div data-reveal="image" className="motion-image relative mb-12 h-96 overflow-hidden">
            <Img src="/images/buildora-community.webp" alt="Pedestrian green spaces at the heart of a residential community" className="object-cover" />
          </div>
          <Cards
            items={[
              [
                'Quality housing',
                'Creating considered, accessible residential environments for middle-income households.',
              ],
              [
                'Organised urban growth',
                'Consolidating fragmented plots to enable coordinated planning and more coherent neighbourhoods.',
              ],
              [
                'Local economic opportunity',
                'Supporting local professionals, tradespeople and businesses through the development process.',
              ],
              [
                'Better infrastructure',
                'Planning for access, utilities and shared spaces alongside the homes themselves.',
              ],
              [
                'Landowner participation',
                'Opening pathways for small landowners to participate in larger development opportunities.',
              ],
              [
                'Inclusive development',
                'Designing with community needs, long-term liveability and responsible land use in mind.',
              ],
            ]}
          />
          <p className="mt-5 text-xs text-muted">
            These are our intended areas of contribution. Verified project impact metrics will be
            shared as developments progress.
          </p>
        </section>
      )}
      {page === 'contact' && (
        <section className="mx-auto grid max-w-[1240px] gap-12 px-6 pb-20 lg:grid-cols-[1fr_1.8fr]">
          <div>
            <Eyebrow>The right conversation</Eyebrow>
            {[
              ['General enquiries', 'Questions about Buildora and our approach.'],
              ['Landowner enquiries', 'Explore the potential of your land.'],
              ['Investor enquiries', 'Discuss project-specific investment opportunities.'],
              ['Construction projects', 'Plan a modern residential, commercial or industrial build.'],
              ['Equipment & machinery', 'Source excavators, cranes, trucks and more — buy, hire or lease.'],
              [
                'Partnership enquiries',
                'Architects, builders and institutions: let’s collaborate.',
              ],
            ].map(([t, d]) => (
              <div key={t} data-reveal className="mb-6 border-b border-forest/15 pb-6">
                <h2 className="font-heading font-semibold">{t}</h2>
                <p className="mt-2 text-xs leading-6 text-muted">{d}</p>
              </div>
            ))}
            <p className="text-xs leading-6 text-muted">
              Direct email, telephone, WhatsApp and office details will be published once confirmed.
              In the meantime, our enquiry form is the best way to reach us.
            </p>
          </div>
          <EnquiryForm />
        </section>
      )}
      <FinalCTA />
    </main>
  )
}
