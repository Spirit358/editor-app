import type { Metadata } from 'next'
import { site, t, hasGallery } from '@/lib/site'
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

/** Unlinked and left out of the sitemap until real photographs exist. */
export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow={t.crumbs.ourWork}
        title={t.pages.gallery.title}
        intro={hasGallery ? t.pages.gallery.intro(site.contact.address.locality) : t.galleryEmpty}
        breadcrumbs={TRAIL}
      />
      <Gallery />
      <Cta />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  )
}
