import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Upload, Settings, Package, ArrowRight, ShieldCheck, Cpu, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    phase: 'PREDICT & SLICE',
    title: 'Instant CAD Telemetry',
    description:
      'Upload STEP, STL, OBJ, or 3MF. Our automated slicer analyzes wall thickness, volumetric mass, and structural overhangs within 12 seconds.',
    icon: Upload,
    pills: ['STEP / STL / 3MF', 'GEOMETRY AUDIT', '12S QUOTATION'],
  },
  {
    number: '02',
    phase: 'FABRICATE & CURE',
    title: 'Micron Kinematics Run',
    description:
      'Continuous closed-loop optical feedback at 500 mm/s with active 70°C chamber heating or sub-micron 12K stereolithography photopolymerization.',
    icon: Cpu,
    pills: ['500 MM/S VELOCITY', '50-MICRON TOLERANCE', 'ACTIVE CHAMBER'],
  },
  {
    number: '03',
    phase: 'AUDIT & PROPEL',
    title: 'CMM Inspection & Express',
    description:
      'Digital micrometer verification against original CAD specs. Vacuum-sealed packaging with 24–48 hour express nationwide dispatch.',
    icon: Package,
    pills: ['100% CMM AUDIT', 'DISPATCH IN 24-48H', 'GST TAX INVOICE'],
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      stepRefs.current.forEach((step, index) => {
        if (step) {
          gsap.from(step, {
            opacity: 0,
            y: 40,
            duration: 0.7,
            delay: index * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-16 sm:py-24 px-3 sm:px-6 lg:px-10 bg-[#E5E5E5] relative overflow-hidden"
    >
      {/* Framed Section Card matching Hero Bezel */}
      <div className="w-full max-w-[1440px] mx-auto rounded-[32px] sm:rounded-[44px] bg-[#EDEDED] border border-black/5 p-6 sm:p-10 lg:p-14 shadow-xl relative overflow-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16 pb-8 border-b border-black/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F7931E]" />
              <span className="font-mono-tech text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-slate-700">
                04 / FABRICATION ARCHITECTURE
              </span>
            </div>

            <h2 className="font-monumental text-5xl sm:text-7xl lg:text-8xl font-black text-black tracking-tight leading-[0.88] uppercase">
              OPERATION <span className="text-[#F7931E]">PROTOCOL</span>
            </h2>
          </div>

          <p className="font-mono-tech text-[11px] sm:text-xs text-slate-600 uppercase tracking-widest max-w-md leading-relaxed">
            From raw CAD geometry to calibrated industrial hardware delivered to your facility in three seamless phases.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                ref={(el) => {
                  stepRefs.current[idx] = el;
                }}
                className="group p-7 sm:p-8 rounded-[2rem] bg-white border border-black/10 shadow-xs hover:shadow-xl hover:border-black transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Step Top Telemetry */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5">
                    <span className="font-monumental text-4xl font-black text-black">
                      {step.number}
                    </span>
                    <span className="font-mono-tech text-[9px] font-bold uppercase tracking-[0.2em] text-[#F7931E] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                      {step.phase}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-[#EAEAEA] group-hover:bg-black group-hover:text-white flex items-center justify-center mb-6 text-black transition-colors duration-300">
                    <Icon className="w-5 h-5 text-current" />
                  </div>

                  {/* Title & Desc */}
                  <h3 className="font-monumental text-2xl sm:text-3xl font-black text-black tracking-wide uppercase mb-3 group-hover:text-[#F7931E] transition-colors">
                    {step.title}
                  </h3>

                  <p className="font-body text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Capsule Pills */}
                <div className="pt-4 border-t border-black/5 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {step.pills.map((pill, pIdx) => (
                      <span
                        key={pIdx}
                        className="rounded-full border border-black/15 bg-slate-50 px-3 py-1 text-[8px] sm:text-[9px] font-mono-tech font-bold uppercase tracking-wider text-slate-700"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Protocol Action Pill */}
        <div className="mt-12 sm:mt-16 text-center pt-8 border-t border-black/5 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/custom-lab')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-black hover:bg-neutral-800 text-white font-mono-tech text-xs font-bold uppercase tracking-[0.18em] rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-95 group"
          >
            <span>LAUNCH INSTANT CAD SLICER</span>
            <ArrowRight className="w-4 h-4 text-[#F7931E] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}
