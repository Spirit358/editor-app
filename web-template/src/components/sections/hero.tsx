import Image from 'next/image'
import Link from 'next/link'
import { Check, Phone } from 'lucide-react'
import { site, t, phoneHref } from '@/lib/site'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Stars } from '@/components/stars'

/**
 * The hero is server-rendered and animates with CSS keyframes only. No
 * hydration is needed before it moves, so the largest contentful paint is not
 * waiting on a JavaScript bundle, and nothing shifts once it arrives.
 *
 * The negative top margin pulls the panel up behind the sticky, transparent
 * header; the matching padding keeps the content clear of it.
 */
export function Hero() {
  const { hero, business, rating } = site

  return (
    <section
      className={cn(
        'grain relative isolate overflow-hidden bg-brand-950 text-brand-50',
        '-mt-18 pt-18 lg:-mt-20 lg:pt-20'
      )}
    >
      {/* Background media */}
      {hero.media?.type === 'image' && (
        <Image
          src={hero.media.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover opacity-30"
        />
      )}
      {hero.media?.type === 'video' && (
        <video
          className="absolute inset-0 -z-20 size-full object-cover opacity-30"
          poster={hero.media.poster}
          autoPlay
          muted
          loop
          playsInline
          // Decorative background: never announce it, never let it be focused.
          aria-hidden
          tabIndex={-1}
        >
          <source src={hero.media.src} type="video/mp4" />
        </video>
      )}

      {/* Depth: a warm glow bottom-left, a cool one top-right, then a scrim
          dark enough to guarantee AA contrast over any photograph. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_12%_85%,color-mix(in_oklab,var(--color-accent-600)_22%,transparent),transparent_70%),radial-gradient(50%_60%_at_88%_8%,color-mix(in_oklab,var(--color-brand-500)_26%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-950/85 via-brand-950/70 to-brand-950"
      />

      <div className="container-page relative">
        <div className="grid items-center gap-12 py-14 sm:py-24 lg:grid-cols-12 lg:gap-16 lg:py-32">
          <div className="lg:col-span-7">
            {hero.eyebrow && (
              <p
                className="animate-fade eyebrow stagger text-accent-400"
                style={{ '--i': 0 } as React.CSSProperties}
              >
                <span className="size-1.5 rounded-full bg-accent-400" aria-hidden />
                {hero.eyebrow}
              </p>
            )}

            {/* No fade and no stagger: this is the LCP element. */}
            <h1 className="animate-rise-lcp mt-5 text-6xl leading-[0.98] text-brand-50">
              {hero.headline}
              {hero.headlineAccent && (
                <>
                  {' '}
                  <span className="italic text-accent-400">
                    {hero.headlineAccent}
                  </span>
                </>
              )}
            </h1>

            <p
              className="animate-rise stagger mt-6 max-w-xl text-lg leading-relaxed text-brand-200"
              style={{ '--i': 2 } as React.CSSProperties}
            >
              {hero.sub}
            </p>

            <div
              className="animate-rise stagger mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ '--i': 3 } as React.CSSProperties}
            >
              {hero.ctas.map((cta) => {
                const isTel = cta.kind === 'tel'
                const href = isTel ? phoneHref : cta.href
                const className = cn(
                  buttonVariants({
                    variant: isTel
                      ? 'accent'
                      : cta.kind === 'primary'
                        ? 'primary'
                        : 'outline-light',
                    size: 'xl',
                  }),
                  'w-full sm:w-auto'
                )

                return isTel || href.startsWith('http') ? (
                  <a
                    key={cta.label}
                    href={href}
                    className={className}
                    data-cta="hero-call"
                  >
                    {isTel && <Phone aria-hidden />}
                    <span className={isTel ? 'tabular-nums' : undefined}>{cta.label}</span>
                  </a>
                ) : (
                  <Link key={cta.label} href={href} className={className}>
                    {cta.label}
                  </Link>
                )
              })}
            </div>

            {rating && (
              <div
                className="animate-fade stagger mt-8 flex items-center gap-3 text-sm text-brand-300"
                style={{ '--i': 4 } as React.CSSProperties}
              >
                <Stars
                  value={rating.value}
                  label={t.ratedOutOfCount(rating.value, rating.count)}
                />
                <span>
                  <strong className="font-semibold text-brand-50">
                    {rating.value.toFixed(1)}
                  </strong>{' '}
                  {t.reviewsFrom(rating.count)}
                </span>
              </div>
            )}
          </div>

          {/* Proof card. On mobile it drops below the fold rather than pushing
              the call-to-action down. */}
          {hero.badges?.length ? (
            <div
              className="animate-rise stagger lg:col-span-5"
              style={{ '--i': 5 } as React.CSSProperties}
            >
              <div className="rounded-[var(--radius-xl)] border border-brand-50/12 bg-brand-50/6 p-7 backdrop-blur-md sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-400">
                  {t.whatYouGet}
                </p>
                <ul className="mt-6 space-y-4">
                  {hero.badges.map((badge) => (
                    <li key={badge} className="flex items-start gap-3.5">
                      <span
                        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-500/20"
                        aria-hidden
                      >
                        <Check className="size-3 text-accent-400" strokeWidth={3} />
                      </span>
                      <span className="text-[0.9375rem] leading-snug text-brand-100">
                        {badge}
                      </span>
                    </li>
                  ))}
                </ul>

                {business.accreditations?.length ? (
                  <div className="mt-7 border-t border-brand-50/10 pt-6">
                    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-brand-300">
                      {business.accreditations.slice(0, 3).map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
