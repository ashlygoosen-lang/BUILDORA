import { useState } from 'react'
import { Icon, Img } from './brand'
import { TLink } from '../lib/transition'

const FILTERS = ['All developments', 'Proposed', 'Planning', 'Under construction', 'Completed']

export function Projects({ projects = [], filter = false, loading = false }) {
  const [status, setStatus] = useState('All developments')
  const shown = projects.filter((p) => status === 'All developments' || p.status === status)
  return (
    <>
      {filter && (
        <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter developments by status">
          {FILTERS.map((s) => (
            <button
              key={s}
              aria-pressed={status === s}
              onClick={() => setStatus(s)}
              className={`motion-filter rounded-full border px-5 py-2.5 text-xs ${
                status === s ? 'border-forest bg-forest text-white' : 'border-forest/20 hover:bg-forest/5'
              }`}
            >
              {s}
              {s !== 'All developments' && (
                <span className={`ml-2 text-[10px] ${status === s ? 'text-white/60' : 'text-muted'}`}>
                  {projects.filter((p) => p.status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      {loading && (
        <div className="grid gap-7 md:grid-cols-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-[270px] rounded-[4px] bg-forest/8" />
              <div className="mt-5 h-3 w-24 rounded bg-forest/8" />
              <div className="mt-3 h-5 w-48 rounded bg-forest/10" />
            </div>
          ))}
        </div>
      )}
      <div key={status} className="project-grid grid gap-7 md:grid-cols-3">
        {shown.map((p) => (
          <TLink data-reveal key={p.id} href={`/developments/${p.slug}`} label={p.name} className="project-card group">
            <div className="relative h-[270px] overflow-hidden rounded-[4px] bg-sage/20">
              {p.image && (
                <Img
                  src={p.image}
                  alt={`${p.name} — illustrative vision`}
                  position={p.imagePosition}
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              )}
              <span className="project-shine" aria-hidden="true" />
              <span className="absolute left-4 top-4 rounded-sm bg-ivory px-3 py-1.5 text-[9px] font-medium">{p.status}</span>
              <span className="project-arrow absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white">
                <Icon name="diagonal" className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-5 flex items-center gap-1.5 text-[10px] text-muted">
              <Icon name="pin" className="h-3 w-3" />
              {p.location}
            </p>
            <h3 className="font-heading mt-2 text-xl font-semibold">{p.name}</h3>
            <p className="mt-2 text-xs leading-6 text-muted">{p.description}</p>
            <p className="mt-3 text-[10px] text-muted">
              {p.type}
              {p.illustrative ? ' · Illustrative concept' : ''}
            </p>
          </TLink>
        ))}
      </div>
      {!loading && !shown.length && (
        <p role="status" className="project-empty rounded border border-forest/15 p-10 text-sm text-muted">
          No developments in this category yet. Get in touch to discuss the upcoming pipeline.
        </p>
      )}
    </>
  )
}
