import type { MetadataRoute } from 'next'
import { site, isDemo } from '@/lib/site'
import { absoluteUrl } from '@/lib/utils'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  // Belt and braces with the noindex meta tag. A demo carries a real
  // business's name and branding, so it must never be crawlable.
  if (isDemo) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absoluteUrl(site.seo.baseUrl, '/sitemap.xml'),
    host: site.seo.baseUrl,
  }
}
