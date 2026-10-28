'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import Home with SSR disabled because of Three.js / Canvas & GSAP ScrollTrigger
const Home = dynamic(() => import('@/views/Home'), { ssr: false });

export default function Page() {
  return <Home />;
}
