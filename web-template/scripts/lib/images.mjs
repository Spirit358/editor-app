import path from 'node:path'
import sharp from 'sharp'

/**
 * The responsive ladder.
 *
 * Static export has no image optimiser at request time, so every width a
 * browser might ask for has to exist on disk before deploy. These widths are
 * mirrored in next.config.ts (deviceSizes + imageSizes) and in
 * src/lib/image-loader.ts — change one, change all three.
 */
export const WIDTHS = [256, 384, 480, 768, 1200, 1920]

/**
 * Writes `<name>.webp` plus `<name>-<width>.webp` for every rung.
 *
 * Narrower sources are never upscaled: the file is still written at its ladder
 * name so the loader can never point at a missing file, it is just capped at
 * the source's real width.
 */
export async function writeLadder(input, outDir, name, { quality = 74 } = {}) {
  const written = []
  const base = sharp(input)
  const { width: naturalWidth } = await base.metadata()

  const full = path.join(outDir, `${name}.webp`)
  await sharp(input).webp({ quality, effort: 6 }).toFile(full)
  written.push(full)

  for (const width of WIDTHS) {
    const file = path.join(outDir, `${name}-${width}.webp`)
    await sharp(input)
      .resize(width, null, { withoutEnlargement: true, fit: 'inside' })
      // Slightly higher quality on the small rungs: they are what phones get,
      // and webp artefacts show up faster at low resolution.
      .webp({ quality: width <= 480 ? quality + 6 : quality, effort: 6 })
      .toFile(file)
    written.push(file)

    // Once the ladder passes the source width the remaining rungs are
    // identical, but they still have to exist for the loader.
    if (naturalWidth && width >= naturalWidth) {
      for (const bigger of WIDTHS.filter((w) => w > width)) {
        const copy = path.join(outDir, `${name}-${bigger}.webp`)
        await sharp(input).webp({ quality, effort: 6 }).toFile(copy)
        written.push(copy)
      }
      break
    }
  }

  return written
}
