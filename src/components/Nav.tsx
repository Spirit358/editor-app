'use client'
import { motion, useScroll, useTransform } from 'framer-motion'

interface NavProps {
  onReset?: () => void
  stage: 'landing' | 'loading' | 'designing'
}

export function Nav({ onReset, stage }: NavProps) {
  const { scrollY } = useScroll()
  const borderOpacity = useTransform(scrollY, [0, 60], [0, 1])

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        padding: '20px 40px',
        borderBottom: '1px solid',
        borderColor: borderOpacity.get() > 0.5 ? 'var(--border)' : 'transparent',
        background: 'rgba(250,250,248,0.9)',
        backdropFilter: 'blur(12px)',
        transition: 'border-color 0.3s',
      }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <button
        onClick={onReset}
        className="font-mono uppercase hover:opacity-70 transition-opacity"
        style={{ fontSize: 13, letterSpacing: '0.45em', color: 'var(--text)', fontWeight: 400 }}
      >
        EDITOR
      </button>

      {/* Center — issue label on landing */}
      {stage === 'landing' && (
        <div className="hidden md:flex items-center gap-4">
          <div className="h-px w-8" style={{ background: 'var(--border-dark)' }} />
          <span className="font-display italic" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Spring/Summer 2026
          </span>
          <div className="h-px w-8" style={{ background: 'var(--border-dark)' }} />
        </div>
      )}

      {/* Right nav */}
      <div className="flex items-center gap-6">
        {stage === 'designing' && (
          <button
            onClick={onReset}
            className="font-mono uppercase hover:text-black transition-colors"
            style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--text-secondary)' }}
          >
            ← New Fit
          </button>
        )}
        {['Runway', 'Trends', 'About'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="font-mono uppercase hover:text-black transition-colors hidden md:block"
            style={{ fontSize: 9, letterSpacing: '0.25em', color: 'var(--text-secondary)' }}
          >
            {item}
          </a>
        ))}
      </div>
    </motion.nav>
  )
}
