import { Fraunces, Inter } from 'next/font/google'

/**
 * THE TWO LINES TO CHANGE PER CLIENT.
 *
 * Fonts have to be static imports for next/font to self-host and subset them,
 * so they live here rather than in site.config.ts. `pnpm new-site` can rewrite
 * this file. Pairings that have tested well:
 *
 *   Trades, established, warm     Fraunces      + Inter          (default)
 *   Trades, modern, technical     Bricolage Grotesque + Inter
 *   Barbers, salons               Instrument Serif + Geist
 *   Takeaways, cafes              Poppins       + Inter
 *   Professional services         Newsreader    + Public Sans
 *
 * Keep it to two families. A third is almost always a mistake.
 */

export const displayFont = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display-family',
  // Variable weight axis, plus Fraunces' own SOFT and optical-size axes:
  // opsz tightens the serifs at display sizes, SOFT rounds the terminals just
  // enough to stay friendly. Axes require the variable weight, not a list.
  weight: 'variable',
  axes: ['SOFT', 'opsz'],
  preload: true,
})

export const bodyFont = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body-family',
  preload: true,
})

export const fontClassNames = `${displayFont.variable} ${bodyFont.variable}`
