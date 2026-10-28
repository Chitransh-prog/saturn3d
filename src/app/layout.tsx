import type { Metadata, Viewport } from 'next';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';
import {
  SITE_URL,
  SITE_NAME,
  CORE_KEYWORDS,
  GEO_CONFIG,
  getLocalBusinessSchema,
  getWebSiteSchema,
} from '@/lib/seo-config';

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Saturn 3D Precision Manufacturing | Industrial 3D Printing Bhopal & India',
    template: '%s | Saturn 3D - 3D Printing Bhopal, India',
  },
  description:
    'Leading industrial 3D printing & rapid prototyping facility in Bhopal, Madhya Pradesh, India. FDM, SLA 12K resin & Carbon-X printing with ±0.04mm precision. Instant online CAD quotes, zero MOQ, 24-48h pan-India express air dispatch.',
  applicationName: SITE_NAME,
  authors: [{ name: 'Saturn 3D Engineering Team', url: SITE_URL }],
  generator: 'Next.js',
  keywords: CORE_KEYWORDS,
  referrer: 'origin-when-cross-origin',
  creator: 'Saturn 3D Bhopal',
  publisher: 'Saturn 3D Precision Manufacturing Lab',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-IN': SITE_URL,
      'en': SITE_URL,
    },
  },
  openGraph: {
    title: 'Saturn 3D Precision Manufacturing | Industrial 3D Printing Bhopal & India',
    description:
      'Premier industrial 3D printing lab in Bhopal, MP, India. Rapid prototyping, Carbon-X engineering parts, SLA 12K optical resin. Instant CAD file quote, 24-48h dispatch nationwide.',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Saturn 3D Industrial 3D Printing Facility in Bhopal, MP, India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saturn 3D | Industrial 3D Printing Bhopal & India',
    description:
      'Precision rapid prototyping & additive manufacturing in Bhopal, MP, India. FDM, SLA, Carbon-X PA12 with micron tolerances. Pan-India 24-48h dispatch.',
    site: '@saturn3d_in',
    creator: '@saturn3d_in',
    images: ['/og-image.jpg'],
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  other: {
    // Geographic Local SEO & AEO Meta Tags
    'geo.region': GEO_CONFIG.regionCode,
    'geo.placename': `${GEO_CONFIG.city}, ${GEO_CONFIG.state}, ${GEO_CONFIG.country}`,
    'geo.position': `${GEO_CONFIG.latitude};${GEO_CONFIG.longitude}`,
    'ICBM': `${GEO_CONFIG.latitude}, ${GEO_CONFIG.longitude}`,
    'city': GEO_CONFIG.city,
    'state': GEO_CONFIG.state,
    'country': GEO_CONFIG.country,
    'DC.title': 'Saturn 3D - 3D Printing Bhopal & India',
    'DC.creator': 'Saturn 3D Engineering',
    'DC.coverage': 'Bhopal, Madhya Pradesh, India, Worldwide',
    'DC.description': 'Industrial 3D Printing and Rapid Prototyping Laboratory in Bhopal, Madhya Pradesh, India.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessJsonLd = getLocalBusinessSchema();
  const websiteJsonLd = getWebSiteSchema();

  return (
    <html lang="en">
      <head>
        {/* Structured Data: LocalBusiness & ManufacturingBusiness Schema (AEO / GEO / Local SEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {/* Structured Data: WebSite Schema with internal search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="bg-paper text-ink font-body selection:bg-saturn-orange selection:text-ink antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
