'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const OrderSuccessPage = dynamic(() => import('@/views/OrderSuccessPage'), { ssr: false });

export default function Page() {
  return <OrderSuccessPage />;
}
