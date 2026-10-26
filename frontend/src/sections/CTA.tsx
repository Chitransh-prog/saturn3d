import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Cpu } from 'lucide-react';
import BulkOrderForm from './BulkOrderForm';
import Architect3D from '@/components/Architect3D';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isBulkFormOpen, setIsBulkFormOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        scale: 0.96,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <BulkOrderForm isOpen={isBulkFormOpen} onClose={() => setIsBulkFormOpen(false)} />

      <section
        ref={sectionRef}
        className="py-16 sm:py-24 px-3 sm:px-6 lg:px-10 bg-[#E5E5E5] relative overflow-hidden"
      >
        {/* Monumental Framed Black Card */}
        <div
          ref={cardRef}
          className="w-full max-w-[1440px] mx-auto rounded-[32px] sm:rounded-[44px] bg-black text-white p-8 sm:p-14 lg:p-20 shadow-2xl relative overflow-hidden flex flex-col justify-between"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F7931E]/10 rounded-full blur-[140px] pointer-events-none" />

          {/* Top Telemetry */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F7931E] animate-pulse" />
              <span className="font-mono-tech text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-slate-300">
                05 / RAPID SCALE & PRODUCTION ENGAGEMENT
              </span>
            </div>

            <div className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1 text-[9px] font-mono-tech font-bold uppercase tracking-widest text-[#F7931E]">
              CAPACITY: 500+ UNITS / 48H
            </div>
          </div>

          {/* Monumental Headline & 3D Architectural Stage */}
          <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10 sm:mb-14">
            
            {/* Left Column: Monumental Headline */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-monumental text-6xl sm:text-8xl lg:text-9xl font-black text-white tracking-tight leading-[0.84] uppercase">
                ARCHITECT <br />
                THE <span className="text-[#F7931E]">FUTURE</span>
              </h2>

              <p className="font-mono-tech text-xs sm:text-sm text-slate-400 uppercase tracking-widest max-w-xl leading-relaxed pt-2">
                Stop waiting weeks for CNC machining or tooling molds. Upload your geometry to deploy production-grade additive hardware now.
              </p>
            </div>

            {/* Right Column: Interactive 3D Architectural Twin */}
            <div className="lg:col-span-5 h-[340px] sm:h-[420px] lg:h-[460px] w-full flex items-center justify-center relative">
              <Architect3D />
            </div>

          </div>

          {/* Dual Capsule Pill Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-white/10">
            <button
              onClick={() => navigate('/custom-lab')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#F7931E] hover:bg-[#e07f12] text-white font-mono-tech text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 shadow-xl shadow-orange-500/20 active:scale-95 group"
            >
              <span>LAUNCH INSTANT CAD LAB</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setIsBulkFormOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#D8D8D8] hover:bg-white text-black font-mono-tech text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 active:scale-95"
            >
              <span>REQUEST ENTERPRISE DEMO</span>
            </button>

            <span className="font-mono-tech text-[10px] text-slate-500 uppercase tracking-widest sm:ml-4 text-center sm:text-left">
              Direct facility dispatch from Bhopal Industrial Hub
            </span>
          </div>

        </div>
      </section>
    </>
  );
}
