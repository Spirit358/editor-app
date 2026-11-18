import { db } from '@/lib/db'
import type { Leaderboard } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const totals = db()
    .prepare(`SELECT COALESCE(SUM(amount_cents), 0) AS total, COUNT(*) AS cleared FROM payments`)
    .get() as { total: number; cleared: number }
  const { open } = db().prepare(`SELECT COUNT(*) AS open FROM bills WHERE status = 'open'`).get() as { open: number }
  const patrons = db()
    .prepare(
      `SELECT u.name AS name, SUM(p.amount_cents) AS totalCents, COUNT(*) AS bills
       FROM payments p JOIN users u ON u.id = p.patron_id
       GROUP BY u.id ORDER BY totalCents DESC LIMIT 5`,
    )
    .all() as Leaderboard['patrons']

  const body: Leaderboard = {
    totalPaidCents: totals.total,
    billsCleared: totals.cleared,
    billsOpen: open,
    patrons: patrons.map(p => ({ name: p.name, totalCents: p.totalCents, bills: p.bills })),
  }
  return Response.json(body)
}
