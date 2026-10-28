import React from 'react';
import CategoriesPage from '@/views/CategoriesPage';
import db from '@/lib/db';
import { products as fallbackProducts } from '@/data/products';
import { categories as fallbackCategoriesData } from '@/data/categories';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hardware Catalog & Categories | Saturn 3D',
  description: 'Explore high-precision additive components, aerospace enclosures, and custom manufacturing prints in Bhopal, India.',
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

  return (
    <CategoriesPage
      initialProducts={initialProducts}
      initialCategories={initialCategories}
    />
  );
}
