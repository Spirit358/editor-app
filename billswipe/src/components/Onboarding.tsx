'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { money, type Leaderboard, type Role, type User } from '@/lib/types'

const ROLES: { id: Role; emoji: string; title: string; blurb: string }[] = [
  { id: 'poster', emoji: '🧾', title: 'I have bills', blurb: 'Upload them and hope.' },
  { id: 'patron', emoji: '💎', title: "I'm a bored billionaire", blurb: 'Swipe right to pay.' },
]

export function Onboarding({ onSignedIn }: { onSignedIn: (user: User) => void }) {
  const [role, setRole] = useState<Role>('poster')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [stats, setStats] = useState<Leaderboard | null>(null)

  useEffect(() => {
    api<Leaderboard>('/api/leaderboard').then(setStats).catch(() => {})
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { user } = await api<{ user: User }>('/api/session', { method: 'POST', json: { name, role } })
      onSignedIn(user)
    } catch (err) {
      setError((err as Error).message)
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-8 py-6">
      <h1 className="headline text-[2.6rem]">
        Upload your <span className="text-volt">bills.</span> Bored{' '}
        <span className="text-volt">billionaires</span> swipe right to <span className="text-cash">pay</span> them.
      </h1>

      {stats && (
        <dl className="grid grid-cols-3 gap-2 text-center">
          {[
            [money(stats.totalPaidCents), 'paid out'],
            [stats.billsCleared, 'bills cleared'],
            [stats.billsOpen, 'waiting'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-line bg-panel px-2 py-3">
              <dd className="text-xl font-black">{value}</dd>
              <dt className="text-xs text-mute">{label}</dt>
            </div>
          ))}
        </dl>
      )}

      <form onSubmit={submit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Who are you?">
          {ROLES.map(r => (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={role === r.id}
              onClick={() => setRole(r.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                role === r.id ? 'border-volt bg-volt/15' : 'border-line bg-panel hover:border-mute'
              }`}
            >
              <div className="text-3xl">{r.emoji}</div>
              <div className="mt-2 font-bold leading-tight">{r.title}</div>
              <div className="mt-1 text-xs text-mute">{r.blurb}</div>
            </button>
          ))}
        </div>

        <input
          className="field"
          placeholder="Your first name"
          aria-label="Your first name"
          value={name}
          maxLength={30}
          onChange={e => setName(e.target.value)}
        />
        {error && <p className="text-sm text-nope">{error}</p>}
        <button
          disabled={busy || name.trim().length < 2}
          className="rounded-xl bg-volt py-3.5 font-black uppercase tracking-wide transition enabled:hover:brightness-110 disabled:opacity-40"
        >
          {role === 'patron' ? 'Start swiping' : 'Post my bills'}
        </button>
      </form>
    </div>
  )
}
