import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { currentUser, fail } from '@/lib/auth'
import { BILL_SELECT, UPLOAD_DIR, db, now, toBill } from '@/lib/db'
import { CATEGORIES, LIMITS } from '@/lib/types'

/** Identify a file by its leading bytes rather than trusting the client. */
function sniff(buf: Buffer): string | null {
  if (buf.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return 'image/jpeg'
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png'
  if (buf.subarray(0, 4).toString('latin1') === 'RIFF' && buf.subarray(8, 12).toString('latin1') === 'WEBP')
    return 'image/webp'
  if (buf.subarray(0, 5).toString('latin1') === '%PDF-') return 'application/pdf'
  return null
}

/** The signed-in poster's own bills. */
export async function GET() {
  const user = await currentUser()
  if (!user) return fail(401, 'Sign in first.')
  const rows = db().prepare(`${BILL_SELECT} WHERE b.user_id = ? ORDER BY b.created_at DESC`).all(user.id)
  return Response.json({ bills: rows.map(toBill) })
}

export async function POST(req: Request) {
  const user = await currentUser()
  if (!user) return fail(401, 'Sign in first.')
  if (user.role !== 'poster') return fail(403, 'Billionaires do not have bills.')

  const form = await req.formData().catch(() => null)
  if (!form) return fail(400, 'Expected form data.')
  const text = (key: string) => {
    const v = form.get(key)
    return typeof v === 'string' ? v.trim() : ''
  }

  const title = text('title')
  const category = text('category')
  const story = text('story')
  const dueDate = text('dueDate') || null
  const amountText = text('amount').replace(/[$,\s]/g, '')

  if (title.length < 3 || title.length > 80) return fail(400, 'Title must be 3–80 characters.')
  if (!CATEGORIES.some(c => c.id === category)) return fail(400, 'Pick a category.')
  if (story.length > 400) return fail(400, 'Keep the story under 400 characters.')
  if (dueDate && (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate) || Number.isNaN(Date.parse(dueDate))))
    return fail(400, 'Due date is not a valid date.')
  if (!/^\d+(\.\d{1,2})?$/.test(amountText)) return fail(400, 'Enter an amount like 1450 or 318.77.')
  const amountCents = Math.round(Number(amountText) * 100)
  if (amountCents < LIMITS.minAmountCents || amountCents > LIMITS.maxAmountCents)
    return fail(400, 'Amount must be between $1 and $50,000.')

  const { n } = db()
    .prepare(`SELECT COUNT(*) AS n FROM bills WHERE user_id = ? AND status != 'paid'`)
    .get(user.id) as { n: number }
  if (n >= LIMITS.maxOpenBillsPerUser) return fail(429, 'You have a lot of open bills already.')

  let attachmentId: string | null = null
  let attachmentType: string | null = null
  const file = form.get('file')
  if (file instanceof File && file.size > 0) {
    if (file.size > LIMITS.maxAttachmentBytes) return fail(413, 'Attachment must be under 5 MB.')
    const buf = Buffer.from(await file.arrayBuffer())
    attachmentType = sniff(buf)
    if (!attachmentType) return fail(415, 'Attachment must be a JPEG, PNG, WebP or PDF.')
    attachmentId = randomUUID()
    await fs.writeFile(path.join(UPLOAD_DIR, attachmentId), buf)
  }

  const id = randomUUID()
  db().prepare(
    `INSERT INTO bills (id, user_id, title, category, amount_cents, story, due_date, attachment_id, attachment_type, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(id, user.id, title, category, amountCents, story, dueDate, attachmentId, attachmentType, now())

  return Response.json({ bill: toBill(db().prepare(`${BILL_SELECT} WHERE b.id = ?`).get(id)) }, { status: 201 })
}
