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
    absolute: 'Additive Materials Science & Precision Tolerances | Indore & Bhopal | Saturn 3D',
  },
  description:
    'Comprehensive engineering guide to 3D printing polymers, resins, and tolerances in Central India. Compare Carbon-X PA12, ABS-ESD, PETG, PLA Pro, and 12K SLA resin specs for Pithampur, Bhopal, and Indore manufacturing.',
  keywords: [
    '3D printing materials Indore',
    '3D printing materials Bhopal',
    'Carbon fiber nylon 3D print specs Pithampur',
    'SLA resin tolerances Indore Bhopal',
    'FDM vs SLA printing Central India',
    'automotive 3D printing engineering polymers MP',
  ],
  alternates: {
    canonical: `${SITE_URL}/tech`,
  },
  openGraph: {
    title: '3D Printing Materials & Tolerances Guide | Indore & Bhopal | Saturn 3D',
    description:
      'Engineering data sheets, tensile strengths, heat deflection temperatures, and micron tolerances for industrial additive manufacturing in Indore and Bhopal.',
    url: `${SITE_URL}/tech`,
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'article',
  },
  other: {
    'geo.region': GEO_CONFIG.regionCode,
    'geo.placename': `${GEO_CONFIG.primaryCity}, ${GEO_CONFIG.secondaryCity}, ${GEO_CONFIG.state}, ${GEO_CONFIG.country}`,
    'geo.position': `${GEO_CONFIG.latitude};${GEO_CONFIG.longitude}`,
    'ICBM': `${GEO_CONFIG.latitude}, ${GEO_CONFIG.longitude}`,
  },
};

export default function Page() {
  const techGuideSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Engineering Guide to Industrial 3D Printing Materials & Precision Tolerances in Indore & Bhopal',
    description: 'Technical comparison of industrial thermoplastics and photopolymers for functional additive manufacturing across the Bhopal-Indore industrial corridor.',
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
