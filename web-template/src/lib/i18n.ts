/**
 * Every user-facing string that is not client content.
 *
 * Client content (services, reviews, headlines) lives in site.config.ts. This
 * file holds the chrome around it — buttons, labels, ARIA text, legal copy,
 * fallback section headings — in each language the template ships in.
 *
 * Adding a language means adding one entry to LOCALES. Nothing else changes.
 * Components never hardcode English; they read `t` from `@/lib/site`.
 */

export type Locale = 'en-GB' | 'pl-PL'

export interface Strings {
  /** BCP 47 tag for <html lang>, Intl formatting and Open Graph. */
  lang: Locale
  ogLocale: string
  /** Short weekday names, Monday first. */
  days: [string, string, string, string, string, string, string]
  /** Number of the country's phone prefix for tel: links, e.g. '+44'. */
  phoneCountry: string

  nav: {
    services: string
    areas: string
    about: string
    reviews: string
    contact: string
  }
  skipToContent: string
  openMenu: string
  closeMenu: string
  mainNav: string
  mobileNav: string

  call: string
  callNow: string
  callPhone: (phone: string) => string
  requestQuote: string
  sendMessage: string
  sendEnquiry: string
  details: string
  readMore: string
  allServices: string
  from: string
  typicallyFrom: string
  whatYouGet: string
  whatIsIncluded: string
  otherServices: string
  nearbyAreas: string
  whatWeDoHere: string
  everyServiceIn: (area: string) => string
  coveringAreas: (areas: string, place: string) => string
  credentials: string
  reviewsFrom: (count: number) => string
  reviewsCount: (count: number) => string
  /** 'from 32 Google reviews' — the linked proof point under the hero CTAs. */
  googleReviews: (count: number) => string
  via: string
  ratedOutOf: (value: number) => string
  ratedOutOfCount: (value: number, count: number) => string
  outOfFive: (value: number) => string
  whatsappAria: string
  whatsappOpener: (business: string) => string
  faqCall: (phone: string) => string
  emergencyAnswered: string
  emergencyLine: string
  callUs: string
  email: string
  whatsapp: string
  messageUs: string
  whereWeAre: string
  hours: string
  closed: string
  mapTitle: (business: string, place: string) => string

  demo: {
    preparedFor: (name: string) => string
    privateLink: (date: string) => string
  }

  footer: {
    services: string
    areasCovered: string
    openingHours: string
    rights: (year: number, name: string) => string
    privacy: string
    review: string
  }

  /** Labels for /llms.txt — the site's facts as one plain-text page for AI crawlers. */
  llms: {
    facts: string
    legalName: string
    founded: string
    address: string
    phone: string
    email: string
    hours: string
    areas: string
    services: string
    faq: string
    notes: string
    pages: string
  }

  form: {
    name: string
    namePlaceholder: string
    phone: string
    phonePlaceholder: string
    email: string
    emailPlaceholder: string
    service: string
    choose: string
    somethingElse: string
    details: string
    detailsPlaceholder: string
    send: string
    sending: string
    sent: string
    sentBody: (business: string) => string
    privacyNote: string
    previewError: string
    sendError: string
    honeypot: string
  }

  /** The chat assistant. Functions here are resolved before reaching the widget. */
  chat: {
    open: string
    close: string
    title: (business: string) => string
    greeting: (business: string) => string
    placeholder: string
    send: string
    thinking: string
    you: string
    quick: { hours: string; address: string; phone: string; areas: string; services: string }
    answers: {
      hours: string
      address: string
      phone: (phone: string) => string
      areas: string
      areasMore: (phone: string) => string
      services: string
    }
    handoff: (phone: string) => string
    limitReached: (phone: string) => string
    offline: (phone: string) => string
    error: string
    disclaimer: string
    callCta: string
    formCta: string
    ariaPanel: string
    ariaLog: string
    ariaInput: string
  }

  pages: {
    services: { title: string; intro: string; titleUnpriced: string; introUnpriced: string }
    areas: { title: (place: string) => string; intro: string }
    about: {
      eyebrow: (place: string, year: number) => string
      title: (name: string) => string
    }
    contact: {
      title: string
      emergencyEyebrow: string
      eyebrow: string
      intro: string
    }
    gallery: { title: string; intro: (place: string) => string }
    privacy: { title: string; intro: (name: string) => string; eyebrow: string }
    notFound: { eyebrow: string; title: string; body: string; home: string }
  }

  crumbs: {
    home: string
    services: string
    areas: string
    about: string
    contact: string
    ourWork: string
    privacy: string
  }

  meta: {
    services: (name: string, place: string, list: string) => string
    areas: (name: string, list: string, place: string) => string
    serviceTitle: (service: string, place: string) => string
    serviceDesc: (short: string, name: string, place: string, phone: string) => string
    areaTitle: (trade: string, area: string, top: string) => string
    areaDesc: (name: string, area: string, postcodes: string, desc: string) => string
    about: string
    contact: (name: string, phone: string, place: string) => string
    gallery: (name: string, place: string) => string
    privacy: (name: string) => string
    notFound: string
  }

  /** Ruled strip of facts under the hero. */
  facts: {
    since: (year: number) => string
    /** A schema-backed rating from the reviews shown on the page. */
    rating: (value: string, count: number) => string
    /** The public Google score, linked, when no review texts are on the page. */
    googleRating: (value: string, count: number) => string
    hours: string
  }

  /** Numbered "how a job runs" steps, used when the config has none. */
  process: {
    eyebrow: string
    title: string
    steps: Array<{ title: string; body: string }>
  }

  galleryEmpty: string

  /** Fallback section copy when site.config.ts leaves `copy` blank. */
  copy: {
    servicesEyebrow: string
    servicesTitle: string
    servicesIntro: (count: number, place: string) => string
    aboutEyebrow: string
    reviewsEyebrow: string
    reviewsTitle: string
    areasEyebrow: string
    areasTitle: (place: string) => string
    areasIntro: string
    galleryEyebrow: string
    galleryTitle: string
    faqEyebrow: string
    faqTitle: string
    faqIntro: string
    ctaHeading: string
    ctaSub: string
    areaPageTitle: (trade: string, area: string) => string
  }

  privacy: {
    sections: Array<{
      title: string
      body: (ctx: {
        legalName: string
        place: string
        postcode: string
        email: string
      }) => string
    }>
    regulator: { name: string; url: string; lead: string; tail: string }
  }
}

const en: Strings = {
  lang: 'en-GB',
  ogLocale: 'en_GB',
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  phoneCountry: '+44',

  nav: {
    services: 'Services',
    areas: 'Areas',
    about: 'About',
    reviews: 'Reviews',
    contact: 'Contact',
  },
  skipToContent: 'Skip to content',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  mainNav: 'Main',
  mobileNav: 'Mobile',

  call: 'Call',
  callNow: 'Call now',
  callPhone: (phone) => `Call ${phone}`,
  requestQuote: 'Request a quote',
  sendMessage: 'Send a message',
  sendEnquiry: 'Send enquiry',
  details: 'Details',
  readMore: 'Read more',
  allServices: 'All services',
  from: 'From',
  typicallyFrom: 'Typically from',
  whatYouGet: 'What you get',
  whatIsIncluded: 'What is included',
  otherServices: 'Other services',
  nearbyAreas: 'Nearby areas we also cover',
  whatWeDoHere: 'What we do here',
  everyServiceIn: (area) => `Every service we offer, available in ${area}`,
  coveringAreas: (areas, place) => `Covering ${areas} and the rest of ${place}.`,
  credentials: 'Credentials',
  reviewsFrom: (count) => `from ${count} reviews`,
  reviewsCount: (count) => `${count} reviews`,
  googleReviews: (count) => `from ${count} Google reviews`,
  via: 'via',
  ratedOutOf: (value) => `Rated ${value} out of 5`,
  ratedOutOfCount: (value, count) => `Rated ${value} out of 5 from ${count} reviews`,
  outOfFive: (value) => `${value} out of 5`,
  whatsappAria: 'Message us on WhatsApp',
  whatsappOpener: (business) => `Hi ${business}, I'd like a quote for…`,
  faqCall: (phone) => `Something else? Call ${phone}`,
  emergencyAnswered: 'Answered 24 hours',
  emergencyLine: '24/7 emergency line',
  callUs: 'Call us',
  email: 'Email',
  whatsapp: 'WhatsApp',
  messageUs: 'Message us',
  whereWeAre: 'Where we are',
  hours: 'Hours',
  closed: 'Closed',
  mapTitle: (business, place) => `Map showing ${business} in ${place}`,

  demo: {
    preparedFor: (name) => `Preview prepared for ${name}`,
    privateLink: (date) => `Private link · removed after ${date}`,
  },

  footer: {
    services: 'Services',
    areasCovered: 'Areas covered',
    openingHours: 'Opening hours',
    rights: (year, name) => `© ${year} ${name.replace(/\.$/, '')}. All rights reserved.`,
    privacy: 'Privacy',
    review: 'Review us on Google',
  },

  llms: {
    facts: 'Facts',
    legalName: 'Legal name',
    founded: 'Trading since',
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    hours: 'Opening hours',
    areas: 'Areas covered',
    services: 'Services',
    faq: 'Frequently asked questions',
    notes: 'Good to know',
    pages: 'Pages',
  },

  form: {
    name: 'Your name',
    namePlaceholder: 'Jane Smith',
    phone: 'Phone',
    phonePlaceholder: '07700 900000',
    email: 'Email',
    emailPlaceholder: 'jane@example.com',
    service: 'What do you need?',
    choose: 'Choose a service…',
    somethingElse: 'Something else',
    details: 'Details',
    detailsPlaceholder: 'Tell us what has happened, and roughly where you are.',
    send: 'Send enquiry',
    sending: 'Sending…',
    sent: 'Message sent',
    sentBody: (business) => `Thanks — ${business} will come back to you shortly.`,
    privacyNote:
      'We use your details to reply to this enquiry and nothing else. No lists, no passing them on.',
    previewError:
      'This is a preview, so the form is not connected yet. On the live site it goes straight to the business inbox.',
    sendError:
      'Something went wrong sending that. Please ring us instead — we would rather hear from you than lose the job to a broken form.',
    honeypot: 'Company (leave blank)',
  },

  chat: {
    open: 'Ask a question',
    close: 'Close chat',
    title: (business) => `Ask ${business}`,
    greeting: (business) =>
      `Hello — I can answer quick questions about ${business}: opening hours, where we are, what we do. For a quote, a call works best.`,
    placeholder: 'Type a question…',
    send: 'Send',
    thinking: 'Typing…',
    you: 'You',
    quick: { hours: 'Opening hours', address: 'Address', phone: 'Phone', areas: 'Areas covered', services: 'Services' },
    answers: {
      hours: 'We are open:',
      address: 'You will find us at',
      phone: (phone) => `Call us on ${phone}.`,
      areas: 'We cover:',
      areasMore: (phone) => `Further away? Call ${phone} — on bigger jobs distance is rarely a problem.`,
      services: 'What we do:',
    },
    handoff: (phone) => `That is one to settle on the phone: ${phone}.`,
    limitReached: (phone) =>
      `That is as far as I can take it here. Call ${phone} or leave a message in the form and a person will pick it up.`,
    offline: (phone) => `The assistant is unavailable right now. Call ${phone} or use the contact form.`,
    error: 'That did not send. Try again, or call.',
    disclaimer: 'Answers come from an AI assistant working from the information on this site. Do not share details you would rather keep private.',
    callCta: 'Call',
    formCta: 'Contact form',
    ariaPanel: 'Chat assistant',
    ariaLog: 'Conversation',
    ariaInput: 'Your question',
  },

  pages: {
    services: {
      title: 'What we do, and what it costs',
      intro:
        'Prices are where jobs typically start. We survey anything substantial before quoting, so the number you get is the number you pay.',
      titleUnpriced: 'What we do',
      introUnpriced:
        'Every job is quoted after a look at the building, so the number you get is the number you pay. Call, or send the form, and we will tell you what makes sense before proposing anything.',
    },
    areas: {
      title: (place) => `Areas we cover around ${place}`,
      intro:
        'Each area has its own page with what we typically get called out for there. If yours is not listed, ring and ask.',
    },
    about: {
      eyebrow: (place, year) => `Working in ${place} since ${year}`,
      title: (name) => `About ${name}`,
    },
    contact: {
      title: 'Talk to us',
      emergencyEyebrow: 'Emergency line answered 24 hours',
      eyebrow: 'Get in touch',
      intro:
        'Ring for anything urgent. For quotes and planned work, the form is usually easier.',
    },
    gallery: {
      title: 'Work we have finished recently',
      intro: (place) => `A cross-section of recent jobs across ${place} and the areas around it.`,
    },
    privacy: {
      eyebrow: 'Legal',
      title: 'Privacy notice',
      intro: (name) => `What ${name} does with the information you send us, in plain English.`,
    },
    notFound: {
      eyebrow: 'Error 404',
      title: 'That page has moved or never existed',
      body: 'Whatever you were after, the quickest route is still the phone.',
      home: 'Back to the homepage',
    },
  },

  crumbs: {
    home: 'Home',
    services: 'Services',
    areas: 'Areas',
    about: 'About',
    contact: 'Contact',
    ourWork: 'Our work',
    privacy: 'Privacy',
  },

  meta: {
    services: (name, place, list) => `Everything ${name} does across ${place}: ${list}.`,
    areas: (name, list, place) => `${name} covers ${list} and the rest of ${place}.`,
    serviceTitle: (service, place) => `${service} in ${place}`,
    serviceDesc: (short, name, place, phone) => `${short} ${name}, ${place} and the surrounding area. Call ${phone}.`,
    areaTitle: (trade, area, top) => `${trade} in ${area} — ${top}`,
    areaDesc: (name, area, postcodes, desc) =>
      `${name} covers ${area}${postcodes ? ` (${postcodes})` : ''}. ${desc}`,
    about: 'About us',
    contact: (name, phone, place) =>
      `Call ${name} on ${phone} or send an enquiry. Covering ${place} and the surrounding areas.`,
    gallery: (name, place) => `Recent jobs completed by ${name} across ${place}.`,
    privacy: (name) => `How ${name} handles the details you send through this website.`,
    notFound: 'Not found',
  },

  facts: {
    since: (year) => `Since ${year}`,
    rating: (value, count) => `Rated ${value} · ${count} reviews`,
    googleRating: (value, count) => `${value} on Google · ${count} reviews`,
    hours: 'Hours',
  },

  process: {
    eyebrow: 'How a job runs',
    title: 'Four steps, one point of contact',
    steps: [
      { title: 'Call or write', body: 'Tell us what has happened or what you are planning. You get a person, and a straight answer on whether it is a job for us.' },
      { title: 'Survey and quote', body: 'For anything substantial we look first. The quote names the equipment and the scope, so the number you see is the number you pay.' },
      { title: 'The work', body: 'A written programme, the same team throughout, and the site left clean every evening.' },
      { title: 'Afterwards', body: 'Commissioning, paperwork, and a service reminder before the warranty needs it.' },
    ],
  },

  galleryEmpty: 'Photographs of recent work are on their way.',

  copy: {
    servicesEyebrow: 'What we do',
    servicesTitle: 'Our services',
    servicesIntro: (count, place) =>
      `One team across ${count} areas of ${place}, with the same fixed-price approach whatever the job.`,
    aboutEyebrow: "Who you're calling",
    reviewsEyebrow: 'In their words',
    reviewsTitle: 'What customers say',
    areasEyebrow: 'Where we work',
    areasTitle: (place) => `Covering ${place} and the areas around it`,
    areasIntro:
      'If you are just outside one of these, ring anyway — we will tell you straight away if we are the wrong people for the job.',
    galleryEyebrow: 'Recent work',
    galleryTitle: 'A few jobs we were happy to photograph',
    faqEyebrow: 'Before you ring',
    faqTitle: 'Straight answers',
    faqIntro:
      'The questions we get asked most, answered the way we would answer them on the phone.',
    ctaHeading: 'Got a job that needs doing?',
    ctaSub:
      'Tell us what has happened and we will give you a straight answer on price and timing.',
    areaPageTitle: (trade, area) => `${trade} in ${area}`,
  },

  privacy: {
    sections: [
      {
        title: 'Who we are',
        body: ({ legalName, place, postcode, email }) =>
          `${legalName}, ${place} ${postcode}. You can reach us on ${email} about anything on this page.`,
      },
      {
        title: 'What we collect',
        body: () =>
          'Only what you type into the contact form — your name, phone number, email address and the description of the job. We do not run advertising trackers, we do not build a profile of you, and we do not buy or sell data about you.',
      },
      {
        title: 'Why we hold it',
        body: () =>
          'To reply to your enquiry and, if you go ahead, to carry out and invoice the work. That is a legitimate interest in responding to someone who has asked us to get in touch, and a contractual necessity once a job is booked.',
      },
      {
        title: 'How long we keep it',
        body: () =>
          'Enquiries that do not turn into work are deleted within twelve months. Records of completed jobs are kept for six years, because HMRC and our insurers require it.',
      },
      {
        title: 'Who else sees it',
        body: () =>
          'Our email provider, and the form service that delivers the message from this website to our inbox. Nobody else, and never for marketing.',
      },
    ],
    regulator: {
      lead: 'You can ask us for a copy of what we hold, ask us to correct it, or ask us to delete it, and we will action it within a month. If you are not happy with how we have handled it you can complain to the Information Commissioner’s Office at ',
      name: 'ico.org.uk',
      url: 'https://ico.org.uk',
      tail: '.',
    },
  },
}

/** Polish plural of "opinia" in the nominative. */
function plOpinie(n: number) {
  const last = n % 10
  const lastTwo = n % 100
  if (n === 1) return 'opinia'
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'opinie'
  return 'opinii'
}

const pl: Strings = {
  lang: 'pl-PL',
  ogLocale: 'pl_PL',
  days: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'],
  phoneCountry: '+48',

  nav: {
    services: 'Oferta',
    areas: 'Obszar działania',
    about: 'O nas',
    reviews: 'Opinie',
    contact: 'Kontakt',
  },
  skipToContent: 'Przejdź do treści',
  openMenu: 'Otwórz menu',
  closeMenu: 'Zamknij menu',
  mainNav: 'Główne',
  mobileNav: 'Mobilne',

  call: 'Zadzwoń',
  callNow: 'Zadzwoń teraz',
  callPhone: (phone) => `Zadzwoń: ${phone}`,
  requestQuote: 'Poproś o wycenę',
  sendMessage: 'Napisz do nas',
  sendEnquiry: 'Wyślij zapytanie',
  details: 'Szczegóły',
  readMore: 'Czytaj więcej',
  allServices: 'Cała oferta',
  from: 'Od',
  typicallyFrom: 'Zazwyczaj od',
  whatYouGet: 'Co zyskujesz',
  whatIsIncluded: 'Co obejmuje usługa',
  otherServices: 'Pozostałe usługi',
  nearbyAreas: 'Pobliskie miejscowości, które również obsługujemy',
  whatWeDoHere: 'Co tu robimy',
  everyServiceIn: (area) => `Pełna oferta dostępna również w: ${area}`,
  coveringAreas: (areas, place) => `Obsługujemy ${areas} oraz cały powiat ${place}.`,
  credentials: 'Kwalifikacje i uprawnienia',
  // Genitive after "na podstawie", so always "opinii".
  reviewsFrom: (count) => `na podstawie ${count} opinii`,
  // Nominative: 1 opinia, 2–4 opinie, 5+ opinii (12–14 are always opinii).
  reviewsCount: (count) => `${count} ${plOpinie(count)}`,
  googleReviews: (count) => `na podstawie ${count} opinii w Google`,
  via: 'przez',
  ratedOutOf: (value) => `Ocena ${value} na 5`,
  ratedOutOfCount: (value, count) => `Ocena ${value} na 5 na podstawie ${count} opinii`,
  outOfFive: (value) => `${value} na 5`,
  whatsappAria: 'Napisz do nas na WhatsApp',
  whatsappOpener: (business) => `Dzień dobry, ${business}. Proszę o wycenę…`,
  faqCall: (phone) => `Inne pytanie? Zadzwoń: ${phone}`,
  emergencyAnswered: 'Odbieramy całą dobę',
  emergencyLine: 'Linia awaryjna 24/7',
  callUs: 'Zadzwoń do nas',
  email: 'E-mail',
  whatsapp: 'WhatsApp',
  messageUs: 'Napisz do nas',
  whereWeAre: 'Gdzie jesteśmy',
  hours: 'Godziny otwarcia',
  closed: 'Nieczynne',
  mapTitle: (business, place) => `Mapa z lokalizacją ${business} w miejscowości ${place}`,

  demo: {
    preparedFor: (name) => `Podgląd przygotowany dla ${name}`,
    privateLink: (date) => `Link prywatny · usunięty po ${date}`,
  },

  footer: {
    services: 'Oferta',
    areasCovered: 'Obszar działania',
    openingHours: 'Godziny otwarcia',
    rights: (year, name) => `© ${year} ${name.replace(/\.$/, '')}. Wszelkie prawa zastrzeżone.`,
    privacy: 'Polityka prywatności',
    review: 'Oceń nas w Google',
  },

  llms: {
    facts: 'Fakty',
    legalName: 'Nazwa prawna',
    founded: 'Działa od',
    address: 'Adres',
    phone: 'Telefon',
    email: 'E-mail',
    hours: 'Godziny otwarcia',
    areas: 'Obszar działania',
    services: 'Oferta',
    faq: 'Najczęstsze pytania',
    notes: 'Warto wiedzieć',
    pages: 'Strony',
  },

  form: {
    name: 'Imię i nazwisko',
    namePlaceholder: 'Anna Kowalska',
    phone: 'Telefon',
    phonePlaceholder: '600 000 000',
    email: 'E-mail',
    emailPlaceholder: 'anna@przyklad.pl',
    service: 'Czego potrzebujesz?',
    choose: 'Wybierz usługę…',
    somethingElse: 'Coś innego',
    details: 'Szczegóły',
    detailsPlaceholder: 'Opisz, o co chodzi i gdzie mniej więcej się znajdujesz.',
    send: 'Wyślij zapytanie',
    sending: 'Wysyłanie…',
    sent: 'Wiadomość wysłana',
    sentBody: (business) => `Dziękujemy — ${business} wkrótce się z Tobą skontaktuje.`,
    privacyNote:
      'Twoje dane wykorzystujemy wyłącznie do odpowiedzi na to zapytanie. Żadnych list mailingowych, żadnego przekazywania dalej.',
    previewError:
      'To wersja podglądowa, więc formularz nie jest jeszcze podłączony. Na stronie docelowej wiadomość trafia bezpośrednio do skrzynki firmy.',
    sendError:
      'Coś poszło nie tak przy wysyłce. Prosimy o telefon — wolimy usłyszeć się z Tobą, niż stracić zlecenie przez zepsuty formularz.',
    honeypot: 'Firma (zostaw puste)',
  },

  chat: {
    open: 'Zadaj pytanie',
    close: 'Zamknij czat',
    title: (business) => `Zapytaj: ${business}`,
    greeting: (business) =>
      `Dzień dobry — odpowiem na proste pytania o ${business}: godziny otwarcia, dojazd, zakres usług. W sprawie wyceny najlepiej zadzwonić.`,
    placeholder: 'Napisz pytanie…',
    send: 'Wyślij',
    thinking: 'Piszę…',
    you: 'Ty',
    quick: { hours: 'Godziny otwarcia', address: 'Adres', phone: 'Telefon', areas: 'Dojazd', services: 'Usługi' },
    answers: {
      hours: 'Jesteśmy otwarci:',
      address: 'Znajdziesz nas przy',
      phone: (phone) => `Zadzwoń: ${phone}.`,
      areas: 'Dojeżdżamy do:',
      areasMore: (phone) => `Jesteś dalej? Zadzwoń ${phone} — przy większych realizacjach dojazd rzadko bywa problemem.`,
      services: 'Czym się zajmujemy:',
    },
    handoff: (phone) => `To pytanie najlepiej ustalić telefonicznie: ${phone}.`,
    limitReached: (phone) =>
      `Na tyle mogę tu pomóc. Zadzwoń ${phone} albo zostaw wiadomość w formularzu — odpowie człowiek.`,
    offline: (phone) => `Asystent jest chwilowo niedostępny. Zadzwoń ${phone} albo napisz przez formularz.`,
    error: 'Nie udało się wysłać. Spróbuj ponownie albo zadzwoń.',
    disclaimer: 'Odpowiada asystent AI na podstawie informacji z tej strony. Nie podawaj danych, których wolisz nie przekazywać.',
    callCta: 'Zadzwoń',
    formCta: 'Formularz',
    ariaPanel: 'Asystent czatu',
    ariaLog: 'Rozmowa',
    ariaInput: 'Twoje pytanie',
  },

  pages: {
    services: {
      title: 'Co robimy i ile to kosztuje',
      intro:
        'Podane ceny to punkt wyjścia. Większe prace wyceniamy po oględzinach, więc kwota, którą podajemy, jest kwotą, którą płacisz.',
      titleUnpriced: 'Co robimy',
      introUnpriced:
        'Każdą pracę wyceniamy po oględzinach budynku, więc kwota, którą podajemy, jest kwotą, którą płacisz. Zadzwoń albo napisz — powiemy, co ma sens, zanim cokolwiek zaproponujemy.',
    },
    areas: {
      title: (place) => `Obszar działania wokół miasta ${place}`,
      intro:
        'Każda miejscowość ma własną podstronę z opisem tego, do czego najczęściej jesteśmy tam wzywani. Jeśli Twojej nie ma na liście — zadzwoń i zapytaj.',
    },
    about: {
      eyebrow: (place, year) => `W miejscowości ${place} od ${year} roku`,
      title: (name) => `O firmie ${name}`,
    },
    contact: {
      title: 'Porozmawiajmy',
      emergencyEyebrow: 'Linia awaryjna czynna całą dobę',
      eyebrow: 'Skontaktuj się',
      intro:
        'W pilnych sprawach zadzwoń. Przy wycenach i pracach planowanych zwykle wygodniejszy jest formularz.',
    },
    gallery: {
      title: 'Ostatnio zakończone realizacje',
      intro: (place) => `Przekrój niedawnych prac w mieście ${place} i okolicach.`,
    },
    privacy: {
      eyebrow: 'Informacje prawne',
      title: 'Polityka prywatności',
      intro: (name) => `Co ${name} robi z danymi, które przesyłasz przez tę stronę — prostym językiem.`,
    },
    notFound: {
      eyebrow: 'Błąd 404',
      title: 'Ta strona została przeniesiona lub nigdy nie istniała',
      body: 'Czegokolwiek szukasz, najszybszą drogą wciąż jest telefon.',
      home: 'Wróć na stronę główną',
    },
  },

  crumbs: {
    home: 'Strona główna',
    services: 'Oferta',
    areas: 'Obszar działania',
    about: 'O nas',
    contact: 'Kontakt',
    ourWork: 'Realizacje',
    privacy: 'Polityka prywatności',
  },

  meta: {
    services: (name, place, list) => `Pełna oferta ${name} w mieście ${place} i okolicach: ${list}.`,
    areas: (name, list, place) => `${name} obsługuje ${list} oraz cały powiat ${place}.`,
    serviceTitle: (service, place) => `${service} — ${place}`,
    serviceDesc: (short, name, place, phone) => `${short} ${name} — ${place} i okolice. Tel. ${phone}.`,
    areaTitle: (trade, area, top) => `${trade} ${area} — ${top}`,
    areaDesc: (name, area, postcodes, desc) =>
      `${name} obsługuje ${area}${postcodes ? ` (${postcodes})` : ''}. ${desc}`,
    about: 'O nas',
    contact: (name, phone, place) =>
      `Zadzwoń do ${name} pod numer ${phone} lub wyślij zapytanie. Obsługujemy ${place} i okolice.`,
    gallery: (name, place) => `Niedawne realizacje ${name} w mieście ${place} i okolicach.`,
    privacy: (name) => `Jak ${name} przetwarza dane przesłane przez tę stronę.`,
    notFound: 'Nie znaleziono',
  },

  facts: {
    since: (year) => `Od ${year} roku`,
    rating: (value, count) => `Ocena ${value} · ${count} ${plOpinie(count)}`,
    googleRating: (value, count) => `${value} w Google · ${count} ${plOpinie(count)}`,
    hours: 'Godziny',
  },

  process: {
    eyebrow: 'Jak przebiega zlecenie',
    title: 'Cztery kroki, jedna osoba do kontaktu',
    steps: [
      { title: 'Telefon lub wiadomość', body: 'Opisz, co się dzieje albo co planujesz. Rozmawiasz z człowiekiem i od razu słyszysz, czy to zlecenie dla nas.' },
      { title: 'Oględziny i wycena', body: 'Przy większych pracach najpierw oglądamy budynek. W ofercie są konkretne urządzenia i zakres — kwota, którą widzisz, to kwota, którą płacisz.' },
      { title: 'Realizacja', body: 'Ustalony harmonogram, ten sam zespół od początku do końca, porządek na miejscu po każdym dniu pracy.' },
      { title: 'Po montażu', body: 'Uruchomienie, dokumenty i przypomnienie o przeglądzie, zanim będzie go wymagać gwarancja.' },
    ],
  },

  galleryEmpty: 'Zdjęcia ostatnich realizacji pojawią się wkrótce.',

  copy: {
    servicesEyebrow: 'Co robimy',
    servicesTitle: 'Nasza oferta',
    servicesIntro: (count, place) =>
      `Jeden zespół, ${count} obsługiwanych miejscowości wokół miasta ${place} — i te same jasne zasady wyceny przy każdym zleceniu.`,
    aboutEyebrow: 'Do kogo dzwonisz',
    reviewsEyebrow: 'Głos klientów',
    reviewsTitle: 'Co mówią klienci',
    areasEyebrow: 'Gdzie pracujemy',
    areasTitle: (place) => `Obsługujemy ${place} i okolice`,
    areasIntro:
      'Jeśli jesteś tuż za granicą któregoś z tych obszarów — i tak zadzwoń. Od razu powiemy, czy to zlecenie dla nas.',
    galleryEyebrow: 'Ostatnie realizacje',
    galleryTitle: 'Kilka prac, które warto było sfotografować',
    faqEyebrow: 'Zanim zadzwonisz',
    faqTitle: 'Konkretne odpowiedzi',
    faqIntro:
      'Pytania, które słyszymy najczęściej — z odpowiedziami takimi, jakich udzielilibyśmy przez telefon.',
    ctaHeading: 'Masz robotę do zrobienia?',
    ctaSub: 'Opisz, co się dzieje, a dostaniesz jasną odpowiedź co do ceny i terminu.',
    areaPageTitle: (trade, area) => `${trade} — ${area}`,
  },

  privacy: {
    sections: [
      {
        title: 'Administrator danych',
        body: ({ legalName, place, postcode, email }) =>
          `Administratorem Twoich danych osobowych jest ${legalName}, ${postcode} ${place}. W każdej sprawie dotyczącej tej strony możesz napisać na ${email}.`,
      },
      {
        title: 'Jakie dane zbieramy',
        body: () =>
          'Wyłącznie to, co wpiszesz w formularzu kontaktowym — imię i nazwisko, numer telefonu, adres e-mail i opis zlecenia. Nie korzystamy z narzędzi reklamowych śledzących użytkowników, nie tworzymy Twojego profilu i nie kupujemy ani nie sprzedajemy danych.',
      },
      {
        title: 'Cel i podstawa prawna',
        body: () =>
          'Dane przetwarzamy, aby odpowiedzieć na Twoje zapytanie, a jeśli zdecydujesz się na współpracę — aby wykonać i rozliczyć usługę. Podstawą jest nasz prawnie uzasadniony interes w odpowiedzi na kontakt (art. 6 ust. 1 lit. f RODO), a po zawarciu umowy — jej wykonanie (art. 6 ust. 1 lit. b RODO).',
      },
      {
        title: 'Jak długo przechowujemy dane',
        body: () =>
          'Zapytania, które nie kończą się zleceniem, usuwamy w ciągu dwunastu miesięcy. Dokumentację wykonanych usług przechowujemy przez pięć lat od końca roku podatkowego, zgodnie z wymogami przepisów podatkowych.',
      },
      {
        title: 'Komu przekazujemy dane',
        body: () =>
          'Naszemu dostawcy poczty e-mail oraz operatorowi formularza, który dostarcza wiadomość z tej strony do naszej skrzynki. Nikomu innemu i nigdy w celach marketingowych.',
      },
    ],
    regulator: {
      lead: 'Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia oraz ograniczenia przetwarzania, a także prawo wniesienia sprzeciwu. Wnioski realizujemy w ciągu miesiąca. Jeśli uznasz, że przetwarzamy dane niezgodnie z prawem, możesz wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych: ',
      name: 'uodo.gov.pl',
      url: 'https://uodo.gov.pl',
      tail: '.',
    },
  },
}

export const LOCALES: Record<Locale, Strings> = { 'en-GB': en, 'pl-PL': pl }

export function stringsFor(locale: Locale | undefined): Strings {
  return LOCALES[locale ?? 'en-GB'] ?? en
}
