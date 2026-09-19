import { activeConfig } from '@/config/active'
import { stringsFor } from './i18n'
import { telHref, whatsappHref } from './utils'
import type { SiteConfig, Service } from './types'

/**
 * Validates the active config at module load, i.e. at build time, so a missing
 * phone number fails `pnpm build` rather than reaching a client's customers.
 */
function validate(config: SiteConfig): SiteConfig {
  const problems: string[] = []

  const required: Array<[string, unknown]> = [
    ['slug', config.slug],
    ['business.name', config.business?.name],
    ['business.tagline', config.business?.tagline],
    ['contact.phone', config.contact?.phone],
    ['contact.email', config.contact?.email],
    ['contact.address.locality', config.contact?.address?.locality],
    ['seo.baseUrl', config.seo?.baseUrl],
    ['hero.headline', config.hero?.headline],
  ]
  for (const [path, value] of required) {
    if (typeof value !== 'string' || value.trim() === '') {
      problems.push(`${path} is required`)
    }
  }

  if (config.seo?.baseUrl && !/^https?:\/\//.test(config.seo.baseUrl)) {
    problems.push('seo.baseUrl must include the protocol, e.g. https://example.co.uk')
  }
  if (config.seo?.baseUrl?.endsWith('/')) {
    problems.push('seo.baseUrl must not end in a slash')
  }
  if (!config.services?.length) problems.push('at least one service is required')
  if (!config.areas?.length) problems.push('at least one service area is required')

  const seen = new Set<string>()
  for (const s of config.services ?? []) {
    if (seen.has(s.slug)) problems.push(`duplicate service slug "${s.slug}"`)
    seen.add(s.slug)
  }
  const seenAreas = new Set<string>()
  for (const a of config.areas ?? []) {
    if (seenAreas.has(a.slug)) problems.push(`duplicate area slug "${a.slug}"`)
    seenAreas.add(a.slug)
  }

  // A rating in schema.org must be backed by reviews that are actually shown,
  // or Google treats it as spam and can issue a manual action.
  if (config.rating && !config.reviews?.length) {
    problems.push('rating is set but no reviews are present — remove one or the other')
  }

  // Unfilled skeleton markers. A blank field is obvious in review; a page that
  // reads "__BUSINESS NAME__" in a confident serif is not, and sending that to
  // a prospect is worse than sending nothing.
  for (const where of findPlaceholders(config)) {
    problems.push(`${where} still contains a __PLACEHOLDER__ from the skeleton`)
  }

  if (problems.length) {
    throw new Error(
      `Invalid site config (clients/${config.slug ?? '?'}/site.config.ts):\n` +
        problems.map((p) => `  • ${p}`).join('\n')
    )
  }

  return config
}

const PLACEHOLDER = /__[^_]+__/

/** Walks the config and reports the path of every string still holding a marker. */
function findPlaceholders(value: unknown, path = ''): string[] {
  if (typeof value === 'string') {
    return PLACEHOLDER.test(value) ? [path || '(root)'] : []
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => findPlaceholders(item, `${path}[${i}]`))
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) =>
      findPlaceholders(child, path ? `${path}.${key}` : key)
    )
  }
  return []
}

export const site: SiteConfig = validate(activeConfig as SiteConfig)

/** Every non-content string, in the site's language. */
export const t = stringsFor(site.locale)
export const locale = t.lang

export const phoneDisplay = site.contact.phoneDisplay ?? site.contact.phone
const phoneCountry = site.contact.phoneCountry ?? t.phoneCountry

/** tel: link for the main number — one place, so the country logic is not repeated. */
export const phoneHref = telHref(site.contact.phone, phoneCountry)

/** '4.2' in en-GB, '4,2' in pl-PL. */
export function formatRating(value: number) {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)
}

export function waHref(message?: string) {
  return whatsappHref(site.contact.whatsapp ?? site.contact.phone, phoneCountry, message)
}

export const featuredServices: Service[] = site.services.filter(
  (s) => s.featured !== false
)

export function serviceBySlug(slug: string) {
  return site.services.find((s) => s.slug === slug)
}

export function areaBySlug(slug: string) {
  return site.areas.find((a) => a.slug === slug)
}

/** True when the build should be hidden from search engines. */
export const isDemo = site.demo.enabled

export const siteName = site.business.name
export const tradePlural = site.business.tradePlural ?? site.business.name

const place = site.contact.address.locality
const c = site.copy ?? {}

/**
 * Section copy with locale-aware fallbacks. Wrap a fragment in *asterisks* to
 * have it rendered in the accent colour — see <Highlight>.
 */
export const copy = {
  servicesEyebrow: c.servicesEyebrow ?? t.copy.servicesEyebrow,
  servicesTitle: c.servicesTitle ?? t.copy.servicesTitle,
  servicesIntro: c.servicesIntro ?? t.copy.servicesIntro(site.areas.length, place),

  aboutEyebrow: c.aboutEyebrow ?? t.copy.aboutEyebrow,

  reviewsEyebrow: c.reviewsEyebrow ?? t.copy.reviewsEyebrow,
  reviewsTitle: c.reviewsTitle ?? t.copy.reviewsTitle,

  areasEyebrow: c.areasEyebrow ?? t.copy.areasEyebrow,
  areasTitle: c.areasTitle ?? t.copy.areasTitle(place),
  areasIntro: c.areasIntro ?? t.copy.areasIntro,

  galleryEyebrow: c.galleryEyebrow ?? t.copy.galleryEyebrow,
  galleryTitle: c.galleryTitle ?? t.copy.galleryTitle,
  galleryIntro: c.galleryIntro,

  faqEyebrow: c.faqEyebrow ?? t.copy.faqEyebrow,
  faqTitle: c.faqTitle ?? t.copy.faqTitle,
  faqIntro: c.faqIntro ?? t.copy.faqIntro,

  ctaHeading: c.ctaHeading ?? t.copy.ctaHeading,
  ctaSub: c.ctaSub ?? site.contact.emergency?.note ?? t.copy.ctaSub,
}
