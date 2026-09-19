import { site, phoneDisplay, phoneHref, copy, t } from '@/lib/site'
import { SectionHeading } from './section-heading'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function Faq() {
  const faqs = site.faqs
  if (!faqs?.length) return null

  return (
    <section id="faq" className="section rule-b">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeading eyebrow={copy.faqEyebrow} title={copy.faqTitle} intro={copy.faqIntro} />
              <p className="mt-6">
                <a href={phoneHref} data-cta="faq-call" className="link text-[0.9375rem]">
                  {t.faqCall(phoneDisplay)}
                </a>
              </p>
            </div>
          </div>
          <div className="lg:col-span-8">
            <Accordion type="single" collapsible defaultValue="faq-0" className="rule-strong-t">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
