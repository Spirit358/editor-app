import type { Metadata } from 'next'
import { site, t } from '@/lib/site'
import { buildMetadata } from '@/lib/seo'
import { PageHero } from '@/components/sections/page-hero'

export const metadata: Metadata = buildMetadata({
  title: t.pages.privacy.title,
  description: t.meta.privacy(site.business.name),
  path: '/privacy',
})

/**
 * Per-locale because the legal basis and the regulator differ (UK GDPR / ICO
 * vs RODO / UODO). If a client adds analytics or booking, update that
 * locale's text in i18n.ts — it is the transparency obligation.
 */
export default function PrivacyPage() {
  const { business, contact } = site
  const ctx = {
    legalName: business.legalName ?? business.name,
    place: contact.address.locality,
    postcode: contact.address.postcode ?? '',
    email: contact.email,
  }
  const { sections, regulator } = t.privacy

  return (
    <>
      <PageHero
        eyebrow={t.pages.privacy.eyebrow}
        title={t.pages.privacy.title}
        intro={t.pages.privacy.intro(business.name)}
        breadcrumbs={[
          { name: t.crumbs.home, path: '/' },
          { name: t.crumbs.privacy, path: '/privacy' },
        ]}
      />
      <section className="section">
        <div className="container-page">
          <div className="measure space-y-8 text-ink-2">
            {sections.map((section) => (
              <div key={section.title} className="rule-t pt-6">
                <h2 className="display-wide text-xl text-ink">{section.title}</h2>
                <p className="mt-3 leading-relaxed">{section.body(ctx)}</p>
              </div>
            ))}
            <p className="rule-t pt-6 leading-relaxed">
              {regulator.lead}
              <a href={regulator.url} rel="noopener noreferrer" target="_blank" className="link">
                {regulator.name}
              </a>
              {regulator.tail}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
