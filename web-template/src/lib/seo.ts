import type { Metadata } from 'next'
import { site, t, isDemo, phoneDisplay } from './site'
import { absoluteUrl, schemaDays } from './utils'
import type { Service, ServiceArea } from './types'

const DEFAULT_TITLE =
  site.seo.title ?? `${site.business.name} | ${site.business.tagline}`
const DEFAULT_DESCRIPTION = site.seo.description ?? site.business.description

/** Demo builds must never be indexed under a business's real name. */
const ROBOTS: Metadata['robots'] = isDemo
  ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
  : { index: true, follow: true }

export function buildMetadata(opts: {
  title?: string
  description?: string
  path?: string
  image?: string
} = {}): Metadata {
  const path = opts.path ?? '/'
  const url = absoluteUrl(site.seo.baseUrl, path)
  const title = opts.title ? `${opts.title} | ${site.business.name}` : DEFAULT_TITLE
  const description = opts.description ?? DEFAULT_DESCRIPTION
  const image = opts.image ?? site.seo.ogImage ?? '/images/og.jpg'

  return {
    metadataBase: new URL(site.seo.baseUrl),
    title,
    description,
    alternates: { canonical: url },
    robots: ROBOTS,
    // Generated per client by `pnpm gen-assets`, so the tab icon carries the
    // client's hue rather than a stray Next.js default (and so nothing 404s).
    icons: {
      icon: [{ url: `/clients/${site.slug}/icon.svg`, type: 'image/svg+xml' }],
      apple: [{ url: `/clients/${site.slug}/apple-icon.png`, sizes: '180x180' }],
    },
    openGraph: {
      type: 'website',
      siteName: site.business.name,
      locale: t.ogLocale,
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: site.business.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    other: {
      'format-detection': 'telephone=no',
    },
  }
}

const streetAddress = site.contact.address.hideStreet
  ? undefined
  : site.contact.address.street

/**
 * The LocalBusiness node. This is what wins the map pack, so it carries the
 * NAP, hours, geo, area served and the aggregate rating when one is real.
 */
export function localBusinessSchema() {
  const { business, contact, hours, rating, reviews, social } = site

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': business.type,
    '@id': `${site.seo.baseUrl}/#business`,
    name: business.name,
    legalName: business.legalName,
    description: business.description,
    url: site.seo.baseUrl,
    telephone: contact.phone,
    email: contact.email,
    priceRange: business.priceRange,
    foundingDate: business.foundedYear ? String(business.foundedYear) : undefined,
    image: absoluteUrl(site.seo.baseUrl, site.seo.ogImage ?? '/images/og.jpg'),
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality: contact.address.locality,
      addressRegion: contact.address.region,
      postalCode: contact.address.postcode,
      addressCountry: contact.address.country,
    },
    areaServed: site.areas.map((a) => ({
      '@type': 'City',
      name: a.name,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${business.name} services`,
      itemListElement: site.services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, description: s.short },
      })),
    },
  }

  if (contact.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: contact.geo.lat,
      longitude: contact.geo.lng,
    }
  }

  if (hours?.length) {
    schema.openingHoursSpecification = hours
      .filter((h) => !h.closed)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: schemaDays(h.days),
        opens: h.opens,
        closes: h.closes,
      }))
  }

  if (rating && reviews?.length) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.value,
      reviewCount: rating.count,
      bestRating: 5,
      worstRating: 1,
    }
    schema.review = reviews.slice(0, 8).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      datePublished: r.date,
      reviewBody: r.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }))
  }

  const sameAs = Object.values(social ?? {}).filter(Boolean)
  if (contact.googleMapsUrl) sameAs.push(contact.googleMapsUrl)
  if (sameAs.length) schema.sameAs = sameAs

  return prune(schema)
}

export function serviceSchema(service: Service) {
  return prune({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.short,
    serviceType: service.name,
    provider: { '@id': `${site.seo.baseUrl}/#business` },
    areaServed: site.areas.map((a) => ({ '@type': 'City', name: a.name })),
    url: absoluteUrl(site.seo.baseUrl, `/services/${service.slug}`),
  })
}

export function areaServiceSchema(area: ServiceArea) {
  return prune({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${site.business.tagline} in ${area.name}`,
    description:
      area.blurb ?? `${site.business.name} serving ${area.name} and the surrounding area.`,
    provider: { '@id': `${site.seo.baseUrl}/#business` },
    areaServed: { '@type': 'City', name: area.name },
    url: absoluteUrl(site.seo.baseUrl, `/areas/${area.slug}`),
  })
}

export function faqSchema() {
  if (!site.faqs?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: site.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(site.seo.baseUrl, item.path),
    })),
  }
}

export const contactPoint = {
  phone: site.contact.phone,
  phoneDisplay,
}

/** Drops undefined values so the emitted JSON-LD stays clean. */
function prune<T extends Record<string, unknown>>(obj: T): T {
  for (const key of Object.keys(obj)) {
    const value = obj[key]
    if (value === undefined || value === null) {
      delete obj[key]
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      prune(value as Record<string, unknown>)
    }
  }
  return obj
}
