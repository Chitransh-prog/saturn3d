import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import ProductDetailClient from '@/components/ProductDetailClient';
import { SITE_URL, getProductSchema, getBreadcrumbSchema } from '@/lib/seo-config';

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
      title: 'Hardware Not Found | Saturn 3D Bhopal, India',
    };
  }

  return {
    title: {
      absolute: `${product.name} | 3D Printing Bhopal & India | Saturn 3D`,
    },
    description: `${product.description} Manufactured in Bhopal, MP, India.`,
    alternates: {
      canonical: `${SITE_URL}/product/${product.id}`,
    },
  };
}

export default async function CategoryProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const productJsonLd = getProductSchema(product);
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Hardware Catalog', url: '/categories' },
    { name: product.name, url: `/product/${product.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient />
    </>
  );
}
