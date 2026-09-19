import type { Metadata } from 'next'
import { site, t } from '@/lib/site'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { PageHero } from '@/components/sections/page-hero'
import { About } from '@/components/sections/about'
import { Process } from '@/components/sections/process'
import { Reviews } from '@/components/sections/reviews'
import { Cta } from '@/components/sections/cta'
import { JsonLd } from '@/components/json-ld'

const TRAIL = [
  { name: t.crumbs.home, path: '/' },
  { name: t.crumbs.about, path: '/about' },
]

export const metadata: Metadata = buildMetadata({
  title: t.meta.about,
  description: site.about?.body[0] ?? site.business.description,
  path: '/about',
})

export default function AboutPage() {
  const { business, contact } = site

  return (
    <>
      <PageHero
        eyebrow={business.foundedYear ? t.pages.about.eyebrow(contact.address.locality, business.foundedYear) : undefined}
        title={t.pages.about.title(business.name)}
        intro={business.description}
        breadcrumbs={TRAIL}
      />

      <About priority />

      {business.accreditations?.length ? (
        <section className="section-sm rule-b">
          <div className="container-page">
            <h2 className="label">{t.credentials}</h2>
            <ul className="rule-strong-t mt-4 grid sm:grid-cols-2 lg:grid-cols-4">
              {business.accreditations.map((a) => (
                <li key={a} className="rule-b py-3.5 text-[0.9375rem] text-ink">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <Process />
      <Reviews />
      <Cta />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  )
}
