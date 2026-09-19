import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat, readFile, readdir } from 'node:fs/promises'
import { brotliCompressSync } from 'node:zlib'
import path from 'node:path'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
}

const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.svg', '.xml', '.txt'])

/**
 * Serves ./out the way a real static host does — trailing-slash index
 * resolution, brotli on text, long cache headers on assets.
 *
 * The compression matters more than it looks: measuring an uncompressed
 * bundle over Lighthouse's throttled mobile connection reports a performance
 * score twenty points below what the same build scores on Cloudflare Pages.
 * An audit against an unrealistic server is worse than no audit.
 */
export function serveStatic(dir) {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const url = decodeURIComponent((req.url ?? '/').split('?')[0])
      const candidates = [
        path.join(dir, url),
        path.join(dir, url, 'index.html'),
        `${path.join(dir, url).replace(/\/$/, '')}.html`,
      ]

      for (const candidate of candidates) {
        if (!candidate.startsWith(dir)) continue
        try {
          const info = await stat(candidate)
          if (!info.isFile()) continue

          const ext = path.extname(candidate)
          const type = MIME[ext] ?? 'application/octet-stream'
          const cache = candidate.includes(`${path.sep}_next${path.sep}static${path.sep}`)
            ? 'public, max-age=31536000, immutable'
            : 'public, max-age=3600'

          if (COMPRESSIBLE.has(ext) && (req.headers['accept-encoding'] ?? '').includes('br')) {
            const body = brotliCompressSync(await readFile(candidate))
            res.writeHead(200, {
              'Content-Type': type,
              'Content-Encoding': 'br',
              'Content-Length': body.length,
              'Cache-Control': cache,
            })
            res.end(body)
            return
          }

          res.writeHead(200, {
            'Content-Type': type,
            'Content-Length': info.size,
            'Cache-Control': cache,
          })
          createReadStream(candidate).pipe(res)
          return
        } catch {
          /* try the next candidate */
        }
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not found')
    })

    server.listen(0, '127.0.0.1', () => resolve(server))
  })
}

/** Every exported route, derived from the folders Next produced. */
export async function discoverRoutes(dir, prefix = '') {
  const routes = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name === '404.html') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      routes.push(...(await discoverRoutes(full, `${prefix}/${entry.name}`)))
    } else if (entry.name === 'index.html') {
      routes.push(prefix || '/')
    }
  }
  return routes
}

export const CHROME_PATH =
  process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
