import { Hero } from '@/components/sections/hero'
import { Facts } from '@/components/sections/facts'
import { Services } from '@/components/sections/services'
import { Spotlight } from '@/components/sections/spotlight'
import { Process } from '@/components/sections/process'
import { About } from '@/components/sections/about'
import { Reviews } from '@/components/sections/reviews'
import { Areas } from '@/components/sections/areas'
import { Gallery } from '@/components/sections/gallery'
import { Faq } from '@/components/sections/faq'
import { Contact } from '@/components/sections/contact'
import { JsonLd } from '@/components/json-ld'
import { faqSchema } from '@/lib/seo'

/**
 * One page, in the order a visitor decides: what you do, what you are known
 * for, how a job runs, who you are, where, questions, contact. The contact
 * section lives on the homepage as well as its own page — on a trades site
 * the form should never be a click away.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Facts />
      <Services />
      <Spotlight />
      <Process />
      <About />
      <Reviews />
      <Areas />
      <Gallery limit={6} />
      <Faq />
      <Contact />
      <JsonLd data={faqSchema()} />
    </>
  )
}
