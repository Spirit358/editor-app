import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Renders *fragments in asterisks* in the brand colour, so a config file can
 * carry an emphasised heading without carrying JSX. Colour only — no italic,
 * no weight change.
 */
export function Highlight({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/\*([^*]+)\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={cn('text-brand', className)}>
            {part}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  )
}
