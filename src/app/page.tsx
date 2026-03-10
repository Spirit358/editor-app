'use client'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Nav } from '@/components/Nav'
import { Landing } from '@/components/Landing'
import { Designer } from '@/components/Designer'
import { LoadingState } from '@/components/LoadingState'
import type { GeneratedOutfit } from '@/lib/types'
import { generateMockOutfit } from '@/lib/data'

type Stage = 'landing' | 'loading' | 'designing'

export default function Page() {
  const [stage, setStage] = useState<Stage>('landing')
  const [outfit, setOutfit] = useState<GeneratedOutfit | null>(null)

  const handleGenerate = async (prompt: string) => {
    setStage('loading')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      if (!res.ok) throw new Error('API failed')
      const data = await res.json() as GeneratedOutfit

      // Validate it has slots — if not, fall back to local mock
      if (!data.slots || data.slots.length === 0) {
        setOutfit(generateMockOutfit(prompt))
      } else {
        setOutfit(data)
      }
    } catch {
      // Graceful fallback to curated mock data
      await new Promise((r) => setTimeout(r, 1800)) // simulate loading
      setOutfit(generateMockOutfit(prompt))
    }
    setStage('designing')
  }

  const handleReset = () => {
    setStage('landing')
    setOutfit(null)
  }

  return (
    <>
      <Nav onReset={handleReset} stage={stage} />

      <AnimatePresence mode="wait">
        {stage === 'landing' && (
          <Landing key="landing" onGenerate={handleGenerate} isLoading={false} />
        )}

        {stage === 'loading' && (
          <div key="loading" className="min-h-screen flex items-center justify-center" style={{ paddingTop: 80 }}>
            <LoadingState />
          </div>
        )}

        {stage === 'designing' && outfit && (
          <Designer
            key="designing"
            outfit={outfit}
            onNewGenerate={handleGenerate}
            isLoading={false}
          />
        )}
      </AnimatePresence>
    </>
  )
}
