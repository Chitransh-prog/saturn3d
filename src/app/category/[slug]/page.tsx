import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories, slugify } from '@/data/categories';
import { products } from '@/data/products';
import CategoryPageClient from '@/components/CategoryPageClient';
import {
  SITE_URL,
  SITE_NAME,
  GEO_CONFIG,
  getBreadcrumbSchema,
} from '@/lib/seo-config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return {
      title: 'Category Not Found | Saturn 3D Bhopal, India',
    };
  }

  const title = `${category.title} 3D Printing in Bhopal & India | Saturn 3D`;
  const description = `${category.description} Industrial-grade ${category.title.toLowerCase()} additive manufacturing in Bhopal, Madhya Pradesh, India. Micron tolerances (±0.04mm), instant CAD quotes, 24-48h dispatch across India.`;
  const canonicalUrl = `${SITE_URL}/category/${slug}`;

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [
      `${category.title} 3D printing`,
      `${category.title} 3D printing India`,
      `${category.title} 3D printing Bhopal`,
      `custom ${category.title.toLowerCase()} prototyping`,
      'industrial 3D printing India',
      'Saturn 3D additive lab Bhopal',
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
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@saturn3d_in',
    },
    other: {
      'geo.region': GEO_CONFIG.regionCode,
      'geo.placename': `${GEO_CONFIG.city}, ${GEO_CONFIG.state}, ${GEO_CONFIG.country}`,
      'geo.position': `${GEO_CONFIG.latitude};${GEO_CONFIG.longitude}`,
      'ICBM': `${GEO_CONFIG.latitude}, ${GEO_CONFIG.longitude}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  // Filter matching products
  const matchingProducts = products.filter(
    (p) => slugify(p.category) === slug || p.category.toLowerCase().includes(slug.replace(/-/g, ' '))
  );

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.title} 3D Printing Services & Hardware`,
    description: category.description,
    url: `${SITE_URL}/category/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: matchingProducts.map((p, index) => ({
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
    { name: category.title, url: `/category/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CategoryPageClient />
    </>
  );
}
