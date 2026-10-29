import React, { useEffect, useRef } from 'react';
import { Cpu, Zap, Globe, Shield } from "lucide-react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CTA from '@/sections/CTA';
import FloatingModels3D from '@/components/FloatingModels3D';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      });

      // Stats Animation
      gsap.from('.stat-item', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
        }
      });

      // Values Animation
      gsap.from('.value-item', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="bg-studio-light min-h-screen pt-24 sm:pt-28 pb-20 relative overflow-hidden text-graphite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div ref={headerRef} className="max-w-4xl pt-2 sm:pt-6 mb-12 sm:mb-16">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/[0.04] text-muted-dark border hairline rounded-full text-xs font-mono font-medium uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-saturn-orange" />
            <span>06 // The Protocol & Precision Lab</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold text-graphite mb-6 tracking-tight">
            Redefining additive <br />
            <span className="text-saturn-orange">manufacturing in India.</span>
          </h1>

          <p className="font-body text-sm sm:text-base text-muted leading-relaxed max-w-2xl bg-white p-5 rounded-2xl border hairline shadow-precision-sm">
            Saturn 3D was founded on the principle of direct industrial materialization. Based in our Bhopal hub, we bridge the gap between digital CAD data and physical high-tolerance functional parts through advanced additive technologies.
          </p>
        </div>

        {/* Vision Stats Strip - Precision Capability Telemetry */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 my-10 border-y hairline">
          {[
            { label: "Precision", value: "±0.04 mm", desc: "Micron layer calibration" },
            { label: "Velocity", value: "24–48h", desc: "Rapid CoreXY dispatch across India" },
            { label: "Integrity", value: "100%", desc: "Bespoke density & solid infill" },
          ].map((stat, i) => (
            <div key={i} className="stat-item card-precision bg-white p-6 space-y-2">
              <div className="font-mono text-xs font-medium text-muted uppercase tracking-wider">
                //{stat.label}
              </div>
              <div className="font-display text-4xl sm:text-5xl font-semibold text-graphite tracking-tight leading-none">
                {stat.value}
              </div>
              <p className="font-body text-xs text-muted">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Core Values & 3DP Card Stage */}
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 my-16 items-center">
          
          {/* Left Column: Mission & Values */}
          <div className="lg:col-span-7 space-y-8">
            <div className="card-precision bg-white p-6 sm:p-8 space-y-3">
              <span className="font-mono text-xs font-medium text-saturn-orange uppercase tracking-wider">// Our Mission</span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-graphite tracking-tight">
                Democratizing advanced industrial fabrication.
              </h2>
              <p className="font-body text-xs sm:text-sm text-muted leading-relaxed">
                To empower Indian engineering teams, robotics labs, aerospace designers, and inventors with hyper-accurate additive manufacturing without high tooling setup fees. We materialize mission-critical parts at production velocity.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Cpu, title: "Neural Slicing", desc: "AI-calculated structural optimization & orientation" },
                { icon: Zap, title: "High Throughput", desc: "Industrial-scale print farm reliability" },
                { icon: Globe, title: "Express Dispatch", desc: "Air courier across all Indian states" },
                { icon: Shield, title: "IP Protection", desc: "Strict non-disclosure on proprietary CAD files" },
              ].map((item, i) => (
                <div key={i} className="value-item card-precision bg-white p-5 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-studio-light border hairline flex items-center justify-center text-saturn-orange">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-display text-sm font-semibold text-graphite">
                    {item.title}
                  </h3>
                  <p className="font-body text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column: 3D Stage with Interactive Floating Models */}
          <div className="lg:col-span-5">
            <FloatingModels3D />
          </div>

        </div>

      </div>

      {/* CTA Section */}
      <CTA />
    </div>
  );
}
