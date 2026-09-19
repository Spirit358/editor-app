import * as React from 'react'
import { cn } from '@/lib/utils'

const fieldBase = [
  'w-full rounded-[var(--radius-sm)] border border-line-strong bg-surface',
  'px-4 py-3 text-base text-ink placeholder:text-muted',
  'transition-[border-color,box-shadow] duration-200',
  'hover:border-brand-400',
  'focus:border-brand-600 focus:outline-none',
  'focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-brand-500)_18%,transparent)]',
  'disabled:cursor-not-allowed disabled:opacity-60',
].join(' ')

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(fieldBase, className)} {...props} />
))
Input.displayName = 'Input'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(fieldBase, 'min-h-32 resize-y', className)}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(fieldBase, 'appearance-none bg-no-repeat pr-10', className)}
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
      backgroundPosition: 'right 1rem center',
    }}
    {...props}
  />
))
Select.displayName = 'Select'

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('block text-sm font-medium text-ink-soft', className)}
      {...props}
    />
  )
}
