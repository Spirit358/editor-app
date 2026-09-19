import type { SiteConfig } from '@/lib/types'

/**
 * ACTIVA TECHNIKA GRZEWCZA — Szczecinek. Unsolicited demo, first real lead.
 *
 * What is verified from public listings (KRS/REGON, Panorama Firm, pkt.pl,
 * zimno-cieplo.pl): trading name, legal name and partners, founding year 1991,
 * address, phone, email, opening hours, and the registered activity —
 * "hurtownia i produkcja urządzeń grzewczych" (wholesale and production of
 * heating equipment) plus sanitary equipment. No customer reviews exist
 * online, so none are shown and no rating is emitted.
 *
 * What is INFERRED and must be confirmed at intake, marked [VERIFY] below:
 *   • the installation/service side of the offer — a "technika grzewcza"
 *     firm normally sells AND fits, but the registers only prove the selling
 *   • the specific service list and the areas covered
 *   • geo coordinates (approximate, town centre)
 *   • the gallery captions — the imagery is generated, not their work
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
    enabled: true,
    preparedFor: 'Activa Technika Grzewcza',
    expiresOn: '2026-10-19',
    note: 'Wersja pokazowa — zdjęcia i część treści są przykładowe.',
  },

  business: {
    name: 'Activa Technika Grzewcza',
    legalName: 'Activa Józef Czebotar s.c.',
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
  },

  hours: [
    { days: [1, 2, 3, 4, 5], opens: '07:30', closes: '16:00' },
    { days: [6], opens: '08:00', closes: '13:00' },
    { days: [7], closed: true },
  ],

  // Warm charcoal brand with a flame-amber accent: heat without the cliché
  // of a fire-engine-red heating site. The low brand chroma keeps the dark
  // bands sophisticated; all the colour lives in the accent.
  brand: {
    hue: 32,
    chroma: 0.07,
    accentHue: 52,
    accentChroma: 0.16,
    neutralChroma: 0.01,
    radius: 0.5,
    fonts: 'bricolage-inter',
  },

  hero: {
    eyebrow: 'Technika grzewcza · Szczecinek i powiat szczecinecki',
    headline: 'Ciepło w domu,',
    headlineAccent: 'bez niespodzianek.',
    sub: 'Kotły, pompy ciepła, ogrzewanie podłogowe i instalacje sanitarne — od doboru urządzeń w naszej hurtowni po montaż i serwis. Jedna firma, jeden numer telefonu, od 1991 roku.',
    media: {
      type: 'image',
      src: '/clients/activa/hero.webp',
      alt: 'Nowoczesna kotłownia z miedzianą instalacją w ciepłym świetle',
      width: 1920,
      height: 1280,
    },
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
      image: {
        type: 'image',
        src: '/clients/activa/service-boiler.webp',
        alt: 'Kocioł kondensacyjny w kotłowni',
        width: 1200,
        height: 900,
      },
    },
    {
      slug: 'pompy-ciepla',
      name: 'Pompy ciepła',
      short: 'Powietrzne pompy ciepła do nowych domów i do wymiany starego ogrzewania.',
      icon: 'Thermometer',
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
      image: {
        type: 'image',
        src: '/clients/activa/service-heatpump.webp',
        alt: 'Jednostka zewnętrzna pompy ciepła przy domu jednorodzinnym',
        width: 1200,
        height: 900,
      },
    },
    {
      slug: 'ogrzewanie-podlogowe',
      name: 'Ogrzewanie podłogowe',
      short: 'Wodne ogrzewanie podłogowe — projekt, materiały i wykonanie.',
      icon: 'Layers',
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
      image: {
        type: 'image',
        src: '/clients/activa/service-underfloor.webp',
        alt: 'Rozdzielacz ogrzewania podłogowego z rurami PEX',
        width: 1200,
        height: 900,
      },
    },
    {
      slug: 'instalacje-sanitarne',
      name: 'Instalacje sanitarne',
      short: 'Woda, kanalizacja i ciepła woda użytkowa — w nowych i remontowanych domach.',
      icon: 'Droplets',
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
      name: 'Hurtownia techniki grzewczej',
      short: 'Kotły, grzejniki, armatura i materiały instalacyjne — dla instalatorów i klientów indywidualnych.',
      icon: 'Store',
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
      image: {
        type: 'image',
        src: '/clients/activa/service-warehouse.webp',
        alt: 'Regały hurtowni z urządzeniami grzewczymi',
        width: 1200,
        height: 900,
      },
    },
    {
      slug: 'serwis',
      name: 'Serwis i przeglądy',
      short: 'Przeglądy okresowe, naprawy i modernizacje istniejących instalacji.',
      icon: 'Wrench',
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

  // No reviews exist online for this business. None are invented, and no
  // rating is emitted — the Google Business Profile tidy-up is part of the
  // pitch, not something to fake in the demo.
  reviews: [],

  about: {
    heading: 'Rodzinna firma, która grzeje Szczecinek od 1991 roku',
    body: [
      'Activa zaczęła się w 1991 roku od hurtowni techniki grzewczej przy ulicy Harcerskiej. Przez ponad trzydzieści lat zaopatrywaliśmy instalatorów z całego powiatu — i przez ten czas nauczyliśmy się, które rozwiązania działają, a które tylko ładnie wyglądają w katalogu.',
      'Dziś łączymy sprzedaż z wykonawstwem: dobieramy urządzenia, montujemy je własnym zespołem i serwisujemy po latach. Klient nie musi szukać trzech firm i pilnować, kto za co odpowiada. Odpowiadamy my.',
      'Wciąż jesteśmy firmą rodzinną. Osoba, z którą rozmawiasz przez telefon, zna każde urządzenie na naszych półkach i większość domów w okolicy, w których je zamontowaliśmy.',
    ],
    image: {
      type: 'image',
      src: '/clients/activa/about.webp',
      alt: 'Wnętrze hurtowni techniki grzewczej',
      width: 1200,
      height: 1400,
    },
    stats: [
      { value: '1991', label: 'Rok założenia' },
      { value: '35 lat', label: 'Na rynku' },
      { value: '8', label: 'Obsługiwanych gmin' },
      { value: '6 dni', label: 'W tygodniu otwarte' },
    ],
  },

  // [VERIFY] Placeholder imagery with sample captions. Replace with the
  // client's own photographs before anything goes live.
  gallery: [
    {
      src: '/clients/activa/gallery-1.webp',
      alt: 'Nowoczesna kotłownia gazowa',
      caption: 'Kotłownia gazowa, Szczecinek',
      width: 1200,
      height: 900,
    },
    {
      src: '/clients/activa/gallery-2.webp',
      alt: 'Jednostka zewnętrzna pompy ciepła',
      caption: 'Pompa ciepła, Borne Sulinowo',
      width: 1200,
      height: 900,
    },
    {
      src: '/clients/activa/gallery-3.webp',
      alt: 'Pętle ogrzewania podłogowego przed wylewką',
      caption: 'Ogrzewanie podłogowe, Barwice',
      width: 1200,
      height: 900,
    },
    {
      src: '/clients/activa/gallery-4.webp',
      alt: 'Rozdzielacz ogrzewania podłogowego',
      caption: 'Rozdzielacz, Czaplinek',
      width: 1200,
      height: 900,
    },
    {
      src: '/clients/activa/gallery-5.webp',
      alt: 'Zasobnik ciepłej wody użytkowej',
      caption: 'Zasobnik c.w.u., Grzmiąca',
      width: 1200,
      height: 900,
    },
    {
      src: '/clients/activa/gallery-6.webp',
      alt: 'Grzejnik dekoracyjny w salonie',
      caption: 'Grzejniki dekoracyjne, Biały Bór',
      width: 1200,
      height: 900,
    },
  ],

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
    servicesTitle: 'Od hurtowni po *gotową instalację*',
    servicesIntro:
      'Sprzedajemy urządzenia, projektujemy instalacje i montujemy je własnym zespołem — więc za każdy etap odpowiada jedna firma.',
    areasTitle: 'Szczecinek i cały powiat',
    areasIntro:
      'Każda miejscowość ma własną podstronę. Jeśli Twojej nie ma na liście — zadzwoń, prawdopodobnie i tak dojeżdżamy.',
    galleryTitle: 'Kilka *ostatnich* realizacji',
    galleryIntro:
      'Kotłownie, rozdzielacze i instalacje, których zwykle nikt nie ogląda — dlatego robimy je tak, żeby można było pokazać.',
    faqTitle: 'Konkretne *odpowiedzi*',
    ctaHeading: 'Planujesz wymianę ogrzewania?',
    ctaSub:
      'Zadzwoń lub napisz — powiemy, co ma sens w Twoim domu, zanim cokolwiek zaproponujemy.',
  },

  seo: {
    baseUrl: 'https://activa-szczecinek.pages.dev',
    title: 'Activa Technika Grzewcza | Kotły, pompy ciepła, instalacje — Szczecinek',
    description:
      'Technika grzewcza w Szczecinku od 1991 roku. Hurtownia, montaż i serwis: kotły gazowe, pompy ciepła, ogrzewanie podłogowe, instalacje sanitarne. ul. Harcerska 2, tel. 94 374 11 32.',
    ogImage: '/clients/activa/og.jpg',
  },

  forms: {
    // Empty on purpose until the client signs — see DECISIONS.md.
    endpoint: '',
    successMessage:
      'Dziękujemy — odezwiemy się w godzinach pracy, zwykle tego samego dnia.',
  },
}

export default config
