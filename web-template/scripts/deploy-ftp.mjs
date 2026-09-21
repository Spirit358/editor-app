#!/usr/bin/env node
/**
 * Publishes the static export to a client's own shared hosting over FTPS.
 *
 *   pnpm deploy-ftp --dry-run        print the plan, connect to nothing
 *   pnpm deploy-ftp --check          connect, list the remote root, suggest the
 *                                    web root, upload nothing
 *   pnpm deploy-ftp                  upload out/ to the remote directory
 *   pnpm deploy-ftp --allow-demo     upload a demo build (staging only)
 *
 * This is the path for a client who already pays for hosting: nothing in DNS
 * moves, so their email keeps working, and the site replaces whatever was in
 * the web root. The alternative is a preview host — see DECISIONS.md.
 *
 * Credentials come from the environment or a git-ignored .env.local, never
 * from a file under clients/ or src/:
 *
 *   FTP_HOST=ftp.example.pl
 *   FTP_USER=...
 *   FTP_PASSWORD=...
 *   FTP_REMOTE_DIR=/public_html        (default: /)
 *   FTP_PORT=21                        (default: 21)
 *   FTP_SECURE=true                    (default: true — explicit FTPS)
 *
 * When the build's assistant posts to chat.php, the handler is generated and
 * uploaded too, and these write .chat-secret.php one directory above the
 * web root:
 *
 *   CHATBOT_API_KEY=...                (one key per client — spend per client)
 *   CHATBOT_MODEL=claude-haiku-4-5
 *   CHATBOT_DAILY_LIMIT=400
 *
 * The upload overwrites and adds; it never deletes. Clear the web root by
 * hand, after a backup, when replacing an old site — leaving a dead
 * WordPress install next to the new files is a security liability, not just
 * clutter.
 */

import { readFile, readdir, writeFile, stat } from 'node:fs/promises'
import { Readable } from 'node:stream'
import path from 'node:path'
import process from 'node:process'
import { Client } from 'basic-ftp'
import { loadDotEnv } from './lib/env.mjs'
import { htaccess } from './lib/htaccess.mjs'
import { formHandler } from './lib/form-handler.mjs'
import { chatHandler, chatSecret } from './lib/chat-handler.mjs'

const ROOT = process.cwd()
const OUT_DIR = path.join(ROOT, 'out')

const has = (flag) => process.argv.includes(flag)
function arg(flag, fallback) {
  const i = process.argv.indexOf(flag)
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')
    ? process.argv[i + 1]
    : fallback
}

function fail(message) {
  console.error(`\n${message}\n`)
  process.exit(1)
}

/** What the build itself says about where it is going and whether it is a demo. */
async function readBuild() {
  let index
  try {
    index = await readFile(path.join(OUT_DIR, 'index.html'), 'utf8')
  } catch {
    fail('No out/ yet. Run `pnpm build` first.')
  }

  const canonical = index.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
  if (!canonical) fail('No canonical URL in out/index.html — is this a finished build?')

  const title = index.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
  const noindex = /content="noindex/.test(index)
  const siteName = index.match(/property="og:site_name" content="([^"]+)"/)?.[1] ?? ''
  const email = index.match(/mailto:([^"?]+)/)?.[1] ?? ''

  // The form's endpoint is a config value baked into the page, so the build
  // itself says whether this deploy needs a PHP handler shipped with it.
  let postsToPhp = /\/form\.php/.test(index)
  if (!postsToPhp) {
    try {
      postsToPhp = /\/form\.php/.test(await readFile(path.join(OUT_DIR, 'contact', 'index.html'), 'utf8'))
    } catch {
      /* a site without a contact page */
    }
  }

  const hasChat = /\/chat\.php/.test(index)

  let robots = ''
  try {
    robots = await readFile(path.join(OUT_DIR, 'robots.txt'), 'utf8')
  } catch {
    /* a server-mode build has no robots.txt on disk */
  }

  return {
    baseUrl: new URL(canonical).origin,
    title,
    siteName,
    email,
    postsToPhp,
    hasChat,
    isDemo: noindex || /Disallow:\s*\/\s*$/m.test(robots),
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(full)))
    else files.push(full)
  }
  return files
}

async function main() {
  await loadDotEnv(ROOT)

  const build = await readBuild()
  const remoteDir = arg('--remote', process.env.FTP_REMOTE_DIR ?? '/')
  const dryRun = has('--dry-run')

  if (build.isDemo && !has('--allow-demo')) {
    fail(
      `This build is in demo mode — noindex, and robots.txt blocks everything.\n` +
        `Uploading it to a client's own domain publishes a site Google will never\n` +
        `index, under a preview banner. Set demo.enabled to false in the client's\n` +
        `config and rebuild, or pass --allow-demo if this really is a staging host.`,
    )
  }

  // The server config is generated from the build, so the canonical host in
  // the redirect can never drift from the one in the pages.
  await writeFile(path.join(OUT_DIR, '.htaccess'), htaccess({ baseUrl: build.baseUrl }), 'utf8')

  if (build.postsToPhp) {
    if (!build.email) {
      fail('The form posts to form.php but the build has no contact email to deliver to.')
    }
    await writeFile(
      path.join(OUT_DIR, 'form.php'),
      formHandler({
        to: build.email,
        siteName: build.siteName || new URL(build.baseUrl).host,
        subject: `Zapytanie ze strony ${new URL(build.baseUrl).host}`,
      }),
      'utf8',
    )
  }

  const chat = build.hasChat
    ? {
        apiKey: process.env.CHATBOT_API_KEY ?? '',
        model: process.env.CHATBOT_MODEL ?? 'claude-haiku-4-5',
        dailyLimit: process.env.CHATBOT_DAILY_LIMIT ?? '400',
        apiBase: process.env.CHATBOT_API_BASE ?? 'https://api.anthropic.com',
      }
    : null
  if (chat) {
    await writeFile(path.join(OUT_DIR, 'chat.php'), chatHandler(), 'utf8')
  }

  const files = await walk(OUT_DIR)
  const bytes = (await Promise.all(files.map((f) => stat(f).then((s) => s.size)))).reduce(
    (a, b) => a + b,
    0,
  )

  console.log(`\n${dryRun ? 'DRY RUN — ' : ''}Deploying to ${build.baseUrl}`)
  console.log(`  ${files.length} files, ${(bytes / 1024 / 1024).toFixed(1)} MB`)
  console.log(`  remote directory: ${remoteDir}`)
  console.log(`  demo mode: ${build.isDemo ? 'ON (staging)' : 'off'}`)
  console.log(
    `  contact form: ${build.postsToPhp ? `form.php → ${build.email}` : 'third-party endpoint or none'}`,
  )
  if (chat) {
    console.log(
      `  assistant: chat.php → ${chat.model}, ${chat.dailyLimit}/day` +
        (chat.apiKey ? '' : '  (CHATBOT_API_KEY missing — it will answer "unavailable" until set)'),
    )
  }

  if (dryRun) {
    console.log(`\n  out/.htaccess written. Nothing was uploaded.\n`)
    return
  }

  const { FTP_HOST, FTP_USER, FTP_PASSWORD } = process.env
  if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD) {
    fail('Set FTP_HOST, FTP_USER and FTP_PASSWORD in the environment or .env.local.')
  }
  const secure = (process.env.FTP_SECURE ?? 'true') !== 'false'
  if (!secure) {
    console.log('\n  WARNING: FTP_SECURE=false — the password crosses the network in clear text.')
  }

  const client = new Client(30_000)
  try {
    if (has('--check')) {
      await client.access({
        host: FTP_HOST,
        port: Number(process.env.FTP_PORT ?? 21),
        user: FTP_USER,
        password: FTP_PASSWORD,
        secure,
        secureOptions: { rejectUnauthorized: false },
      })
      console.log(`\n  connected to ${FTP_HOST} as ${FTP_USER}`)
      const entries = await client.list('/')
      console.log('  remote root:')
      for (const e of entries) console.log(`    ${e.isDirectory ? 'd' : '-'} ${e.name}`)
      // The two layouts shared hosts use: cPanel-style public_html at the
      // root, or DirectAdmin-style domains/<domain>/public_html.
      const names = entries.map((e) => e.name)
      let guess = null
      if (names.includes('public_html')) guess = '/public_html'
      else if (names.includes('domains')) {
        const domains = await client.list('/domains')
        const host = new URL(build.baseUrl).host.replace(/^www\./, '')
        const match = domains.find((d) => d.name === host) ?? domains.find((d) => d.isDirectory)
        if (match) guess = `/domains/${match.name}/public_html`
      } else if (names.includes('httpdocs')) guess = '/httpdocs'
      else if (names.includes('index.php') || names.includes('wp-config.php')) guess = '/'
      console.log(guess ? `\n  web root looks like: FTP_REMOTE_DIR=${guess}\n` : '\n  could not tell the web root — look for the directory holding the old site\n')
      if (guess) {
        const web = await client.list(guess)
        const wp = web.some((e) => e.name === 'wp-config.php')
        console.log(`  ${guess} holds ${web.length} entries${wp ? ' — a WordPress install; clear it before the upload' : ''}\n`)
      }
      return
    }
    await client.access({
      host: FTP_HOST,
      port: Number(process.env.FTP_PORT ?? 21),
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure,
      secureOptions: { rejectUnauthorized: false },
    })
    console.log(`\n  connected to ${FTP_HOST}`)
    await client.ensureDir(remoteDir)
    await client.uploadFromDir(OUT_DIR)
    console.log('  upload finished')

    if (chat?.apiKey) {
      // One level above the web root when there is one; a .php file that
      // returns a value outputs nothing even if it ends up inside it.
      const parent = path.posix.dirname(remoteDir.replace(/\/+$/, '') || '/')
      const secretPath = path.posix.join(parent === remoteDir ? remoteDir : parent, '.chat-secret.php')
      await client.uploadFrom(Readable.from([chatSecret(chat)]), secretPath)
      console.log(`  assistant secret written to ${secretPath}`)
    }
  } catch (error) {
    fail(`FTP failed: ${error.message}`)
  } finally {
    client.close()
  }

  // Nothing proves a deploy like the live URL answering with the new page.
  try {
    const response = await fetch(`${build.baseUrl}/?cachebust=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache' },
    })
    const live = await response.text()
    const liveTitle = live.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
    console.log(
      liveTitle === build.title
        ? `\n  ✓ ${build.baseUrl} is serving the new site\n`
        : `\n  ! ${build.baseUrl} answered ${response.status} with a different page.\n` +
            `    Live title:  ${liveTitle || '(none)'}\n` +
            `    Expected:    ${build.title}\n` +
            `    Usually the web root is elsewhere — check FTP_REMOTE_DIR.\n`,
    )
  } catch (error) {
    console.log(`\n  ! Could not verify ${build.baseUrl}: ${error.message}\n`)
  }
}

main().catch((error) => fail(error.stack ?? String(error)))
