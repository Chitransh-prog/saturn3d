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
    absolute: 'About Saturn 3D | Bhopal Manufacturing Facility & Engineering Team',
  },
  description:
    'Learn about Saturn 3D additive manufacturing laboratory in Govindpura Industrial Area, Bhopal, MP, India. Our ISO-calibrated print farm, team of hardware engineers, and mission to accelerate Indian hardware innovation.',
  keywords: [
    'About Saturn 3D',
    '3D printing company Bhopal',
    'Additive manufacturing lab Madhya Pradesh',
    'Govindpura Bhopal 3D print farm',
    '3D printing engineers India',
    'Saturn 3D story',
  ],
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: 'About Saturn 3D | Bhopal Manufacturing Facility & Team',
    description:
      'Industrial additive manufacturing laboratory based in Bhopal, MP, India. High-precision CoreXY FDM, SLA 12K resin, and Carbon-X production.',
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'website',
  },
  other: {
    'geo.region': GEO_CONFIG.regionCode,
    'geo.placename': `${GEO_CONFIG.city}, ${GEO_CONFIG.state}, ${GEO_CONFIG.country}`,
    'geo.position': `${GEO_CONFIG.latitude};${GEO_CONFIG.longitude}`,
    'ICBM': `${GEO_CONFIG.latitude}, ${GEO_CONFIG.longitude}`,
  },
};

export default function Page() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Saturn 3D Precision Manufacturing',
    description: 'Overview of Saturn 3D industrial print farm, engineering capabilities, and Bhopal laboratory.',
    url: `${SITE_URL}/about`,
    mainEntity: {
      '@type': 'ManufacturingBusiness',
      name: SITE_NAME,
      address: {
        '@type': 'PostalAddress',
        streetAddress: GEO_CONFIG.streetAddress,
        addressLocality: GEO_CONFIG.city,
        addressRegion: GEO_CONFIG.state,
        postalCode: GEO_CONFIG.postalCode,
        addressCountry: GEO_CONFIG.countryCode,
      },
    },
  };

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About Lab', url: '/about' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutClient />
    </>
  );
}
