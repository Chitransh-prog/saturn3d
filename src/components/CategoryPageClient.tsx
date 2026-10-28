'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const CategoryPageView = dynamic(() => import('@/views/CategoryPage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-mono text-xs text-ink/60">
      LOADING CATEGORY HARDWARE TELEMETRY...
    </div>
  ),
});

export default function CategoryPageClient() {
  return <CategoryPageView />;
}

