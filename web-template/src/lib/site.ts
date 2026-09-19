import { activeConfig } from '@/config/active'
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

export const phoneDisplay = site.contact.phoneDisplay ?? site.contact.phone

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

const place = site.contact.address.locality
const c = site.copy ?? {}

/**
 * Section copy with neutral fallbacks. Wrap a fragment in *asterisks* to have
 * it rendered in the accent colour — see <Highlight>.
 */
export const copy = {
  servicesEyebrow: c.servicesEyebrow ?? 'What we do',
  servicesTitle: c.servicesTitle ?? 'Our services',
  servicesIntro:
    c.servicesIntro ??
    `One team across ${site.areas.length} areas of ${place}, with the same fixed-price approach whatever the job.`,

  aboutEyebrow: c.aboutEyebrow ?? "Who you're calling",

  reviewsEyebrow: c.reviewsEyebrow ?? 'In their words',
  reviewsTitle: c.reviewsTitle ?? 'What customers say',

  areasEyebrow: c.areasEyebrow ?? 'Where we work',
  areasTitle: c.areasTitle ?? `Covering ${place} and the areas around it`,
  areasIntro:
    c.areasIntro ??
    'If you are just outside one of these, ring anyway — we will tell you straight away if we are the wrong people for the job.',

  galleryEyebrow: c.galleryEyebrow ?? 'Recent work',
  galleryTitle: c.galleryTitle ?? 'A few jobs we were happy to photograph',
  galleryIntro: c.galleryIntro,

  faqEyebrow: c.faqEyebrow ?? 'Before you ring',
  faqTitle: c.faqTitle ?? 'Straight answers',
  faqIntro:
    c.faqIntro ??
    'The questions we get asked most, answered the way we would answer them on the phone.',

  ctaHeading: c.ctaHeading ?? 'Got a job that needs doing?',
  ctaSub:
    c.ctaSub ??
    site.contact.emergency?.note ??
    'Tell us what has happened and we will give you a straight answer on price and timing.',
}
