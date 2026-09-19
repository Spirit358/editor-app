import type { Metadata } from 'next'
import { site, phoneDisplay } from '@/lib/site'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { PageHero } from '@/components/sections/page-hero'
import { Contact } from '@/components/sections/contact'
import { JsonLd } from '@/components/json-ld'

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description: `Call ${site.business.name} on ${phoneDisplay} or send an enquiry. Covering ${site.contact.address.locality} and the surrounding areas.`,
  path: '/contact',
})

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow={
          site.contact.emergency?.available
            ? 'Emergency line answered 24 hours'
            : 'Get in touch'
        }
        title="Talk to us"
        intro={
          site.contact.emergency?.note ??
          'Ring for anything urgent. For quotes and planned work, the form is usually easier.'
        }
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />

      <Contact compact />

      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
    </>
  )
}
