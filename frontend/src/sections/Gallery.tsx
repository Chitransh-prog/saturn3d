import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Maximize2, X, Play } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import './Gallery.css';

gsap.registerPlugin(ScrollTrigger);

const galleryAssets = [
  { name: 'Creation Process', type: 'video', url: '/gallery/WhatsApp Video 2026-04-17 at 13.58.12.mp4', tag: 'Live Print', size: 'wide' },
  { name: 'Macro Detail', type: 'image', url: '/gallery/WhatsApp Image 2026-04-17 at 13.57.58.jpeg', tag: '3D Detail' },
  { name: 'Artistic Finish', type: 'image', url: '/gallery/WhatsApp Image 2026-04-17 at 13.57.58 (1).jpeg', tag: 'Finish', size: 'tall' },
  { name: 'Structural Base', type: 'image', url: '/gallery/WhatsApp Image 2026-04-17 at 13.57.59.jpeg', tag: 'Structure' },
  { name: 'Complex Geometry', type: 'image', url: '/gallery/WhatsApp Image 2026-04-17 at 13.57.59 (1).jpeg', tag: 'Design' },
  { name: 'Large Prototype', type: 'image', url: '/gallery/WhatsApp Image 2026-04-17 at 13.57.59 (2).jpeg', tag: 'Scale', size: 'wide' },
  { name: 'Precision Print', type: 'image', url: '/gallery/WhatsApp Image 2026-04-17 at 13.58.00.jpeg', tag: 'Quality' },
  { name: 'Texture Study', type: 'image', url: '/gallery/WhatsApp Image 2026-04-17 at 13.58.00 (1).jpeg', tag: 'Surface' },
  { name: 'Mechanical Link', type: 'image', url: '/gallery/WhatsApp Image 2026-04-17 at 13.58.00 (2).jpeg', tag: 'Functional', size: 'tall' },
  { name: 'Vibrant Resin', type: 'image', url: '/gallery/WhatsApp Image 2026-04-17 at 13.58.01.jpeg', tag: 'Material' },
  { name: 'R&D Concept', type: 'image', url: '/gallery/WhatsApp Image 2026-04-17 at 13.58.01 (1).jpeg', tag: 'R&D', size: 'wide' },
  { name: 'Final Assembly', type: 'image', url: '/gallery/WhatsApp Image 2026-04-17 at 13.58.01 (2).jpeg', tag: 'Assembly' },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [selectedAsset, setSelectedAsset] = useState<typeof galleryAssets[0] | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const initialItemsCount = 8;
  const visibleAssets = isExpanded ? galleryAssets : galleryAssets.slice(0, initialItemsCount);

  useEffect(() => {
    if (!gridRef.current || !headerRef.current) return;

    ScrollTrigger.getAll().forEach(t => t.kill());

    gsap.fromTo(headerRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 92%',
        }
      }
    );
  }, []);

  return (
    <section className="py-16 sm:py-24 px-3 sm:px-6 lg:px-10 bg-[#E5E5E5] overflow-hidden" ref={sectionRef}>
      {/* Framed Section Card matching Hero Bezel */}
      <div className="w-full max-w-[1440px] mx-auto rounded-[32px] sm:rounded-[44px] bg-[#EDEDED] border border-black/5 p-6 sm:p-10 lg:p-14 shadow-xl relative overflow-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16 pb-8 border-b border-black/10" ref={headerRef}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F7931E]" />
              <span className="font-mono-tech text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-slate-700">
                08 / PHYSICAL ARTIFACT ARCHIVE
              </span>
            </div>

            <h2 className="font-monumental text-5xl sm:text-7xl lg:text-8xl font-black text-black tracking-tight leading-[0.88] uppercase">
              STUDIO <span className="text-[#F7931E]">OUTPUTS</span>
            </h2>
          </div>

          <p className="font-mono-tech text-[11px] sm:text-xs text-slate-600 uppercase tracking-widest max-w-md leading-relaxed">
            High-magnification macro views and real factory runs of our functional CoreXY and SLA stereolithography builds.
          </p>
        </div>

        {/* Gallery Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[260px] grid-flow-dense"
          ref={gridRef}
        >
          {visibleAssets.map((asset, index) => (
            <div
              key={`${index}-${asset.name}`}
              className={`
                gallery-item group relative overflow-hidden rounded-[1.75rem] bg-white border border-black/10 shadow-xs transition-all duration-500 hover:shadow-2xl hover:border-black hover:-translate-y-1 cursor-pointer
                ${asset.size === 'wide' ? 'col-span-2' : 'col-span-1'}
                ${asset.size === 'tall' ? 'row-span-2' : 'row-span-1'}
              `}
              onClick={() => setSelectedAsset(asset)}
            >
              <div className="absolute inset-0 bg-[#EAEAEA]">
                {asset.type === 'video' ? (
                  <video
                    src={asset.url}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="font-mono-tech text-[9px] font-bold uppercase tracking-widest text-[#F7931E] mb-1">
                  {asset.tag}
                </span>
                <h3 className="font-monumental text-xl sm:text-2xl text-white tracking-wide uppercase">
                  {asset.name}
                </h3>
              </div>

              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-black flex items-center justify-center shadow-xs">
                  {asset.type === 'video' ? <Play className="w-3.5 h-3.5 fill-current ml-0.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Viewer */}
        <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
          <DialogContent className="max-w-[1100px] w-[95vw] max-h-[90vh] p-0 overflow-hidden bg-black border border-white/10 rounded-[2.5rem] shadow-2xl">
            {selectedAsset && (
              <div className="flex flex-col h-full relative">
                <div className="absolute top-0 inset-x-0 p-5 flex items-center justify-between z-30 bg-gradient-to-b from-black/80 to-transparent">
                  <div className="rounded-full bg-black/70 backdrop-blur-xl border border-white/20 px-4 py-1.5">
                    <span className="font-mono-tech text-[10px] uppercase font-bold text-[#F7931E] tracking-widest">
                      {selectedAsset.tag} &bull; {selectedAsset.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedAsset(null)}
                    className="w-10 h-10 rounded-full bg-white text-black hover:bg-neutral-200 flex items-center justify-center transition-all shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 bg-black flex items-center justify-center p-4 min-h-[500px]">
                  {selectedAsset.type === 'video' ? (
                    <video
                      src={selectedAsset.url}
                      controls
                      autoPlay
                      loop
                      className="max-w-full max-h-[75vh] object-contain rounded-2xl"
                    />
                  ) : (
                    <img
                      src={selectedAsset.url}
                      alt={selectedAsset.name}
                      className="max-w-full max-h-[75vh] object-contain rounded-2xl"
                    />
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Expansion Capsule Pill Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white font-mono-tech text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 shadow-md active:scale-95"
          >
            <span>{isExpanded ? 'COLLAPSE ARCHIVE' : 'VIEW FULL OUTPUT VAULT'}</span>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <Maximize2 className="w-3 h-3 text-white" />
            </div>
          </button>
        </div>

      </div>
    </section>
  );
}
