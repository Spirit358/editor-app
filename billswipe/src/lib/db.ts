import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import type { DatabaseSync as DatabaseSyncType } from 'node:sqlite'
import type { Bill } from './types'

// Loaded at runtime so the bundler never has to resolve the `node:sqlite` builtin.
const { DatabaseSync } = process.getBuiltinModule('node:sqlite')

export const DATA_DIR = process.env.BILLSWIPE_DATA_DIR ?? path.join(process.cwd(), 'data')
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads')

const SCHEMA = `
PRAGMA busy_timeout = 5000;
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL CHECK (role IN ('poster', 'patron')),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bills (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  category        TEXT NOT NULL,
  amount_cents    INTEGER NOT NULL CHECK (amount_cents > 0),
  story           TEXT NOT NULL DEFAULT '',
  due_date        TEXT,
  attachment_id   TEXT,
  attachment_type TEXT,
  status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'paid')),
  created_at      TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS bills_status ON bills(status, created_at);
CREATE INDEX IF NOT EXISTS bills_user ON bills(user_id);

CREATE TABLE IF NOT EXISTS swipes (
  bill_id    TEXT NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  patron_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  direction  TEXT NOT NULL CHECK (direction IN ('left', 'right')),
  created_at TEXT NOT NULL,
  PRIMARY KEY (bill_id, patron_id)
);

CREATE TABLE IF NOT EXISTS payments (
  id           TEXT PRIMARY KEY,
  bill_id      TEXT NOT NULL UNIQUE REFERENCES bills(id) ON DELETE CASCADE,
  patron_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  provider     TEXT NOT NULL,
  provider_ref TEXT NOT NULL,
  created_at   TEXT NOT NULL
);
`

const SEED: { name: string; title: string; category: string; amount: number; story: string; due: number }[] = [
  { name: 'Maya', title: 'March rent', category: 'rent', amount: 1450, story: 'Hours got cut at the café and I am one paycheck short this month.', due: 6 },
  { name: 'Dev', title: 'Emergency vet visit', category: 'medical', amount: 612.4, story: 'Biscuit ate an entire sock. Biscuit is fine. My wallet is not.', due: 12 },
  { name: 'Priya', title: 'Final student loan payment', category: 'student', amount: 2380, story: 'Nine years of payments and this is the very last one.', due: 20 },
  { name: 'Tom', title: 'Winter heating bill', category: 'utilities', amount: 318.77, story: 'Old house, single glazing, coldest February in a decade.', due: 4 },
  { name: 'Aisha', title: 'Transmission repair', category: 'car', amount: 1890, story: 'I drive 40 minutes to work and there is no bus. Need the car back.', due: 9 },
  { name: 'Leo', title: 'Phone bill', category: 'phone', amount: 64, story: 'Honestly just seeing if this works.', due: 15 },
]

export const now = () => new Date().toISOString()

function open(): DatabaseSyncType {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  const db = new DatabaseSync(path.join(DATA_DIR, 'billswipe.db'))
  db.exec(SCHEMA)
  // A crash mid-charge would otherwise leave a bill locked forever.
  db.exec(`UPDATE bills SET status = 'open' WHERE status = 'pending'`)

  // IMMEDIATE so two processes starting together cannot both seed.
  db.exec('BEGIN IMMEDIATE')
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM users').get() as { n: number }
  if (n === 0 && process.env.BILLSWIPE_NO_SEED !== '1') {
    const addUser = db.prepare(`INSERT INTO users (id, name, role, created_at) VALUES (?, ?, 'poster', ?)`)
    const addBill = db.prepare(
      `INSERT INTO bills (id, user_id, title, category, amount_cents, story, due_date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    SEED.forEach((s, i) => {
      const userId = randomUUID()
      const created = new Date(Date.now() - (SEED.length - i) * 3_600_000).toISOString()
      const due = new Date(Date.now() + s.due * 86_400_000).toISOString().slice(0, 10)
      addUser.run(userId, s.name, created)
      addBill.run(randomUUID(), userId, s.title, s.category, Math.round(s.amount * 100), s.story, due, created)
    })
  }
  db.exec('COMMIT')
  return db
}

// Opened on first use (not at import, which also happens during `next build`)
// and kept on globalThis so dev-server hot reloads share one connection.
const g = globalThis as unknown as { __billswipeDb?: DatabaseSyncType }
export const db = (): DatabaseSyncType => (g.__billswipeDb ??= open())

/** Run `fn` atomically. `fn` must be synchronous. */
export function transaction<T>(fn: () => T): T {
  db().exec('BEGIN IMMEDIATE')
  try {
    const result = fn()
    db().exec('COMMIT')
    return result
  } catch (err) {
    db().exec('ROLLBACK')
    throw err
  }
}

export const BILL_SELECT = `
  SELECT b.id, b.title, b.category, b.amount_cents, b.story, b.due_date, b.attachment_type,
         b.status, b.created_at, u.name AS owner_name, p.created_at AS paid_at, pu.name AS paid_by
  FROM bills b
  JOIN users u ON u.id = b.user_id
  LEFT JOIN payments p ON p.bill_id = b.id
  LEFT JOIN users pu ON pu.id = p.patron_id
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toBill(r: any): Bill {
  return {
    id: r.id,
    ownerName: r.owner_name,
    title: r.title,
    category: r.category,
    amountCents: r.amount_cents,
    story: r.story,
    dueDate: r.due_date,
    attachmentType: r.attachment_type,
    status: r.status,
    paidBy: r.paid_by,
    paidAt: r.paid_at,
    createdAt: r.created_at,
  }
}
