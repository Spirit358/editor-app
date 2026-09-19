import { site, t, phoneDisplay, phoneHref } from '@/lib/site'
import { absoluteUrl, dayLabel } from '@/lib/utils'
import type { Knowledge } from '@/components/chat/knowledge'

export const dynamic = 'force-static'

/**
 * Everything the assistant is allowed to know, as one static file.
 *
 * The widget reads it for the quick replies and FAQ matching; chat.php reads
 * the same file from disk to build the model's system prompt. One source, so
 * the model can never know something the page does not say — and a retainer
 * edit to site.config.ts updates the assistant on the next deploy with no
 * change to the PHP.
 */
export function GET() {
  const { business, contact } = site

  const address = [
    !contact.address.hideStreet && contact.address.street,
    [contact.address.postcode, contact.address.locality].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join(', ')

  const hours = (site.hours ?? []).map((h) =>
    h.closed
      ? `${dayLabel(h.days, t.days)}: ${t.closed}`
      : `${dayLabel(h.days, t.days)} ${h.opens}–${h.closes}`,
  )

  const knowledge: Knowledge = {
    locale: t.lang,
    baseUrl: site.seo.baseUrl,
    business: {
      name: business.name,
      legalName: business.legalName,
      foundedYear: business.foundedYear,
      description: business.description,
    },
    contact: {
      phone: phoneDisplay,
      phoneHref,
      email: contact.email,
      address,
      mapsUrl: contact.googleMapsUrl,
    },
    hours,
    services: site.services.map((s) => ({
      name: s.name,
      short: s.short,
      url: absoluteUrl(site.seo.baseUrl, `/services/${s.slug}/`),
    })),
    areas: site.areas.map((a) => a.name),
    faqs: (site.faqs ?? []).map(({ q, a }) => ({ q, a })),
    notes: site.chatbot?.notes ?? [],
  }

  return Response.json(knowledge)
}
