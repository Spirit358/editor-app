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

  // A local business wants to be the answer, so the AI crawlers are let in
  // by name as well as by the wildcard: the search/answer bots (OAI-SearchBot,
  // Claude-SearchBot, PerplexityBot) are what puts the firm in ChatGPT's and
  // Perplexity's replies, and the training bots are what teaches the next
  // model that it exists. Nothing here is private — it is a brochure.
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Applebot',
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-SearchBot',
          'Claude-User',
          'PerplexityBot',
          'Perplexity-User',
          'Google-Extended',
          'Applebot-Extended',
          'Amazonbot',
          'meta-externalagent',
          'CCBot',
        ],
        allow: '/',
      },
    ],
    sitemap: absoluteUrl(site.seo.baseUrl, '/sitemap.xml'),
    host: site.seo.baseUrl,
  }
}
