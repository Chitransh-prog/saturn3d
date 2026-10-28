'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/sonner';
import Navigation from '@/components/Navigation';
import Cart from '@/components/Cart';
import Footer from '@/sections/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { useAuthStore } from '@/store/authStore';
import Lenis from 'lenis';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const isAdminOrAuth = pathname.startsWith('/admin') || pathname === '/login' || pathname === '/register';

  // 1. Initialize Lenis smooth scroll & AOS Animation Engine
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize AOS
    AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      delay: 0,
      disable: prefersReducedMotion,
    });

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    (window as any).__lenis = lenis;

    lenis.on('scroll', () => {
      AOS.refresh();
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  // Refresh AOS on navigation
  useEffect(() => {
    const t = setTimeout(() => {
      AOS.refresh();
    }, 150);
    return () => clearTimeout(t);
  }, [pathname]);

  // 2. Restore auth session on app mount
  useEffect(() => {
    useAuthStore.getState().restoreSession();
  }, []);

  return (
    <>
      <div className="grain-overlay" />
      
      {!isAdminOrAuth && <Navigation />}
      <Cart />
      {!isAdminOrAuth && <FloatingWhatsApp />}

      <main className="relative z-0 min-h-screen">
        {children}
      </main>

      {!isAdminOrAuth && <Footer />}

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#FAF7F2',
            border: '2px solid #0B0B0B',
            borderRadius: '4px',
            boxShadow: '2.5px 2.5px 0px #0B0B0B',
            color: '#0B0B0B',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
          },
        }}
      />
    </>
  );
}
