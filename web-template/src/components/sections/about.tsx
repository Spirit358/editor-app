import Image from 'next/image'
import { site, copy } from '@/lib/site'

/**
 * Text-led. The founding year is the image: one very large numeral. A real
 * photograph replaces it when the config has one.
 */
export function About({ priority = false }: { priority?: boolean } = {}) {
  const about = site.about
  if (!about) return null
  const year = site.business.foundedYear

  return (
    <section id="about" className="section rule-b">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            {about.image ? (
              <Image
                src={about.image.src}
                alt={about.image.alt}
                width={about.image.width ?? 1200}
                height={about.image.height ?? 1400}
                sizes="(min-width: 1024px) 30vw, 100vw"
                priority={priority}
                className="aspect-[4/5] w-full rounded-[var(--radius-md)] object-cover"
              />
            ) : year ? (
              <div className="rule-strong-t pt-4">
                <span className="display block text-7xl leading-none text-brand">{year}</span>
                <span className="label mt-3 block">{about.stats?.[0]?.label ?? ''}</span>
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-8">
            <p className="label">{copy.aboutEyebrow}</p>
            <h2 className="display-wide mt-3 text-4xl text-ink">{about.heading}</h2>
            <div className="measure mt-6 space-y-5 text-lg leading-relaxed text-ink-2">
              {about.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {about.stats?.length ? (
              <dl className="mt-10 grid grid-cols-2 gap-x-8 sm:grid-cols-4">
                {about.stats.map((stat) => (
                  <div key={stat.label} className="rule-strong-t pt-4">
                    <dd className="display-wide text-3xl text-ink">{stat.value}</dd>
                    <dt className="mt-1 text-sm text-ink-3">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
