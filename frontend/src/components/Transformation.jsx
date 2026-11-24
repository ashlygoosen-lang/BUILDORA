import { Eyebrow, SectionHeading, Icon } from './brand'
import { TLink } from '../lib/transition'

function PlotDiagram({ stage }) {
  return (
    <svg viewBox="0 0 240 150" className="h-36 w-full" fill="none" aria-hidden="true">
      <g transform="translate(120 26) scale(1 .53) rotate(45)">
        <rect x="-66" y="0" width="132" height="132" fill={stage > 0 ? '#e0e6d9' : '#ece8de'} stroke="#698171" strokeWidth="1.5" />
        {stage === 0 ? (
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <rect
              key={i}
              x={-62 + (i % 3) * 44}
              y={4 + Math.floor(i / 3) * 44}
              width="35"
              height="35"
              fill={i % 2 ? '#bac8a9' : '#d5c7a6'}
              stroke="#7b8a6f"
            />
          ))
        ) : (
          <>
            <path d="M-66 44H66M-66 88H66M-22 0v132M22 0v132" stroke="#9da98f" strokeDasharray={stage === 1 ? '5 4' : '0'} />
            <rect x="-55" y="13" width="32" height="104" fill="#bac7aa" />
            {stage > 1 && (
              <>
                <rect x="-55" y="13" width="32" height="104" stroke="#183b35" />
                <rect x="29" y="13" width="25" height="104" fill="#ccc2ab" stroke="#183b35" />
              </>
            )}
          </>
        )}
      </g>
      {stage > 2 && (
        <g stroke="#325748" strokeWidth="1.3">
          <path d="m54 79 0-42 34 18v42L54 79Z" fill="#e7e3d4" />
          <path d="m88 55 38-20v42L88 97V55Z" fill="#b1b9a5" />
          <path d="m54 37 38-20 34 18-38 20-34-18Z" fill="#f2eee2" />
          <path d="m142 110 0-42 26 14v42l-26-14Z" fill="#e7e3d4" />
          <path d="m168 82 32-17v42l-32 17V82Z" fill="#b1b9a5" />
          <path d="m142 68 32-17 26 14-32 17-26-14Z" fill="#f2eee2" />
          <path d="m60 51 21 11m-21 0 21 11m-21 0 21 11m14-20 25-13m-25 24 25-13m-25 24 25-13" />
        </g>
      )}
    </svg>
  )
}

export function Transformation() {
  return (
    <section className="bg-[#eeeee5] px-6 py-20">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>The Buildora model</Eyebrow>
            <SectionHeading>
              From small plots to
              <br />
              greater possibilities.
            </SectionHeading>
          </div>
          <p data-reveal className="max-w-[340px] text-[13px] leading-6 text-muted">
            One shared vision. A thoughtfully structured process.
            <br />A better future for everyone involved.
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Individual landowners', 'Every plot holds a possibility.'],
            ['Land consolidation', 'Bringing land and people together.'],
            ['Thoughtful development', 'Turning a shared vision into a plan.'],
            ['Shared community value', 'Better homes. Greater opportunities.'],
          ].map(([t, d], i) => (
            <div key={t} data-reveal className="plot-stage relative">
              <div className="relative rounded bg-white/55 px-4 py-3">
                <PlotDiagram stage={i} />
                {i < 3 && (
                  <span className="absolute -right-6 top-1/2 z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-forest/15 bg-ivory lg:flex">
                    <Icon className="h-3 w-3" />
                  </span>
                )}
              </div>
              <p className="mt-5 text-[10px] text-[#8e7857]">0{i + 1}</p>
              <h3 className="font-heading mt-2 text-[15px] font-semibold">{t}</h3>
              <p className="mt-2 text-[11px] text-muted">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <TLink
            href="/how-it-works"
            className="group inline-flex items-center gap-3 border-b border-forest/30 pb-2 text-xs font-medium transition-colors hover:border-gold"
          >
            Explore how it works
            <Icon className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
          </TLink>
        </div>
      </div>
    </section>
  )
}
