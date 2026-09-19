import type { NextConfig } from 'next'

/**
 * Two deploy modes.
 *
 *   STATIC (default) — `output: 'export'` produces a folder of static files.
 *     Deploy free to Cloudflare Pages, Netlify, GitHub Pages, anywhere.
 *     Contact form posts to the third-party endpoint in `site.config.ts`.
 *     This is the default because Vercel's Hobby tier forbids commercial use
 *     and Cloudflare Pages' free tier allows it. See DECISIONS.md.
 *
 *   SERVER — set `SITE_MODE=server` to keep the Node server (Vercel Pro etc.).
 *     Enables next/image optimisation and server-side form handling.
 */
const isStatic = process.env.SITE_MODE !== 'server'

const nextConfig: NextConfig = {
  output: isStatic ? 'export' : undefined,
  trailingSlash: isStatic,
  images: {
    // No optimiser runs at request time on a static host, so every width is
    // generated at build time and a custom loader points at the right one.
    // These lists must match WIDTHS in scripts/lib/images.mjs and the ladder
    // in src/lib/image-loader.ts.
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    deviceSizes: [480, 768, 1200, 1920],
    imageSizes: [256, 384],
  },
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // Inlines the stylesheet into the document instead of a render-blocking
    // <link>. On a throttled phone that is one whole round trip removed from
    // first paint, which is most of the gap between a 91 and a 98 on mobile.
    inlineCss: true,
  },
}

export default nextConfig
