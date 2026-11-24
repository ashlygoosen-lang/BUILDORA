import { PageIntro } from '../components/PageContent'
import { Projects } from '../components/Projects'
import { FinalCTA } from '../components/brand'
import { useApi, usePageMeta } from '../lib/api'

export default function Developments() {
  usePageMeta('Our developments', 'Explore our vision for connected residential communities.')
  const { data, loading, error } = useApi('/api/developments')
  return (
    <main>
      <PageIntro
        eyebrow="Our developments"
        title="Thoughtfully planned. Built around people."
        description="Explore our vision for connected residential communities, where considered architecture meets everyday life."
      />
      <section className="mx-auto max-w-[1240px] px-6 pb-20">
        <p data-reveal className="mb-8 text-xs text-muted">
          Illustrative concept portfolio. These are not verified active developments or investment offers. Locations, approvals and
          availability will be confirmed for each actual project.
        </p>
        {error ? (
          <p role="alert" className="rounded border border-forest/15 p-10 text-sm text-muted">
            We couldn’t load developments right now. Please refresh in a moment.
          </p>
        ) : (
          <Projects projects={data || []} filter loading={loading} />
        )}
      </section>
      <FinalCTA />
    </main>
  )
}
