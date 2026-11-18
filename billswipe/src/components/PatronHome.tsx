'use client'

import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api'
import { categoryOf, money, type Bill, type Leaderboard } from '@/lib/types'

type Direction = 'left' | 'right'
interface Deck {
  bills: Bill[]
  paidCents: number
  paidCount: number
}

export function PatronHome() {
  const [bills, setBills] = useState<Bill[] | null>(null)
  const [paid, setPaid] = useState({ cents: 0, count: 0 })
  const [board, setBoard] = useState<Leaderboard | null>(null)
  const [exitDir, setExitDir] = useState<Direction>('right')
  const [toast, setToast] = useState<{ text: string; good: boolean } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const load = useCallback(async () => {
    const [deck, leaderboard] = await Promise.all([
      api<Deck>('/api/deck'),
      api<Leaderboard>('/api/leaderboard'),
    ])
    setBills(deck.bills)
    setPaid({ cents: deck.paidCents, count: deck.paidCount })
    setBoard(leaderboard)
  }, [])

  useEffect(() => {
    load().catch(() => setBills([]))
  }, [load])

  const say = useCallback((text: string, good: boolean) => {
    setToast({ text, good })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  const swipe = useCallback(
    async (bill: Bill, direction: Direction) => {
      setExitDir(direction)
      setBills(current => current?.filter(b => b.id !== bill.id) ?? null)
      try {
        await api(`/api/bills/${bill.id}/swipe`, { method: 'POST', json: { direction } })
        if (direction === 'right') {
          setPaid(p => ({ cents: p.cents + bill.amountCents, count: p.count + 1 }))
          say(`Paid ${money(bill.amountCents)} for ${bill.ownerName}'s ${bill.title}`, true)
        }
      } catch (err) {
        say((err as Error).message, false)
      }
      // Pull in newly posted bills and refresh the leaderboard.
      load().catch(() => {})
    },
    [load, say],
  )

  const top = bills?.[0]
  useEffect(() => {
    if (!top) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') swipe(top, 'right')
      if (e.key === 'ArrowLeft') swipe(top, 'left')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [top, swipe])

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex items-baseline justify-between rounded-2xl border border-line bg-panel px-4 py-3">
        <span className="text-sm text-mute">You&apos;ve paid</span>
        <span>
          <span className="text-xl font-black text-cash">{money(paid.cents)}</span>
          <span className="text-sm text-mute">
            {' '}
            · {paid.count} bill{paid.count === 1 ? '' : 's'}
          </span>
        </span>
      </div>

      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
        {bills?.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-dashed border-line p-8 text-center">
            <div className="text-5xl">🥱</div>
            <p className="mt-4 font-bold">No more bills.</p>
            <p className="mt-1 text-sm text-mute">You are officially bored again. Check back when someone posts.</p>
            <button onClick={() => load()} className="mt-5 rounded-full border border-line px-4 py-2 text-sm hover:border-mute">
              Refresh
            </button>
          </div>
        )}
        <AnimatePresence custom={exitDir}>
          {bills
            ?.slice(0, 3)
            .map((bill, i) => <SwipeCard key={bill.id} bill={bill} depth={i} onSwipe={d => swipe(bill, d)} />)
            .reverse()}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button
          aria-label="Pass"
          disabled={!top}
          onClick={() => top && swipe(top, 'left')}
          className="grid size-16 place-items-center rounded-full border-2 border-nope text-2xl text-nope transition enabled:hover:bg-nope/15 enabled:active:scale-90 disabled:opacity-30"
        >
          ✕
        </button>
        <button
          aria-label="Pay this bill"
          disabled={!top}
          onClick={() => top && swipe(top, 'right')}
          className="grid size-20 place-items-center rounded-full bg-cash text-3xl shadow-[0_0_40px_rgb(31_224_150/0.35)] transition enabled:hover:brightness-110 enabled:active:scale-90 disabled:opacity-30"
        >
          💸
        </button>
      </div>
      <p className="text-center text-xs text-mute">Drag the card, tap a button, or use ← → keys</p>

      {board && board.patrons.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-mute">Least bored billionaires</h2>
          <ol className="overflow-hidden rounded-2xl border border-line bg-panel">
            {board.patrons.map((p, i) => (
              <li key={i} className="flex items-center gap-3 border-b border-line px-4 py-2.5 last:border-0">
                <span className="w-5 text-sm font-black text-mute">{i + 1}</span>
                <span className="flex-1 truncate font-semibold">{p.name}</span>
                <span className="text-xs text-mute">{p.bills} paid</span>
                <span className="font-black text-cash">{money(p.totalCents)}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className={`fixed inset-x-4 bottom-6 z-50 mx-auto max-w-sm rounded-2xl px-4 py-3 text-center text-sm font-bold shadow-xl ${
              toast.good ? 'bg-cash text-ink' : 'bg-nope text-white'
            }`}
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const SWIPE_DISTANCE = 110
const SWIPE_VELOCITY = 600

function SwipeCard({ bill, depth, onSwipe }: { bill: Bill; depth: number; onSwipe: (d: Direction) => void }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-260, 260], [-14, 14])
  const payOpacity = useTransform(x, [20, SWIPE_DISTANCE], [0, 1])
  const passOpacity = useTransform(x, [-SWIPE_DISTANCE, -20], [1, 0])
  const isTop = depth === 0
  const category = categoryOf(bill.category)
  const daysLeft = bill.dueDate ? Math.ceil((Date.parse(bill.dueDate) - Date.now()) / 86_400_000) : null

  return (
    <motion.article
      className="absolute inset-0 flex touch-pan-y select-none flex-col overflow-hidden rounded-3xl border border-line bg-panel shadow-2xl"
      style={{ x, rotate, zIndex: 3 - depth, cursor: isTop ? 'grab' : 'default' }}
      initial={{ scale: 0.9, y: 30, opacity: 0 }}
      animate={{ scale: 1 - depth * 0.05, y: depth * 14, opacity: 1 }}
      variants={{
        exit: (dir: Direction) => ({ x: dir === 'right' ? 520 : -520, opacity: 0, transition: { duration: 0.3 } }),
      }}
      exit="exit"
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      whileDrag={{ cursor: 'grabbing' }}
      onDragEnd={(_, info) => {
        if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) onSwipe('right')
        else if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) onSwipe('left')
      }}
    >
      <motion.div
        style={{ opacity: payOpacity }}
        className="pointer-events-none absolute left-5 top-16 z-10 -rotate-12 rounded-lg border-4 border-cash px-3 py-1 text-3xl font-black text-cash"
      >
        PAY
      </motion.div>
      <motion.div
        style={{ opacity: passOpacity }}
        className="pointer-events-none absolute right-5 top-16 z-10 rotate-12 rounded-lg border-4 border-nope px-3 py-1 text-3xl font-black text-nope"
      >
        PASS
      </motion.div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-volt/40 via-volt/10 to-transparent">
        {bill.attachmentType?.startsWith('image/') ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/bills/${bill.id}/attachment`}
            alt={`${bill.ownerName}'s bill`}
            draggable={false}
            className="absolute inset-0 size-full object-cover opacity-80"
          />
        ) : (
          <div className="text-8xl drop-shadow-lg">{category.emoji}</div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold backdrop-blur">
          {category.emoji} {category.label}
        </div>
        {daysLeft !== null && (
          <div
            className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold backdrop-blur ${
              daysLeft <= 5 ? 'bg-nope/90' : 'bg-ink/70'
            }`}
          >
            {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Due today' : `Due in ${daysLeft}d`}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm text-mute">{bill.ownerName} needs help with</div>
            <h3 className="truncate text-xl font-black">{bill.title}</h3>
          </div>
          <div className="text-3xl font-black tracking-tight text-cash">{money(bill.amountCents)}</div>
        </div>
        {bill.story && <p className="line-clamp-3 text-sm leading-snug text-white/75">{bill.story}</p>}
        {bill.attachmentType && isTop && (
          <a
            href={`/api/bills/${bill.id}/attachment`}
            target="_blank"
            rel="noreferrer"
            onPointerDown={e => e.stopPropagation()}
            className="self-start text-xs font-semibold text-volt underline"
          >
            View the actual bill ↗
          </a>
        )}
      </div>
    </motion.article>
  )
}
