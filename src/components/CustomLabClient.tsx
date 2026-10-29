'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const CustomLabView = dynamic(() => import('@/views/CustomLab'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#0B0D10] text-[#A3A9B3] flex items-center justify-center font-mono text-xs tracking-wider">
      INITIALIZING INSTANT CAD SLICER & QUOTE LAB...
    </div>
  ),
});

export default function CustomLabClient() {
  return <CustomLabView />;
}

