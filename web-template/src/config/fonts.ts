/**
 * Which font pairing this build uses.
 *
 * next/font needs static imports, so the choice cannot live in site.config.ts
 * directly. Instead the config names a pairing in `brand.fonts` and
 * `pnpm use-site` rewrites this one line to match. Pairings live in src/fonts/.
 *
 *   archivo            one family, width axis for hierarchy — the default
 *   fraunces-inter     serif display, warm
 *   bricolage-inter    grotesk display, technical
 */
export * from '@/fonts/archivo'
