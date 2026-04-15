import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Colombia 2026 | La Tri al Mundial',
    template: '%s | Colombia 2026',
  },
  description:
    'La plataforma definitiva de la Selección Colombia para el Mundial 2026. Noticias, jugadores, estadísticas y comunidad en un solo lugar.',
  keywords: ['Colombia', 'Mundial 2026', 'Selección Colombia', 'Tricolor', 'Fútbol'],
  openGraph: {
    title: 'Colombia 2026 | La Tri al Mundial',
    description: 'La plataforma definitiva de la Selección Colombia para el Mundial 2026.',
    locale: 'es_CO',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#07090F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
