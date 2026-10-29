'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Layers, Cpu, ShieldCheck, Zap, MapPin } from 'lucide-react';
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

  const featureChips = [
    { label: 'Industrial FDM & CoreXY', icon: Layers },
    { label: '12K SLA Photopolymer Resin', icon: Cpu },
    { label: 'Carbon-X PA12 Composite', icon: ShieldCheck },
    { label: '±0.04 mm Dimensional Precision', icon: Zap },
  ];

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100svh] lg:h-[100svh] bg-[#0B0D10] text-[#F5F6F8] pt-20 sm:pt-24 pb-6 px-6 sm:px-10 lg:px-16 flex flex-col justify-between overflow-hidden select-none"
      aria-label="Saturn 3D Printing Service Bhopal India"
    >
      {/* Precision Blueprint Grid */}
      <div className="absolute inset-0 engineering-grid pointer-events-none" />

      {/* Top Status & Geotag Strip */}
      <div className="relative z-20 flex items-center justify-between gap-4 pt-1 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
          <span className="font-mono text-xs font-medium text-white/70 tracking-wider uppercase">
            SATURN 3D // PRECISION ADDITIVE MANUFACTURING LAB
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">
          <MapPin className="w-3 h-3 text-[#FF5A1F]" />
          <span>Govindpura, Bhopal Hub • 24–48h Pan-India Air Dispatch</span>
        </div>
      </div>

      {/* 12-Column Main Hero Grid */}
      <div className="relative z-20 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-10 my-auto">
        
        {/* Left: Columns 1-6 High-Rank Technical Editorial Content */}
        <div
          ref={leftColRef}
          className="lg:col-span-6 flex flex-col justify-center items-start z-20 space-y-5"
        >
          {/* Eyebrow / SEO Category Tag */}
          <div className="font-mono text-xs font-semibold tracking-wider text-[#FF5A1F] uppercase flex items-center gap-2">
            <span>Online 3D Printing Service • Bhopal & All India</span>
          </div>

          {/* Primary H1 Keyword Headline */}
          <h1
            ref={h1ContainerRef}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white select-none leading-[1.08] font-sans"
          >
            <div className="overflow-hidden">
              <span className="hero-line block">
                Industrial 3D Printing,
              </span>
            </div>
            <div className="overflow-hidden">
              <span className="hero-line block text-white/90">
                In Bhopal & All India<span className="text-[#FF5A1F]">.</span>
              </span>
            </div>
          </h1>

          {/* Direct, Concise, High-Authority Copy */}
          <p
            ref={copyRef}
            className="text-[#A3A9B3] text-sm sm:text-base leading-relaxed max-w-[48ch]"
          >
            Central India’s premier additive manufacturing facility. Precision FDM, 12K optical SLA resin, and Carbon-X PA12 printing with ±0.04&nbsp;mm accuracy. Upload your CAD file for an instant price quote, zero minimum order quantity, and 24–48h express nationwide delivery.
          </p>

          {/* Core Action CTAs */}
          <div
            ref={ctaGroupRef}
            className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1"
          >
            <button
              onClick={() => navigate('/custom-lab')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF5A1F] text-white text-sm font-medium tracking-wide shadow-lg shadow-[#FF5A1F]/25 hover:bg-[#e04e18] transition-all duration-200 active:scale-95"
            >
              <span>Instant CAD Slicing Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/categories')}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              Browse Engineering Catalog
            </button>
          </div>

          {/* Technology & Capability Badges */}
          <div
            ref={chipsRef}
            className="flex flex-wrap items-center gap-2 pt-1"
          >
            {featureChips.map((chip, idx) => {
              const Icon = chip.icon;
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-[#A3A9B3]"
                >
                  <Icon className="w-3 h-3 text-[#FF5A1F]" />
                  <span>{chip.label}</span>
                </div>
              );
            })}
          </div>

          {/* Telemetry & Geographic Specs Line */}
          <div
            ref={specRef}
            className="font-mono text-xs text-white/50 tracking-wide pt-1 flex flex-wrap items-center gap-2"
          >
            <span>Govindpura Hub, Bhopal</span>
            <span className="text-[#FF5A1F]">&bull;</span>
            <span>±0.04 mm verified</span>
            <span className="text-[#FF5A1F]">&bull;</span>
            <span>Zero MOQ</span>
            <span className="text-[#FF5A1F]">&bull;</span>
            <span>Express Air Dispatch: Mumbai, Delhi, Bengaluru, Pune, Hyderabad</span>
          </div>
        </div>

        {/* Right: Columns 7-12 3D Printer Stage */}
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
