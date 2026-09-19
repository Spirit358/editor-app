import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight, Phone } from 'lucide-react'
import { site, t, areaBySlug, phoneDisplay, phoneHref, tradePlural } from '@/lib/site'
import { buildMetadata, breadcrumbSchema, areaServiceSchema } from '@/lib/seo'
import { cn } from '@/lib/utils'
import { PageHero } from '@/components/sections/page-hero'
import { ServiceIcon } from '@/components/service-icon'
import { Reveal } from '@/components/reveal'
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
    title: t.meta.areaTitle(site.business.tagline, area.name),
    description:
      area.blurb ??
      t.meta.areaDesc(
        site.business.name,
        area.name,
        area.postcodes?.join(', ') ?? '',
        site.business.description
      ),
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
        // The place name is wrapped in *asterisks* so <Highlight> sets it in
        // the accent italic, whatever order the language puts the words in.
        title={
          <Highlight
            text={t.copy.areaPageTitle(tradePlural, `*${area.name}*`)}
            className="text-accent-400"
          />
        }
        intro={area.blurb}
        breadcrumbs={trail}
      >
        <a
          href={phoneHref}
          data-cta="area-call"
          className={cn(buttonVariants({ variant: 'accent', size: 'lg' }))}
        >
          <Phone aria-hidden />
          <span className="tabular-nums">{phoneDisplay}</span>
        </a>
      </PageHero>

      <section className="section-y bg-surface">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">
              <span className="h-px w-6 bg-brand-400" aria-hidden />
              {t.whatWeDoHere}
            </p>
            <h2 className="mt-4 text-3xl text-ink">{t.everyServiceIn(area.name)}</h2>
          </div>

          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {site.services.map((service, i) => (
              <Reveal as="li" key={service.slug} delay={(i % 3) * 60}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full items-start gap-4 bg-surface p-6 transition-colors duration-400 hover:bg-surface-2"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)] bg-brand-50 text-brand-700 transition-colors duration-400 group-hover:bg-brand-950 group-hover:text-accent-400">
                    <ServiceIcon name={service.icon} className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-lg text-ink">{service.name}</span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">
                      {service.short}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>

          {nearby.length > 0 && (
            <div className="mt-16 rounded-[var(--radius-lg)] border border-line bg-surface-2 p-8">
              <h2 className="font-display text-xl text-ink">{t.nearbyAreas}</h2>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {nearby.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/areas/${other.slug}`}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-sm text-ink-soft transition-colors duration-300 hover:border-brand-600 hover:bg-brand-50 hover:text-brand-800"
                    >
                      {other.name}
                      <ArrowUpRight
                        className="size-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        aria-hidden
                      />
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
