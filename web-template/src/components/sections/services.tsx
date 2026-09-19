import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { featuredServices, copy } from '@/lib/site'
import { SectionHeading } from './section-heading'
import { ServiceIcon } from '@/components/service-icon'
import { Reveal } from '@/components/reveal'
import { Highlight } from '@/components/highlight'

export function Services() {
  const services = featuredServices

  return (
    <section id="services" className="section-y bg-surface">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow={copy.servicesEyebrow}
            title={<Highlight text={copy.servicesTitle} />}
            intro={copy.servicesIntro}
          />
          <Reveal delay={120}>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-brand-700"
            >
              <span className="link-underline">All services</span>
              <ArrowUpRight
                className="size-4 transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal as="li" key={service.slug} delay={i * 70}>
              <Link
                href={`/services/${service.slug}`}
                className="group relative flex h-full flex-col bg-surface p-7 transition-colors duration-400 hover:bg-surface-2 sm:p-8"
              >
                {/* Accent rule that draws in on hover — the only motion here,
                    and it costs nothing. */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent-500 transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-x-100"
                />

                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-[var(--radius-md)] bg-brand-50 text-brand-700 transition-colors duration-400 group-hover:bg-brand-950 group-hover:text-accent-400">
                    <ServiceIcon name={service.icon} className="size-6" />
                  </span>
                  <span className="font-display text-sm tabular-nums text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="mt-6 text-xl text-ink">{service.name}</h3>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {service.short}
                </p>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-5">
                  {service.priceFrom ? (
                    <span className="text-sm text-muted">
                      From{' '}
                      <strong className="font-semibold text-ink tabular-nums">
                        {service.priceFrom}
                      </strong>
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700">
                    Details
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
