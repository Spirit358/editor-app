import type { SiteConfig } from '@/lib/types'

/**
 * NEW CLIENT SKELETON.
 *
 * `pnpm new-site <slug>` copies this file to clients/<slug>/site.config.ts.
 * Work top to bottom and replace every __PLACEHOLDER__. The build fails with a
 * named error if anything required is still missing, so you cannot ship a site
 * with a blank phone number.
 *
 * Intake checklist before you start:
 *   business name · Google Maps listing · existing site (if any) · services
 *   areas covered · reviews · phone · email · opening hours · photos
 */

const config: SiteConfig = {
  slug: '__SLUG__',

  // Language of every button, label and legal paragraph: 'en-GB' | 'pl-PL'.
  locale: 'en-GB',

  // Demo mode stays ON until the client has agreed. It applies noindex and a
  // blocking robots.txt, and shows the preview banner.
  demo: {
    enabled: true,
    expiresOn: '__YYYY-MM-DD__',
    note: 'Sample content — photography and reviews are placeholders.',
  },

  business: {
    name: '__BUSINESS NAME__',
    type: 'LocalBusiness', // Plumber | Electrician | RoofingContractor | BarberShop | …
    tagline: '__SHORT POSITIONING LINE__',
    description: '__ONE OR TWO SENTENCES, USED AS THE DEFAULT META DESCRIPTION__',
    tradePlural: '__Plumbers / Electricians / Barbers__',
    accreditations: [],
  },

  contact: {
    phone: '__PHONE__',
    email: '__EMAIL__',
    address: {
      locality: '__TOWN__',
      region: '__COUNTY__',
      country: 'GB',
      // hideStreet: true, // for traders working from home
    },
    // geo: { lat: 0, lng: 0 },
  },

  hours: [
    { days: [1, 2, 3, 4, 5], opens: '08:00', closes: '17:00' },
    { days: [6, 7], closed: true },
  ],

  // The whole palette comes from these numbers. Pick a hue off the client's
  // van, sign or existing branding, then run `pnpm gen-assets --slug <slug>
  // --hue <hue>` so the placeholder imagery matches.
  brand: {
    hue: 224,
    chroma: 0.13,
    accentHue: 38,
    radius: 0.625,
    // 'fraunces-inter' (established, warm) | 'bricolage-inter' (modern, technical)
    fonts: 'fraunces-inter',
  },

  hero: {
    eyebrow: '__CREDENTIAL · AREA__',
    headline: '__HEADLINE__',
    headlineAccent: '__EMPHASISED FRAGMENT__',
    sub: '__WHAT YOU DO, FOR WHOM, AND WHY THEY SHOULD RING YOU__',
    ctas: [
      { label: '__PHONE__', href: 'tel', kind: 'tel' },
      { label: 'Request a quote', href: '/contact', kind: 'secondary' },
    ],
    badges: [],
  },

  services: [
    {
      slug: '__service-slug__',
      name: '__Service name__',
      short: '__One line for the card and meta description.__',
      icon: 'Wrench',
      body: ['__Paragraph one.__', '__Paragraph two.__'],
      bullets: [],
    },
  ],

  areas: [{ slug: '__area-slug__', name: '__Area__', postcodes: [] }],

  // Only add a rating once it is real and the reviews behind it are shown.
  reviews: [],

  faqs: [],

  seo: {
    baseUrl: 'https://__slug__.pages.dev',
  },

  forms: {
    // Empty during the demo. Point at Web3Forms / Formspree when they sign.
    endpoint: '',
  },
}

export default config
