#!/usr/bin/env node
/**
 * Switches which client this checkout builds.
 *
 *   pnpm use-site <slug>    point the build at clients/<slug>
 *   pnpm list-sites         show what is available and which is active
 *
 * It rewrites the single re-export in src/config/active.ts. Everything else in
 * the app reads through @/lib/site, so nothing else needs to change.
 */

import { readdir, readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const ACTIVE_FILE = path.join(ROOT, 'src', 'config', 'active.ts')
const CLIENTS_DIR = path.join(ROOT, 'clients')
const EXPORT_RE = /@clients\/([^/]+)\/site\.config/

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

export async function setActive(slug) {
  const source = await readFile(ACTIVE_FILE, 'utf8')
  if (!EXPORT_RE.test(source)) {
    throw new Error(
      `Could not find the client export in ${path.relative(ROOT, ACTIVE_FILE)}. ` +
        'Has the file been edited by hand?'
    )
  }
  await writeFile(
    ACTIVE_FILE,
    source.replace(EXPORT_RE, `@clients/${slug}/site.config`),
    'utf8'
  )
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

  await setActive(slug)
  console.log(`\nActive client is now "${slug}". Run pnpm dev.\n`)
}

// Only run when invoked directly, so new-site.mjs can import setActive.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
