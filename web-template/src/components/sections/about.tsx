import Image from 'next/image'
import { site, copy } from '@/lib/site'
import { SectionHeading } from './section-heading'
import { Reveal } from '@/components/reveal'

/**
 * `priority` is for the About page, where this image sits in the first
 * viewport and is the largest contentful paint; on the homepage it is far
 * below the fold and should stay lazy.
 */
export function About({ priority = false }: { priority?: boolean } = {}) {
  const about = site.about
  if (!about) return null

  return (
    <section id="about" className="section-y bg-surface-2">
      <div className="container-page">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          {about.image && (
            <Reveal className="lg:col-span-5">
              <div className="relative">
                {/* Offset frame: one rule, one shadow. Reads as art direction
                    rather than a photo dropped on the page. */}
                <div
                  aria-hidden
                  className="absolute -bottom-4 -left-4 h-full w-full rounded-[var(--radius-xl)] border border-brand-300/60 sm:-bottom-6 sm:-left-6"
                />
                <Image
                  src={about.image.src}
                  alt={about.image.alt}
                  width={about.image.width ?? 1200}
                  height={about.image.height ?? 1400}
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  priority={priority}
                  className="relative aspect-4/5 w-full rounded-[var(--radius-xl)] object-cover shadow-[var(--shadow-deep)]"
                />
              </div>
            </Reveal>
          )}

          <div className={about.image ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <SectionHeading eyebrow={copy.aboutEyebrow} title={about.heading} />

            <div className="mt-6 space-y-5">
              {about.body.map((para, i) => (
                <Reveal key={i} delay={60 + i * 60}>
                  <p className="max-w-xl text-lg leading-relaxed text-ink-soft">
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>

            {about.stats?.length ? (
              <Reveal delay={240}>
                <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-4">
                  {about.stats.map((stat) => (
                    <div key={stat.label} className="bg-surface px-5 py-6">
                      <dt className="sr-only">{stat.label}</dt>
                      <dd>
                        <span className="block font-display text-3xl tabular-nums text-brand-800">
                          {stat.value}
                        </span>
                        <span className="mt-1.5 block text-xs uppercase tracking-[0.1em] text-muted">
                          {stat.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
