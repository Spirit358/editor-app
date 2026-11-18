'use client'

import { useCallback, useEffect, useState } from 'react'
import { Onboarding } from '@/components/Onboarding'
import { PatronHome } from '@/components/PatronHome'
import { PosterHome } from '@/components/PosterHome'
import { api } from '@/lib/api'
import type { User } from '@/lib/types'

export default function Page() {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    api<{ user: User | null }>('/api/session')
      .then(r => setUser(r.user))
      .catch(() => setUser(null))
  }, [])

  const signOut = useCallback(async () => {
    await api('/api/session', { method: 'DELETE' }).catch(() => {})
    setUser(null)
  }, [])

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-6">
      <header className="flex items-center justify-between py-4">
        <div className="text-lg font-black tracking-tight">
          BILL<span className="text-volt">SWIPE</span>
        </div>
        {user && (
          <button onClick={signOut} className="text-sm text-mute hover:text-white">
            {user.role === 'patron' ? '💎' : '🧾'} {user.name} · Switch
          </button>
        )}
      </header>

      <main className="flex flex-1 flex-col">
        {user === undefined ? null : user === null ? (
          <Onboarding onSignedIn={setUser} />
        ) : user.role === 'patron' ? (
          <PatronHome />
        ) : (
          <PosterHome />
        )}
      </main>

      <footer className="pt-8 text-center text-xs text-mute">
        Demo mode — payments are simulated and no real money moves.
      </footer>
    </div>
  )
}
