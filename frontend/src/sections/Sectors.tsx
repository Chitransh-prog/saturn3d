import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { categories } from '@/data/categories';
import { ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function IndustryCategories() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        const cards = gridRef.current.children;
        gsap.from(cards, {
          opacity: 0,
          y: 35,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="industry-sectors" 
      className="py-16 sm:py-24 px-3 sm:px-6 lg:px-10 bg-[#E5E5E5] relative overflow-hidden"
    >
      {/* Framed Section Card matching Hero Bezel */}
      <div className="w-full max-w-[1440px] mx-auto rounded-[32px] sm:rounded-[44px] bg-[#EDEDED] border border-black/5 p-6 sm:p-10 lg:p-14 shadow-xl relative overflow-hidden">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16 pb-8 border-b border-black/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F7931E]" />
              <span className="font-mono-tech text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-slate-700">
                02 / TARGET INDUSTRIES & DOMAINS
              </span>
            </div>

            <h2 className="font-monumental text-5xl sm:text-7xl lg:text-8xl font-black text-black tracking-tight leading-[0.88] uppercase">
              ENGINEERED <span className="text-[#F7931E]">DOMAINS</span>
            </h2>
          </div>

          <p className="font-mono-tech text-[11px] sm:text-xs text-slate-600 uppercase tracking-widest max-w-md leading-relaxed">
            From flight-critical aerospace brackets to implantable surgical guides and functional robotics tooling — tailored to exacting tolerances.
          </p>
        </div>

        {/* Sectors Grid */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {categories.slice(0, 6).map((cat, i) => (
            <div 
              key={i} 
              onClick={() => navigate(`/category/${cat.slug}`)}
              className="group p-6 sm:p-8 rounded-[2rem] bg-white border border-black/10 shadow-xs hover:shadow-xl hover:border-black transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAEAEA] group-hover:bg-black group-hover:text-white transition-colors duration-300 flex items-center justify-center p-3 text-black">
                    <cat.icon className="w-6 h-6 text-current" />
                  </div>

                  <span className="font-mono-tech text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-black transition-colors">
                    0{i + 1} / SECTOR
                  </span>
                </div>
                
                <h3 className="font-monumental text-2xl sm:text-3xl font-black text-black tracking-wide uppercase mb-2 group-hover:text-[#F7931E] transition-colors">
                  {cat.title}
                </h3>
                
                <p className="font-body text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-6">
                  {cat.description}
                </p>
              </div>
              
              <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                <span className="font-mono-tech text-[9px] font-bold uppercase tracking-widest text-black/60 group-hover:text-black transition-colors">
                  EXPLORE SPECIFICATIONS
                </span>
                <div className="w-8 h-8 rounded-full bg-[#EAEAEA] group-hover:bg-black group-hover:text-white flex items-center justify-center transition-all duration-200">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
