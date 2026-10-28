'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const RegisterPage = dynamic(() => import('@/views/RegisterPage'), { ssr: false });

export default function Page() {
  return <RegisterPage />;
}
