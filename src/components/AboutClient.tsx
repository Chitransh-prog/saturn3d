'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const AboutView = dynamic(() => import('@/views/About'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-mono text-xs text-ink/60">
      LOADING LAB OVERVIEW...
    </div>
  ),
});

export default function AboutClient() {
  return <AboutView />;
}

