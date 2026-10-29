'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const AboutView = dynamic(() => import('@/views/About'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#0B0D10] text-[#A3A9B3] flex items-center justify-center font-mono text-xs tracking-wider">
      LOADING LAB OVERVIEW...
    </div>
  ),
});

export default function AboutClient() {
  return <AboutView />;
}

