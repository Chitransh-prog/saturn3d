import React, { useRef, useState } from 'react';
import { Maximize2, Play } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import SectionHeader from '@/components/SectionHeader';

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
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-studio-light border-b hairline relative overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/[0.04] text-muted-dark border hairline rounded-full font-mono text-[11px] font-medium uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-saturn-orange" />
              <span>07 // Physical Artifact Archive</span>
            </div>
            <h2 className="font-display font-semibold text-2xl sm:text-4xl text-graphite tracking-tight">
              Precision in motion.
            </h2>
            <p className="font-body text-xs sm:text-sm text-muted mt-2 max-w-xl leading-relaxed">
              Macro views and high-magnification captures of real functional CoreXY and SLA stereolithography builds in our Bhopal lab.
            </p>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-precision-secondary text-xs font-mono font-medium uppercase tracking-wider py-2.5 px-5 self-start lg:self-auto shrink-0 cursor-pointer"
          >
            {isExpanded ? 'Collapse Archive' : `Expand Archive (${galleryAssets.length} Artifacts)`}
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
                group relative overflow-hidden rounded-2xl bg-white border hairline shadow-precision-sm hover:shadow-precision-md transition-all duration-200 hover:-translate-y-1 cursor-pointer
                ${asset.size === 'wide' ? 'col-span-2' : 'col-span-1'}
                ${asset.size === 'tall' ? 'row-span-2' : 'row-span-1'}
              `}
            >
              <div className="absolute inset-0 bg-studio-light">
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
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-saturn-orange text-white flex items-center justify-center shadow-precision-sm">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
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

              {/* Tag Pill */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white border border-white/20 font-mono text-[10px] font-medium px-2.5 py-0.5 rounded-full z-10">
                {asset.tag}
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4 flex items-center justify-between font-mono text-xs z-10 text-white">
                <span className="font-display font-medium text-white truncate text-xs">
                  {asset.name}
                </span>
                <span className="w-6 h-6 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center text-white shrink-0 ml-2">
                  <Maximize2 className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-surface-dark border hairline-dark rounded-2xl text-studio-light">
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
                <div className="p-4 bg-surface-dark border-t hairline-dark flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-base text-white">
                      {selectedAsset.name}
                    </h3>
                    <p className="font-mono text-xs text-muted-dark">
                      Tag: {selectedAsset.tag} &bull; Saturn 3D Metrology Archive
                    </p>
                  </div>
                  <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Authentic Print
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
