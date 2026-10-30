import type { Metadata } from 'next';
import CustomLabClient from '@/components/CustomLabClient';
import {
  SITE_URL,
  SITE_NAME,
  GEO_CONFIG,
  getBreadcrumbSchema,
} from '@/lib/seo-config';

export const metadata: Metadata = {
  title: {
    absolute: 'Instant 3D Printing Quote Indore & Bhopal | Upload CAD STEP/STL Online | Saturn 3D',
  },
  description:
    'Upload 3D CAD files (.STEP, .STP, .STL, .OBJ, .3MF) for instant automated pricing, wall-thickness analysis, and rapid 12-24h fabrication serving Indore, Bhopal, Pithampur, and all India. Zero MOQ.',
  keywords: [
    'instant 3D printing quote Indore',
    '3D printing quote Bhopal',
    'online 3D print quote Pithampur',
    'upload STL 3D print Indore',
    'STEP file 3D printing online India',
    'CAD 3D printing cost calculator Indore Bhopal',
    'custom 3D printing lab Bhopal',
    'Saturn 3D custom lab',
  ],
  alternates: {
    canonical: `${SITE_URL}/custom-lab`,
  },
  openGraph: {
    title: 'Instant 3D Printing Quote Online Indore & Bhopal | Saturn 3D Custom Lab',
    description:
      'Upload STEP, STP, STL or OBJ files for real-time automated pricing, material selection, and 12-24h rapid dispatch to Indore, Bhopal, Pithampur, and nationwide across India.',
    url: `${SITE_URL}/custom-lab`,
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'website',
  },
  other: {
    'geo.region': GEO_CONFIG.regionCode,
    'geo.placename': `${GEO_CONFIG.primaryCity}, ${GEO_CONFIG.secondaryCity}, ${GEO_CONFIG.state}, ${GEO_CONFIG.country}`,
    'geo.position': `${GEO_CONFIG.latitude};${GEO_CONFIG.longitude}`,
    'ICBM': `${GEO_CONFIG.latitude}, ${GEO_CONFIG.longitude}`,
  },
};

export default function Page() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Online Instant 3D Printing CAD Quotation & Fabrication',
    serviceType: 'Additive Prototyping on Demand',
    provider: {
      '@type': 'LocalBusiness',
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
    areaServed: [
      { '@type': 'City', name: 'Bhopal' },
      { '@type': 'City', name: 'Indore' },
      { '@type': 'AdministrativeArea', name: 'Pithampur' },
      { '@type': 'AdministrativeArea', name: 'Madhya Pradesh' },
      { '@type': 'Country', name: 'India' },
    ],
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        priceCurrency: 'INR',
        unitText: 'gram/ml',
      },
    },
  };

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Custom 3D Lab', url: '/custom-lab' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CustomLabClient />
    </>
  );
}
