import { site, phoneDisplay, phoneHref, copy, t } from '@/lib/site'
import { SectionHeading } from './section-heading'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Reveal } from '@/components/reveal'

export function Faq() {
  const faqs = site.faqs
  if (!faqs?.length) return null

  return (
    <section id="faq" className="section-y bg-surface">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            {/* Sticky on desktop so the heading stays with the answers. */}
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                eyebrow={copy.faqEyebrow}
                title={copy.faqTitle}
                intro={copy.faqIntro}
              />
              <Reveal delay={120}>
                <a
                  href={phoneHref}
                  data-cta="faq-call"
                  className="mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-brand-700"
                >
                  <span className="link-underline">{t.faqCall(phoneDisplay)}</span>
                </a>
              </Reveal>
            </div>
          </div>

          <Reveal className="lg:col-span-8" delay={80}>
            <Accordion
              type="single"
              collapsible
              // The first answer open gives the section shape on load and
              // tells people the rest are clickable.
              defaultValue="faq-0"
              className="border-t border-line"
            >
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
