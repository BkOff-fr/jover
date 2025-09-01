import type { Metadata } from 'next'
import { Pathway_Extreme } from 'next/font/google'
import './globals.css'
import { AppProvider } from '../context/AppContext';
import CustomCursor from '@/components/client/CustomCursor'
import GlobalBackground from '@/components/client/GlobalBackground'
import SmoothScrolling from '@/components/SmoothScrolling'
import ThemeInitializer from '@/components/client/ThemeInitializer';

const pathwayExtreme = Pathway_Extreme({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-pathway-extreme'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://jover.agency'),
  title: 'Jover - Photographe Professionnel',
  description: 'Portfolio de Jover, photographe professionnel spécialisé en portraits et photographie d\'entreprise. Découvrez mes créations et contactez-moi pour vos projets.',
  keywords: 'photographe, professionnel, portrait, entreprise, Jover, photographie, studio',
  authors: [{ name: 'Jover' }],
  creator: 'Jover',
  publisher: 'Jover Photography',
  openGraph: {
    title: 'Jover - Portfolio Photographe Professionnel',
    description: 'Découvrez le portfolio de Jover, photographe professionnel spécialisé en portraits et photographie d\'entreprise.',
    url: 'https://jover.agency',
    siteName: 'Jover Photography',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Portfolio Jover - Photographe Professionnel',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jover - Portfolio Photographe',
    description: 'Photographe professionnel spécialisé en portraits et photographie d\'entreprise.',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Jover',
              jobTitle: 'Photographe Professionnel',
              url: 'https://jover.agency',
              sameAs: [
                'https://instagram.com/jover',
                'https://linkedin.com/in/jover'
              ],
              knowsAbout: [
                'Photographie',
                'Portrait',
                'Photographie d\'entreprise',
                'Studio photo'
              ],
              workLocation: {
                '@type': 'Place',
                name: 'France'
              }
            })
          }}
        />
      </head>
      <body className={pathwayExtreme.className} suppressHydrationWarning={true}>
        <ThemeInitializer />
        <AppProvider>
          {/* Les contextes sont déjà imbriqués dans AppProvider */}
          <GlobalBackground />
          <CustomCursor />
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </AppProvider>
      </body>
    </html>
  )
}