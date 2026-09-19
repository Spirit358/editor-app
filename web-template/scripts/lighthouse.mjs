#!/usr/bin/env node
/**
 * The definition-of-done check: Lighthouse on mobile and desktop.
 *
 *   pnpm build && pnpm audit-site
 *   pnpm audit-site --routes / /contact --min 95
 *
 * Exits non-zero if any category on any route falls below --min (default 90),
 * so it can gate a deploy.
 *
 * Note on SEO: a demo build is deliberately noindex, which costs roughly 30
 * SEO points. That is the correct result — a demo carrying a real business's
 * name must not be crawlable. The summary calls it out rather than letting it
 * look like a defect.
 */

import { spawn } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { stat } from 'node:fs/promises'
import lighthouse from 'lighthouse'
import { serveStatic, discoverRoutes, CHROME_PATH } from './lib/serve.mjs'

const OUT_DIR = path.join(process.cwd(), 'out')
const DEBUG_PORT = 9222

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

const PROFILES = {
  mobile: { formFactor: 'mobile' },
  desktop: {
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
  },
}

async function main() {
  try {
    await stat(OUT_DIR)
  } catch {
    console.error('\nNo out/ folder. Run `pnpm build` first.\n')
    process.exit(1)
  }

  const min = Number(arg('--min', '90'))
  const server = await serveStatic(OUT_DIR)
  const { port } = server.address()

  const routes = argList('--routes') ?? (await discoverRoutes(OUT_DIR)).sort()

  const chrome = spawn(
    CHROME_PATH,
    [
      `--remote-debugging-port=${DEBUG_PORT}`,
      '--no-sandbox',
      '--headless=new',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      'about:blank',
    ],
    { stdio: 'ignore' }
  )
  await new Promise((r) => setTimeout(r, 3000))

  const failures = []
  const noindexRoutes = new Set()

  console.log(`\nAuditing ${routes.length} route${routes.length === 1 ? '' : 's'}, threshold ${min}\n`)

  for (const route of routes) {
    const scores = {}

    for (const [name, profile] of Object.entries(PROFILES)) {
      const result = await lighthouse(`http://127.0.0.1:${port}${route}`, {
        port: DEBUG_PORT,
        output: 'json',
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        ...profile,
      })

      const routeNoindex = result.lhr.audits['is-crawlable']?.score === 0
      if (routeNoindex) noindexRoutes.add(route)

      scores[name] = Object.fromEntries(
        Object.entries(result.lhr.categories).map(([key, c]) => [
          key,
          Math.round(c.score * 100),
        ])
      )

      for (const [key, value] of Object.entries(scores[name])) {
        // A noindex page cannot score on SEO — true of a demo build, and of
        // the 404 page in every build. Judge this route on its own tag: a
        // single shared flag let the first noindex route silence every SEO
        // failure after it.
        if (value < min && !(key === 'seo' && routeNoindex)) {
          failures.push(`${route} [${name}] ${key} ${value}`)
        }
      }
    }

    const line = (name) => {
      const s = scores[name]
      return `${name.padEnd(7)} perf ${String(s.performance).padStart(3)}  a11y ${String(s.accessibility).padStart(3)}  bp ${String(s['best-practices']).padStart(3)}  seo ${String(s.seo).padStart(3)}`
    }
    console.log(`  ${route}`)
    console.log(`    ${line('mobile')}`)
    console.log(`    ${line('desktop')}`)
  }

  chrome.kill()
  server.close()

  // A noindex 404 is correct everywhere; only real pages mean a demo build.
  const demoRoutes = [...noindexRoutes].filter((route) => route !== '/404')
  if (demoRoutes.length) {
    console.log(
      `\n  Note: ${demoRoutes.length} route${demoRoutes.length === 1 ? ' is' : 's are'} noindex — this is a demo\n` +
        '  build, so their SEO score is capped around 70. That is correct, not a\n' +
        '  defect to fix.'
    )
  }

  if (failures.length) {
    console.error(`\n${failures.length} below ${min}:`)
    for (const f of failures) console.error(`  ✗ ${f}`)
    console.error('')
    process.exit(1)
  }

  console.log(`\nAll categories at or above ${min}.\n`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
