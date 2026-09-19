import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { site } from '@/lib/site'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { PageHero } from '@/components/sections/page-hero'
import { Reveal } from '@/components/reveal'
import { Cta } from '@/components/sections/cta'
import { JsonLd } from '@/components/json-ld'

export const metadata: Metadata = buildMetadata({
  title: 'Areas we cover',
  description: `${site.business.name} covers ${site.areas
    .map((a) => a.name)
    .join(', ')} and the rest of ${site.contact.address.locality}.`,
  path: '/areas',
})

export default function AreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Coverage"
        title={`Areas we cover around ${site.contact.address.locality}`}
        intro="Each area has its own page with what we typically get called out for there. If yours is not listed, ring and ask."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Areas', path: '/areas' },
        ]}
      />

      <section className="section-y bg-surface">
        <div className="container-page">
          <ul className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2">
            {site.areas.map((area, i) => (
              <Reveal as="li" key={area.slug} delay={(i % 2) * 70}>
                <Link
                  href={`/areas/${area.slug}`}
                  className="group flex h-full flex-col bg-surface p-8 transition-colors duration-400 hover:bg-surface-2"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="inline-flex items-center gap-2.5 text-2xl text-ink">
                      <MapPin
                        className="size-5 text-accent-600"
                        aria-hidden
                        strokeWidth={1.75}
                      />
                      {area.name}
                    </h2>
                    <ArrowUpRight
                      className="mt-1.5 size-4 shrink-0 text-brand-600 transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </div>

                  {area.blurb && (
                    <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">
                      {area.blurb}
                    </p>
                  )}

                  {area.postcodes?.length ? (
                    <span className="mt-6 text-xs uppercase tracking-[0.12em] text-muted">
                      {area.postcodes.join(' · ')}
                    </span>
                  ) : null}
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
          { name: 'Areas', path: '/areas' },
        ])}
      />
    </>
  )
}
