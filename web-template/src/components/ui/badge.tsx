import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-medium tracking-tight',
  {
    variants: {
      variant: {
        default: 'bg-surface-3 text-ink-soft',
        outline: 'border border-line-strong text-ink-soft',
        light: 'border border-brand-50/25 bg-brand-50/8 text-brand-100',
        accent: 'bg-accent-500/15 text-accent-700',
        brand: 'bg-brand-100 text-brand-800',
      },
      size: {
        sm: 'px-2.5 py-1 text-xs [&_svg]:size-3',
        md: 'px-3 py-1.5 text-sm [&_svg]:size-3.5',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}
