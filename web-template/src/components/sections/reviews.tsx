import { site, copy, t, formatRating } from '@/lib/site'
import { SectionHeading } from './section-heading'
import { Stars } from '@/components/stars'

/** Only when real review texts exist. Quotes in a ruled grid, no cards. */
export function Reviews() {
  const { reviews, rating } = site
  if (!reviews?.length) return null

  return (
    <section id="reviews" className="section rule-b">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={copy.reviewsEyebrow} title={copy.reviewsTitle} />
          {rating && (
            <p className="flex items-center gap-3">
              <span className="display text-4xl text-ink">{formatRating(rating.value)}</span>
              <span className="text-sm text-ink-2">
                <Stars value={rating.value} label={t.ratedOutOf(rating.value)} />
                <span className="mt-0.5 block">{t.reviewsCount(rating.count)}</span>
              </span>
            </p>
          )}
        </div>

        <ul className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <li key={i} className="rule-strong-t pt-5">
              <Stars value={review.rating} size={13} label={t.outOfFive(review.rating)} />
              <blockquote className="mt-4 text-[0.9375rem] leading-relaxed text-ink-2">{review.text}</blockquote>
              <p className="mt-4 text-sm">
                <span className="font-medium text-ink">{review.author}</span>
                {review.source && <span className="text-ink-3"> · {review.source}</span>}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
