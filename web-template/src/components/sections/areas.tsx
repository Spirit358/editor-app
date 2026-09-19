import Link from 'next/link'
import { site, copy } from '@/lib/site'
import { SectionHeading } from './section-heading'

/** Town names as a ruled typographic grid. Each is a real page. */
export function Areas() {
  return (
    <section id="areas" className="section rule-b">
      <div className="container-page">
        <SectionHeading eyebrow={copy.areasEyebrow} title={copy.areasTitle} intro={copy.areasIntro} />
        <ul className="mt-10 grid grid-cols-2 gap-x-8 md:grid-cols-4">
          {site.areas.map((area) => (
            <li key={area.slug} className="rule-strong-t">
              <Link href={`/areas/${area.slug}`} className="group block py-4">
                <span className="display-wide block text-xl text-ink transition-colors group-hover:text-brand">
                  {area.name}
                </span>
                {area.postcodes?.length ? (
                  <span className="tabular mt-1 block text-sm text-ink-3">{area.postcodes.join(' · ')}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
