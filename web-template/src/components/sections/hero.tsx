import Image from 'next/image'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import { site, t, phoneHref, formatRating } from '@/lib/site'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Stars } from '@/components/stars'
import { Illustration } from '@/components/illustration'

/**
 * Split hero on paper. Words on the left, aligned to the page grid; the
 * equipment on the right in a tinted panel that bleeds to the viewport edge
 * on wide screens. A photograph fills the panel when the config has one;
 * otherwise the drawn illustration does. No overlay, no glow, nothing fades.
 */
export function Hero() {
  const { hero, rating, googleRating } = site
  const proof = rating ?? googleRating

  return (
    <section className="rule-b lg:grid lg:grid-cols-[minmax(0,58%)_minmax(0,42%)]">
      {/* Left padding on wide screens mirrors container-page's gutter so the
          text stays on the grid while the panel leaves it. */}
      <div className="container-page lg:max-w-none lg:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] lg:pr-14">
        <div className="py-10 sm:py-14 lg:py-24">
          {hero.eyebrow && <p className="label">{hero.eyebrow}</p>}

          <h1 className="display mt-4 text-5xl text-ink lg:text-6xl">
            {hero.headline}
            {hero.headlineAccent && (
              <>
                {' '}
                <span className="text-brand">{hero.headlineAccent}</span>
              </>
            )}
          </h1>

          <p className="measure mt-6 text-lg leading-relaxed text-ink-2 sm:text-xl">{hero.sub}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {hero.ctas.map((cta) => {
              const isTel = cta.kind === 'tel'
              const href = isTel ? phoneHref : cta.href
              const className = cn(
                buttonVariants({ variant: isTel ? 'accent' : cta.kind === 'primary' ? 'primary' : 'outline', size: 'xl' }),
                'w-full sm:w-auto'
              )
              return isTel || href.startsWith('http') ? (
                <a key={cta.label} href={href} className={className} data-cta="hero-call">
                  {isTel && <Phone aria-hidden strokeWidth={1.75} />}
                  <span className={isTel ? 'tabular' : undefined}>{cta.label}</span>
                </a>
              ) : (
                <Link key={cta.label} href={href} className={className}>
                  {cta.label}
                </Link>
              )
            })}
          </div>

          {proof && (
            <p className="mt-6 flex items-center gap-3 text-sm text-ink-2">
              <Stars value={proof.value} label={t.ratedOutOfCount(proof.value, proof.count)} />
              {rating ? (
                <span>
                  <strong className="font-semibold text-ink">{formatRating(rating.value)}</strong> {t.reviewsFrom(rating.count)}
                </span>
              ) : (
                <a href={googleRating!.url} target="_blank" rel="noopener noreferrer" className="link">
                  <strong className="font-semibold">{formatRating(googleRating!.value)}</strong>{' '}
                  {t.googleReviews(googleRating!.count)}
                </a>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="container-page pb-10 lg:max-w-none lg:p-0">
        {hero.media?.type === 'image' ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] lg:aspect-auto lg:h-full lg:min-h-[32rem] lg:rounded-none">
            <Image src={hero.media.src} alt={hero.media.alt} fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
          </div>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center rounded-[var(--radius-md)] bg-brand-tint p-6 text-brand sm:p-10 lg:aspect-auto lg:h-full lg:min-h-[32rem] lg:rounded-none lg:p-16">
            <Illustration kind={hero.illustration ?? 'boiler'} className="max-h-full w-full max-w-[36rem]" />
          </div>
        )}
      </div>
    </section>
  )
}
