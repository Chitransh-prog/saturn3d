import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Precision Studio Overhauled Sections
import Preloader from '@/components/Preloader';
import Hero from '@/sections/Hero';
import StickySubNav from '@/components/StickySubNav';
import CapabilityStrip from '@/sections/LogoTicker';
import TechResultsDuo from '@/sections/TechResultsDuo';
import PrinterFleet from '@/sections/PrinterFleet';
import TheLab from '@/sections/TheLab';
import ExploreMaterials from '@/sections/ExploreMaterials';
import MakeItYours from '@/sections/MakeItYours';
import UseItFor from '@/sections/UseItFor';
import HowItsMade from '@/sections/HowItsMade';
import BulkRuns from '@/sections/BulkRuns';
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

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    return () => {
      clearTimeout(timer);
      if (rootLenis && !prefersReducedMotion) {
        rootLenis.off('scroll', ScrollTrigger.update);
      }
    };
  }, [preloaderDone]);

  const subNavItems = [
    { id: 'hardware', label: 'Hardware Fleet' },
    { id: 'the-lab', label: 'Showcase' },
    { id: 'materials', label: 'Materials & Specs' },
    { id: 'configurator', label: 'Instant Quote' },
    { id: 'how-it-works', label: 'Pipeline' },
    { id: 'proof', label: 'Real Prints' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div ref={containerRef} className="flex flex-col w-full relative bg-[#F5F6F8]">
      {/* 00. Preloader */}
      <Preloader onComplete={() => setPreloaderDone(true)} />

      {/* 01. Hero: Precision Studio Dark 3D Stage */}
      <div id="overview">
        <Hero />
      </div>

      {/* Sticky Sub-Navigation Bar (Creality-Style) */}
      <StickySubNav items={subNavItems} quoteCtaHref="/custom-lab" quoteCtaLabel="Instant CAD Quote" />

      {/* 02. Capability Telemetry Strip (4 Inline Metrics) */}
      <CapabilityStrip />

      {/* 03. Technology & Results Duo Showcase (Carbon-Style) */}
      <TechResultsDuo />

      {/* 04. Hardware Fleet Showcase (Creality / SparkX Style) */}
      <div id="hardware">
        <PrinterFleet />
      </div>

      {/* 05. The Lab: Powered by Saturn Cut-Out Showcase + Intent Selector */}
      <TheLab />

      {/* 04. Explore Materials: Deep Graphite Section + Process Comparison Table */}
      <div id="specs">
        <ExploreMaterials />
      </div>

      {/* 05. Instant CAD Quote Configurator */}
      <MakeItYours />

      {/* 06. Applications & Industrial Case Studies */}
      <UseItFor />

      {/* 07. Methodology & 5-Stage Fabrication Pipeline */}
      <HowItsMade />

      {/* 08. Small-Batch Production Volume Calculator */}
      <BulkRuns />

      {/* 09. Real Prints Showcase with Verified Shop Telemetry & Testimonials */}
      <div id="gallery">
        <ProofGallery />
      </div>

      {/* 10. Frequently Answered Questions Accordion */}
      <div id="faq">
        <FAQSection />
      </div>
    </div>
  );
}
