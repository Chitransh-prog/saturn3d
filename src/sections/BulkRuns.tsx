import React, { useState, useEffect } from 'react';
import { MessageSquare, Calculator, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PartType {
  id: string;
  label: string;
  description: string;
  basePrice: number;
}

const partTypes: PartType[] = [
  { id: 'small', label: 'Small Precision (< 50mm)', description: 'Micro-gears, clips, sensor fittings', basePrice: 95 },
  { id: 'medium', label: 'Medium Enclosure (50–150mm)', description: 'PCB housings, custom brackets, ducts', basePrice: 280 },
  { id: 'large', label: 'Large Structural (> 150mm)', description: 'Chassis shells, drone frames, fixtures', basePrice: 780 },
];

export default function BulkRuns() {
  const [selectedType, setSelectedType] = useState<string>('medium');
  const [quantity, setQuantity] = useState<number>(100);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.bulk-calc-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#bulk-runs',
            start: 'top 75%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const currentType = partTypes.find((p) => p.id === selectedType) || partTypes[1];

  // Volume discount logic
  let discount = 0.15;
  if (quantity >= 500) discount = 0.38;
  else if (quantity >= 200) discount = 0.30;
  else if (quantity >= 100) discount = 0.22;

  const unitPrice = Math.round(currentType.basePrice * (1 - discount));
  const estimatedTotal = unitPrice * quantity;

  // WhatsApp prefilled message
  const whatsappNumber = '917999824632';
  const getWhatsAppMsg = () => {
    return `Hi Saturn 3D team, I would like to order a volume production run:
- Part Size: ${currentType.label}
- Batch Quantity: ${quantity} units
- Estimated Unit Price: ₹${unitPrice}
- Estimated Total: ₹${estimatedTotal.toLocaleString('en-IN')}
Please share production scheduling and lead time.`;
  };

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(getWhatsAppMsg())}`;

  return (
    <section
      id="bulk-runs"
      data-bg="#FAF7F2"
      data-fg="#0B0B0B"
      className="relative w-full bg-[#FAF7F2] text-[#0B0B0B] section-padding px-6 sm:px-10 lg:px-16 overflow-hidden hairline-t"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div data-aos="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="type-mono-eyebrow text-[#0B0B0B]/70">
                07 // BATCH RUNS & ENTERPRISE
              </span>
              <span className="sticker-minimal">
                VOLUME ESTIMATOR
              </span>
            </div>

            <div className="line-reveal-mask">
              <h2 className="type-h2 text-[#0B0B0B]">
                BULK RUNS &
              </h2>
            </div>
            <div className="line-reveal-mask">
              <h2 className="type-h2 text-[#FF5A1F]">
                PRODUCTION.
              </h2>
            </div>
          </div>

          <p className="type-body text-[#0B0B0B]/75 max-w-md font-semibold">
            Need 50 to 5,000+ units? Calculate volume discounts in real time and connect
            directly with our factory scheduling desk.
          </p>
        </div>

        {/* Tiny Minimalist Calculator (Open 2 Columns) */}
        <div data-aos="fade-up" data-aos-delay="100" className="bulk-calc-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-5 sm:p-10 hairline-ink rounded-xs shadow-brutal-sm">
          
          {/* Left: Input Selection (LG: 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Part Size Selection */}
            <div className="space-y-2">
              <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#0B0B0B] block">
                1. SELECT PART DIMENSION
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {partTypes.map((pt) => {
                  const isSelected = selectedType === pt.id;
                  return (
                    <button
                      key={pt.id}
                      onClick={() => setSelectedType(pt.id)}
                      className={`p-3 text-left font-mono text-xs transition-all cursor-pointer rounded-xs ${
                        isSelected
                          ? 'bg-[#0B0B0B] text-[#FFE14D] font-bold border border-ink'
                          : 'bg-[#FAF7F2] text-[#0B0B0B] hairline hover:bg-neutral-100'
                      }`}
                    >
                      <span className="block font-bold truncate">{pt.label}</span>
                      <span className="text-[10px] opacity-70 block mt-1">{pt.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs font-bold text-[#0B0B0B]">
                <span className="uppercase">2. BATCH QUANTITY</span>
                <span className="text-[#FF5A1F] text-base">{quantity} UNITS</span>
              </div>
              <input
                type="range"
                min="50"
                max="2500"
                step="50"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-[#FF5A1F] cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-[#0B0B0B]/60">
                <span>50 pcs (-15%)</span>
                <span>200 pcs (-30%)</span>
                <span>500+ pcs (-38% Industrial)</span>
              </div>
            </div>

          </div>

          {/* Right: Live Output & WhatsApp Button (LG: 5 cols) */}
          <div className="lg:col-span-5 p-6 bg-[#FAF7F2] hairline-ink flex flex-col justify-between space-y-6 rounded-xs">
            
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs text-[#0B0B0B]/70 font-bold">
                <span>UNIT COST:</span>
                <span className="text-[#FF5A1F]">₹{unitPrice} / pc (incl. discount)</span>
              </div>

              <div className="pt-2">
                <span className="font-mono text-[11px] text-[#0B0B0B]/60 block font-bold">
                  ESTIMATED BATCH INVESTMENT
                </span>
                <span className="font-display font-black text-3xl sm:text-4xl text-[#0B0B0B]">
                  ₹{estimatedTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brutal btn-whatsapp-brutal w-full py-3.5 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#0B0B0B]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>DISCUSS BATCH ON WHATSAPP</span>
            </a>

          </div>

        </div>
      </div>
    </section>
  );
}
