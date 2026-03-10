'use client'
import { motion } from 'framer-motion'
import { InputPanel } from './InputPanel'
import { stagger, fadeUp } from '@/lib/motion'

interface LandingProps {
  onGenerate: (prompt: string) => void
  isLoading: boolean
}

export function Landing({ onGenerate, isLoading }: LandingProps) {
  return (
    <motion.main
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex flex-col"
      style={{ paddingTop: 80 }}
    >
      {/* Hero */}
      <section
        className="flex flex-col md:flex-row items-start justify-between gap-16"
        style={{ padding: '60px 40px 80px', maxWidth: 1100, margin: '0 auto', width: '100%' }}
      >
        {/* Left: headline */}
        <motion.div variants={fadeUp} className="flex-1 max-w-xl">
          <p
            className="font-mono uppercase mb-6"
            style={{ fontSize: 9, letterSpacing: '0.45em', color: 'var(--text-muted)' }}
          >
            — Vol. I · AI Fashion Director
          </p>

          <h1
            className="font-display leading-none mb-6"
            style={{
              fontSize: 'clamp(56px, 8vw, 100px)',
              fontWeight: 400,
              color: 'var(--text)',
              letterSpacing: '-0.025em',
              lineHeight: 0.92,
            }}
          >
            EDITOR
          </h1>

          <p
            className="font-display italic"
            style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 400 }}
          >
            Describe any vibe. Get a complete outfit
            <span style={{ color: 'var(--gold)' }}> across every price point.</span>
          </p>

          {/* Editorial divider */}
          <div
            className="flex items-center gap-4 mt-8"
            style={{ color: 'var(--text-muted)' }}
          >
            <div className="h-px flex-1 max-w-24" style={{ background: 'var(--border)' }} />
            <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.3em' }}>
              SS26 COLLECTION
            </span>
            <div className="h-px flex-1 max-w-24" style={{ background: 'var(--border)' }} />
          </div>

          {/* Mini figure decoration */}
          <svg
            width="100" height="180"
            viewBox="0 0 100 180"
            fill="none"
            className="mt-8 opacity-20"
            aria-hidden
          >
            <motion.ellipse cx="50" cy="12" rx="10" ry="12"
              stroke="#1a1a1a" strokeWidth="0.8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            />
            {[
              'M50 24 C50 24 46 34 44 44 C40 58 38 68 40 78 C42 86 38 96 35 108',
              'M50 24 C50 24 54 34 56 44 C60 58 62 68 60 78 C58 86 62 96 65 108',
              'M35 50 C40 46 46 44 50 44 C54 44 60 46 65 50',
            ].map((d, i) => (
              <motion.path
                key={i} d={d}
                stroke="#1a1a1a" strokeWidth="0.7" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.6 + i * 0.2, duration: 1.2 }}
              />
            ))}
            <motion.path
              d="M35 108 C36 125 38 142 40 158 C41 166 42 173 43 178"
              stroke="#1a1a1a" strokeWidth="0.7" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            />
            <motion.path
              d="M65 108 C64 125 62 142 60 158 C59 166 58 173 57 178"
              stroke="#1a1a1a" strokeWidth="0.7" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            />
          </svg>
        </motion.div>

        {/* Right: input panel */}
        <motion.div variants={fadeUp} className="w-full md:w-80 lg:w-96">
          <InputPanel onGenerate={onGenerate} isLoading={isLoading} />
        </motion.div>
      </section>
    </motion.main>
  )
}
