'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const LoginPage = dynamic(() => import('@/views/LoginPage'), { ssr: false });

export default function Page() {
  return <LoginPage />;
}
