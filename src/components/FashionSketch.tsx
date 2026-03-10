'use client'
import { motion, AnimatePresence } from 'framer-motion'
import type { ItemCategory, ViewAngle, OutfitItem } from '@/lib/types'

// Hotspot positions for each view angle (percentage of SVG dimensions)
type HotspotMap = Record<ItemCategory, { x: number; y: number } | null>

const HOTSPOTS: Record<ViewAngle, HotspotMap> = {
  front: {
    hat:       { x: 50, y: 7  },
    outerwear: { x: 50, y: 28 },
    top:       { x: 50, y: 38 },
    bottom:    { x: 50, y: 62 },
    bag:       { x: 72, y: 50 },
    shoes:     { x: 50, y: 90 },
  },
  side: {
    hat:       { x: 50, y: 7  },
    outerwear: { x: 55, y: 30 },
    top:       { x: 55, y: 40 },
    bottom:    { x: 55, y: 63 },
    bag:       { x: 70, y: 52 },
    shoes:     { x: 52, y: 90 },
  },
  back: {
    hat:       { x: 50, y: 7  },
    outerwear: { x: 50, y: 28 },
    top:       { x: 50, y: 38 },
    bottom:    { x: 50, y: 62 },
    bag:       { x: 65, y: 44 },
    shoes:     { x: 50, y: 90 },
  },
}

const LABEL_LINES: Record<ItemCategory, { labelX: number; labelY: number; textAnchor: 'start' | 'end' }> = {
  hat:       { labelX: 78, labelY: 8,  textAnchor: 'start' },
  outerwear: { labelX: 80, labelY: 25, textAnchor: 'start' },
  top:       { labelX: 78, labelY: 38, textAnchor: 'start' },
  bag:       { labelX: 78, labelY: 52, textAnchor: 'start' },
  bottom:    { labelX: 78, labelY: 65, textAnchor: 'start' },
  shoes:     { labelX: 78, labelY: 88, textAnchor: 'start' },
}

interface FashionSketchProps {
  viewAngle: ViewAngle
  activeSlot: ItemCategory | null
  selectedItems: Partial<Record<ItemCategory, OutfitItem>>
  onSlotClick: (category: ItemCategory) => void
}

export function FashionSketch({ viewAngle, activeSlot, selectedItems, onSlotClick }: FashionSketchProps) {
  const hotspots = HOTSPOTS[viewAngle]

  const categories: ItemCategory[] = ['hat', 'outerwear', 'top', 'bag', 'bottom', 'shoes']
  const categoryLabels: Record<ItemCategory, string> = {
    hat: 'Hat', outerwear: 'Outerwear', top: 'Top',
    bag: 'Bag', bottom: 'Bottom', shoes: 'Shoes',
  }

  return (
    <div className="relative w-full h-full select-none" style={{ minHeight: 580 }}>
      <AnimatePresence mode="wait">
        <motion.svg
          key={viewAngle}
          viewBox="0 0 300 560"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ maxHeight: 580 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* ── FIGURE ── */}
          {viewAngle === 'front' && <FrontFigure />}
          {viewAngle === 'side'  && <SideFigure />}
          {viewAngle === 'back'  && <BackFigure />}

          {/* ── INTERACTIVE HOTSPOTS + LABELS ── */}
          {categories.map((cat) => {
            const hotspot = hotspots[cat]
            const labelLine = LABEL_LINES[cat]
            if (!hotspot) return null

            const isActive   = activeSlot === cat
            const isSelected = !!selectedItems[cat]
            const hx = (hotspot.x / 100) * 300
            const hy = (hotspot.y / 100) * 560
            const lx = (labelLine.labelX / 100) * 300
            const ly = (labelLine.labelY / 100) * 560
            const selectedItem = selectedItems[cat]

            return (
              <g key={cat} onClick={() => onSlotClick(cat)} style={{ cursor: 'pointer' }}>
                {/* Line from figure to label */}
                <line
                  x1={hx} y1={hy} x2={lx - 2} y2={ly}
                  stroke={isActive ? '#c8a96e' : isSelected ? '#9a9088' : '#d4cfc8'}
                  strokeWidth={isActive ? 0.8 : 0.5}
                  strokeDasharray={isActive ? '0' : '2,2'}
                  opacity={isActive ? 1 : 0.7}
                />

                {/* Hotspot circle */}
                <circle
                  cx={hx} cy={hy} r={isActive ? 5 : 3.5}
                  fill={isActive ? '#c8a96e' : isSelected ? '#9a7a5a' : 'transparent'}
                  stroke={isActive ? '#c8a96e' : isSelected ? '#9a7a5a' : '#aaa8a0'}
                  strokeWidth={1}
                  opacity={0.9}
                />

                {/* Brand label (if selected) or category name */}
                <text
                  x={lx + 4}
                  y={ly}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fontSize={isSelected ? 7.5 : 7}
                  fontFamily="'Playfair Display', serif"
                  fontStyle={isSelected ? 'italic' : 'normal'}
                  fill={isActive ? '#c8a96e' : isSelected ? '#4a3a28' : '#8a8078'}
                  fontWeight={isActive ? '600' : '400'}
                >
                  {isSelected ? selectedItem?.brand : categoryLabels[cat]}
                </text>

                {/* Item name (if selected) */}
                {isSelected && (
                  <text
                    x={lx + 4}
                    y={ly + 9}
                    textAnchor="start"
                    dominantBaseline="middle"
                    fontSize={6}
                    fontFamily="'DM Mono', monospace"
                    fill="#9a9088"
                  >
                    {selectedItem?.name?.slice(0, 22)}{(selectedItem?.name?.length ?? 0) > 22 ? '…' : ''}
                  </text>
                )}

                {/* Invisible hit area */}
                <rect
                  x={hx - 16} y={hy - 12}
                  width={32} height={24}
                  fill="transparent"
                />
              </g>
            )
          })}
        </motion.svg>
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────
   FRONT VIEW — Full editorial fashion figure
   Proportions: ~8.5 heads tall, elongated
   ───────────────────────────────────────── */
function FrontFigure() {
  return (
    <g stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* ── HEAD ── */}
      {/* Head oval */}
      <ellipse cx="100" cy="38" rx="13" ry="16" strokeWidth="1" />
      {/* Wide-brim hat */}
      <ellipse cx="100" cy="28" rx="26" ry="5" strokeWidth="1.2" />
      <path d="M 88 28 C 88 22 93 20 100 20 C 107 20 112 22 112 28" strokeWidth="1" />
      {/* Face features — minimal */}
      <line x1="95" y1="38" x2="93" y2="42" strokeWidth="0.6" />  {/* left eye */}
      <line x1="105" y1="38" x2="107" y2="42" strokeWidth="0.6" />  {/* right eye */}
      <path d="M 96 46 Q 100 49 104 46" strokeWidth="0.6" />  {/* mouth */}
      {/* Sunglasses */}
      <rect x="91" y="36" width="7" height="4" rx="1" strokeWidth="0.8" fill="none" />
      <rect x="102" y="36" width="7" height="4" rx="1" strokeWidth="0.8" fill="none" />
      <line x1="98" y1="38" x2="102" y2="38" strokeWidth="0.6" />
      {/* Neck */}
      <line x1="97" y1="54" x2="95" y2="62" strokeWidth="1" />
      <line x1="103" y1="54" x2="105" y2="62" strokeWidth="1" />

      {/* ── COAT / OUTERWEAR ── */}
      {/* Shoulders — wide, strong */}
      <path d="M 95 62 C 90 60 78 62 70 70" strokeWidth="1.2" />
      <path d="M 105 62 C 110 60 122 62 130 70" strokeWidth="1.2" />
      {/* Coat body — structured, long */}
      <path d="M 70 70 C 68 90 66 120 68 160 C 70 185 72 200 74 220" strokeWidth="1.2" />
      <path d="M 130 70 C 132 90 134 120 132 160 C 130 185 128 200 126 220" strokeWidth="1.2" />
      {/* Coat hem — slight flare */}
      <path d="M 74 220 C 78 230 86 238 100 240 C 114 238 122 230 126 220" strokeWidth="1" />
      {/* Lapels */}
      <path d="M 95 62 L 90 80 L 96 88 L 100 78" strokeWidth="0.9" />
      <path d="M 105 62 L 110 80 L 104 88 L 100 78" strokeWidth="0.9" />
      {/* Belt line */}
      <path d="M 72 140 C 80 142 90 143 100 143 C 110 143 120 142 128 140" strokeWidth="0.7" />
      <rect x="97" y="139" width="6" height="8" rx="0.5" strokeWidth="0.7" />  {/* belt buckle */}
      {/* Sleeve left */}
      <path d="M 70 70 C 62 90 58 120 60 148" strokeWidth="1" />
      {/* Sleeve right */}
      <path d="M 130 70 C 138 90 142 120 140 148" strokeWidth="1" />
      {/* Cuffs */}
      <path d="M 58 145 C 58 150 64 154 60 148" strokeWidth="0.8" />
      <path d="M 142 145 C 142 150 136 154 140 148" strokeWidth="0.8" />
      {/* Coat buttons */}
      <circle cx="100" cy="100" r="1.5" strokeWidth="0.8" />
      <circle cx="100" cy="115" r="1.5" strokeWidth="0.8" />
      <circle cx="100" cy="130" r="1.5" strokeWidth="0.8" />

      {/* ── BAG ── held in right arm */}
      <path d="M 120 145 C 122 143 128 140 132 143 C 136 146 136 158 132 162 C 128 166 118 166 116 162 C 114 158 116 148 120 145 Z" strokeWidth="1" />
      {/* Bag handle */}
      <path d="M 120 145 C 119 138 127 135 130 142" strokeWidth="0.8" />
      {/* Bag clasp */}
      <line x1="120" y1="155" x2="132" y2="155" strokeWidth="0.6" />
      <circle cx="126" cy="155" r="1.2" strokeWidth="0.6" />

      {/* ── LEGS / TROUSERS ── */}
      {/* Split below coat hem */}
      <path d="M 86 240 C 84 270 82 300 84 330 C 86 355 88 380 90 400 C 91 420 92 440 92 460" strokeWidth="1.1" />
      <path d="M 114 240 C 116 270 118 300 116 330 C 114 355 112 380 110 400 C 109 420 108 440 108 460" strokeWidth="1.1" />
      {/* Trouser crease */}
      <line x1="86" y1="255" x2="90" y2="380" strokeWidth="0.4" strokeDasharray="3,4" />
      <line x1="114" y1="255" x2="110" y2="380" strokeWidth="0.4" strokeDasharray="3,4" />
      {/* Trouser hem */}
      <path d="M 84 456 C 84 460 92 462 92 460" strokeWidth="0.9" />
      <path d="M 108 456 C 108 460 108 462 108 460" strokeWidth="0.9" />

      {/* ── SHOES ── pointed, heeled */}
      {/* Left shoe */}
      <path d="M 84 460 C 80 462 72 464 68 466 C 64 468 62 470 65 472 C 70 474 84 472 88 468 C 90 465 90 460 84 460 Z" strokeWidth="1" />
      {/* Left heel */}
      <line x1="82" y1="462" x2="82" y2="472" strokeWidth="1.5" />
      {/* Right shoe */}
      <path d="M 108 460 C 112 462 120 464 124 466 C 128 468 130 470 127 472 C 122 474 108 472 104 468 C 102 465 102 460 108 460 Z" strokeWidth="1" />
      {/* Right heel */}
      <line x1="110" y1="462" x2="110" y2="472" strokeWidth="1.5" />

      {/* ── SUBTLE GARMENT DETAILS ── */}
      {/* Neckline scarf/collar detail */}
      <path d="M 96 62 C 95 65 97 70 100 72 C 103 70 105 65 104 62" strokeWidth="0.7" strokeDasharray="1,1.5" />
    </g>
  )
}

/* ─────────────────────────────────────────
   SIDE VIEW — Profile, editorial pose
   ───────────────────────────────────────── */
function SideFigure() {
  return (
    <g stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* Head profile */}
      <path d="M 105 30 C 105 22 112 18 118 22 C 124 26 124 36 120 42 C 116 48 108 50 105 46 C 102 42 103 36 105 30 Z" strokeWidth="1" />
      {/* Wide-brim hat — side view */}
      <path d="M 95 26 C 95 20 104 17 114 19 C 124 21 132 23 135 26" strokeWidth="1.2" />
      <path d="M 104 26 C 104 21 108 19 114 19 C 120 19 124 22 124 26" strokeWidth="0.9" />
      {/* Hat brim (back) */}
      <path d="M 95 26 C 92 26 89 27 90 28" strokeWidth="0.8" />
      {/* Neck */}
      <path d="M 106 50 C 104 56 104 60 106 64" strokeWidth="1" />
      {/* Coat front */}
      <path d="M 106 64 C 100 68 96 80 94 120 C 93 150 95 190 98 230 C 100 250 104 260 106 270" strokeWidth="1.1" />
      {/* Coat back */}
      <path d="M 106 64 C 114 68 118 82 120 120 C 121 152 119 190 116 230 C 114 250 110 260 108 270" strokeWidth="1.1" />
      {/* Coat shoulder */}
      <path d="M 106 64 C 110 62 116 63 120 67 C 126 72 130 80 128 90" strokeWidth="1" />
      {/* Lapel */}
      <path d="M 106 64 L 100 78 L 104 86" strokeWidth="0.9" />
      {/* Belt */}
      <path d="M 94 140 C 100 142 110 142 120 140" strokeWidth="0.7" />
      {/* Arm — front */}
      <path d="M 96 78 C 88 100 84 130 86 155" strokeWidth="1" />
      {/* Bag on arm */}
      <path d="M 80 150 C 78 148 74 145 72 148 C 68 152 68 162 72 164 C 76 166 84 165 86 162 C 88 158 86 152 80 150 Z" strokeWidth="1" />
      <path d="M 80 150 C 80 143 78 138 82 138 C 86 138 86 143 86 150" strokeWidth="0.8" />
      {/* Leg front */}
      <path d="M 100 270 C 98 300 96 340 96 390 C 96 420 96 445 97 465" strokeWidth="1.1" />
      {/* Leg back */}
      <path d="M 112 270 C 114 300 116 340 116 390 C 116 420 114 445 112 465" strokeWidth="1.1" />
      {/* Trouser hem */}
      <path d="M 97 462 L 97 468" strokeWidth="1" />
      <path d="M 112 462 L 112 468" strokeWidth="1" />
      {/* Shoes — pointed, side view */}
      <path d="M 94 466 C 86 466 76 468 72 470 C 70 472 72 475 78 475 C 88 475 96 472 96 468" strokeWidth="1" />
      <line x1="93" y1="466" x2="93" y2="475" strokeWidth="1.5" />
      <path d="M 113 466 C 118 466 126 468 130 470 C 132 472 130 475 126 475 C 118 475 112 472 112 468" strokeWidth="1" />
      <line x1="114" y1="466" x2="114" y2="475" strokeWidth="1.5" />
    </g>
  )
}

/* ─────────────────────────────────────────
   BACK VIEW — Elegant rear profile
   ───────────────────────────────────────── */
function BackFigure() {
  return (
    <g stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* Head from back */}
      <ellipse cx="100" cy="36" rx="12" ry="15" strokeWidth="1" />
      {/* Hair — suggests elegant updo */}
      <path d="M 92 30 C 90 24 94 18 100 18 C 106 18 110 24 108 30" strokeWidth="0.8" />
      <ellipse cx="100" cy="20" rx="6" ry="4" strokeWidth="0.8" />
      {/* Hat — wide brim from back */}
      <ellipse cx="100" cy="26" rx="26" ry="5" strokeWidth="1.2" />
      <path d="M 88 26 C 88 20 93 18 100 18 C 107 18 112 20 112 26" strokeWidth="1" />
      {/* Neck */}
      <line x1="97" y1="51" x2="96" y2="62" strokeWidth="1" />
      <line x1="103" y1="51" x2="104" y2="62" strokeWidth="1" />
      {/* Coat back — wide shoulders, clean back */}
      <path d="M 96 62 C 86 60 74 63 68 70" strokeWidth="1.2" />
      <path d="M 104 62 C 114 60 126 63 132 70" strokeWidth="1.2" />
      <path d="M 68 70 C 65 100 64 140 66 180 C 68 210 72 230 74 250" strokeWidth="1.2" />
      <path d="M 132 70 C 135 100 136 140 134 180 C 132 210 128 230 126 250" strokeWidth="1.2" />
      {/* Coat hem */}
      <path d="M 74 250 C 80 258 90 262 100 262 C 110 262 120 258 126 250" strokeWidth="1" />
      {/* Coat centre back seam */}
      <line x1="100" y1="65" x2="100" y2="258" strokeWidth="0.5" strokeDasharray="4,4" />
      {/* Belt */}
      <path d="M 68 148 C 80 150 90 151 100 151 C 110 151 120 150 132 148" strokeWidth="0.7" />
      {/* Bag strap on back */}
      <path d="M 88 72 C 84 80 82 100 84 130 C 86 158 90 168 92 172" strokeWidth="0.8" />
      <path d="M 84 128 C 82 140 88 168 96 174" strokeWidth="0.8" />
      <path d="M 84 128 C 88 150 90 162 92 172 C 94 174 100 176 100 172 C 100 166 96 150 96 174" strokeWidth="0.8" />
      {/* Bag back view */}
      <path d="M 120 160 C 118 156 114 152 112 156 C 108 162 108 180 112 184 C 116 188 126 188 128 184 C 130 180 128 164 120 160 Z" strokeWidth="1" />
      {/* Legs */}
      <path d="M 84 262 C 82 290 80 320 82 360 C 84 390 86 420 88 460" strokeWidth="1.1" />
      <path d="M 116 262 C 118 290 120 320 118 360 C 116 390 114 420 112 460" strokeWidth="1.1" />
      {/* Shoes from back */}
      <path d="M 85 458 C 82 460 76 462 72 463 C 68 464 65 466 68 468 C 74 469 86 468 88 464 C 89 462 88 458 85 458 Z" strokeWidth="1" />
      <line x1="83" y1="460" x2="83" y2="469" strokeWidth="1.5" />
      <path d="M 115 458 C 118 460 124 462 128 463 C 132 464 135 466 132 468 C 126 469 114 468 112 464 C 111 462 112 458 115 458 Z" strokeWidth="1" />
      <line x1="117" y1="460" x2="117" y2="469" strokeWidth="1.5" />
    </g>
  )
}
