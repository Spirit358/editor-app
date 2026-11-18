export type Role = 'poster' | 'patron'

export interface User {
  id: string
  name: string
  role: Role
}

export const CATEGORIES = [
  { id: 'rent', label: 'Rent', emoji: '🏠' },
  { id: 'utilities', label: 'Utilities', emoji: '💡' },
  { id: 'medical', label: 'Medical', emoji: '🩺' },
  { id: 'student', label: 'Student loan', emoji: '🎓' },
  { id: 'car', label: 'Car', emoji: '🚗' },
  { id: 'groceries', label: 'Groceries', emoji: '🛒' },
  { id: 'phone', label: 'Phone', emoji: '📱' },
  { id: 'other', label: 'Other', emoji: '🧾' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

export type BillStatus = 'open' | 'pending' | 'paid'

export interface Bill {
  id: string
  ownerName: string
  title: string
  category: CategoryId
  amountCents: number
  story: string
  dueDate: string | null
  attachmentType: string | null
  status: BillStatus
  paidBy: string | null
  paidAt: string | null
  createdAt: string
}

export interface Leaderboard {
  totalPaidCents: number
  billsCleared: number
  billsOpen: number
  patrons: { name: string; totalCents: number; bills: number }[]
}

export const LIMITS = {
  minAmountCents: 100,
  maxAmountCents: 5_000_000,
  maxOpenBillsPerUser: 20,
  maxAttachmentBytes: 5 * 1024 * 1024,
} as const

export function categoryOf(id: string) {
  return CATEGORIES.find(c => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1]
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const usdWhole = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function money(cents: number) {
  return cents % 100 === 0 ? usdWhole.format(cents / 100) : usd.format(cents / 100)
}
