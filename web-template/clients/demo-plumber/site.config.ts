import type { SiteConfig } from '@/lib/types'

/**
 * DEMO CONFIG — Vale Street Plumbing & Heating.
 *
 * A fictional Leeds plumber, used to prove the template. Nothing here belongs
 * to a real business:
 *   • The phone number is in Ofcom's 0113 496 0xxx range, reserved for drama
 *     and demos so it can never ring a real person.
 *   • The address is a placeholder, the reviews are written, the photography
 *     is generated.
 *   • demo.enabled is true, so the build is noindex and robots.txt disallows
 *     everything.
 *
 * Copy this file as the starting point for a real client: `pnpm new-site <slug>`.
 */

const config: SiteConfig = {
  slug: 'demo-plumber',

  demo: {
    enabled: true,
    preparedFor: 'Vale Street Plumbing & Heating',
    expiresOn: '2026-10-18',
    note: 'Sample content — photography and reviews are placeholders.',
  },

  business: {
    name: 'Vale Street Plumbing & Heating',
    legalName: 'Vale Street Plumbing & Heating Ltd',
    type: 'Plumber',
    tagline: 'Leeds plumbers you can actually get hold of',
    description:
      'Gas Safe registered plumbers and heating engineers covering Leeds and the surrounding villages. Emergency call-outs, boiler installation, bathrooms and central heating — fixed prices, no call-out charge.',
    foundedYear: 2009,
    wordmark: 'Vale Street',
    tradePlural: 'Plumbers',
    priceRange: '££',
    accreditations: [
      'Gas Safe registered',
      'CIPHE member',
      'Worcester Bosch accredited',
      'Public liability £5m',
    ],
  },

  contact: {
    phone: '0113 496 0142',
    phoneDisplay: '0113 496 0142',
    email: 'hello@valestreetplumbing.co.uk',
    whatsapp: '0113 496 0142',
    emergency: {
      available: true,
      note: 'Burst pipe or no heating? We answer the phone 24 hours a day.',
    },
    address: {
      street: 'Unit 4, Vale Street Works',
      locality: 'Leeds',
      region: 'West Yorkshire',
      postcode: 'LS6 3AA',
      country: 'GB',
    },
    geo: { lat: 53.8206, lng: -1.5813 },
    // The keyless `?output=embed` form works without a Google Cloud project.
    // The Maps Embed API (`/maps/embed/v1/place?key=…`) needs a billable key,
    // which is not worth setting up for a demo — and a placeholder key renders
    // a broken grey box, which is worse than having no map at all.
    mapEmbedUrl: 'https://www.google.com/maps?q=Leeds,+West+Yorkshire&output=embed',
    googleMapsUrl: 'https://maps.google.com/?q=Leeds',
  },

  hours: [
    { days: [1, 2, 3, 4, 5], opens: '07:30', closes: '18:00' },
    { days: [6], opens: '08:00', closes: '14:00' },
    { days: [7], closed: true },
  ],

  brand: {
    hue: 224,
    chroma: 0.13,
    accentHue: 38,
    accentChroma: 0.135,
    neutralChroma: 0.008,
    radius: 0.625,
  },

  hero: {
    eyebrow: 'Gas Safe registered · Leeds & surrounding areas',
    headline: 'Plumbing done properly,',
    headlineAccent: 'first time.',
    sub: 'Emergency call-outs, boiler installations, bathrooms and heating across Leeds. Fixed prices agreed before we start — and a real person on the end of the phone.',
    media: {
      type: 'image',
      src: '/clients/demo-plumber/hero.webp',
      alt: 'Copper pipework detail, warmly lit',
      width: 1920,
      height: 1280,
    },
    ctas: [
      { label: '0113 496 0142', href: 'tel', kind: 'tel' },
      { label: 'Request a quote', href: '/contact', kind: 'secondary' },
    ],
    badges: [
      'No call-out charge',
      'Fixed price before we start',
      '24/7 emergency line',
      '12-month workmanship guarantee',
    ],
  },

  services: [
    {
      slug: 'emergency-plumbing',
      name: 'Emergency plumbing',
      short: 'Burst pipes, leaks and no heating — answered 24 hours a day.',
      icon: 'Siren',
      priceFrom: '£85',
      body: [
        'When a pipe goes at eleven at night, the last thing you need is an answering machine. Our emergency line is picked up by an engineer, not a call centre, and we will tell you honestly how long we are going to be.',
        'We carry the common parts on the van — isolation valves, compression fittings, pump and PRV spares — so most emergency jobs are finished on the first visit rather than made safe and rebooked.',
      ],
      bullets: [
        'Answered 24 hours, 365 days',
        'Typical Leeds arrival within 90 minutes',
        'Made safe first, priced before any repair starts',
        'No premium weekend rate',
      ],
      image: {
        type: 'image',
        src: '/clients/demo-plumber/service-emergency.webp',
        alt: 'Emergency plumbing call-out',
        width: 1200,
        height: 900,
      },
    },
    {
      slug: 'boiler-installation',
      name: 'Boiler installation',
      short: 'New combi and system boilers, fitted in a day, 10-year warranty.',
      icon: 'Flame',
      priceFrom: '£1,850',
      body: [
        'We install Worcester Bosch, Vaillant and Ideal boilers, and we will tell you which one actually suits your house rather than which one carries the best margin. A three-bed terrace in Headingley does not need the biggest combi on the shelf.',
        'Every installation includes a system flush, a magnetic filter, a new filling loop and full registration with Gas Safe and the manufacturer, so your warranty is live before we leave.',
      ],
      bullets: [
        'Up to 10-year manufacturer warranty',
        'Fixed quote after a free survey',
        'System flush and magnetic filter included',
        'Gas Safe building notification handled for you',
      ],
      image: {
        type: 'image',
        src: '/clients/demo-plumber/service-boiler.webp',
        alt: 'Newly installed combi boiler',
        width: 1200,
        height: 900,
      },
    },
    {
      slug: 'boiler-servicing',
      name: 'Servicing & repairs',
      short: 'Annual services, landlord certificates and fault-finding.',
      icon: 'Gauge',
      priceFrom: '£72',
      body: [
        'An annual service keeps the manufacturer warranty valid and catches the cheap failures — a sticking diverter valve, a tired expansion vessel — before they become the expensive ones.',
        'We also issue CP12 landlord gas safety certificates, with reminders sent a month before yours expires so a portfolio never slips out of date.',
      ],
      bullets: [
        'Full 12-point service and flue gas analysis',
        'CP12 landlord certificates',
        'Automatic annual reminders',
        'Most common spares carried on the van',
      ],
    },
    {
      slug: 'bathroom-installation',
      name: 'Bathroom installation',
      short: 'Full bathroom fits, managed end to end by one team.',
      icon: 'Bath',
      priceFrom: '£3,400',
      body: [
        'We handle the whole bathroom — strip-out, first fix, tiling, electrics through our registered electrician, and the finish. One point of contact and one schedule, rather than four trades blaming each other.',
        'You get a written programme before we start, so you know which days you have no bathroom and can plan around it.',
      ],
      bullets: [
        'Design, supply and fit, or fit-only',
        'Written day-by-day programme',
        'Tiling, electrics and plastering included',
        'Site cleaned every evening',
      ],
      image: {
        type: 'image',
        src: '/clients/demo-plumber/service-bathroom.webp',
        alt: 'Completed bathroom installation',
        width: 1200,
        height: 900,
      },
    },
    {
      slug: 'central-heating',
      name: 'Central heating',
      short: 'Radiators, smart controls, power flushing and full systems.',
      icon: 'Thermometer',
      priceFrom: '£140',
      body: [
        'Cold spots at the bottom of a radiator, a system that takes an hour to warm through, rooms that never get there at all — most of it comes down to sludge, balance or controls, and all three are fixable without a new boiler.',
        'We fit smart controls and thermostatic valves, balance the system properly afterwards, and show you the before and after flow temperatures.',
      ],
      bullets: [
        'Power flushing and chemical cleaning',
        'Radiator replacement and relocation',
        'Smart thermostats and zoned controls',
        'System balancing included as standard',
      ],
    },
    {
      slug: 'leak-detection',
      name: 'Leak detection',
      short: 'Finding the leak without taking up the whole floor.',
      icon: 'Droplets',
      priceFrom: '£180',
      body: [
        'Thermal imaging and acoustic tracing find a leak under a floor or behind a wall to within a few centimetres, so the repair means lifting one board rather than a room.',
        'We provide a written report with images, which is what most insurers need before they will settle a trace-and-access claim.',
      ],
      bullets: [
        'Thermal imaging and acoustic tracing',
        'Non-destructive, no guesswork',
        'Insurance-ready written report',
        'Repair quoted on the spot',
      ],
    },
  ],

  areas: [
    {
      slug: 'headingley',
      name: 'Headingley',
      blurb:
        'Victorian terraces and back-to-backs, which means a lot of tired pipework hidden behind later plasterwork. We work in LS6 most weeks.',
      postcodes: ['LS6'],
    },
    {
      slug: 'chapel-allerton',
      name: 'Chapel Allerton',
      blurb:
        'A lot of period property and a lot of extensions. We handle both the original lead-to-copper changeovers and the new zoned heating that comes with a rear extension.',
      postcodes: ['LS7'],
    },
    {
      slug: 'horsforth',
      name: 'Horsforth',
      blurb:
        'Family housing with ageing system boilers reaching the end of their life. Most of our Horsforth work is planned replacements rather than emergencies.',
      postcodes: ['LS18'],
    },
    {
      slug: 'meanwood',
      name: 'Meanwood',
      blurb:
        'Five minutes from the workshop, so Meanwood tends to get the fastest emergency response of anywhere we cover.',
      postcodes: ['LS6', 'LS7'],
    },
    {
      slug: 'roundhay',
      name: 'Roundhay',
      blurb:
        'Larger houses, often with two boilers or an unvented cylinder. We hold the G3 qualification needed to work on unvented systems legally.',
      postcodes: ['LS8'],
    },
    {
      slug: 'kirkstall',
      name: 'Kirkstall',
      blurb:
        'Plenty of rental stock around LS5, so a large share of our Kirkstall work is landlord certificates and between-tenancy repairs.',
      postcodes: ['LS5'],
    },
    {
      slug: 'pudsey',
      name: 'Pudsey',
      blurb:
        'Stone-built properties with solid walls, where pipe runs are usually surface-fixed. We box in properly rather than leaving clipped pipe on show.',
      postcodes: ['LS28'],
    },
    {
      slug: 'otley',
      name: 'Otley',
      blurb:
        'Older properties and a few off-grid oil systems on the edge of town. Worth a call before you assume nobody will come out this far.',
      postcodes: ['LS21'],
    },
  ],

  rating: { value: 4.9, count: 187 },

  reviews: [
    {
      author: 'Rachel M.',
      rating: 5,
      date: '2026-08-02',
      source: 'Google',
      text: 'Came out at 10pm on a Sunday for a burst pipe in the kitchen ceiling. Stopped the water in ten minutes, came back Tuesday to do the repair properly and charged what he said he would. Cannot ask for more than that.',
    },
    {
      author: 'Dan H.',
      rating: 5,
      date: '2026-07-19',
      source: 'Google',
      text: 'Replaced our ancient back boiler with a combi. Two days, dust sheets everywhere, hoovered up after. He talked me out of the bigger boiler I thought I needed, which probably cost him money and definitely earned my repeat business.',
    },
    {
      author: 'Priya S.',
      rating: 5,
      date: '2026-06-28',
      source: 'Checkatrade',
      text: 'Full bathroom refit in Chapel Allerton. Had a written plan of what was happening each day, which made it far less stressful than the last one we had done. Finish is excellent.',
    },
    {
      author: 'Mark T.',
      rating: 5,
      date: '2026-06-11',
      source: 'Google',
      text: 'I manage six rentals and they do all the gas certificates. Reminders come through before they expire so nothing lapses. Invoicing is clear too, which sounds dull but matters when you are doing the books.',
    },
    {
      author: 'Ellie W.',
      rating: 5,
      date: '2026-05-30',
      source: 'Google',
      text: 'Traced a leak under our hall floor with a thermal camera instead of pulling the whole floor up like the previous company wanted to. Lifted two boards, fixed it, done. Insurance accepted the report without any argument.',
    },
    {
      author: 'Joseph A.',
      rating: 4,
      date: '2026-05-02',
      source: 'Google',
      text: 'Good work on the radiators and the balancing made a real difference upstairs. Only reason for four stars is they were running late on the first day, though they did ring to say so.',
    },
  ],

  about: {
    heading: 'Two engineers, one van each, and no call centre',
    body: [
      'Vale Street has been working across Leeds since 2009. It started as one van and a mobile number, and it has stayed deliberately small — the person who quotes your job is the person who turns up to do it.',
      'That is the whole reason the phone gets answered. There is no dispatcher deciding which job is worth the diesel, and no incentive to sell you a boiler you do not need. We would rather service yours for another five years and be the ones you ring when it finally goes.',
      'Everything we do is Gas Safe registered, insured to £5m, and guaranteed for twelve months on workmanship — on top of whatever the manufacturer covers on the parts.',
    ],
    image: {
      type: 'image',
      src: '/clients/demo-plumber/about.webp',
      alt: 'Workshop bench with tools laid out',
      width: 1200,
      height: 1400,
    },
    stats: [
      { value: '17', label: 'Years in Leeds' },
      { value: '4.9', label: 'Average rating' },
      { value: '90 min', label: 'Typical emergency arrival' },
      { value: '12 mth', label: 'Workmanship guarantee' },
    ],
  },

  gallery: [
    {
      src: '/clients/demo-plumber/gallery-1.webp',
      alt: 'Copper pipework in a newly fitted plant cupboard',
      caption: 'Boiler swap, Headingley',
      width: 1200,
      height: 900,
    },
    {
      src: '/clients/demo-plumber/gallery-2.webp',
      alt: 'Completed bathroom with walk-in shower',
      caption: 'Full bathroom, Chapel Allerton',
      width: 1200,
      height: 900,
    },
    {
      src: '/clients/demo-plumber/gallery-3.webp',
      alt: 'Underfloor heating manifold',
      caption: 'Underfloor manifold, Roundhay',
      width: 1200,
      height: 900,
    },
    {
      src: '/clients/demo-plumber/gallery-4.webp',
      alt: 'Column radiator fitted in a period hallway',
      caption: 'Period radiators, Otley',
      width: 1200,
      height: 900,
    },
    {
      src: '/clients/demo-plumber/gallery-5.webp',
      alt: 'Unvented cylinder installation',
      caption: 'Unvented cylinder, Horsforth',
      width: 1200,
      height: 900,
    },
    {
      src: '/clients/demo-plumber/gallery-6.webp',
      alt: 'Smart heating control on a wall',
      caption: 'Zoned smart controls, Pudsey',
      width: 1200,
      height: 900,
    },
  ],

  faqs: [
    {
      q: 'Do you charge a call-out fee?',
      a: 'No. We quote for the job, not for turning up. For emergencies you pay a first-hour rate of £85 which includes the visit, and we tell you the price before we start any repair.',
    },
    {
      q: 'How quickly can you get to an emergency?',
      a: 'Across most of Leeds we are typically with you within 90 minutes, and usually faster in LS5, LS6 and LS7. The line is answered by an engineer 24 hours a day, so you will get a straight answer on timing rather than a promise to call back.',
    },
    {
      q: 'Are you Gas Safe registered?',
      a: 'Yes. Both engineers are Gas Safe registered and carry their cards on every visit — ask to see it, on our jobs or anyone else’s. We also hold the G3 qualification required to work on unvented hot water cylinders.',
    },
    {
      q: 'Do you give fixed prices or work by the hour?',
      a: 'Fixed prices for anything we can survey first — boilers, bathrooms, heating work. Emergency and diagnostic work is hourly for the first hour, then fixed once we know what is wrong.',
    },
    {
      q: 'What guarantee do I get?',
      a: 'Twelve months on our workmanship as standard, on top of the manufacturer warranty on parts. A new Worcester Bosch installed by us carries up to ten years on the boiler itself.',
    },
    {
      q: 'Can you supply a landlord gas safety certificate?',
      a: 'Yes — CP12 certificates are £72 for a single appliance, and we set an automatic reminder a month before it expires so nothing lapses between tenancies.',
    },
    {
      q: 'Do you cover areas outside Leeds?',
      a: 'We regularly work out to Otley, Guiseley and Wetherby. If you are further than that it is still worth ringing, but we will be straight with you if we are not the right people for the job.',
    },
    {
      q: 'How do I pay?',
      a: 'Bank transfer or card on completion. For larger installations we take a deposit for materials and the balance when the job is signed off. We do not ask for money up front on repairs.',
    },
  ],

  copy: {
    servicesTitle: 'Everything from a dripping tap to a *full heating system*',
    servicesIntro:
      'One team across eight areas of Leeds, with the same fixed-price approach whether it is a washer or a whole bathroom.',
    reviewsTitle: 'The reviews do the *selling*',
    areasTitle: 'Covering Leeds and the villages around it',
    galleryTitle: 'Jobs we were happy to photograph',
    galleryIntro:
      'Pipework you will never see again once the boards go back down — which is exactly why it is worth doing neatly.',
    ctaHeading: 'Something leaking, or something planned?',
    ctaSub:
      'Ring for anything urgent and you will get an engineer, not an answering service. For quotes, send us the details and we will come back the same day.',
  },

  social: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
  },

  seo: {
    baseUrl: 'https://vale-street-plumbing.pages.dev',
    title: 'Vale Street Plumbing & Heating | Leeds Plumbers & Gas Engineers',
    description:
      'Gas Safe registered plumbers in Leeds. Emergency call-outs answered 24/7, boiler installation from £1,850, bathrooms and central heating. No call-out charge, fixed prices.',
    ogImage: '/clients/demo-plumber/og.jpg',
  },

  forms: {
    // Left empty on purpose: a demo must not silently swallow enquiries.
    // Set this to a Web3Forms / Formspree endpoint when the client signs.
    endpoint: '',
    successMessage:
      'Thanks — we have got your message and will come back to you within a couple of hours during working time.',
  },
}

export default config
