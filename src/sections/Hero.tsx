'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Cpu, Layers, ShieldCheck, Zap } from 'lucide-react';
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
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => setPrintProgress(obj.p),
      onComplete: () => {
        setIsPrinting(false);
        setPrintProgress(1.0);
      },
    });
  }, [isPrinting]);

  // Entrance Motion (Clean, professional reveal)
  useEffect(() => {
    if (reducedMotion) {
      setPrintProgress(1.0);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Heading line reveals
      tl.fromTo(
        '.hero-line',
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
        0.1
      );

      // Body copy and CTAs
      tl.fromTo(
        [copyRef.current, ctaGroupRef.current, chipsRef.current, specRef.current],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' },
        0.4
      );

      // 3D Stage Fade-In
      tl.fromTo(
        stageColRef.current,
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out' },
        0.2
      );
    }, heroRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const featureChips = [
    { label: 'Industrial FDM', icon: Layers },
    { label: '12K SLA Resin', icon: Cpu },
    { label: 'Carbon-X PA12', icon: ShieldCheck },
    { label: '±0.04 mm Tolerance', icon: Zap },
  ];

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100svh] lg:h-[100svh] bg-[#0B0D10] text-[#F5F6F8] pt-20 sm:pt-24 pb-6 px-6 sm:px-10 lg:px-16 flex flex-col justify-between overflow-hidden select-none"
      aria-label="Saturn 3D Precision Engineering Hero"
    >
      {/* Background Engineering Blueprint Grid */}
      <div className="absolute inset-0 engineering-grid pointer-events-none" />

      {/* Top Status Eyebrow */}
      <div className="relative z-20 flex items-center justify-between gap-4 pt-1 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
          <span className="font-mono text-xs font-medium text-white/60 tracking-wider uppercase">
            01 // Additive Fabrication Lab
          </span>
        </div>
        <div className="precision-badge text-xs">
          Bhopal Hub // Pan-India 24-48h Dispatch
        </div>
      </div>

      {/* 12-Column Precision Desktop Split Layout */}
      <div className="relative z-20 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-10 my-auto">
        
        {/* Left: Columns 1-6 Editorial Technical Content */}
        <div
          ref={leftColRef}
          className="lg:col-span-6 flex flex-col justify-center items-start z-20 space-y-5"
        >
          {/* Tagline / Subtitle */}
          <div className="font-mono text-xs font-semibold tracking-wider text-[#FF5A1F] uppercase flex items-center gap-2">
            <span>Engineering-Grade Rapid Prototyping</span>
          </div>

          {/* Sentence Case Precision Display Headline */}
          <h1
            ref={h1ContainerRef}
            className="type-display text-white select-none leading-[1.08]"
          >
            <div className="overflow-hidden">
              <span className="hero-line block">
                Precision parts,
              </span>
            </div>
            <div className="overflow-hidden">
              <span className="hero-line block text-white/90">
                fabricated fast<span className="text-[#FF5A1F]">.</span>
              </span>
            </div>
          </h1>

          {/* Verified Technical Copy */}
          <p
            ref={copyRef}
            className="type-body text-[#A3A9B3] text-sm sm:text-base leading-relaxed max-w-[46ch]"
          >
            Industrial FDM, SLA resin, and Carbon-X reinforced polymers fabricated with micron-scale accuracy. 
            Instant CAD quote, zero MOQ, and express nationwide delivery.
          </p>

          {/* Dual Action CTAs */}
          <div
            ref={ctaGroupRef}
            className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1"
          >
            <button
              onClick={() => navigate('/custom-lab')}
              className="btn-precision-primary text-xs sm:text-sm py-3 px-6"
            >
              <span>Launch Custom Lab</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/categories')}
              className="btn-precision-secondary text-xs sm:text-sm py-3 px-5 text-white/90 hover:text-white"
            >
              Browse Parts Catalog
            </button>
          </div>

          {/* Creality-Style Feature Chips Strip */}
          <div
            ref={chipsRef}
            className="flex flex-wrap items-center gap-2 pt-2"
          >
            {featureChips.map((chip, idx) => {
              const Icon = chip.icon;
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-[#A3A9B3] hover:text-white hover:border-white/20 transition-colors"
                >
                  <Icon className="w-3 h-3 text-[#FF5A1F]" />
                  <span>{chip.label}</span>
                </div>
              );
            })}
          </div>

          {/* Inline Monospaced Specs */}
          <div
            ref={specRef}
            className="font-mono text-xs text-white/50 tracking-wide pt-1 flex items-center gap-2"
          >
            <span>±0.04 mm verified</span>
            <span className="text-[#FF5A1F]">&bull;</span>
            <span>24–48h express dispatch</span>
            <span className="text-[#FF5A1F]">&bull;</span>
            <span>All India Express</span>
          </div>
        </div>

        {/* Right: Columns 7-12 3D Studio Stage */}
        <div
          ref={stageColRef}
          className="lg:col-span-6 relative w-full h-[46svh] sm:h-[50svh] lg:h-[72svh] flex flex-col items-center justify-center z-10"
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
