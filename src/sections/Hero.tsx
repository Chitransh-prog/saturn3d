import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Move3d } from 'lucide-react';
import HeroStage3D from '@/components/HeroStage3D';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const [printProgress, setPrintProgress] = useState(1.0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const heroSectionRef = useRef<HTMLElement>(null);
  const stageWrapperRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const enteringLabelRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);
  }, []);

  // GSAP ScrollTrigger Scrub: Pin hero ~150vh on desktop
  useEffect(() => {
    if (reducedMotion) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      if (!heroSectionRef.current || !stageWrapperRef.current) return;

      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top top',
          end: 'bottom 15%',
          scrub: 0.6,
        },
      });

      // 1. Mecha rotates up to 180 deg & scales slightly (dolly in ~15%)
      heroTl.to(stageWrapperRef.current, {
        rotationY: 180,
        scale: 1.15,
        ease: 'none',
      }, 0);

      // 2. Headline letters drift apart (x/y/opacity)
      heroTl.to('.hero-letter-s', { x: -90, y: -20, opacity: 0.2, ease: 'none' }, 0);
      heroTl.to('.hero-letter-a', { x: -55, y: -10, opacity: 0.3, ease: 'none' }, 0);
      heroTl.to('.hero-letter-t', { x: -20, y: -30, opacity: 0.4, ease: 'none' }, 0);
      heroTl.to('.hero-letter-u', { x: 20, y: -30, opacity: 0.4, ease: 'none' }, 0);
      heroTl.to('.hero-letter-r', { x: 55, y: -10, opacity: 0.3, ease: 'none' }, 0);
      heroTl.to('.hero-letter-n', { x: 90, y: -20, opacity: 0.2, ease: 'none' }, 0);
      heroTl.to('.hero-letter-3d', { x: 120, y: 15, opacity: 0.2, ease: 'none' }, 0);

      // 3. CTA group and subtitle fade and slide down slightly
      if (ctaGroupRef.current) {
        heroTl.to(ctaGroupRef.current, {
          y: 30,
          opacity: 0.2,
          ease: 'power2.in',
        }, 0.3);
      }
    });

    // Mobile GSAP Scrub Timeline (< 1024px)
    mm.add('(max-width: 1023px)', () => {
      if (!heroSectionRef.current || !stageWrapperRef.current) return;

      const mobileTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      // Mecha rotates smoothly as user scrolls on mobile
      mobileTl.to(stageWrapperRef.current, {
        rotationY: 120,
        scale: 1.08,
        ease: 'none',
      }, 0);

      // Headline letters drift apart proportionally on mobile
      mobileTl.to('.hero-letter-s', { x: -40, opacity: 0.25, ease: 'none' }, 0);
      mobileTl.to('.hero-letter-a', { x: -22, opacity: 0.35, ease: 'none' }, 0);
      mobileTl.to('.hero-letter-t', { x: -8, opacity: 0.45, ease: 'none' }, 0);
      mobileTl.to('.hero-letter-u', { x: 8, opacity: 0.45, ease: 'none' }, 0);
      mobileTl.to('.hero-letter-r', { x: 22, opacity: 0.35, ease: 'none' }, 0);
      mobileTl.to('.hero-letter-n', { x: 40, opacity: 0.25, ease: 'none' }, 0);
      mobileTl.to('.hero-letter-3d', { x: 55, y: 10, opacity: 0.25, ease: 'none' }, 0);

      // CTA group fades slightly as scrolling down
      if (ctaGroupRef.current) {
        mobileTl.to(ctaGroupRef.current, {
          y: 25,
          opacity: 0.2,
          ease: 'none',
        }, 0.25);
      }
    });

    return () => mm.revert();
  }, [reducedMotion]);

  // Letters of "SATURN"
  const saturnChars = ['S', 'A', 'T', 'U', 'R', 'N'];
  const letterClasses = [
    'hero-letter-s',
    'hero-letter-a',
    'hero-letter-t',
    'hero-letter-u',
    'hero-letter-r',
    'hero-letter-n',
  ];

  return (
    <section
      ref={heroSectionRef}
      data-bg="#FFF4E0"
      data-fg="#0B0B0B"
      className="relative w-full min-h-screen bg-[#FFF4E0] pt-20 sm:pt-24 pb-12 px-6 sm:px-10 lg:px-16 flex flex-col justify-between overflow-hidden select-none"
      aria-label="Saturn 3D Precision Additive Manufacturing Hero"
    >
      {/* -------------------------------------------------------------
          1. Top Minimal Eyebrow & Single Tag (Strict De-boxing Rule)
      ------------------------------------------------------------- */}
      <div data-aos="fade-down" data-aos-duration="600" className="relative z-30 flex items-center justify-between gap-4 pt-2">
        <span className="type-mono-eyebrow text-[#0B0B0B]/70">
          01 // ADDITIVE FABRICATION LAB
        </span>
        <span className="sticker-minimal">
          BHOPAL HUB &bull; ALL INDIA
        </span>
      </div>

      {/* -------------------------------------------------------------
          2. Hero Centerpiece: Giant Drifting Headline & 3D Mecha Scene
      ------------------------------------------------------------- */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center my-2 sm:my-4 min-h-[340px] sm:min-h-[480px] lg:min-h-[600px]">
        
        {/* Giant Headline: "SATURN 3D" (Sits behind 3D Canvas, letters drift on scrub) */}
        <h1
          ref={headlineRef}
          data-aos="fade-up"
          data-aos-duration="800"
          className="absolute z-10 inset-x-0 top-[12%] sm:top-[8%] flex items-center justify-center text-center font-display font-black text-[#0B0B0B] uppercase select-none pointer-events-none leading-[0.85] tracking-[-0.04em] text-[clamp(2.9rem,13vw,15.5rem)]"
        >
          <div className="flex flex-col sm:flex-row items-center gap-0 sm:gap-4 md:gap-8">
            <div className="flex">
              {saturnChars.map((char, i) => (
                <span
                  key={char}
                  className={`hero-letter ${letterClasses[i]} inline-block`}
                >
                  {char}
                </span>
              ))}
            </div>
            <div className="flex">
              <span className="hero-letter hero-letter-3d inline-block text-[#FF5A1F]">
                3D
              </span>
            </div>
          </div>
        </h1>

        {/* 3D Mecha Canvas Viewport (Transparent background, no bulky yellow box) */}
        <div
          ref={stageWrapperRef}
          data-aos="zoom-in"
          data-aos-duration="900"
          data-aos-delay="150"
          className="relative z-20 w-full h-[340px] sm:h-[480px] lg:h-[600px] pointer-events-auto flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <React.Suspense fallback={null}>
            <HeroStage3D
              printProgress={printProgress}
              isPrinting={isPrinting}
              reducedMotion={reducedMotion}
            />
          </React.Suspense>

          <span className="sr-only">
            Interactive 3D model of Saturn 3D white additive mecha character surrounded by a Saturn planetary ring.
          </span>
        </div>

        {/* Subtle Drag Hint */}
        <div data-aos="fade-up" data-aos-delay="300" className="relative z-30 -mt-4 flex items-center gap-2 font-mono text-xs font-bold text-[#0B0B0B]/60 tracking-wider">
          <Move3d className="w-3.5 h-3.5 text-[#FF5A1F]" />
          <span>DRAG 360&deg;</span>
        </div>
      </div>

      {/* -------------------------------------------------------------
          3. Bottom Editorial Copy + Dual CTAs + Single Inline Mono Spec
          (Strict De-boxing: No stats box, no chip clutter)
      ------------------------------------------------------------- */}
      <div
        ref={ctaGroupRef}
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="200"
        className="relative z-30 pt-6 hairline-t flex flex-col md:flex-row items-start md:items-end justify-between gap-6"
      >
        {/* Left Column: One short line of copy + 2 CTAs */}
        <div className="space-y-4 max-w-xl">
          <p className="font-body text-base sm:text-lg text-[#0B0B0B] font-semibold leading-relaxed max-w-[54ch]">
            Industrial FDM, SLA resin, and Carbon-X parts fabricated with micron accuracy.
            Instant CAD quote, zero MOQ, and express nationwide delivery.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 w-full sm:w-auto">
            {/* Primary Brutalist Button */}
            <button
              onClick={() => navigate('/custom-lab')}
              className="btn-brutal btn-brutal-orange text-xs sm:text-sm py-3 px-6 flex items-center justify-center gap-2.5 cursor-pointer w-full sm:w-auto"
            >
              <span>LAUNCH CUSTOM LAB</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Clean Ghost Secondary Link */}
            <button
              onClick={() => navigate('/categories')}
              className="btn-ghost-link text-xs sm:text-sm py-2.5 px-4 flex items-center justify-center gap-1.5 cursor-pointer font-bold text-center"
            >
              <span>BROWSE CATALOG</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Right Column: Single Inline Mono Line (Replaces heavy stats box) */}
        <div data-aos="fade-left" data-aos-delay="250" className="font-mono text-xs sm:text-sm font-bold text-[#0B0B0B]/80 tracking-wide md:text-right pb-1">
          <span>&plusmn;0.04 mm</span>
          <span className="mx-2 text-[#FF5A1F]">&bull;</span>
          <span>24&ndash;48h dispatch</span>
          <span className="mx-2 text-[#FF5A1F]">&bull;</span>
          <span>All India</span>
        </div>
      </div>

      {/* -------------------------------------------------------------
          4. Transition Cue: "ENTERING THE LAB" (Phase 2 step 01)
      ------------------------------------------------------------- */}
      <div
        ref={enteringLabelRef}
        data-aos="fade-in"
        data-aos-delay="400"
        className="relative z-30 pt-6 flex items-center justify-center opacity-70"
      >
        <span className="type-mono-eyebrow text-[#0B0B0B]/50 flex items-center gap-2">
          <span>&darr;</span>
          <span>ENTERING THE LAB</span>
          <span>&darr;</span>
        </span>
      </div>
    </section>
  );
}
