import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products, type Product } from '@/data/products';
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return {
      title: 'Product Not Found | Saturn 3D Printing Bhopal, India',
      description: 'The requested custom 3D printed component could not be located in the Saturn 3D hardware catalog.',
    };
  }

  const priceInr = Math.round(product.price * 83);
  const title = `${product.name} | 3D Printing Bhopal & India | Saturn 3D`;
  const description = `${product.description} Precision 3D printed with ${product.material || 'Engineering Polymer'} at Saturn 3D lab in Bhopal, MP. Tolerance: ${product.tolerances || '±0.04mm'}. Turnaround: ${product.leadTime || '24-48 Hours'}. Starting ₹${priceInr}. Pan-India express air dispatch.`;
  const canonicalUrl = `${SITE_URL}/product/${product.id}`;
  const imageUrl = product.image.startsWith('http') ? product.image : `${SITE_URL}${product.image}`;

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [
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
    ],
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
      'geo.region': GEO_CONFIG.regionCode,
      'geo.placename': `${GEO_CONFIG.city}, ${GEO_CONFIG.state}, ${GEO_CONFIG.country}`,
      'geo.position': `${GEO_CONFIG.latitude};${GEO_CONFIG.longitude}`,
      'ICBM': `${GEO_CONFIG.latitude}, ${GEO_CONFIG.longitude}`,
      'product:price:amount': String(priceInr),
      'product:price:currency': 'INR',
      'product:availability': product.stock > 0 ? 'in stock' : 'preorder',
      'product:condition': 'new',
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const productJsonLd = getProductSchema(product);
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Hardware Catalog', url: '/categories' },
    { name: product.category, url: `/category/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` },
    { name: product.name, url: `/product/${product.id}` },
  ]);

  const priceInr = Math.round(product.price * 83);

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

      {/* Semantic Crawlable & AEO-Ready Content for LLMs & Search Bots */}
      <article className="sr-only" itemScope itemType="https://schema.org/Product">
        <h1 itemProp="name">{product.name}</h1>
        <p itemProp="description">{product.description}</p>
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
          <dd>{product.material || 'Engineering Polymer'}</dd>
          <dt>Tolerances</dt>
          <dd>{product.tolerances || '±0.04 mm'}</dd>
          <dt>Lead Time</dt>
          <dd>{product.leadTime || '24-48 Hours'}</dd>
          <dt>Fabrication Hub</dt>
          <dd>Sector B, Govindpura Industrial Area, Bhopal, Madhya Pradesh 462023, India</dd>
          <dt>Shipping</dt>
          <dd>Pan-India Express Air Shipping to Mumbai, Bengaluru, Delhi-NCR, Pune, Hyderabad, and all Indian cities</dd>
        </dl>
      </article>

      {/* Interactive 3D Product Detail Experience */}
      <ProductDetailClient />
    </>
  );
}
