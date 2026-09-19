#!/usr/bin/env node
/**
 * Visual QA. Serves the exported site and screenshots every route at phone
 * and desktop width, so a design pass can be reviewed as images rather than by
 * scrolling a browser.
 *
 *   pnpm build && node scripts/shoot.mjs
 *   node scripts/shoot.mjs --routes / /contact --out .qa
 *
 * Uses the Chromium that Playwright already has on the machine — set
 * CHROME_PATH if it lives somewhere unusual.
 */

import { stat, mkdir } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { chromium } from 'playwright-core'
import { serveStatic, discoverRoutes, CHROME_PATH } from './lib/serve.mjs'

const ROOT = process.cwd()
const OUT_DIR = path.join(ROOT, 'out')

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844, scale: 2 },
  { name: 'desktop', width: 1440, height: 900, scale: 1 },
]

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag)
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}

function argList(flag) {
  const i = process.argv.indexOf(flag)
  if (i === -1) return null
  const values = []
  for (let j = i + 1; j < process.argv.length && !process.argv[j].startsWith('--'); j++) {
    values.push(process.argv[j])
  }
  return values.length ? values : null
}

async function main() {
  try {
    await stat(OUT_DIR)
  } catch {
    console.error('\nNo out/ folder. Run `pnpm build` first.\n')
    process.exit(1)
  }

  const outDir = path.resolve(ROOT, arg('--out', '.qa'))
  await mkdir(outDir, { recursive: true })

  const server = await serveStatic(OUT_DIR)
  const { port } = server.address()
  const base = `http://127.0.0.1:${port}`

  const routes = argList('--routes') ?? (await discoverRoutes(OUT_DIR)).sort()

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--font-render-hinting=none'],
  })

  console.log(`\nShooting ${routes.length} routes × ${VIEWPORTS.length} widths…\n`)

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.scale,
      reducedMotion: 'reduce', // capture end states, not mid-animation
    })
    const page = await context.newPage()

    for (const route of routes) {
      const url = `${base}${route === '/' ? '/' : `${route}/`}`
      await page.goto(url, { waitUntil: 'networkidle' })

      // Scroll the whole page so every IntersectionObserver reveal has fired
      // before the shot, then return to the top.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 40))
        }
        window.scrollTo(0, 0)
        await new Promise((r) => setTimeout(r, 120))
      })

      const name = route === '/' ? 'home' : route.slice(1).replace(/\//g, '_')
      const file = path.join(outDir, `${name}--${viewport.name}.png`)
      await page.screenshot({ path: file, fullPage: true })
      console.log(`  ✓ ${path.relative(ROOT, file)}`)
    }

    await context.close()
  }

  await browser.close()
  server.close()
  console.log(`\nScreenshots in ${path.relative(ROOT, outDir)}/\n`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
