import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, ArrowUpRight, Maximize2, 
  X, Star, CheckCircle2, ShieldCheck, Activity, Cpu, 
  Layers, Sliders, ExternalLink, MessageCircle
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import Testimonials from '@/sections/Testimonials';

gsap.registerPlugin(ScrollTrigger);

interface ProofBentoItem {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  tag: string;
  category: 'corexy' | 'macro' | 'structural' | 'prototype';
  headline: string;
  specs: {
    layerHeight: string;
    tolerance: string;
    infill: string;
    speedOrProcess: string;
    material: string;
  };
  gridSpan: string;
  minHeightClass: string;
  badgeBg: string;
  badgeFg: string;
}

const proofAssets: ProofBentoItem[] = [
  {
    id: 'live-print',
    name: 'Live CoreXY Fabrication',
    type: 'video',
    url: '/gallery/WhatsApp Video 2026-04-17 at 13.58.12.mp4',
    tag: 'COREXY // 500 MM/S',
    category: 'corexy',
    headline: 'High-Velocity Sintering & Heated Chamber Deposition',
    specs: {
      layerHeight: '120μm',
      tolerance: '±0.04 MM',
      infill: '40% Gyroid',
      speedOrProcess: '500 MM/S @ 20,000 MM/S²',
      material: 'Industrial Grade PETG',
    },
    gridSpan: 'lg:col-span-7 lg:row-span-2',
    minHeightClass: 'min-h-[460px] sm:min-h-[520px]',
    badgeBg: 'bg-[#FF5A1F]',
    badgeFg: 'text-white',
  },
  {
    id: 'macro-tolerances',
    name: 'Macro Layer Tolerances',
    type: 'image',
    url: '/gallery/WhatsApp Image 2026-04-17 at 13.57.58.jpeg',
    tag: 'MICRO DETAIL // 40μm',
    category: 'macro',
    headline: 'Sub-0.03mm Geometric Stepped Sintering on Intricate Facets',
    specs: {
      layerHeight: '40μm Adaptive',
      tolerance: '±0.03 MM',
      infill: '100% Solid Core',
      speedOrProcess: 'Optical CMM Verification',
      material: 'High-Precision Matte Resin',
    },
    gridSpan: 'lg:col-span-5',
    minHeightClass: 'min-h-[245px]',
    badgeBg: 'bg-[#FFE14D]',
    badgeFg: 'text-[#0B0B0B]',
  },
  {
    id: 'artistic-prototype',
    name: 'Thin-Wall Optical Transmission',
    type: 'image',
    url: '/gallery/WhatsApp Image 2026-04-17 at 13.57.58 (1).jpeg',
    tag: 'POLYMER TRANSMISSION',
    category: 'prototype',
    headline: 'Homogeneous Core Density with Internal Light Diffusion',
    specs: {
      layerHeight: '80μm Micron',
      tolerance: '±0.04 MM',
      infill: '20% Gyroid Matrix',
      speedOrProcess: 'Thermal Annealed',
      material: 'Translucent Engineering Polymer',
    },
    gridSpan: 'lg:col-span-5',
    minHeightClass: 'min-h-[245px]',
    badgeBg: 'bg-[#7CF2C1]',
    badgeFg: 'text-[#0B0B0B]',
  },
  {
    id: 'structural-bracket',
    name: 'Structural Overhang Bridge',
    type: 'image',
    url: '/gallery/WhatsApp Image 2026-04-17 at 13.57.59.jpeg',
    tag: 'STRUCTURAL // ZERO SUPPORT',
    category: 'structural',
    headline: '65mm Horizontal Unsupported Bridging with Zero Droop',
    specs: {
      layerHeight: '160μm Structural',
      tolerance: '±0.04 MM',
      infill: '60% Honeycomb',
      speedOrProcess: 'Closed-Loop Closed Chamber',
      material: 'Engineering Carbon-X PLA+',
    },
    gridSpan: 'lg:col-span-4',
    minHeightClass: 'min-h-[320px]',
    badgeBg: 'bg-[#FAF7F2]',
    badgeFg: 'text-[#0B0B0B]',
  },
  {
    id: 'high-density-cad',
    name: 'High-Density Dual Geometry',
    type: 'image',
    url: '/gallery/WhatsApp Image 2026-04-17 at 13.57.59 (1).jpeg',
    tag: 'COMPLEX CAD // MULTI-TOOL',
    category: 'prototype',
    headline: 'Dual Extrusion Pocket Contours & Seamless Color Boundary',
    specs: {
      layerHeight: '120μm Contour',
      tolerance: '±0.04 MM',
      infill: '35% Gyroid',
      speedOrProcess: 'Dual Toolhead Extrusion',
      material: 'Industrial Co-Polymer Dual Tone',
    },
    gridSpan: 'lg:col-span-4',
    minHeightClass: 'min-h-[320px]',
    badgeBg: 'bg-[#FF5A1F]',
    badgeFg: 'text-white',
  },
  {
    id: 'large-scale-facade',
    name: 'Precision Embossed Typography',
    type: 'image',
    url: '/gallery/WhatsApp Image 2026-04-17 at 13.57.59 (2).jpeg',
    tag: 'EMBOSSED TEXT // ZERO STRING',
    category: 'macro',
    headline: 'Razor-Sharp Lettering Contours with First-Layer Ironing',
    specs: {
      layerHeight: '100μm Ultra-Fine',
      tolerance: '±0.03 MM',
      infill: '100% Solid Surface',
      speedOrProcess: 'Heated Nozzle Ironing Pass',
      material: 'ESD-Safe Matte Charcoal',
    },
    gridSpan: 'lg:col-span-4',
    minHeightClass: 'min-h-[320px]',
    badgeBg: 'bg-[#FFE14D]',
    badgeFg: 'text-[#0B0B0B]',
  },
];


type CategoryFilter = 'all' | 'corexy' | 'macro' | 'structural' | 'prototype';

export default function ProofGallery() {
  const [selectedAsset, setSelectedAsset] = useState<ProofBentoItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  // GSAP Stagger Scroll Entrance
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.bento-card',
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.08,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(
        '.review-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.reviews-container',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleFilterChange = (filter: CategoryFilter) => {
    setActiveFilter(filter);
    gsap.fromTo(
      '.bento-card',
      { opacity: 0.6, scale: 0.99 },
      { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out', stagger: 0.04 }
    );
  };

  const filteredAssets = activeFilter === 'all'
    ? proofAssets
    : proofAssets.filter((item) => item.category === activeFilter);

  return (
    <section
      id="proof"
      ref={sectionRef}
      data-bg="#FAF7F2"
      data-fg="#0B0B0B"
      className="relative w-full bg-[#FAF7F2] text-[#0B0B0B] py-20 sm:py-28 px-4 sm:px-8 lg:px-14 overflow-hidden pattern-blueprint border-b-3 border-ink"
    >
      <div className="max-w-7xl mx-auto w-full">
        
        {/* ─── Section Header ─── */}
        <div data-aos="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14 pb-8 border-b-2 border-ink">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-[#0B0B0B]/70">
                08 // PHYSICAL ARTIFACTS &amp; PROOF
              </span>
              <span className="badge-sticker bg-[#FFE14D] text-[10px] font-black">
                VERIFIED PRINTS
              </span>
            </div>

            <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase text-ink tracking-tight leading-[0.92]">
              REAL PRINTS. <span className="text-[#FF5A1F]">REAL PROOF.</span>
            </h2>
          </div>

          <p className="font-mono text-xs sm:text-sm text-[#0B0B0B]/80 max-w-md font-bold leading-relaxed bg-white/70 p-3.5 border-2 border-ink shadow-brutal-sm rounded-xs">
            Zero 3D CGI mockups. Unfiltered captures directly from our Bhopal additive farm
            benchmarked with optical digital micrometers and CMM inspection.
          </p>
        </div>

        {/* ─── Interactive Bento Filter Pills ─── */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-8 -mx-4 px-4 whitespace-nowrap">
          <span className="font-mono text-xs font-black uppercase text-ink/60 mr-1 shrink-0">
            FILTER ARCHIVE:
          </span>
          {[
            { id: 'all', label: 'ALL ARTIFACTS (6)' },
            { id: 'corexy', label: 'COREXY VIDEO (1)' },
            { id: 'macro', label: 'MACRO TOLERANCES (2)' },
            { id: 'structural', label: 'STRUCTURAL BRIDGING (1)' },
            { id: 'prototype', label: 'FUNCTIONAL CAD (2)' },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id as CategoryFilter)}
                className={`px-3.5 py-1.5 font-mono text-xs font-black uppercase tracking-wider rounded-xs border-2 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#0B0B0B] text-[#FFE14D] border-ink shadow-brutal-sm -translate-y-0.5'
                    : 'bg-white text-ink/70 border-ink/40 hover:bg-[#FAF7F2] hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ─── NEO-BRUTALIST BENTO GRID (12 COLS) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 mb-24">
          {proofAssets.map((asset, idx) => {
            const isMatch = activeFilter === 'all' || asset.category === activeFilter;
            const isFeaturedVideo = asset.id === 'live-print';

            return (
              <div
                key={asset.id}
                data-aos="fade-up"
                data-aos-delay={(idx % 3) * 100}
                onClick={() => setSelectedAsset(asset)}
                className={`bento-card card-slab bg-white border-2 border-ink shadow-brutal-sm hover:shadow-brutal rounded-xs flex flex-col justify-between overflow-hidden relative transition-all duration-300 group cursor-pointer ${
                  asset.gridSpan
                } ${asset.minHeightClass} ${
                  isMatch ? 'opacity-100 scale-100' : 'opacity-35 grayscale scale-[0.98]'
                }`}
              >
                {/* Media Container (100% Filled, zero dead space!) */}
                <div className="relative w-full flex-1 overflow-hidden bg-[#0B0B0B] min-h-[180px]">
                  {asset.type === 'video' ? (
                    <div className="w-full h-full relative">
                      <video
                        ref={videoRef}
                        src={asset.url}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                        muted={isVideoMuted}
                        loop
                        autoPlay
                        playsInline
                      />
                      
                      {/* Dark Gradient Bottom Scrim */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      {/* Video Center Play Radar Indicator */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-13 h-13 rounded-full bg-[#FF5A1F] border-2 border-white text-white flex items-center justify-center shadow-brutal-sm group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>

                      {/* Mute / Unmute Overlay Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsVideoMuted(!isVideoMuted);
                        }}
                        className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-xs bg-[#0B0B0B]/85 hover:bg-[#FFE14D] hover:text-ink text-white border border-white/30 flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                        title={isVideoMuted ? 'Unmute Video' : 'Mute Video'}
                      >
                        {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      {/* Real-time Telemetry HUD Ribbon */}
                      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-2 bg-[#0B0B0B]/90 backdrop-blur-md border border-white/20 px-2.5 py-1 font-mono text-[10px] text-white select-none">
                        <span className="w-2 h-2 rounded-full bg-[#7CF2C1] animate-ping" />
                        <span className="font-black text-[#FFE14D]">COREXY-01</span>
                        <span>&bull;</span>
                        <span>500 MM/S</span>
                        <span>&bull;</span>
                        <span className="text-[#FF5A1F]">245°C</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <img
                        src={asset.url}
                        alt={asset.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      />
                      {/* Ambient Gradient Scrim */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                    </div>
                  )}

                  {/* Top-Left Category Badge */}
                  <div className="absolute top-3 left-3 z-20">
                    <span
                      className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-black px-2.5 py-1 rounded-xs border-2 border-ink shadow-brutal-xs uppercase tracking-wider ${asset.badgeBg} ${asset.badgeFg}`}
                    >
                      {asset.type === 'video' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                      <span>{asset.tag}</span>
                    </span>
                  </div>

                  {/* Top-Right Expand Action */}
                  <div className="absolute top-3 right-3 z-20 w-8 h-8 bg-white hover:bg-[#FFE14D] border-2 border-ink text-ink shadow-brutal-xs flex items-center justify-center transition-all opacity-90 group-hover:opacity-100 group-hover:scale-105">
                    <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>

                {/* Bottom Spec Footer Strip */}
                <div className="p-4 bg-white border-t-3 border-ink flex items-center justify-between gap-3 z-10 select-none">
                  <div className="space-y-0.5">
                    <h3 className="font-display font-black text-sm sm:text-base uppercase text-ink tracking-tight group-hover:text-[#FF5A1F] transition-colors">
                      {asset.name}
                    </h3>
                    <p className="font-mono text-[11px] font-bold text-ink/70 line-clamp-1">
                      {asset.headline}
                    </p>
                  </div>

                  {/* Inspection Trigger Icon */}
                  <div className="w-8 h-8 rounded-xs bg-[#FAF7F2] group-hover:bg-[#FF5A1F] group-hover:text-white border-2 border-ink flex items-center justify-center shrink-0 transition-all shadow-xs">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* ─── REAL CLIENT PROOF: NEO-BRUTALISM TESTIMONIAL CARDS TEMPLATE ─── */}
        <div className="reviews-container pt-16 border-t-3 border-ink">
          <Testimonials />
        </div>

      </div>

      {/* ─── NEO-BRUTALIST INSPECTION LIGHTBOX DIALOG ─── */}
      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent showCloseButton={false} className="max-w-[94vw] lg:max-w-4xl p-0 bg-[#FAF7F2] border-4 border-ink shadow-brutal-xl overflow-hidden rounded-xs">
          {selectedAsset && (
            <div className="flex flex-col">
              
              {/* Modal Header Bar */}
              <div className="p-4 bg-white border-b-3 border-ink flex items-center justify-between select-none">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 bg-[#FF5A1F] border border-ink" />
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-ink">
                    METROLOGY INSPECTION // {selectedAsset.tag}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="w-8 h-8 rounded-xs border-2 border-ink bg-white hover:bg-[#FFE14D] text-ink flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Modal Body: Media Preview + Technical Spec Table */}
              <div className="grid grid-cols-1 lg:grid-cols-12 bg-white">
                
                {/* Media Showcase (7 cols) */}
                <div className="lg:col-span-7 bg-[#0B0B0B] p-2 flex items-center justify-center min-h-[280px] sm:min-h-[380px] border-b-3 lg:border-b-0 lg:border-r-3 border-ink">
                  {selectedAsset.type === 'video' ? (
                    <video
                      src={selectedAsset.url}
                      className="w-full max-h-[52vh] object-contain"
                      controls
                      autoPlay
                    />
                  ) : (
                    <img
                      src={selectedAsset.url}
                      alt={selectedAsset.name}
                      className="w-full max-h-[52vh] object-contain"
                    />
                  )}
                </div>

                {/* Technical Spec Sheet (5 cols) */}
                <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between gap-6 bg-[#FAF7F2]">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] font-black text-[#FF5A1F] uppercase tracking-wider">
                        BHOPAL LAB VERIFIED BUILD
                      </span>
                      <h3 className="font-display font-black text-xl text-ink uppercase tracking-tight">
                        {selectedAsset.name}
                      </h3>
                      <p className="font-mono text-xs font-bold text-ink/75 leading-relaxed">
                        {selectedAsset.headline}
                      </p>
                    </div>

                    {/* Spec Key-Value Table */}
                    <div className="space-y-2 border-2 border-ink bg-white p-3 rounded-xs font-mono text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-ink/15 text-[11px]">
                        <span className="text-ink/60 font-bold">LAYER HEIGHT:</span>
                        <strong className="text-ink font-black">{selectedAsset.specs.layerHeight}</strong>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-ink/15 text-[11px]">
                        <span className="text-ink/60 font-bold">ACCURACY DATUM:</span>
                        <strong className="text-[#FF5A1F] font-black">{selectedAsset.specs.tolerance}</strong>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-ink/15 text-[11px]">
                        <span className="text-ink/60 font-bold">INFILL PATTERN:</span>
                        <strong className="text-ink font-black">{selectedAsset.specs.infill}</strong>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-ink/15 text-[11px]">
                        <span className="text-ink/60 font-bold">PRINT PROCESS:</span>
                        <strong className="text-ink font-black">{selectedAsset.specs.speedOrProcess}</strong>
                      </div>
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-ink/60 font-bold">POLYMER GRADE:</span>
                        <strong className="text-ink font-black">{selectedAsset.specs.material}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Modal Action CTA Buttons */}
                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={() => {
                        setSelectedAsset(null);
                        navigate('/custom-lab');
                      }}
                      className="btn-brutal btn-brutal-orange text-xs py-3 px-4 flex items-center justify-center gap-2 shadow-brutal-sm"
                    >
                      <span>ORDER IN THIS SPEC</span>
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    </button>

                    <button
                      onClick={() => {
                        const msg = encodeURIComponent(
                          `Hello Saturn 3D engineering team, I'd like to manufacture parts matching the ${selectedAsset.name} spec (${selectedAsset.specs.material}, ${selectedAsset.specs.layerHeight}).`
                        );
                        window.open(`https://wa.me/917999824632?text=${msg}`, '_blank');
                      }}
                      className="btn-brutal bg-white hover:bg-[#FFE14D] text-ink text-xs py-2.5 px-4 flex items-center justify-center gap-2 shadow-brutal-sm"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                      <span>INQUIRE ON WHATSAPP</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

    </section>
  );
}
