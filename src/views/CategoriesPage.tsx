'use client';

import React from 'react';
import Categories from '@/sections/Categories';
import CTA from '@/sections/CTA';
import { type Product } from '@/lib/api';

interface CategoriesPageProps {
  initialProducts?: Product[];
  initialCategories?: string[];
}

export default function CategoriesPage({ initialProducts, initialCategories }: CategoriesPageProps) {
  return (
    <div className="pt-0 min-h-screen bg-paper pattern-blueprint relative overflow-hidden">
      <div className="relative z-10">
        <Categories initialProducts={initialProducts} initialCategories={initialCategories} />
        <CTA />
      </div>
    </div>
  );
}
