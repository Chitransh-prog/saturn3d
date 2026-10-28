import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Maximize2, X, Play, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import SectionHeader from '@/components/SectionHeader';

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
  const [selectedAsset, setSelectedAsset] = useState<typeof galleryAssets[0] | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const initialItemsCount = 8;
  const visibleAssets = isExpanded ? galleryAssets : galleryAssets.slice(0, initialItemsCount);

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-[#FFF4E0] border-b-3 border-ink relative overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <SectionHeader
            number="07"
            tag="PHYSICAL ARTIFACT ARCHIVE"
            title="PRECISION IN MOTION"
            highlightWord="MOTION"
            subtitle="High-magnification macro views and real laboratory captures of our functional CoreXY and SLA stereolithography builds."
            badgeText="GENUINE PRINTS"
            badgeColor="#FF5A1F"
            className="mb-0"
          />

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-brutal bg-white text-xs py-2.5 px-5 self-start lg:self-auto shrink-0"
          >
            {isExpanded ? 'COLLAPSE ARCHIVE' : `EXPAND ARCHIVE (${galleryAssets.length} ARTIFACTS)`}
          </button>
        </div>

        {/* Gallery Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[200px] sm:auto-rows-[240px] lg:auto-rows-[280px] grid-flow-dense"
        >
          {visibleAssets.map((asset, index) => (
            <div
              key={`${index}-${asset.name}`}
              onClick={() => setSelectedAsset(asset)}
              className={`
                group relative overflow-hidden rounded-xs bg-white border-3 border-ink shadow-brutal hover:shadow-brutal-lg transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer
                ${asset.size === 'wide' ? 'col-span-2' : 'col-span-1'}
                ${asset.size === 'tall' ? 'row-span-2' : 'row-span-1'}
              `}
            >
              <div className="absolute inset-0 bg-[#FFF4E0]">
                {asset.type === 'video' ? (
                  <div className="relative w-full h-full">
                    <video
                      src={asset.url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-xs bg-[#FF5A1F] border-2 border-ink flex items-center justify-center text-[#0B0B0B] shadow-brutal-sm">
                        <Play className="w-5 h-5 fill-current ml-0.5 stroke-[2]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Tag Sticker */}
              <div className="absolute top-3 left-3 badge-sticker bg-[#FFE14D] text-[10px] z-10">
                {asset.tag}
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-[#FFF4E0] border-t-2 border-ink p-2 sm:p-3 flex items-center justify-between font-mono text-xs z-10">
                <span className="font-bold text-[#0B0B0B] truncate text-[11px]">
                  {asset.name}
                </span>
                <span className="w-6 h-6 rounded-xs bg-[#FF5A1F] border border-ink flex items-center justify-center text-[#0B0B0B] shrink-0 ml-2">
                  <Maximize2 className="w-3 h-3 stroke-[2.5]" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-[#FFF4E0] border-4 border-ink">
            {selectedAsset && (
              <div className="flex flex-col">
                <div className="relative max-h-[75vh] flex items-center justify-center bg-black">
                  {selectedAsset.type === 'video' ? (
                    <video
                      src={selectedAsset.url}
                      className="max-h-[75vh] w-auto mx-auto"
                      controls
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img
                      src={selectedAsset.url}
                      alt={selectedAsset.name}
                      className="max-h-[75vh] w-auto mx-auto object-contain"
                    />
                  )}
                </div>
                <div className="p-4 bg-white border-t-3 border-ink flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-black text-lg text-[#0B0B0B] uppercase">
                      {selectedAsset.name}
                    </h3>
                    <p className="font-mono text-xs text-[#555]">
                      TAG: {selectedAsset.tag} &bull; SATURN 3D METROLOGY ARCHIVE
                    </p>
                  </div>
                  <span className="badge-sticker bg-[#7CF2C1]">
                    AUTHENTIC PRINT
                  </span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </section>
  );
}
