import type { Metadata } from 'next'
import { site, t } from '@/lib/site'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { PageHero } from '@/components/sections/page-hero'
import { Gallery } from '@/components/sections/gallery'
import { Cta } from '@/components/sections/cta'
import { JsonLd } from '@/components/json-ld'

const TRAIL = [
  { name: t.crumbs.home, path: '/' },
  { name: t.crumbs.ourWork, path: '/gallery' },
]

export const metadata: Metadata = buildMetadata({
  title: t.crumbs.ourWork,
  description: t.meta.gallery(site.business.name, site.contact.address.locality),
  path: '/gallery',
})

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow={t.crumbs.ourWork}
        title={t.pages.gallery.title}
        intro={t.pages.gallery.intro(site.contact.address.locality)}
        breadcrumbs={TRAIL}
      />

      <Gallery />
      <Cta />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  )
}
