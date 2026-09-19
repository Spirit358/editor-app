import { Hero } from '@/components/sections/hero'
import { Services } from '@/components/sections/services'
import { About } from '@/components/sections/about'
import { Reviews } from '@/components/sections/reviews'
import { Areas } from '@/components/sections/areas'
import { Gallery } from '@/components/sections/gallery'
import { Faq } from '@/components/sections/faq'
import { Cta } from '@/components/sections/cta'
import { JsonLd } from '@/components/json-ld'
import { faqSchema } from '@/lib/seo'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <About />
      <Reviews />
      <Areas />
      <Gallery limit={6} />
      <Faq />
      <Cta />
      <JsonLd data={faqSchema()} />
    </>
  )
}
