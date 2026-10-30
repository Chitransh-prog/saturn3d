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
    absolute: 'About Saturn 3D | Manufacturing Facility Serving Indore & Bhopal, India',
  },
  description:
    'Learn about Saturn 3D additive manufacturing laboratory serving Indore, Bhopal, and Central MP. Our ISO-calibrated print farm in Govindpura, rapid logistics to Pithampur, team of hardware engineers, and mission to accelerate Indian innovation.',
  keywords: [
    'About Saturn 3D',
    '3D printing company Indore',
    '3D printing company Bhopal',
    'Additive manufacturing lab Madhya Pradesh',
    'Govindpura Bhopal 3D print farm',
    'Pithampur rapid prototyping partner',
    '3D printing engineers Central India',
    'Saturn 3D story',
  ],
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: 'About Saturn 3D | Manufacturing Facility Serving Indore & Bhopal',
    description:
      'Industrial additive manufacturing laboratory serving Indore, Bhopal, and all India. High-precision CoreXY FDM, SLA 12K resin, and Carbon-X production.',
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'website',
  },
  other: {
    'geo.region': GEO_CONFIG.regionCode,
    'geo.placename': 'Indore and Bhopal, Madhya Pradesh, India',
    'geo.position': `${GEO_CONFIG.latitude};${GEO_CONFIG.longitude}`,
    'ICBM': `${GEO_CONFIG.latitude}, ${GEO_CONFIG.longitude}`,
  },
};

export default function Page() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Saturn 3D Precision Manufacturing',
    description: 'Overview of Saturn 3D industrial print farm, engineering capabilities, and Central India laboratory serving Indore and Bhopal.',
    url: `${SITE_URL}/about`,
    mainEntity: {
      '@type': 'LocalBusiness',
      name: SITE_NAME,
      url: SITE_URL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: GEO_CONFIG.bhopalFacility.streetAddress,
        addressLocality: GEO_CONFIG.bhopalFacility.city,
        addressRegion: GEO_CONFIG.state,
        postalCode: GEO_CONFIG.bhopalFacility.postalCode,
        addressCountry: GEO_CONFIG.countryCode,
      },
      areaServed: [
        { '@type': 'City', name: 'Indore' },
        { '@type': 'City', name: 'Bhopal' },
        { '@type': 'AdministrativeArea', name: 'Madhya Pradesh' },
        { '@type': 'Country', name: 'India' },
      ],
    },
  };

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About Facility', url: '/about' },
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
