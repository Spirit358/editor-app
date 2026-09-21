#!/usr/bin/env node
/**
 * Publishes the static export to Vercel as a preview host, with the
 * assistant's endpoint as a Vercel function so the widget works there too.
 *
 *   pnpm deploy-vercel --dry-run       assemble, print the plan, deploy nothing
 *   pnpm deploy-vercel                 deploy (production alias of the project)
 *   pnpm deploy-vercel --indexable     drop the noindex header — for a site
 *                                      whose real home IS Vercel
 *
 * The client's own hosting is `pnpm deploy-ftp`; this is the other host in
 * README → Deploying. What it assembles, in dist-vercel/<slug>/ (git-ignored):
 *
 *   public/            out/ minus the PHP handlers and .htaccess
 *   api/chat.js        the assistant, generated — see scripts/lib/chat-function.mjs
 *   package.json       installs @anthropic-ai/sdk for that function
 *   vercel.json        /chat.php → /api/chat, so the same build posts to the
 *                      same path on both hosts; X-Robots-Tag: noindex unless
 *                      --indexable, plus a blocking robots.txt
 *
 * The directory is named after the site, and Vercel names the project after
 * the directory — so this keeps deploying to the same project.
 *
 * Credentials: VERCEL_TOKEN in the environment or .env.local. The assistant's
 * key is NOT uploaded: set CHATBOT_API_KEY (and optionally CHATBOT_MODEL,
 * CHATBOT_DAILY_LIMIT) in the Vercel project's environment variables, or pass
 * --sync-env to copy them there from the local environment.
 */

import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { loadDotEnv } from './lib/env.mjs'
import { chatFunction } from './lib/chat-function.mjs'

const ROOT = process.cwd()
const OUT_DIR = path.join(ROOT, 'out')
const SDK_VERSION = '^0.127.0'

const has = (flag) => process.argv.includes(flag)

function fail(message) {
  console.error(`\n${message}\n`)
  process.exit(1)
}

async function readBuild() {
  let index
  try {
    index = await readFile(path.join(OUT_DIR, 'index.html'), 'utf8')
  } catch {
    fail('No out/ yet. Run `pnpm build` first.')
  }
  const canonical = index.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
  if (!canonical) fail('No canonical URL in out/index.html — is this a finished build?')
  return {
    baseUrl: new URL(canonical).origin,
    title: index.match(/<title>([^<]*)<\/title>/)?.[1] ?? '',
    hasChat: /\/chat\.php/.test(index),
  }
}

function vercel(args, { input } = {}) {
  const result = spawnSync('vercel', args, {
    encoding: 'utf8',
    env: process.env,
    input,
    stdio: input === undefined ? ['ignore', 'pipe', 'pipe'] : ['pipe', 'pipe', 'pipe'],
  })
  return { ok: result.status === 0, out: `${result.stdout ?? ''}${result.stderr ?? ''}` }
}

async function main() {
  await loadDotEnv(ROOT)
  const build = await readBuild()
  const indexable = has('--indexable')
  const dryRun = has('--dry-run')

  // The project name comes from the directory name; the slug comes from the
  // canonical host, which is stable across deploys.
  const slug = new URL(build.baseUrl).host.replace(/^www\./, '').replace(/\.[a-z]+$/i, '')
  const dist = path.join(ROOT, 'dist-vercel', slug)
  await rm(dist, { recursive: true, force: true })
  await mkdir(path.join(dist, 'api'), { recursive: true })

  await cp(OUT_DIR, path.join(dist, 'public'), {
    recursive: true,
    filter: (src) => !/[\\/](\.htaccess|form\.php|chat\.php)$/.test(src),
  })
  if (!indexable) {
    await writeFile(path.join(dist, 'public', 'robots.txt'), 'User-Agent: *\nDisallow: /\n', 'utf8')
  }

  if (build.hasChat) {
    await writeFile(path.join(dist, 'api', 'chat.js'), chatFunction(), 'utf8')
    await writeFile(
      path.join(dist, 'package.json'),
      JSON.stringify({ name: `${slug}-preview`, private: true, dependencies: { '@anthropic-ai/sdk': SDK_VERSION } }, null, 2) + '\n',
      'utf8',
    )
  }

  const config = {
    ...(build.hasChat ? { rewrites: [{ source: '/chat.php', destination: '/api/chat' }] } : {}),
    ...(indexable
      ? {}
      : { headers: [{ source: '/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }] }),
  }
  await writeFile(path.join(dist, 'vercel.json'), JSON.stringify(config, null, 2) + '\n', 'utf8')

  console.log(`\n${dryRun ? 'DRY RUN — ' : ''}Vercel preview of ${build.baseUrl}`)
  console.log(`  project: ${slug}   (${path.relative(ROOT, dist)})`)
  console.log(`  indexable: ${indexable ? 'yes' : 'no — X-Robots-Tag noindex + robots.txt Disallow'}`)
  console.log(
    `  assistant: ${build.hasChat ? '/chat.php → api/chat.js' : 'not in this build'}` +
      (build.hasChat && !process.env.CHATBOT_API_KEY ? '   (CHATBOT_API_KEY not set locally; set it in the Vercel project)' : ''),
  )
  if (dryRun) {
    console.log('\n  Nothing was deployed.\n')
    return
  }

  if (!process.env.VERCEL_TOKEN) fail('Set VERCEL_TOKEN in the environment or .env.local.')

  if (has('--sync-env') && build.hasChat) {
    // The assembled directory is new every run, so it is not linked to the
    // project yet; `env` commands need that link, `deploy` does not.
    const linked = vercel(['link', '--yes', '--project', slug, '--cwd', dist])
    if (!linked.ok) fail(`Could not link ${slug}: ${linked.out.trim().split('\n').slice(-2).join(' ')}`)
    for (const name of ['CHATBOT_API_KEY', 'CHATBOT_MODEL', 'CHATBOT_DAILY_LIMIT']) {
      const value = process.env[name]
      if (!value) continue
      // `env add` refuses an existing name, so clear it first; the removal
      // failing just means it was not there.
      spawnSync('vercel', ['env', 'rm', name, 'production', '--yes', '--cwd', dist], { encoding: 'utf8', env: process.env })
      const added = vercel(['env', 'add', name, 'production', '--cwd', dist], { input: value })
      console.log(`  env ${name}: ${added.ok ? 'set' : 'FAILED — ' + added.out.split('\n').slice(-3).join(' ')}`)
    }
  }

  // A transient "fetch failed" on upload happens; one deploy is one attempt,
  // so try a few times before giving up.
  let deployed = null
  for (let attempt = 1; attempt <= 3 && !deployed; attempt++) {
    const result = vercel(['deploy', '--prod', '--yes', '--cwd', dist])
    const url = result.out.match(/https:\/\/[a-z0-9.-]+\.vercel\.app/)?.[0]
    if (result.ok && url) deployed = url
    else console.log(`  attempt ${attempt} failed: ${result.out.trim().split('\n').slice(-2).join(' ')}`)
  }
  if (!deployed) fail('Deploy failed three times.')
  console.log(`\n  deployed: ${deployed}`)

  // Nothing proves a deploy like the alias answering with the new page.
  const alias = `https://${slug}.vercel.app`
  try {
    const response = await fetch(`${alias}/?cachebust=${Date.now()}`, { headers: { 'Cache-Control': 'no-cache' } })
    const title = (await response.text()).match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
    console.log(title === build.title ? `  ✓ ${alias} is serving the new build\n` : `  ! ${alias} answered ${response.status} with "${title}"\n`)
  } catch (error) {
    console.log(`  ! Could not verify ${alias}: ${error.message}\n`)
  }
}

main().catch((error) => fail(error.stack ?? String(error)))
