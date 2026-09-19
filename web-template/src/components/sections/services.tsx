import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { featuredServices, copy, t } from '@/lib/site'
import { SectionHeading } from './section-heading'

/**
 * An index, not a grid of tiles: numeral, name, one line, arrow, hairline.
 * The whole row is the link.
 */
export function Services() {
  const services = featuredServices

  return (
    <section id="services" className="section rule-b">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={copy.servicesEyebrow} title={copy.servicesTitle} intro={copy.servicesIntro} />
          <Link href="/services" className="link text-[0.9375rem]">
            {t.allServices}
          </Link>
        </div>

        <ol className="rule-strong-t mt-10">
          {services.map((service, i) => (
            <li key={service.slug} className="rule-b">
              <Link
                href={`/services/${service.slug}`}
                className="group grid items-baseline gap-x-6 gap-y-1 py-5 md:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1.4fr)_2rem] md:py-6"
              >
                <span className="numeral text-sm">{String(i + 1).padStart(2, '0')}</span>
                <span className="display-wide text-2xl text-ink transition-colors group-hover:text-brand">
                  {service.name}
                </span>
                <span className="text-[0.9375rem] leading-relaxed text-ink-2">{service.short}</span>
                <ArrowRight
                  aria-hidden
                  strokeWidth={1.5}
                  className="hidden size-5 justify-self-end text-ink-3 transition-transform group-hover:translate-x-1 group-hover:text-brand md:block"
                />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
