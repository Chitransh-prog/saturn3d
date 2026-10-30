'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const CustomLabView = dynamic(() => import('@/views/CustomLab'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FB] text-[#5E6573] flex items-center justify-center font-mono text-xs tracking-wider">
      INITIALIZING INSTANT CAD SLICER & QUOTE LAB...
    </div>
  ),
});

export default function CustomLabClient() {
  return <CustomLabView />;
}

