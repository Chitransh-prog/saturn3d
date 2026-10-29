'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const ProductDetailView = dynamic(() => import('@/views/ProductDetail'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#0B0D10] text-[#A3A9B3] flex items-center justify-center font-mono text-xs tracking-wider">
      LOADING 3D HARDWARE TELEMETRY...
    </div>
  ),
});

export default function ProductDetailClient() {
  return <ProductDetailView />;
}

