import { Fraunces, Inter } from 'next/font/google'

/**
 * Pairing: Fraunces + Inter.
 *
 * Trades, established, warm. A soft serif display face reads family-run and
 * long-standing, which is what most trades businesses are actually selling.
 *
 * Fraunces' optical-size axis tightens the serifs at display sizes; SOFT
 * rounds the terminals just enough to stay friendly. Axes require the variable
 * weight rather than a weight list.
 */
export const displayFont = Fraunces({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-display-family',
  weight: 'variable',
  axes: ['SOFT', 'opsz'],
  preload: true,
})

// Keep the body font preloaded — see the note in bricolage-inter.ts for what
// happens to CLS when it is not.
export const bodyFont = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body-family',
  preload: true,
})

export const fontClassNames = `${displayFont.variable} ${bodyFont.variable}`
