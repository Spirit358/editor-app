import { cn } from '@/lib/utils'

/**
 * Rating stars drawn as clipped shapes rather than icon glyphs, so half stars
 * are exact and the whole thing is one accessible label.
 */
export function Stars({
  value,
  className,
  size = 16,
  label,
}: {
  value: number
  className?: string
  size?: number
  label?: string
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100))

  return (
    <span
      className={cn('inline-flex items-center', className)}
      role="img"
      aria-label={label ?? `${value} out of 5 stars`}
    >
      <span className="relative inline-block" style={{ height: size }}>
        <StarRow size={size} className="text-line-strong" />
        <span
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          <StarRow size={size} className="text-accent-500" />
        </span>
      </span>
    </span>
  )
}

function StarRow({ size, className }: { size: number; className?: string }) {
  return (
    <span className={cn('flex gap-0.5', className)} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className="shrink-0"
        >
          <path d="M12 1.6l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 17.36l-6.18 3.25L7 13.74 2 8.87l6.91-1L12 1.6z" />
        </svg>
      ))}
    </span>
  )
}
