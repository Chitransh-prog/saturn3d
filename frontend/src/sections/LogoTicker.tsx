import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building2, Cpu, Factory, Globe, Layers, ShieldCheck, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const logos = [
  { name: 'DRDO LABS', icon: ShieldCheck },
  { name: 'ISRO VENDORS', icon: Globe },
  { name: 'AEROSPACE DYNAMICS', icon: Cpu },
  { name: 'AUTO ROBOTICS', icon: Factory },
  { name: 'BHOPAL BATCH HUB', icon: Layers },
  { name: 'DRDO LABS', icon: ShieldCheck },
  { name: 'ISRO VENDORS', icon: Globe },
  { name: 'AEROSPACE DYNAMICS', icon: Cpu },
  { name: 'AUTO ROBOTICS', icon: Factory },
  { name: 'BHOPAL BATCH HUB', icon: Layers },
];

export default function LogoTicker() {
  const sectionRef = useRef<HTMLElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      let scrollVelocity = 0;
      let lastScrollTop = 0;

      const updateVelocity = () => {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        scrollVelocity = st - lastScrollTop;
        lastScrollTop = st;

        if (tickerRef.current) {
          const currentAnimation = gsap.getTweensOf(tickerRef.current);
          if (currentAnimation.length > 0) {
            const newSpeed = Math.max(10, 30 - Math.abs(scrollVelocity) * 0.5);
            gsap.to(currentAnimation[0], {
              timeScale: newSpeed / 30,
              duration: 0.3,
            });
          }
        }
      };

      window.addEventListener('scroll', updateVelocity, { passive: true });
      return () => window.removeEventListener('scroll', updateVelocity);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#EDEDED] border-y border-black/10 py-8 sm:py-10 relative overflow-hidden select-none"
    >
      <div className="w-full">
        <div className="text-center mb-6 relative z-10 px-4 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F7931E]" />
          <p className="font-mono-tech text-slate-500 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em]">
            TRUSTED BY 38+ ENGINEERING CELLS & INDUSTRIAL HARDWARE HUBS
          </p>
        </div>

        <div className="relative z-10 overflow-hidden w-full">
          {/* Gradient Edge Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-r from-[#EDEDED] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-l from-[#EDEDED] to-transparent z-10 pointer-events-none" />

          {/* Continuous Ticker */}
          <div className="flex overflow-hidden py-2">
            <div ref={tickerRef} className="flex ticker-animation gap-6 sm:gap-8 items-center">
              {[...logos, ...logos, ...logos].map((logo, index) => {
                const Icon = logo.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-black/10 text-black hover:border-black transition-colors shrink-0 shadow-2xs cursor-default"
                  >
                    <Icon className="w-4 h-4 text-[#F7931E]" />
                    <span className="font-mono-tech text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
                      {logo.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
