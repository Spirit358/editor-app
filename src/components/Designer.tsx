'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { FashionSketch } from './FashionSketch'
import { ItemCarousel } from './ItemCarousel'
import { FitSummary } from './FitSummary'
import { InputPanel } from './InputPanel'
import type { GeneratedOutfit, ItemCategory, OutfitItem, ViewAngle } from '@/lib/types'

interface DesignerProps {
  outfit: GeneratedOutfit
  onNewGenerate: (prompt: string) => void
  isLoading: boolean
}

export function Designer({ outfit, onNewGenerate, isLoading }: DesignerProps) {
  const [activeSlot, setActiveSlot] = useState<ItemCategory | null>('outerwear')
  const [selectedItems, setSelectedItems] = useState<Partial<Record<ItemCategory, OutfitItem>>>({})
  const [viewAngle, setViewAngle] = useState<ViewAngle>('front')

  const activeSlotData = activeSlot
    ? outfit.slots.find((s) => s.category === activeSlot)
    : null

  const handleSelect = (item: OutfitItem) => {
    setSelectedItems((prev) => ({ ...prev, [item.category]: item }))
  }

  const handleSlotClick = (cat: ItemCategory) => {
    setActiveSlot(activeSlot === cat ? null : cat)
  }

  const VIEW_ANGLES: ViewAngle[] = ['front', 'side', 'back']

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ paddingTop: 72, minHeight: '100vh' }}
    >
      {/* Outfit name bar */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '12px 40px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg)',
        }}
      >
        <div className="flex items-center gap-4">
          <span
            className="font-mono uppercase"
            style={{ fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.35em' }}
          >
            Editing
          </span>
          <span className="font-display italic" style={{ fontSize: 15, color: 'var(--text)' }}>
            {outfit.vibeName}
          </span>
          <div
            className="font-mono"
            style={{
              fontSize: 8,
              letterSpacing: '0.2em',
              padding: '2px 8px',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            Trend {outfit.trendScore}/10
          </div>
        </div>

        {/* View angle selector */}
        <div className="flex items-center gap-1">
          <span className="font-mono mr-2" style={{ fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.2em' }}>
            VIEW
          </span>
          {VIEW_ANGLES.map((angle) => (
            <button
              key={angle}
              onClick={() => setViewAngle(angle)}
              className="font-mono uppercase transition-colors"
              style={{
                fontSize: 8,
                letterSpacing: '0.2em',
                padding: '4px 10px',
                border: `1px solid ${viewAngle === angle ? 'var(--text)' : 'var(--border)'}`,
                color: viewAngle === angle ? 'var(--text)' : 'var(--text-muted)',
                background: viewAngle === angle ? 'var(--text)' : 'transparent',
                color: viewAngle === angle ? 'white' : 'var(--text-muted)',
              } as React.CSSProperties}
            >
              {angle}
            </button>
          ))}
        </div>
      </div>

      {/* Three columns */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: '280px 1fr 300px',
          gap: 0,
          minHeight: 'calc(100vh - 118px)',
        }}
      >
        {/* ── LEFT COLUMN: Input / New Search ── */}
        <aside
          className="border-r overflow-y-auto"
          style={{
            borderColor: 'var(--border)',
            padding: '32px 28px',
            background: 'var(--bg)',
            position: 'sticky',
            top: 72,
            height: 'calc(100vh - 118px)',
          }}
        >
          <InputPanel onGenerate={onNewGenerate} isLoading={isLoading} />
        </aside>

        {/* ── CENTER COLUMN: Fashion Sketch ── */}
        <main
          className="flex flex-col items-center justify-start"
          style={{
            padding: '48px 40px',
            background: 'var(--bg-warm)',
            position: 'relative',
          }}
        >
          {/* Outfit summary text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-md mb-8 text-center"
          >
            <p
              className="font-display italic"
              style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}
            >
              {outfit.summary}
            </p>
          </motion.div>

          {/* The sketch */}
          <div style={{ width: '100%', maxWidth: 300 }}>
            <FashionSketch
              viewAngle={viewAngle}
              activeSlot={activeSlot}
              selectedItems={selectedItems}
              onSlotClick={handleSlotClick}
            />
          </div>

          {/* Instruction */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="font-mono text-center mt-6"
            style={{ fontSize: 9, color: 'var(--text-ghost)', letterSpacing: '0.25em' }}
          >
            Click dots on the figure to select each piece
          </motion.p>

          {/* Fit summary below figure */}
          <div style={{ width: '100%', maxWidth: 680, marginTop: 40 }}>
            <FitSummary
              outfit={outfit}
              selectedItems={selectedItems}
              onSlotClick={handleSlotClick}
            />
          </div>
        </main>

        {/* ── RIGHT COLUMN: Item Carousel ── */}
        <aside
          className="border-l overflow-y-auto"
          style={{
            borderColor: 'var(--border)',
            padding: '32px 24px',
            background: 'var(--bg)',
            position: 'sticky',
            top: 72,
            height: 'calc(100vh - 118px)',
          }}
        >
          <AnimatePresence mode="wait">
            {activeSlot && activeSlotData ? (
              <ItemCarousel
                key={activeSlot}
                category={activeSlot}
                items={activeSlotData.options}
                selectedItem={selectedItems[activeSlot] ?? null}
                onSelect={handleSelect}
                onClose={() => setActiveSlot(null)}
              />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-4"
                style={{ minHeight: 300 }}
              >
                <div style={{ opacity: 0.15, fontSize: 40 }}>⬡</div>
                <p className="font-display italic text-center" style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                  Click a hotspot on the figure to explore options
                </p>
                <p className="font-mono text-center" style={{ fontSize: 9, color: 'var(--text-ghost)', letterSpacing: '0.15em' }}>
                  4 options per category across all price tiers
                </p>

                {/* Slot quick-select */}
                <div className="flex flex-col gap-1 mt-4 w-full">
                  {outfit.slots.map((slot) => (
                    <button
                      key={slot.category}
                      onClick={() => setActiveSlot(slot.category)}
                      className="flex items-center justify-between group transition-colors w-full"
                      style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}
                    >
                      <span
                        className="font-display italic group-hover:text-black transition-colors"
                        style={{ fontSize: 13, color: selectedItems[slot.category] ? 'var(--text)' : 'var(--text-secondary)' }}
                      >
                        {slot.label}
                      </span>
                      {selectedItems[slot.category] ? (
                        <span className="font-mono" style={{ fontSize: 8, color: 'var(--gold)' }}>
                          ✓ {selectedItems[slot.category]?.brand}
                        </span>
                      ) : (
                        <span className="font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontSize: 8, color: 'var(--text-muted)' }}>
                          Explore →
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>

      {/* Mobile layout — stacked */}
      <style>{`
        @media (max-width: 900px) {
          .designer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.div>
  )
}
