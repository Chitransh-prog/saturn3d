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
  themeColor: '#F8F9FB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Saturn 3D Precision Manufacturing | Industrial 3D Printing Indore & Bhopal',
    template: '%s | Saturn 3D - 3D Printing Indore & Bhopal, India',
  },
  description:
    'Leading industrial 3D printing & rapid prototyping facility serving Indore and Bhopal, Madhya Pradesh, India. FDM, SLA 12K resin & Carbon-X printing with ±0.04mm precision. Instant online CAD quotes, zero MOQ, express 12-24h dispatch to Indore, Pithampur & pan-India.',
  applicationName: SITE_NAME,
  authors: [{ name: 'Saturn 3D Engineering Team', url: SITE_URL }],
  generator: 'Next.js',
  keywords: CORE_KEYWORDS,
  referrer: 'origin-when-cross-origin',
  creator: 'Saturn 3D Indore & Bhopal',
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
    title: 'Saturn 3D Precision Manufacturing | Industrial 3D Printing Indore & Bhopal',
    description:
      'Premier industrial 3D printing lab serving Indore & Bhopal, MP, India. Rapid prototyping, Carbon-X engineering parts, SLA 12K optical resin. Instant CAD file quotes, same-day Bhopal pickup, 12-24h delivery to Indore & nationwide.',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Saturn 3D Industrial 3D Printing Facility Serving Indore & Bhopal, MP, India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saturn 3D | Industrial 3D Printing Indore & Bhopal',
    description:
      'Precision rapid prototyping & additive manufacturing in Indore & Bhopal, MP, India. FDM, SLA, Carbon-X PA12 with ±0.04mm tolerances. Express 12-24h delivery across MP & nationwide.',
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
    // Geographic Local SEO & AEO Meta Tags for Indore & Bhopal
    'geo.region': GEO_CONFIG.regionCode,
    'geo.placename': 'Indore and Bhopal, Madhya Pradesh, India',
    'geo.position': `${GEO_CONFIG.latitude};${GEO_CONFIG.longitude}`,
    'ICBM': `${GEO_CONFIG.latitude}, ${GEO_CONFIG.longitude}`,
    'city': 'Indore, Bhopal',
    'state': 'Madhya Pradesh',
    'country': 'India',
    'DC.title': 'Saturn 3D - 3D Printing Indore & Bhopal, India',
    'DC.creator': 'Saturn 3D Engineering',
    'DC.coverage': 'Indore, Bhopal, Pithampur, Mandideep, Madhya Pradesh, India, Worldwide',
    'DC.description': 'Industrial 3D Printing and Rapid Prototyping Laboratory Serving Indore and Bhopal, Madhya Pradesh, India.',
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
      <body className="bg-[#F8F9FB] text-[#111215] font-body selection:bg-[#FF5A1F] selection:text-white antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
