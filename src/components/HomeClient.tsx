'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const HomeView = dynamic(() => import('@/views/Home'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-mono text-xs text-ink/60">
      INITIALIZING SATURN 3D ADDITIVE LAB...
    </div>
  ),
});

export default function HomeClient() {
  return <HomeView />;
}

