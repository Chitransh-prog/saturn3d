'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const ProductDetail = dynamic(() => import('@/views/ProductDetail'), { ssr: false });

export default function Page() {
  return <ProductDetail />;
}
