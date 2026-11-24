import { useParams } from 'react-router-dom'
import { PageIntro } from '../components/PageContent'
import { Button, Icon, Img, Eyebrow, SectionHeading } from '../components/brand'
import { EnquiryForm } from '../components/EnquiryForm'
import { Projects } from '../components/Projects'
import { useApi, usePageMeta } from '../lib/api'
import NotFound from './NotFound'

export default function DevelopmentDetail() {
  const { slug } = useParams()
  const { data: p, loading, error } = useApi(`/api/developments/${slug}`)
  const { data: all } = useApi('/api/developments')
  usePageMeta(p?.name, p?.description)

  if (error?.status === 404) return <NotFound />
  if (loading || !p)
    return (
      <main className="mx-auto max-w-[1240px] animate-pulse px-6 pb-20 pt-24" aria-busy="true">
        <div className="h-3 w-40 rounded bg-forest/10" />
        <div className="mt-6 h-14 w-2/3 rounded bg-forest/10" />
        <div className="mt-12 h-[420px] rounded bg-forest/8" />
      </main>
    )

  const others = (all || []).filter((d) => d.slug !== p.slug).slice(0, 3)
  return (
    <main>
      <PageIntro eyebrow={`${p.location} · ${p.status}`} title={p.name} description={p.description} />
      <section className="mx-auto max-w-[1240px] px-6 pb-20">
        {p.image && (
          <div data-reveal="image" className="motion-image relative mb-10 h-[300px] overflow-hidden rounded md:h-[480px]">
            <Img src={p.image} alt={`${p.name} — illustrative vision`} position={p.imagePosition} className="object-cover" />
          </div>
        )}
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div data-reveal>
            <p className="text-xs uppercase tracking-widest">{p.type}</p>
            <h2 className="font-heading my-4 text-3xl">A place to belong.</h2>
            <p className="mb-5 max-w-2xl text-sm leading-7 text-muted">
              {p.illustrative
                ? 'This illustrative concept explores the possibilities of land consolidation and people-centred development. It is not an active offer. Project scope, ownership arrangements, finance and planning approvals are subject to assessment and legal agreement.'
                : 'Contact our team for current project documentation and participation information.'}
            </p>
          </div>
          <dl data-reveal className="grid h-fit grid-cols-2 gap-px overflow-hidden rounded bg-forest/10">
            {[
              ['Location', p.location],
              ['Status', p.status],
              ['Type', p.type],
              [p.illustrative ? 'Proposed homes' : 'Homes', p.units ?? '—'],
            ].map(([k, v]) => (
              <div key={k} className="bg-ivory p-5">
                <dt className="text-[10px] uppercase tracking-[1.6px] text-muted">{k}</dt>
                <dd className="font-heading mt-2 text-base font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="mx-auto max-w-[1240px] px-6 pb-20">
        <div className="mb-8">
          <Eyebrow>Enquire about this project</Eyebrow>
          <SectionHeading>Interested in {p.name}?</SectionHeading>
        </div>
        <EnquiryForm development={p.name} />
      </section>
      {others.length > 0 && (
        <section className="bg-[#eeede5] px-6 py-20">
          <div className="mx-auto max-w-[1240px]">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <SectionHeading>More communities taking shape.</SectionHeading>
              <Button href="/developments" secondary>
                All developments
              </Button>
            </div>
            <Projects projects={others} />
          </div>
        </section>
      )}
    </main>
  )
}
