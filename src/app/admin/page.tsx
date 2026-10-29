'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';
import AdminLogin from '@/components/admin/AdminLogin';

const AdminPanel = dynamic(() => import('@/views/AdminPanel'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#0B0D10] flex items-center justify-center font-body">
      <div className="p-8 card-precision-dark flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
        <span className="font-mono text-xs uppercase tracking-wider text-white/70">
          Authenticating Master Console...
        </span>
      </div>
    </div>
  ),
});

export default function AdminPage() {
  const { isAuthenticated, isAdmin, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0D10] flex items-center justify-center font-body">
        <div className="p-8 card-precision-dark flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
          <span className="font-mono text-xs uppercase tracking-wider text-white/70">
            Initializing Saturn Master Console...
          </span>
        </div>
      </div>
    );
  }

  if (isAuthenticated && isAdmin) {
    return <AdminPanel />;
  }

  return <AdminLogin />;
}
