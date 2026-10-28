'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const CustomLabView = dynamic(() => import('@/views/CustomLab'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-mono text-xs text-ink/60">
      INITIALIZING INSTANT CAD SLICER & QUOTE LAB...
    </div>
  ),
});

export default function CustomLabClient() {
  return <CustomLabView />;
}

