'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { OutfitItem, ItemCategory, Tier } from '@/lib/types'
import { TIER_COLORS, TIER_LABELS, CATEGORY_LABELS } from '@/lib/types'

interface ItemCarouselProps {
  category: ItemCategory
  items: OutfitItem[]
  selectedItem: OutfitItem | null
  onSelect: (item: OutfitItem) => void
  onClose: () => void
}

export function ItemCarousel({ category, items, selectedItem, onSelect, onClose }: ItemCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(
    selectedItem ? items.findIndex((i) => i.id === selectedItem.id) : 0
  )
  const [direction, setDirection] = useState(0)

  const currentItem = items[currentIndex]
  if (!currentItem) return null

  const goTo = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1)
    setCurrentIndex(idx)
  }
  const prev = () => goTo((currentIndex - 1 + items.length) % items.length)
  const next = () => goTo((currentIndex + 1) % items.length)

  const tierColor = TIER_COLORS[currentItem.tier]

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.35, ease: [0.0, 0.0, 0.2, 1.0] }}
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <p className="font-mono uppercase" style={{ fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.35em' }}>
            Selecting
          </p>
          <p className="font-display italic" style={{ fontSize: 18, color: 'var(--text)' }}>
            {CATEGORY_LABELS[category]}
          </p>
        </div>
        <button
          onClick={onClose}
          className="font-mono transition-colors hover:text-black"
          style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.2em' }}
        >
          ✕ close
        </button>
      </div>

      {/* Tier filter tabs */}
      <div className="flex gap-1 mb-5">
        {(['budget', 'mid', 'premium', 'luxury'] as Tier[]).map((tier) => {
          const hasItem = items.some((i) => i.tier === tier)
          const isActive = currentItem.tier === tier
          return (
            <button
              key={tier}
              disabled={!hasItem}
              onClick={() => {
                const idx = items.findIndex((i) => i.tier === tier)
                if (idx !== -1) goTo(idx)
              }}
              className="font-mono transition-all"
              style={{
                fontSize: 8,
                letterSpacing: '0.2em',
                padding: '4px 8px',
                border: `1px solid ${isActive ? TIER_COLORS[tier] : 'var(--border)'}`,
                color: isActive ? TIER_COLORS[tier] : 'var(--text-muted)',
                opacity: hasItem ? 1 : 0.3,
                background: 'transparent',
              }}
            >
              {tier.slice(0, 3).toUpperCase()}
            </button>
          )
        })}
      </div>

      {/* Main item card */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentItem.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.3, ease: [0.0, 0.0, 0.2, 1.0] }}
            className="absolute inset-0 flex flex-col"
          >
            {/* Price + tier badge */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p
                  className="font-display"
                  style={{ fontSize: 32, color: tierColor, lineHeight: 1, fontWeight: 600 }}
                >
                  £{currentItem.price.toLocaleString()}
                </p>
                <div
                  className="font-mono mt-1 inline-block"
                  style={{
                    fontSize: 8,
                    letterSpacing: '0.25em',
                    padding: '2px 8px',
                    border: `1px solid ${tierColor}`,
                    color: tierColor,
                  }}
                >
                  {TIER_LABELS[currentItem.tier]}
                </div>
              </div>
              {/* Color swatches */}
              <div className="flex gap-1 mt-1">
                {currentItem.colors.slice(0, 4).map((c, i) => (
                  <div
                    key={i}
                    className="rounded-sm"
                    style={{
                      width: 14, height: 14,
                      background: c,
                      border: '1px solid var(--border)',
                    }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            {/* Item name + brand */}
            <p
              className="font-display leading-tight mb-1"
              style={{ fontSize: 18, color: 'var(--text)', fontWeight: 500 }}
            >
              {currentItem.name}
            </p>
            <p className="font-mono mb-4" style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
              {currentItem.brand}
            </p>

            {/* Divider */}
            <div className="h-px mb-4" style={{ background: 'var(--border)' }} />

            {/* Description */}
            <p
              className="font-display italic leading-relaxed mb-4 flex-1"
              style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}
            >
              {currentItem.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-5">
              {currentItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono"
                  style={{
                    fontSize: 8,
                    letterSpacing: '0.15em',
                    padding: '2px 7px',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Retailer links */}
            <div className="flex gap-2 mb-5">
              {currentItem.retailers.map((r) => (
                <a
                  key={r.name}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono transition-colors hover:text-black flex items-center gap-1"
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.15em',
                    padding: '6px 10px',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    flex: 1,
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: tierColor }}>{r.icon}</span> {r.name}
                </a>
              ))}
            </div>

            {/* Select button */}
            <motion.button
              onClick={() => onSelect(currentItem)}
              whileHover={{ scale: 1.01, background: 'var(--text)', color: 'var(--bg)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full font-mono uppercase transition-colors"
              style={{
                fontSize: 10,
                letterSpacing: '0.3em',
                padding: '13px 20px',
                border: selectedItem?.id === currentItem.id ? `1px solid ${tierColor}` : '1px solid var(--text)',
                color: selectedItem?.id === currentItem.id ? tierColor : 'var(--text)',
                background: 'transparent',
              }}
            >
              {selectedItem?.id === currentItem.id ? '✓ Selected' : 'Select This Piece'}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-5 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          onClick={prev}
          className="font-mono transition-colors hover:text-black"
          style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.2em', padding: '4px 0' }}
        >
          ← Prev
        </button>

        {/* Dot navigation */}
        <div className="flex gap-1.5 items-center">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all rounded-full"
              style={{
                width: i === currentIndex ? 14 : 5,
                height: 5,
                background: i === currentIndex ? tierColor : 'var(--border-dark)',
                border: 'none',
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="font-mono transition-colors hover:text-black"
          style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.2em', padding: '4px 0' }}
        >
          Next →
        </button>
      </div>

      {/* Progress */}
      <p className="font-mono text-center mt-2" style={{ fontSize: 8, color: 'var(--text-ghost)' }}>
        {currentIndex + 1} of {items.length} options
      </p>
    </motion.aside>
  )
}
