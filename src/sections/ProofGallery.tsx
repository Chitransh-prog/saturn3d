'use client';

import React, { useState } from 'react';
import { 
  Maximize2, X, ArrowRight, Sparkles, Layers, ShieldCheck, 
  Box, Cpu, Flame, ExternalLink, CheckCircle2 
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Testimonials from '@/sections/Testimonials';
import { useNavigate } from 'react-router-dom';

export interface BentoItem {
  id: string;
  name: string;
  category: string;
  material: string;
  layerHeight: string;
  tolerance: string;
  desc: string;
  image: string;
  colSpan: string; // Tailwind grid span
  filter: 'industrial' | 'lighting' | 'custom';
}

const BENTO_PRINTS: BentoItem[] = [
  {
    id: 'bento-1',
    name: 'Planetary Gear Differential Set',
    category: 'Functional Kinematics',
    material: 'Tough Engineering PETG',
    layerHeight: '0.12 mm',
    tolerance: '±0.04 mm Zero-Backlash',
    desc: 'Interlocking planetary spur gear set with smooth meshing and zero post-machining backlash. Fabricated as a print-in-place kinematic mechanism.',
    image: '/gallery/bento/bento-1.jpg',
    colSpan: 'lg:col-span-2 lg:row-span-1',
    filter: 'industrial',
  },
  {
    id: 'bento-2',
    name: 'Sacred Meru Temple Geometry',
    category: 'Architectural Miniature',
    material: 'Matte Ivory Precision PLA',
    layerHeight: '0.08 mm Ultra-Fine',
    tolerance: '±0.03 mm Terraced Edges',
    desc: 'Micro-stepped parametric pyramid temple with 18 distinct concentric terraces and crisp summit finial engineered with zero layer shift.',
    image: '/gallery/bento/bento-2.jpg',
    colSpan: 'lg:col-span-1 lg:row-span-1',
    filter: 'custom',
  },
  {
    id: 'bento-3',
    name: 'Amber Luminescent Pyramid Lamp',
    category: 'Illuminated Lithophane',
    material: 'Translucent Optical Polymer',
    layerHeight: '0.05 mm SLA Optic',
    tolerance: 'Internal Diffuser Core',
    desc: 'High-temperature optical resin architectural sculpture with integrated warm LED illumination core. Light transmits through variable-density wall geometry.',
    image: '/gallery/bento/bento-3.jpg',
    colSpan: 'lg:col-span-1 lg:row-span-2',
    filter: 'lighting',
  },
  {
    id: 'bento-4',
    name: 'Impossible Escher Pen Stand',
    category: 'Geometric Desktop',
    material: 'Pure White PLA Pro',
    layerHeight: '0.16 mm',
    tolerance: '45° Self-Supporting Bridge',
    desc: 'Optical illusion cantilevered desk organizer engineered with self-supporting 45° overhang bridging without sacrificial support scarring.',
    image: '/gallery/bento/bento-4.jpg',
    colSpan: 'lg:col-span-1 lg:row-span-1',
    filter: 'custom',
  },
  {
    id: 'bento-5',
    name: 'Medical Scrubs Pen Organizer',
    category: 'Custom Healthcare Utility',
    material: 'Dual-Color Medical Rose & Black',
    layerHeight: '0.12 mm High-Detail',
    tolerance: 'Multi-Extrusion Inlay',
    desc: 'Custom medical profession desk organizer with dual-filament stethoscope detailing and dual deep pen pockets for clinical workstations.',
    image: '/gallery/bento/bento-5.jpg',
    colSpan: 'lg:col-span-1 lg:row-span-1',
    filter: 'custom',
  },
  {
    id: 'bento-6',
    name: 'Precision Miniatures & Plaque',
    category: 'Filigree Micro-Prints',
    material: 'Metallic Silver & Carbon Resin',
    layerHeight: '0.05 mm Precision SLA',
    tolerance: 'Sub-Millimeter Thin Walls',
    desc: 'Complex low-poly cheetah figurine, parametric silver lotus flower, and typographic film plaque with crisp micro-edges.',
    image: '/gallery/bento/bento-6.jpg',
    colSpan: 'lg:col-span-1 lg:row-span-1',
    filter: 'custom',
  },
  {
    id: 'bento-7',
    name: 'Dual-Tone Nurse Coaster Duo',
    category: 'Corporate & Gifting Batch',
    material: 'High-Density Matte PLA',
    layerHeight: '0.10 mm Dual-Color',
    tolerance: 'Inlaid Typographic Layer',
    desc: 'Two-tone typographic drink coasters featuring contrast text inlay and slip-resistant base geometry for clinic breakrooms.',
    image: '/gallery/bento/bento-7.jpg',
    colSpan: 'lg:col-span-2 lg:row-span-1',
    filter: 'custom',
  },
  {
    id: 'bento-8',
    name: 'Minimalist Saguaro Jewelry Tree',
    category: 'Bio-Composite Decor',
    material: 'Wood-Fill Composite Polymer',
    layerHeight: '0.16 mm',
    tolerance: 'Press-Fit Hex Base',
    desc: 'Textured wood-fiber bio-composite jewelry & accessory organizer with hexagonal catch-all tray base and organic branch arms.',
    image: '/gallery/bento/bento-8.jpg',
    colSpan: 'lg:col-span-1 lg:row-span-1',
    filter: 'custom',
  },
  {
    id: 'bento-9',
    name: 'Galactic Sith Lord Desk Vessel',
    category: 'Collectibles & Functional Art',
    material: 'High-Gloss Obsidian PETG',
    layerHeight: '0.12 mm High-Gloss',
    tolerance: 'Watertight Deep Vessel',
    desc: 'Anatomically accurate Sith helmet styled desktop planter and vessel with polished facet reflections and weighted center of gravity.',
    image: '/gallery/bento/bento-9.jpg',
    colSpan: 'lg:col-span-1 lg:row-span-2',
    filter: 'custom',
  },
  {
    id: 'bento-10',
    name: 'Micro-Connector Terminal Matrix',
    category: 'Industrial Batch Production',
    material: 'Flame-Retardant PC-ABS',
    layerHeight: '0.10 mm Serial Run',
    tolerance: '±0.04 mm Pin Repeatability',
    desc: 'Serial batch production of 200+ modular electronics mounting strips with precision micro-pin perforations for electrical control cabinets.',
    image: '/gallery/bento/bento-10.jpg',
    colSpan: 'lg:col-span-1 lg:row-span-1',
    filter: 'industrial',
  },
  {
    id: 'bento-11',
    name: 'Forest Canopy Ambient Lithophane',
    category: 'Atmospheric Lighting',
    material: 'Variable-Density Opal Polymer',
    layerHeight: '0.10 mm Litho Metrology',
    tolerance: 'Continuous Curved Surface',
    desc: 'Curved cylindrical night lamp featuring natural woodland silhouette. Light passes through varying thickness walls to cast a warm, radiant gradient.',
    image: '/gallery/bento/bento-11.jpg',
    colSpan: 'lg:col-span-2 lg:row-span-1',
    filter: 'lighting',
  },
];

export default function ProofGallery() {
  const [selectedItem, setSelectedItem] = useState<BentoItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'industrial' | 'lighting' | 'custom'>('all');
  const navigate = useNavigate();

  const filteredPrints = activeFilter === 'all' 
    ? BENTO_PRINTS 
    : BENTO_PRINTS.filter(item => item.filter === activeFilter);

  return (
    <section
      id="proof"
      className="w-full bg-[#F5F6F8] text-[#0B0D10] py-20 sm:py-28 px-4 sm:px-8 lg:px-12 overflow-hidden font-body border-t border-black/10"
      aria-label="Real Prints Bento Gallery"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div data-aos="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#5B616B] font-semibold">
                07 // Physical Artifact Archive
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#0B0D10]">
              Fabricated with micron repeatability.
            </h2>
            <p className="text-sm text-[#5B616B] mt-2 max-w-2xl leading-relaxed">
              Explore authentic shop outputs from our Bhopal manufacturing hub: interlocking industrial mechanisms, batch micro-connectors, organic lithophanes, and bespoke collectibles.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-neutral-200 rounded-xl shadow-2xs self-start md:self-auto shrink-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#FF5A1F] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              All Prints (11)
            </button>
            <button
              onClick={() => setActiveFilter('industrial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeFilter === 'industrial'
                  ? 'bg-[#FF5A1F] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Industrial & Batch
            </button>
            <button
              onClick={() => setActiveFilter('lighting')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeFilter === 'lighting'
                  ? 'bg-[#FF5A1F] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Lamps & Lithophanes
            </button>
            <button
              onClick={() => setActiveFilter('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeFilter === 'custom'
                  ? 'bg-[#FF5A1F] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Custom & Desktop
            </button>
          </div>
        </div>

        {/* =================================================================
            MASTER BENTO GRID (4-Column Layout directly matching user collage)
        ================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[220px]">
          {filteredPrints.map((item, idx) => {
            const isTall = item.colSpan.includes('row-span-2');
            return (
              <div
                key={item.id}
                data-aos="fade-up"
                data-aos-delay={(idx % 4) * 60}
                onClick={() => setSelectedItem(item)}
                className={`
                  group relative overflow-hidden rounded-2xl bg-white border border-neutral-200/90 
                  shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer
                  ${item.colSpan}
                  ${isTall ? 'min-h-[456px]' : 'min-h-[220px]'}
                `}
              >
                {/* Image Surface with Zoom */}
                <div className="absolute inset-0 w-full h-full bg-neutral-900">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                  />
                  {/* Subtle Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                </div>

                {/* Top Floating Badge & Expand Action */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                  <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-neutral-900 shadow-2xs">
                    {item.category}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xs">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bottom Title & Specs Card */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10 pointer-events-none space-y-1">
                  <h3 className="text-sm font-semibold tracking-tight text-white group-hover:text-[#FF8A50] transition-colors leading-snug drop-shadow-sm">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-neutral-300">
                    <span>{item.material}</span>
                    <span className="text-white/40">&bull;</span>
                    <span className="text-emerald-400 font-medium">{item.tolerance}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Client Testimonials Integration */}
        <div className="pt-10 border-t border-black/10">
          <Testimonials />
        </div>

      </div>

      {/* =================================================================
          INSPECTION LIGHTBOX MODAL WITH FULL METROLOGY TELEMETRY
      ================================================================= */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent showCloseButton={false} className="max-w-3xl p-0 bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xl">
          {selectedItem && (
            <div>
              {/* Modal Header */}
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
                  <span className="font-mono text-xs font-semibold text-neutral-900">
                    {selectedItem.name} // Artifact Spec
                  </span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-8 h-8 rounded-lg hover:bg-neutral-200/80 flex items-center justify-center text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                <div className="aspect-[16/10] w-full rounded-xl bg-neutral-900 overflow-hidden relative shadow-inner">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name} 
                    className="w-full h-full object-contain" 
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-mono text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saturn 3D Quality Checked</span>
                  </div>
                </div>

                {/* Telemetry Matrix Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div>
                    <span className="text-[10px] text-neutral-500 block">CATEGORY</span>
                    <span className="font-semibold text-neutral-900">{selectedItem.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block">MATERIAL</span>
                    <span className="font-semibold text-neutral-900">{selectedItem.material}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block">LAYER HEIGHT</span>
                    <span className="font-semibold text-neutral-900">{selectedItem.layerHeight}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block">METROLOGY</span>
                    <span className="font-semibold text-[#FF5A1F]">{selectedItem.tolerance}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {selectedItem.desc} Manufactured at the Saturn 3D Govindpura facility in Bhopal with pan-India 24–48h express logistics.
                </p>

                {/* Instant Action CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-100">
                  <span className="text-xs text-neutral-500 font-mono">
                    Ready to prototype or batch produce similar components?
                  </span>
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      navigate('/custom-lab');
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#E04810] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Instant CAD Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
