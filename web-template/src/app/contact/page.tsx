import type { Metadata } from 'next'
import { site, t, phoneDisplay } from '@/lib/site'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { PageHero } from '@/components/sections/page-hero'
import { Contact } from '@/components/sections/contact'
import { JsonLd } from '@/components/json-ld'

const TRAIL = [
  { name: t.crumbs.home, path: '/' },
  { name: t.crumbs.contact, path: '/contact' },
]

export const metadata: Metadata = buildMetadata({
  title: t.crumbs.contact,
  description: t.meta.contact(site.business.name, phoneDisplay, site.contact.address.locality),
  path: '/contact',
})

export default function ContactPage() {
  const s = t.pages.contact
  return (
    <>
      <PageHero
        eyebrow={site.contact.emergency?.available ? s.emergencyEyebrow : s.eyebrow}
        title={s.title}
        intro={site.contact.emergency?.note ?? s.intro}
        breadcrumbs={TRAIL}
      />
      <Contact compact />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  )
}
