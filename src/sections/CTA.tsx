import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import BulkOrderForm from './BulkOrderForm';

const Architect3D = dynamic(() => import('@/components/Architect3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-44 rounded-xl bg-black/10 border border-black/10 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-ink border-t-white animate-spin" />
    </div>
  ),
});

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isBulkFormOpen, setIsBulkFormOpen] = useState(false);

  return (
    <>
      <BulkOrderForm isOpen={isBulkFormOpen} onClose={() => setIsBulkFormOpen(false)} />

      <section
        ref={sectionRef}
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-[#FFF4E0] border-b-3 border-ink relative overflow-hidden blueprint-grid"
      >
        <div
          ref={cardRef}
          data-aos="fade-up"
          className="max-w-7xl mx-auto card-slab bg-[#FF5A1F] text-[#0B0B0B] p-8 sm:p-14 lg:p-16 border-2 sm:border-3 border-ink shadow-brutal relative overflow-hidden"
        >
          {/* Top Telemetry */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b-2 border-ink">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#0B0B0B] border border-white inline-block animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0B0B0B]">
                10 // RAPID SCALE PROTOCOL
              </span>
            </div>

            <div className="badge-sticker bg-[#FFE14D] text-xs">
              CAPACITY: 500+ UNITS / 48H
            </div>
          </div>

          {/* Headline & 3D Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
            <div className="lg:col-span-8 space-y-4">
              <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-[#0B0B0B] leading-none">
                READY TO INITIALIZE? <br />
                <span className="bg-[#0B0B0B] text-white px-2 inline-block transform -rotate-1 mt-1">
                  PRINT THE IMPOSSIBLE
                </span>
              </h2>

              <p className="font-body text-base sm:text-lg text-[#0B0B0B] font-bold max-w-xl leading-relaxed pt-2">
                Stop waiting weeks for CNC tooling. Upload your geometry to deploy production-grade additive hardware now.
              </p>
            </div>

            <div 
              data-aos="zoom-in" 
              data-aos-delay="150"
              className="lg:col-span-4 h-64 sm:h-72 w-full flex items-center justify-center bg-white border-2 border-ink shadow-brutal-sm rounded-xs p-2 relative"
            >
              <Architect3D />
              <div className="absolute bottom-2 right-2 badge-sticker bg-[#FFE14D] text-[9px] py-0.5 px-1.5">
                INTERACTIVE 3D
              </div>
            </div>
          </div>

          {/* Action Slabs */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 pt-6 border-t-3 border-ink">
            <button
              onClick={() => navigate('/custom-lab')}
              className="btn-brutal btn-brutal-ink py-4 px-8 text-xs sm:text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>LAUNCH INSTANT CAD LAB</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={() => setIsBulkFormOpen(true)}
              className="btn-brutal btn-brutal-lemon py-4 px-8 text-xs sm:text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>INDUSTRIAL BULK ORDER</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </button>

            <a
              href="https://wa.me/917999824632"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brutal bg-[#25D366] text-white py-4 px-6 text-xs sm:text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <MessageSquare className="w-4 h-4 stroke-[2.5]" />
              <span>WHATSAPP HOTLINE</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
