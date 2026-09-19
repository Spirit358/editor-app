import Link from 'next/link'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { site, copy } from '@/lib/site'
import { SectionHeading } from './section-heading'
import { Reveal } from '@/components/reveal'

/**
 * Service-area links are the cheapest local SEO there is: a real page per
 * place, linked from the homepage and the footer, each with its own copy.
 * The dark panel also breaks up the page rhythm before the FAQ.
 */
export function Areas() {
  const { areas } = site

  return (
    <section id="areas" className="grain section-y relative bg-brand-950">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(45%_60%_at_80%_20%,color-mix(in_oklab,var(--color-brand-600)_28%,transparent),transparent_70%)]"
      />
      <div className="container-page relative">
        <SectionHeading
          tone="light-on-dark"
          eyebrow={copy.areasEyebrow}
          title={copy.areasTitle}
          intro={copy.areasIntro}
        />

        <ul className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-brand-800 bg-brand-800 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((area, i) => (
            <Reveal as="li" key={area.slug} delay={(i % 4) * 60}>
              <Link
                href={`/areas/${area.slug}`}
                className="group flex h-full flex-col bg-brand-950 p-6 transition-colors duration-400 hover:bg-brand-900"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 font-display text-lg text-brand-50">
                    <MapPin
                      className="size-4 text-accent-500"
                      aria-hidden
                      strokeWidth={1.75}
                    />
                    {area.name}
                  </span>
                  <ArrowUpRight
                    className="size-4 text-brand-400 transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-400"
                    aria-hidden
                  />
                </div>
                {area.postcodes?.length ? (
                  <span className="mt-3 text-xs uppercase tracking-[0.12em] text-brand-400">
                    {area.postcodes.join(' · ')}
                  </span>
                ) : null}
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
