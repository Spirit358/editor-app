/**
 * What the assistant knows, and the two answer layers that need no model.
 *
 * Layer 0 is the quick replies: hours, address, phone, areas, services —
 * resolved from the config at build time and handed to the widget as text.
 * Layer 1 is matching: a typed question is checked against a few intent
 * patterns and then against the FAQ. Only what neither layer answers is sent
 * to the endpoint. On a trades site that is a minority of questions, which is
 * most of why the assistant costs pennies.
 */

export interface Knowledge {
  locale: string
  baseUrl: string
  business: { name: string; legalName?: string; foundedYear?: number; description: string }
  contact: { phone: string; phoneHref: string; email: string; address: string; mapsUrl?: string }
  hours: string[]
  services: Array<{ name: string; short: string; url: string }>
  areas: string[]
  faqs: Array<{ q: string; a: string }>
  notes: string[]
}

export type QuickIntent = 'hours' | 'address' | 'phone' | 'areas' | 'services'

/**
 * Folds case, diacritics and punctuation so "Montażem?" and "montaz" meet.
 * NFD leaves ł alone, hence the explicit map.
 */
export function normalise(text: string) {
  return text
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const STOP = new Set([
  // pl
  'i', 'w', 'we', 'na', 'z', 'ze', 'do', 'czy', 'jak', 'co', 'o', 'jest', 'sa', 'sie', 'nie', 'to', 'a',
  'u', 'od', 'po', 'za', 'dla', 'ze', 'jakie', 'jaki', 'jaka', 'ile', 'kiedy', 'gdzie', 'mam', 'moge',
  'mozna', 'mozecie', 'macie', 'czym', 'przez', 'tez', 'ale', 'lub', 'albo', 'oraz', 'bardzo', 'was',
  'wy', 'panstwo', 'pan', 'pani', 'dzien', 'dobry', 'czesc', 'witam', 'prosze', 'dziekuje',
  // en
  'the', 'a', 'an', 'is', 'are', 'do', 'does', 'you', 'i', 'of', 'to', 'in', 'on', 'for', 'what', 'how',
  'when', 'where', 'can', 'could', 'would', 'my', 'me', 'we', 'it', 'and', 'or', 'with', 'about', 'hi',
  'hello', 'please', 'thanks',
])

/** Crude Polish/English stemming: the first five characters carry the root well enough for a FAQ. */
function stems(text: string) {
  return normalise(text)
    .split(' ')
    .filter((w) => w.length >= 3 && !STOP.has(w))
    .map((w) => w.slice(0, 5))
}

const INTENTS: Array<[QuickIntent, RegExp]> = [
  ['hours', /\b(godzin|otwart|czynn|zamkni|otwier|zamyka|hours|open|close|opening)\w*/],
  ['phone', /\b(telefon|numer|zadzwon|dzwoni|komork|phone|number|call)\w*/],
  ['address', /\b(adres|gdzie jest|ulic|siedzib|lokalizac|address|located|find you|where are)\w*/],
  ['areas', /\b(dojezdz|dojazd|obszar|okolic|miejscow|teren|gmin|powiat|cover|area|travel|distance)\w*/],
  ['services', /\b(uslug|oferta|oferuj|zakres|robicie|zajmuj|services?|offer|what do you do)\w*/],
]

/** A quick-reply intent read from free text, or null. */
export function matchIntent(question: string): QuickIntent | null {
  const q = normalise(question)
  for (const [intent, re] of INTENTS) if (re.test(q)) return intent
  return null
}

/**
 * The FAQ entry a question most resembles, if it resembles one enough.
 * Score is the share of the question's stems found in the entry — question
 * stems count fully, answer stems half — with a floor so one shared word
 * cannot carry it.
 */
export function matchFaq(question: string, faqs: Knowledge['faqs']) {
  const q = Array.from(new Set(stems(question)))
  if (q.length === 0) return null

  let best: { faq: Knowledge['faqs'][number]; score: number } | null = null
  for (const faq of faqs) {
    const inQ = new Set(stems(faq.q))
    const inA = new Set(stems(faq.a))
    let hits = 0
    for (const s of q) {
      if (inQ.has(s)) hits += 1
      else if (inA.has(s)) hits += 0.5
    }
    const score = hits / q.length
    if (!best || score > best.score) best = { faq, score }
  }
  if (!best) return null
  const needed = q.length === 1 ? 1 : 1.5
  const hits = best.score * q.length
  return best.score >= 0.5 && hits >= needed ? best.faq : null
}
