import Link from 'next/link'
import { Phone } from 'lucide-react'
import { phoneDisplay, phoneHref, copy, t } from '@/lib/site'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

/** A ruled band, not a panel: heading, the phone, a link to the form. */
export function Cta({ heading, sub }: { heading?: string; sub?: string } = {}) {
  return (
    <section className="section-sm rule-b bg-paper-2">
      <div className="container-page">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="display text-4xl text-ink">{heading ?? copy.ctaHeading}</h2>
            <p className="measure mt-3 text-lg leading-relaxed text-ink-2">{sub ?? copy.ctaSub}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:col-span-5 lg:justify-end">
            <a
              href={phoneHref}
              data-cta="band-call"
              className={cn(buttonVariants({ variant: 'accent', size: 'xl' }), 'w-full sm:w-auto')}
            >
              <Phone aria-hidden strokeWidth={1.75} />
              <span className="tabular">{phoneDisplay}</span>
            </a>
            <Link href="/contact" className="link px-2 text-center text-[0.9375rem]">
              {t.sendMessage}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
