import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** '0113 496 0000' → '+441134960000' for tel: links. */
export function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return `tel:${digits}`
  if (digits.startsWith('0')) return `tel:+44${digits.slice(1)}`
  return `tel:${digits}`
}

export function whatsappHref(phone: string, message?: string) {
  const digits = telHref(phone).replace('tel:+', '')
  const q = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits}${q}`
}

const DAY_NAMES = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const SCHEMA_DAYS = [
  '',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export function dayLabel(days: number[]) {
  if (days.length === 0) return ''
  if (days.length === 1) return DAY_NAMES[days[0]]
  const contiguous = days.every((d, i) => i === 0 || d === days[i - 1] + 1)
  return contiguous
    ? `${DAY_NAMES[days[0]]}–${DAY_NAMES[days[days.length - 1]]}`
    : days.map((d) => DAY_NAMES[d]).join(', ')
}

export function schemaDays(days: number[]) {
  return days.map((d) => SCHEMA_DAYS[d])
}

/** Joins a URL base and path without doubling or dropping the slash. */
export function absoluteUrl(baseUrl: string, path = '/') {
  const base = baseUrl.replace(/\/+$/, '')
  const rel = path.startsWith('/') ? path : `/${path}`
  return `${base}${rel === '/' ? '' : rel}`
}
