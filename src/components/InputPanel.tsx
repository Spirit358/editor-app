'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { STYLE_PRESETS } from '@/lib/types'
import { fadeUp, stagger, itemFade } from '@/lib/motion'

interface InputPanelProps {
  onGenerate: (prompt: string) => void
  isLoading: boolean
}

export function InputPanel({ onGenerate, isLoading }: InputPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const handleSubmit = () => {
    const val = prompt.trim()
    if (val) onGenerate(val)
  }

  const handlePreset = (label: string) => {
    setPrompt(label.toLowerCase())
    onGenerate(label.toLowerCase())
  }

  return (
    <motion.aside
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 h-full"
    >
      {/* Section header */}
      <motion.div variants={fadeUp}>
        <p
          className="font-mono uppercase tracking-widest mb-1"
          style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.3em' }}
        >
          Design Your Fit
        </p>
        <div className="h-px" style={{ background: 'var(--border)' }} />
      </motion.div>

      {/* Text input */}
      <motion.div variants={fadeUp} className="relative">
        <label
          className="font-display italic block mb-2"
          style={{ fontSize: 13, color: 'var(--text-secondary)' }}
        >
          Describe your vibe
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
          placeholder="dark academia winter… parisian café morning… quiet luxury weekend…"
          rows={3}
          className="w-full resize-none font-display italic"
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            color: 'var(--text)',
            borderBottom: `1px solid ${prompt ? 'var(--gold)' : 'var(--border)'}`,
            paddingBottom: 8,
            transition: 'border-color 0.3s',
            caretColor: 'var(--gold)',
          }}
        />
        <p className="font-mono mt-1" style={{ fontSize: 9, color: 'var(--text-ghost)' }}>
          Press Enter to generate
        </p>
      </motion.div>

      {/* Generate button */}
      <motion.div variants={fadeUp}>
        <motion.button
          onClick={handleSubmit}
          disabled={!prompt.trim() || isLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full relative overflow-hidden font-mono uppercase tracking-widest"
          style={{
            fontSize: 10,
            letterSpacing: '0.3em',
            padding: '13px 20px',
            border: `1px solid ${prompt.trim() ? 'var(--gold)' : 'var(--border)'}`,
            color: prompt.trim() ? 'var(--gold)' : 'var(--text-muted)',
            background: 'transparent',
            opacity: isLoading ? 0.6 : 1,
            transition: 'color 0.2s, border-color 0.2s',
            cursor: prompt.trim() && !isLoading ? 'pointer' : 'default',
          }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingDots /> Generating
            </span>
          ) : (
            'Generate →'
          )}
        </motion.button>
      </motion.div>

      {/* Divider */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="font-mono" style={{ fontSize: 9, color: 'var(--text-ghost)', letterSpacing: '0.2em' }}>
          OR EXPLORE
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </motion.div>

      {/* Style presets */}
      <motion.div variants={fadeUp}>
        <p className="font-mono uppercase mb-3" style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.25em' }}>
          Style Presets
        </p>
        <motion.div variants={stagger} className="flex flex-wrap gap-1.5">
          {STYLE_PRESETS.map((preset) => (
            <motion.button
              key={preset.id}
              variants={itemFade}
              onClick={() => handlePreset(preset.label)}
              whileHover={{ scale: 1.02, borderColor: 'var(--gold)', color: 'var(--text)' }}
              whileTap={{ scale: 0.97 }}
              className="font-mono transition-colors"
              style={{
                fontSize: 9,
                letterSpacing: '0.15em',
                padding: '5px 9px',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                background: 'transparent',
              }}
            >
              {preset.label}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Image upload */}
      <motion.div variants={fadeUp}>
        <p className="font-mono uppercase mb-2" style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.25em' }}>
          Upload Reference
        </p>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false) }}
          className="relative flex flex-col items-center justify-center transition-colors"
          style={{
            border: `1px dashed ${isDragging ? 'var(--gold)' : 'var(--border)'}`,
            padding: '20px 16px',
            background: isDragging ? 'rgba(200,169,110,0.04)' : 'transparent',
          }}
        >
          <span style={{ fontSize: 18, marginBottom: 6, opacity: 0.4 }}>⬡</span>
          <p className="font-mono text-center" style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
            DROP IMAGE HERE
          </p>
          <p className="font-mono text-center mt-1" style={{ fontSize: 8, color: 'var(--text-ghost)' }}>
            Or click to browse
          </p>
          <input
            type="file" accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
          />
        </div>
      </motion.div>

      {/* This week's trends */}
      <motion.div variants={fadeUp} className="mt-auto">
        <p className="font-mono uppercase mb-2" style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.25em' }}>
          Trending Now
        </p>
        <div className="flex flex-col gap-1">
          {[
            { rank: 1, label: 'Quiet Luxury',  note: '↑ 34%' },
            { rank: 2, label: 'Gorpcore',       note: '↑ 28%' },
            { rank: 3, label: 'Dark Romance',   note: '↑ 19%' },
          ].map((t) => (
            <button
              key={t.rank}
              onClick={() => handlePreset(t.label)}
              className="flex items-center justify-between group transition-colors w-full text-left"
              style={{ padding: '5px 0', borderBottom: '1px solid var(--border)' }}
            >
              <span className="flex items-center gap-2">
                <span className="font-mono" style={{ fontSize: 8, color: 'var(--text-ghost)', minWidth: 12 }}>
                  {t.rank}
                </span>
                <span
                  className="font-display italic transition-colors group-hover:text-black"
                  style={{ fontSize: 12, color: 'var(--text-secondary)' }}
                >
                  {t.label}
                </span>
              </span>
              <span className="font-mono" style={{ fontSize: 8, color: 'var(--gold)' }}>
                {t.note}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.aside>
  )
}

function LoadingDots() {
  return (
    <span className="flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.0, delay: i * 0.2, repeat: Infinity }}
          className="w-1 h-1 rounded-full inline-block"
          style={{ background: 'var(--gold)' }}
        />
      ))}
    </span>
  )
}
