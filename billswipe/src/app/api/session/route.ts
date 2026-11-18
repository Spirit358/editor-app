import { currentUser, fail, signIn, signOut } from '@/lib/auth'

export async function GET() {
  return Response.json({ user: await currentUser() })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const name = typeof body?.name === 'string' ? body.name.trim().replace(/\s+/g, ' ') : ''
  const role = body?.role
  if (name.length < 2 || name.length > 30) return fail(400, 'Name must be 2–30 characters.')
  if (role !== 'poster' && role !== 'patron') return fail(400, 'Pick a side.')
  await signOut()
  return Response.json({ user: await signIn(name, role) })
}

export async function DELETE() {
  await signOut()
  return Response.json({ ok: true })
}
