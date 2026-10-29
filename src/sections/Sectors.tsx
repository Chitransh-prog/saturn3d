import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { categories } from '@/data/categories';
import { ArrowUpRight } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';

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
          y: 20,
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
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-white border-b hairline relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div>
          <SectionHeader
            number="06"
            tag="Target Domains & Applications"
            title="Production solutions at scale"
            highlightWord="solutions"
            subtitle="From flight-critical aerospace brackets to biocompatible surgical guides and functional robotics tooling — engineered to exacting industrial demands."
            badgeText="Industrial QA"
            badgeColor="#FF5A1F"
          />
        </div>

        {/* Sectors Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.slice(0, 6).map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div 
                key={i} 
                onClick={() => navigate(`/category/${cat.slug}`)}
                className="card-precision bg-studio-light/40 p-6 sm:p-8 hover:bg-white transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-white border hairline flex items-center justify-center text-saturn-orange group-hover:scale-105 transition-transform shadow-precision-xs">
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="font-mono text-[10px] text-muted-dark border hairline bg-white px-2.5 py-0.5 rounded-full">
                      Domain 0{i + 1}
                    </span>
                  </div>
                  
                  <h3 className="font-display font-semibold text-lg sm:text-xl text-graphite mb-2 group-hover:text-saturn-orange transition-colors">
                    {cat.title}
                  </h3>
                  
                  <p className="font-body text-xs sm:text-sm text-muted leading-relaxed line-clamp-3 mb-6">
                    {cat.description}
                  </p>
                </div>
                
                <div className="pt-4 border-t hairline flex items-center justify-between">
                  <span className="font-mono text-xs font-medium text-graphite group-hover:text-saturn-orange transition-colors">
                    View specifications
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white border hairline text-muted group-hover:text-saturn-orange group-hover:border-saturn-orange/30 flex items-center justify-center transition-all">
                    <ArrowUpRight className="w-4 h-4" />
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
