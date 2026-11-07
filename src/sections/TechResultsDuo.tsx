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
        <div data-aos="fade-up" className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700 rounded-full mb-3 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="font-sans font-bold text-3xl sm:text-5xl text-neutral-900 tracking-tight">
            Engineered hardware. <br className="hidden sm:block" />
            <span className="text-neutral-400">Superior production results.</span>
          </h2>
        </div>

        {/* The Two Pillars (Duo Cards with Interactive 3D Stages) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch scroll-stagger">
          
          {/* Card 1: Our Technology with Live 3D Metamaterial Lattice & Optical Engine */}
          <div data-aos="fade-up" data-aos-delay="100" className="group relative bg-white border border-neutral-200/90 rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-lg hover:border-neutral-300 transition-all duration-300">
            <div className="relative z-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5A1F] block mb-2 font-mono">
                Technology &bull; Kinematics &bull; Resins
              </span>
              <h3 className="font-sans text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                Precision Additive Systems
              </h3>
              <p className="text-sm text-neutral-600 mt-2.5 max-w-md leading-relaxed">
                Voron CoreXY high-speed motion gantries and 12K Stereolithography engines engineered for sub-micron surface accuracy and thermal stability.
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
          <div data-aos="fade-up" data-aos-delay="200" className="group relative bg-white border border-neutral-200/90 rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-lg hover:border-neutral-300 transition-all duration-300">
            <div className="relative z-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 block mb-2 font-mono">
                Aerospace &bull; Robotics &bull; Tooling
              </span>
              <h3 className="font-sans text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                Production-Ready Parts
              </h3>
              <p className="text-sm text-neutral-600 mt-2.5 max-w-md leading-relaxed">
                From lightweight drone airframes and lattice cushions to high-torque robotics gears, manufactured with aerospace repeatability.
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
