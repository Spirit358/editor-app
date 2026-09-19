import Link from 'next/link'
import { Phone } from 'lucide-react'
import { t, phoneDisplay, phoneHref } from '@/lib/site'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  const s = t.pages.notFound

  return (
    <section className="grain relative isolate -mt-18 flex min-h-[70vh] items-center overflow-hidden bg-brand-950 pt-18 text-brand-50 lg:-mt-20 lg:pt-20">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_70%_at_50%_20%,color-mix(in_oklab,var(--color-brand-600)_28%,transparent),transparent_70%)]"
      />
      <div className="container-page py-20 text-center">
        <p className="eyebrow justify-center text-accent-400">{s.eyebrow}</p>
        <h1 className="mt-5 text-5xl">{s.title}</h1>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-brand-200">{s.body}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={phoneHref} className={cn(buttonVariants({ variant: 'accent', size: 'lg' }))}>
            <Phone aria-hidden />
            <span className="tabular-nums">{phoneDisplay}</span>
          </a>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: 'outline-light', size: 'lg' }))}
          >
            {s.home}
          </Link>
        </div>
      </div>
    </section>
  )
}
