import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products, type Product } from '@/data/products';
import db from '@/lib/db';
import ProductDetailClient from '@/components/ProductDetailClient';
import {
  SITE_URL,
  SITE_NAME,
  GEO_CONFIG,
  getProductSchema,
  getBreadcrumbSchema,
} from '@/lib/seo-config';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

function getProductData(id: string) {
  let dbProduct: any = null;
  try {
    dbProduct = db.get('SELECT * FROM products WHERE (id = ? OR slug = ?) AND is_deleted = 0', [id, id]);
  } catch {}

  const staticProduct = products.find((p) => p.id === id);

  if (!dbProduct && !staticProduct) {
    return null;
  }

  let customSeo: any = {};
  if (dbProduct?.seo_fields) {
    try {
      customSeo = typeof dbProduct.seo_fields === 'string' ? JSON.parse(dbProduct.seo_fields) : dbProduct.seo_fields;
    } catch {}
  }

  const name = dbProduct?.name || staticProduct?.name || '';
  const description = dbProduct?.description || staticProduct?.description || '';
  const price = dbProduct ? dbProduct.price : (staticProduct ? staticProduct.price : 0);
  const image = dbProduct?.image || staticProduct?.image || '/showcase/carbon-drone-spar.jpg';
  const category = dbProduct?.category || staticProduct?.category || 'Rapid Prototyping';
  const stock = dbProduct ? dbProduct.stock : (staticProduct ? staticProduct.stock : 10);
  const material = customSeo?.aeo?.material_grade || staticProduct?.material || 'Engineering Polymer';
  const tolerances = customSeo?.aeo?.tolerance_rating || staticProduct?.tolerances || '±0.04 mm';
  const leadTime = customSeo?.geo?.dispatch_lead_time || staticProduct?.leadTime || '24-48 Hours';

  return {
    id,
    name,
    description,
    price,
    image,
    category,
    stock,
    material,
    tolerances,
    leadTime,
    customSeo,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductData(id);

  if (!product) {
    return {
      title: 'Product Not Found | Saturn 3D Printing Bhopal, India',
      description: 'The requested custom 3D printed component could not be located in the Saturn 3D hardware catalog.',
    };
  }

  const priceInr = Math.round(product.price * (product.price < 500 ? 83 : 1));
  const customSeo = product.customSeo;

  const title = customSeo?.seo?.meta_title || `${product.name} | 3D Printing Bhopal & India | Saturn 3D`;
  const description = customSeo?.seo?.meta_description || 
    `${product.description} Precision 3D printed with ${product.material} at Saturn 3D lab in Bhopal, MP. Tolerance: ${product.tolerances}. Turnaround: ${product.leadTime}. Starting ₹${priceInr}. Pan-India express air dispatch.`;
  
  const customCanonical = customSeo?.seo?.canonical_url;
  const canonicalUrl = customCanonical 
    ? `${SITE_URL}${customCanonical.startsWith('/') ? '' : '/'}${customCanonical}`
    : `${SITE_URL}/product/${product.id}`;
    
  const imageUrl = product.image.startsWith('http') ? product.image : `${SITE_URL}${product.image}`;

  const keywords = customSeo?.seo?.keywords
    ? customSeo.seo.keywords.split(',').map((k: string) => k.trim()).filter(Boolean)
    : [
        product.name,
        `${product.name} 3D print`,
        `${product.category} 3D printing`,
        `${product.material} 3D printing India`,
        '3D printing Bhopal',
        '3D printing service Bhopal',
        '3D printing India',
        'industrial 3D printing India',
        'custom rapid prototyping India',
        'Saturn 3D hardware catalog',
        'Govindpura Bhopal 3D printing',
      ];

  const targetRegion = customSeo?.geo?.target_region || GEO_CONFIG.regionCode;
  const targetPlacename = customSeo?.geo?.geo_placename || `${GEO_CONFIG.city}, ${GEO_CONFIG.state}, ${GEO_CONFIG.country}`;
  const targetPosition = customSeo?.geo?.geo_position || `${GEO_CONFIG.latitude};${GEO_CONFIG.longitude}`;

  return {
    title: {
      absolute: title,
    },
    description,
    keywords,
    robots: {
      index: customSeo?.seo?.indexable !== false,
      follow: customSeo?.seo?.indexable !== false,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_IN',
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: `${product.name} - Precision 3D Printed in Bhopal, India by Saturn 3D`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@saturn3d_in',
      images: [imageUrl],
    },
    other: {
      'geo.region': targetRegion,
      'geo.placename': targetPlacename,
      'geo.position': targetPosition,
      'ICBM': targetPosition.replace(';', ', '),
      'product:price:amount': String(priceInr),
      'product:price:currency': 'INR',
      'product:availability': product.stock > 0 ? 'in stock' : 'preorder',
      'product:condition': 'new',
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductData(id);

  if (!product) {
    notFound();
  }

  const customSeo = product.customSeo;
  const productJsonLd = getProductSchema(product as any);
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Hardware Catalog', url: '/categories' },
    { name: product.category, url: `/category/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` },
    { name: product.name, url: `/product/${product.id}` },
  ]);

  // AEO FAQ schema if FAQ items exist
  const faqItems = customSeo?.aeo?.faq_items || [];
  const faqJsonLd = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item: any) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  } : null;

  const priceInr = Math.round(product.price * (product.price < 500 ? 83 : 1));
  const directAnswer = customSeo?.aeo?.direct_answer || 
    `Saturn 3D fabricates ${product.name} in Bhopal, Madhya Pradesh with micron tolerance (${product.tolerances}) using ${product.material}. Available with zero MOQ and 24-48h dispatch across India.`;

  return (
    <>
      {/* Product JSON-LD Schema (Google Rich Snippets & AI Retrieval) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {/* BreadcrumbList JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* FAQ Schema for AEO / AI Question Answering */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Semantic Crawlable & AEO-Ready Content for LLMs & Search Bots */}
      <article className="sr-only" itemScope itemType="https://schema.org/Product">
        <h1 itemProp="name">{product.name}</h1>
        <p itemProp="description">{product.description}</p>
        <p itemProp="disambiguatingDescription">{directAnswer}</p>
        <span itemProp="category">{product.category}</span>
        <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <meta itemProp="priceCurrency" content="INR" />
          <meta itemProp="price" content={String(priceInr)} />
          <meta itemProp="availability" content={product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/PreOrder"} />
        </div>
        <div itemProp="brand" itemScope itemType="https://schema.org/Brand">
          <meta itemProp="name" content="Saturn 3D" />
        </div>
        <dl>
          <dt>Material</dt>
          <dd>{product.material}</dd>
          <dt>Tolerances</dt>
          <dd>{product.tolerances}</dd>
          <dt>Lead Time</dt>
          <dd>{product.leadTime}</dd>
          <dt>Fabrication Hub</dt>
          <dd>{customSeo?.geo?.geo_placename || 'Sector B, Govindpura Industrial Area, Bhopal, Madhya Pradesh 462023, India'}</dd>
          <dt>Shipping</dt>
          <dd>{customSeo?.geo?.service_scope || 'Pan-India Express Air Shipping to Mumbai, Bengaluru, Delhi-NCR, Pune, Hyderabad, and all Indian cities'}</dd>
        </dl>
      </article>

      {/* Interactive 3D Product Detail Experience */}
      <ProductDetailClient />
    </>
  );
}
