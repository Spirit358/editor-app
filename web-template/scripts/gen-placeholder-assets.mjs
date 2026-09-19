#!/usr/bin/env node
/**
 * Generates on-brand placeholder imagery for a client folder.
 *
 * These are NOT a substitute for real photography. They exist so a demo can be
 * built and reviewed the moment the config is written, before the client has
 * sent any photos and before anything has been through Higgsfield. Swap every
 * one of them before a site goes live.
 *
 * Usage:
 *   node scripts/gen-placeholder-assets.mjs --slug demo-plumber --hue 224 --accent 38
 *
 * Colours are derived from the same OKLCH hue the site is themed with, so the
 * placeholders never fight the palette.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'
import { writeLadder } from './lib/images.mjs'

// ---------------------------------------------------------------------------
// OKLCH → sRGB hex. librsvg has no oklch() support, so the conversion has to
// happen here to keep placeholders on the same palette as the CSS.
// ---------------------------------------------------------------------------

function oklch(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3

  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]

  const hex = lin
    .map((c) => {
      const srgb = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(c, 0), 1 / 2.4) - 0.055
      const v = Math.round(Math.min(1, Math.max(0, srgb)) * 255)
      return v.toString(16).padStart(2, '0')
    })
    .join('')

  return `#${hex}`
}

// ---------------------------------------------------------------------------
// Deterministic pseudo-random, so re-running produces identical assets and git
// does not churn.
// ---------------------------------------------------------------------------

function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/**
 * Builds an abstract scene: a dark base, two coloured light sources, a few
 * long soft strokes suggesting depth, and film grain. It reads as moody
 * detail photography rather than a stock gradient.
 */
function scene({ width, height, hue, accentHue, seed, mood = 'dark' }) {
  const rand = rng(seed)
  const max = Math.max(width, height)

  // Nudge the hue per image so a gallery of six does not look like one image
  // repeated, while everything stays inside the brand's range.
  const h = hue + (rand() - 0.5) * 18
  const ah = accentHue + (rand() - 0.5) * 14

  const light = mood === 'light'
  const base = light ? oklch(0.36, 0.05, h) : oklch(0.23, 0.04, h)
  const deep = light ? oklch(0.2, 0.035, h) : oklch(0.13, 0.03, h)
  const glowA = oklch(0.74, 0.14, ah)
  const glowB = oklch(0.66, 0.14, h)
  const sheen = oklch(0.88, 0.06, ah)

  // Long soft strokes. At low opacity over the glows they read as specular
  // highlights on metal rather than as drawn lines.
  const strokes = Array.from({ length: 6 }, () => {
    const x1 = rand() * width
    const y1 = -height * 0.25 + rand() * height * 0.3
    const x2 = x1 + (rand() - 0.4) * width * 0.8
    const y2 = height * (1.15 + rand() * 0.2)
    const w = 3 + rand() * 16
    const o = 0.1 + rand() * 0.22
    return `<line x1="${x1.toFixed(0)}" y1="${y1.toFixed(0)}" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" stroke="${sheen}" stroke-width="${w.toFixed(1)}" stroke-opacity="${o.toFixed(3)}" stroke-linecap="round" filter="url(#soften)"/>`
  }).join('')

  const orbs = Array.from({ length: 4 }, (_, i) => {
    const cx = rand() * width
    const cy = rand() * height
    const r = (0.22 + rand() * 0.32) * max
    return `<ellipse cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" rx="${r.toFixed(0)}" ry="${(r * (0.65 + rand() * 0.6)).toFixed(0)}" fill="url(#${i % 2 === 0 ? 'glowA' : 'glowB'})"/>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="base" x1="0" y1="0" x2="0.65" y2="1">
      <stop offset="0%" stop-color="${base}"/>
      <stop offset="100%" stop-color="${deep}"/>
    </linearGradient>
    <radialGradient id="glowA" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${glowA}" stop-opacity="0.78"/>
      <stop offset="55%" stop-color="${glowA}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${glowA}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${glowB}" stop-opacity="0.8"/>
      <stop offset="55%" stop-color="${glowB}" stop-opacity="0.24"/>
      <stop offset="100%" stop-color="${glowB}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="45%" r="72%">
      <stop offset="55%" stop-color="${deep}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${deep}" stop-opacity="0.75"/>
    </radialGradient>
    <filter id="soften" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="${(max / 70).toFixed(1)}"/>
    </filter>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="${seed}"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#base)"/>
  ${orbs}
  ${strokes}
  <rect width="${width}" height="${height}" fill="url(#vignette)"/>
  <rect width="${width}" height="${height}" filter="url(#grain)" opacity="0.1"/>
</svg>`
}

// ---------------------------------------------------------------------------

/** Used only when the client has no imagery.json yet. */
const DEFAULT_ASSETS = [
  { name: 'hero', width: 1920, height: 1280, seed: 11 },
  { name: 'about', width: 1200, height: 1400, seed: 23 },
  { name: 'service-emergency', width: 1200, height: 900, seed: 31 },
  { name: 'service-boiler', width: 1200, height: 900, seed: 47 },
  { name: 'service-bathroom', width: 1200, height: 900, seed: 59, mood: 'light' },
  { name: 'gallery-1', width: 1200, height: 900, seed: 71 },
  { name: 'gallery-2', width: 1200, height: 900, seed: 83, mood: 'light' },
  { name: 'gallery-3', width: 1200, height: 900, seed: 97 },
  { name: 'gallery-4', width: 1200, height: 900, seed: 109 },
  { name: 'gallery-5', width: 1200, height: 900, seed: 127, mood: 'light' },
  { name: 'gallery-6', width: 1200, height: 900, seed: 139 },
]

/** Pixel sizes for the aspect ratios imagery.json can ask for. */
const RATIO_SIZES = {
  '3:2': [1920, 1280],
  '16:9': [1920, 1080],
  '21:9': [2100, 900],
  '4:3': [1200, 900],
  '1:1': [1200, 1200],
  '3:4': [1200, 1600],
  '2:3': [1200, 1800],
  '9:16': [900, 1600],
}

/**
 * The asset list comes from the client's imagery.json when it exists, so the
 * placeholders carry exactly the names the config references and the real
 * generation later overwrites them one-for-one. A placeholder set that does
 * not match the config leaves broken images on every page it missed.
 */
async function assetsFor(slug) {
  const specFile = path.join(process.cwd(), 'clients', slug, 'imagery.json')
  try {
    const spec = JSON.parse(await readFile(specFile, 'utf8'))
    return spec.images.map((img, i) => {
      const ratio = img.aspect_ratio ?? spec.defaults?.aspect_ratio ?? '4:3'
      const [width, height] = RATIO_SIZES[ratio] ?? RATIO_SIZES['4:3']
      return { name: img.name, width, height, seed: 11 + i * 17, mood: i % 3 === 2 ? 'light' : 'dark' }
    })
  } catch {
    return DEFAULT_ASSETS
  }
}

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag)
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}

async function main() {
  const slug = arg('--slug', 'demo-plumber')
  const hue = Number(arg('--hue', '224'))
  const accentHue = Number(arg('--accent', '38'))
  const outDir = path.join(process.cwd(), 'public', 'clients', slug)

  await mkdir(outDir, { recursive: true })

  const ASSETS = await assetsFor(slug)
  let count = 0
  for (const asset of ASSETS) {
    const svg = scene({ ...asset, hue, accentHue })
    // Rasterise once at full size, then let writeLadder produce every rung.
    const source = await sharp(Buffer.from(svg)).png().toBuffer()
    const written = await writeLadder(source, outDir, asset.name)
    count += written.length
    console.log(`  ✓ ${asset.name}.webp (+${written.length - 1} sizes)`)
  }

  // Favicon + Apple touch icon. A geometric mark rather than a letterform:
  // it stays legible at 16px and needs no font on the machine building it.
  // Replace with the client's real logo the moment they send one.
  const markBg = oklch(0.26, 0.05, hue)
  const markFg = oklch(0.74, 0.14, accentHue)
  const mark = (size, radius) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${radius}" fill="${markBg}"/>
  <path d="M32 14c7 9 11 14.5 11 20a11 11 0 0 1-22 0c0-5.5 4-11 11-20z" fill="${markFg}"/>
</svg>`

  await writeFile(path.join(outDir, 'icon.svg'), mark(64, 14), 'utf8')
  console.log(`  ✓ public/clients/${slug}/icon.svg`)

  await sharp(Buffer.from(mark(180, 0)))
    .resize(180, 180)
    .png()
    .toFile(path.join(outDir, 'apple-icon.png'))
  console.log(`  ✓ public/clients/${slug}/apple-icon.png`)

  // Open Graph card — 1200×630 is what every platform crops to.
  const ogSvg = scene({ width: 1200, height: 630, hue, accentHue, seed: 5 })
  const ogFile = path.join(outDir, 'og.jpg')
  await sharp(Buffer.from(ogSvg)).jpeg({ quality: 82, mozjpeg: true }).toFile(ogFile)
  console.log(`  ✓ ${path.relative(process.cwd(), ogFile)}`)

  // A README in the folder so nobody ships these by accident.
  await writeFile(
    path.join(outDir, 'README.md'),
    `# Placeholder imagery — ${slug}\n\nGenerated by \`pnpm gen-assets --slug ${slug}\`.\n\nThese are abstract, on-brand stand-ins so the demo can be built before real\nphotography exists. **Replace every one of them before the site goes live.**\n\nSources, in order of preference:\n\n1. The client's own photos of their work (ask for them at the first meeting).\n2. Higgsfield for hero imagery and short loops.\n3. Licensed stock, as a last resort.\n\nHero video loops: slow, dark, 4–8 seconds, seamless, no text, no faces.\n`,
    'utf8'
  )

  console.log(
    `\nDone. ${count + 1} files (${ASSETS.length} images across the responsive ladder, plus the OG card) in public/clients/${slug}/`
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
