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
    <section className="relative w-full py-20 lg:py-28 bg-[#0B0D10] text-[#F5F6F8] border-y border-white/10 overflow-hidden">
      {/* Background CAD Grid Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #FFFFFF 1px, transparent 1px),
            linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />
      {/* Subtle Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF5A1F]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="scroll-reveal max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#FF5A1F] font-mono text-[11px] uppercase tracking-widest mb-4">
            <Box className="w-3.5 h-3.5" />
            <span>Interactive 3D Hardware Telemetry // Bhopal Facility</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Real Engineered Parts. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-[#FF5A1F]">
              Inspect in Full 3D CAD.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#8E95A2] leading-relaxed">
            Rotate, zoom, and test material formulations on real production components manufactured at our 
            Bhopal precision facility. Order instant units or download specifications.
          </p>
        </div>

        {/* CAD Inspection Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: 3D CAD Interactive Stage (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Main 3D Canvas Box */}
            <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#151920] to-[#0E1116] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
              
              {/* Stage Top Bar */}
              <div className="px-5 py-3.5 bg-black/40 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-semibold text-white tracking-wide truncate max-w-[220px] sm:max-w-none">
                    {activeProduct.name}
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 text-[#FF5A1F]">
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
                          ? 'bg-[#FF5A1F] text-white font-bold shadow-md shadow-[#FF5A1F]/20'
                          : 'bg-white/5 text-[#8E95A2] hover:text-white hover:bg-white/10'
                      }`}
                      title={mat.name}
                    >
                      {mat.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3D Canvas Container */}
              <div className="relative w-full h-[400px] sm:h-[480px] bg-[#0E1116]">
                <Product3DViewer
                  product={activeProduct}
                  selectedMaterial={selectedMaterial}
                />
              </div>

              {/* Bottom CAD Metrology Spec Strip */}
              <div className="p-4 sm:p-5 bg-black/60 backdrop-blur-md border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-[10px] text-[#8E95A2] uppercase flex items-center gap-1">
                    <Ruler className="w-3 h-3 text-[#FF5A1F]" /> Dimensions
                  </div>
                  <div className="font-semibold text-white mt-0.5 truncate">
                    {activeProduct.dimensions || 'Standard CAD'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-[10px] text-[#8E95A2] uppercase flex items-center gap-1">
                    <Scale className="w-3 h-3 text-[#FF5A1F]" /> Mass
                  </div>
                  <div className="font-semibold text-white mt-0.5">
                    {activeProduct.weight || '52 g'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-[10px] text-[#8E95A2] uppercase flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-[#FF5A1F]" /> Material
                  </div>
                  <div className="font-semibold text-white mt-0.5 truncate">
                    {activeProduct.material || 'Engineering Polymer'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-[10px] text-[#8E95A2] uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#FF5A1F]" /> Lead Time
                  </div>
                  <div className="font-semibold text-emerald-400 mt-0.5">
                    {activeProduct.leadTime || '24-48 Hours'}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Actions below 3D Stage */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={`/product/${activeProduct.id}`}
                className="w-full sm:w-auto flex-1 h-12 px-6 rounded-xl bg-[#FF5A1F] hover:bg-[#E04F1A] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF5A1F]/20 active:scale-[0.99]"
              >
                <span>Open Full Product Page & Order (₹{activeProduct.price.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/custom-lab"
                className="w-full sm:w-auto h-12 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
                <span>Upload Custom CAD</span>
              </Link>
            </div>

          </div>

          {/* RIGHT: Product Showcase Cards & Quick Selector (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-mono text-xs text-[#8E95A2] uppercase tracking-wider">
                Select Part to Inspect ({premierProducts.length} Ready CAD Models)
              </span>
              <span className="font-mono text-[11px] text-[#FF5A1F]">
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
                        ? 'bg-white/10 border-[#FF5A1F] shadow-lg shadow-[#FF5A1F]/10 ring-1 ring-[#FF5A1F]'
                        : 'bg-[#12161E]/80 border-white/10 hover:border-white/25 hover:bg-[#151922]'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#FF5A1F] ring-2 ring-black" />
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-mono text-[10px] text-[#FF5A1F] uppercase tracking-wider truncate">
                          {p.category}
                        </span>
                        <span className="font-mono text-xs font-bold text-white shrink-0">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-white tracking-tight leading-snug truncate group-hover:text-[#FF5A1F] transition-colors">
                        {p.name}
                      </h4>

                      <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono text-[#8E95A2]">
                        <span>{p.tolerances || '±0.04 mm'}</span>
                        <span>&bull;</span>
                        <span className="text-emerald-400">{p.leadTime || '24-48h'}</span>
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
                        className={`p-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#FF5A1F] text-white'
                            : 'bg-white/5 text-[#8E95A2] group-hover:text-white group-hover:bg-white/10'
                        }`}
                        title="Inspect in 3D"
                      >
                        <Box className="w-4 h-4" />
                      </button>

                      <Link
                        href={`/product/${p.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/15 text-[#8E95A2] hover:text-white transition-all"
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
                className="w-full py-3 px-4 rounded-xl border border-dashed border-white/20 hover:border-[#FF5A1F] bg-white/5 hover:bg-white/10 text-xs font-mono text-center flex items-center justify-center gap-2 text-[#8E95A2] hover:text-white transition-all"
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

