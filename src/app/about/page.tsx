'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const About = dynamic(() => import('@/views/About'), { ssr: false });

export default function Page() {
  return <About />;
}
