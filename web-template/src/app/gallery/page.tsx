import type { Metadata } from 'next'
import { site } from '@/lib/site'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { PageHero } from '@/components/sections/page-hero'
import { Gallery } from '@/components/sections/gallery'
import { Cta } from '@/components/sections/cta'
import { JsonLd } from '@/components/json-ld'

export const metadata: Metadata = buildMetadata({
  title: 'Our work',
  description: `Recent jobs completed by ${site.business.name} across ${site.contact.address.locality}.`,
  path: '/gallery',
})

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Work we have finished recently"
        intro={`A cross-section of recent jobs across ${site.contact.address.locality} and the areas around it.`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Our work', path: '/gallery' },
        ]}
      />

      <Gallery />
      <Cta />

      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Our work', path: '/gallery' },
        ])}
      />
    </>
  )
}
