import Link from 'next/link'
import { cn } from '@/lib/utils'

/** The ruled opening of every inner page: breadcrumbs, label, headline, intro. */
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
    <section className={cn('rule-b', className)}>
      <div className="container-page">
        <div className="py-10 sm:py-14 lg:py-16">
          {breadcrumbs?.length ? (
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-3">
                {breadcrumbs.map((crumb, i) => {
                  const last = i === breadcrumbs.length - 1
                  return (
                    <li key={crumb.path} className="flex items-center gap-2">
                      {i > 0 && <span aria-hidden>/</span>}
                      {last ? (
                        <span aria-current="page" className="text-ink">
                          {crumb.name}
                        </span>
                      ) : (
                        <Link href={crumb.path} className="link-quiet hover:text-ink">
                          {crumb.name}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ol>
            </nav>
          ) : null}

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {eyebrow && <p className="label">{eyebrow}</p>}
              <h1 className="display mt-3 text-5xl text-ink">{title}</h1>
              {intro && <p className="measure mt-5 text-lg leading-relaxed text-ink-2">{intro}</p>}
            </div>
            {children && <div className="flex items-end lg:col-span-4 lg:justify-end">{children}</div>}
          </div>
        </div>
      </div>
    </section>
  )
}
