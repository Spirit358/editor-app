import Link from 'next/link'
import { site, t, phoneDisplay, phoneHref, hasGallery } from '@/lib/site'
import { dayLabel } from '@/lib/utils'

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  x: 'X',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

/** Solid brand block. NAP first, then the site's structure. */
export function Footer() {
  const { business, contact, hours, areas, services } = site
  const year = new Date().getFullYear()
  const social = Object.entries(site.social ?? {}).filter(([, v]) => v)

  return (
    <footer className="bg-brand-deep text-on-brand no-print">
      <div className="container-page">
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12 lg:py-16">
          <div className="lg:col-span-5">
            <p className="display text-3xl">{business.wordmark ?? business.name}</p>
            <p className="measure-narrow mt-4 text-sm leading-relaxed opacity-80">{business.description}</p>

            <address className="mt-8 space-y-1.5 text-sm not-italic">
              <p>
                <a href={phoneHref} data-cta="footer-call" className="tabular link-quiet text-lg font-medium">
                  {phoneDisplay}
                </a>
              </p>
              <p>
                <a href={`mailto:${contact.email}`} className="link-quiet break-all opacity-90">
                  {contact.email}
                </a>
              </p>
              <p className="opacity-90">
                {!contact.address.hideStreet && contact.address.street && `${contact.address.street}, `}
                {contact.address.postcode && `${contact.address.postcode} `}
                {contact.address.locality}
              </p>
            </address>
          </div>

          <nav className="lg:col-span-3" aria-label={t.footer.services}>
            <h2 className="label text-on-brand/80">{t.footer.services}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="link-quiet opacity-90 hover:opacity-100">
                    {s.name}
                  </Link>
                </li>
              ))}
              {hasGallery && (
                <li>
                  <Link href="/gallery" className="link-quiet opacity-90 hover:opacity-100">
                    {t.crumbs.ourWork}
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <nav className="lg:col-span-2" aria-label={t.footer.areasCovered}>
            <h2 className="label text-on-brand/80">{t.footer.areasCovered}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {areas.map((a) => (
                <li key={a.slug}>
                  <Link href={`/areas/${a.slug}`} className="link-quiet opacity-90 hover:opacity-100">
                    {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="label text-on-brand/80">{t.footer.openingHours}</h2>
            {hours?.length ? (
              <dl className="tabular mt-4 space-y-2 text-sm">
                {hours.map((h, i) => (
                  <div key={i} className="flex justify-between gap-3">
                    <dt className="opacity-80">{dayLabel(h.days, t.days)}</dt>
                    <dd>{h.closed ? t.closed : `${h.opens}–${h.closes}`}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {contact.emergency?.available && <p className="mt-4 text-sm opacity-90">{t.emergencyLine}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-on-brand/20 py-6 text-xs opacity-80 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.rights(year, business.legalName ?? business.name)}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {business.accreditations?.slice(0, 2).map((a) => (
              <span key={a}>{a}</span>
            ))}
            {social.map(([key, href]) => (
              <a key={key} href={href as string} rel="noopener noreferrer me" target="_blank" className="link-quiet">
                {SOCIAL_LABELS[key] ?? key}
              </a>
            ))}
            {contact.googleReviewUrl && (
              <a href={contact.googleReviewUrl} rel="noopener noreferrer" target="_blank" className="link-quiet">
                {t.footer.review}
              </a>
            )}
            <Link href="/privacy" className="link-quiet">
              {t.footer.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
