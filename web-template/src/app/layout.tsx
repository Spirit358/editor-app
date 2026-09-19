import type { Metadata, Viewport } from 'next'
import { fontClassNames } from '@/config/fonts'
import { site, t, locale, phoneDisplay, phoneHref, isDemo, hasGallery, hasReviews, primaryHours } from '@/lib/site'
import { buildMetadata, localBusinessSchema } from '@/lib/seo'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MobileCallBar } from '@/components/layout/mobile-call-bar'
import { DemoBanner } from '@/components/layout/demo-banner'
import { Chat } from '@/components/chat/chat'
import { JsonLd } from '@/components/json-ld'
import './globals.css'

export const metadata: Metadata = buildMetadata()

export const viewport: Viewport = {
  themeColor: '#fbfaf8',
  colorScheme: 'light',
}

const NAV = [
  { label: t.nav.services, href: '/services' },
  { label: t.nav.areas, href: '/areas' },
  { label: t.nav.about, href: '/about' },
  ...(hasGallery ? [{ label: t.crumbs.ourWork, href: '/gallery' }] : []),
  ...(hasReviews ? [{ label: t.nav.reviews, href: '/#reviews' }] : []),
  { label: t.nav.contact, href: '/contact' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { brand, contact } = site

  const expiry = site.demo.expiresOn
    ? new Date(site.demo.expiresOn).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const addressLine = [
    !contact.address.hideStreet && contact.address.street,
    [contact.address.postcode, contact.address.locality].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <html
      lang={locale}
      className={fontClassNames}
      // The palette hangs off these numbers; inline so they beat the
      // stylesheet defaults without an !important anywhere.
      style={
        {
          '--brand-h': brand.hue,
          '--brand-c': brand.chroma ?? 0.15,
          '--accent-h': brand.accentHue ?? brand.hue,
          '--accent-c': brand.accentChroma ?? 0.17,
          '--neutral-c': brand.neutralChroma ?? 0.006,
          '--radius': `${brand.radius ?? 0.125}rem`,
        } as React.CSSProperties
      }
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:bg-ink focus:px-4 focus:py-2.5 focus:text-paper"
        >
          {t.skipToContent}
        </a>

        {isDemo && (
          <DemoBanner
            headline={t.demo.preparedFor(site.demo.preparedFor ?? site.business.name)}
            note={site.demo.note}
            expiry={expiry ? t.demo.privateLink(expiry) : undefined}
          />
        )}

        <Header
          businessName={site.business.name}
          wordmark={site.business.wordmark}
          phoneHref={phoneHref}
          phoneDisplay={phoneDisplay}
          addressLine={addressLine}
          hoursLine={primaryHours}
          email={contact.email}
          nav={NAV}
          labels={{
            call: t.call,
            quote: t.requestQuote,
            openMenu: t.openMenu,
            closeMenu: t.closeMenu,
            mainNav: t.mainNav,
            mobileNav: t.mobileNav,
            home: t.crumbs.home,
          }}
        />

        <main id="main">{children}</main>

        <Footer />

        <MobileCallBar phoneHref={phoneHref} phoneDisplay={phoneDisplay} labels={{ callNow: t.callNow }} />

        <Chat />

        <JsonLd data={localBusinessSchema()} />
      </body>
    </html>
  )
}
