'use client'

import * as React from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import { cn, telHref, whatsappHref } from '@/lib/utils'

/**
 * The single highest-converting element on a trades site: a thumb-reachable
 * call button that never scrolls away.
 *
 * It appears only after the hero has scrolled past, so it does not compete
 * with the hero's own call-to-action, and it hides while an input is focused
 * so it cannot cover the contact form on a small screen.
 */
export function MobileCallBar({
  phone,
  phoneDisplay,
  whatsapp,
}: {
  phone: string
  phoneDisplay: string
  whatsapp?: string
}) {
  const [show, setShow] = React.useState(false)
  const [typing, setTyping] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null
      setTyping(
        !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')
      )
    }
    document.addEventListener('focusin', onFocus)
    document.addEventListener('focusout', () => setTyping(false))

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('focusin', onFocus)
    }
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 no-print lg:hidden',
        'border-t border-brand-800 bg-brand-950/95 backdrop-blur-lg',
        'transition-transform duration-500 ease-[var(--ease-out-quint)]',
        'pb-[env(safe-area-inset-bottom)]',
        show && !typing ? 'translate-y-0' : 'translate-y-full'
      )}
      // Hidden from the tab order while off-screen.
      aria-hidden={!show || typing}
    >
      <div className="flex items-stretch gap-2 p-2.5">
        <a
          href={telHref(phone)}
          data-cta="sticky-call"
          tabIndex={show && !typing ? undefined : -1}
          className={cn(
            'flex flex-1 items-center justify-center gap-2.5 rounded-[var(--radius-md)]',
            'bg-accent-500 px-4 py-3.5 font-medium text-brand-950',
            'active:translate-y-px'
          )}
        >
          <Phone className="size-5" aria-hidden />
          <span className="flex flex-col leading-none">
            <span className="text-[0.68rem] font-semibold uppercase tracking-widest opacity-70">
              Call now
            </span>
            <span className="mt-1 text-base tabular-nums">{phoneDisplay}</span>
          </span>
        </a>

        {whatsapp && (
          <a
            href={whatsappHref(whatsapp)}
            data-cta="sticky-whatsapp"
            tabIndex={show && !typing ? undefined : -1}
            aria-label="Message us on WhatsApp"
            className={cn(
              'flex items-center justify-center rounded-[var(--radius-md)] px-5',
              'border border-brand-50/20 bg-brand-50/8 text-brand-50',
              'active:translate-y-px'
            )}
          >
            <MessageCircle className="size-5" aria-hidden />
          </a>
        )}
      </div>
    </div>
  )
}
