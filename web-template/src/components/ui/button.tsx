import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Exported separately so <Link> and <a> can wear the same styles without
 * pulling in a Slot polymorphism layer.
 */
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-medium tracking-tight',
    'transition-[transform,box-shadow,background-color,color,border-color] duration-300',
    'ease-[var(--ease-out-quint)]',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:translate-y-px',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-brand-950 text-brand-50 shadow-[var(--shadow-lift)]',
          'hover:bg-brand-900 hover:shadow-[var(--shadow-deep)] hover:-translate-y-0.5',
        ],
        accent: [
          'bg-accent-500 text-brand-950 shadow-[var(--shadow-lift)]',
          'hover:bg-accent-400 hover:shadow-[var(--shadow-deep)] hover:-translate-y-0.5',
        ],
        outline: [
          'border border-line-strong bg-transparent text-ink',
          'hover:border-brand-950 hover:bg-brand-950 hover:text-brand-50 hover:-translate-y-0.5',
        ],
        'outline-light': [
          'border border-brand-50/30 bg-brand-50/5 text-brand-50 backdrop-blur-sm',
          'hover:bg-brand-50 hover:text-brand-950 hover:-translate-y-0.5',
        ],
        ghost: 'text-ink hover:bg-surface-3',
        link: 'text-brand-700 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-9 rounded-[var(--radius-sm)] px-3.5 text-sm [&_svg]:size-4',
        md: 'h-11 rounded-[var(--radius-md)] px-5 text-[0.9375rem] [&_svg]:size-4',
        lg: 'h-13 rounded-[var(--radius-md)] px-6 text-base [&_svg]:size-5',
        xl: 'h-15 rounded-[var(--radius-md)] px-7 text-lg [&_svg]:size-5',
        icon: 'size-11 rounded-[var(--radius-md)] [&_svg]:size-5',
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
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
)
Button.displayName = 'Button'
