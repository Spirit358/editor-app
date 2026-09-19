import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Rectangular, flat, one colour each. Exported separately so <Link> and <a>
 * wear the same styles without a Slot layer.
 */
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-medium tracking-[-0.005em]',
    'rounded-[var(--radius-sm)]',
    'transition-colors duration-150',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-brand text-on-brand hover:bg-brand-deep',
        accent: 'bg-accent text-on-accent hover:bg-accent-deep',
        outline: 'border border-ink text-ink hover:bg-ink hover:text-paper',
        'outline-light': 'border border-on-brand/40 text-on-brand hover:bg-on-brand hover:text-brand-deep',
        ghost: 'text-ink hover:bg-paper-3',
      },
      size: {
        sm: 'h-9 px-3.5 text-sm [&_svg]:size-4',
        md: 'h-11 px-5 text-[0.9375rem] [&_svg]:size-4',
        lg: 'h-12 px-6 text-base [&_svg]:size-[1.125rem]',
        xl: 'h-14 px-7 text-lg [&_svg]:size-5',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
)
Button.displayName = 'Button'
