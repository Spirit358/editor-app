import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { db, now } from './db'
import type { Role, User } from './types'

const COOKIE = 'bs_session'
const MAX_AGE = 60 * 60 * 24 * 30

const hash = (token: string) => createHash('sha256').update(token).digest('hex')

export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return null
  const row = db()
    .prepare(
      `SELECT u.id, u.name, u.role FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?`,
    )
    .get(hash(token)) as User | undefined
  return row ? { id: row.id, name: row.name, role: row.role } : null
}

export async function signIn(name: string, role: Role): Promise<User> {
  const user: User = { id: randomUUID(), name, role }
  const token = randomBytes(32).toString('hex')
  db().prepare(`INSERT INTO users (id, name, role, created_at) VALUES (?, ?, ?, ?)`).run(user.id, name, role, now())
  db().prepare(`INSERT INTO sessions (token_hash, user_id, created_at) VALUES (?, ?, ?)`).run(hash(token), user.id, now())
  ;(await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  })
  return user
}

export async function signOut() {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (token) db().prepare(`DELETE FROM sessions WHERE token_hash = ?`).run(hash(token))
  jar.delete(COOKIE)
}

export function fail(status: number, error: string) {
  return Response.json({ error }, { status })
}
