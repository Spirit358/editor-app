import { site, t, primaryHours, formatRating } from '@/lib/site'

/**
 * A ruled strip of facts under the hero: founded, address, hours, rating.
 * Facts over adjectives — this is the trust layer, and it is text.
 */
export function Facts() {
  const { business, contact, googleRating, rating } = site
  const items: Array<{ text: string; href?: string }> = []

  if (business.foundedYear) items.push({ text: t.facts.since(business.foundedYear) })
  items.push({
    text: [
      !contact.address.hideStreet && contact.address.street,
      contact.address.locality,
    ]
      .filter(Boolean)
      .join(', '),
    href: contact.googleMapsUrl,
  })
  if (primaryHours) items.push({ text: primaryHours })
  if (rating) {
    items.push({ text: t.facts.rating(formatRating(rating.value), rating.count) })
  } else if (googleRating) {
    items.push({
      text: t.facts.googleRating(formatRating(googleRating.value), googleRating.count),
      href: googleRating.url,
    })
  }

  return (
    <section className="rule-b bg-paper-2" aria-label="Facts">
      <div className="container-page">
        <ul className="grid grid-cols-2 divide-x divide-rule lg:grid-cols-4">
          {items.map((item, i) => (
            <li
              key={i}
              className="tabular px-4 py-4 text-sm text-ink-2 first:pl-0 sm:px-6 [&:nth-child(3)]:border-l-0 lg:[&:nth-child(3)]:border-l"
            >
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="link-quiet hover:text-ink">
                  {item.text}
                </a>
              ) : (
                item.text
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
