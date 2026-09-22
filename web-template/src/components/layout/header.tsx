'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Phone, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export interface HeaderProps {
  businessName: string
  wordmark?: string
  phoneHref: string
  phoneDisplay: string
  /** Address line and hours for the utility row above the nav. */
  addressLine: string
  hoursLine?: string | null
  email: string
  nav: Array<{ label: string; href: string }>
  labels: {
    call: string
    quote: string
    openMenu: string
    closeMenu: string
    mainNav: string
    mobileNav: string
    home: string
  }
}

/**
 * White, ruled, sticky; slides away on scroll down and back on scroll up. A
 * utility row carries the address, hours and email —
 * NAP on every screen is one of the few things that measurably converts on a
 * trades site — and the main row carries the wordmark, nav, phone and quote
 * button.
 */
export function Header({
  businessName,
  wordmark,
  phoneHref,
  phoneDisplay,
  addressLine,
  hoursLine,
  email,
  nav,
  labels,
}: HeaderProps) {
  const [open, setOpen] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)
  const pathname = usePathname()

  // The bar gets out of the way while the visitor reads down the page and
  // comes back the moment they scroll up — the one scroll-driven behaviour
  // the template allows, because on a phone the bar is a fifth of the screen.
  // Transform only, 200 ms, none of it under prefers-reduced-motion.
  React.useEffect(() => {
    let last = window.scrollY
    let queued = false
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const delta = y - last
        if (y < 96) setHidden(false)
        else if (delta > 8) setHidden(true)
        else if (delta < -8) setHidden(false)
        last = y
        queued = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  React.useEffect(() => setOpen(false), [pathname])
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-paper no-print transition-transform duration-200 motion-reduce:transition-none',
        hidden && !open && '-translate-y-full',
      )}
      onFocusCapture={() => setHidden(false)}
    >
      {/* Utility row */}
      <div className="rule-b hidden lg:block">
        <div className="container-page">
          <div className="flex h-9 items-center justify-between text-xs text-ink-2">
            <p className="flex items-center gap-4">
              <span>{addressLine}</span>
              {hoursLine && (
                <>
                  <span className="text-rule-strong" aria-hidden>
                    |
                  </span>
                  <span className="tabular">{hoursLine}</span>
                </>
              )}
            </p>
            <a href={`mailto:${email}`} className="link-quiet hover:text-ink">
              {email}
            </a>
          </div>
        </div>
      </div>

      {/* Main row */}
      <div className="rule-b">
        <div className="container-page">
          <div className="flex h-16 items-center justify-between gap-6 lg:h-[4.25rem]">
            <Link href="/" aria-label={`${businessName} — ${labels.home}`} className="display text-[1.625rem] text-brand">
              {wordmark ?? businessName}
            </Link>

            <nav className="hidden items-center gap-7 lg:flex" aria-label={labels.mainNav}>
              {nav.map((item) => {
                const base = item.href.split('#')[0] || '/'
                const active = base === '/' ? pathname === '/' : pathname.startsWith(base)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'link-quiet text-[0.9375rem] transition-colors',
                      active ? 'text-brand' : 'text-ink hover:text-brand'
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href={phoneHref}
                data-cta="header-call"
                className="tabular hidden items-center gap-2 text-[0.9375rem] font-medium text-ink hover:text-brand md:inline-flex"
              >
                <Phone className="size-4" aria-hidden strokeWidth={1.75} />
                {phoneDisplay}
              </a>
              <Link
                href="/contact"
                className={cn(buttonVariants({ variant: 'primary', size: 'md' }), 'hidden sm:inline-flex')}
              >
                {labels.quote}
              </Link>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-nav"
                aria-label={open ? labels.closeMenu : labels.openMenu}
                className="inline-flex size-11 items-center justify-center text-ink lg:hidden"
              >
                {open ? <X aria-hidden strokeWidth={1.5} /> : <Menu aria-hidden strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div id="mobile-nav" hidden={!open} className="rule-b bg-paper lg:hidden">
        <nav className="container-page py-2" aria-label={labels.mobileNav}>
          <ul>
            {nav.map((item) => (
              <li key={item.href} className="rule-b">
                <Link href={item.href} className="display-wide block py-4 text-xl text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="space-y-2 py-5 text-sm text-ink-2">
            <p>{addressLine}</p>
            {hoursLine && <p className="tabular">{hoursLine}</p>}
          </div>
          <a
            href={phoneHref}
            data-cta="mobile-nav-call"
            className={cn(buttonVariants({ variant: 'accent', size: 'lg' }), 'mb-4 w-full')}
          >
            <Phone aria-hidden strokeWidth={1.75} />
            {labels.call} <span className="tabular">{phoneDisplay}</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
