import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Zap, Leaf, Shield, Clock, Recycle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    id: 1,
    title: 'Premium Quality',
    description: 'Industrial-grade 3D printers and high-quality materials ensuring precision at all scales.',
    icon: Award,
    color: 'text-blue-500',
    meta: 'RES-01 / PRECISION',
    status: 'OPTIMAL'
  },
  {
    id: 2,
    title: 'Fast Turnaround',
    description: 'Efficient processing pipelines delivering most industrial orders within 24-48 hours.',
    icon: Zap,
    color: 'text-yellow-500',
    meta: 'SPD-02 / VELOCITY',
    status: 'ACCELERATED'
  },
  {
    id: 3,
    title: 'Eco-Friendly',
    description: 'Advanced biodegradable PLA and recycled filaments for sustainable industrialization.',
    icon: Leaf,
    color: 'text-green-500',
    meta: 'ECO-03 / SUSTAIN',
    status: 'ACTIVE'
  },
  {
    id: 4,
    title: 'Satisfaction',
    description: 'Guaranteed accuracy and quality. We provide complimentary reprints for any deviation.',
    icon: Shield,
    color: 'text-purple-500',
    meta: 'SEC-04 / TRUST',
    status: 'VERIFIED'
  },
  {
    id: 5,
    title: '24/7 Support',
    description: 'Expert engineering support available around the clock for technical consultations.',
    icon: Clock,
    color: 'text-orange-500',
    meta: 'SUP-05 / LIVE',
    status: 'ONLINE'
  },
  {
    id: 6,
    title: 'Sustainability',
    description: 'Closed-loop recycling systems for failed prints and 100% recycled packaging.',
    icon: Recycle,
    color: 'text-teal-500',
    meta: 'SUS-06 / LOOP',
    status: 'ACTIVE'
  },
];

export default function Features() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visualizationRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);

  const activeFeature = features[activeIndex];
  const ActiveIcon = activeFeature.icon;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image parallax and layer separation effect
      gsap.fromTo(
        imageRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Feature cards stagger animation
      featureRefs.current.forEach((feature, index) => {
        if (feature) {
          gsap.from(feature, {
            opacity: 0,
            x: index % 2 === 0 ? -30 : 30,
            y: 30,
            duration: 0.6,
            delay: index * 0.08,
            scrollTrigger: {
              trigger: feature,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Reactive animation for active feature change
  useEffect(() => {
    if (coreRef.current) {
      gsap.fromTo(coreRef.current,
        { scale: 0.8, opacity: 0.5, rotate: 40 },
        { scale: 1, opacity: 1, rotate: 45, duration: 0.4, ease: 'back.out(2)' }
      );
    }
  }, [activeIndex]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-24 bg-zinc-50 overflow-hidden relative"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.2]" />
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 lg:mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm">
            Operational Capabilities
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-black mb-6 tracking-tighter leading-[0.9]">
            CORE <span className="text-primary italic">INFRASTRUCTURE.</span>
          </h2>
          <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Engineered for stability, speed, and precision at scale. Our 
            platform is the new standard for industrial additive hardware.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          {/* Left - Visual Representation */}
          {/* Left - Visual Representation */}
          <div ref={imageRef} className="relative order-2 lg:order-1">
            <div className="relative aspect-square rounded-[3.5rem] overflow-hidden bg-white shadow-2xl shadow-slate-200 border border-slate-100 flex items-center justify-center group cursor-crosshair">
              {/* Industrial Grid Background */}
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              
              {/* Functional HUD Overlays */}
              <div className="absolute inset-10 pointer-events-none flex flex-col justify-between z-20">
                <div className="flex justify-between items-start">
                  <div className="p-4 rounded-xl bg-slate-900/5 backdrop-blur-md border border-slate-900/5">
                    <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">Status</div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <div className="text-xs font-black text-slate-900">{activeFeature.status}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">Protocol</div>
                    <div className="text-xs font-black text-slate-900">{activeFeature.meta}</div>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-1 h-4 rounded-full transition-all duration-500 ${i <= activeIndex ? 'bg-primary' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">Index</div>
                    <div className="text-2xl font-black text-slate-900 tabular-nums">0{activeIndex + 1}</div>
                  </div>
                </div>
              </div>
              
              {/* Abstract 3D Central Component */}
              <div ref={visualizationRef} className="relative w-64 h-64 sm:w-80 sm:h-80">
                <div className={`absolute inset-0 blur-[100px] rounded-full transition-all duration-1000 ${activeFeature.color.replace('text', 'bg')}/10`} />
                
                {/* Rotating Rings */}
                <div className="absolute inset-0 border-[3px] border-slate-100 rounded-full animate-[spin_30s_linear_infinite]" />
                <div className="absolute inset-4 border border-slate-100 rounded-full animate-[spin_20s_linear_infinite_reverse] opacity-50" />
                <div className={`absolute inset-8 border-2 rounded-full animate-[spin_10s_linear_infinite] transition-colors duration-500 ${activeFeature.color.replace('text', 'border')}/30`} />
                
                {/* Center Core */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div ref={coreRef} className="w-32 h-32 bg-white rounded-3xl rotate-45 border border-slate-200 shadow-2xl flex items-center justify-center relative z-10 hover:scale-105 transition-transform duration-700">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center -rotate-45">
                      <ActiveIcon className={`w-8 h-8 transition-all duration-500 ${activeFeature.color}`} />
                    </div>
                    
                    {/* Pulsing Core Details */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping opacity-20" />
                  </div>
                  
                  {/* Orbital Particles */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-slate-300 rounded-full"
                      style={{
                        transform: `rotate(${i * 45}deg) translateY(-100px)`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative background glow */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[radial-gradient(circle,rgba(30,60,141,0.03)_0%,transparent_70%)]" />
          </div>

          {/* Right - Features grid */}
          <div ref={featuresRef} className="grid sm:grid-cols-2 gap-6 lg:gap-10 order-1 lg:order-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  ref={(el) => { featureRefs.current[index] = el; }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`group p-10 rounded-[2.5rem] bg-white border transition-all duration-700 hover:-translate-y-3 relative overflow-hidden cursor-pointer ${activeIndex === index ? 'border-primary shadow-2xl shadow-primary/10' : 'border-slate-100 shadow-xl shadow-slate-200/40'}`}
                >
                  {/* Subtle hover background */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent transition-transform duration-700 ${activeIndex === index ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`} />
                  
                  <div className="relative z-10">
                    <div
                      className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 lg:mb-8 group-hover:scale-110 transition-all duration-700 group-hover:border-primary/30 group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-primary/10"
                    >
                      <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-slate-900 group-hover:text-primary transition-colors duration-500" />
                    </div>
                    <h3 className="font-heading text-xl lg:text-2xl font-black text-black mb-3 lg:mb-4 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm lg:text-base text-slate-500 leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
