#!/usr/bin/env node
/**
 * Scaffolds a new client instance.
 *
 *   pnpm new-site <slug> [--hue 224] [--accent 38] [--no-assets]
 *
 * Creates clients/<slug>/site.config.ts from the skeleton, generates on-brand
 * placeholder imagery, and points the build at the new client. After this,
 * the whole job is filling in one file.
 */

import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { setActive } from './use-site.mjs'

const ROOT = process.cwd()

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag)
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', cwd: ROOT })
    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`))
    )
  })
}

async function exists(target) {
  try {
    await access(target)
    return true
  } catch {
    return false
  }
}

async function main() {
  const slug = process.argv[2]

  if (!slug || slug.startsWith('-')) {
    console.error('\nUsage: pnpm new-site <slug> [--hue 224] [--accent 38]\n')
    process.exit(1)
  }

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    console.error(
      `\n"${slug}" is not a valid slug. Use lowercase words separated by hyphens, e.g. kirkstall-plumbing.\n`
    )
    process.exit(1)
  }

  const clientDir = path.join(ROOT, 'clients', slug)
  if (await exists(clientDir)) {
    console.error(`\nclients/${slug} already exists. Pick another slug, or edit it directly.\n`)
    process.exit(1)
  }

  const hue = arg('--hue', '224')
  const accent = arg('--accent', '38')

  // 1. Config from the skeleton.
  const skeleton = await readFile(
    path.join(ROOT, 'clients', '_template', 'site.config.ts'),
    'utf8'
  )
  const expires = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10)

  const config = skeleton
    .replace(/__SLUG__/g, slug)
    .replace(/__YYYY-MM-DD__/g, expires)
    .replace(/__slug__/g, slug)
    .replace(/hue: 224/, `hue: ${hue}`)
    .replace(/accentHue: 38/, `accentHue: ${accent}`)

  await mkdir(clientDir, { recursive: true })
  await writeFile(path.join(clientDir, 'site.config.ts'), config, 'utf8')
  console.log(`\n  ✓ clients/${slug}/site.config.ts`)

  // 2. Placeholder imagery on the same hue.
  if (!process.argv.includes('--no-assets')) {
    console.log('\nGenerating placeholder imagery…')
    await run('node', [
      'scripts/gen-placeholder-assets.mjs',
      '--slug',
      slug,
      '--hue',
      hue,
      '--accent',
      accent,
    ])
  }

  // 3. Point the build at it.
  await setActive(slug)

  console.log(`
Scaffolded "${slug}".

Next:
  1. Fill in clients/${slug}/site.config.ts — every __PLACEHOLDER__.
     The build fails by name if anything required is left blank.
  2. Replace public/clients/${slug}/*.webp with real photography.
  3. pnpm dev, then review at 390px and 1440px.
  4. pnpm build, deploy the out/ folder to a private preview URL.

Demo mode is ON: the build is noindex, robots.txt blocks everything, and the
preview banner is showing. Expires ${expires}.
`)
}

main().catch((error) => {
  console.error(`\n${error.message}\n`)
  process.exit(1)
})
