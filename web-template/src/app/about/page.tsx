import type { Metadata } from 'next'
import { ShieldCheck } from 'lucide-react'
import { site, t } from '@/lib/site'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { PageHero } from '@/components/sections/page-hero'
import { About } from '@/components/sections/about'
import { Reviews } from '@/components/sections/reviews'
import { Cta } from '@/components/sections/cta'
import { Reveal } from '@/components/reveal'
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
        eyebrow={
          business.foundedYear
            ? t.pages.about.eyebrow(contact.address.locality, business.foundedYear)
            : undefined
        }
        title={t.pages.about.title(business.name)}
        intro={business.description}
        breadcrumbs={TRAIL}
      />

      <About priority />

      {business.accreditations?.length ? (
        <section className="section-y-sm bg-surface">
          <div className="container-page">
            <Reveal>
              <h2 className="eyebrow">
                <span className="h-px w-6 bg-brand-400" aria-hidden />
                {t.credentials}
              </h2>
            </Reveal>
            <ul className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {business.accreditations.map((a, i) => (
                <Reveal as="li" key={a} delay={(i % 4) * 60}>
                  <div className="flex h-full items-start gap-3.5 bg-surface p-6">
                    <ShieldCheck
                      className="mt-0.5 size-5 shrink-0 text-brand-600"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <span className="text-[0.9375rem] leading-snug text-ink">{a}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <Reviews />
      <Cta />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  )
}
