import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Phase 2 Page Flow Sections
import Preloader from '@/components/Preloader';
import Hero from '@/sections/Hero';
import LogoTicker from '@/sections/LogoTicker';
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

    // 1. Sync ScrollTrigger with Root Lenis instance
    const rootLenis = (window as any).__lenis as Lenis | undefined;
    if (rootLenis && !prefersReducedMotion) {
      rootLenis.on('scroll', ScrollTrigger.update);
    }

    // 2. Section Color Morphing via data-bg and data-fg
    const sections = document.querySelectorAll<HTMLElement>('[data-bg]');
    const colorTriggers: ScrollTrigger[] = [];

    sections.forEach((sec) => {
      const bg = sec.getAttribute('data-bg');
      const fg = sec.getAttribute('data-fg');

      if (bg) {
        const trigger = ScrollTrigger.create({
          trigger: sec,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => {
            document.body.style.backgroundColor = bg;
            if (fg) document.body.style.color = fg;
          },
          onEnterBack: () => {
            document.body.style.backgroundColor = bg;
            if (fg) document.body.style.color = fg;
          },
        });
        colorTriggers.push(trigger);
      }
    });

    // 3. Desktop Magnetic Buttons Helper
    const isDesktop = window.innerWidth >= 1024;
    const magneticCleanups: Array<() => void> = [];

    if (isDesktop && !prefersReducedMotion) {
      const brutalButtons = document.querySelectorAll<HTMLElement>('.btn-brutal');
      brutalButtons.forEach((btn) => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, {
            x: x * 0.18,
            y: y * 0.18,
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.45,
            ease: 'power3.out',
          });
        };

        btn.addEventListener('mousemove', handleMouseMove);
        btn.addEventListener('mouseleave', handleMouseLeave);

        magneticCleanups.push(() => {
          btn.removeEventListener('mousemove', handleMouseMove);
          btn.removeEventListener('mouseleave', handleMouseLeave);
        });
      });
    }

    // 4. Refresh ScrollTrigger after font & 3D mount
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    return () => {
      clearTimeout(timer);
      if (rootLenis && !prefersReducedMotion) {
        rootLenis.off('scroll', ScrollTrigger.update);
      }
      colorTriggers.forEach((t) => t.kill());
      magneticCleanups.forEach((c) => c());
    };
  }, [preloaderDone]);

  return (
    <div ref={containerRef} className="flex flex-col w-full relative">
      {/* 00. Preloader (Shown once per session, max 2.5s, skippable) */}
      <Preloader onComplete={() => setPreloaderDone(true)} />

      {/* 01. Hero: Scroll-Scrubbed 3D Mecha + Saturn Ring */}
      <Hero />

      {/* Marquee Ticker: Single Caution Marquee with Scroll Velocity Tracking */}
      <LogoTicker />

      {/* 02. The Lab: Services / Catalog Open List with Underlined Tabs & Ghost 3D */}
      <TheLab />

      {/* 03. Explore Every Material: Pinned 01-05 Selector & Real-Time PBR Shaders */}
      <ExploreMaterials />

      {/* 04. Make It Yours: Instant CAD Quote Configurator on Tint Band */}
      <MakeItYours />

      {/* 05. Use It For: Horizontal Pinned Strip with Speed Parallax */}
      <UseItFor />

      {/* 06. How It's Made: 5-Stage Methodological Pipeline with 3D Layer Reveal */}
      <HowItsMade />

      {/* 07. Bulk Runs: Minimalist Parts x Quantity Volume Calculator */}
      <BulkRuns />

      {/* 08. Proof: Borderless Masonry Gallery of Genuine Prints & Client Proof */}
      <ProofGallery />

      {/* 09. FAQ: 1px Hairline Technical Accordion */}
      <FAQSection />
    </div>
  );
}
