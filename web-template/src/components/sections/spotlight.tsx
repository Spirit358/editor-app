import Image from 'next/image'
import Link from 'next/link'
import { site, phoneHref } from '@/lib/site'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Illustration } from '@/components/illustration'

/**
 * The one solid block on the page: the thing the business is known for.
 * Brand colour as a surface, once.
 */
export function Spotlight() {
  const s = site.spotlight
  if (!s) return null

  const cta = s.cta
  const ctaHref = cta ? (cta.kind === 'tel' ? phoneHref : cta.href) : null

  return (
    <section className="bg-brand text-on-brand">
      <div className="container-page">
        <div className="grid items-center gap-10 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <div className="lg:col-span-7">
            {/* 90% white on the brand blue clears 4.5:1; 80% measured 4.18. */}
            {s.eyebrow && <p className="label text-on-brand/90">{s.eyebrow}</p>}
            <h2 className="display mt-3 text-5xl">{s.title}</h2>
            <div className="measure mt-6 space-y-4 text-lg leading-relaxed text-on-brand/85">
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {s.bullets?.length ? (
              <ul className="mt-8 grid gap-x-8 gap-y-2 text-[0.9375rem] sm:grid-cols-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-3 border-t border-on-brand/20 pt-3">
                    {/* A drawn dash, not a text glyph: decorative text at 60%
                        opacity fails the contrast audit even when aria-hidden. */}
                    <span aria-hidden className="mt-[0.72em] h-px w-3 shrink-0 bg-on-brand/60" />
                    {b}
                  </li>
                ))}
              </ul>
            ) : null}
            {cta && ctaHref && (
              <div className="mt-8">
                {ctaHref.startsWith('/') ? (
                  <Link href={ctaHref} className={cn(buttonVariants({ variant: 'outline-light', size: 'lg' }))}>
                    {cta.label}
                  </Link>
                ) : (
                  <a href={ctaHref} className={cn(buttonVariants({ variant: 'outline-light', size: 'lg' }))}>
                    {cta.label}
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            {s.image ? (
              <Image
                src={s.image.src}
                alt={s.image.alt}
                width={s.image.width ?? 1200}
                height={s.image.height ?? 900}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="aspect-[4/3] w-full rounded-[var(--radius-md)] object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-[var(--radius-md)] border border-on-brand/25 p-8 text-on-brand sm:p-12">
                <Illustration kind={s.illustration ?? 'warehouse'} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
