import type { Metadata } from 'next'
import { site } from '@/lib/site'
import { buildMetadata } from '@/lib/seo'
import { PageHero } from '@/components/sections/page-hero'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy',
  description: `How ${site.business.name} handles the details you send through this website.`,
  path: '/privacy',
})

/**
 * A plain-English privacy notice covering what this site actually does: a
 * contact form and nothing else. If a client adds analytics, booking or a
 * chatbot, this page has to be updated to match — it is not decoration, it is
 * the UK GDPR transparency obligation.
 */
export default function PrivacyPage() {
  const { business, contact } = site

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy notice"
        intro={`What ${business.name} does with the information you send us, in plain English.`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Privacy', path: '/privacy' },
        ]}
      />

      <section className="section-y bg-surface">
        <div className="container-page">
          <div className="max-w-2xl space-y-10 text-ink-soft">
            <Block title="Who we are">
              <p>
                {business.legalName ?? business.name}
                {contact.address.locality && `, ${contact.address.locality}`}
                {contact.address.postcode && ` ${contact.address.postcode}`}. You
                can reach us on{' '}
                <a
                  href={`mailto:${contact.email}`}
                  className="link-underline text-brand-700"
                >
                  {contact.email}
                </a>{' '}
                about anything on this page.
              </p>
            </Block>

            <Block title="What we collect">
              <p>
                Only what you type into the contact form — your name, phone
                number, email address and the description of the job. We do not
                run advertising trackers, we do not build a profile of you, and
                we do not buy or sell data about you.
              </p>
            </Block>

            <Block title="Why we hold it">
              <p>
                To reply to your enquiry and, if you go ahead, to carry out and
                invoice the work. That is a legitimate interest in responding to
                someone who has asked us to get in touch, and a contractual
                necessity once a job is booked.
              </p>
            </Block>

            <Block title="How long we keep it">
              <p>
                Enquiries that do not turn into work are deleted within twelve
                months. Records of completed jobs are kept for six years,
                because HMRC and our insurers require it.
              </p>
            </Block>

            <Block title="Who else sees it">
              <p>
                Our email provider, and the form service that delivers the
                message from this website to our inbox. Nobody else, and never
                for marketing.
              </p>
            </Block>

            <Block title="Your rights">
              <p>
                You can ask us for a copy of what we hold, ask us to correct it,
                or ask us to delete it, and we will action it within a month.
                If you are not happy with how we have handled it you can
                complain to the Information Commissioner&rsquo;s Office at{' '}
                <a
                  href="https://ico.org.uk"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="link-underline text-brand-700"
                >
                  ico.org.uk
                </a>
                .
              </p>
            </Block>
          </div>
        </div>
      </section>
    </>
  )
}

function Block({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="text-xl text-ink">{title}</h2>
      <div className="mt-3 space-y-4 leading-relaxed">{children}</div>
    </div>
  )
}
