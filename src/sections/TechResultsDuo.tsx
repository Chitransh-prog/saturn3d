'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, Layers, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { TechnologyCard3D, ResultsCard3D } from '@/components/TechDuoStages3D';

export default function TechResultsDuo() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 sm:py-32 bg-[#0B0D10] text-white overflow-hidden border-b hairline-dark">
      {/* Ambient Atmospheric Flare (Carbon-style center light cone) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-64 bg-gradient-to-b from-indigo-500/15 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Eyebrow */}
        <div className="text-center max-w-2xl mx-auto mb-14 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border hairline-dark rounded-full font-mono text-[11px] font-medium uppercase tracking-wider text-muted-dark mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-saturn-orange" />
            <span>Industrial Additive Ecosystem</span>
          </div>
          <h2 className="font-display font-semibold text-3xl sm:text-5xl text-white tracking-tight">
            Engineered hardware. <br className="hidden sm:block" />
            <span className="text-white/60">Radically superior results.</span>
          </h2>
        </div>

        {/* The Two Pillars (Carbon-style Duo Cards with Interactive 3D Stages) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch scroll-stagger">
          
          {/* Card 1: Our Technology with Live 3D Metamaterial Lattice & Optical Engine */}
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

            {/* Live Interactive 3D Technology Viewport */}
            <div className="relative my-6 h-72 sm:h-80 w-full flex items-center justify-center rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
              {/* 3D Canvas */}
              <TechnologyCard3D />

              {/* Floating Overlay Telemetry Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 border border-white/10 backdrop-blur-md pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EA2FF] animate-pulse" />
                <span className="font-mono text-[10px] text-white/90">3D Gyroid Lattice Matrix</span>
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 border border-white/10 backdrop-blur-md pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-saturn-orange" />
                <span className="font-mono text-[10px] text-white/90">12K Optical SLA Engine</span>
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
                  const el = document.getElementById('specs');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-precision-secondary text-xs font-mono font-medium uppercase tracking-wider py-2.5 px-4 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>View Tech Specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Your Results with Live 3D Printed Parts: Cushion Lattice, Gear & Guide */}
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

            {/* Live Interactive 3D Results Viewport */}
            <div className="relative my-6 h-72 sm:h-80 w-full flex items-center justify-center rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
              {/* 3D Canvas */}
              <ResultsCard3D />

              {/* Floating Overlay Telemetry Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 border border-emerald-500/20 backdrop-blur-md pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-[10px] text-white/90">Impact Cellular Cushion</span>
              </div>

              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 border border-white/10 backdrop-blur-md pointer-events-none">
                <span className="font-mono text-[10px] text-muted-dark">Robotics Helical Gear // Titanium PA12</span>
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 border border-white/10 backdrop-blur-md pointer-events-none">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[10px] text-amber-300">Biomedical Guide ±0.02mm</span>
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
