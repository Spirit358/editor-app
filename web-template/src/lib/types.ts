/**
 * The entire shape of a client site.
 *
 * A new client = one new `clients/<slug>/site.config.ts` conforming to this
 * type, plus their images in `public/clients/<slug>/`. Nothing else changes.
 */

/** schema.org LocalBusiness subtypes worth using for the trades niche. */
export type BusinessType =
  | 'Plumber'
  | 'Electrician'
  | 'RoofingContractor'
  | 'HVACBusiness'
  | 'GeneralContractor'
  | 'Locksmith'
  | 'HousePainter'
  | 'Landscaper'
  | 'MovingCompany'
  | 'HairSalon'
  | 'BarberShop'
  | 'Restaurant'
  | 'AutoRepair'
  | 'LocalBusiness'

export interface Brand {
  /** OKLCH hue angle 0-360. This single number re-themes the whole site. */
  hue: number
  /** Chroma multiplier for the brand ramp. 0.10 muted → 0.16 vivid. */
  chroma?: number
  /** Hue for the secondary accent (buttons' glow, underlines, stats). */
  accentHue?: number
  accentChroma?: number
  /** How much brand hue bleeds into greys. 0 = pure neutral, 0.01 = tinted. */
  neutralChroma?: number
  /** Base corner radius in rem. 0 = brutal, 0.5 = default, 1 = soft. */
  radius?: number
  /** Which pairing from src/fonts/ to build with. Defaults to fraunces-inter. */
  fonts?: FontPairing
}

export interface MediaAsset {
  type: 'image' | 'video'
  /** Path under /public, or an absolute URL. */
  src: string
  /** Poster frame for video. Required for video — it is the LCP element. */
  poster?: string
  alt: string
  width?: number
  height?: number
}

export interface CallToAction {
  label: string
  href: string
  /** 'tel' renders a click-to-call and is tracked separately. */
  kind?: 'primary' | 'secondary' | 'tel'
}

export interface Service {
  slug: string
  name: string
  /** One line, used on cards and in meta descriptions. */
  short: string
  /** Paragraphs for the service detail page. */
  body: string[]
  bullets?: string[]
  /** lucide-react icon name, e.g. 'Droplets'. Falls back to a generic icon. */
  icon?: string
  /** Drawn illustration shown wherever `image` is absent. */
  illustration?: Illustration
  image?: MediaAsset
  priceFrom?: string
  /** Show on the homepage services grid. Defaults to true. */
  featured?: boolean
  /**
   * Heading for the call-to-action panel at the foot of this service's page,
   * e.g. 'Need a new boiler?'. Falls back to the site-wide CTA heading —
   * generating one from the service name does not survive translation.
   */
  ctaHeading?: string
}

export interface ServiceArea {
  slug: string
  name: string
  blurb?: string
  postcodes?: string[]
}

export interface Review {
  author: string
  rating: 1 | 2 | 3 | 4 | 5
  text: string
  source?: string
  /** ISO date. Used in Review schema. */
  date?: string
}

export interface GalleryItem {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export interface Faq {
  q: string
  a: string
}

export interface Stat {
  value: string
  label: string
}

export interface OpeningHours {
  /** Mon=1 … Sun=7 */
  days: number[]
  opens?: string
  closes?: string
  closed?: boolean
}

import type { Locale } from './i18n'

/** Font pairings available in src/fonts/. `pnpm use-site` wires the choice up. */
export type FontPairing = 'archivo' | 'fraunces-inter' | 'bricolage-inter'

/**
 * Drawn line illustrations of the equipment (src/components/illustration.tsx).
 * The imagery until real photography exists; never a blurred placeholder.
 */
export type Illustration =
  | 'boiler'
  | 'heatpump'
  | 'radiator'
  | 'underfloor'
  | 'cylinder'
  | 'warehouse'
  | 'van'
  | 'tools'

export interface SiteConfig {
  slug: string

  /**
   * Language of the whole site — every button, label and legal paragraph.
   * Defaults to 'en-GB'. Client content is whatever language you write it in.
   */
  locale?: Locale

  /**
   * Demo mode. While true the site is noindex + nofollow, robots.txt disallows
   * everything, and a "Preview prepared for X" bar sits above the header.
   * Flip to false only once the client has signed.
   */
  demo: {
    enabled: boolean
    /** Defaults to business.name. */
    preparedFor?: string
    /** ISO date. Shown in the banner so old demos are obviously stale. */
    expiresOn?: string
    /** Optional note in the banner, e.g. "Photos are placeholders". */
    note?: string
  }

  business: {
    name: string
    legalName?: string
    type: BusinessType
    tagline: string
    /** 1-2 sentences. Used as the default meta description. */
    description: string
    foundedYear?: number
    /** Text wordmark used when no logo image is supplied. */
    wordmark?: string
    /**
     * How the trade is named in the plural, e.g. 'Plumbers', 'Electricians',
     * 'Barbers'. Used in area page headings: "Plumbers in Headingley".
     */
    tradePlural?: string
    logo?: MediaAsset
    priceRange?: string
    /** e.g. ['Gas Safe registered', 'CIPHE member'] */
    accreditations?: string[]
  }

  contact: {
    phone: string
    /** Human formatting, e.g. '0113 496 0000'. Defaults to `phone`. */
    phoneDisplay?: string
    /**
     * International prefix used to build tel: links from a national number,
     * e.g. '+48'. Defaults to the locale's country. Ignored when `phone`
     * already starts with '+'.
     */
    phoneCountry?: string
    email: string
    whatsapp?: string
    emergency?: {
      available: boolean
      note?: string
    }
    address: {
      street?: string
      locality: string
      region?: string
      postcode?: string
      country: string
      /** Hide the street on the site but keep it in schema (home traders). */
      hideStreet?: boolean
    }
    geo?: { lat: number; lng: number }
    /**
     * Full Google Maps embed src. Omitted → the map is skipped entirely.
     * Use the keyless form — `https://www.google.com/maps?q=<place>&output=embed`
     * — rather than the Maps Embed API, which needs a billable API key and
     * renders a broken grey box without one.
     */
    mapEmbedUrl?: string
    /** Link to the Google Business Profile. */
    googleMapsUrl?: string
    /**
     * The "write a review" link from the Business Profile (Ask for reviews →
     * share). Shown in the footer and used on review cards; nothing else.
     */
    googleReviewUrl?: string
  }

  hours?: OpeningHours[]

  brand: Brand

  hero: {
    /** Small line above the headline. */
    eyebrow?: string
    headline: string
    /** Emphasised fragment of the headline, wrapped in the accent style. */
    headlineAccent?: string
    sub: string
    /** A real photograph. Takes precedence over `illustration` when set. */
    media?: MediaAsset
    /** Drawn illustration for the hero panel until photography exists. */
    illustration?: Illustration
    ctas: CallToAction[]
    /** Short proof points under the CTAs. */
    badges?: string[]
  }

  /**
   * One thing the business is known for, given a full-width solid block on
   * the homepage — for Activa, the wholesale counter; for a plumber, the
   * emergency line. Optional; the section is skipped when absent.
   */
  spotlight?: {
    eyebrow?: string
    title: string
    body: string[]
    bullets?: string[]
    illustration?: Illustration
    image?: MediaAsset
    cta?: CallToAction
  }

  /**
   * How a job runs, in four steps. Falls back to the locale's generic steps
   * when omitted.
   */
  process?: Array<{ title: string; body: string }>

  services: Service[]
  areas: ServiceArea[]
  reviews: Review[]
  /**
   * Aggregate rating for schema.org. Only allowed when `reviews` are shown on
   * the page — Google treats an unbacked rating as spam.
   */
  rating?: { value: number; count: number }
  /**
   * The business's public Google rating, shown as a linked proof point in
   * the hero when no reviews have been transcribed yet. Visible text only —
   * it is never emitted as structured data. Fill in `reviews` and `rating`
   * once you have the actual review texts.
   */
  googleRating?: { value: number; count: number; url: string }

  about?: {
    heading: string
    body: string[]
    image?: MediaAsset
    stats?: Stat[]
  }

  gallery?: GalleryItem[]
  faqs?: Faq[]

  /**
   * Section headings and intros. Every field is optional and falls back to a
   * neutral sentence built from the business details, so a minimal config
   * still reads properly — but filling these in is what stops ten client
   * sites sounding like the same template.
   */
  copy?: {
    servicesEyebrow?: string
    servicesTitle?: string
    servicesIntro?: string
    aboutEyebrow?: string
    reviewsEyebrow?: string
    reviewsTitle?: string
    areasEyebrow?: string
    areasTitle?: string
    areasIntro?: string
    galleryEyebrow?: string
    galleryTitle?: string
    galleryIntro?: string
    faqEyebrow?: string
    faqTitle?: string
    faqIntro?: string
    ctaHeading?: string
    ctaSub?: string
  }

  social?: {
    facebook?: string
    instagram?: string
    x?: string
    linkedin?: string
    youtube?: string
    tiktok?: string
  }

  seo: {
    /** No trailing slash. Used for canonicals, sitemap and OG tags. */
    baseUrl: string
    /** Defaults to `${business.name} | ${business.tagline}`. */
    title?: string
    description?: string
    /** Path under /public. A gradient OG image is generated if omitted. */
    ogImage?: string
    /** Extra keywords are deliberately not supported — they do nothing. */
    /**
     * Site-verification tokens: Google Search Console (HTML tag method,
     * the `content` value) and Bing Webmaster Tools (`msvalidate.01`).
     */
    verification?: {
      google?: string
      bing?: string
      /**
       * Search Console's "HTML file" method instead of the tag: the file's
       * name (google<hex>.html). The deploy scripts write it into out/ with
       * the content Google expects, so it survives every redeploy.
       */
      googleFile?: string
    }
    /**
     * IndexNow key (8–128 of [a-zA-Z0-9-]). Served at /indexnow.txt; the
     * deploy scripts ping Bing & co. with every sitemap URL after an upload.
     */
    indexNowKey?: string
  }

  forms: {
    /**
     * Where the contact form posts. Any endpoint accepting a JSON or
     * form-encoded POST works: Web3Forms, Formspree, Basin, n8n webhook.
     * Leave empty during a demo — the form then shows a preview notice
     * instead of silently dropping enquiries.
     */
    endpoint?: string
    /** Extra hidden fields, e.g. Web3Forms' access_key. */
    hiddenFields?: Record<string, string>
    /** Shown after a successful submit. */
    successMessage?: string
  }

  /**
   * The site's chat assistant. Answers hours, address, phone, areas and the
   * FAQ from the page itself with no network call; only a free-text question
   * reaches the model, through `endpoint`. Leave `endpoint` empty to run the
   * assistant with no model at all — the local answers still work.
   */
  chatbot?: {
    enabled: boolean
    /**
     * Where free-text questions POST. '/chat.php' is the handler that
     * `pnpm deploy-ftp` generates beside the site. Empty = local answers only.
     */
    endpoint?: string
    /**
     * Extra facts for the model, in the site's language, one sentence each.
     * Things the page does not say but a visitor asks: "Nie sprzedajemy
     * klimatyzacji." Never prices.
     */
    notes?: string[]
    /** Free-text questions per conversation before handing off to the phone. Default 8. */
    maxTurns?: number
  }

  analytics?: {
    /** Plausible domain, e.g. 'kirkstallplumbing.co.uk'. */
    plausible?: string
    /** GA4 measurement ID. Adds a cookie banner obligation — prefer Plausible. */
    ga4?: string
  }
}
