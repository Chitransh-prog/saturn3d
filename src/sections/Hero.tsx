'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Move3d } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroStage3D from '@/components/HeroStage3D';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const [printProgress, setPrintProgress] = useState(1.0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const stageColRef = useRef<HTMLDivElement>(null);
  const h1ContainerRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);
  const dragHintRef = useRef<HTMLDivElement>(null);
  const introTlRef = useRef<gsap.core.Timeline | null>(null);

  const navigate = useNavigate();

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Trigger reprint callback
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

  // Phase 5 Snappy Intro Timeline (<= 2.4s, once per session, skippable)
  useEffect(() => {
    if (reducedMotion) {
      setPrintProgress(1.0);
      setIsPrinting(false);
      return;
    }

    const seenIntro = sessionStorage.getItem('saturn_hero_intro_seen') === 'true';

    const mm = gsap.matchMedia();

    // Skip intro helper
    const skipIntro = () => {
      if (introTlRef.current) {
        introTlRef.current.progress(1);
      }
      sessionStorage.setItem('saturn_hero_intro_seen', 'true');
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') skipIntro();
    };
    window.addEventListener('keydown', handleKey);

    mm.add('(min-width: 0px)', () => {
      if (seenIntro) {
        // Already seen this session: instant reveal
        setPrintProgress(1.0);
        setIsPrinting(false);
        return;
      }

      setIsPrinting(true);
      setPrintProgress(0);

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('saturn_hero_intro_seen', 'true');
          setIsPrinting(false);
          setPrintProgress(1.0);
        },
      });
      introTlRef.current = tl;

      // 0.0s: H1 lines rise through mask (yPercent 100 -> 0, stagger 0.08, power4.out)
      tl.fromTo(
        '.hero-h1-line',
        { yPercent: 100 },
        { yPercent: 0, duration: 0.85, stagger: 0.08, ease: 'power4.out' },
        0.0
      );

      // 0.3s: Lemon stage disc scales from 0.8 with back.out(1.4)
      tl.fromTo(
        stageColRef.current,
        { scale: 0.85, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.4)' },
        0.3
      );

      // 0.5s: Mecha print-reveal (uCut 0 to 1 in ~1.4s)
      const printObj = { val: 0 };
      tl.to(
        printObj,
        {
          val: 1.0,
          duration: 1.35,
          ease: 'power2.inOut',
          onUpdate: () => setPrintProgress(printObj.val),
        },
        0.5
      );

      // 1.6s: Tagline, copy, CTAs, and spec fade and slide up
      tl.fromTo(
        [taglineRef.current, copyRef.current, ctaGroupRef.current, specRef.current],
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: 'power3.out' },
        1.55
      );
    });

    // Phase 5 Desktop Scroll Scrub (no pin, scrub 0.6)
    mm.add('(min-width: 1024px)', () => {
      if (!heroRef.current || !stageColRef.current) return;

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom 20%',
          scrub: 0.6,
        },
      });

      // Mecha rotates Y 0 -> 110deg
      scrollTl.to(
        stageColRef.current,
        {
          rotateY: 110,
          scale: 1.08,
          ease: 'none',
        },
        0
      );

      // H1 drifts up 40px with slight opacity fade
      if (h1ContainerRef.current) {
        scrollTl.to(
          h1ContainerRef.current,
          {
            y: -40,
            opacity: 0.7,
            ease: 'none',
          },
          0
        );
      }
    });

    return () => {
      window.removeEventListener('keydown', handleKey);
      mm.revert();
    };
  }, [reducedMotion]);

  // First interaction dismisses drag hint smoothly
  const handleFirstInteract = useCallback(() => {
    setHasInteracted(true);
    if (dragHintRef.current) {
      gsap.to(dragHintRef.current, {
        opacity: 0,
        y: 6,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, []);

  return (
    <section
      ref={heroRef}
      data-bg="#FAF7F2"
      data-fg="#0B0B0B"
      className="relative w-full min-h-[100svh] lg:h-[100svh] bg-[#FAF7F2] pt-20 sm:pt-22 pb-4 px-6 sm:px-10 lg:px-16 flex flex-col justify-between overflow-hidden select-none"
      aria-label="Saturn 3D Precision Additive Manufacturing Hero"
    >
      {/* -------------------------------------------------------------
          1. Minimal Top Header Line (Single Hub Sticker)
      ------------------------------------------------------------- */}
      <div className="relative z-20 flex items-center justify-between gap-4 pt-1 pb-2">
        <span className="font-mono text-xs font-bold text-[#0B0B0B]/70 tracking-widest uppercase">
          01 // ADDITIVE FABRICATION LAB
        </span>
        <span className="sticker-minimal text-[11px] sm:text-xs">
          BHOPAL HUB &bull; ALL INDIA
        </span>
      </div>

      {/* -------------------------------------------------------------
          2. Phase 1 Desktop 12-Column Split Hero (Fits 1 Screen)
      ------------------------------------------------------------- */}
      <div className="relative z-20 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center gap-4 lg:gap-8 my-auto">
        
        {/* Left: Columns 1-6 Vertically Centred */}
        <div
          ref={leftColRef}
          className="lg:col-span-6 flex flex-col justify-center items-start z-20 space-y-4"
        >
          {/* Real DOM H1 on TWO lines: "SATURN" (ink) / "3D" (orange) */}
          <h1
            ref={h1ContainerRef}
            className="font-display font-black uppercase select-none tracking-[-0.03em] leading-[0.85] text-[clamp(3.5rem,min(9.5vw,17svh),9.5rem)]"
          >
            <div className="overflow-hidden">
              <span className="hero-h1-line block text-[#0B0B0B]">
                SATURN
              </span>
            </div>
            <div className="overflow-hidden">
              <span className="hero-h1-line block text-[#FF5A1F]">
                3D
              </span>
            </div>
          </h1>

          {/* Solid Orange Tagline: PRINT THE IMPOSSIBLE */}
          <div
            ref={taglineRef}
            className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#FF5A1F] uppercase"
          >
            PRINT THE IMPOSSIBLE
          </div>

          {/* Verified Copy (Max 46ch) */}
          <p
            ref={copyRef}
            className="font-body text-sm sm:text-base text-[#0B0B0B]/85 font-semibold leading-relaxed max-w-[46ch]"
          >
            Industrial FDM, SLA resin, and Carbon-X parts fabricated with micron accuracy.
            Instant CAD quote, zero MOQ, and express nationwide delivery.
          </p>

          {/* CTAs: Primary brutalist button + Secondary plain underline link */}
          <div
            ref={ctaGroupRef}
            className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1"
          >
            <button
              onClick={() => navigate('/custom-lab')}
              className="btn-brutal btn-brutal-orange text-xs sm:text-sm py-3 px-6 flex items-center gap-2.5 cursor-pointer shadow-brutal-sm hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <span>LAUNCH CUSTOM LAB</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={() => navigate('/categories')}
              className="font-mono text-xs sm:text-sm font-bold text-[#0B0B0B] underline underline-offset-4 hover:text-[#FF5A1F] transition-colors cursor-pointer py-2"
            >
              BROWSE CATALOG
            </button>
          </div>

          {/* Inline Mono Spec Line (No Box) */}
          <div
            ref={specRef}
            className="font-mono text-xs font-bold text-[#0B0B0B]/70 tracking-wide pt-2"
          >
            <span>&plusmn;0.04 mm</span>
            <span className="mx-2 text-[#FF5A1F]">&bull;</span>
            <span>24&ndash;48h dispatch</span>
            <span className="mx-2 text-[#FF5A1F]">&bull;</span>
            <span>All India</span>
          </div>
        </div>

        {/* Right: Columns 7-12 3D Stage (Occupies 70-75% Hero Height) */}
        <div
          ref={stageColRef}
          className="lg:col-span-6 relative w-full h-[46svh] sm:h-[50svh] lg:h-[72svh] flex flex-col items-center justify-center p-2 sm:p-4 z-10"
        >
          {/* Canvas container with 10% breathing room, no border crop */}
          <div className="w-full h-full relative">
            <React.Suspense fallback={null}>
              <HeroStage3D
                printProgress={printProgress}
                isPrinting={isPrinting}
                reducedMotion={reducedMotion}
                onFirstInteract={handleFirstInteract}
                onTriggerReprint={triggerReprint}
              />
            </React.Suspense>
          </div>

          {/* Interaction Drag Hint: Fades out after first interaction */}
          <div
            ref={dragHintRef}
            className={`absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#0B0B0B]/60 tracking-wider pointer-events-none transition-opacity duration-300 ${
              hasInteracted ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Move3d className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>DRAG TO ROTATE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
