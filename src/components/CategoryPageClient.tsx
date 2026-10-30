'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const CategoryPageView = dynamic(() => import('@/views/CategoryPage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FB] text-[#5E6573] flex items-center justify-center font-mono text-xs tracking-wider">
      LOADING CATEGORY HARDWARE TELEMETRY...
    </div>
  ),
});

export default function CategoryPageClient() {
  return <CategoryPageView />;
}

