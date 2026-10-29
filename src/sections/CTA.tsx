'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageSquare, ShieldCheck, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import BulkOrderForm from './BulkOrderForm';

export default function CTA() {
  const [isBulkFormOpen, setIsBulkFormOpen] = useState(false);

  return (
    <>
      <BulkOrderForm isOpen={isBulkFormOpen} onClose={() => setIsBulkFormOpen(false)} />

      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F6F7F9] border-t border-black/10 font-sans">
        <div className="max-w-7xl mx-auto rounded-3xl bg-[#0B0D10] text-[#F5F6F8] p-8 sm:p-14 lg:p-16 relative overflow-hidden border border-white/10 shadow-2xl">
          
          {/* Subtle Orange Radial Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF5A1F]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Telemetry Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A1F] font-bold">
                10 // Rapid Additive Protocol
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-white/70 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <span className="text-emerald-400 font-bold">● Active Farm:</span>
              <span>12K SLA &amp; Voron High-Speed CoreXY</span>
            </div>
          </div>

          {/* Core Content */}
          <div className="relative z-10 max-w-3xl space-y-4 mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to fabricate your next breakthrough?
            </h2>
            <p className="text-sm sm:text-base text-[#8E95A2] leading-relaxed max-w-2xl">
              Upload your proprietary CAD models for instant volumetric telemetry and automated slicing. 
              For large-format production runs, custom polymer formulations, or scheduled enterprise batches, connect directly with our engineering lab in Bhopal.
            </p>
          </div>

          {/* Actions Row */}
          <div className="relative z-10 flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href="/custom-lab"
              className="px-6 py-3.5 rounded-xl bg-[#FF5A1F] hover:bg-[#E04F1A] text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#FF5A1F]/25 active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Custom CAD Lab</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://wa.me/918889988874?text=Hi%20Saturn%203D%20team%2C%20I%20would%20like%20to%20discuss%20a%20custom%20fabrication%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-98"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp Line</span>
            </a>

            <button
              type="button"
              onClick={() => setIsBulkFormOpen(true)}
              className="px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border border-white/15 font-mono text-xs font-medium flex items-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <FileText className="w-4 h-4 text-[#8E95A2]" />
              <span>Enterprise Batch RFP</span>
            </button>
          </div>

          {/* Metrology & Location Guarantee */}
          <div className="relative z-10 mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#8E95A2]">
            <div className="flex items-center gap-2 text-white/80">
              <ShieldCheck className="w-4 h-4 text-[#FF5A1F]" />
              <span>&plusmn;0.04 mm Optical Metrology Inspection Certificate Available</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Govindpura Industrial Hub, Bhopal &bull; Express Air Delivery Across India</span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
