#!/usr/bin/env node
/**
 * Generates a client's imagery with the Higgsfield API and drops it straight
 * into the responsive ladder the site serves.
 *
 *   pnpm imagery --slug activa
 *   pnpm imagery --slug activa --only hero,about     regenerate a subset
 *   pnpm imagery --slug activa --force               overwrite existing originals
 *   pnpm imagery --slug activa --dry-run             print requests, send nothing
 *
 * Reads clients/<slug>/imagery.json — one prompt per asset the config
 * references — and writes:
 *   clients/<slug>/source/<name>.<ext>      the original (git-ignored)
 *   public/clients/<slug>/<name>-*.webp     the ladder the site serves
 *   public/clients/<slug>/og.jpg            a 1200×630 crop of the hero
 *
 * Credentials come from the environment, never from a file in the repo:
 *   HIGGSFIELD_KEY="<key id>:<key secret>"
 * or HF_API_KEY_ID + HF_API_KEY_SECRET. A .env.local at the template root is
 * read too, and is git-ignored.
 *
 * API contract, from the official SDK source rather than a blog post:
 *   POST https://api.higgsfield.ai/<model path>   body = the input object
 *   Authorization: Key <id>:<secret>
 *   → { request_id, ... }
 *   GET  /requests/<request_id>/status             until status is
 *        completed | failed | nsfw  (queued / in_progress while running)
 *   401 bad credentials · 403 NOT ENOUGH CREDITS · 422 validation error
 */

import { mkdir, readFile, writeFile, access, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'
import { writeLadder } from './lib/images.mjs'

const ROOT = process.cwd()
const BASE_URL = process.env.HIGGSFIELD_BASE_URL ?? 'https://api.higgsfield.ai'
const POLL_MS = 3000
const MAX_POLL_MS = 8 * 60 * 1000

// ---------------------------------------------------------------------------

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag)
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')
    ? process.argv[i + 1]
    : fallback
}
const has = (flag) => process.argv.includes(flag)

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

/** Minimal .env.local reader so the key never has to be exported by hand. */
async function loadDotEnv() {
  const file = path.join(ROOT, '.env.local')
  if (!(await exists(file))) return
  for (const line of (await readFile(file, 'utf8')).split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (!m || process.env[m[1]]) continue
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

function credentials() {
  const single = process.env.HIGGSFIELD_KEY
  if (single) {
    const [id, secret] = single.split(':')
    if (id && secret) return `${id}:${secret}`
  }
  const id = process.env.HF_API_KEY_ID ?? process.env.HF_API_KEY
  const secret = process.env.HF_API_KEY_SECRET ?? process.env.HF_API_SECRET
  if (id && secret) return `${id}:${secret}`
  return null
}

// ---------------------------------------------------------------------------

async function api(creds, method, endpoint, body) {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Key ${creds}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'local-site-template/1.0',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { raw: text }
  }

  if (!response.ok) {
    const detail = typeof data?.detail === 'string' ? data.detail : JSON.stringify(data)
    const why =
      response.status === 401
        ? 'invalid credentials'
        : response.status === 403
          ? 'NOT ENOUGH CREDITS on the Higgsfield account'
          : response.status === 422
            ? `validation error — check the model's parameter names: ${detail}`
            : detail
    const error = new Error(`${method} ${endpoint} → ${response.status}: ${why}`)
    error.status = response.status
    throw error
  }
  return data
}

/** Submit with a couple of retries on transient 5xx, as the SDK does. */
async function submit(creds, model, input) {
  let attempt = 0
  for (;;) {
    try {
      return await api(creds, 'POST', model, input)
    } catch (error) {
      attempt += 1
      if (!(error.status >= 500) || attempt > 3) throw error
      await new Promise((r) => setTimeout(r, 1500 * attempt))
    }
  }
}

async function poll(creds, requestId) {
  const started = Date.now()
  let last = ''
  for (;;) {
    if (Date.now() - started > MAX_POLL_MS) {
      throw new Error(`Timed out after ${MAX_POLL_MS / 60000} minutes waiting for ${requestId}`)
    }
    let data
    try {
      data = await api(creds, 'GET', `/requests/${requestId}/status`)
    } catch (error) {
      if (error.status >= 500) {
        await new Promise((r) => setTimeout(r, POLL_MS))
        continue
      }
      throw error
    }
    const status = String(data.status ?? '').toLowerCase()
    if (status !== last) {
      process.stdout.write(`    ${status || '?'}`)
      last = status
    } else {
      process.stdout.write('.')
    }
    if (status === 'completed') {
      process.stdout.write('\n')
      return data
    }
    if (status === 'failed' || status === 'nsfw' || status === 'cancelled') {
      process.stdout.write('\n')
      throw new Error(`Generation ${status}: ${JSON.stringify(data).slice(0, 400)}`)
    }
    await new Promise((r) => setTimeout(r, POLL_MS))
  }
}

/**
 * The completed payload's shape differs slightly per model family, so look
 * in the documented places first and fall back to the first https URL that
 * looks like an image.
 */
function findImageUrl(data) {
  const candidates = [
    data?.images?.[0]?.url,
    data?.result?.images?.[0]?.url,
    data?.output?.images?.[0]?.url,
    data?.jobs?.[0]?.results?.raw?.url,
    data?.results?.raw?.url,
    data?.image?.url,
    data?.url,
  ]
  for (const c of candidates) if (typeof c === 'string' && c.startsWith('http')) return c

  const seen = new Set()
  const walk = (v) => {
    if (!v || typeof v !== 'object' || seen.has(v)) return null
    seen.add(v)
    for (const [k, val] of Object.entries(v)) {
      if (typeof val === 'string' && /^https?:\/\//.test(val) && /image|\.(png|jpe?g|webp)(\?|$)/i.test(k + val)) {
        return val
      }
      const found = walk(val)
      if (found) return found
    }
    return null
  }
  return walk(data)
}

async function download(url, destBase) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Download failed (${response.status}) for ${url}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const type = response.headers.get('content-type') ?? ''
  const ext = type.includes('png')
    ? 'png'
    : type.includes('webp')
      ? 'webp'
      : /\.png(\?|$)/i.test(url)
        ? 'png'
        : 'jpg'
  const file = `${destBase}.${ext}`
  await writeFile(file, buffer)
  return file
}

// ---------------------------------------------------------------------------

async function main() {
  await loadDotEnv()

  const slug = arg('--slug')
  if (!slug) {
    console.error('\nUsage: pnpm imagery --slug <slug> [--only a,b] [--force] [--dry-run]\n')
    process.exit(1)
  }

  const specFile = path.join(ROOT, 'clients', slug, 'imagery.json')
  if (!(await exists(specFile))) {
    console.error(`\nNo prompts at clients/${slug}/imagery.json.\n`)
    process.exit(1)
  }
  const spec = JSON.parse(await readFile(specFile, 'utf8'))

  const only = arg('--only')?.split(',').map((s) => s.trim())
  const force = has('--force')
  const dryRun = has('--dry-run')

  const creds = credentials()
  if (!creds && !dryRun) {
    console.error(
      '\nNo Higgsfield credentials. Set HIGGSFIELD_KEY="<id>:<secret>" in the environment\n' +
        'or in .env.local at the template root (git-ignored). Or pass --dry-run.\n'
    )
    process.exit(1)
  }

  const sourceDir = path.join(ROOT, 'clients', slug, 'source')
  const publicDir = path.join(ROOT, 'public', 'clients', slug)
  await mkdir(sourceDir, { recursive: true })
  await mkdir(publicDir, { recursive: true })

  const images = spec.images.filter((img) => !only || only.includes(img.name))
  if (!images.length) {
    console.error('\nNothing matched --only.\n')
    process.exit(1)
  }

  console.log(
    `\n${dryRun ? 'DRY RUN — ' : ''}${images.length} image${images.length === 1 ? '' : 's'} for "${slug}" via ${spec.model}\n`
  )

  let generated = 0
  let skipped = 0
  const failures = []

  for (const img of images) {
    const base = path.join(sourceDir, img.name)
    const existing = (await Promise.all(['png', 'jpg', 'webp'].map((e) => exists(`${base}.${e}`))))
      .map((ok, i) => (ok ? `${base}.${['png', 'jpg', 'webp'][i]}` : null))
      .find(Boolean)

    if (existing && !force) {
      console.log(`  – ${img.name}: original exists, skipping (use --force to regenerate)`)
      await writeLadder(existing, publicDir, img.name)
      skipped += 1
      continue
    }

    const input = {
      ...spec.defaults,
      ...(img.aspect_ratio ? { aspect_ratio: img.aspect_ratio } : {}),
      ...(img.resolution ? { resolution: img.resolution } : {}),
      prompt: [img.prompt, spec.style].filter(Boolean).join(' '),
    }

    console.log(`  ▸ ${img.name}  (${input.aspect_ratio ?? 'default'})`)
    if (dryRun) {
      console.log(`    POST ${BASE_URL}/${spec.model}`)
      console.log(`    ${JSON.stringify(input)}`)
      continue
    }

    try {
      const submitted = await submit(creds, spec.model, input)
      const requestId = submitted.request_id ?? submitted.id
      if (!requestId) throw new Error(`No request_id in response: ${JSON.stringify(submitted).slice(0, 300)}`)

      const done = await poll(creds, requestId)
      const url = findImageUrl(done)
      if (!url) throw new Error(`Completed but no image URL found: ${JSON.stringify(done).slice(0, 500)}`)

      const file = await download(url, base)
      const { width, height } = await sharp(file).metadata()
      const written = await writeLadder(file, publicDir, img.name)
      console.log(`    ✓ ${path.relative(ROOT, file)} ${width}×${height} → ${written.length} files`)
      generated += 1
    } catch (error) {
      console.error(`    ✗ ${img.name}: ${error.message}`)
      failures.push(img.name)
      if (error.status === 401 || error.status === 403) break
    }
  }

  // Open Graph card from the hero, so shares carry the real photograph.
  const heroSource = (await Promise.all(['png', 'jpg', 'webp'].map((e) => exists(path.join(sourceDir, `hero.${e}`)))))
    .map((ok, i) => (ok ? path.join(sourceDir, `hero.${['png', 'jpg', 'webp'][i]}`) : null))
    .find(Boolean)
  if (heroSource && !dryRun) {
    await sharp(heroSource)
      .resize(1200, 630, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(publicDir, 'og.jpg'))
    console.log('  ✓ og.jpg from hero')
  }

  console.log(
    `\n${generated} generated, ${skipped} reused${failures.length ? `, ${failures.length} failed: ${failures.join(', ')}` : ''}.`
  )
  if (!dryRun && (generated || skipped)) {
    console.log(`Originals in clients/${slug}/source/ (git-ignored). Ladder in public/clients/${slug}/.\n`)
  }
  if (failures.length) process.exit(1)
}

main().catch((error) => {
  console.error(`\n${error.message}\n`)
  process.exit(1)
})
