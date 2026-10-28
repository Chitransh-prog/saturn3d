'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const OrdersPage = dynamic(() => import('@/views/OrdersPage'), { ssr: false });

export default function Page() {
  return <OrdersPage />;
}
