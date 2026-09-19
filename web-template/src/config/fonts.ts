/**
 * Which font pairing this build uses.
 *
 * next/font needs static imports, so the choice cannot live in site.config.ts
 * directly. Instead the config names a pairing in `brand.fonts` and
 * `pnpm use-site` rewrites this one line to match. Pairings live in src/fonts/.
 *
 *   fraunces-inter     trades, established, warm
 *   bricolage-inter    trades, modern, technical
 */
export * from '@/fonts/bricolage-inter'
