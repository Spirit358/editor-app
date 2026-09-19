import { cn } from '@/lib/utils'
import { Highlight } from '@/components/highlight'

/** Label, heading, intro. On light or on the brand block. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = 'light',
  className,
  as: Tag = 'h2',
}: {
  eyebrow?: string
  title: React.ReactNode
  intro?: string
  tone?: 'light' | 'brand'
  className?: string
  as?: 'h1' | 'h2'
}) {
  const onBrand = tone === 'brand'
  return (
    <div className={cn('measure', className)}>
      {eyebrow && <p className={cn('label', onBrand && 'text-on-brand/60')}>{eyebrow}</p>}
      <Tag className={cn('display-wide mt-3 text-4xl', onBrand ? 'text-on-brand' : 'text-ink')}>
        {typeof title === 'string' ? <Highlight text={title} className={onBrand ? 'text-on-brand/70' : undefined} /> : title}
      </Tag>
      {intro && (
        <p className={cn('mt-4 text-lg leading-relaxed', onBrand ? 'text-on-brand/80' : 'text-ink-2')}>{intro}</p>
      )}
    </div>
  )
}
