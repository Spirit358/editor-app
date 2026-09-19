import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  tone = 'dark-on-light',
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  intro?: string
  align?: 'left' | 'center'
  tone?: 'dark-on-light' | 'light-on-dark'
  className?: string
}) {
  const light = tone === 'light-on-dark'

  return (
    <Reveal
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      {eyebrow && (
        <p className={cn('eyebrow', light && 'text-accent-400')}>
          <span
            className={cn(
              'h-px w-6',
              light ? 'bg-accent-400/60' : 'bg-brand-400'
            )}
            aria-hidden
          />
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'mt-4 text-4xl leading-[1.08]',
          light ? 'text-brand-50' : 'text-ink'
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            'mt-5 text-lg leading-relaxed',
            light ? 'text-brand-200' : 'text-ink-soft'
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  )
}
