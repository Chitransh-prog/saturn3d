import React, { useEffect, useRef } from 'react';
import { Cpu, Zap, Globe, Shield, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import CTA from '@/sections/CTA';
import FloatingModels3D from '@/components/FloatingModels3D';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power4.out'
      });

      // Stats Animation
      gsap.from('.stat-item', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
        }
      });

      // Values Animation
      gsap.from('.value-item', {
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="bg-paper pattern-blueprint min-h-screen pt-20 sm:pt-24 pb-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div ref={headerRef} className="max-w-4xl pt-2 sm:pt-6 mb-12 sm:mb-16">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-ink text-paper border-2 border-ink shadow-brutal-sm text-xs font-mono font-black uppercase tracking-wider mb-6">
            <span className="w-2.5 h-2.5 bg-saturn-orange" />
            <span>06 / THE PROTOCOL & PRECISION LAB</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black text-ink mb-6 tracking-tight leading-[0.92] uppercase">
            REDEFINING <br />
            <span className="text-saturn-orange outline-text">MATERIALITY.</span>
          </h1>

          <p className="font-mono text-sm sm:text-base text-ink/80 font-bold leading-relaxed max-w-2xl bg-white/70 p-4 border-2 border-ink shadow-brutal-sm">
            Saturn 3D was founded on the principle of direct industrial materialization. Based in Bhopal, India, we bridge the gap between digital CAD data and physical high-tolerance functional parts through advanced additive manufacturing.
          </p>
        </div>

        {/* Vision Stats Strip - Neo-Brutalist Slabs */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 my-10 border-y-3 border-ink">
          {[
            { label: "PRECISION", value: "0.01mm", desc: "MICRON LAYER TOLERANCE", bg: "bg-lemon" },
            { label: "VELOCITY", value: "500mm/s", desc: "HIGH-SPEED COREXY PRODUCTION", bg: "bg-paper" },
            { label: "INTEGRITY", value: "99.9%", desc: "SOLID STRUCTURAL INFILL", bg: "bg-mint" },
          ].map((stat, i) => (
            <div key={i} className={`stat-item card-slab ${stat.bg} border-3 border-ink shadow-brutal p-6 space-y-2`}>
              <div className="font-mono text-xs font-black text-ink uppercase tracking-wider">
                /{stat.label}
              </div>
              <div className="font-display text-5xl sm:text-6xl font-black text-ink tracking-tight leading-none">
                {stat.value}
              </div>
              <p className="font-mono font-bold uppercase text-[10px] text-ink/70 tracking-wider">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Core Values & 3DP Card Stage */}
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 my-16 items-center">
          
          {/* Left Column: Mission & Values */}
          <div className="lg:col-span-7 space-y-8">
            <div className="card-slab bg-white border-3 border-ink shadow-brutal p-6 sm:p-8 space-y-3">
              <span className="font-mono text-xs font-black text-saturn-orange uppercase tracking-wider">// OUR CORE MISSION</span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-ink tracking-tight uppercase">
                DEMOCRATIZING ADVANCED MANUFACTURING
              </h2>
              <p className="font-mono text-xs sm:text-sm text-ink/80 leading-relaxed font-medium max-w-xl">
                To empower Indian engineering teams, robotics labs, aerospace designers, and inventors with hyper-accurate additive manufacturing without high tooling setup fees. We materialize mission-critical parts at production velocity.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Cpu, title: "NEURAL SLICING", desc: "AI-calculated structural optimization & orientation", color: "bg-lemon" },
                { icon: Zap, title: "HIGH OUTPUT", desc: "Industrial-scale print farm throughput", color: "bg-periwinkle" },
                { icon: Globe, title: "NATIONWIDE DISPATCH", desc: "Fast express logistics across all Indian states", color: "bg-mint" },
                { icon: Shield, title: "IP PROTECTION", desc: "Strict non-disclosure on proprietary CAD files", color: "bg-paper" },
              ].map((item, i) => (
                <div key={i} className={`value-item card-slab ${item.color} border-3 border-ink shadow-brutal-sm p-5 space-y-2`}>
                  <div className="w-8 h-8 bg-ink text-paper border-2 border-ink flex items-center justify-center shadow-brutal-sm">
                    <item.icon className="w-4 h-4 text-paper" />
                  </div>
                  <h3 className="font-display text-xs font-black uppercase tracking-wider text-ink">
                    {item.title}
                  </h3>
                  <p className="font-mono text-[11px] text-ink/80 leading-relaxed font-bold">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column: Neo-Brutalist 3D Stage with Interactive Floating Models */}
          <div className="lg:col-span-5">
            <div className="card-slab bg-paper border-4 border-ink shadow-brutal-xl overflow-hidden">
              <FloatingModels3D />
            </div>
          </div>

        </div>

      </div>

      {/* CTA Section */}
      <CTA />
    </div>
  );
}
