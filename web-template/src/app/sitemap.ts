import type { MetadataRoute } from 'next'
import { site, isDemo } from '@/lib/site'
import { absoluteUrl } from '@/lib/utils'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  // A demo has nothing to submit — the whole build is noindex.
  if (isDemo) return []

  const now = new Date()

  const staticPaths: Array<[string, number]> = [
    ['/', 1],
    ['/services', 0.9],
    ['/areas', 0.8],
    ['/about', 0.6],
    ['/gallery', 0.5],
    ['/contact', 0.8],
    ['/privacy', 0.2],
  ]

  return [
    ...staticPaths.map(([path, priority]) => ({
      url: absoluteUrl(site.seo.baseUrl, path),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority,
    })),
    ...site.services.map((s) => ({
      url: absoluteUrl(site.seo.baseUrl, `/services/${s.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...site.areas.map((a) => ({
      url: absoluteUrl(site.seo.baseUrl, `/areas/${a.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
