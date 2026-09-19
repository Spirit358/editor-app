#!/usr/bin/env node
/**
 * Turns real client photography into the responsive ladder the site needs.
 *
 *   1. Drop the originals in clients/<slug>/source/
 *      (whatever they sent: 6MB phone JPEGs are fine)
 *   2. pnpm optimize-images --slug <slug>
 *
 * Each source produces <name>.webp plus one file per rung in
 * public/clients/<slug>/. The originals live OUTSIDE public/ on purpose: a
 * static export copies public/ wholesale, so anything in there ships to the
 * CDN. The source folder is also git-ignored — it is the archive of what the
 * client sent, not part of the site.
 *
 * Run this before every build that includes new photos. A 4MB JPEG straight
 * off a phone will sink the Lighthouse score on its own.
 */

import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { writeLadder } from './lib/images.mjs'

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.avif'])

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag)
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}

async function main() {
  const slug = arg('--slug')
  if (!slug) {
    console.error('\nUsage: pnpm optimize-images --slug <slug> [--quality 74]\n')
    process.exit(1)
  }

  const quality = Number(arg('--quality', '74'))
  const clientDir = path.join(process.cwd(), 'public', 'clients', slug)
  const sourceDir = path.join(process.cwd(), 'clients', slug, 'source')

  try {
    await stat(sourceDir)
  } catch {
    console.error(`\nNothing to do — ${path.relative(process.cwd(), sourceDir)} does not exist.`)
    console.error('Put the client\'s original photos there and run this again.\n')
    process.exit(1)
  }

  await mkdir(clientDir, { recursive: true })

  const files = (await readdir(sourceDir)).filter((f) =>
    SUPPORTED.has(path.extname(f).toLowerCase())
  )

  if (!files.length) {
    console.error(`\nNo supported images in clients/${slug}/source/. Looking for: ${[...SUPPORTED].join(', ')}\n`)
    process.exit(1)
  }

  console.log(`\nOptimising ${files.length} image${files.length === 1 ? '' : 's'} for "${slug}"…\n`)

  let total = 0
  for (const file of files) {
    const name = path.basename(file, path.extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const written = await writeLadder(path.join(sourceDir, file), clientDir, name, { quality })
    total += written.length
    console.log(`  ✓ ${file} → ${name}.webp (+${written.length - 1} sizes)`)
  }

  console.log(`
${total} files written to public/clients/${slug}/

Reference them in site.config.ts by the base name only — the loader picks the
right size per device:

    { type: 'image', src: '/clients/${slug}/<name>.webp', alt: '…',
      width: <natural width>, height: <natural height> }
`)
}

main().catch((error) => {
  console.error(`\n${error.message}\n`)
  process.exit(1)
})
