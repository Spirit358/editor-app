import { t, processSteps } from '@/lib/site'
import { SectionHeading } from './section-heading'

/** Four numbered steps, ruled. How a job actually runs. */
export function Process() {
  return (
    <section className="section rule-b">
      <div className="container-page">
        <SectionHeading eyebrow={t.process.eyebrow} title={t.process.title} />
        <ol className="mt-10 grid gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <li key={i} className="rule-strong-t pt-5">
              <span className="numeral text-sm">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="display-wide mt-4 text-xl text-ink">{step.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
