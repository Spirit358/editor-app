import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight, Check, Phone } from 'lucide-react'
import { site, serviceBySlug, phoneDisplay } from '@/lib/site'
import { buildMetadata, breadcrumbSchema, serviceSchema } from '@/lib/seo'
import { cn, telHref } from '@/lib/utils'
import { PageHero } from '@/components/sections/page-hero'
import { ServiceIcon } from '@/components/service-icon'
import { Reveal } from '@/components/reveal'
import { Cta } from '@/components/sections/cta'
import { JsonLd } from '@/components/json-ld'
import { buttonVariants } from '@/components/ui/button'

type Params = Promise<{ slug: string }>

export function generateStaticParams() {
  return site.services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { slug } = await params
  const service = serviceBySlug(slug)
  if (!service) return buildMetadata({ title: 'Not found' })

  return buildMetadata({
    title: `${service.name} in ${site.contact.address.locality}`,
    description: service.short,
    path: `/services/${service.slug}`,
  })
}

export default async function ServicePage({ params }: { params: Params }) {
  const { slug } = await params
  const service = serviceBySlug(slug)
  if (!service) notFound()

  const others = site.services.filter((s) => s.slug !== service.slug).slice(0, 3)
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service.name, path: `/services/${service.slug}` },
  ]

  return (
    <>
      <PageHero
        eyebrow={`${site.contact.address.locality} & surrounding areas`}
        title={service.name}
        intro={service.short}
        breadcrumbs={trail}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={telHref(site.contact.phone)}
            data-cta="service-call"
            className={cn(
              buttonVariants({ variant: 'accent', size: 'lg' }),
              'w-full sm:w-auto'
            )}
          >
            <Phone aria-hidden />
            {phoneDisplay}
          </a>
          {service.priceFrom && (
            <span className="text-sm text-brand-300">
              Typically from{' '}
              <strong className="font-semibold text-brand-50 tabular-nums">
                {service.priceFrom}
              </strong>
            </span>
          )}
        </div>
      </PageHero>

      <section className="section-y bg-surface">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="grid size-14 place-items-center rounded-[var(--radius-md)] bg-brand-50 text-brand-700">
                  <ServiceIcon name={service.icon} className="size-7" />
                </span>
              </Reveal>

              <div className="mt-8 space-y-6">
                {service.body.map((para, i) => (
                  <Reveal key={i} delay={i * 60}>
                    <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
                      {para}
                    </p>
                  </Reveal>
                ))}
              </div>

              {service.image && (
                <Reveal delay={160}>
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    width={service.image.width ?? 1200}
                    height={service.image.height ?? 900}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="mt-10 aspect-3/2 w-full rounded-[var(--radius-lg)] object-cover"
                  />
                </Reveal>
              )}
            </div>

            <aside className="lg:col-span-5">
              {service.bullets?.length ? (
                <Reveal delay={80}>
                  <div className="rounded-[var(--radius-lg)] border border-line bg-surface-2 p-7 lg:sticky lg:top-28">
                    <h2 className="font-display text-lg text-ink">
                      What is included
                    </h2>
                    <ul className="mt-5 space-y-3.5">
                      {service.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3">
                          <span
                            className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-100"
                            aria-hidden
                          >
                            <Check
                              className="size-3 text-brand-700"
                              strokeWidth={3}
                            />
                          </span>
                          <span className="text-[0.9375rem] leading-snug text-ink-soft">
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 border-t border-line pt-6">
                      <p className="text-sm text-muted">
                        Covering{' '}
                        {site.areas
                          .slice(0, 4)
                          .map((a) => a.name)
                          .join(', ')}{' '}
                        and the rest of {site.contact.address.locality}.
                      </p>
                      <Link
                        href="/contact"
                        className={cn(
                          buttonVariants({ variant: 'primary', size: 'md' }),
                          'mt-5 w-full'
                        )}
                      >
                        Request a quote
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ) : null}
            </aside>
          </div>

          {others.length > 0 && (
            <div className="mt-20 border-t border-line pt-12">
              <h2 className="font-display text-xl text-ink">Other services</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {others.map((other, i) => (
                  <Reveal as="li" key={other.slug} delay={i * 70}>
                    <Link
                      href={`/services/${other.slug}`}
                      className="group flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-line p-5 transition-colors duration-300 hover:border-brand-400 hover:bg-surface-2"
                    >
                      <span className="text-[0.9375rem] font-medium text-ink">
                        {other.name}
                      </span>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-brand-600 transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <Cta heading={`Need ${service.name.toLowerCase()}?`} />

      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  )
}
