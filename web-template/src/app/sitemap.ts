import type { MetadataRoute } from 'next'
import { site, isDemo, hasGallery } from '@/lib/site'
import { absoluteUrl } from '@/lib/utils'

export const dynamic = 'force-static'

/**
 * The static export is built with `trailingSlash: true`, and Next adds that
 * slash to canonical URLs for us — but not to the ones we hand the sitemap.
 * Without this, every entry but the homepage points at a 301 to its own
 * canonical form.
 */
function pageUrl(path: string) {
  const url = absoluteUrl(site.seo.baseUrl, path)
  return url.endsWith('/') ? url : `${url}/`
}

export default function sitemap(): MetadataRoute.Sitemap {
  // A demo has nothing to submit — the whole build is noindex.
  if (isDemo) return []

  const now = new Date()

  const staticPaths: Array<[string, number]> = [
    ['/', 1],
    ['/services', 0.9],
    ['/areas', 0.8],
    ['/about', 0.6],
    ...(hasGallery ? ([['/gallery', 0.5]] as Array<[string, number]>) : []),
    ['/contact', 0.8],
    ['/privacy', 0.2],
  ]

  return [
    ...staticPaths.map(([path, priority]) => ({
      url: pageUrl(path),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority,
    })),
    ...site.services.map((s) => ({
      url: pageUrl(`/services/${s.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...site.areas.map((a) => ({
      url: pageUrl(`/areas/${a.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
