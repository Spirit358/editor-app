import type { SiteConfig } from '@/lib/types'

/**
 * ACTIVA TECHNIKA GRZEWCZA — Szczecinek. Unsolicited demo, first real lead.
 *
 * What is verified from public listings (KRS/REGON, Panorama Firm, pkt.pl,
 * zimno-cieplo.pl) and their Google Business Profile: trading name, legal
 * name and partners, founding year 1991, address, phone, email, opening
 * hours, the registered activity — "hurtownia i produkcja urządzeń
 * grzewczych" plus sanitary equipment — and the exterior signage reading
 * "HURTOWNIA MATERIAŁÓW INSTALACYJNYCH". Google lists them as an
 * "HVAC contractor" with 4.2★ from 32 reviews. Their logo is a mid-blue
 * wordmark with a double-stroke mark; the palette below follows it.
 *
 * The 4.2★ is shown as a linked proof point only. The review TEXTS are not
 * public data we hold, so `reviews` stays empty and no rating schema is
 * emitted — transcribe the best ones with the owner at intake to unlock it.
 *
 * What is INFERRED and must be confirmed at intake, marked [VERIFY] below:
 *   • the installation/service side of the offer — supported by the
 *     "HVAC contractor" category, but the registers only prove the selling
 *   • the specific service list and the areas covered
 *   • geo coordinates (approximate, town centre)
 *   • the gallery captions — the imagery is generated, not their work
 *   • the logo file itself — the text wordmark is a stand-in
 *
 * GBP tidy-up to pitch alongside the site: no opening hours listed, the lead
 * photo shows a hostel's banner on the shared building, and the profile has
 * no website to link to.
 *
 * No prices are quoted anywhere. Putting numbers in a real company's mouth
 * before speaking to them is how a warm lead becomes a cold one.
 *
 * Their current domain, activa-szczecinek.pl, serves an unconfigured default
 * WordPress theme. That is the pitch.
 */

const config: SiteConfig = {
  slug: 'activa',
  locale: 'pl-PL',

  demo: {
    // Activa agreed to the site going live on their own domain.
    enabled: false,
    preparedFor: 'Activa Technika Grzewcza',
    expiresOn: '2026-10-19',
    note: 'Wersja pokazowa — zdjęcia i część treści są przykładowe.',
  },

  business: {
    name: 'Activa Technika Grzewcza',
    legalName: 'Activa Sp. z o.o.',
    type: 'HVACBusiness',
    tagline: 'Technika grzewcza w Szczecinku od 1991 roku',
    description:
      'Hurtownia i wykonawstwo instalacji grzewczych w Szczecinku. Kotły, pompy ciepła, ogrzewanie podłogowe i instalacje sanitarne — od doboru urządzeń po montaż i serwis. Firma rodzinna działająca od 1991 roku.',
    foundedYear: 1991,
    wordmark: 'Activa',
    tradePlural: 'Instalacje grzewcze',
    accreditations: [
      'Na rynku od 1991 roku',
      'Firma rodzinna ze Szczecinka',
      'Hurtownia i wykonawstwo w jednym miejscu', // [VERIFY] installation side
    ],
  },

  contact: {
    phone: '94 374 11 32',
    phoneDisplay: '94 374 11 32',
    email: 'info@activa-szczecinek.pl',
    // No emergency line is advertised anywhere; do not invent one.
    emergency: { available: false },
    address: {
      street: 'ul. Harcerska 2',
      locality: 'Szczecinek',
      region: 'zachodniopomorskie',
      postcode: '78-400',
      country: 'PL',
    },
    geo: { lat: 53.7086, lng: 16.6994 }, // [VERIFY] approximate
    mapEmbedUrl:
      'https://www.google.com/maps?q=Harcerska+2,+78-400+Szczecinek&output=embed',
    googleMapsUrl: 'https://maps.google.com/?q=Activa+Harcerska+2+Szczecinek',
    // The "Ask for reviews" share link from the Business Profile
    // (https://g.page/r/<code>/review). Set it and the footer shows
    // "Oceń nas w Google"; the same link goes on the NFC cards.
    // googleReviewUrl: '',
  },

  hours: [
    { days: [1, 2, 3, 4, 5], opens: '07:30', closes: '16:00' },
    { days: [6], opens: '08:00', closes: '13:00' },
    { days: [7], closed: true },
  ],

  // Their signage and logo are a clear mid-blue; the brand ramp follows it so
  // the owner sees their own company, not a designer's preference. The hot
  // amber accent is the complementary — it carries the "heat" cue and gives
  // the calls-to-action maximum contrast against the blue.
  brand: {
    hue: 248,
    chroma: 0.15,
    accentHue: 55,
    accentChroma: 0.17,
    neutralChroma: 0.006,
    radius: 0.125,
    fonts: 'archivo',
  },

  hero: {
    eyebrow: 'Technika grzewcza · Szczecinek i powiat szczecinecki',
    headline: 'Kotły, pompy ciepła i instalacje.',
    headlineAccent: 'Hurtownia i montaż od 1991 roku.',
    sub: 'Dobieramy urządzenia w naszej hurtowni przy Harcerskiej 2, montujemy własnym zespołem i serwisujemy po latach. Jedna firma, jeden numer telefonu.',
    // Drawn until `pnpm imagery --slug activa` has run; then set `media`.
    illustration: 'boiler',
    ctas: [
      { label: '94 374 11 32', href: 'tel', kind: 'tel' },
      { label: 'Poproś o wycenę', href: '/contact', kind: 'secondary' },
    ],
    badges: [
      'Hurtownia i montaż w jednym miejscu',
      'Doradztwo przy doborze urządzeń',
      'Serwis i przeglądy po montażu',
      'Firma rodzinna od 1991 roku',
    ],
  },

  services: [
    {
      slug: 'kotly-gazowe',
      name: 'Kotły gazowe',
      short: 'Dobór, sprzedaż i montaż kotłów kondensacyjnych do domów i firm.',
      icon: 'Flame',
      illustration: 'boiler',
      ctaHeading: 'Czas na nowy kocioł?',
      body: [
        'Kocioł kondensacyjny to dziś podstawa oszczędnego ogrzewania gazowego, ale źle dobrany — za duży, za mały, bez właściwej automatyki — nie da tego, co obiecuje katalog. Zaczynamy od domu, nie od modelu: powierzchnia, ocieplenie, liczba łazienek, sposób przygotowania ciepłej wody.',
        'Ponieważ prowadzimy własną hurtownię, urządzenie, osprzęt i materiały montażowe pochodzą z jednego miejsca, a za całość odpowiada jeden zespół. Po montażu zostajemy — przeglądy i serwis to nasza codzienna praca.',
      ],
      bullets: [
        'Dobór mocy do konkretnego budynku',
        'Kotły jedno- i dwufunkcyjne, z zasobnikiem lub bez',
        'Automatyka pogodowa i sterowanie strefowe',
        'Montaż, uruchomienie i przeglądy gwarancyjne', // [VERIFY]
      ],
    },
    {
      slug: 'pompy-ciepla',
      name: 'Pompy ciepła',
      short: 'Powietrzne pompy ciepła do nowych domów i do wymiany starego ogrzewania.',
      icon: 'Thermometer',
      illustration: 'heatpump',
      ctaHeading: 'Zastanawiasz się nad pompą ciepła?',
      body: [
        'Pompa ciepła ma sens wtedy, gdy jest dobrana do budynku i instalacji, która już w nim jest. W ocieplonym domu z podłogówką pracuje świetnie; w starym budynku z małymi grzejnikami potrzebuje przemyślenia — i to mówimy uczciwie, zanim cokolwiek policzymy.',
        'Pomagamy przejść przez cały proces: dobór mocy, wybór urządzenia, przygotowanie instalacji, montaż i uruchomienie. Podpowiemy też, jakie dokumenty warto mieć przy ubieganiu się o dofinansowanie.',
      ],
      bullets: [
        'Analiza budynku i istniejącej instalacji',
        'Pompy powietrze–woda typu split i monoblok',
        'Współpraca z ogrzewaniem podłogowym i grzejnikami',
        'Wskazówki dotyczące dofinansowań', // [VERIFY]
      ],
    },
    {
      slug: 'ogrzewanie-podlogowe',
      name: 'Ogrzewanie podłogowe',
      short: 'Wodne ogrzewanie podłogowe — projekt, materiały i wykonanie.',
      icon: 'Layers',
      illustration: 'underfloor',
      ctaHeading: 'Planujesz podłogówkę?',
      body: [
        'Podłogówka to najbardziej komfortowy i najtańszy w eksploatacji sposób ogrzewania niskotemperaturowego — pod warunkiem, że pętle są rozłożone z głową, a rozdzielacz jest prawidłowo zrównoważony. Tu nie ma miejsca na poprawki po wylaniu posadzki.',
        'Wykonujemy pełen zakres: rozkład pętli pod konkretne pomieszczenia, materiały z własnej hurtowni, montaż, próba ciśnieniowa i uruchomienie razem ze źródłem ciepła.',
      ],
      bullets: [
        'Rozkład pętli dopasowany do pomieszczeń',
        'Rozdzielacze z regulacją przepływu',
        'Próba ciśnieniowa przed wylewką',
        'Sterowanie strefowe pokój po pokoju',
      ],
    },
    {
      slug: 'instalacje-sanitarne',
      name: 'Instalacje sanitarne',
      short: 'Woda, kanalizacja i ciepła woda użytkowa — w nowych i remontowanych domach.',
      icon: 'Droplets',
      illustration: 'cylinder',
      body: [
        'Instalacja wodno-kanalizacyjna to część domu, której nikt nie ogląda, dopóki coś nie pójdzie nie tak. Dlatego wykonujemy ją tak, żeby nie trzeba było do niej wracać: starannie prowadzone trasy, sprawdzone materiały, próba szczelności przed zabudową.',
        'Zajmujemy się zarówno nowymi instalacjami, jak i wymianą starych — w tym przygotowaniem ciepłej wody użytkowej z zasobnikiem lub podgrzewaczem dobranym do liczby domowników.',
      ],
      bullets: [
        'Instalacje wodne i kanalizacyjne od podstaw',
        'Wymiana starych instalacji w remontowanych domach',
        'Zasobniki i podgrzewacze c.w.u.',
        'Próba szczelności przed zabudową',
      ],
    },
    {
      slug: 'hurtownia',
      // Their own wording, from the sign on the building.
      name: 'Hurtownia materiałów instalacyjnych',
      short: 'Kotły, grzejniki, armatura i materiały instalacyjne — dla instalatorów i klientów indywidualnych.',
      icon: 'Store',
      illustration: 'warehouse',
      ctaHeading: 'Potrzebujesz materiałów na instalację?',
      body: [
        'Hurtownia przy ul. Harcerskiej 2 to serce firmy od 1991 roku. Zaopatrujemy instalatorów z całego powiatu i doradzamy klientom indywidualnym, którzy wolą kupić raz i dobrze niż dwa razy tanio.',
        'Na miejscu znajdziesz urządzenia grzewcze, grzejniki, armaturę, rury i osprzęt. Czego nie ma na półce — sprowadzimy, zwykle w kilka dni.',
      ],
      bullets: [
        'Urządzenia grzewcze i sanitarne od czołowych producentów',
        'Grzejniki, armatura, rury i osprzęt',
        'Doradztwo techniczne przy ladzie',
        'Otwarte sześć dni w tygodniu',
      ],
    },
    {
      slug: 'serwis',
      name: 'Serwis i przeglądy',
      short: 'Przeglądy okresowe, naprawy i modernizacje istniejących instalacji.',
      icon: 'Wrench',
      illustration: 'radiator',
      ctaHeading: 'Czas na przegląd?',
      body: [
        'Coroczny przegląd kotła to nie formalność dla gwarancji — to moment, w którym wychwytuje się tanie usterki, zanim staną się drogimi awariami. Sprawdzamy spalanie, zabezpieczenia, naczynie wzbiorcze i to, czy instalacja jest prawidłowo odpowietrzona.',
        'Serwisujemy również instalacje, których nie montowaliśmy. Jeśli coś się da naprawić rozsądnym kosztem — naprawiamy; jeśli nie — mówimy wprost.',
      ],
      bullets: [
        'Przeglądy okresowe kotłów i pomp ciepła',
        'Diagnostyka i naprawy',
        'Modernizacja starszych instalacji',
        'Serwis urządzeń montowanych przez inne firmy',
      ],
    },
  ],

  // [VERIFY] the areas actually served. Powiat szczecinecki plus the
  // neighbouring towns a Szczecinek-based firm would realistically cover.
  areas: [
    {
      slug: 'szczecinek',
      name: 'Szczecinek',
      blurb:
        'Nasza siedziba i hurtownia. Najkrótszy czas dojazdu, największa liczba realizacji — od kamienic w centrum po nowe osiedla domów jednorodzinnych.',
      postcodes: ['78-400'],
    },
    {
      slug: 'barwice',
      name: 'Barwice',
      blurb:
        'Domy jednorodzinne i gospodarstwa, w których często wymienia się stare kotły na paliwo stałe na kondensację lub pompę ciepła.',
      postcodes: ['78-460'],
    },
    {
      slug: 'bialy-bor',
      name: 'Biały Bór',
      blurb:
        'Sporo budynków z lat 70. i 80. — tu najczęściej łączymy wymianę źródła ciepła z modernizacją całej instalacji.',
      postcodes: ['78-425'],
    },
    {
      slug: 'borne-sulinowo',
      name: 'Borne Sulinowo',
      blurb:
        'Nowe domy i odnawiane budynki po dawnym garnizonie. Dużo instalacji od podstaw: podłogówka, pompy ciepła, c.w.u.',
      postcodes: ['78-449'],
    },
    {
      slug: 'grzmiaca',
      name: 'Grzmiąca',
      blurb:
        'Gmina wiejska, gdzie liczy się solidna instalacja i serwis, który przyjeżdża, kiedy trzeba.',
      postcodes: ['78-450'],
    },
    {
      slug: 'czaplinek',
      name: 'Czaplinek',
      blurb:
        'Pensjonaty i domy nad jeziorem Drawsko — instalacje, które muszą wytrzymać sezon bez awarii.',
      postcodes: ['78-550'],
    },
    {
      slug: 'bobolice',
      name: 'Bobolice',
      blurb:
        'Regularnie dojeżdżamy na przeglądy i montaże. Warto zadzwonić, zanim założysz, że jesteśmy za daleko.',
      postcodes: ['76-020'],
    },
    {
      slug: 'polczyn-zdroj',
      name: 'Połczyn-Zdrój',
      blurb:
        'Obiekty uzdrowiskowe i domy prywatne. Większe instalacje planujemy z wyprzedzeniem, serwis działa na bieżąco.',
      postcodes: ['78-320'],
    },
  ],

  // 32 Google reviews at 4.2★ exist, but their texts are not ours to
  // reproduce without the owner. Shown as a linked proof point in the hero;
  // no review texts, no rating schema, until they are transcribed at intake.
  reviews: [],
  googleRating: {
    value: 4.2,
    count: 32,
    url: 'https://www.google.com/search?q=Activa+Technika+grzewcza+Szczecinek',
  },

  // The one solid block on the homepage: the wholesale counter, which is
  // what the sign on the building says and what the registers prove.
  spotlight: {
    eyebrow: 'Hurtownia · ul. Harcerska 2',
    title: 'Hurtownia materiałów instalacyjnych',
    body: [
      'Serce firmy od 1991 roku. Zaopatrujemy instalatorów z całego powiatu i doradzamy klientom indywidualnym, którzy wolą kupić raz i dobrze.',
      'Kotły, grzejniki, armatura, rury i osprzęt na miejscu. Czego nie ma na półce — sprowadzamy, zwykle w kilka dni.',
    ],
    bullets: [
      'Pon–Pt 7:30–16:00, Sob 8:00–13:00',
      'Dla instalatorów i klientów indywidualnych',
      'Doradztwo techniczne przy ladzie',
      'Urządzenia od czołowych producentów',
    ],
    illustration: 'warehouse',
    cta: { label: 'Zobacz ofertę hurtowni', href: '/services/hurtownia' },
  },

  process: [
    {
      title: 'Telefon lub wiadomość',
      body: 'Opisz, co się dzieje albo co planujesz. Rozmawiasz z człowiekiem, który zna urządzenia z naszych półek, i od razu słyszysz, czy to zlecenie dla nas.',
    },
    {
      title: 'Oględziny i wycena',
      body: 'Przy kotle, pompie ciepła czy podłogówce najpierw oglądamy budynek. Oferta wymienia konkretne urządzenia i zakres prac.',
    },
    {
      title: 'Materiały i montaż',
      body: 'Urządzenia i materiały z własnej hurtowni, montaż własnym zespołem, próba ciśnieniowa przed zabudową.',
    },
    {
      title: 'Uruchomienie i serwis',
      body: 'Uruchomienie, dokumentacja, a potem przeglądy — również urządzeń, których nie montowaliśmy.',
    },
  ],

  about: {
    heading: 'Rodzinna firma, która grzeje Szczecinek od 1991 roku',
    body: [
      'Activa zaczęła się w 1991 roku od hurtowni techniki grzewczej przy ulicy Harcerskiej. Przez ponad trzydzieści lat zaopatrywaliśmy instalatorów z całego powiatu — i przez ten czas nauczyliśmy się, które rozwiązania działają, a które tylko ładnie wyglądają w katalogu.',
      'Dziś łączymy sprzedaż z wykonawstwem: dobieramy urządzenia, montujemy je własnym zespołem i serwisujemy po latach. Klient nie musi szukać trzech firm i pilnować, kto za co odpowiada. Odpowiadamy my.',
      'Wciąż jesteśmy firmą rodzinną. Osoba, z którą rozmawiasz przez telefon, zna każde urządzenie na naszych półkach i większość domów w okolicy, w których je zamontowaliśmy.',
    ],
    // No image: the founding year is set as a large numeral instead. Add a
    // real photograph of the counter or the team here when it exists.
    stats: [
      { value: '1991', label: 'Rok założenia' },
      { value: '35 lat', label: 'Na rynku' },
      { value: '8', label: 'Obsługiwanych gmin' },
      { value: '6 dni', label: 'W tygodniu otwarte' },
    ],
  },

  // Empty until real photographs exist — a gallery of placeholders is worse
  // than no gallery. The section, the nav item and the sitemap entry all
  // hide themselves. After `pnpm imagery --slug activa`, list the generated
  // gallery-1…6 here with captions.
  gallery: [],

  faqs: [
    {
      q: 'Zajmujecie się tylko sprzedażą, czy również montażem?',
      a: 'Jednym i drugim. Hurtownia działa od 1991 roku, a montaż i serwis wykonujemy własnym zespołem — dzięki temu za dobór urządzenia, instalację i późniejsze przeglądy odpowiada jedna firma.',
    },
    {
      q: 'Jak wygląda wycena?',
      a: 'Przy większych pracach — kocioł, pompa ciepła, podłogówka — najpierw oglądamy budynek, bo bez tego każda liczba jest zgadywaniem. Po oględzinach dostajesz konkretną ofertę z zakresem prac i urządzeń. Oględziny nie zobowiązują do niczego.',
    },
    {
      q: 'Czy pompa ciepła sprawdzi się w starszym domu?',
      a: 'Często tak, ale nie zawsze bez zmian w instalacji. Kluczowe jest ocieplenie budynku i to, czy grzejniki lub podłogówka są w stanie oddać ciepło przy niższej temperaturze. Ocenimy to uczciwie na miejscu — jeśli lepszym wyborem będzie kocioł kondensacyjny, powiemy to wprost.',
    },
    {
      q: 'Serwisujecie urządzenia, których nie montowaliście?',
      a: 'Tak. Przeglądy okresowe i naprawy wykonujemy również w instalacjach zrobionych przez inne firmy.',
    },
    {
      q: 'Czy mogę kupić same materiały, bez montażu?',
      a: 'Oczywiście. Hurtownia przy ul. Harcerskiej 2 obsługuje zarówno instalatorów, jak i klientów indywidualnych. Doradzimy przy doborze, a czego nie ma na miejscu — sprowadzimy.',
    },
    {
      q: 'W jakich godzinach jesteście otwarci?',
      a: 'Od poniedziałku do piątku w godzinach 7:30–16:00 oraz w soboty 8:00–13:00. W niedziele hurtownia jest nieczynna.',
    },
    {
      q: 'Dokąd dojeżdżacie?',
      a: 'Szczecinek i cały powiat szczecinecki, a także sąsiednie gminy — Czaplinek, Bobolice, Połczyn-Zdrój. Jeśli jesteś dalej, zadzwoń: przy większych realizacjach dojazd rzadko bywa problemem.',
    },
  ],

  copy: {
    servicesEyebrow: 'Oferta',
    servicesTitle: 'Od hurtowni po gotową instalację',
    servicesIntro:
      'Sprzedajemy urządzenia, projektujemy instalacje i montujemy je własnym zespołem. Za każdy etap odpowiada jedna firma.',
    areasTitle: 'Szczecinek i cały powiat',
    areasIntro: 'Każda miejscowość ma własną podstronę. Jeśli Twojej nie ma na liście, zadzwoń — prawdopodobnie i tak dojeżdżamy.',
    galleryTitle: 'Ostatnie realizacje',
    galleryIntro: 'Kotłownie, rozdzielacze i instalacje, których zwykle nikt nie ogląda.',
    faqTitle: 'Pytania, które słyszymy najczęściej',
    ctaHeading: 'Planujesz wymianę ogrzewania?',
    ctaSub: 'Zadzwoń lub napisz. Powiemy, co ma sens w Twoim domu, zanim cokolwiek zaproponujemy.',
  },

  seo: {
    baseUrl: 'https://activa-szczecinek.pl',
    title: 'Activa Technika Grzewcza | Kotły, pompy ciepła, instalacje — Szczecinek',
    description:
      'Technika grzewcza w Szczecinku od 1991 roku. Hurtownia, montaż i serwis: kotły gazowe, pompy ciepła, ogrzewanie podłogowe, instalacje sanitarne. ul. Harcerska 2, tel. 94 374 11 32.',
    ogImage: '/clients/activa/og.jpg',
    // Search Console (HTML tag → content) and Bing Webmaster (msvalidate.01).
    // verification: { google: '', bing: '', googleFile: 'google….html' },
    indexNowKey: '175680e2505fefdaf26333d19d987b54',
  },

  chatbot: {
    enabled: true,
    // Generated beside the site by `pnpm deploy-ftp`; the key never enters
    // the repo. Empty this to keep the widget but drop the model.
    endpoint: '/chat.php',
    notes: [
      'Dostępność towaru na magazynie i płatności ustala się telefonicznie lub na miejscu w hurtowni.',
      'Wyceny montażu robimy po oględzinach budynku — oględziny nie zobowiązują.',
    ],
    maxTurns: 8,
  },

  forms: {
    // Their own hosting runs PHP, so the form posts to a handler deployed
    // beside the site and mailed straight to the address below. No
    // third-party form service, nothing leaves their server. Generated by
    // `pnpm deploy-ftp` — see DECISIONS.md.
    endpoint: '/form.php',
    successMessage:
      'Dziękujemy — odezwiemy się w godzinach pracy, zwykle tego samego dnia.',
  },
}

export default config
