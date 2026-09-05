import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://hj-nakamura421.github.io/photography/'),
  title: 'Hinata Justin Nakamura',
  description: 'Photography by Hinata Justin Nakamura.',
  icons: { icon: '/photography/favicon.svg' },
  openGraph: {
    type: 'website',
    url: 'https://hj-nakamura421.github.io/photography/',
    siteName: 'Hinata Justin Nakamura',
    title: 'Hinata Justin Nakamura',
    description: 'Photography by Hinata Justin Nakamura.',
    images: [{ url: 'https://hj-nakamura421.github.io/photography/og.png', width: 1536, height: 1024, alt: 'Hinata Justin Nakamura — Photography' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hinata Justin Nakamura',
    description: 'Photography by Hinata Justin Nakamura.',
    images: ['https://hj-nakamura421.github.io/photography/og.png'],
  },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
