'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, Layers, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function TechResultsDuo() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 sm:py-32 bg-[#0B0D10] text-white overflow-hidden border-b hairline-dark">
      {/* Ambient Atmospheric Flare (Carbon-style center light cone) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-64 bg-gradient-to-b from-indigo-500/15 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Eyebrow */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border hairline-dark rounded-full font-mono text-[11px] font-medium uppercase tracking-wider text-muted-dark mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-saturn-orange" />
            <span>Industrial Additive Ecosystem</span>
          </div>
          <h2 className="font-display font-semibold text-3xl sm:text-5xl text-white tracking-tight">
            Engineered hardware. <br className="hidden sm:block" />
            <span className="text-white/60">Radically superior results.</span>
          </h2>
        </div>

        {/* The Two Pillars (Carbon-style Duo Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Our Technology */}
          <div className="group relative bg-gradient-to-br from-[#131626] via-[#0E101D] to-[#080911] border hairline-dark rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-precision-lg hover:border-white/20 transition-all duration-300">
            {/* Top Light Accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500" />

            <div className="relative z-10">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#8EA2FF] block mb-2">
                Software // Hardware // Materials
              </span>
              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
                Our Technology
              </h3>
              <p className="font-body text-xs sm:text-sm text-muted-dark mt-3 max-w-md leading-relaxed">
                High-speed Voron CoreXY kinematic gantries and 12K Stereolithography light engines integrated with automated neural slicing and aerospace-certified polymers.
              </p>
            </div>

            {/* Visual Composition: Printer + Slicing Workstation + Metamaterial Gyroid */}
            <div className="relative my-8 h-64 sm:h-72 w-full flex items-center justify-center">
              {/* Floating Gyroid Metamaterial Lattice */}
              <div className="absolute left-2 sm:left-4 bottom-6 w-28 sm:w-36 aspect-square rounded-2xl bg-[#1A1A3A]/80 border hairline-dark p-3 shadow-precision-md flex flex-col justify-between backdrop-blur-md transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-[#8EA2FF] uppercase font-semibold">Lattice</span>
                  <Cpu className="w-3.5 h-3.5 text-[#8EA2FF]" />
                </div>
                <div className="w-full aspect-square relative flex items-center justify-center overflow-hidden rounded-lg bg-black/40">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-400 stroke-current opacity-80" fill="none" strokeWidth="1.5">
                    <circle cx="50" cy="50" r="38" />
                    <circle cx="50" cy="50" r="24" strokeDasharray="3,3" />
                    <path d="M50 12 L50 88 M12 50 L88 50 M24 24 L76 76 M24 76 L76 24" />
                  </svg>
                </div>
                <span className="font-mono text-[9px] text-white/60">TPU Gyroid 15%</span>
              </div>

              {/* Center Industrial Printer Cutout with Amber Glow */}
              <div className="relative z-10 w-44 sm:w-56 h-full flex flex-col items-center justify-center">
                <div className="w-full h-full rounded-2xl bg-gradient-to-t from-black/80 via-[#161822] to-[#202434] border border-white/15 p-4 shadow-2xl flex flex-col justify-between relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  {/* Internal Heated Chamber Glow */}
                  <div className="absolute inset-x-4 top-8 bottom-16 bg-gradient-to-b from-amber-500/25 via-[#FF5A1F]/15 to-transparent rounded-lg border border-amber-500/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-saturn-orange animate-ping" />
                    <span className="absolute bottom-2 font-mono text-[9px] text-amber-300 font-medium">CoreXY 245°C</span>
                  </div>

                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-mono text-[10px] text-white/80 font-bold tracking-wider">SATURN CORE</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>

                  <div className="pt-2 border-t hairline-dark flex items-center justify-between relative z-10 text-[10px] font-mono text-muted-dark">
                    <span>±0.04 mm</span>
                    <span>500 mm/s</span>
                  </div>
                </div>
              </div>

              {/* Slicing CAD Laptop Screen */}
              <div className="absolute right-2 sm:right-4 bottom-8 w-32 sm:w-40 rounded-xl bg-[#0F121C] border hairline-dark p-2.5 shadow-precision-md backdrop-blur-md transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-1.5 pb-2 border-b border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="font-mono text-[8px] text-muted-dark ml-auto">SATURN SLICER</span>
                </div>
                <div className="py-2 space-y-1 font-mono text-[8px] text-white/70">
                  <div className="flex justify-between text-saturn-orange">
                    <span>Layer 420/580</span>
                    <span>72%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[72%] h-full bg-saturn-orange" />
                  </div>
                  <div className="text-muted-dark">Toolhead: Active</div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="relative z-10 pt-4 border-t hairline-dark flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-white/5 border hairline-dark font-mono text-[10px] text-muted-dark">
                  CoreXY Precision
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border hairline-dark font-mono text-[10px] text-muted-dark">
                  12K SLA Optics
                </span>
              </div>

              <button
                onClick={() => {
                  const el = document.getElementById('materials');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-precision-secondary text-xs font-mono font-medium uppercase tracking-wider py-2.5 px-4 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>View Tech Specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Your Results */}
          <div className="group relative bg-gradient-to-br from-[#0B2320] via-[#091A18] to-[#071312] border hairline-dark rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-precision-lg hover:border-white/20 transition-all duration-300">
            {/* Top Light Accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />

            <div className="relative z-10">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#7CF2C1] block mb-2">
                Real-World Products // End-Use Parts
              </span>
              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
                Your Results
              </h3>
              <p className="font-body text-xs sm:text-sm text-muted-dark mt-3 max-w-md leading-relaxed">
                Our customers' engineering vision is the essential catalyst that unlocks radically superior parts across aerospace, robotics, automotive, and medical hardware.
              </p>
            </div>

            {/* Visual Composition: Layered Cut-Out Real Parts */}
            <div className="relative my-8 h-64 sm:h-72 w-full flex items-center justify-center">
              {/* Part 1: Top Center - Aerospace Lattice Helmet / Shell */}
              <div className="absolute top-2 w-32 sm:w-40 aspect-square rounded-2xl bg-black/60 border border-white/10 p-2 shadow-2xl flex flex-col items-center justify-center overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full relative flex items-center justify-center">
                  <svg viewBox="0 0 120 120" className="w-20 h-20 text-emerald-400 stroke-current opacity-70" fill="none" strokeWidth="1.2">
                    <polygon points="60,10 110,40 110,90 60,115 10,90 10,40" />
                    <line x1="60" y1="10" x2="60" y2="115" />
                    <line x1="10" y1="40" x2="110" y2="90" />
                    <line x1="10" y1="90" x2="110" y2="40" />
                  </svg>
                  <span className="absolute bottom-1 font-mono text-[9px] text-white/70">Impact Lattice</span>
                </div>
              </div>

              {/* Part 2: Left - Automotive Electrical Connector */}
              <div className="absolute left-2 sm:left-4 top-16 w-28 sm:w-32 p-3 rounded-xl bg-[#091514]/90 border border-emerald-500/20 shadow-precision-md backdrop-blur-md transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                <span className="font-mono text-[8px] text-[#7CF2C1] uppercase font-bold block mb-1">AUTOMOTIVE</span>
                <div className="font-display text-xs text-white font-medium">Wire Harness Clip</div>
                <div className="font-mono text-[9px] text-muted-dark mt-1">Nylon PA12 • 42 MPa</div>
              </div>

              {/* Part 3: Right - Performance Midsole / Cushioning */}
              <div className="absolute right-2 sm:right-4 top-16 w-32 sm:w-36 p-3 rounded-xl bg-[#091514]/90 border border-emerald-500/20 shadow-precision-md backdrop-blur-md transform rotate-6 group-hover:rotate-0 transition-transform duration-500">
                <span className="font-mono text-[8px] text-[#7CF2C1] uppercase font-bold block mb-1">BIOMECHANICAL</span>
                <div className="font-display text-xs text-white font-medium">TPU Energy Sole</div>
                <div className="font-mono text-[9px] text-muted-dark mt-1">Rebound 68% • 95A</div>
              </div>

              {/* Part 4: Bottom Center - Dental & Orthopedic Surgical Guide */}
              <div className="absolute bottom-2 w-48 sm:w-56 p-2.5 rounded-xl bg-black/75 border border-white/10 shadow-precision-md backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#7CF2C1]" />
                  <div>
                    <div className="font-display text-xs text-white font-medium">Diagnostic Surgical Guide</div>
                    <div className="font-mono text-[9px] text-muted-dark">Biocompatible Tough Resin</div>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 font-semibold">±0.02 mm</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="relative z-10 pt-4 border-t hairline-dark flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-white/5 border hairline-dark font-mono text-[10px] text-muted-dark">
                  Zero Tooling MOQ
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border hairline-dark font-mono text-[10px] text-muted-dark">
                  24–48h Dispatch
                </span>
              </div>

              <button
                onClick={() => navigate('/custom-lab')}
                className="bg-[#5046E5] hover:bg-[#4338CA] text-white px-5 py-2.5 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 shadow-precision-sm hover:shadow-precision-md transition-all cursor-pointer"
              >
                <span>Launch Custom Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

