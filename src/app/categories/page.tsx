import React from 'react';
import CategoriesPage from '@/views/CategoriesPage';
import db from '@/lib/db';
import { products as fallbackProducts } from '@/data/products';
import { categories as fallbackCategoriesData } from '@/data/categories';
import type { Metadata } from 'next';
import {
  SITE_URL,
  SITE_NAME,
  GEO_CONFIG,
  getBreadcrumbSchema,
} from '@/lib/seo-config';

export const metadata: Metadata = {
  title: '3D Printed Hardware Catalog | Rapid Prototyping & Parts Bhopal, India',
  description:
    'Browse industrial 3D printed components, precision robotics joints, electronic chassis, and aerospace parts fabricated in Bhopal, MP, India. Instant dispatch across India.',
  keywords: [
    '3D printed hardware catalog',
    'buy 3D printed parts India',
    'rapid prototyping Bhopal',
    'custom 3D parts catalog',
    'industrial 3D printing Bhopal',
    '3D printing products India',
  ],
  alternates: {
    canonical: `${SITE_URL}/categories`,
  },
  openGraph: {
    title: '3D Printed Hardware Catalog | Saturn 3D Bhopal, India',
    description:
      'Engineered 3D printed parts, rapid prototypes, and custom enclosures fabricated with micron precision in Bhopal, Madhya Pradesh, India.',
    url: `${SITE_URL}/categories`,
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Printed Hardware Catalog | Saturn 3D Bhopal, India',
    description: 'Precision 3D printed components and rapid prototypes fabricated in Bhopal, MP, India.',
    site: '@saturn3d_in',
  },
  other: {
    'geo.region': GEO_CONFIG.regionCode,
    'geo.placename': `${GEO_CONFIG.city}, ${GEO_CONFIG.state}, ${GEO_CONFIG.country}`,
    'geo.position': `${GEO_CONFIG.latitude};${GEO_CONFIG.longitude}`,
    'ICBM': `${GEO_CONFIG.latitude}, ${GEO_CONFIG.longitude}`,
  },
};

export const revalidate = 60;

export default async function Page() {
  let initialProducts = fallbackProducts;
  let initialCategories = ['All', ...fallbackCategoriesData.map((c) => c.title)];

  try {
    const dbProducts = db.query(
      'SELECT * FROM products WHERE is_active = 1 AND is_deleted = 0 ORDER BY created_at DESC'
    ) as any[];

    if (dbProducts && dbProducts.length > 0) {
      initialProducts = dbProducts.map((p) => ({
        ...p,
        is_active: Boolean(p.is_active),
      }));
    }

    const dbCategories = db.query('SELECT name FROM categories ORDER BY name ASC') as any[];
    if (dbCategories && dbCategories.length > 0) {
      const dbCatNames = dbCategories
        .map((c) => c.name)
        .filter((name: string) => name && name.toLowerCase() !== 'all');
      initialCategories = ['All', ...dbCatNames];
    }
  } catch (err) {
    console.warn('[Categories Page] SSR DB load fallback to static catalog', err);
  }

  const catalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Saturn 3D Precision Hardware Catalog',
    description: 'Industrial 3D printed hardware, prototyping parts, and mechanical assemblies fabricated in Bhopal, India.',
    url: `${SITE_URL}/categories`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: initialProducts.map((p, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/product/${p.id}`,
        name: p.name,
      })),
    },
  };

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Hardware Catalog', url: '/categories' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CategoriesPage
        initialProducts={initialProducts}
        initialCategories={initialCategories}
      />
    </>
  );
}
