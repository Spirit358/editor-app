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
 * A plain-language privacy notice covering what this site actually does: a
 * contact form and nothing else. The text is per-locale because the legal
 * basis and the regulator differ — UK GDPR and the ICO for en-GB, RODO and the
 * UODO for pl-PL. If a client adds analytics, booking or a chatbot, the
 * relevant locale's text in i18n.ts has to be updated to match — it is not
 * decoration, it is the transparency obligation.
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

      <section className="section-y bg-surface">
        <div className="container-page">
          <div className="max-w-2xl space-y-10 text-ink-soft">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl text-ink">{section.title}</h2>
                <p className="mt-3 leading-relaxed">{section.body(ctx)}</p>
              </div>
            ))}

            <div>
              <p className="leading-relaxed">
                {regulator.lead}
                <a
                  href={regulator.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="link-underline text-brand-700"
                >
                  {regulator.name}
                </a>
                {regulator.tail}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
