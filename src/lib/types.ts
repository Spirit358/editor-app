export type Tier = 'budget' | 'mid' | 'premium' | 'luxury'

export type ItemCategory =
  | 'hat'
  | 'outerwear'
  | 'top'
  | 'bottom'
  | 'bag'
  | 'shoes'

export interface RetailerLink {
  name: string
  url: string
  icon: string
}

export interface OutfitItem {
  id: string
  category: ItemCategory
  name: string
  brand: string
  price: number
  tier: Tier
  description: string
  colors: string[]
  retailers: RetailerLink[]
  tags: string[]
}

export interface OutfitSlot {
  category: ItemCategory
  label: string
  options: OutfitItem[]
  selected: OutfitItem | null
}

export interface GeneratedOutfit {
  vibeName: string
  trendScore: number
  trendStatus: string
  summary: string
  outfitEquation: string
  slots: OutfitSlot[]
  stylingNotes: string[]
  sustainabilityScore: number
}

export type ViewAngle = 'front' | 'side' | 'back'

export interface AppState {
  stage: 'landing' | 'loading' | 'designing'
  prompt: string
  outfit: GeneratedOutfit | null
  activeSlot: ItemCategory | null
  viewAngle: ViewAngle
  savedFits: GeneratedOutfit[]
}

export const TIER_COLORS: Record<Tier, string> = {
  budget:  '#888880',
  mid:     '#9a7a5a',
  premium: '#5a7a9a',
  luxury:  '#c8a96e',
}

export const TIER_LABELS: Record<Tier, string> = {
  budget:  'Budget',
  mid:     'Mid-Range',
  premium: 'Premium',
  luxury:  'Luxury',
}

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  hat:       'Hat / Headwear',
  outerwear: 'Outerwear',
  top:       'Top',
  bottom:    'Bottom',
  bag:       'Bag',
  shoes:     'Shoes',
}

export const STYLE_PRESETS = [
  { id: 'quiet-luxury',    label: 'Quiet Luxury',    emoji: '🏛️' },
  { id: 'dark-academia',   label: 'Dark Academia',   emoji: '📚' },
  { id: 'gorpcore',        label: 'Gorpcore',        emoji: '🏔️' },
  { id: 'mob-wife',        label: 'Mob Wife',        emoji: '🐆' },
  { id: 'clean-girl',      label: 'Clean Girl',      emoji: '✨' },
  { id: 'parisian-chic',   label: 'Parisian Chic',   emoji: '🥐' },
  { id: 'y2k',             label: 'Y2K Revival',     emoji: '💿' },
  { id: 'dark-romance',    label: 'Dark Romance',    emoji: '🌹' },
  { id: 'streetwear',      label: 'Streetwear',      emoji: '🧢' },
  { id: 'cottagecore',     label: 'Cottagecore',     emoji: '🌻' },
  { id: 'bookworm',        label: 'Bookworm',        emoji: '📖' },
  { id: 'skate',           label: 'Skate',           emoji: '🛹' },
]
