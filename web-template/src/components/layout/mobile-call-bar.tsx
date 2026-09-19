'use client'

import * as React from 'react'
import { Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * A thumb-reachable call button that never scrolls away. Appears after the
 * hero has scrolled past; hides while an input is focused so it cannot cover
 * the contact form.
 */
export function MobileCallBar({
  phoneHref,
  phoneDisplay,
  labels,
}: {
  phoneHref: string
  phoneDisplay: string
  labels: { callNow: string }
}) {
  const [show, setShow] = React.useState(false)
  const [typing, setTyping] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null
      setTyping(!!el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))
    }
    const onBlur = () => setTyping(false)
    document.addEventListener('focusin', onFocus)
    document.addEventListener('focusout', onBlur)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('focusin', onFocus)
      document.removeEventListener('focusout', onBlur)
    }
  }, [])

  const visible = show && !typing

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 p-3 no-print lg:hidden',
        'transition-transform duration-300 ease-[var(--ease-out)]',
        'pb-[max(0.75rem,env(safe-area-inset-bottom))]',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
      aria-hidden={!visible}
    >
      <a
        href={phoneHref}
        data-cta="sticky-call"
        tabIndex={visible ? undefined : -1}
        className="flex h-14 items-center justify-center gap-3 rounded-[var(--radius-sm)] bg-accent px-4 font-medium text-on-accent shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)]"
      >
        <Phone className="size-5" aria-hidden strokeWidth={1.75} />
        <span className="text-xs font-semibold uppercase tracking-[0.1em] opacity-80">{labels.callNow}</span>
        <span className="tabular text-lg">{phoneDisplay}</span>
      </a>
    </div>
  )
}
