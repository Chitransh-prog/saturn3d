'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const HomeView = dynamic(() => import('@/views/Home'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#0B0D10] text-[#A3A9B3] flex items-center justify-center font-mono text-xs tracking-wider">
      INITIALIZING SATURN 3D ADDITIVE LAB...
    </div>
  ),
});

export default function HomeClient() {
  return <HomeView />;
}

