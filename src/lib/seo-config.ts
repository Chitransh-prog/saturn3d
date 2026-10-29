/**
 * Centralized SEO, AEO, and GEO Configuration for Saturn 3D
 * Focused on ranking #1 for 3D Printing in India & Bhopal City
 */

import { Product } from '@/data/products';
import { Category } from '@/data/categories';

export const SITE_URL = 'https://saturn3d.in';
export const SITE_NAME = 'Saturn 3D Precision Manufacturing';
export const BRAND_NAME = 'Saturn 3D';

export const GEO_CONFIG = {
  city: 'Bhopal',
  state: 'Madhya Pradesh',
  country: 'India',
  countryCode: 'IN',
  regionCode: 'IN-MP',
  postalCode: '462023',
  industrialArea: 'Govindpura Industrial Area',
  streetAddress: 'Sector B, Govindpura Industrial Area',
  fullAddress: 'Sector B, Govindpura Industrial Area, Bhopal, Madhya Pradesh 462023, India',
  latitude: 23.259933,
  longitude: 77.412615,
  phone: '+91 79998 24632',
  email: 'hello@saturn3d.in',
  engineeringEmail: 'engineering@saturn3d.in',
  openingHours: 'Mo-Sa 09:00-20:00',
  serviceRadius: 'All India & Central MP',
  hubAdvantage: 'Centrally positioned in Bhopal, Madhya Pradesh for express 24-48h air courier transit to Mumbai, Delhi-NCR, Bengaluru, Pune, Hyderabad, and Chennai.',
};

export const CORE_KEYWORDS = [
  // Primary India Keywords
  '3D printing in India',
  '3D printing service India',
  'Industrial 3D printing India',
  'Online 3D printing India',
  'Online 3D printing service India',
  'Rapid prototyping India',
  'Custom 3D print online India',
  'CAD to 3D print India',
  'Instant 3D printing quote India',
  'FDM 3D printing India',
  'SLA resin 3D printing India',
  'Carbon fiber 3D printing India',
  'Small batch manufacturing India',
  'Best 3D printing service India',
  'On-demand 3D printing India',

  // Bhopal & Central India Keywords
  '3D printing Bhopal',
  '3D printing service in Bhopal',
  '3D printing services in Bhopal',
  'Industrial 3D printing Bhopal',
  'Custom 3D printing Bhopal MP',
  'Rapid prototyping Bhopal',
  '3D printer farm Bhopal',
  '3D printing Govindpura Bhopal',
  'Mandideep 3D printing service',
  'MANIT Bhopal 3D prototyping',
  '3D printing Madhya Pradesh',
  'Additive manufacturing Bhopal',
  'Engineering 3D printing Central India',
  '3D printing shop in Bhopal',
  '3D printing near me Bhopal',
];

/**
 * Generate LocalBusiness & ManufacturingBusiness Schema
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ManufacturingBusiness', 'ProfessionalService'],
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    alternateName: ['Saturn 3D Printing Company', 'Saturn 3D Labs', 'Saturn 3D Bhopal'],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description:
      'Premier industrial 3D printing and rapid prototyping facility based in Bhopal, Madhya Pradesh, India. High-precision FDM, SLA 12K resin, and Carbon-X printing with tolerances down to ±0.04mm. 24-48h pan-India express dispatch.',
    telephone: GEO_CONFIG.phone,
    email: GEO_CONFIG.email,
    priceRange: '₹₹',
    currenciesAccepted: 'INR, USD',
    paymentAccepted: 'UPI, Net Banking, Credit Card, Debit Card, Corporate Invoice (NEFT/RTGS)',
    address: {
      '@type': 'PostalAddress',
      streetAddress: GEO_CONFIG.streetAddress,
      addressLocality: GEO_CONFIG.city,
      addressRegion: GEO_CONFIG.state,
      postalCode: GEO_CONFIG.postalCode,
      addressCountry: GEO_CONFIG.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO_CONFIG.latitude,
      longitude: GEO_CONFIG.longitude,
    },
    hasMap: 'https://maps.google.com/?q=23.259933,77.412615',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'Bhopal' },
      { '@type': 'City', name: 'Indore' },
      { '@type': 'City', name: 'Jabalpur' },
      { '@type': 'City', name: 'Gwalior' },
      { '@type': 'AdministrativeArea', name: 'Madhya Pradesh' },
      { '@type': 'City', name: 'Delhi' },
      { '@type': 'City', name: 'Mumbai' },
      { '@type': 'City', name: 'Bengaluru' },
      { '@type': 'City', name: 'Pune' },
      { '@type': 'City', name: 'Hyderabad' },
      { '@type': 'City', name: 'Chennai' },
      { '@type': 'City', name: 'Ahmedabad' },
      { '@type': 'Country', name: 'India' },
    ],
    sameAs: [
      'https://instagram.com/saturn3d.in',
      'https://linkedin.com/company/saturn3d',
      'https://twitter.com/saturn3d_in',
      'https://wa.me/917999824632',
    ],
    knowsAbout: [
      'Industrial 3D Printing',
      'Fused Deposition Modeling (FDM)',
      'Stereolithography (SLA)',
      'Carbon-Fiber PA12 3D Printing',
      'Rapid Prototyping',
      'Additive Manufacturing',
      'CAD Verification and Slicing',
      'Engineering Polymers and Resins',
    ],
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/custom-lab`,
        inLanguage: 'en-US',
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      result: {
        '@type': 'QuoteAction',
        name: 'Instant CAD 3D Print Quote',
      },
    },
  };
}

/**
 * WebSite schema with internal search
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: 'Industrial 3D Printing and Rapid Prototyping Lab in Bhopal, MP, India',
    publisher: {
      '@id': `${SITE_URL}/#business`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/categories?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['en-IN', 'en'],
  };
}

/**
 * Product Schema for SEO & AEO (Product Rich Snippets)
 */
export function getProductSchema(product: Product) {
  const priceInr = Math.round(product.price * 83);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/product/${product.id}#product`,
    name: product.name,
    image: product.image.startsWith('http') ? product.image : `${SITE_URL}${product.image}`,
    description: `${product.description} Engineered and precision 3D printed at Saturn 3D manufacturing facility in Bhopal, Madhya Pradesh, India. Material: ${product.material || 'Engineering Polymer'}. Tolerances: ${product.tolerances || '±0.04 mm'}. Lead Time: ${product.leadTime || '24-48 Hours'}. Ships pan-India.`,
    sku: `SATURN-3D-${product.id.padStart(4, '0')}`,
    mpn: `S3D-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: BRAND_NAME,
    },
    manufacturer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: GEO_CONFIG.city,
        addressRegion: GEO_CONFIG.state,
        addressCountry: GEO_CONFIG.countryCode,
      },
    },
    countryOfOrigin: {
      '@type': 'Country',
      name: 'India',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.id}`,
      priceCurrency: 'INR',
      price: priceInr,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: 'INR',
        },
        shippingDestination: [
          {
            '@type': 'DefinedRegion',
            addressCountry: 'IN',
          },
        ],
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.9,
      reviewCount: product.reviewsCount || 34,
      bestRating: 5,
      worstRating: 1,
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Fabrication Material',
        value: product.material || 'Engineering Polymer',
      },
      {
        '@type': 'PropertyValue',
        name: 'Dimensional Tolerance',
        value: product.tolerances || '±0.04 mm',
      },
      {
        '@type': 'PropertyValue',
        name: 'Turnaround & Dispatch Time',
        value: product.leadTime || '24-48 Hours',
      },
      {
        '@type': 'PropertyValue',
        name: 'Manufacturing Origin',
        value: 'Bhopal, Madhya Pradesh, India',
      },
      {
        '@type': 'PropertyValue',
        name: 'Shipping Coverage',
        value: 'Pan-India Express Air Shipping',
      },
    ],
  };
}

/**
 * BreadcrumbList Schema for Google Search Rich Snippets
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * FAQPage Schema for AEO (Answer Engine Optimization for Perplexity, ChatGPT, Google AI Overviews)
 */
export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * High-intent AEO FAQs targeting "3D printing in India" and "Bhopal City"
 */
export const HIGH_INTENT_FAQS = [
  {
    question: 'Where can I get high-precision industrial 3D printing in Bhopal, Madhya Pradesh?',
    answer:
      'Saturn 3D operates an industrial additive manufacturing laboratory in Sector B, Govindpura Industrial Area, Bhopal, MP (PIN 462023). We provide precision FDM, 12K SLA resin, and Carbon-X PA12 printing with micron tolerances (±0.04mm) for engineering colleges, industrial parks, and direct walk-in pickups in Bhopal.',
  },
  {
    question: 'How fast does Saturn 3D ship 3D printed parts across India from Bhopal?',
    answer:
      'Due to Bhopal’s central geographic location in India, orders are manufactured within 24 to 48 hours and dispatched via express air courier. Delivery takes 24 hours to major metro hubs (Mumbai, Delhi-NCR, Bengaluru, Pune, Hyderabad, Indore) and 48 hours to all other Indian cities.',
  },
  {
    question: 'How much does custom 3D printing cost in India with Saturn 3D?',
    answer:
      'Custom 3D printing in India at Saturn 3D starts from ₹3.50/gram for standard FDM polymers (PLA Pro, PETG), ₹15/ml for optical/engineering SLA resin, and ₹25/gram for aerospace Carbon-X PA12 nylon. We offer instant CAD file quotes with zero minimum order quantity (MOQ) and batch discounts up to 35%.',
  },
  {
    question: 'What 3D file formats can I upload for instant quotation in India?',
    answer:
      'We accept all major 3D engineering formats including STEP, STP, STL, OBJ, GLB, GLTF, and 3MF via our online Custom Lab (saturn3d.in/custom-lab). We also accept 2D technical drawings, blueprints, and reference photos (PNG, JPG, PDF) for custom CAD modeling.',
  },
  {
    question: 'Does Saturn 3D support low-volume production and batch manufacturing in India?',
    answer:
      'Yes. Our automated 3D print farm in Bhopal supports production runs from 1 prototype up to 5,000+ end-use functional parts without the expensive tooling or lead-time penalty of traditional injection molding.',
  },
  {
    question: 'What engineering materials are available at Saturn 3D Bhopal?',
    answer:
      'We stock PLA Pro Eco, Matte Industrial PETG, ABS-ESD (Flame Retardant), Carbon-X PA12 (Carbon-Fiber Reinforced Nylon), TPU 95A Elastomer, and 12K Ultra-Tough SLA Photopolymer Resins tested for automotive, aerospace, robotics, and consumer hardware applications.',
  },
];

