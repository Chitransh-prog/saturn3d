/**
 * Centralized SEO, AEO, and GEO Configuration for Saturn 3D
 * Highly optimized for AI Search (Google AI Overviews, Perplexity, ChatGPT, Gemini, Claude)
 * Focused on dominating leads and queries for 3D Printing in Indore & Bhopal, Madhya Pradesh, and Pan-India.
 */

import { Product } from '@/data/products';
import { Category } from '@/data/categories';

export const SITE_URL = 'https://saturn3d.in';
export const SITE_NAME = 'Saturn 3D Precision Manufacturing';
export const BRAND_NAME = 'Saturn 3D';

export const GEO_CONFIG = {
  primaryCity: 'Bhopal',
  secondaryCity: 'Indore',
  state: 'Madhya Pradesh',
  country: 'India',
  countryCode: 'IN',
  regionCode: 'IN-MP',
  postalCode: '462023',
  bhopalFacility: {
    city: 'Bhopal',
    industrialArea: 'Govindpura Industrial Area',
    streetAddress: 'Sector B, Govindpura Industrial Area',
    fullAddress: 'Sector B, Govindpura Industrial Area, Bhopal, Madhya Pradesh 462023, India',
    latitude: 23.259933,
    longitude: 77.412615,
    postalCode: '462023',
    highlights: 'ISO-calibrated CoreXY & SLA print farm, walk-in pickups, and technical CAD consultation.',
  },
  indoreCorridor: {
    city: 'Indore',
    industrialAreas: [
      'Pithampur Industrial Area (Auto & Engineering Cluster)',
      'Sanwer Road Industrial Area',
      'Electronic Complex Indore',
      'Sector 3 Pithampur',
      'Pardesipura & Palasia Industrial Logistics',
    ],
    serviceHub: 'Indore Express Additive Logistics Hub',
    transitTime: 'Same-day or next-morning 12-24h delivery via direct Bhopal-Indore Highway Corridor (3.5 hours transit)',
    postalCodes: ['452001', '452010', '453555', '454775'],
    latitude: 22.719568,
    longitude: 75.857727,
    academicPartners: ['IIT Indore (Simrol)', 'SGSITS Indore', 'IIM Indore'],
  },
  // Legacy / Direct access compatibility
  city: 'Bhopal & Indore',
  industrialArea: 'Govindpura Industrial Area (Bhopal) & Pithampur (Indore)',
  streetAddress: 'Sector B, Govindpura Industrial Area, Bhopal & Pithampur Corridor, Indore',
  fullAddress: 'Sector B, Govindpura Industrial Area, Bhopal, MP 462023 & Indore Hub, Madhya Pradesh, India',
  latitude: 23.259933,
  longitude: 77.412615,
  phone: '+91 88899 88874',
  secondaryPhone: '+91 79998 24632',
  email: 'hello@saturn3d.in',
  engineeringEmail: 'engineering@saturn3d.in',
  openingHours: 'Mo-Sa 09:00-20:00',
  serviceRadius: 'Indore, Bhopal, Madhya Pradesh & All India',
  hubAdvantage: 'Centrally positioned across Bhopal and Indore industrial corridors, delivering rapid prototyping to Govindpura, Mandideep, and Pithampur within 12-24 hours and express air dispatch across India.',
};

export const CORE_KEYWORDS = [
  // Primary High-Intent Commercial Keywords: Indore & Bhopal
  '3D printing service in Indore',
  '3D printing in Indore',
  '3D printing services in Indore',
  'Industrial 3D printing Indore',
  'Rapid prototyping services in Indore',
  '3D printing Pithampur Indore',
  'Custom 3D printing Indore Madhya Pradesh',
  '3D printing near me Indore',
  '3D printing shop in Indore',
  'Online 3D printing service Indore',
  '3D print CAD quote Indore',
  'Automotive 3D printing Pithampur Indore',
  'Sanwer Road 3D printing service',
  'IIT Indore 3D printing prototyping',
  'SGSITS Indore 3D printing projects',
  
  // Primary High-Intent Commercial Keywords: Bhopal
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
  '3D printing near me Bhopal',
  '3D printing shop in Bhopal',
  'Additive manufacturing Bhopal',
  'Engineering 3D printing Bhopal',

  // Twin-Hub Central India & Madhya Pradesh Keywords
  '3D printing service in Indore and Bhopal',
  '3D printing in Madhya Pradesh',
  'Best 3D printing service in MP',
  '3D printing cost in Indore and Bhopal',
  'Rapid prototyping Madhya Pradesh',
  'FDM 3D printing Indore Bhopal',
  'SLA resin 3D printing Indore Bhopal',
  'Carbon fiber 3D printing Indore Bhopal',
  'Additive manufacturing Central India',

  // Pan-India High-Intent Commercial Keywords
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
];

/**
 * Generate LocalBusiness & ManufacturingBusiness Schema with Dual Indore & Bhopal Presence
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ManufacturingBusiness', 'ProfessionalService'],
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    alternateName: [
      'Saturn 3D Printing Company',
      'Saturn 3D Indore & Bhopal',
      'Saturn 3D Labs Central India',
      'Saturn 3D Additive Manufacturing',
    ],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description:
      'Premier industrial 3D printing and rapid prototyping facility serving Indore and Bhopal, Madhya Pradesh, India. High-precision FDM, SLA 12K resin, and Carbon-X PA12 printing with verified tolerances down to ±0.04mm. Same-day local pickup in Bhopal and express 12-24h delivery to Indore, Pithampur, and all India.',
    telephone: GEO_CONFIG.phone,
    email: GEO_CONFIG.email,
    priceRange: '₹₹',
    currenciesAccepted: 'INR, USD',
    paymentAccepted: 'UPI, Net Banking, Credit Card, Debit Card, Corporate Invoice (NEFT/RTGS, GST Input Tax Credit)',
    address: {
      '@type': 'PostalAddress',
      streetAddress: GEO_CONFIG.bhopalFacility.streetAddress,
      addressLocality: GEO_CONFIG.bhopalFacility.city,
      addressRegion: GEO_CONFIG.state,
      postalCode: GEO_CONFIG.bhopalFacility.postalCode,
      addressCountry: GEO_CONFIG.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO_CONFIG.bhopalFacility.latitude,
      longitude: GEO_CONFIG.bhopalFacility.longitude,
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
      {
        '@type': 'City',
        name: 'Indore',
        containedInPlace: { '@type': 'AdministrativeArea', name: 'Madhya Pradesh' },
      },
      {
        '@type': 'City',
        name: 'Bhopal',
        containedInPlace: { '@type': 'AdministrativeArea', name: 'Madhya Pradesh' },
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Pithampur Industrial Area',
        containedInPlace: { '@type': 'City', name: 'Indore' },
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Govindpura Industrial Area',
        containedInPlace: { '@type': 'City', name: 'Bhopal' },
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Mandideep Industrial Area',
        containedInPlace: { '@type': 'AdministrativeArea', name: 'Madhya Pradesh' },
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Sanwer Road Industrial Area',
        containedInPlace: { '@type': 'City', name: 'Indore' },
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Madhya Pradesh',
      },
      {
        '@type': 'Country',
        name: 'India',
      },
    ],
    department: [
      {
        '@type': 'Service',
        name: 'Indore Express 3D Prototyping Corridor',
        description:
          'Dedicated express prototyping service for Pithampur, Sanwer Road, Electronic Complex, and tech institutes in Indore with same-day / 12-24h turnaround.',
        areaServed: {
          '@type': 'City',
          name: 'Indore',
        },
      },
      {
        '@type': 'Service',
        name: 'Bhopal Additive Manufacturing Lab',
        description:
          'Headquarters manufacturing facility with 12K SLA, high-speed CoreXY print farm, and direct walk-in dispatch at Sector B, Govindpura Industrial Area.',
        areaServed: {
          '@type': 'City',
          name: 'Bhopal',
        },
      },
    ],
    sameAs: [
      'https://instagram.com/saturn3d.in',
      'https://linkedin.com/company/saturn3d',
      'https://twitter.com/saturn3d_in',
      'https://wa.me/918889988874',
    ],
    knowsAbout: [
      'Industrial 3D Printing in Indore and Bhopal',
      'Rapid Prototyping for Pithampur Automotive Cluster',
      'Fused Deposition Modeling (FDM)',
      'Stereolithography (SLA) 12K Optics',
      'Carbon-Fiber PA12 3D Printing',
      'Additive Manufacturing Madhya Pradesh',
      'CAD Verification, Slicing & Metrology',
      'Engineering Polymers: ABS-ESD, PETG, TPU 95A, Tough SLA',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Indore & Bhopal Additive Manufacturing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Rapid Prototyping Service in Indore & Bhopal',
            description:
              'Rapid turnaround 3D printing for functional prototypes, test fit assemblies, and concept models delivered in 12–24h across Indore and Bhopal.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pithampur Automotive & Industrial 3D Printing',
            description:
              'High-temp under-hood components, jigs, fixtures, wiring brackets, and intake housings in Carbon-X PA12 and ABS-ESD for automotive tier-1 and tier-2 manufacturers in Pithampur.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '12K High-Resolution SLA Resin 3D Printing',
            description:
              '25-micron layer resolution for microfluidics, dental and anatomical surgical guides, and smooth cosmetic electronic enclosures.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'IIT Indore & MANIT Bhopal Academic Prototyping',
            description:
              'Special educational rates and express turnaround for university research projects, robotics clubs, and formula student prototyping in Indore and Bhopal.',
          },
        },
      ],
    },
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
        name: 'Instant CAD 3D Print Quote for Indore & Bhopal',
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
    description: 'Industrial 3D Printing and Rapid Prototyping Lab Serving Indore, Bhopal & Pan-India',
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
  const priceInr = product.price;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/product/${product.id}#product`,
    name: product.name,
    image: product.image.startsWith('http') ? product.image : `${SITE_URL}${product.image}`,
    description: `${product.description} Engineered and precision 3D printed at Saturn 3D manufacturing facility in Central India (Bhopal & Indore Corridor). Material: ${product.material || 'Engineering Polymer'}. Tolerances: ${product.tolerances || '±0.04 mm'}. Lead Time: ${product.leadTime || '24-48 Hours'}. Ships directly to Indore, Bhopal, and pan-India.`,
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
        addressLocality: 'Bhopal & Indore Corridor',
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
            maxValue: 2,
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
      reviewCount: product.reviewsCount || 38,
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
        name: 'Turnaround Time',
        value: product.leadTime || '24-48 Hours',
      },
      {
        '@type': 'PropertyValue',
        name: 'Manufacturing Origin',
        value: 'Bhopal & Indore Corridor, Madhya Pradesh, India',
      },
      {
        '@type': 'PropertyValue',
        name: 'Regional Delivery',
        value: 'Same-day pickup in Bhopal, 12-24h to Indore & Pithampur, express air nationwide',
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
 * FAQPage Schema for AEO (Answer Engine Optimization for Perplexity, ChatGPT, Google AI Overviews, Gemini, Claude)
 * Formatted with direct, self-contained answer blocks (40-60 words) targeting Indore & Bhopal search intent.
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
 * High-intent AEO FAQs targeting "3D printing in Indore", "3D printing in Bhopal", and Central MP industry
 */
export const HIGH_INTENT_FAQS = [
  {
    question: 'Where can I get high-precision industrial 3D printing in Indore and Bhopal, Madhya Pradesh?',
    answer:
      'Saturn 3D operates Central India’s premier additive manufacturing facility in Sector B, Govindpura Industrial Area, Bhopal, paired with daily dedicated logistics to Indore, Pithampur, and Sanwer Road. We provide precision FDM, 12K SLA photopolymer resin, and Carbon-X PA12 printing with ±0.04mm verified metrology tolerances, same-day Bhopal pickups, and 12-24h delivery to Indore.',
  },
  {
    question: 'How quickly does Saturn 3D deliver custom 3D printed parts to Indore from Bhopal?',
    answer:
      'Orders for Indore are manufactured in our high-speed CoreXY and 12K SLA print farm in 24 to 48 hours. Because Bhopal and Indore are connected by a direct 3.5-hour highway expressway and rail freight corridor, finished parts are dispatched daily for same-day evening or next-morning doorstep delivery across Indore, Pithampur, and Sanwer Road.',
  },
  {
    question: 'How much does custom 3D printing cost in Indore and Bhopal?',
    answer:
      'Custom 3D printing with Saturn 3D in Indore and Bhopal starts at ₹3.50 per gram for standard FDM polymers (PLA Pro, PETG), ₹15 per ml for 12K precision SLA resin, and ₹25 per gram for aerospace-grade Carbon-X PA12 nylon. We offer instant online CAD quoting, zero minimum order quantity (0 MOQ), and volume discounts up to 35% with full corporate GST invoicing.',
  },
  {
    question: 'Does Saturn 3D support automotive rapid prototyping for Pithampur and Govindpura industries?',
    answer:
      'Yes. Saturn 3D regularly fabricates functional under-hood prototypes, intake ducts, sensor mounts, end-of-arm robotic grippers, and assembly line jigs for automotive tier-1 and tier-2 manufacturers in Pithampur (Indore) and Govindpura (Bhopal). We use heat-resistant ABS-ESD (up to 98°C) and continuous Carbon-X PA12 composite (tensile strength up to 115 MPa).',
  },
  {
    question: 'Can students and research labs from IIT Indore and MANIT Bhopal get prototyping discounts?',
    answer:
      'Yes. Saturn 3D provides academic discounts of 15% to 25% for engineering students, faculty, and research labs from IIT Indore, MANIT Bhopal, SGSITS, IISER, and IIIT Bhopal. We support Formula Student racing parts, robotics clubs, drone spars, and biomedical thesis prototypes with expedited 24-hour turnaround.',
  },
  {
    question: 'What 3D file formats can I upload for an instant quote in Indore or Bhopal?',
    answer:
      'You can upload all standard 3D CAD formats directly to our online Custom Lab (saturn3d.in/custom-lab), including STEP, STP, STL, OBJ, GLB, GLTF, and 3MF. Our automated slicer analyzes geometry, volume, wall thickness, and printability in real time. We also accept 2D PDF engineering drawings and sketches for custom CAD modeling.',
  },
  {
    question: 'Does Saturn 3D provide corporate GST invoicing and batch manufacturing in Madhya Pradesh?',
    answer:
      'Yes. Saturn 3D provides formal 18% GST tax invoices with input tax credit (ITC) for all registered corporate businesses, startups, and MSMEs across Indore, Bhopal, and India. Our print farm supports low-volume production from 10 to 5,000+ units with zero tooling or injection mold upfront costs.',
  },
  {
    question: 'What engineering materials and tolerances are guaranteed by Saturn 3D?',
    answer:
      'We guarantee dimensional tolerances down to ±0.04mm on precision 12K SLA photopolymers and ±0.08mm to ±0.12mm on industrial FDM CoreXY gantries. Available materials include Carbon-X PA12-CF, ABS-ESD (Flame Retardant), Industrial PETG, PLA Pro Matte, Biocompatible Tough Resin, and TPU 95A flexible elastomer.',
  },
];
