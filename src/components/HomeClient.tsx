'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const HomeView = dynamic(() => import('@/views/Home'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FB] text-[#5E6573] flex items-center justify-center font-mono text-xs tracking-wider">
      INITIALIZING SATURN 3D ADDITIVE LAB...
    </div>
  ),
});

export default function HomeClient() {
  return <HomeView />;
}

