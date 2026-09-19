#!/usr/bin/env node
/**
 * Switches which client this checkout builds.
 *
 *   pnpm use-site <slug>    point the build at clients/<slug>
 *   pnpm list-sites         show what is available and which is active
 *
 * Two files change: the single re-export in src/config/active.ts, and the
 * font pairing in src/config/fonts.ts (read from `brand.fonts` in the client
 * config, because next/font needs a static import). Everything else in the
 * app reads through @/lib/site, so nothing else needs to touch.
 */

import { readdir, readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const ACTIVE_FILE = path.join(ROOT, 'src', 'config', 'active.ts')
const FONTS_FILE = path.join(ROOT, 'src', 'config', 'fonts.ts')
const CLIENTS_DIR = path.join(ROOT, 'clients')
const FONTS_DIR = path.join(ROOT, 'src', 'fonts')

const EXPORT_RE = /@clients\/([^/]+)\/site\.config/
const FONT_EXPORT_RE = /@\/fonts\/([a-z0-9-]+)/
const FONT_CHOICE_RE = /fonts:\s*['"]([a-z0-9-]+)['"]/
const DEFAULT_FONTS = 'fraunces-inter'

async function listClients() {
  const entries = await readdir(CLIENTS_DIR, { withFileTypes: true })
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
    .map((e) => e.name)
    .sort()
}

async function currentSlug() {
  const source = await readFile(ACTIVE_FILE, 'utf8')
  return source.match(EXPORT_RE)?.[1] ?? null
}

/** The pairing a client asks for in `brand.fonts`, or the default. */
async function fontsFor(slug) {
  const config = await readFile(path.join(CLIENTS_DIR, slug, 'site.config.ts'), 'utf8')
  const choice = config.match(FONT_CHOICE_RE)?.[1] ?? DEFAULT_FONTS
  try {
    await access(path.join(FONTS_DIR, `${choice}.ts`))
  } catch {
    throw new Error(
      `clients/${slug} asks for fonts "${choice}" but src/fonts/${choice}.ts does not exist.`
    )
  }
  return choice
}

export async function setActive(slug) {
  const source = await readFile(ACTIVE_FILE, 'utf8')
  if (!EXPORT_RE.test(source)) {
    throw new Error(
      `Could not find the client export in ${path.relative(ROOT, ACTIVE_FILE)}. ` +
        'Has the file been edited by hand?'
    )
  }
  await writeFile(ACTIVE_FILE, source.replace(EXPORT_RE, `@clients/${slug}/site.config`), 'utf8')

  const fonts = await fontsFor(slug)
  const fontsSource = await readFile(FONTS_FILE, 'utf8')
  if (!FONT_EXPORT_RE.test(fontsSource)) {
    throw new Error(`Could not find the pairing export in ${path.relative(ROOT, FONTS_FILE)}.`)
  }
  await writeFile(FONTS_FILE, fontsSource.replace(FONT_EXPORT_RE, `@/fonts/${fonts}`), 'utf8')

  return { slug, fonts }
}

async function main() {
  const [slug] = process.argv.slice(2)
  const clients = await listClients()
  const active = await currentSlug()

  if (!slug || slug === '--list') {
    console.log('\nClients in this checkout:\n')
    for (const name of clients) {
      console.log(`  ${name === active ? '→' : ' '} ${name}`)
    }
    console.log(`\nActive: ${active ?? 'none'}`)
    console.log('Switch with: pnpm use-site <slug>\n')
    return
  }

  if (!clients.includes(slug)) {
    console.error(`\nNo client called "${slug}".`)
    console.error(`Available: ${clients.join(', ') || '(none)'}`)
    console.error('Create one with: pnpm new-site <slug>\n')
    process.exit(1)
  }

  try {
    await access(path.join(CLIENTS_DIR, slug, 'site.config.ts'))
  } catch {
    console.error(`\nclients/${slug}/site.config.ts is missing.\n`)
    process.exit(1)
  }

  const { fonts } = await setActive(slug)
  console.log(`\nActive client is now "${slug}" (fonts: ${fonts}). Run pnpm dev.\n`)
}

// Only run when invoked directly, so new-site.mjs can import setActive.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
