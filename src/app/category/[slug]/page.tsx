'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const CategoryPage = dynamic(() => import('@/views/CategoryPage'), { ssr: false });

export default function Page() {
  return <CategoryPage />;
}
