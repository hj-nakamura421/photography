import type { Metadata } from 'next';
import './globals.css';

const canonical = 'https://hj-nakamura421.github.io/photography/';
const description = 'Photography by Hinata Justin Nakamura, working across street, landscape and documentary photography in London, Edinburgh and Tokyo.';

export const metadata: Metadata = {
  metadataBase: new URL(canonical),
  title: 'Hinata Justin Nakamura',
  description,
  keywords: ['Hinata Justin Nakamura', 'photographer', 'street photography', 'landscape photography', 'documentary photography', 'London', 'Edinburgh', 'Tokyo'],
  authors: [{ name: 'Hinata Justin Nakamura', url: canonical }],
  creator: 'Hinata Justin Nakamura',
  other: { copyright: '© 2026 Hinata Justin Nakamura. All rights reserved.' },
  alternates: { canonical },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: { icon: '/photography/favicon.svg' },
  openGraph: {
    type: 'website',
    url: canonical,
    siteName: 'Hinata Justin Nakamura',
    title: 'Hinata Justin Nakamura',
    description,
    images: [{ url: 'https://hj-nakamura421.github.io/photography/og.png', width: 1536, height: 1024, alt: 'Hinata Justin Nakamura — Photography' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hinata Justin Nakamura',
    description,
    images: ['https://hj-nakamura421.github.io/photography/og.png'],
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${canonical}#person`,
      name: 'Hinata Justin Nakamura',
      url: canonical,
      jobTitle: 'Photographer',
      sameAs: ['https://www.instagram.com/hj_nakamura/'],
      homeLocation: [
        { '@type': 'Place', name: 'London' },
        { '@type': 'Place', name: 'Edinburgh' },
        { '@type': 'Place', name: 'Tokyo' },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${canonical}#website`,
      url: canonical,
      name: 'Hinata Justin Nakamura',
      description,
      author: { '@id': `${canonical}#person` },
      copyrightHolder: { '@id': `${canonical}#person` },
      copyrightYear: 2026,
      inLanguage: 'en',
    },
  ],
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></body></html>;
}
