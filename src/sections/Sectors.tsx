'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { categories } from '@/data/categories';
import { 
  ArrowUpRight, Layers, ShieldCheck, 
  Sparkles, Clock, CheckCircle2, ChevronRight,
  Boxes
} from 'lucide-react';

export default function IndustryCategories() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'industrial' | 'consumer'>('all');

  const filteredCategories = categories.filter((cat) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'industrial') {
      return [
        'rapid-prototyping',
        'industrial-parts-manufacturing',
        'small-batch-manufacturing',
        'drone-robotics',
        'architectural-scale-down-models'
      ].includes(cat.slug);
    }
    if (activeFilter === 'consumer') {
      return [
        'corporate-bulk-gifting',
        'marriage-gifts',
        'education',
        'interior'
      ].includes(cat.slug);
    }
    return true;
  });

  return (
    <section 
      id="categories" 
      className="w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F8F9FB] border-b border-black/10 relative overflow-hidden"
    >
      {/* Background Subtle Precision Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div data-aos="fade-up" className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700 mb-3 shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Industry Solutions</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-3 font-sans">
              Engineered solutions across 8 key sectors.
            </h2>
            
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Specialized additive workflows tailored for aerospace, robotics, architecture, and high-volume batch manufacturing.
            </p>
          </div>

          {/* Filter Pills with Tablist Semantics */}
          <div role="tablist" aria-label="Filter target sectors" className="flex items-center gap-1.5 self-start lg:self-end bg-white p-1 rounded-xl border border-neutral-200 shadow-sm">
            <button
              role="tab"
              aria-selected={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A1F] ${
                activeFilter === 'all'
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              All Sectors ({categories.length})
            </button>
            <button
              role="tab"
              aria-selected={activeFilter === 'industrial'}
              onClick={() => setActiveFilter('industrial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A1F] ${
                activeFilter === 'industrial'
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Industrial &amp; Robotics
            </button>
            <button
              role="tab"
              aria-selected={activeFilter === 'consumer'}
              onClick={() => setActiveFilter('consumer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A1F] ${
                activeFilter === 'consumer'
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Corporate &amp; Interior
            </button>
          </div>
        </div>

        {/* Categories Grid - Rich with Visual Photography & Telemetry */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link 
                key={cat.slug} 
                href={`/category/${cat.slug}`}
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 80}
                className="group relative rounded-2xl bg-white border border-neutral-200/90 hover:border-[#FF5A1F]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
                style={{ opacity: 1 }} // Explicit guarantee to prevent any GSAP hiding
              >
                {/* Visual Thumbnail Bar with Sector Badge: Full 100% Uncut Visibility */}
                <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-b from-neutral-50 to-neutral-100/70 border-b border-neutral-100 flex items-center justify-center p-4">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.title}
                      loading="lazy"
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-104"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400">
                      <Boxes className="w-12 h-12" />
                    </div>
                  )}

                  {/* Top Badge: Turnaround Tag */}
                  {cat.leadTime && (
                    <div className="absolute top-3 right-3 pointer-events-none z-10">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-md bg-white/90 border border-neutral-200 text-neutral-700 font-medium shadow-2xs backdrop-blur-sm">
                        <Clock className="w-3 h-3 text-[#FF5A1F]" />
                        <span>{cat.leadTime}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category Icon & Technical Badge */}
                    <div className="flex items-center gap-2 mb-3.5">
                      <div className="w-8 h-8 rounded-lg bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      {cat.badge && (
                        <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-[#4B5262] bg-[#F3F4F6] px-2.5 py-1 rounded-md border border-black/5 truncate">
                          {cat.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="font-sans font-bold text-lg sm:text-xl text-[#111215] mb-2 group-hover:text-[#FF5A1F] transition-colors leading-snug">
                      {cat.title}
                    </h3>
                    
                    <p className="font-sans text-xs sm:text-sm text-[#5E6573] leading-relaxed mb-5">
                      {cat.description}
                    </p>
                  </div>
                  
                  {/* Footer Action */}
                  <div className="pt-4 border-t border-black/5 flex items-center justify-between mt-auto">
                    <span className="font-mono text-xs font-semibold text-[#111215] group-hover:text-[#FF5A1F] transition-colors flex items-center gap-1">
                      <span>Explore Category</span>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                    
                    <div className="w-7 h-7 rounded-lg bg-[#F5F6F8] group-hover:bg-[#FF5A1F] text-[#5E6573] group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

              </Link>
            );
          })}
        </div>

        {/* Bottom Facility Guarantee Bar */}
        <div className="mt-12 sm:mt-16 p-4 sm:p-6 rounded-2xl bg-white border border-black/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#111215]">
                Custom Industrial Engineering Runs Available
              </div>
              <div className="text-xs text-[#5E6573]">
                Need a specific tolerance, material formulation, or custom bulk batch for your sector?
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/custom-lab"
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#E04F1A] text-white font-medium text-xs font-mono text-center transition-all shadow-md shadow-[#FF5A1F]/20"
            >
              Upload CAD for Custom Quote →
            </Link>
            <Link
              href="/categories"
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#F5F6F8] hover:bg-black/5 text-[#111215] font-medium text-xs font-mono text-center border border-black/10 transition-all"
            >
              Browse Full Catalog
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
