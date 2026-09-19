import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { site } from '@/lib/site'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { PageHero } from '@/components/sections/page-hero'
import { ServiceIcon } from '@/components/service-icon'
import { Reveal } from '@/components/reveal'
import { Cta } from '@/components/sections/cta'
import { JsonLd } from '@/components/json-ld'

export const metadata: Metadata = buildMetadata({
  title: 'Services',
  description: `Everything ${site.business.name} does across ${site.contact.address.locality}: ${site.services
    .map((s) => s.name.toLowerCase())
    .join(', ')}.`,
  path: '/services',
})

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="What we do, and what it costs"
        intro="Prices are where jobs typically start. We survey anything substantial before quoting, so the number you get is the number you pay."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ]}
      />

      <section className="section-y bg-surface">
        <div className="container-page">
          <ul className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2">
            {site.services.map((service, i) => (
              <Reveal as="li" key={service.slug} delay={(i % 2) * 80}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col bg-surface p-8 transition-colors duration-400 hover:bg-surface-2"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-[var(--radius-md)] bg-brand-50 text-brand-700 transition-colors duration-400 group-hover:bg-brand-950 group-hover:text-accent-400">
                    <ServiceIcon name={service.icon} className="size-6" />
                  </span>

                  <h2 className="mt-6 text-2xl text-ink">{service.name}</h2>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                    {service.short}
                  </p>

                  {service.bullets?.length ? (
                    <ul className="mt-5 flex-1 space-y-2 text-sm text-muted">
                      {service.bullets.slice(0, 3).map((b) => (
                        <li key={b} className="flex items-start gap-2.5">
                          <span
                            className="mt-2 size-1 shrink-0 rounded-full bg-accent-500"
                            aria-hidden
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="flex-1" />
                  )}

                  <span className="mt-7 flex items-center justify-between gap-4 border-t border-line pt-5">
                    {service.priceFrom && (
                      <span className="text-sm text-muted">
                        From{' '}
                        <strong className="font-semibold text-ink tabular-nums">
                          {service.priceFrom}
                        </strong>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700">
                      Read more
                      <ArrowUpRight
                        className="size-4 transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Cta />

      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ])}
      />
    </>
  )
}
