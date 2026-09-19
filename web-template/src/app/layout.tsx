import type { Metadata, Viewport } from 'next'
import { fontClassNames } from '@/config/fonts'
import { site, phoneDisplay, isDemo } from '@/lib/site'
import { buildMetadata, localBusinessSchema } from '@/lib/seo'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MobileCallBar } from '@/components/layout/mobile-call-bar'
import { DemoBanner } from '@/components/layout/demo-banner'
import { JsonLd } from '@/components/json-ld'
import './globals.css'

export const metadata: Metadata = buildMetadata()

export const viewport: Viewport = {
  themeColor: '#101827',
  colorScheme: 'light',
}

const NAV = [
  { label: 'Services', href: '/services' },
  { label: 'Areas', href: '/areas' },
  { label: 'About', href: '/about' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Contact', href: '/contact' },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { brand } = site

  return (
    <html
      lang="en-GB"
      className={fontClassNames}
      // The entire palette hangs off these four numbers. Inline so they beat
      // the stylesheet's defaults without an !important anywhere.
      style={
        {
          '--brand-h': brand.hue,
          '--brand-c': brand.chroma ?? 0.13,
          '--accent-h': brand.accentHue ?? brand.hue,
          '--accent-c': brand.accentChroma ?? 0.13,
          '--neutral-c': brand.neutralChroma ?? 0.008,
          '--radius': `${brand.radius ?? 0.5}rem`,
        } as React.CSSProperties
      }
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-[var(--radius-sm)] focus:bg-brand-950 focus:px-4 focus:py-2.5 focus:text-brand-50"
        >
          Skip to content
        </a>

        {isDemo && (
          <DemoBanner
            preparedFor={site.demo.preparedFor ?? site.business.name}
            expiresOn={site.demo.expiresOn}
            note={site.demo.note}
          />
        )}

        <Header
          businessName={site.business.name}
          wordmark={site.business.wordmark}
          phone={site.contact.phone}
          phoneDisplay={phoneDisplay}
          variant="overlay"
          nav={NAV}
        />

        <main id="main">{children}</main>

        <Footer />

        <MobileCallBar
          phone={site.contact.phone}
          phoneDisplay={phoneDisplay}
          whatsapp={site.contact.whatsapp}
        />

        <JsonLd data={localBusinessSchema()} />
      </body>
    </html>
  )
}
