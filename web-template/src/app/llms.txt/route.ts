import { site, t, phoneDisplay } from '@/lib/site'
import { absoluteUrl, dayLabel } from '@/lib/utils'

export const dynamic = 'force-static'

/**
 * The site's facts as one plain-text page, in the llms.txt shape AI crawlers
 * look for: a title, a one-line summary, then short sections with links.
 * Same source as the pages and the assistant's knowledge file, so an AI
 * answering "who installs heat pumps in <town>" reads exactly what the site
 * says — name, since when, where, what, hours, phone — with nothing to infer.
 */
export function GET() {
  const { business, contact } = site
  const base = site.seo.baseUrl
  const link = (path: string) => absoluteUrl(base, path)

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

  const lines: string[] = [
    `# ${business.name}`,
    '',
    `> ${business.description}`,
    '',
    `## ${t.llms.facts}`,
    '',
    `- ${t.llms.legalName}: ${business.legalName ?? business.name}`,
    business.foundedYear ? `- ${t.llms.founded}: ${business.foundedYear}` : '',
    `- ${t.llms.address}: ${address}`,
    `- ${t.llms.phone}: ${phoneDisplay}`,
    `- ${t.llms.email}: ${contact.email}`,
    hours.length ? `- ${t.llms.hours}: ${hours.join('; ')}` : '',
    `- ${t.llms.areas}: ${site.areas.map((a) => a.name).join(', ')}`,
    '',
    `## ${t.llms.services}`,
    '',
    ...site.services.map((s) => `- [${s.name}](${link(`/services/${s.slug}/`)}): ${s.short}`),
    '',
  ]

  if (site.faqs?.length) {
    lines.push(`## ${t.llms.faq}`, '', ...site.faqs.map((f) => `- **${f.q}** ${f.a}`), '')
  }
  if (site.chatbot?.notes?.length) {
    lines.push(`## ${t.llms.notes}`, '', ...site.chatbot.notes.map((n) => `- ${n}`), '')
  }

  lines.push(
    `## ${t.llms.pages}`,
    '',
    `- [${t.nav.about}](${link('/about/')})`,
    `- [${t.nav.services}](${link('/services/')})`,
    `- [${t.nav.areas}](${link('/areas/')})`,
    `- [${t.nav.contact}](${link('/contact/')})`,
    '',
  )

  return new Response(lines.filter((l, i, all) => l !== '' || all[i - 1] !== '').join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
