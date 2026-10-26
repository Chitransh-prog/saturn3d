import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Play, X, Shield, Cpu, Zap, Sparkles, 
  Layers, ChevronRight, SlidersHorizontal 
} from 'lucide-react';
import HeroMech3D from '@/components/HeroMech3D';

interface SlideProduct {
  id: string;
  series: string;
  badge: string;
  brand: string;
  accent: string;
  tagline: string;
  subhead: string;
  pills: string[];
  stats: { label: string; value: string; desc: string }[];
}

const slides: SlideProduct[] = [
  {
    id: '01',
    series: '01 / COREXY FABRICATION LAB',
    badge: 'FLAGSHIP FABRICATOR',
    brand: 'BUILD',
    accent: 'FUTURE',
    tagline: 'PREDICT • PROTOTYPE • PROPEL',
    subhead: "WE DON'T IMAGINE FUTURES — WE ARCHITECT THEM",
    pills: ['AI-FIRST DESIGN', 'ETHICAL SCALING', '50-MICRON TOLERANCE'],
    stats: [
      { label: 'Build Envelope', value: '350 × 350 × 400 mm', desc: 'Industrial build chamber' },
      { label: 'Layer Resolution', value: '10 μm (0.01mm)', desc: 'Calibrated optical accuracy' },
      { label: 'Max Velocity', value: '500 mm/s', desc: 'Acceleration 20,000mm/s²' },
      { label: 'Polymers', value: 'PLA, ABS, PETG, CF, TPU', desc: 'Aerospace & engineering grade' },
    ],
  },
  {
    id: '02',
    series: '02 / ULTRA-SLA RESIN LAB',
    badge: 'MICRON STEREOLITHOGRAPHY',
    brand: 'SHAPE',
    accent: 'REALITY',
    tagline: 'SURFACE • FIDELITY • PRECISION',
    subhead: 'INJECTION-MOLD SURFACE QUALITY AT ZERO TOOLING EXPENSE',
    pills: ['12K OPTICAL MONO', 'BIO-COMPATIBLE', 'SUB-MICRON FINISH'],
    stats: [
      { label: 'LCD Stage', value: '218 × 123 × 250 mm', desc: 'Monochrome 12K matrix' },
      { label: 'Layer Striation', value: '10–50 μm', desc: 'Imperceptible layer lines' },
      { label: 'Exposure Rate', value: '1.2s / layer', desc: 'Rapid photopolymer cure' },
      { label: 'Formulations', value: 'Tough, Dental, Castable', desc: 'Engineering-grade resins' },
    ],
  },
  {
    id: '03',
    series: '03 / CARBON-X COMPOSITES',
    badge: 'AEROSPACE COMPOSITE',
    brand: 'CARBON',
    accent: 'MATRIX',
    tagline: 'LIGHTWEIGHT • STRENGTH • ENDURANCE',
    subhead: 'DIRECT LIGHTWEIGHT METAL REPLACEMENT FOR ROBOTICS & DRONES',
    pills: ['CONTINUOUS CF', '145°C HDT RATING', '62% LIGHTER THAN ALU'],
    stats: [
      { label: 'Tensile Strength', value: '95 MPa', desc: 'Carbon-fiber reinforced PA12' },
      { label: 'Elastic Modulus', value: '7,500 MPa', desc: 'Extreme bending stiffness' },
      { label: 'Heat Deflection', value: '145°C HDT', desc: 'Motorsport & avionics safe' },
      { label: 'Impact Absorption', value: '12 kJ/m²', desc: 'Zero brittle delamination' },
    ],
  },
  {
    id: '04',
    series: '04 / BATCH PRINT FARM',
    badge: 'BATCH PRODUCTION',
    brand: 'SCALE',
    accent: 'SERIES',
    tagline: 'SPEED • VOLUME • REPEATABILITY',
    subhead: 'BRIDGE PRODUCTION FROM 10 TO 500+ UNITS DISPATCHED IN 48H',
    pills: ['ZERO TOOLING COST', 'OVERNIGHT AIR DISPATCH', 'VOLUME DISCOUNTS'],
    stats: [
      { label: 'Batch Volume', value: '500+ Units / Run', desc: 'Parallel printing cell' },
      { label: 'Dispatch Velocity', value: '24–48 Hours', desc: 'Nationwide air express' },
      { label: 'Starting Price', value: '₹950 / $12', desc: 'Zero tooling or mold fee' },
      { label: 'Audit Standard', value: '100% CMM Inspected', desc: 'Digital micrometer audit' },
    ],
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [printProgress, setPrintProgress] = useState(0.2);
  const [isPrinting, setIsPrinting] = useState(true);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });

  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const textBuildRef = useRef<HTMLDivElement>(null);
  const textFutureRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const currentProduct = slides[activeSlide];

  // -------------------------------------------------------------------------
  // GSAP Entrance Timeline & Print Progression
  // -------------------------------------------------------------------------
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setPrintProgress(1.0);
      setIsPrinting(false);
      return;
    }

    const ctx = gsap.context(() => {
      // 0.0 - 0.8s: Container emerges from subtle blur
      gsap.fromTo(
        frameRef.current,
        {
          filter: 'blur(16px)',
          opacity: 0,
          scale: 0.985,
        },
        {
          filter: 'blur(0px)',
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
        }
      );

      // Stagger monumental typography
      gsap.fromTo(
        [textBuildRef.current, textFutureRef.current],
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.12,
          delay: 0.3,
          ease: 'expo.out',
        }
      );

      // Bottom bar elements fade up
      gsap.fromTo(
        bottomBarRef.current,
        {
          y: 25,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.6,
          ease: 'power3.out',
        }
      );

      // Progressive print layer reveal
      const printTimeline = gsap.timeline({ delay: 1.2 });
      printTimeline.to(
        { val: 0.05 },
        {
          val: 1.0,
          duration: 3.2,
          ease: 'power1.inOut',
          onUpdate: function () {
            setPrintProgress(this.targets()[0].val);
          },
          onComplete: () => {
            setIsPrinting(false);
          },
        }
      );
    }, heroWrapperRef);

    return () => ctx.revert();
  }, []);

  // Slide switch transition
  const handleSlideChange = (newIndex: number) => {
    if (newIndex === activeSlide) return;

    gsap.to([textBuildRef.current, textFutureRef.current], {
      filter: 'blur(8px)',
      opacity: 0.35,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        setActiveSlide(newIndex);
        setPrintProgress(0.15);
        setIsPrinting(true);

        gsap.to([textBuildRef.current, textFutureRef.current], {
          filter: 'blur(0px)',
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
        });

        gsap.to(
          { val: 0.15 },
          {
            val: 1.0,
            duration: 2.2,
            ease: 'power1.inOut',
            onUpdate: function () {
              setPrintProgress(this.targets()[0].val);
            },
            onComplete: () => {
              setIsPrinting(false);
            },
          }
        );
      },
    });
  };

  // Mouse move parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseParallax({ x, y });
  };

  return (
    <>
      <section
        ref={frameRef}
        onMouseMove={handleMouseMove}
        className="w-full min-h-[calc(100vh-4rem)] bg-[#EDEDED] relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-16"
      >
        {/* Subtle Pearl/Studio Ambient Spheres in Background */}
        <div
          className="pearl-sphere absolute top-[8%] left-[6%] w-48 h-48 opacity-40 pointer-events-none transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mouseParallax.x * -30}px, ${mouseParallax.y * -30}px)`,
          }}
        />
        <div
          className="pearl-sphere absolute bottom-[14%] right-[8%] w-64 h-64 opacity-40 pointer-events-none transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mouseParallax.x * -45}px, ${mouseParallax.y * -45}px)`,
          }}
        />

        {/* ---------------------------------------------------------------------
            Top Row: Eyebrow + Series Selector
        --------------------------------------------------------------------- */}
        {/* Top Row: Eyebrow Brand Statement (No 01-04 numbers) */}
        <div className="relative z-30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-mono-tech text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-slate-700 block">
              ENGINEERING TOMORROW'S PHYSICAL REALITY TODAY
            </span>
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F7931E] animate-pulse" />
              <span className="font-mono-tech text-[9px] uppercase tracking-widest text-slate-400">
                DIRECT ADDITIVE FABRICATION LAB &bull; 0.01MM TOLERANCE
              </span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------------
            Monumental Center Stage: BUILD [3D Mech on Rock Pedestal] FUTURE
        --------------------------------------------------------------------- */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-1 sm:my-4 min-h-[360px] sm:min-h-[500px] lg:min-h-[620px]">
          
          {/* Monumental Headline Layer (Behind & framing the 3D subject) */}
          <div className="w-full flex justify-between items-center select-none pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0 px-1 sm:px-6 lg:px-8">
            
            {/* Left Monumental Word: BUILD */}
            <div
              ref={textBuildRef}
              className="relative text-[20vw] sm:text-[18vw] lg:text-[16vw] font-monumental font-black tracking-[-0.01em] text-black leading-none"
              style={{
                transform: `translate(${mouseParallax.x * -12}px, ${mouseParallax.y * -8}px)`,
              }}
            >
              <span>BUILD</span>

              {/* Pinned Architectural Pill Badge 1: PREDICT (Pinned to 'D' stem) */}
              <div className="hidden sm:block absolute top-[34%] right-[-6%] z-20 pointer-events-auto">
                <div className="rounded-full border border-black/30 bg-white/95 backdrop-blur-md px-3 sm:px-3.5 py-1 text-[8px] sm:text-[9px] font-mono-tech font-bold uppercase tracking-[0.2em] text-black shadow-xs hover:scale-105 hover:border-black transition-all cursor-default">
                  PREDICT
                </div>
              </div>

              {/* Pinned Architectural Pill Badge 2: PROTOTYPE (Below stem) */}
              <div className="hidden sm:block absolute bottom-[6%] right-[6%] z-20 pointer-events-auto">
                <div className="rounded-full border border-black/30 bg-white/95 backdrop-blur-md px-3 sm:px-3.5 py-1 text-[8px] sm:text-[9px] font-mono-tech font-bold uppercase tracking-[0.2em] text-black shadow-xs hover:scale-105 hover:border-black transition-all cursor-default">
                  PROTOTYPE
                </div>
              </div>
            </div>

            {/* Right Monumental Word: FUTURE */}
            <div
              ref={textFutureRef}
              className="relative text-[20vw] sm:text-[18vw] lg:text-[16vw] font-monumental font-black tracking-[-0.01em] text-black leading-none text-right"
              style={{
                transform: `translate(${mouseParallax.x * -12}px, ${mouseParallax.y * -8}px)`,
              }}
            >
              <span>FUTURE</span>

              {/* Pinned Architectural Pill Badge 3: PROPEL (Pinned to 'R' / 'E') */}
              <div className="hidden sm:block absolute top-[38%] left-[-6%] z-20 pointer-events-auto">
                <div className="rounded-full border border-black/30 bg-white/95 backdrop-blur-md px-3 sm:px-3.5 py-1 text-[8px] sm:text-[9px] font-mono-tech font-bold uppercase tracking-[0.2em] text-black shadow-xs hover:scale-105 hover:border-black transition-all cursor-default">
                  PROPEL
                </div>
              </div>
            </div>

          </div>

          {/* Center 3D Scene: Sculpted Mech on Natural Rock Summit */}
          <div
            className="w-full max-w-[420px] sm:max-w-[540px] lg:max-w-[620px] h-[360px] sm:h-[500px] lg:h-[660px] relative z-10 flex items-center justify-center transition-transform duration-500 ease-out pointer-events-auto"
            style={{
              transform: `translate(${mouseParallax.x * 20}px, ${mouseParallax.y * 15}px)`,
            }}
          >
            <HeroMech3D />
          </div>

        </div>

        {/* ---------------------------------------------------------------------
            Bottom Row: Subhead + 3 Outline Badges (Left) & Executive Pill (Right)
        --------------------------------------------------------------------- */}
        <div
          ref={bottomBarRef}
          className="relative z-30 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pt-4 border-t border-black/5"
        >
          {/* Bottom Left: Subhead + 3 Outline Badges from Inspiration */}
          <div className="space-y-3 max-w-xl">
            <p className="font-mono-tech text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-700">
              {currentProduct.subhead}
            </p>

            {/* 3 Capsule Outline Pill Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {currentProduct.pills.map((pill, i) => (
                <div
                  key={i}
                  className="rounded-full border border-black/25 bg-white/70 hover:bg-black hover:text-white hover:border-black px-4 py-1.5 text-[9px] sm:text-[10px] font-mono-tech font-bold uppercase tracking-[0.16em] text-black shadow-2xs transition-all duration-200 cursor-default active:scale-95"
                >
                  {pill}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Right: Executive Architect Floating Pill from Inspiration */}
          <div
            onClick={() => setIsVideoModalOpen(true)}
            className="w-full sm:w-auto max-w-full rounded-full bg-black text-white p-2 sm:p-2.5 pr-5 sm:pr-7 flex items-center gap-3 shadow-xl hover:shadow-2xl border border-white/10 hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer group"
          >
            {/* Avatar Circle with Glowing Halo */}
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/20 shrink-0 bg-neutral-800 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F7931E]/40 to-cyan-400/40 opacity-70 animate-pulse" />
              <img
                src="/gallery/WhatsApp Image 2026-04-17 at 13.57.58.jpeg"
                alt="Chief Manufacturing Architect"
                className="w-full h-full object-cover relative z-10"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Play className="w-3.5 h-3.5 text-white fill-current relative z-20 group-hover:scale-110 transition-transform" />
            </div>

            {/* Technical Uppercase Text from Reference */}
            <div className="flex flex-col text-left min-w-0">
              <span className="font-mono-tech text-[7.5px] xs:text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.16em] text-slate-300 leading-snug truncate sm:whitespace-normal">
                HI, WE'RE SATURN 3D. CHIEF ARCHITECT.
              </span>
              <span className="font-mono-tech text-[7.5px] xs:text-[8px] sm:text-[9px] font-black uppercase tracking-[0.16em] text-[#F7931E] truncate sm:whitespace-normal">
                LET'S ENGINEER YOUR NEXT DECADE! →
              </span>
            </div>
          </div>

        </div>

      </section>

      {/* 
        =======================================================================
        Video Modal ("See It In Action")
        =======================================================================
      */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-neutral-900">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F7931E] animate-pulse" />
                <span className="font-mono-tech text-xs uppercase tracking-widest text-white font-bold">
                  Saturn 3D Precision CoreXY Lab Run
                </span>
              </div>
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="relative aspect-video bg-neutral-950 flex items-center justify-center">
              <video 
                src="/docs/reference/hero.mp4" 
                controls 
                autoPlay 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.getElementById('video-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div id="video-fallback" className="hidden flex-col items-center justify-center p-8 text-center gap-4">
                <Cpu className="w-12 h-12 text-[#F7931E] animate-pulse" />
                <h3 className="font-monumental text-2xl text-white tracking-wider uppercase">High-Speed Kinematics Active</h3>
                <p className="text-xs font-mono-tech text-slate-400 max-w-md">
                  Active layer deposition at 500 mm/s with optical closed-loop positioning and 180W heated chamber stabilization.
                </p>
                <button
                  onClick={() => {
                    setIsVideoModalOpen(false);
                    navigate('/custom-lab');
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#F7931E] text-white font-mono-tech text-xs font-bold uppercase tracking-widest"
                >
                  Configure Custom Part
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
