import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';
import {
  SITE_URL,
  SITE_NAME,
  GEO_CONFIG,
  CORE_KEYWORDS,
  HIGH_INTENT_FAQS,
  getFaqSchema,
} from '@/lib/seo-config';

export const metadata: Metadata = {
  title: '3D Printing Service in Bhopal & India | Industrial Rapid Prototyping | Saturn 3D',
  description:
    '#1 industrial 3D printing service in Bhopal, Madhya Pradesh, serving all India. High-precision FDM, 12K SLA resin & Carbon-X PA12 printing with ±0.04mm tolerances. Instant online CAD quotes, zero MOQ, and express 24–48h air delivery across India.',
  keywords: [
    ...CORE_KEYWORDS,
    '3D printing service in Bhopal',
    '3D printing Bhopal Madhya Pradesh',
    '3D printing near me Bhopal',
    'Best 3D printing service India',
    'Online 3D printing service India',
    'Rapid prototyping services Bhopal',
    'Custom 3D print online India',
    'Industrial FDM 3D printing Bhopal',
    'SLA resin 3D printing India',
    'Carbon fiber 3D printing India',
    'Instant CAD 3D print quote India',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: '3D Printing Service in Bhopal & India | Industrial Rapid Prototyping | Saturn 3D',
    description:
      'Premier industrial 3D printing lab in Bhopal, MP, India. Instant CAD quotes, engineering polymers, SLA 12K optical resin, and low-volume batch production delivered across India in 24–48h.',
    url: SITE_URL,
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
  const faqJsonLd = getFaqSchema(
    HIGH_INTENT_FAQS.map((f) => ({
      question: f.question,
      answer: f.answer,
    }))
  );

  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Industrial 3D Printing & Rapid Prototyping',
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
      { '@type': 'City', name: 'Jabalpur' },
      { '@type': 'AdministrativeArea', name: 'Madhya Pradesh' },
      { '@type': 'Country', name: 'India' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Additive Manufacturing Services',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Industrial FDM 3D Printing',
          description: 'High-speed CoreXY thermoplastic printing with Carbon-X PA12, ABS-ESD, and PETG for functional mechanical prototypes.',
        },
        {
          '@type': 'OfferCatalog',
          name: '12K High-Resolution SLA Resin 3D Printing',
          description: 'Stereolithography with layer resolutions down to 25 microns for smooth injection-mold finish and micro-features.',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Low-Volume Batch Production',
          description: 'Bridge manufacturing from 10 to 5,000+ parts with no tooling or injection mold lead-time penalties.',
        },
      ],
    },
  };

  return (
    <>
      {/* FAQPage JSON-LD Schema (AEO for Perplexity, ChatGPT, Gemini, Google AI Overviews) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Service JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />

      {/* Crawlable Semantic SEO & AEO Content Block for Search Engines & AI Crawlers */}
      <section className="sr-only" aria-label="Saturn 3D Bhopal Additive Manufacturing Overview">
        <h1>3D Printing Service in Bhopal, Madhya Pradesh & Pan-India - Saturn 3D</h1>
        <p>
          Saturn 3D is Central India&apos;s leading additive fabrication facility located in Sector B, Govindpura Industrial Area, Bhopal, MP (PIN 462023).
          We provide precision FDM, 12K SLA photopolymer resin, and aerospace-grade Carbon-X PA12 3D printing with verified tolerances down to ±0.04mm.
        </p>
        <h2>Geographic Hub & Express Pan-India Logistics</h2>
        <p>
          Situated at the geographic center of India in Bhopal, Saturn 3D leverages express air cargo corridors to dispatch functional prototypes within 24–48 hours nationwide to Delhi NCR, Mumbai, Bengaluru, Pune, Hyderabad, Chennai, Ahmedabad, and Kolkata, alongside same-day local pickups across Bhopal and Mandideep.
        </p>
        <h2>Supported Additive Materials & Processes</h2>
        <ul>
          <li>Carbon-X PA12 (Carbon-Fiber Reinforced Nylon) - Tensile strength up to 115 MPa</li>
          <li>ABS-ESD (Flame Retardant) - Heat resistance up to 98°C with electrostatic discharge dissipation</li>
          <li>Industrial PETG - Chemical, moisture, and high-impact resistance for mechanical brackets</li>
          <li>PLA Pro Matte - High-detail bio-polymer for architectural scale elevation models and rapid fit tests</li>
          <li>12K Ultra-Tough SLA Photopolymer Resin - 25 micron layer resolution for micro-fluidics and dental/anatomical models</li>
          <li>TPU 95A Elastomer - Flexible gaskets, vibration dampeners, and robotic grippers</li>
        </ul>
      </section>

      {/* Interactive 3D Hero & Animated Site View */}
      <HomeClient />
    </>
  );
}
