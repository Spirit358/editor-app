import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { site, t } from '@/lib/site'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { PageHero } from '@/components/sections/page-hero'
import { Illustration } from '@/components/illustration'
import { Cta } from '@/components/sections/cta'
import { JsonLd } from '@/components/json-ld'

const TRAIL = [
  { name: t.crumbs.home, path: '/' },
  { name: t.crumbs.services, path: '/services' },
]

export const metadata: Metadata = buildMetadata({
  title: t.crumbs.services,
  description: t.meta.services(
    site.business.name,
    site.contact.address.locality,
    site.services.map((s) => s.name.toLowerCase()).join(', ')
  ),
  path: '/services',
})

/** The catalogue: every service as a ruled row with its drawing. */
export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow={t.crumbs.services} title={t.pages.services.title} intro={t.pages.services.intro} breadcrumbs={TRAIL} />

      <section className="section rule-b">
        <div className="container-page">
          <ol className="rule-strong-t">
            {site.services.map((service, i) => (
              <li key={service.slug} className="rule-b">
                <Link
                  href={`/services/${service.slug}`}
                  className="group grid gap-6 py-8 md:grid-cols-12 md:items-center"
                >
                  <div className="md:col-span-3">
                    <div className="flex aspect-[4/3] items-center justify-center rounded-[var(--radius-md)] bg-brand-tint p-5 text-brand">
                      <Illustration kind={service.illustration ?? 'tools'} />
                    </div>
                  </div>
                  <div className="md:col-span-8">
                    <span className="numeral text-sm">{String(i + 1).padStart(2, '0')}</span>
                    <h2 className="display-wide mt-2 text-3xl text-ink transition-colors group-hover:text-brand">
                      {service.name}
                    </h2>
                    <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{service.short}</p>
                    {service.bullets?.length ? (
                      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-3">
                        {service.bullets.slice(0, 3).map((b) => (
                          <li key={b}>— {b}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  <ArrowRight
                    aria-hidden
                    strokeWidth={1.5}
                    className="hidden size-6 justify-self-end text-ink-3 transition-transform group-hover:translate-x-1 group-hover:text-brand md:block"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Cta />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  )
}
