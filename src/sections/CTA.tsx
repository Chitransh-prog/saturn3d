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

      <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#F8F9FA] border-t border-black/10 font-sans">
        <div data-aos="fade-up" className="max-w-7xl mx-auto rounded-3xl bg-white text-neutral-900 p-5 sm:p-10 lg:p-14 relative overflow-hidden border border-neutral-200/90 shadow-lg">
          
          {/* Subtle Ambient Accent */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#412f91]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Telemetry Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-neutral-200 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700">
              <span className="w-1.5 h-1.5 rounded-full bg-[#412f91] animate-pulse" />
              <span>Production Dispatch Desk</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-500">
              <span className="text-emerald-600 font-semibold">&bull; Active Farm:</span>
              <span>12K SLA &amp; Voron CoreXY</span>
            </div>
          </div>

          {/* Core Content */}
          <div className="relative z-10 max-w-2xl space-y-3 mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 leading-tight">
              Ready to fabricate your next production run?
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Upload your CAD models for instant volumetric slicing, or contact our engineering desk for custom enterprise batches and express 24&ndash;48h dispatch across Central India.
            </p>
          </div>

          {/* Actions Row */}
          <div data-aos="fade-up" data-aos-delay="100" className="relative z-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <Link
              href="/custom-lab"
              className="px-5 py-3 rounded-lg bg-[#412f91] hover:bg-[#342575] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upload CAD for Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://wa.me/918889988874?text=Hi%20Saturn%203D%20team%2C%20I%20would%20like%20to%20discuss%20a%20custom%20fabrication%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-lg bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Direct WhatsApp Desk</span>
            </a>

            <button
              type="button"
              onClick={() => setIsBulkFormOpen(true)}
              className="px-4 py-3 rounded-lg bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
            >
              <FileText className="w-4 h-4 text-neutral-500" />
              <span>Enterprise Batch RFP</span>
            </button>
          </div>

          {/* Metrology & Location Guarantee */}
          <div className="relative z-10 mt-10 pt-6 border-t border-black/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#5E6573]">
            <div className="flex items-center gap-2 text-[#111215] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#412f91]" />
              <span>&plusmn;0.04 mm Optical Metrology Inspection Certificate Available</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Govindpura (Bhopal) &bull; Indore Express Corridor (Pithampur) &bull; 24–48h Nationwide</span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
