import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Phone } from 'lucide-react'
import { site, t, serviceBySlug, phoneDisplay, phoneHref } from '@/lib/site'
import { buildMetadata, breadcrumbSchema, serviceSchema } from '@/lib/seo'
import { cn } from '@/lib/utils'
import { PageHero } from '@/components/sections/page-hero'
import { Illustration } from '@/components/illustration'
import { Cta } from '@/components/sections/cta'
import { JsonLd } from '@/components/json-ld'
import { buttonVariants } from '@/components/ui/button'

type Params = Promise<{ slug: string }>

export function generateStaticParams() {
  return site.services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const service = serviceBySlug(slug)
  if (!service) return buildMetadata({ title: t.meta.notFound })
  return buildMetadata({
    title: t.meta.serviceTitle(service.name, site.contact.address.locality),
    description: t.meta.serviceDesc(service.short, site.business.name, site.contact.address.locality, phoneDisplay),
    path: `/services/${service.slug}`,
  })
}

/** A datasheet: the drawing, the text, the scope as a ruled list. */
export default async function ServicePage({ params }: { params: Params }) {
  const { slug } = await params
  const service = serviceBySlug(slug)
  if (!service) notFound()

  const place = site.contact.address.locality
  const others = site.services.filter((s) => s.slug !== service.slug)
  const trail = [
    { name: t.crumbs.home, path: '/' },
    { name: t.crumbs.services, path: '/services' },
    { name: service.name, path: `/services/${service.slug}` },
  ]

  return (
    <>
      <PageHero eyebrow={place} title={service.name} intro={service.short} breadcrumbs={trail}>
        <a href={phoneHref} data-cta="service-call" className={cn(buttonVariants({ variant: 'accent', size: 'lg' }))}>
          <Phone aria-hidden strokeWidth={1.75} />
          <span className="tabular">{phoneDisplay}</span>
        </a>
      </PageHero>

      <section className="section rule-b">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              {service.image ? (
                <Image
                  src={service.image.src}
                  alt={service.image.alt}
                  width={service.image.width ?? 1200}
                  height={service.image.height ?? 900}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  priority
                  className="aspect-[4/3] w-full rounded-[var(--radius-md)] object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-[var(--radius-md)] bg-brand-tint p-8 text-brand sm:p-12">
                  <Illustration kind={service.illustration ?? 'tools'} />
                </div>
              )}

              {service.bullets?.length ? (
                <dl className="mt-8">
                  <dt className="label">{t.whatIsIncluded}</dt>
                  {service.bullets.map((b) => (
                    <dd key={b} className="rule-t py-3 text-[0.9375rem] text-ink">
                      {b}
                    </dd>
                  ))}
                </dl>
              ) : null}
            </div>

            <div className="lg:col-span-7">
              <div className="measure space-y-5 text-lg leading-relaxed text-ink-2">
                {service.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              {service.priceFrom && (
                <p className="rule-t mt-8 pt-4 text-sm text-ink-2">
                  {t.typicallyFrom} <strong className="tabular font-semibold text-ink">{service.priceFrom}</strong>
                </p>
              )}
              <p className="rule-t mt-8 pt-4 text-sm text-ink-3">
                {t.coveringAreas(site.areas.slice(0, 4).map((a) => a.name).join(', '), place)}
              </p>
              <div className="mt-8">
                <Link href="/contact" className={cn(buttonVariants({ variant: 'primary', size: 'lg' }))}>
                  {t.requestQuote}
                </Link>
              </div>
            </div>
          </div>

          {others.length > 0 && (
            <div className="mt-16">
              <h2 className="label">{t.otherServices}</h2>
              <ul className="rule-strong-t mt-4 grid sm:grid-cols-2 lg:grid-cols-3">
                {others.map((other) => (
                  <li key={other.slug} className="rule-b">
                    <Link href={`/services/${other.slug}`} className="link-quiet block py-3.5 text-[0.9375rem] text-ink hover:text-brand">
                      {other.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <Cta heading={service.ctaHeading} />
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  )
}
