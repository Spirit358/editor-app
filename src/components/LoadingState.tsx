'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const MESSAGES = [
  'Consulting the archives…',
  'Scanning the season…',
  'Sourcing the fabrics…',
  'Building your look…',
  'Almost dressed…',
]

export function LoadingState() {
  const [idx, setIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const msg = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 1000)
    const prog = setInterval(() => setProgress((p) => Math.min(p + Math.random() * 14, 88)), 350)
    return () => { clearInterval(msg); clearInterval(prog) }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: 400 }}>
      {/* Animated sketch figure */}
      <svg width="90" height="200" viewBox="0 0 90 200" fill="none" className="mb-10">
        {[
          'M45 12 C45 12 41 24 38 36 C34 50 32 60 34 72 C36 80 32 90 29 103',
          'M45 12 C45 12 49 24 52 36 C56 50 58 60 56 72 C54 80 58 90 61 103',
          'M29 40 C34 36 40 34 45 34 C50 34 56 36 61 40',
          'M29 103 C30 120 32 140 34 158 C36 170 38 180 39 190',
          'M61 103 C60 120 58 140 56 158 C54 170 52 180 51 190',
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="#c8a96e"
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{
              pathLength: { delay: i * 0.25, duration: 1.4, ease: [0.0, 0.0, 0.2, 1.0] },
              opacity:    { delay: i * 0.25, duration: 0.4 },
              repeat: Infinity, repeatDelay: 0.5,
            }}
          />
        ))}
        <motion.ellipse cx="45" cy="8" rx="7" ry="9"
          stroke="#c8a96e" strokeWidth="0.8" fill="none"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        />
      </svg>

      {/* Cycling message */}
      <div style={{ height: 20, marginBottom: 20, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="font-mono text-center"
            style={{ fontSize: 10, letterSpacing: '0.25em', color: 'var(--text-secondary)' }}
          >
            {MESSAGES[idx]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 120, height: 1,
          background: 'var(--border)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--gold)' }}
        />
      </div>
    </div>
  )
}
