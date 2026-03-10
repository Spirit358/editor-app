import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EDITOR — AI Fashion Director',
  description: 'Design your perfect fit. AI-powered outfit creation across every price point.',
  keywords: ['fashion', 'AI', 'outfit', 'style', 'editorial'],
  openGraph: {
    title: 'EDITOR',
    description: 'AI Fashion Director',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="noise">
      <body>{children}</body>
    </html>
  )
}
