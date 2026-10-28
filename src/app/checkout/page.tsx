'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const CheckoutPage = dynamic(() => import('@/views/CheckoutPage'), { ssr: false });

export default function Page() {
  return <CheckoutPage />;
}
