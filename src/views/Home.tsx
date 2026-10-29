'use client';

import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Precision Studio Streamlined Sections
import Preloader from '@/components/Preloader';
import Hero from '@/sections/Hero';
import CapabilityStrip from '@/sections/LogoTicker';
import TechResultsDuo from '@/sections/TechResultsDuo';
import FeaturedProductsViewer from '@/sections/FeaturedProductsViewer';
import PrinterFleet from '@/sections/PrinterFleet';
import ExploreMaterials from '@/sections/ExploreMaterials';
import MakeItYours from '@/sections/MakeItYours';
import ProofGallery from '@/sections/ProofGallery';
import FAQSection from '@/sections/FAQSection';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [preloaderDone, setPreloaderDone] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Sync ScrollTrigger with Root Lenis instance
    const rootLenis = (window as any).__lenis as Lenis | undefined;
    if (rootLenis && !prefersReducedMotion) {
      rootLenis.on('scroll', ScrollTrigger.update);
    }

    // Scroll Animations across all sections
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // 1. Smooth Fade-Up for Section Headers & Key Blocks
      const revealElements = containerRef.current?.querySelectorAll('.scroll-reveal');
      revealElements?.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // 2. Staggered Entrance for Cards, Grids, and Lists
      const staggerContainers = containerRef.current?.querySelectorAll('.scroll-stagger');
      staggerContainers?.forEach((container) => {
        const items = container.children;
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, containerRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timer);
      ctx.revert();
      if (rootLenis && !prefersReducedMotion) {
        rootLenis.off('scroll', ScrollTrigger.update);
      }
    };
  }, [preloaderDone]);

  const subNavItems = [
    { id: 'products', label: '3D Products' },
    { id: 'hardware', label: 'Hardware Fleet' },
    { id: 'specs', label: 'Materials & Specs' },
    { id: 'configurator', label: 'Instant Quote' },
    { id: 'gallery', label: 'Real Prints' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div ref={containerRef} className="flex flex-col w-full relative bg-[#F5F6F8]">
      {/* 00. Preloader */}
      <Preloader onComplete={() => setPreloaderDone(true)} />

      {/* 01. Hero: Precision Studio Dark 3D Stage with Active Printing */}
      <div id="overview">
        <Hero />
      </div>

      {/* 02. Capability Telemetry Strip (4 Inline Metrics) */}
      <CapabilityStrip />

      {/* 03. Technology & Results Duo Showcase (Carbon-Style) */}
      <TechResultsDuo />

      {/* 03.5 3D Component Inspection Workstation */}
      <div id="products">
        <FeaturedProductsViewer />
      </div>

      {/* 04. Hardware Fleet Showcase (Creality / SparkX Style) */}
      <div id="hardware">
        <PrinterFleet />
      </div>

      {/* 05. Explore Materials: Deep Graphite Section + Process Comparison Table */}
      <div id="specs">
        <ExploreMaterials />
      </div>

      {/* 06. Instant CAD Quote Configurator */}
      <MakeItYours />

      {/* 07. Real Prints Showcase with Verified Shop Telemetry & Testimonials */}
      <div id="gallery">
        <ProofGallery />
      </div>

      {/* 08. Frequently Answered Questions Accordion */}
      <div id="faq">
        <FAQSection />
      </div>
    </div>
  );
}
