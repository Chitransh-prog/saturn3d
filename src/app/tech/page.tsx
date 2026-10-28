import type { Metadata } from 'next';
import AboutClient from '@/components/AboutClient';
import {
  SITE_URL,
  SITE_NAME,
  GEO_CONFIG,
  getBreadcrumbSchema,
} from '@/lib/seo-config';

export const metadata: Metadata = {
  title: {
    absolute: 'Additive Materials Science & Tolerances Guide India | Saturn 3D',
  },
  description:
    'Comprehensive engineering guide to 3D printing polymers, resins, and tolerances in India. Compare Carbon-X PA12, ABS-ESD, PETG, PLA Pro, and 12K SLA resin specs fabricated in Bhopal, MP.',
  keywords: [
    '3D printing materials India',
    'Carbon fiber nylon 3D print specs',
    'SLA resin tolerances India',
    'FDM vs SLA printing India',
    '3D printing engineering polymers Bhopal',
  ],
  alternates: {
    canonical: `${SITE_URL}/tech`,
  },
  openGraph: {
    title: '3D Printing Materials & Tolerances Guide | Saturn 3D India',
    description:
      'Engineering data sheets, tensile strengths, heat deflection temperatures, and micron tolerances for industrial additive manufacturing in India.',
    url: `${SITE_URL}/tech`,
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'article',
  },
  other: {
    'geo.region': GEO_CONFIG.regionCode,
    'geo.placename': `${GEO_CONFIG.city}, ${GEO_CONFIG.state}, ${GEO_CONFIG.country}`,
    'geo.position': `${GEO_CONFIG.latitude};${GEO_CONFIG.longitude}`,
    'ICBM': `${GEO_CONFIG.latitude}, ${GEO_CONFIG.longitude}`,
  },
};

export default function Page() {
  const techGuideSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Engineering Guide to Industrial 3D Printing Materials & Precision Tolerances in India',
    description: 'Technical comparison of industrial thermoplastics and photopolymers for functional additive manufacturing.',
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    url: `${SITE_URL}/tech`,
  };

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Materials Science', url: '/tech' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techGuideSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutClient />
    </>
  );
}
