'use client'

import * as React from 'react'
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Label, Select, Textarea } from '@/components/ui/field'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export interface ContactFormProps {
  /** Where to POST. Empty string = demo build, nothing is sent. */
  endpoint?: string
  hiddenFields?: Record<string, string>
  successMessage?: string
  services: Array<{ slug: string; name: string }>
  businessName: string
}

export function ContactForm({
  endpoint,
  hiddenFields,
  successMessage,
  services,
  businessName,
}: ContactFormProps) {
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
      setError(
        'This is a preview, so the form is not connected yet. On the live site it goes straight to the business inbox.'
      )
      return
    }

    setStatus('sending')
    setError(null)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (!response.ok) throw new Error(`Request failed (${response.status})`)
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
      setError(
        'Something went wrong sending that. Please ring us instead — we would rather hear from you than lose the job to a broken form.'
      )
    }
  }

  if (status === 'sent') {
    return (
      <div
        className="rounded-[var(--radius-lg)] border border-brand-200 bg-brand-50 p-8 text-center"
        role="status"
      >
        <CheckCircle2
          className="mx-auto size-10 text-brand-600"
          strokeWidth={1.5}
          aria-hidden
        />
        <p className="mt-4 font-display text-xl text-ink">Message sent</p>
        <p className="mx-auto mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
          {successMessage ??
            `Thanks — ${businessName} will come back to you shortly.`}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate={false} className="space-y-5">
      {Object.entries(hiddenFields ?? {}).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      {/* Honeypot — hidden from people, visible to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Company (leave blank)</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Jane Smith"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="07700 900000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="jane@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">What do you need?</Label>
        <Select id="service" name="service" defaultValue="">
          <option value="" disabled>
            Choose a service…
          </option>
          {services.map((s) => (
            <option key={s.slug} value={s.name}>
              {s.name}
            </option>
          ))}
          <option value="Something else">Something else</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Details</Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Tell us what has happened, and roughly where you are."
        />
      </div>

      {status === 'error' && error && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-[var(--radius-sm)] border border-accent-600/30 bg-accent-500/10 px-4 py-3 text-sm leading-relaxed text-ink-soft"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-accent-700" aria-hidden />
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          <>
            <Send aria-hidden />
            Send enquiry
          </>
        )}
      </Button>

      <p className="text-xs leading-relaxed text-muted">
        We use your details to reply to this enquiry and nothing else. No lists,
        no passing them on.
      </p>
    </form>
  )
}
