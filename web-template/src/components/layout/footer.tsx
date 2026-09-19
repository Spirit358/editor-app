import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { site, phoneDisplay } from '@/lib/site'
import { dayLabel, telHref } from '@/lib/utils'

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  x: 'X',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

export function Footer() {
  const { business, contact, hours, areas, services } = site
  const year = new Date().getFullYear()
  const social = Object.entries(site.social ?? {}).filter(([, v]) => v)

  return (
    <footer className="grain relative bg-brand-950 text-brand-200 no-print">
      <div className="container-page">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
          {/* Identity + NAP */}
          <div className="lg:col-span-4">
            <p className="font-display text-2xl text-brand-50">
              {business.wordmark ?? business.name}
              <span className="text-accent-500">.</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-300">
              {business.description}
            </p>

            <address className="mt-7 space-y-3 text-sm not-italic">
              <a
                href={telHref(contact.phone)}
                data-cta="footer-call"
                className="flex items-center gap-3 text-brand-50 transition-colors hover:text-accent-400"
              >
                <Phone className="size-4 shrink-0 text-accent-500" aria-hidden />
                <span className="tabular-nums">{phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 transition-colors hover:text-brand-50"
              >
                <Mail className="size-4 shrink-0 text-accent-500" aria-hidden />
                <span className="break-all">{contact.email}</span>
              </a>
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent-500" aria-hidden />
                <span>
                  {!contact.address.hideStreet && contact.address.street && (
                    <>
                      {contact.address.street}
                      <br />
                    </>
                  )}
                  {contact.address.locality}
                  {contact.address.region && `, ${contact.address.region}`}
                  {contact.address.postcode && ` ${contact.address.postcode}`}
                </span>
              </p>
            </address>
          </div>

          {/* Services */}
          <nav className="lg:col-span-3" aria-label="Services">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-400">
              Services
            </h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="link-underline transition-colors hover:text-brand-50"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Areas — genuine internal linking for local search */}
          <nav className="lg:col-span-3" aria-label="Areas covered">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-400">
              Areas covered
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm lg:grid-cols-1">
              {areas.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/areas/${a.slug}`}
                    className="link-underline transition-colors hover:text-brand-50"
                  >
                    {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Hours */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-400">
              Opening hours
            </h2>
            {hours?.length ? (
              <dl className="mt-5 space-y-2.5 text-sm">
                {hours.map((h, i) => (
                  <div key={i} className="flex justify-between gap-3">
                    <dt className="text-brand-300">{dayLabel(h.days)}</dt>
                    <dd className="tabular-nums text-brand-50">
                      {h.closed ? 'Closed' : `${h.opens}–${h.closes}`}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {contact.emergency?.available && (
              <p className="mt-5 rounded-[var(--radius-sm)] border border-accent-500/30 bg-accent-500/10 px-3 py-2.5 text-xs leading-relaxed text-accent-300">
                24/7 emergency line
              </p>
            )}
          </div>
        </div>

        {/* Accreditations */}
        {business.accreditations?.length ? (
          <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-brand-800 py-6 text-xs text-brand-400">
            {business.accreditations.map((a) => (
              <li key={a} className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-accent-500" aria-hidden />
                {a}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-col gap-4 border-t border-brand-800 py-7 text-xs text-brand-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.legalName ?? business.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {social.map(([key, href]) => (
              <a
                key={key}
                href={href as string}
                rel="noopener noreferrer me"
                target="_blank"
                className="transition-colors hover:text-brand-50"
              >
                {SOCIAL_LABELS[key] ?? key}
              </a>
            ))}
            <Link href="/privacy" className="transition-colors hover:text-brand-50">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
