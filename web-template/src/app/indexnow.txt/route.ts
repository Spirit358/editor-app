import { site } from '@/lib/site'

export const dynamic = 'force-static'

/**
 * The IndexNow key, at a fixed path the deploy scripts pass as keyLocation.
 * Empty when the site has no key, which the scripts treat as "do not ping".
 */
export function GET() {
  return new Response(site.seo.indexNowKey ?? '', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
