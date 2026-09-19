import { Quote } from 'lucide-react'
import { site, copy, t } from '@/lib/site'
import { SectionHeading } from './section-heading'
import { Reveal } from '@/components/reveal'
import { Stars } from '@/components/stars'
import { Highlight } from '@/components/highlight'

export function Reviews() {
  const { reviews, rating } = site
  if (!reviews?.length) return null

  return (
    <section id="reviews" className="section-y bg-surface">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow={copy.reviewsEyebrow}
            title={<Highlight text={copy.reviewsTitle} />}
          />

          {rating && (
            <Reveal delay={100}>
              <div className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-line bg-surface-2 px-6 py-4">
                <span className="font-display text-4xl tabular-nums text-brand-800">
                  {rating.value.toFixed(1)}
                </span>
                <span className="text-sm">
                  <Stars value={rating.value} label={t.ratedOutOf(rating.value)} />
                  <span className="mt-1 block text-muted">
                    {t.reviewsCount(rating.count)}
                  </span>
                </span>
              </div>
            </Reveal>
          )}
        </div>

        {/* Columns rather than a grid so uneven review lengths pack tightly
            instead of leaving ragged whitespace under the short ones. */}
        <div className="mt-14 gap-6 sm:columns-2 lg:columns-3">
          {reviews.map((review, i) => (
            <Reveal key={i} delay={(i % 3) * 80}>
              <figure className="mb-6 break-inside-avoid rounded-[var(--radius-lg)] border border-line bg-surface-2 p-7">
                <Quote
                  className="size-7 text-brand-200"
                  aria-hidden
                  strokeWidth={1.5}
                />
                <blockquote className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {review.text}
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-5">
                  <div>
                    <span className="block text-sm font-medium text-ink">
                      {review.author}
                    </span>
                    {review.source && (
                      <span className="mt-0.5 block text-xs text-muted">
                        {t.via} {review.source}
                      </span>
                    )}
                  </div>
                  <Stars value={review.rating} size={14} label={t.outOfFive(review.rating)} />
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
