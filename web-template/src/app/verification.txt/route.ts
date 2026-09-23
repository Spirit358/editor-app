import { site } from '@/lib/site'

export const dynamic = 'force-static'

/**
 * The name of the Search Console "HTML file" for this site, if that method
 * was used, for the deploy scripts to write beside the pages. Empty
 * otherwise. Public by nature — the file it names is public too.
 */
export function GET() {
  return new Response(site.seo.verification?.googleFile ?? '', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
