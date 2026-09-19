'use client'

import * as React from 'react'

/**
 * Scroll reveal in ~50 lines and zero dependencies.
 *
 * Two deliberate decisions:
 *
 * 1. No animation library. The whole effect is two CSS properties; shipping
 *    30kb of JavaScript to fade things in is exactly what costs a Lighthouse
 *    score. The visual state lives in globals.css under [data-reveal].
 *
 * 2. Elements start VISIBLE and are hidden only once JavaScript has confirmed
 *    they are below the fold. The obvious way round — hide everything in CSS,
 *    reveal on intersection — means any revealed element that happens to be on
 *    screen at load is invisible until hydration finishes, which pushes the
 *    largest contentful paint out by well over a second on a throttled phone.
 *    Arming only what nobody can see costs nothing and cannot flash.
 */

let observer: IntersectionObserver | null = null

function sharedObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute('data-visible', 'true')
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  )
  return observer
}

export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
}: {
  children: React.ReactNode
  /** Milliseconds. Use 60-120ms steps for staggered groups. */
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'span'
  className?: string
}) {
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    // Already on screen: leave it painted, no animation, no LCP penalty.
    if (el.getBoundingClientRect().top <= window.innerHeight) return

    el.setAttribute('data-armed', '')
    const io = sharedObserver()
    io.observe(el)
    return () => io.unobserve(el)
  }, [])

  return (
    <Tag
      ref={ref as never}
      data-reveal=""
      className={className}
      style={
        delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined
      }
    >
      {children}
    </Tag>
  )
}
