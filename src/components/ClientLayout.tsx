'use client';

import React, { useEffect, useRef } from 'react';
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
  const progressBarRef = useRef<HTMLDivElement>(null);
  const isAdminOrAuth = pathname.startsWith('/admin') || pathname === '/login' || pathname === '/register';

  // 1. Initialize Lenis smooth scroll, GSAP ScrollTrigger & AOS Animation Engine
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize AOS with lightweight, performant settings
    AOS.init({
      duration: 600,
      easing: 'ease-out-cubic',
      once: true,
      offset: 40,
      delay: 0,
      disable: prefersReducedMotion,
    });

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    (window as any).__lenis = lenis;

    let progressTrigger: any = null;
    let updateLenis: ((time: number) => void) | null = null;
    let isCleanedUp = false;

    // Load GSAP & ScrollTrigger strictly on client side to avoid SSR chunk issues
    if (!prefersReducedMotion) {
      Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]).then(([{ gsap }, { ScrollTrigger }]) => {
        if (isCleanedUp) return;

        gsap.registerPlugin(ScrollTrigger);

        // Synchronize AOS and ScrollTrigger on scroll
        lenis.on('scroll', () => {
          AOS.refresh();
          ScrollTrigger.update();
        });

        // Hook Lenis into GSAP ticker for 120fps sync
        updateLenis = (time: number) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(updateLenis);
        gsap.ticker.lagSmoothing(0);

        // Subtle reading scroll progress bar (GPU accelerated scaleX)
        if (progressBarRef.current) {
          progressTrigger = ScrollTrigger.create({
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
              if (progressBarRef.current) {
                progressBarRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          });
        }
      }).catch((err) => {
        console.warn('[Animation] Failed to load GSAP on client:', err);
      });
    }

    return () => {
      isCleanedUp = true;
      progressTrigger?.kill();
      if (updateLenis) {
        import('gsap').then(({ gsap }) => {
          if (updateLenis) gsap.ticker.remove(updateLenis);
        }).catch(() => {});
      }
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  // Refresh AOS & ScrollTrigger on page navigation
  useEffect(() => {
    const t = setTimeout(() => {
      AOS.refresh();
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      }).catch(() => {});
    }, 150);
    return () => clearTimeout(t);
  }, [pathname]);

  // 2. Restore auth session on app mount
  useEffect(() => {
    useAuthStore.getState().restoreSession();
  }, []);

  return (
    <>
      {/* Precision Scroll Progress Hairline Indicator */}
      {!isAdminOrAuth && (
        <div
          ref={progressBarRef}
          className="fixed top-0 left-0 right-0 h-[2px] bg-[#412f91] origin-left z-[9999] pointer-events-none transform-gpu"
          style={{ transform: 'scaleX(0)' }}
          aria-hidden="true"
        />
      )}

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
        richColors 
        theme="light"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            border: '1px solid rgba(11, 13, 16, 0.12)',
            color: '#111215',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
          },
        }}
      />
    </>
  );
}
