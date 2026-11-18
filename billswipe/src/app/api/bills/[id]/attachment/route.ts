import fs from 'node:fs/promises'
import path from 'node:path'
import { currentUser, fail } from '@/lib/auth'
import { UPLOAD_DIR, db } from '@/lib/db'

/** Bill scans can hold personal details: only the owner and patrons may view them. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser()
  if (!user) return fail(401, 'Sign in first.')

  const { id } = await params
  const bill = db().prepare(`SELECT user_id, attachment_id, attachment_type FROM bills WHERE id = ?`).get(id) as
    | { user_id: string; attachment_id: string | null; attachment_type: string | null }
    | undefined
  if (!bill?.attachment_id || !bill.attachment_type) return fail(404, 'No attachment.')
  if (user.role !== 'patron' && bill.user_id !== user.id) return fail(403, 'Not yours to see.')

  const data = await fs.readFile(path.join(UPLOAD_DIR, bill.attachment_id)).catch(() => null)
  if (!data) return fail(404, 'No attachment.')
  return new Response(new Uint8Array(data), {
    headers: {
      'Content-Type': bill.attachment_type,
      'Content-Disposition': 'inline',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
      'Cache-Control': 'private, max-age=3600',
    },
  })
}
