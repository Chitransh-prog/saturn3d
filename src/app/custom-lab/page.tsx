'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const CustomLab = dynamic(() => import('@/views/CustomLab'), { ssr: false });

export default function Page() {
  return <CustomLab />;
}
