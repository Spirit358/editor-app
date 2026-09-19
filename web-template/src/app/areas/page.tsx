import type { Metadata } from 'next'
import Link from 'next/link'
import { site, t } from '@/lib/site'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { PageHero } from '@/components/sections/page-hero'
import { Cta } from '@/components/sections/cta'
import { JsonLd } from '@/components/json-ld'

const TRAIL = [
  { name: t.crumbs.home, path: '/' },
  { name: t.crumbs.areas, path: '/areas' },
]

export const metadata: Metadata = buildMetadata({
  title: t.crumbs.areas,
  description: t.meta.areas(site.business.name, site.areas.map((a) => a.name).join(', '), site.contact.address.locality),
  path: '/areas',
})

export default function AreasPage() {
  return (
    <>
      <PageHero
        eyebrow={t.crumbs.areas}
        title={t.pages.areas.title(site.contact.address.locality)}
        intro={t.pages.areas.intro}
        breadcrumbs={TRAIL}
      />

      <section className="section rule-b">
        <div className="container-page">
          <ul className="rule-strong-t">
            {site.areas.map((area) => (
              <li key={area.slug} className="rule-b">
                <Link href={`/areas/${area.slug}`} className="group grid gap-2 py-6 md:grid-cols-12 md:gap-6">
                  <span className="md:col-span-4">
                    <span className="display-wide block text-2xl text-ink transition-colors group-hover:text-brand">
                      {area.name}
                    </span>
                    {area.postcodes?.length ? (
                      <span className="tabular mt-1 block text-sm text-ink-3">{area.postcodes.join(' · ')}</span>
                    ) : null}
                  </span>
                  {area.blurb && (
                    <span className="measure text-[0.9375rem] leading-relaxed text-ink-2 md:col-span-8">{area.blurb}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Cta />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  )
}
