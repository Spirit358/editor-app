import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Phone } from 'lucide-react'
import { site, t, areaBySlug, phoneDisplay, phoneHref, tradePlural } from '@/lib/site'
import { buildMetadata, breadcrumbSchema, areaServiceSchema } from '@/lib/seo'
import { cn } from '@/lib/utils'
import { PageHero } from '@/components/sections/page-hero'
import { Reviews } from '@/components/sections/reviews'
import { Cta } from '@/components/sections/cta'
import { JsonLd } from '@/components/json-ld'
import { Highlight } from '@/components/highlight'
import { buttonVariants } from '@/components/ui/button'

type Params = Promise<{ slug: string }>

export function generateStaticParams() {
  return site.areas.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const area = areaBySlug(slug)
  if (!area) return buildMetadata({ title: t.meta.notFound })
  return buildMetadata({
    title: t.meta.areaTitle(
      site.business.tradePlural ?? site.business.name,
      area.name,
      site.services
        .slice(0, 2)
        .map((s) => s.name.toLowerCase())
        .join(', '),
    ),
    description:
      area.blurb ??
      t.meta.areaDesc(site.business.name, area.name, area.postcodes?.join(', ') ?? '', site.business.description),
    path: `/areas/${area.slug}`,
  })
}

export default async function AreaPage({ params }: { params: Params }) {
  const { slug } = await params
  const area = areaBySlug(slug)
  if (!area) notFound()

  const trail = [
    { name: t.crumbs.home, path: '/' },
    { name: t.crumbs.areas, path: '/areas' },
    { name: area.name, path: `/areas/${area.slug}` },
  ]
  const nearby = site.areas.filter((a) => a.slug !== area.slug)

  return (
    <>
      <PageHero
        eyebrow={area.postcodes?.join(' · ')}
        title={<Highlight text={t.copy.areaPageTitle(tradePlural, `*${area.name}*`)} />}
        intro={area.blurb}
        breadcrumbs={trail}
      >
        <a href={phoneHref} data-cta="area-call" className={cn(buttonVariants({ variant: 'accent', size: 'lg' }))}>
          <Phone aria-hidden strokeWidth={1.75} />
          <span className="tabular">{phoneDisplay}</span>
        </a>
      </PageHero>

      <section className="section rule-b">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="label">{t.whatWeDoHere}</p>
              <h2 className="display-wide mt-3 text-3xl text-ink">{t.everyServiceIn(area.name)}</h2>
            </div>
            <ul className="rule-strong-t lg:col-span-8">
              {site.services.map((service, i) => (
                <li key={service.slug} className="rule-b">
                  <Link href={`/services/${service.slug}`} className="group grid gap-x-6 gap-y-1 py-4 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.4fr)]">
                    <span className="numeral text-sm">{String(i + 1).padStart(2, '0')}</span>
                    <span className="display-wide text-xl text-ink transition-colors group-hover:text-brand">{service.name}</span>
                    <span className="text-sm leading-relaxed text-ink-2">{service.short}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {nearby.length > 0 && (
            <div className="mt-16">
              <h2 className="label">{t.nearbyAreas}</h2>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {nearby.map((other) => (
                  <li key={other.slug}>
                    <Link href={`/areas/${other.slug}`} className="link text-[0.9375rem]">
                      {other.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <Reviews />
      <Cta />
      <JsonLd data={areaServiceSchema(area)} />
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  )
}
