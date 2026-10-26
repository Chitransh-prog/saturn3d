import { useEffect, useRef } from 'react';
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
        duration: 1,
        ease: 'power3.out'
      });

      // Stats Animation
      gsap.from('.stat-item', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
        }
      });

      // Values Animation
      gsap.from('.value-item', {
        opacity: 0,
        x: -20,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="bg-white min-h-screen pt-4 sm:pt-8 pb-20 relative overflow-hidden">
      {/* Ambient Floating Depth Spheres */}
      <div className="w-36 h-36 pearl-sphere absolute -top-8 right-12 pointer-events-none opacity-70 animate-float" />
      <div className="w-20 h-20 pearl-sphere absolute top-[48%] -left-6 pointer-events-none opacity-50 animate-float [animation-delay:2s]" />
      <div className="w-28 h-28 pearl-sphere absolute bottom-12 -right-8 pointer-events-none opacity-40 animate-float [animation-delay:1.2s]" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div ref={headerRef} className="max-w-4xl pt-6 sm:pt-10 mb-12 sm:mb-16">
          {/* Protocol Eyebrow Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0D1117] text-white text-[10px] font-mono-tech font-bold uppercase tracking-[0.25em] mb-8 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span>THE PROTOCOL</span>
          </div>

          {/* Monumental Heavy Headline */}
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black text-black mb-6 tracking-tight leading-[0.92] uppercase">
            REDEFINING <br />
            <span className="text-[#2563EB] italic">MATERIALITY.</span>
          </h1>

          <p className="font-heading text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
            SATURN was founded on the principle of direct materialization. We bridge the gap between digital CAD data and physical reality through advanced neural scaling and additive manufacturing.
          </p>
        </div>

        {/* Vision Stats Strip - Minimalist with horizontal border dividers */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 my-10 border-y border-black/10">
          {[
            { label: "PRECISION", value: "0.01mm", desc: "LAYER RESOLUTION TOLERANCE" },
            { label: "VELOCITY", value: "500mm/s", desc: "STANDARD PRODUCTION SPEED" },
            { label: "INTEGRITY", value: "99.9%", desc: "MATERIAL STRUCTURAL DENSITY" },
          ].map((stat, i) => (
            <div key={i} className="stat-item space-y-2">
              <div className="font-mono-tech text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em]">
                /{stat.label}
              </div>
              <div className="font-heading text-5xl sm:text-6xl font-black text-black tracking-tight leading-none">
                {stat.value}
              </div>
              <p className="font-mono-tech font-bold uppercase text-[9px] text-slate-400 tracking-[0.18em]">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Core Values & 3DP Card Stage */}
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 my-16 items-center">
          
          {/* Left Column: Mission & Values */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
                OUR MISSION
              </h2>
              <p className="font-heading text-sm sm:text-base text-slate-600 leading-relaxed font-medium max-w-xl">
                To democratize heavy industry by making hyper-advanced manufacturing accessible to every designer, engineer, and creator on the planet. We don't just print objects: we materialize ideas at the speed of thought.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8 pt-2">
              {[
                { icon: Cpu, title: "NEURAL LOGIC", desc: "AI-calculated structural optimization" },
                { icon: Zap, title: "HIGHOUTPUT", desc: "Industrial scale throughput capacity" },
                { icon: Globe, title: "GLOBAL SYNC", desc: "Distributed production network" },
                { icon: Shield, title: "DATASECURE", desc: "Military-grade CAD encryption" },
              ].map((item, i) => (
                <div key={i} className="value-item space-y-2 group">
                  <div className="text-black">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-xs font-black uppercase tracking-wider text-black">
                    {item.title}
                  </h3>
                  <p className="font-body text-xs text-slate-500 leading-relaxed max-w-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column: Soft Blue Rounded 3DP Stage with Interactive Floating 3D Models */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[36px] bg-[#E2E8F5] border border-blue-100/70 shadow-sm hover:shadow-lg transition-all duration-300">
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
