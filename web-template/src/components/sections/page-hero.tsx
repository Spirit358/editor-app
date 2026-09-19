import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * The dark band every inner page opens with. Sits behind the transparent
 * sticky header, same as the homepage hero, so the whole site has one
 * consistent top edge.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  children,
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  intro?: string
  breadcrumbs?: Array<{ name: string; path: string }>
  children?: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'grain relative isolate overflow-hidden bg-brand-950 text-brand-50',
        '-mt-18 pt-18 lg:-mt-20 lg:pt-20',
        className
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_70%_at_15%_10%,color-mix(in_oklab,var(--color-brand-600)_30%,transparent),transparent_70%),radial-gradient(45%_60%_at_90%_90%,color-mix(in_oklab,var(--color-accent-600)_16%,transparent),transparent_70%)]"
      />

      <div className="container-page">
        <div className="max-w-3xl py-16 sm:py-20 lg:py-24">
          {breadcrumbs?.length ? (
            <nav aria-label="Breadcrumb" className="animate-fade mb-7">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-brand-300">
                {breadcrumbs.map((crumb, i) => {
                  const last = i === breadcrumbs.length - 1
                  return (
                    <li key={crumb.path} className="flex items-center gap-1.5">
                      {i > 0 && (
                        <ChevronRight
                          className="size-3.5 text-brand-500"
                          aria-hidden
                        />
                      )}
                      {last ? (
                        <span aria-current="page" className="text-brand-100">
                          {crumb.name}
                        </span>
                      ) : (
                        <Link
                          href={crumb.path}
                          className="link-underline transition-colors hover:text-brand-50"
                        >
                          {crumb.name}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ol>
            </nav>
          ) : null}

          {eyebrow && (
            <p className="animate-fade eyebrow text-accent-400">
              <span className="h-px w-6 bg-accent-400/60" aria-hidden />
              {eyebrow}
            </p>
          )}

          {/* No fade and no stagger: this is the LCP element. */}
          <h1 className="animate-rise-lcp mt-4 text-5xl leading-[1.04]">{title}</h1>

          {intro && (
            <p
              className="animate-rise stagger mt-5 max-w-2xl text-lg leading-relaxed text-brand-200"
              style={{ '--i': 2 } as React.CSSProperties}
            >
              {intro}
            </p>
          )}

          {children && (
            <div
              className="animate-rise stagger mt-8"
              style={{ '--i': 3 } as React.CSSProperties}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
