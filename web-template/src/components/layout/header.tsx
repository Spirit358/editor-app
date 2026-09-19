'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Phone, X } from 'lucide-react'
import { cn, telHref } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export interface HeaderProps {
  businessName: string
  wordmark?: string
  phone: string
  phoneDisplay: string
  /** Overlay sits transparent on top of a dark hero until the user scrolls. */
  variant?: 'overlay' | 'solid'
  nav: Array<{ label: string; href: string }>
}

export function Header({
  businessName,
  wordmark,
  phone,
  phoneDisplay,
  variant = 'solid',
  nav,
}: HeaderProps) {
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    if (variant !== 'overlay') return
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [variant])

  // Close the drawer on navigation and lock the body while it is open.
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

  const transparent = variant === 'overlay' && !scrolled && !open

  return (
    <header
      className={cn(
        // Sticky rather than fixed so the demo banner above it can scroll
        // away naturally, and so the header never needs a body offset.
        'sticky top-0 z-50 no-print',
        'transition-[background-color,box-shadow,border-color] duration-500',
        'ease-[var(--ease-out-quint)]',
        transparent
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-line bg-surface/85 shadow-[var(--shadow-soft)] backdrop-blur-xl'
      )}
    >
      <div className="container-page">
        <div className="flex h-18 items-center justify-between gap-6 lg:h-20">
          <Link
            href="/"
            className={cn(
              'font-display text-xl tracking-tight transition-colors sm:text-2xl',
              transparent ? 'text-brand-50' : 'text-ink'
            )}
            aria-label={`${businessName} home`}
          >
            {wordmark ?? businessName}
            <span className="text-accent-500">.</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {nav.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-[var(--radius-sm)] px-3.5 py-2 text-[0.9375rem] transition-colors duration-200',
                    transparent
                      ? 'text-brand-100 hover:bg-brand-50/10 hover:text-brand-50'
                      : 'text-ink-soft hover:bg-surface-3 hover:text-ink',
                    active && (transparent ? 'text-brand-50' : 'text-brand-700')
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={telHref(phone)}
              data-cta="header-call"
              className={cn(
                buttonVariants({
                  variant: transparent ? 'outline-light' : 'primary',
                  size: 'md',
                }),
                'hidden sm:inline-flex'
              )}
            >
              <Phone aria-hidden />
              <span>{phoneDisplay}</span>
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={cn(
                'inline-flex size-11 items-center justify-center rounded-[var(--radius-sm)]',
                'transition-colors duration-200 lg:hidden',
                transparent
                  ? 'text-brand-50 hover:bg-brand-50/10'
                  : 'text-ink hover:bg-surface-3'
              )}
            >
              {open ? <X aria-hidden /> : <Menu aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-surface lg:hidden"
      >
        <nav className="container-page py-4" aria-label="Mobile">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li key={item.href} style={{ '--i': i } as React.CSSProperties}>
                <Link
                  href={item.href}
                  className="animate-rise stagger block border-b border-line py-4 font-display text-xl text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={telHref(phone)}
            data-cta="mobile-nav-call"
            className={cn(buttonVariants({ variant: 'accent', size: 'lg' }), 'mt-6 w-full')}
          >
            <Phone aria-hidden />
            Call {phoneDisplay}
          </a>
        </nav>
      </div>
    </header>
  )
}
