import { currentUser, fail } from '@/lib/auth'
import { BILL_SELECT, db, toBill } from '@/lib/db'

/** Open bills this patron has not swiped on yet, oldest first, plus their running totals. */
export async function GET() {
  const user = await currentUser()
  if (!user) return fail(401, 'Sign in first.')
  if (user.role !== 'patron') return fail(403, 'Only billionaires get a deck.')

  const rows = db()
    .prepare(
      `${BILL_SELECT}
       WHERE b.status = 'open'
         AND NOT EXISTS (SELECT 1 FROM swipes s WHERE s.bill_id = b.id AND s.patron_id = ?)
       ORDER BY b.created_at ASC
       LIMIT 20`,
    )
    .all(user.id)
  const mine = db()
    .prepare(`SELECT COALESCE(SUM(amount_cents), 0) AS total, COUNT(*) AS bills FROM payments WHERE patron_id = ?`)
    .get(user.id) as { total: number; bills: number }

  return Response.json({ bills: rows.map(toBill), paidCents: mine.total, paidCount: mine.bills })
}
