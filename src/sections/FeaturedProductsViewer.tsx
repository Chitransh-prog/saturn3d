'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Box, Eye, ArrowRight, Layers, ShieldCheck, 
  Sparkles, CheckCircle2, ChevronRight, Compass,
  SlidersHorizontal, Cpu, Scale, Clock, Ruler
} from 'lucide-react';
import { products, type Product } from '@/data/products';
import Product3DViewer from '@/components/Product3DViewer';

const MATERIAL_OPTIONS = [
  { id: 'CARBON', name: 'Carbon-X CF', badge: 'High Rigidity' },
  { id: 'PLA', name: '12K Tough SLA', badge: 'Micron Surface' },
  { id: 'PETG', name: 'PETG Industrial', badge: 'Impact Resilient' },
  { id: 'ABS', name: 'ABS-ESD Safe', badge: 'Flame Retardant' },
];

export default function FeaturedProductsViewer() {
  // Use official Saturn 3D products (9 items covering all 8 sectors from saturn3d.in)
  const premierProducts = useMemo(() => {
    return products.slice(0, 9);
  }, []);

  const [activeProductId, setActiveProductId] = useState<string>(premierProducts[0]?.id || '1');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('PLA');

  const activeProduct = useMemo(() => {
    return premierProducts.find((p) => p.id === activeProductId) || premierProducts[0];
  }, [premierProducts, activeProductId]);

  return (
    <section className="relative w-full py-20 lg:py-28 bg-white text-[#111215] border-y border-black/10 overflow-hidden">
      {/* Background CAD Grid Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000000 1px, transparent 1px),
            linear-gradient(to bottom, #000000 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />
      {/* Subtle Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF5A1F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="scroll-reveal max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[#FF5A1F] font-mono text-[11px] font-semibold uppercase tracking-widest mb-4 shadow-xs">
            <Box className="w-3.5 h-3.5" />
            <span>Interactive 3D Hardware Telemetry // Bhopal Facility</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111215] mb-4">
            Real Engineered Parts. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#111215] via-[#2A2E39] to-[#FF5A1F]">
              Inspect in Full 3D CAD.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#5E6573] leading-relaxed">
            Rotate, zoom, and test material formulations on real production components manufactured at our 
            Bhopal precision facility. Order instant units or download specifications.
          </p>
        </div>

        {/* CAD Inspection Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: 3D CAD Interactive Stage (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Main 3D Canvas Box */}
            <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#FFFFFF] via-[#F8F9FB] to-[#F1F3F7] border border-black/10 shadow-xl overflow-hidden flex flex-col">
              
              {/* Stage Top Bar */}
              <div className="px-5 py-3.5 bg-white/90 backdrop-blur-md border-b border-black/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-[#111215] tracking-wide truncate max-w-[220px] sm:max-w-none">
                    {activeProduct.name}
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-[#FF5A1F]/10 border border-[#FF5A1F]/25 text-[#FF5A1F] font-semibold">
                    {activeProduct.tolerances || '±0.04 mm'}
                  </span>
                </div>

                {/* Material Switcher Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {MATERIAL_OPTIONS.map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => setSelectedMaterial(mat.id)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all uppercase tracking-wider ${
                        selectedMaterial === mat.id
                          ? 'bg-[#FF5A1F] text-white font-bold shadow-xs'
                          : 'bg-black/5 text-[#5E6573] hover:text-[#111215] hover:bg-black/10'
                      }`}
                      title={mat.name}
                    >
                      {mat.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3D Canvas Container */}
              <div className="relative w-full h-[400px] sm:h-[480px] bg-[#F4F5F8]">
                <Product3DViewer
                  product={activeProduct}
                  selectedMaterial={selectedMaterial}
                />
              </div>

              {/* Bottom CAD Metrology Spec Strip */}
              <div className="p-4 sm:p-5 bg-white/90 backdrop-blur-md border-t border-black/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-black/5">
                  <div className="text-[10px] text-[#8A91A0] uppercase flex items-center gap-1 font-semibold">
                    <Ruler className="w-3 h-3 text-[#FF5A1F]" /> Dimensions
                  </div>
                  <div className="font-bold text-[#111215] mt-0.5 truncate">
                    {activeProduct.dimensions || 'Standard CAD'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-black/5">
                  <div className="text-[10px] text-[#8A91A0] uppercase flex items-center gap-1 font-semibold">
                    <Scale className="w-3 h-3 text-[#FF5A1F]" /> Mass
                  </div>
                  <div className="font-bold text-[#111215] mt-0.5">
                    {activeProduct.weight || '52 g'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-black/5">
                  <div className="text-[10px] text-[#8A91A0] uppercase flex items-center gap-1 font-semibold">
                    <Cpu className="w-3 h-3 text-[#FF5A1F]" /> Material
                  </div>
                  <div className="font-bold text-[#111215] mt-0.5 truncate">
                    {activeProduct.material || 'Engineering Polymer'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-black/5">
                  <div className="text-[10px] text-[#8A91A0] uppercase flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3 text-[#FF5A1F]" /> Lead Time
                  </div>
                  <div className="font-bold text-emerald-600 mt-0.5">
                    {activeProduct.leadTime || '24-48 Hours'}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Actions below 3D Stage */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={`/product/${activeProduct.id}`}
                className="w-full sm:w-auto flex-1 h-12 px-6 rounded-xl bg-[#FF5A1F] hover:bg-[#E04F1A] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#FF5A1F]/20 active:scale-[0.99]"
              >
                <span>Open Full Product Page & Order (₹{activeProduct.price.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/custom-lab"
                className="w-full sm:w-auto h-12 px-5 rounded-xl bg-white hover:bg-black/5 border border-black/15 text-[#111215] font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
                <span>Upload Custom CAD</span>
              </Link>
            </div>

          </div>

          {/* RIGHT: Product Showcase Cards & Quick Selector (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-black/10">
              <span className="font-mono text-xs text-[#8A91A0] uppercase tracking-wider font-semibold">
                Select Part to Inspect ({premierProducts.length} Ready CAD Models)
              </span>
              <span className="font-mono text-[11px] text-[#FF5A1F] font-semibold">
                Click card to view in 3D
              </span>
            </div>

            <div className="space-y-2.5 max-h-[660px] overflow-y-auto pr-1 custom-scrollbar">
              {premierProducts.map((p) => {
                const isSelected = p.id === activeProductId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setActiveProductId(p.id)}
                    className={`group relative p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 select-none ${
                      isSelected
                        ? 'bg-white border-[#FF5A1F] shadow-md ring-1 ring-[#FF5A1F]'
                        : 'bg-[#F8F9FB] border-black/10 hover:border-black/20 hover:bg-white'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white border border-black/10 shrink-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-contain mix-blend-multiply p-1 transition-transform duration-300 group-hover:scale-105"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#FF5A1F] ring-2 ring-white" />
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-mono text-[10px] text-[#FF5A1F] uppercase tracking-wider font-semibold truncate">
                          {p.category}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#111215] shrink-0">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-[#111215] tracking-tight leading-snug truncate group-hover:text-[#FF5A1F] transition-colors">
                        {p.name}
                      </h4>

                      <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono text-[#5E6573]">
                        <span>{p.tolerances || '±0.04 mm'}</span>
                        <span>&bull;</span>
                        <span className="text-emerald-600 font-medium">{p.leadTime || '24-48h'}</span>
                      </div>
                    </div>

                    {/* Action Icon */}
                    <div className="shrink-0 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProductId(p.id);
                        }}
                        className={`p-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-[#FF5A1F] text-white shadow-xs'
                            : 'bg-black/5 text-[#5E6573] group-hover:text-[#111215] group-hover:bg-black/10'
                        }`}
                        title="Inspect in 3D"
                      >
                        <Box className="w-4 h-4" />
                      </button>

                      <Link
                        href={`/product/${p.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg text-xs font-mono bg-black/5 hover:bg-black/10 text-[#5E6573] hover:text-[#111215] transition-all"
                        title="View Product Page"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Bottom Catalog Link */}
            <div className="pt-3">
              <Link
                href="/categories"
                className="w-full py-3 px-4 rounded-xl border border-dashed border-black/20 hover:border-[#FF5A1F] bg-[#F8F9FB] hover:bg-white text-xs font-mono text-center flex items-center justify-center gap-2 text-[#5E6573] hover:text-[#111215] transition-all shadow-2xs"
              >
                <span>Browse All 20+ Production Parts in Hardware Catalog</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#FF5A1F]" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

