/**
 * Custom next/image loader for static export.
 *
 * There is no image optimiser at request time on Cloudflare Pages' free tier,
 * so every size is generated at build time by `pnpm gen-assets` /
 * `pnpm optimize-images` and this loader just points at the right rung.
 *
 * Without it, a phone downloads the full 1920px hero, which on a throttled
 * mobile connection is the difference between a Lighthouse LCP in the nineties
 * and one in the teens.
 *
 * The ladder must match WIDTHS in scripts/lib/images.mjs and deviceSizes +
 * imageSizes in next.config.ts.
 */
const WIDTHS = [256, 384, 480, 768, 1200, 1920]

export default function imageLoader({
  src,
  width,
}: {
  src: string
  width: number
  quality?: number
}): string {
  // Remote images and anything outside the generated client folders is passed
  // straight through — there are no variants on disk to point at.
  if (!src.startsWith('/clients/') || !src.endsWith('.webp')) return src

  const rung = WIDTHS.find((w) => w >= width) ?? WIDTHS[WIDTHS.length - 1]
  return src.replace(/\.webp$/, `-${rung}.webp`)
}
