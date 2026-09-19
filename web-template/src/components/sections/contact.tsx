import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { site, t, phoneDisplay, phoneHref, waHref } from '@/lib/site'
import { dayLabel } from '@/lib/utils'
import { SectionHeading } from './section-heading'
import { ContactForm } from './contact-form'
import { Reveal } from '@/components/reveal'

export function Contact({ compact = false }: { compact?: boolean }) {
  const { contact, hours, forms, services, business } = site

  return (
    <section id="contact" className="section-y bg-surface">
      <div className="container-page">
        {!compact && (
          <SectionHeading
            eyebrow={t.pages.contact.eyebrow}
            title={t.pages.contact.title}
            intro={t.pages.contact.intro}
          />
        )}

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Contact rails first on mobile: a phone number beats a form. */}
          <div className="order-1 lg:order-2 lg:col-span-5">
            <Reveal delay={60}>
              <a
                href={phoneHref}
                data-cta="contact-call"
                className="group flex items-center gap-5 rounded-[var(--radius-lg)] bg-brand-950 p-6 transition-colors duration-400 hover:bg-brand-900"
              >
                <span className="grid size-13 shrink-0 place-items-center rounded-full bg-accent-500 text-brand-950">
                  <Phone className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.14em] text-accent-400">
                    {contact.emergency?.available ? t.emergencyAnswered : t.callUs}
                  </span>
                  <span className="mt-1 block font-display text-2xl tabular-nums text-brand-50">
                    {phoneDisplay}
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={120}>
              <dl className="mt-6 divide-y divide-line rounded-[var(--radius-lg)] border border-line">
                <Row icon={<Mail aria-hidden />} term={t.email}>
                  <a
                    href={`mailto:${contact.email}`}
                    className="link-underline break-all text-ink"
                  >
                    {contact.email}
                  </a>
                </Row>

                {contact.whatsapp && (
                  <Row icon={<MessageCircle aria-hidden />} term={t.whatsapp}>
                    <a
                      href={waHref(t.whatsappOpener(business.name))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-ink"
                    >
                      {t.messageUs}
                    </a>
                  </Row>
                )}

                <Row icon={<MapPin aria-hidden />} term={t.whereWeAre}>
                  <span className="text-ink">
                    {!contact.address.hideStreet && contact.address.street && (
                      <>
                        {contact.address.street}
                        <br />
                      </>
                    )}
                    {contact.address.postcode && `${contact.address.postcode} `}
                    {contact.address.locality}
                  </span>
                </Row>

                {hours?.length ? (
                  <Row icon={<Clock aria-hidden />} term={t.hours}>
                    <span className="space-y-1">
                      {hours.map((h, i) => (
                        <span key={i} className="flex justify-between gap-6">
                          <span className="text-muted">{dayLabel(h.days, t.days)}</span>
                          <span className="tabular-nums text-ink">
                            {h.closed ? t.closed : `${h.opens}–${h.closes}`}
                          </span>
                        </span>
                      ))}
                    </span>
                  </Row>
                ) : null}
              </dl>
            </Reveal>

            {contact.mapEmbedUrl && (
              <Reveal delay={180}>
                <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-line">
                  <iframe
                    src={contact.mapEmbedUrl}
                    title={t.mapTitle(business.name, contact.address.locality)}
                    width="100%"
                    height="260"
                    // Lazy so the third-party frame never blocks first paint.
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="block border-0 grayscale-[0.35]"
                  />
                </div>
              </Reveal>
            )}
          </div>

          <Reveal className="order-2 lg:order-1 lg:col-span-7">
            <ContactForm
              endpoint={forms.endpoint}
              hiddenFields={forms.hiddenFields}
              successMessage={forms.successMessage}
              services={services.map((s) => ({ slug: s.slug, name: s.name }))}
              labels={{ ...t.form, sentBody: t.form.sentBody(business.name) }}
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/**
 * Inside a <dl>, a wrapping <div> may contain only <dt> and <dd> — no other
 * elements. The icon therefore lives inside the <dt> rather than as a sibling,
 * which is also the more accurate reading: it is decoration on the term.
 */
function Row({
  icon,
  term,
  children,
}: {
  icon: React.ReactNode
  term: string
  children: React.ReactNode
}) {
  return (
    <div className="p-6">
      <dt className="flex items-center gap-2.5 text-xs uppercase tracking-[0.12em] text-muted">
        <span className="shrink-0 text-brand-600 [&_svg]:size-4" aria-hidden>
          {icon}
        </span>
        {term}
      </dt>
      <dd className="mt-2 flex min-w-0 flex-col pl-[1.625rem] text-[0.9375rem]">
        {children}
      </dd>
    </div>
  )
}
