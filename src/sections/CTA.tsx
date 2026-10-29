import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import BulkOrderForm from './BulkOrderForm';

export default function CTA() {
  const navigate = useNavigate();
  const [isBulkFormOpen, setIsBulkFormOpen] = useState(false);

  return (
    <>
      <BulkOrderForm isOpen={isBulkFormOpen} onClose={() => setIsBulkFormOpen(false)} />

      <section className="py-20 sm:py-24 px-6 sm:px-10 lg:px-16 bg-[#F5F6F8] font-body border-t border-black/10">
        <div className="max-w-7xl mx-auto card-precision-dark p-8 sm:p-14 lg:p-16 relative overflow-hidden">
          {/* Subtle Orange Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5A1F]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Telemetry */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
              <span className="type-mono-eyebrow text-white/60">
                10 // Rapid Scale Protocol
              </span>
            </div>

            <div className="precision-badge text-xs">
              Capacity: 500+ Units // 24-48h
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-3xl space-y-4 mb-8">
            <h2 className="type-h2 text-white">
              Ready to fabricate your next breakthrough?
            </h2>
            <p className="type-body text-[#A3A9B3] text-sm sm:text-base leading-relaxed">
              Upload your CAD models for instant volumetric telemetry and automated quoting. For large-format runs, custom polymer compounding, or enterprise scheduling, connect directly with our engineering team in Bhopal.
            </p>
          </div>

          {/* Action Row */}
          <div className="relative z-10 flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/custom-lab')}
              className="btn-precision-primary text-xs sm:text-sm py-3 px-6"
            >
              <span>Launch Custom Lab</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://wa.me/918889988874?text=Hi%20Saturn%203D%20team%2C%20I%20would%20like%20to%20discuss%20a%20custom%20fabrication%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-precision text-xs sm:text-sm py-3 px-5 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp Line</span>
            </a>

            <button
              onClick={() => setIsBulkFormOpen(true)}
              className="btn-precision-secondary text-xs sm:text-sm py-3 px-5 text-white/90 hover:text-white"
            >
              Enterprise RFP Form
            </button>
          </div>

          {/* Footer specs */}
          <div className="relative z-10 mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#A3A9B3]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF5A1F]" />
              <span>±0.04 mm Metrology Verification Guarantee</span>
            </div>
            <div>
              <span>Govindpura Industrial Hub, Bhopal &bull; All-India Express Courier</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
