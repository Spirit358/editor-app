import Link from 'next/link'
import { Phone } from 'lucide-react'
import { t, phoneDisplay, phoneHref } from '@/lib/site'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  const s = t.pages.notFound
  return (
    <section className="section">
      <div className="container-page">
        <p className="label">{s.eyebrow}</p>
        <h1 className="display mt-4 text-6xl text-ink">{s.title}</h1>
        <p className="measure mt-5 text-lg text-ink-2">{s.body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={phoneHref} className={cn(buttonVariants({ variant: 'accent', size: 'lg' }))}>
            <Phone aria-hidden strokeWidth={1.75} />
            <span className="tabular">{phoneDisplay}</span>
          </a>
          <Link href="/" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
            {s.home}
          </Link>
        </div>
      </div>
    </section>
  )
}
