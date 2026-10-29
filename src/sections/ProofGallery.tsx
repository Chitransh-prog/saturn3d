'use client';

import React, { useState, useRef } from 'react';
import { 
  Play, Volume2, VolumeX, ArrowUpRight, Maximize2, 
  X, CheckCircle2, ShieldCheck, Clock, Weight, Layers
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Testimonials from '@/sections/Testimonials';

interface RealPrintItem {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  category: string;
  material: string;
  layerHeight: string;
  tolerance: string;
  printTime: string;
  mass: string;
  application: string;
}

const realPrints: RealPrintItem[] = [
  {
    id: 'corexy-live',
    name: 'CoreXY High-Speed Printing Cell',
    type: 'video',
    url: '/gallery/WhatsApp Video 2026-04-17 at 13.58.12.mp4',
    category: 'High-Velocity FDM',
    material: 'PETG Industrial Black',
    layerHeight: '0.12 mm',
    tolerance: '±0.06 mm',
    printTime: '3h 45m',
    mass: '124 g',
    application: 'Automotive wiring junction box with snap latch',
  },
  {
    id: 'impeller-sla',
    name: 'Micro-Fluidic Turbine Impeller',
    type: 'image',
    url: '/showcase/sla-turbine-impeller.jpg',
    category: '12K SLA Resin',
    material: 'Precision Tough Photopolymer',
    layerHeight: '0.025 mm',
    tolerance: '±0.04 mm',
    printTime: '2h 15m',
    mass: '38 g',
    application: 'Aerospace centrifugal cooling rotor',
  },
  {
    id: 'drone-spar-cf',
    name: 'Continuous Carbon-X Motor Mount',
    type: 'image',
    url: '/showcase/carbon-drone-spar.jpg',
    category: 'Reinforced FFF',
    material: 'Carbon-X PA12-CF',
    layerHeight: '0.10 mm',
    tolerance: '±0.05 mm',
    printTime: '4h 12m',
    mass: '68 g',
    application: 'High-payload octocopter motor boom adapter',
  },
  {
    id: 'robot-effector',
    name: 'Dual-Durometer Articulated Gripper',
    type: 'image',
    url: '/showcase/robotic-gripper.jpg',
    category: 'Multi-Polymer FDM',
    material: 'PETG + TPU 95A Elastomer',
    layerHeight: '0.15 mm',
    tolerance: '±0.08 mm',
    printTime: '5h 30m',
    mass: '142 g',
    application: 'Pick-and-place robotic arm finger assembly',
  },
];

export default function ProofGallery() {
  const [selectedItem, setSelectedItem] = useState<RealPrintItem | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section
      id="proof"
      className="w-full bg-[#F5F6F8] text-[#0B0D10] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 overflow-hidden font-body border-t border-black/10"
      aria-label="Real Prints and Shop Telemetry"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10 scroll-reveal">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
              <span className="type-mono-eyebrow text-[#5B616B]">
                08 // Real Prints Showcase
              </span>
            </div>
            <h2 className="type-h2 text-[#0B0D10]">
              Verified shop telemetry on actual prints.
            </h2>
            <p className="type-body text-[#5B616B] mt-2">
              Every part inspected under CMM coordinate metrology. Review print times, layer definitions, and masses directly from the fabrication log.
            </p>
          </div>

          <div className="precision-badge text-xs shrink-0">
            Bhopal Production Log // 2026
          </div>
        </div>

        {/* Creality-Style Real Prints Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 scroll-stagger">
          {realPrints.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="card-precision overflow-hidden group cursor-pointer flex flex-col justify-between hover:border-[#FF5A1F]/30"
            >
              <div>
                {/* Media Container */}
                <div className="aspect-[4/3] w-full bg-neutral-900 relative overflow-hidden">
                  {item.type === 'video' ? (
                    <div className="w-full h-full relative">
                      <video
                        ref={videoRef}
                        src={item.url}
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                        muted={isVideoMuted}
                        loop
                        autoPlay
                        playsInline
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                      <div className="absolute bottom-2.5 right-2.5">
                        <span className="precision-badge bg-black/80 text-white text-[9px]">
                          LIVE COREXY
                        </span>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    />
                  )}

                  <div className="absolute top-2.5 left-2.5">
                    <span className="precision-badge bg-white/90 backdrop-blur-sm text-[10px]">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-[#0B0D10] group-hover:text-[#FF5A1F] transition-colors truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#5B616B] line-clamp-2 leading-relaxed">
                    {item.application}
                  </p>
                </div>
              </div>

              {/* Verified Telemetry Strip */}
              <div className="p-4 pt-3 border-t border-black/5 bg-neutral-50/50 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between text-[#5B616B]">
                  <span>Print Time:</span>
                  <span className="font-semibold text-[#0B0D10]">{item.printTime}</span>
                </div>
                <div className="flex justify-between text-[#5B616B]">
                  <span>Layer / Mass:</span>
                  <span className="font-semibold text-[#0B0D10]">{item.layerHeight} &bull; {item.mass}</span>
                </div>
                <div className="flex justify-between text-[#5B616B]">
                  <span>Tolerance:</span>
                  <span className="font-semibold text-[#FF5A1F]">{item.tolerance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client Testimonials Integration */}
        <div className="pt-10 border-t border-black/10">
          <Testimonials />
        </div>

      </div>

      {/* Inspection Lightbox Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent showCloseButton={false} className="max-w-3xl p-0 bg-white border border-black/10 rounded-2xl overflow-hidden shadow-precision-xl">
          {selectedItem && (
            <div>
              <div className="p-4 border-b border-black/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
                  <span className="font-mono text-xs font-semibold text-[#0B0D10]">
                    {selectedItem.name} // Metrology Telemetry
                  </span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-8 h-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-[#5B616B] hover:text-[#0B0D10] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="aspect-video w-full rounded-xl bg-neutral-900 overflow-hidden relative">
                  {selectedItem.type === 'video' ? (
                    <video src={selectedItem.url} controls autoPlay className="w-full h-full object-contain" />
                  ) : (
                    <img src={selectedItem.url} alt={selectedItem.name} className="w-full h-full object-contain" />
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs p-4 rounded-xl bg-neutral-50 border border-black/5">
                  <div>
                    <span className="text-[10px] text-[#5B616B] block">MATERIAL</span>
                    <span className="font-semibold text-[#0B0D10]">{selectedItem.material}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5B616B] block">PRINT DURATION</span>
                    <span className="font-semibold text-[#0B0D10]">{selectedItem.printTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5B616B] block">LAYER HEIGHT</span>
                    <span className="font-semibold text-[#0B0D10]">{selectedItem.layerHeight}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5B616B] block">TOLERANCE</span>
                    <span className="font-semibold text-[#FF5A1F]">{selectedItem.tolerance}</span>
                  </div>
                </div>

                <p className="text-xs text-[#5B616B] leading-relaxed">
                  {selectedItem.application}. Manufactured and calibrated at the Saturn 3D Govindpura Hub in Bhopal with express air transit across India.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
