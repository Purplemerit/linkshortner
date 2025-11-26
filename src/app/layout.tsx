import type { Metadata } from 'next';
import './globals.css';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'short.link - Privacy-First URL Shortener | 50+ Features',
  description: 'The most feature-rich, privacy-first URL shortener at the lowest price. Create beautiful short links with real-time analytics. No cookies. No tracking. $9-15/mo.',
  keywords: 'URL shortener, short link, QR code generator, analytics, privacy-first, Bitly alternative',
  openGraph: {
    title: 'short.link - Privacy-First URL Shortener',
    description: '50+ features. Privacy-first analytics. $9-15/mo. The most affordable URL shortener with broken link monitoring.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'short.link - Privacy-First URL Shortener',
    description: '50+ features. Privacy-first analytics. $9-15/mo.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'short.link',
              description: 'Privacy-first URL shortener with 50+ features',
              url: 'https://short.link',
              offers: {
                '@type': 'Offer',
                price: '9',
                priceCurrency: 'USD',
              },
              applicationCategory: 'UtilityApplication',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1200',
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

