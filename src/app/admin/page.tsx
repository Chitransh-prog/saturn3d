'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';
import AdminLogin from '@/components/admin/AdminLogin';

const AdminPanel = dynamic(() => import('@/views/AdminPanel'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-paper flex items-center justify-center font-mono">
      <div className="p-8 border-3 border-ink bg-white shadow-brutal flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
        <span className="text-xs font-black uppercase tracking-wider text-ink">
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

  // Show loading indicator until client store rehydrates
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center font-mono">
        <div className="p-8 border-3 border-ink bg-white shadow-brutal flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          <span className="text-xs font-black uppercase tracking-wider text-ink">
            Initializing Saturn Master Console...
          </span>
        </div>
      </div>
    );
  }

  // If authenticated as an administrator, render Admin Panel directly
  if (isAuthenticated && isAdmin) {
    return <AdminPanel />;
  }

  // Otherwise, render the dedicated Admin Master Console Login directly on /admin
  return <AdminLogin />;
}
