'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { OutfitItem, ItemCategory, GeneratedOutfit } from '@/lib/types'
import { TIER_COLORS, CATEGORY_LABELS } from '@/lib/types'
import { stagger, itemFade } from '@/lib/motion'

interface FitSummaryProps {
  outfit: GeneratedOutfit
  selectedItems: Partial<Record<ItemCategory, OutfitItem>>
  onSlotClick: (cat: ItemCategory) => void
}

export function FitSummary({ outfit, selectedItems, onSlotClick }: FitSummaryProps) {
  const [showShare, setShowShare] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const allItems = Object.values(selectedItems).filter(Boolean) as OutfitItem[]
  const totalPrice = allItems.reduce((sum, i) => sum + i.price, 0)
  const selectedCount = allItems.length
  const totalSlots = outfit.slots.length

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tierColor = TIER_COLORS[
    allItems.length > 0
      ? allItems[Math.floor(allItems.length / 2)]?.tier ?? 'mid'
      : 'mid'
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      style={{ borderTop: '1px solid var(--border)', paddingTop: 32, marginTop: 16 }}
    >
      {/* Section header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="font-mono uppercase mb-1" style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.3em' }}>
            Your Edit
          </p>
          <h2
            className="font-display italic"
            style={{ fontSize: 22, color: 'var(--text)', fontWeight: 400, lineHeight: 1.1 }}
          >
            {outfit.vibeName}
          </h2>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="font-mono" style={{ fontSize: 8, color: 'var(--text-ghost)', letterSpacing: '0.2em' }}>
              SELECTED
            </p>
            <p className="font-display" style={{ fontSize: 16, color: tierColor, fontWeight: 500 }}>
              {selectedCount}/{totalSlots}
            </p>
          </div>
          {allItems.length > 0 && (
            <div className="text-right">
              <p className="font-mono" style={{ fontSize: 8, color: 'var(--text-ghost)', letterSpacing: '0.2em' }}>
                TOTAL
              </p>
              <p className="font-display" style={{ fontSize: 16, color: 'var(--text)', fontWeight: 500 }}>
                £{totalPrice.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Outfit equation */}
      {outfit.outfitEquation && (
        <div
          className="mb-6 px-4 py-3"
          style={{ borderLeft: `2px solid ${tierColor}`, background: 'var(--bg-warm)' }}
        >
          <p className="font-mono" style={{ fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.25em', marginBottom: 4 }}>
            THE FORMULA
          </p>
          <p className="font-display italic" style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {outfit.outfitEquation}
          </p>
        </div>
      )}

      {/* Selected items grid */}
      {allItems.length > 0 ? (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid gap-2 mb-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}
        >
          {allItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemFade}
              onClick={() => onSlotClick(item.category)}
              className="group transition-colors"
              style={{
                padding: '12px 14px',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                cursor: 'pointer',
              }}
              whileHover={{ borderColor: 'var(--gold)' }}
            >
              <p
                className="font-mono uppercase mb-1"
                style={{ fontSize: 7, color: TIER_COLORS[item.tier], letterSpacing: '0.2em' }}
              >
                {CATEGORY_LABELS[item.category]}
              </p>
              <p className="font-display italic leading-tight mb-1" style={{ fontSize: 12, color: 'var(--text)' }}>
                {item.name}
              </p>
              <p className="font-mono" style={{ fontSize: 9, color: 'var(--text-secondary)' }}>
                {item.brand}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="font-mono" style={{ fontSize: 10, color: TIER_COLORS[item.tier], fontWeight: 400 }}>
                  £{item.price.toLocaleString()}
                </p>
                <p className="font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontSize: 8, color: 'var(--text-muted)' }}>
                  swap →
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div
          className="mb-6 flex flex-col items-center justify-center"
          style={{ height: 120, border: '1px dashed var(--border)' }}
        >
          <p className="font-display italic" style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Click items on the figure to build your look
          </p>
          <p className="font-mono mt-2" style={{ fontSize: 9, color: 'var(--text-ghost)' }}>
            Select one piece at a time
          </p>
        </div>
      )}

      {/* Styling notes */}
      {outfit.stylingNotes.length > 0 && (
        <div className="mb-6">
          <p className="font-mono uppercase mb-3" style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.3em' }}>
            Styling Notes
          </p>
          <div className="flex flex-col gap-2">
            {outfit.stylingNotes.map((note, i) => (
              <div key={i} className="flex gap-3">
                <span className="font-mono shrink-0 mt-0.5" style={{ fontSize: 9, color: 'var(--text-ghost)' }}>
                  0{i + 1}
                </span>
                <p className="font-display italic" style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sustainability */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <div className="flex items-center gap-2">
          <div
            className="h-1 rounded"
            style={{
              width: 80,
              background: 'var(--border)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div
              className="h-full rounded"
              initial={{ width: 0 }}
              animate={{ width: `${outfit.sustainabilityScore}%` }}
              transition={{ delay: 0.8, duration: 1.0 }}
              style={{ background: '#7ab87a' }}
            />
          </div>
          <span className="font-mono" style={{ fontSize: 8, color: '#7ab87a', letterSpacing: '0.15em' }}>
            {outfit.sustainabilityScore}% SUSTAINABLE
          </span>
        </div>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.01, background: 'var(--text)', color: 'white' }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 font-mono uppercase transition-colors"
          style={{
            fontSize: 9,
            letterSpacing: '0.3em',
            padding: '13px 16px',
            border: '1px solid var(--text)',
            color: saved ? 'white' : 'var(--text)',
            background: saved ? 'var(--text)' : 'transparent',
          }}
        >
          {saved ? '✓ Saved to Runway' : '★ Save Fit'}
        </motion.button>

        <motion.button
          onClick={() => setShowShare(true)}
          whileHover={{ scale: 1.01, borderColor: 'var(--gold)', color: 'var(--gold)' }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 font-mono uppercase transition-colors"
          style={{
            fontSize: 9,
            letterSpacing: '0.3em',
            padding: '13px 16px',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            background: 'transparent',
          }}
        >
          Share to Runway ↗
        </motion.button>
      </div>

      {/* Share modal */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShare(false)}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
            style={{ background: 'rgba(250,250,248,0.85)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                padding: '32px',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <p className="font-mono uppercase" style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.3em' }}>
                  Share Your Look
                </p>
                <button onClick={() => setShowShare(false)} className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  ✕
                </button>
              </div>

              <p className="font-display italic mb-1" style={{ fontSize: 20, color: 'var(--text)' }}>
                {outfit.vibeName}
              </p>
              <p className="font-mono mb-6" style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                {selectedCount} pieces selected · £{totalPrice.toLocaleString()}
              </p>

              <div className="h-px mb-6" style={{ background: 'var(--border)' }} />

              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.01 }}
                className="w-full font-mono uppercase mb-3 transition-colors"
                style={{
                  fontSize: 9,
                  letterSpacing: '0.25em',
                  padding: '12px',
                  border: `1px solid ${copied ? 'var(--gold)' : 'var(--border)'}`,
                  color: copied ? 'var(--gold)' : 'var(--text-secondary)',
                  background: 'transparent',
                }}
              >
                {copied ? '✓ Link Copied!' : '⬡ Copy Link'}
              </motion.button>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Pinterest', icon: '📌', href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&description=${encodeURIComponent(outfit.vibeName + ' by EDITOR')}` },
                  { name: 'Instagram', icon: '◉', href: '#' },
                  { name: 'TikTok',    icon: '♫', href: '#' },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 font-mono transition-colors hover:border-gray-400"
                    style={{
                      fontSize: 8,
                      letterSpacing: '0.15em',
                      padding: '10px 6px',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{s.icon}</span>
                    {s.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
