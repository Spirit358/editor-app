'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api'
import { CATEGORIES, categoryOf, money, type Bill, type CategoryId } from '@/lib/types'

export function PosterHome() {
  const [bills, setBills] = useState<Bill[] | null>(null)

  const refresh = useCallback(() => {
    api<{ bills: Bill[] }>('/api/bills')
      .then(r => setBills(r.bills))
      .catch(() => {})
  }, [])

  // Poll so a bill flips to "paid" while the poster is watching.
  useEffect(() => {
    refresh()
    const timer = setInterval(refresh, 5000)
    return () => clearInterval(timer)
  }, [refresh])

  const paid = bills?.filter(b => b.status === 'paid') ?? []

  return (
    <div className="flex flex-col gap-6">
      {paid.length > 0 && (
        <div className="rounded-2xl border border-cash/40 bg-cash/10 p-4 text-center">
          <div className="text-2xl font-black text-cash">
            {money(paid.reduce((sum, b) => sum + b.amountCents, 0))} paid for you
          </div>
          <div className="text-sm text-mute">
            {paid.length} bill{paid.length === 1 ? '' : 's'} cleared by bored billionaires
          </div>
        </div>
      )}

      <BillForm onCreated={refresh} />

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-mute">Your bills</h2>
        {bills === null ? null : bills.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-mute">
            Nothing posted yet. Add a bill above and it goes straight into the billionaires&apos; deck.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {bills.map(b => (
              <li key={b.id} className="flex items-center gap-3 rounded-2xl border border-line bg-panel p-3">
                <div className="text-2xl">{categoryOf(b.category).emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{b.title}</div>
                  <div className="text-xs text-mute">
                    {b.status === 'paid' ? `Paid by ${b.paidBy}` : 'In the deck, waiting for a swipe'}
                    {b.attachmentType && (
                      <>
                        {' · '}
                        <a className="underline" href={`/api/bills/${b.id}/attachment`} target="_blank" rel="noreferrer">
                          attachment
                        </a>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black">{money(b.amountCents)}</div>
                  <div
                    className={`text-[0.65rem] font-bold uppercase tracking-widest ${
                      b.status === 'paid' ? 'text-cash' : 'text-volt'
                    }`}
                  >
                    {b.status === 'paid' ? 'Paid' : 'Open'}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function BillForm({ onCreated }: { onCreated: () => void }) {
  const [category, setCategory] = useState<CategoryId>('rent')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const body = new FormData(e.currentTarget)
      body.set('category', category)
      await api('/api/bills', { method: 'POST', body })
      formRef.current?.reset()
      onCreated()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={submit} className="flex flex-col gap-3 rounded-3xl border border-line bg-panel p-4">
      <h2 className="headline text-2xl">
        Upload a <span className="text-volt">bill</span>
      </h2>

      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Category">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={category === c.id}
            onClick={() => setCategory(c.id)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              category === c.id ? 'border-volt bg-volt/20' : 'border-line hover:border-mute'
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <input className="field" name="title" placeholder="What is it? e.g. March rent" required minLength={3} maxLength={80} />
      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs text-mute">
          Amount (USD)
          <input className="field mt-1" name="amount" inputMode="decimal" placeholder="1450.00" required />
        </label>
        <label className="text-xs text-mute">
          Due date
          <input className="field mt-1" name="dueDate" type="date" />
        </label>
      </div>
      <textarea
        className="field resize-none"
        name="story"
        rows={3}
        maxLength={400}
        placeholder="Make your case. Billionaires are bored, not heartless."
      />
      <label className="text-xs text-mute">
        Photo or PDF of the bill (optional, max 5 MB)
        <input
          className="mt-1 block w-full text-sm text-mute file:mr-3 file:rounded-lg file:border-0 file:bg-line file:px-3 file:py-2 file:text-white"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
        />
      </label>
      <p className="text-xs text-mute">
        Billionaires can open your attachment. Cover account numbers and addresses first.
      </p>

      {error && <p className="text-sm text-nope">{error}</p>}
      <button
        disabled={busy}
        className="rounded-xl bg-volt py-3 font-black uppercase tracking-wide transition enabled:hover:brightness-110 disabled:opacity-40"
      >
        {busy ? 'Posting…' : 'Put it in the deck'}
      </button>
    </form>
  )
}
