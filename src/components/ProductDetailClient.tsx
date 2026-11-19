'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import type { Product } from '@/data/products';

const ProductDetailView = dynamic(() => import('@/views/ProductDetail'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#F5F6F8] text-[#5B616B] flex items-center justify-center font-mono text-xs tracking-wider">
      LOADING 3D HARDWARE TELEMETRY...
    </div>
  ),
});

export default function ProductDetailClient({ initialProduct }: { initialProduct?: Product | any }) {
  return <ProductDetailView initialProduct={initialProduct} />;
}
