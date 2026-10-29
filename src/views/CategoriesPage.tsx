'use client';

import React from 'react';
import Categories from '@/sections/Categories';
import CTA from '@/sections/CTA';
import { type Product } from '@/data/products';

interface CategoriesPageProps {
  initialProducts?: Product[];
  initialCategories?: string[];
}

export default function CategoriesPage({ initialProducts, initialCategories }: CategoriesPageProps) {
  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-[#F6F7F9] text-[#111215] relative overflow-hidden">
      <div className="relative z-10">
        <Categories initialProducts={initialProducts} initialCategories={initialCategories} />
        <CTA />
      </div>
    </div>
  );
}
