import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Renders *fragments in asterisks* in the accent colour, so a config file can
 * carry an emphasised headline without carrying JSX.
 *
 *   'Plumbing done *properly*' → Plumbing done <em>properly</em>
 */
export function Highlight({
  text,
  className,
  italic = true,
}: {
  text: string
  className?: string
  italic?: boolean
}) {
  const parts = text.split(/\*([^*]+)\*/g)

  return (
    <>
      {parts.map((part, i) =>
        // Odd indices are the captured groups, i.e. the emphasised fragments.
        // Accent + italic is the site's one emphasis gesture, set in the hero
        // and repeated here so it reads as a system rather than a highlight.
        i % 2 === 1 ? (
          <span key={i} className={cn('text-accent-700', italic && 'italic', className)}>
            {part}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  )
}
