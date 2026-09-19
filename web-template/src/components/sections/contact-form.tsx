'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input, Label, Select, Textarea } from '@/components/ui/field'
import type { Strings } from '@/lib/i18n'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export interface ContactFormProps {
  /** Where to POST. Empty string = demo build, nothing is sent. */
  endpoint?: string
  hiddenFields?: Record<string, string>
  successMessage?: string
  services: Array<{ slug: string; name: string }>
  /** Resolved strings only — functions cannot cross into a client component. */
  labels: Omit<Strings['form'], 'sentBody'> & { sentBody: string }
}

export function ContactForm({ endpoint, hiddenFields, successMessage, services, labels: f }: ContactFormProps) {
  const [status, setStatus] = React.useState<Status>('idle')
  const [error, setError] = React.useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    // Honeypot. Real people never fill a field they cannot see.
    if (data.get('company')) {
      setStatus('sent')
      return
    }
    if (!endpoint) {
      setStatus('error')
      setError(f.previewError)
      return
    }

    setStatus('sending')
    setError(null)
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: data })
      if (!response.ok) throw new Error(`Request failed (${response.status})`)
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
      setError(f.sendError)
    }
  }

  if (status === 'sent') {
    return (
      <div className="rule-strong-t pt-6" role="status">
        <p className="display-wide text-2xl text-ink">{f.sent}</p>
        <p className="measure mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{successMessage ?? f.sentBody}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {Object.entries(hiddenFields ?? {}).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">{f.honeypot}</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{f.name}</Label>
          <Input id="name" name="name" required autoComplete="name" placeholder={f.namePlaceholder} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{f.phone}</Label>
          <Input id="phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder={f.phonePlaceholder} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{f.email}</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder={f.emailPlaceholder} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">{f.service}</Label>
        <Select id="service" name="service" defaultValue="">
          <option value="" disabled>
            {f.choose}
          </option>
          {services.map((s) => (
            <option key={s.slug} value={s.name}>
              {s.name}
            </option>
          ))}
          <option value={f.somethingElse}>{f.somethingElse}</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{f.details}</Label>
        <Textarea id="message" name="message" required placeholder={f.detailsPlaceholder} />
      </div>

      {status === 'error' && error && (
        <p role="alert" className="rule-t pt-4 text-sm leading-relaxed text-ink-2">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status === 'sending'}>
        {status === 'sending' ? f.sending : f.send}
      </Button>

      <p className="measure text-xs leading-relaxed text-ink-3">{f.privacyNote}</p>
    </form>
  )
}
