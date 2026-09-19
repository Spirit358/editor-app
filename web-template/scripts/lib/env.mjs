import { readFile, access } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

/**
 * Reads .env.local at the template root so credentials never have to be
 * exported by hand. Values already in the environment win, and the file is
 * git-ignored — see the credentials rule in CLAUDE.md.
 */
export async function loadDotEnv(root = process.cwd()) {
  const file = path.join(root, '.env.local')
  try {
    await access(file)
  } catch {
    return
  }
  for (const line of (await readFile(file, 'utf8')).split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (!m || process.env[m[1]]) continue
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
