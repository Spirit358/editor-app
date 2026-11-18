import { randomUUID } from 'node:crypto'
import { currentUser, fail } from '@/lib/auth'
import { BILL_SELECT, db, now, transaction } from '@/lib/db'
import { toBill } from '@/lib/db'
import { getPaymentProvider } from '@/lib/payments'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser()
  if (!user) return fail(401, 'Sign in first.')
  if (user.role !== 'patron') return fail(403, 'Only billionaires can swipe.')

  const { id } = await params
  const body = await req.json().catch(() => null)
  const direction = body?.direction
  if (direction !== 'left' && direction !== 'right') return fail(400, 'Swipe left or right.')

  const bill = db().prepare(`SELECT id, user_id, amount_cents FROM bills WHERE id = ?`).get(id) as
    | { id: string; user_id: string; amount_cents: number }
    | undefined
  if (!bill) return fail(404, 'No such bill.')

  const recordSwipe = () =>
    db()
      .prepare(
        `INSERT INTO swipes (bill_id, patron_id, direction, created_at) VALUES (?, ?, ?, ?)
         ON CONFLICT (bill_id, patron_id) DO UPDATE SET direction = excluded.direction`,
      )
      .run(id, user.id, direction, now())

  if (direction === 'left') {
    recordSwipe()
    return Response.json({ ok: true })
  }

  // Claim the bill before charging so two patrons can never both pay it.
  const claim = db().prepare(`UPDATE bills SET status = 'pending' WHERE id = ? AND status = 'open'`).run(id)
  if (claim.changes === 0) return fail(409, 'Someone else already paid this one.')

  const release = () => db().prepare(`UPDATE bills SET status = 'open' WHERE id = ? AND status = 'pending'`).run(id)
  const provider = getPaymentProvider()
  let charge
  try {
    charge = await provider.charge({ billId: id, patronId: user.id, amountCents: bill.amount_cents })
  } catch (err) {
    release()
    throw err
  }
  if (!charge.ok) {
    release()
    return fail(402, 'Payment failed. The bill is back in the deck.')
  }

  transaction(() => {
    db().prepare(
      `INSERT INTO payments (id, bill_id, patron_id, amount_cents, provider, provider_ref, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).run(randomUUID(), id, user.id, bill.amount_cents, provider.name, charge.ref, now())
    db().prepare(`UPDATE bills SET status = 'paid' WHERE id = ?`).run(id)
    recordSwipe()
  })

  return Response.json({ ok: true, bill: toBill(db().prepare(`${BILL_SELECT} WHERE b.id = ?`).get(id)) })
}
