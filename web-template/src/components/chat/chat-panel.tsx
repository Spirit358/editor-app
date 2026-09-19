'use client'

import * as React from 'react'
import { Phone, Send, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import { matchFaq, matchIntent, type Knowledge, type QuickIntent } from './knowledge'

export interface ChatLabels {
  open: string
  close: string
  title: string
  greeting: string
  placeholder: string
  send: string
  thinking: string
  you: string
  quick: Record<QuickIntent, string>
  answers: { hours: string; address: string; phone: string; areas: string; areasMore: string; services: string }
  handoff: string
  limitReached: string
  offline: string
  error: string
  disclaimer: string
  callCta: string
  formCta: string
  ariaPanel: string
  ariaLog: string
  ariaInput: string
}

export interface ChatPanelProps {
  business: string
  phone: string
  phoneHref: string
  contactHref: string
  /** Empty = local answers only; a question nothing local can answer gets the hand-off line. */
  endpoint: string
  maxTurns: number
  knowledgeUrl: string
  labels: ChatLabels
  onClose: () => void
  returnFocusTo: React.RefObject<HTMLButtonElement | null>
}

interface Link {
  label: string
  href: string
}

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
  links?: Link[]
  /** Quick replies and matches are free; only these went to the model. */
  fromModel?: boolean
}

const MAX_CHARS = 500
const HISTORY = 8

const PRICE = /\b(cen|koszt|kosztu|cennik|ile (to )?kosztuje|price|cost|how much)\w*/

let nextId = 1

export function ChatPanel({
  business,
  phone,
  phoneHref,
  contactHref,
  endpoint,
  maxTurns,
  knowledgeUrl,
  labels: l,
  onClose,
  returnFocusTo,
}: ChatPanelProps) {
  const [messages, setMessages] = React.useState<Message[]>([{ id: 0, role: 'assistant', text: l.greeting }])
  const [draft, setDraft] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [knowledge, setKnowledge] = React.useState<Knowledge | null>(null)
  const input = React.useRef<HTMLInputElement>(null)
  const log = React.useRef<HTMLDivElement>(null)

  const modelTurns = messages.filter((m) => m.role === 'user' && m.fromModel).length
  const capped = modelTurns >= maxTurns

  // Knowledge is one small static file, fetched once per open and cached by
  // the browser after that.
  React.useEffect(() => {
    let live = true
    fetch(knowledgeUrl)
      .then((r) => (r.ok ? r.json() : null))
      .then((k: Knowledge | null) => live && k && setKnowledge(k))
      .catch(() => {})
    return () => {
      live = false
    }
  }, [knowledgeUrl])

  React.useEffect(() => {
    input.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight })
  }, [messages, busy])

  function close() {
    onClose()
    returnFocusTo.current?.focus()
  }

  function say(message: Omit<Message, 'id'>) {
    setMessages((m) => [...m, { ...message, id: nextId++ }])
  }

  function canned(intent: QuickIntent): Omit<Message, 'id'> {
    const k = knowledge
    const base = { role: 'assistant' as const }
    switch (intent) {
      case 'hours':
        return { ...base, text: `${l.answers.hours} ${k?.hours.join(', ') ?? ''}`.trim() }
      case 'address':
        return {
          ...base,
          text: `${l.answers.address} ${k?.contact.address ?? ''}`.trim(),
          links: k?.contact.mapsUrl ? [{ label: 'Google Maps', href: k.contact.mapsUrl }] : undefined,
        }
      case 'phone':
        return { ...base, text: l.answers.phone, links: [{ label: phone, href: phoneHref }] }
      case 'areas':
        return { ...base, text: `${l.answers.areas} ${k?.areas.join(', ') ?? ''}. ${l.answers.areasMore}` }
      case 'services':
        return {
          ...base,
          text: l.answers.services,
          links: k?.services.map((s) => ({ label: s.name, href: s.url })),
        }
    }
  }

  async function ask(text: string) {
    const question = text.trim().slice(0, MAX_CHARS)
    if (!question || busy) return
    setDraft('')

    // Prices, dates and stock are exactly what a model must never invent
    // about a real business, so the hand-off happens before any model sees it.
    if (PRICE.test(question.toLowerCase())) {
      say({ role: 'user', text: question })
      say({ role: 'assistant', text: l.handoff, links: [{ label: phone, href: phoneHref }] })
      return
    }

    const faq = knowledge ? matchFaq(question, knowledge.faqs) : null
    if (faq) {
      say({ role: 'user', text: question })
      say({ role: 'assistant', text: faq.a })
      return
    }

    const intent = matchIntent(question)
    if (intent) {
      say({ role: 'user', text: question })
      say(canned(intent))
      return
    }

    if (!endpoint || capped) {
      say({ role: 'user', text: question })
      say({ role: 'assistant', text: capped ? l.limitReached : l.handoff, links: [{ label: phone, href: phoneHref }] })
      return
    }

    const history = [...messages, { id: -1, role: 'user' as const, text: question }]
      .filter((m) => m.id !== 0)
      .slice(-HISTORY)
      .map((m) => ({ role: m.role, content: m.text }))

    say({ role: 'user', text: question, fromModel: true })
    setBusy(true)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      if (response.status === 429) {
        say({ role: 'assistant', text: l.limitReached, links: [{ label: phone, href: phoneHref }] })
      } else if (!response.ok) {
        say({ role: 'assistant', text: l.offline, links: [{ label: phone, href: phoneHref }] })
      } else {
        const data = (await response.json()) as { reply?: string }
        say({ role: 'assistant', text: data.reply?.trim() || l.handoff, fromModel: true })
      }
    } catch {
      say({ role: 'assistant', text: l.error })
    } finally {
      setBusy(false)
      input.current?.focus()
    }
  }

  const quick: QuickIntent[] = ['hours', 'address', 'phone', 'areas', 'services']

  return (
    <div
      role="dialog"
      aria-label={l.ariaPanel}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col bg-paper no-print',
        'border-t border-rule-strong shadow-[0_16px_48px_-16px_rgba(0,0,0,0.3)]',
        'lg:inset-auto lg:right-6 lg:bottom-6 lg:h-[min(36rem,calc(100dvh-3rem))] lg:w-[24rem]',
        'lg:rounded-[var(--radius-md)] lg:border'
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3">
        <p className="label text-ink">{l.title}</p>
        <button
          type="button"
          onClick={close}
          aria-label={l.close}
          className="-mr-1.5 inline-flex size-9 items-center justify-center rounded-[var(--radius-sm)] text-ink-2 hover:bg-paper-3 hover:text-ink"
        >
          <X className="size-5" aria-hidden strokeWidth={1.75} />
        </button>
      </div>

      <div ref={log} role="log" aria-label={l.ariaLog} aria-live="polite" className="min-h-0 flex-1 overflow-y-auto px-4">
        {messages.map((m) => (
          <div key={m.id} className="border-b border-rule py-3 last:border-b-0">
            <p className="label mb-1 text-ink-3">{m.role === 'user' ? l.you : business}</p>
            <p className="text-[0.9375rem] leading-relaxed text-ink">{m.text}</p>
            {m.links && m.links.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {m.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="link text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {busy && (
          <p className="py-3 text-sm text-ink-3" aria-live="polite">
            {l.thinking}
          </p>
        )}
      </div>

      <div className="border-t border-rule px-4 pt-3">
        <ul className="flex flex-wrap gap-2 pb-3">
          {quick.map((intent) => (
            <li key={intent}>
              <button
                type="button"
                onClick={() => {
                  say({ role: 'user', text: l.quick[intent] })
                  say(canned(intent))
                }}
                disabled={busy}
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'h-8 px-3 text-xs')}
              >
                {l.quick[intent]}
              </button>
            </li>
          ))}
        </ul>

        {capped ? (
          <p className="pb-3 text-sm leading-relaxed text-ink-2">{l.limitReached}</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              ask(draft)
            }}
            className="flex gap-2 pb-3"
          >
            <Input
              ref={input}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={MAX_CHARS}
              placeholder={l.placeholder}
              aria-label={l.ariaInput}
              autoComplete="off"
              enterKeyHint="send"
              className="h-11 py-0"
            />
            <Button type="submit" aria-label={l.send} disabled={busy || !draft.trim()} className="h-11 w-11 shrink-0 px-0">
              <Send className="size-4" aria-hidden strokeWidth={1.75} />
            </Button>
          </form>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-rule py-2.5">
          <p className="text-[0.6875rem] leading-snug text-ink-3">{l.disclaimer}</p>
          <div className="flex shrink-0 gap-3">
            <a href={phoneHref} className="link inline-flex items-center gap-1 text-xs">
              <Phone className="size-3.5" aria-hidden strokeWidth={1.75} />
              {l.callCta}
            </a>
            <a href={contactHref} className="link text-xs">
              {l.formCta}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
