import { Bricolage_Grotesque, Inter } from 'next/font/google'

/**
 * Pairing: Bricolage Grotesque + Inter.
 *
 * Trades, modern, technical. Bricolage has real character in the display
 * sizes — narrow-ish, sharp counters — without tipping into novelty.
 *
 * Only the optical-size axis is requested. The width axis roughly doubles the
 * file (128 KB → ~60 KB per subset without it) and nothing here uses
 * font-stretch, so it was pure weight on the largest contentful paint.
 *
 * `latin-ext` is not optional: without it Polish, Czech and Turkish diacritics
 * fall back to the system font mid-word.
 */
export const displayFont = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-display-family',
  weight: 'variable',
  axes: ['opsz'],
  preload: true,
})

/**
 * Both fonts are preloaded, and the body font must stay that way. Turning its
 * preload off was tried to give the hero image the bandwidth on mobile: the
 * homepage did not measurably improve, and every service page on desktop
 * dropped to 84 with CLS 0.40, because Polish paragraphs paint in the
 * size-adjusted fallback and re-flow when Inter arrives. The metric
 * adjustment is not close enough for diacritics and long compounds.
 */
export const bodyFont = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body-family',
  preload: true,
})

export const fontClassNames = `${displayFont.variable} ${bodyFont.variable}`
