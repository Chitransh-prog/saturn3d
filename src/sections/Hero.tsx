'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Layers, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroStage3D from '@/components/HeroStage3D';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const [printProgress, setPrintProgress] = useState(1.0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const stageColRef = useRef<HTMLDivElement>(null);
  const h1ContainerRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const triggerReprint = useCallback(() => {
    if (isPrinting) return;
    setIsPrinting(true);
    setPrintProgress(0);

    const obj = { p: 0 };
    gsap.to(obj, {
      p: 1.0,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => setPrintProgress(obj.p),
      onComplete: () => {
        setIsPrinting(false);
        setPrintProgress(1.0);
      },
    });
  }, [isPrinting]);

  // Clean reveal entrance
  useEffect(() => {
    if (reducedMotion) {
      setPrintProgress(1.0);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        '.hero-line',
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' },
        0.1
      );

      tl.fromTo(
        [copyRef.current, ctaGroupRef.current, chipsRef.current, specRef.current],
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
        0.35
      );

      tl.fromTo(
        stageColRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' },
        0.2
      );
    }, heroRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100svh] lg:h-[100svh] bg-gradient-to-b from-white via-[#F8F9FC] to-[#F1F3F7] text-neutral-900 pt-20 sm:pt-24 pb-12 lg:pb-8 px-4 sm:px-8 lg:px-16 flex flex-col justify-between overflow-x-clip select-none"
      aria-label="Saturn 3D Printing Service Central India"
    >
      {/* Precision Blueprint Grid */}
      <div className="absolute inset-0 engineering-grid pointer-events-none opacity-60" />

      {/* 12-Column Main Hero Grid */}
      <div className="relative z-20 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 my-auto py-2 sm:py-4">
        
        {/* Left: Columns 1-6 Clean SaaS Value Proposition */}
        <div
          ref={leftColRef}
          className="lg:col-span-6 flex flex-col justify-center items-start z-20 space-y-4 sm:space-y-6"
        >
          {/* Clean SaaS Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-[11px] sm:text-xs text-neutral-700 font-medium shadow-2xs max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#412f91] animate-pulse shrink-0" />
            <span className="truncate">Central India&apos;s Precision Hub &bull; Bhopal &amp; Indore</span>
          </div>

          {/* Primary H1 Keyword Headline - Mobile Optimized Clamp */}
          <h1
            ref={h1ContainerRef}
            className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 select-none leading-[1.12] sm:leading-[1.08] font-sans"
          >
            <div className="overflow-hidden">
              <span className="hero-line block">
                Industrial 3D printing.
              </span>
            </div>
            <div className="overflow-hidden">
              <span className="hero-line block text-neutral-400">
                Engineered for production.
              </span>
            </div>
          </h1>

          {/* Direct, Concise, High-Clarity Copy */}
          <p
            ref={copyRef}
            className="text-neutral-600 text-xs sm:text-sm lg:text-base leading-relaxed max-w-[50ch]"
          >
            Turn CAD models into precision functional parts. High-speed CoreXY FDM, 12K optical SLA resin, and Carbon-X PA12 composites with &plusmn;0.04&nbsp;mm repeatability &mdash; dispatched across Central India in 24&ndash;48 hours with zero MOQ.
          </p>

          {/* Core Action CTAs - Responsive Full Width on Mobile */}
          <div
            ref={ctaGroupRef}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto pt-1"
          >
            <button
              onClick={() => navigate('/custom-lab')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#412f91] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md shadow-[#412f91]/20 hover:bg-[#342575] transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <span>Upload CAD for Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://wa.me/918889988874?text=Hi%20Saturn%203D%2C%20I%20need%20an%20instant%203D%20printing%20quote"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all duration-200 active:scale-[0.98]"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>WhatsApp (+91 88899 88874)</span>
            </a>

            <button
              onClick={() => navigate('/categories')}
              className="inline-flex items-center justify-center px-4 py-3.5 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-medium text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 shadow-2xs cursor-pointer"
            >
              Catalog
            </button>
          </div>

          {/* Clean SaaS 4-Metric Strip */}
          <div
            ref={chipsRef}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-3 w-full max-w-lg border-t border-neutral-200/80"
          >
            <div className="p-2 sm:p-0 rounded-lg bg-white/60 sm:bg-transparent border border-neutral-200/50 sm:border-0">
              <div className="text-sm sm:text-lg font-bold text-neutral-900 font-mono tracking-tight">&plusmn;0.04 mm</div>
              <div className="text-[10px] sm:text-[11px] text-neutral-500 font-medium">Precision Tolerance</div>
            </div>
            <div className="p-2 sm:p-0 rounded-lg bg-white/60 sm:bg-transparent border border-neutral-200/50 sm:border-0">
              <div className="text-sm sm:text-lg font-bold text-neutral-900 font-mono tracking-tight">24&ndash;48h</div>
              <div className="text-[10px] sm:text-[11px] text-neutral-500 font-medium">Express Dispatch</div>
            </div>
            <div className="p-2 sm:p-0 rounded-lg bg-white/60 sm:bg-transparent border border-neutral-200/50 sm:border-0">
              <div className="text-sm sm:text-lg font-bold text-neutral-900 font-mono tracking-tight">0 MOQ</div>
              <div className="text-[10px] sm:text-[11px] text-neutral-500 font-medium">No Minimum Units</div>
            </div>
            <div className="p-2 sm:p-0 rounded-lg bg-white/60 sm:bg-transparent border border-neutral-200/50 sm:border-0">
              <div className="text-sm sm:text-lg font-bold text-neutral-900 font-mono tracking-tight">15+</div>
              <div className="text-[10px] sm:text-[11px] text-neutral-500 font-medium">Certified Polymers</div>
            </div>
          </div>
        </div>

        {/* Right: Columns 7-12 3D Printer Stage */}
        <div
          ref={stageColRef}
          className="lg:col-span-6 relative w-full h-[360px] sm:h-[440px] lg:h-[72svh] flex flex-col items-center justify-center z-10"
        >
          <div className="w-full h-full relative">
            <React.Suspense fallback={null}>
              <HeroStage3D
                printProgress={printProgress}
                isPrinting={isPrinting}
                reducedMotion={reducedMotion}
                onTriggerReprint={triggerReprint}
              />
            </React.Suspense>
          </div>
        </div>

      </div>
    </section>
  );
}
