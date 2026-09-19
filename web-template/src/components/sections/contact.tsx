import { Phone } from 'lucide-react'
import { site, t, phoneDisplay, phoneHref, waHref } from '@/lib/site'
import { dayLabel } from '@/lib/utils'
import { SectionHeading } from './section-heading'
import { ContactForm } from './contact-form'

export function Contact({ compact = false }: { compact?: boolean }) {
  const { contact, hours, forms, services, business } = site

  return (
    <section id="contact" className="section">
      <div className="container-page">
        {!compact && (
          <SectionHeading eyebrow={t.pages.contact.eyebrow} title={t.pages.contact.title} intro={t.pages.contact.intro} />
        )}

        <div className={compact ? 'grid gap-12 lg:grid-cols-12 lg:gap-16' : 'mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16'}>
          {/* Details first on mobile: a phone number beats a form. */}
          <div className="order-1 lg:order-2 lg:col-span-5">
            <a
              href={phoneHref}
              data-cta="contact-call"
              className="rule-strong-t group flex items-center justify-between gap-4 py-5"
            >
              <span>
                <span className="label block">{contact.emergency?.available ? t.emergencyAnswered : t.callUs}</span>
                <span className="display tabular mt-1 block text-3xl text-ink transition-colors group-hover:text-brand">
                  {phoneDisplay}
                </span>
              </span>
              <Phone className="size-6 text-brand" aria-hidden strokeWidth={1.5} />
            </a>

            <dl className="rule-strong-t divide-y divide-rule">
              <Row term={t.email}>
                <a href={`mailto:${contact.email}`} className="link break-all">
                  {contact.email}
                </a>
              </Row>
              {contact.whatsapp && (
                <Row term={t.whatsapp}>
                  <a href={waHref(t.whatsappOpener(business.name))} target="_blank" rel="noopener noreferrer" className="link">
                    {t.messageUs}
                  </a>
                </Row>
              )}
              <Row term={t.whereWeAre}>
                {!contact.address.hideStreet && contact.address.street && (
                  <>
                    {contact.address.street}
                    <br />
                  </>
                )}
                {contact.address.postcode && `${contact.address.postcode} `}
                {contact.address.locality}
              </Row>
              {hours?.length ? (
                <Row term={t.hours}>
                  <span className="tabular grid gap-1">
                    {hours.map((h, i) => (
                      <span key={i} className="flex justify-between gap-6">
                        <span className="text-ink-3">{dayLabel(h.days, t.days)}</span>
                        <span>{h.closed ? t.closed : `${h.opens}–${h.closes}`}</span>
                      </span>
                    ))}
                  </span>
                </Row>
              ) : null}
            </dl>

            {contact.mapEmbedUrl && (
              <iframe
                src={contact.mapEmbedUrl}
                title={t.mapTitle(business.name, contact.address.locality)}
                width="100%"
                height="240"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="mt-6 block rounded-[var(--radius-md)] border-0 grayscale-[0.2]"
              />
            )}
          </div>

          <div className="order-2 lg:order-1 lg:col-span-7">
            <ContactForm
              endpoint={forms.endpoint}
              hiddenFields={forms.hiddenFields}
              successMessage={forms.successMessage}
              services={services.map((s) => ({ slug: s.slug, name: s.name }))}
              labels={{ ...t.form, sentBody: t.form.sentBody(business.name) }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/** Inside a <dl>, a wrapping <div> may contain only <dt> and <dd>. */
function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-4">
      <dt className="label pt-0.5">{term}</dt>
      <dd className="text-[0.9375rem] text-ink">{children}</dd>
    </div>
  )
}
