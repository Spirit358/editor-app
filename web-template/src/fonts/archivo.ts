import { Archivo } from 'next/font/google'

/**
 * Pairing: Archivo alone.
 *
 * One family, hierarchy by size, weight and width. Archivo's width axis runs
 * from condensed to expanded, so headlines set narrow and heavy — signage,
 * catalogue covers — while body text stays at normal width. No second face
 * to argue with it, and one fewer font family to download.
 *
 * `latin-ext` is not optional: without it Polish, Czech and Turkish diacritics
 * fall back to the system font mid-word.
 */
export const displayFont = Archivo({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-display-family',
  weight: 'variable',
  axes: ['wdth'],
  preload: true,
})

// Same family for body copy; globals.css points --font-sans at the display
// variable, so `bodyFont` only exists to satisfy the pairing contract.
export const bodyFont = displayFont

export const fontClassNames = displayFont.variable
