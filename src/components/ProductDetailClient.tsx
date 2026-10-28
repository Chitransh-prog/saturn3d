'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const ProductDetailView = dynamic(() => import('@/views/ProductDetail'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-mono text-xs text-ink/60">
      LOADING 3D HARDWARE TELEMETRY...
    </div>
  ),
});

export default function ProductDetailClient() {
  return <ProductDetailView />;
}

