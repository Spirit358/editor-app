import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Builds an E.164 tel: link from however the number was written.
 *
 *   '0113 496 0142', '+44'  → tel:+441134960142   (UK trunk 0 dropped)
 *   '94 374 11 32',  '+48'  → tel:+48943741132    (no trunk prefix in Poland)
 *   '+48 94 374 11 32'      → tel:+48943741132    (already international)
 */
export function telHref(phone: string, country = '+44') {
  const raw = phone.replace(/[^\d+]/g, '')
  if (raw.startsWith('+')) return `tel:${raw}`
  const cc = country.replace(/[^\d]/g, '')
  // Only the UK-style trunk 0 is stripped; countries without one keep every digit.
  const national = country === '+44' && raw.startsWith('0') ? raw.slice(1) : raw
  return `tel:+${cc}${national}`
}

export function whatsappHref(phone: string, country = '+44', message?: string) {
  const digits = telHref(phone, country).replace('tel:+', '')
  const q = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits}${q}`
}

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

/** 'Mon–Fri', 'Sat', or 'Mon, Wed, Fri' from a list of ISO weekday numbers. */
export function dayLabel(days: number[], names: readonly string[]) {
  const name = (d: number) => names[d - 1] ?? ''
  if (days.length === 0) return ''
  if (days.length === 1) return name(days[0])
  const contiguous = days.every((d, i) => i === 0 || d === days[i - 1] + 1)
  return contiguous
    ? `${name(days[0])}–${name(days[days.length - 1])}`
    : days.map(name).join(', ')
}

/** schema.org wants English day names regardless of site language. */
export function schemaDays(days: number[]) {
  return days.map((d) => SCHEMA_DAYS[d])
}

/** Joins a URL base and path without doubling or dropping the slash. */
export function absoluteUrl(baseUrl: string, path = '/') {
  const base = baseUrl.replace(/\/+$/, '')
  const rel = path.startsWith('/') ? path : `/${path}`
  return `${base}${rel === '/' ? '' : rel}`
}
