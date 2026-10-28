import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { categories } from '@/data/categories';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

export default function IndustryCategories() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const accentColors = ['#FFE14D', '#8EA2FF', '#7CF2C1', '#FF5A1F', '#FFE14D', '#7CF2C1'];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        const cards = gridRef.current.children;
        gsap.from(cards, {
          opacity: 0,
          y: 30,
          stagger: 0.08,
          duration: 0.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="industry-sectors" 
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-white border-b-3 border-ink relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div data-aos="fade-up">
          <SectionHeader
            number="06"
            tag="TARGET DOMAINS & APPLICATIONS"
            title="PRODUCTION SOLUTIONS AT SCALE"
            highlightWord="SOLUTIONS"
            subtitle="From flight-critical aerospace brackets to implantable surgical guides and functional robotics tooling — engineered to exacting industrial demands."
            badgeText="ISO COMPLIANT"
            badgeColor="#8EA2FF"
          />
        </div>

        {/* Sectors Grid with Neo-Brutalist Slabs */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.slice(0, 6).map((cat, i) => {
            const Icon = cat.icon;
            const accent = accentColors[i % accentColors.length];
            return (
              <div 
                key={i} 
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 80}
                onClick={() => navigate(`/category/${cat.slug}`)}
                className="card-slab bg-[#FAF7F2] p-6 sm:p-8 border-2 border-ink shadow-brutal-sm hover:shadow-brutal hover:bg-white transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-xs border-2 border-ink flex items-center justify-center shadow-brutal-sm group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: accent }}
                    >
                      <Icon className="w-6 h-6 text-[#0B0B0B] stroke-[2.5]" />
                    </div>

                    <span className="badge-sticker bg-white text-[10px]">
                      0{i + 1} / DOMAIN
                    </span>
                  </div>
                  
                  <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0B0B0B] mb-2 group-hover:text-[#FF5A1F] transition-colors">
                    {cat.title}
                  </h3>
                  
                  <p className="font-body text-xs sm:text-sm text-[#333] leading-relaxed line-clamp-3 mb-6">
                    {cat.description}
                  </p>
                </div>
                
                <div className="pt-4 border-t-2 border-ink flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0B0B0B] group-hover:text-[#FF5A1F] transition-colors">
                    VIEW SPECIFICATIONS
                  </span>
                  <div className="w-8 h-8 rounded-xs bg-[#FF5A1F] text-[#0B0B0B] border-2 border-ink shadow-brutal-sm flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
