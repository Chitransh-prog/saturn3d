'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const DesignSystem = dynamic(() => import('@/views/DesignSystem'), { ssr: false });

export default function Page() {
  return <DesignSystem />;
}
