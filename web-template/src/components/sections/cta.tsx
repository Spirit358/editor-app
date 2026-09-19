import Link from 'next/link'
import { Phone } from 'lucide-react'
import { phoneDisplay, phoneHref, copy, t } from '@/lib/site'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'

export function Cta({
  heading,
  sub,
}: {
  heading?: string
  sub?: string
} = {}) {
  const title = heading ?? copy.ctaHeading
  const body = sub ?? copy.ctaSub

  return (
    <section className="section-y-sm bg-surface-2">
      <div className="container-page">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-[var(--radius-xl)] bg-brand-900 px-7 py-12 text-center sm:px-12 sm:py-16">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(70%_120%_at_50%_0%,color-mix(in_oklab,var(--color-accent-600)_20%,transparent),transparent_65%)]"
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-4xl leading-tight text-brand-50">{title}</h2>
              <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-brand-200">
                {body}
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={phoneHref}
                  data-cta="footer-cta-call"
                  className={cn(
                    buttonVariants({ variant: 'accent', size: 'xl' }),
                    'w-full sm:w-auto'
                  )}
                >
                  <Phone aria-hidden />
                  <span className="tabular-nums">{phoneDisplay}</span>
                </a>
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ variant: 'outline-light', size: 'xl' }),
                    'w-full sm:w-auto'
                  )}
                >
                  {t.sendMessage}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
