'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, Layers, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { TechnologyCard3D, ResultsCard3D } from '@/components/TechDuoStages3D';

export default function TechResultsDuo() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 sm:py-32 bg-[#F8F9FB] text-[#111215] overflow-hidden border-b border-black/10">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-64 bg-gradient-to-b from-indigo-500/5 via-orange-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Eyebrow */}
        <div className="text-center max-w-2xl mx-auto mb-14 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-black/10 rounded-full font-mono text-[11px] font-semibold uppercase tracking-wider text-[#5E6573] mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
            <span>Industrial Additive Ecosystem</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#111215] tracking-tight">
            Engineered hardware. <br className="hidden sm:block" />
            <span className="text-[#5E6573]">Radically superior results.</span>
          </h2>
        </div>

        {/* The Two Pillars (Duo Cards with Interactive 3D Stages) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch scroll-stagger">
          
          {/* Card 1: Our Technology with Live 3D Metamaterial Lattice & Optical Engine */}
          <div className="group relative bg-white border border-black/10 rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl hover:border-[#FF5A1F]/40 transition-all duration-300">
            {/* Top Light Accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-500" />

            <div className="relative z-10">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#4F46E5] block mb-2">
                Software // Hardware // Materials
              </span>
              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111215] tracking-tight leading-tight">
                Our Technology
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#5E6573] mt-3 max-w-md leading-relaxed">
                High-speed Voron CoreXY kinematic gantries and 12K Stereolithography light engines integrated with automated neural slicing and aerospace-certified polymers.
              </p>
            </div>

            {/* Live Interactive 3D Technology Viewport */}
            <div className="relative my-6 h-72 sm:h-80 w-full flex items-center justify-center rounded-2xl bg-[#F4F5F8] border border-black/10 overflow-hidden shadow-inner">
              {/* 3D Canvas */}
              <TechnologyCard3D />

              {/* Floating Overlay Telemetry Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 border border-black/10 backdrop-blur-md pointer-events-none shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse" />
                <span className="font-mono text-[10px] text-[#111215] font-semibold">3D Gyroid Lattice Matrix</span>
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 border border-black/10 backdrop-blur-md pointer-events-none shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
                <span className="font-mono text-[10px] text-[#111215] font-semibold">12K Optical SLA Engine</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="relative z-10 pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#F1F3F7] border border-black/10 font-mono text-[10px] text-[#5E6573] font-medium">
                  CoreXY Precision
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#F1F3F7] border border-black/10 font-mono text-[10px] text-[#5E6573] font-medium">
                  12K SLA Optics
                </span>
              </div>

              <button
                onClick={() => {
                  const el = document.getElementById('specs');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-precision-secondary text-xs font-mono font-medium uppercase tracking-wider py-2.5 px-4 inline-flex items-center gap-2 cursor-pointer bg-white border-black/15 text-[#111215] hover:bg-black/5"
              >
                <span>View Tech Specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Your Results with Live 3D Printed Parts */}
          <div className="group relative bg-white border border-black/10 rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300">
            {/* Top Light Accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-500" />

            <div className="relative z-10">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
                Real-World Products // End-Use Parts
              </span>
              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111215] tracking-tight leading-tight">
                Your Results
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#5E6573] mt-3 max-w-md leading-relaxed">
                Our customers' engineering vision is the essential catalyst that unlocks radically superior parts across aerospace, robotics, automotive, and medical hardware.
              </p>
            </div>

            {/* Live Interactive 3D Results Viewport */}
            <div className="relative my-6 h-72 sm:h-80 w-full flex items-center justify-center rounded-2xl bg-[#F4F5F8] border border-black/10 overflow-hidden shadow-inner">
              {/* 3D Canvas */}
              <ResultsCard3D />

              {/* Floating Overlay Telemetry Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 border border-emerald-500/30 backdrop-blur-md pointer-events-none shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-[10px] text-[#111215] font-semibold">Impact Cellular Cushion</span>
              </div>

              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 border border-black/10 backdrop-blur-md pointer-events-none shadow-xs">
                <span className="font-mono text-[10px] text-[#5E6573]">Robotics Helical Gear // Titanium PA12</span>
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 border border-black/10 backdrop-blur-md pointer-events-none shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-mono text-[10px] text-amber-700 font-semibold">Biomedical Guide ±0.02mm</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="relative z-10 pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#F1F3F7] border border-black/10 font-mono text-[10px] text-[#5E6573] font-medium">
                  Zero Tooling MOQ
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#F1F3F7] border border-black/10 font-mono text-[10px] text-[#5E6573] font-medium">
                  24–48h Dispatch
                </span>
              </div>

              <button
                onClick={() => navigate('/custom-lab')}
                className="bg-[#111215] hover:bg-[#FF5A1F] text-white px-5 py-2.5 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
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
