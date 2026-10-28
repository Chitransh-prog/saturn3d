import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Check, MessageSquare, ArrowRight, FileCheck, Layers } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

interface Tier {
  range: string;
  discount: number;
  label: string;
}

const tiers: Tier[] = [
  { range: '1 – 9 pcs', discount: 0, label: 'Single / Prototype' },
  { range: '10 – 49 pcs', discount: 0.12, label: 'Pilot Batch (-12%)' },
  { range: '50 – 199 pcs', discount: 0.25, label: 'Production Run (-25%)' },
  { range: '200+ pcs', discount: 0.35, label: 'Industrial Tier (-35%)' },
];

const materialRates: Record<string, { basePerGram: number; density: number; label: string }> = {
  pla: { basePerGram: 3.5, density: 1.24, label: 'PLA Matte Pro' },
  petg: { basePerGram: 5.0, density: 1.27, label: 'PETG Industrial' },
  abs: { basePerGram: 8.0, density: 1.08, label: 'ABS-ESD Flame Retardant' },
  carbon: { basePerGram: 25.0, density: 1.14, label: 'Carbon-X PA12' },
  sla: { basePerGram: 14.0, density: 1.18, label: '12K SLA Tough Resin' },
};

export default function MakeItYours() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [material, setMaterial] = useState<string>('pla');
  const [quantity, setQuantity] = useState<number>(1);
  const [infill, setInfill] = useState<number>(20);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const ghostTextRef = useRef<HTMLDivElement>(null);

  // Ghost 3D parallax on tint band
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Panel stagger entrance on scroll
      gsap.fromTo(
        '.configurator-panel',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );

      if (ghostTextRef.current) {
        gsap.to(ghostTextRef.current, {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      toast.success(`Loaded CAD Model: ${file.name}`, {
        description: `${(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for quote calculation`,
      });
    }
  };

  // Pricing calculation in Indian Rupees (₹)
  const currentMaterialConfig = materialRates[material] || materialRates.pla;
  const estimatedGrams = Math.round(45 * (infill / 20)); // baseline sample part = 45g at 20% infill
  const baseUnitPrice = Math.round(estimatedGrams * currentMaterialConfig.basePerGram + 120); // unit price including machine time

  // Find active discount tier
  const activeTier = tiers.find((t, i) => {
    if (i === 0 && quantity < 10) return true;
    if (i === 1 && quantity >= 10 && quantity < 50) return true;
    if (i === 2 && quantity >= 50 && quantity < 200) return true;
    if (i === 3 && quantity >= 200) return true;
    return false;
  }) || tiers[0];

  const discountedUnitPrice = Math.round(baseUnitPrice * (1 - activeTier.discount));
  const totalEstimate = discountedUnitPrice * quantity;

  // WhatsApp prefilled message
  const whatsappNumber = '917999824632';
  const getWhatsAppMessage = () => {
    const fileName = selectedFile ? selectedFile.name : 'Custom CAD Component';
    return `Hi Saturn 3D team, I would like to request an instant quote:
- File: ${fileName}
- Material: ${currentMaterialConfig.label}
- Infill: ${infill}%
- Quantity: ${quantity} units
- Estimated Total: ₹${totalEstimate.toLocaleString('en-IN')}
Can an engineer review my tolerances and dispatch timeline?`;
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(getWhatsAppMessage())}`;

  return (
    <section
      id="configurator"
      ref={sectionRef}
      data-bg="#FFE14D"
      data-fg="#0B0B0B"
      className="relative w-full bg-[#FFE14D] text-[#0B0B0B] py-14 sm:py-24 px-4 sm:px-10 lg:px-16 overflow-hidden"
    >
      {/* Ghost "3D" parallax backdrop typography */}
      <div ref={ghostTextRef} className="ghost-3d-text" aria-hidden="true">
        3D
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div data-aos="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="type-mono-eyebrow text-[#0B0B0B]/70">
                04 // INSTANT QUOTE CONFIGURATOR
              </span>
              <span className="sticker-minimal bg-[#FF5A1F] text-white">
                LIVE CALCULATION
              </span>
            </div>

            <div className="line-reveal-mask">
              <h2 className="type-h2 text-[#0B0B0B]">
                MAKE IT
              </h2>
            </div>
            <div className="line-reveal-mask">
              <h2 className="type-h2 text-[#FF5A1F]">
                YOURS.
              </h2>
            </div>
          </div>

          <p className="type-body text-[#0B0B0B]/80 max-w-md font-semibold">
            Upload your CAD file (.STL, .OBJ, .GLB, .STEP) or reference blueprint (.PNG, .JPG), choose high-precision polymer parameters,
            and inspect tiered volume pricing with instant WhatsApp verification.
          </p>
        </div>

        {/* Configurator Grid: 2 Open Columns (Box Budget: Only 2 functional containers) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Dropzone + Parameter Sliders (LG: 6 cols) */}
          <div data-aos="fade-up" data-aos-delay="100" className="configurator-panel lg:col-span-6 space-y-6">
            
            {/* STL / OBJ / GLB / Image Dropzone (Container 1) */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer p-4 sm:p-8 border-2 border-dashed border-[#0B0B0B] w-full max-w-full overflow-hidden hover:border-[#FF5A1F] transition-all bg-white/40 hover:bg-white/70 flex flex-col items-center justify-center text-center rounded-xs"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".stl,.obj,.glb,.gltf,.3mf,.step,.stp,.jpg,.jpeg,.png,.webp,.svg,.bmp,image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-14 h-14 mb-4 flex items-center justify-center bg-[#0B0B0B] text-[#FFE14D] rounded-xs group-hover:bg-[#FF5A1F] group-hover:text-black transition-colors">
                {selectedFile ? (
                  <FileCheck className="w-7 h-7" />
                ) : (
                  <UploadCloud className="w-7 h-7" />
                )}
              </div>

              {selectedFile ? (
                <div className="space-y-1">
                  <span className="font-mono text-sm font-bold text-[#0B0B0B] block truncate max-w-xs sm:max-w-md">
                    {selectedFile.name}
                  </span>
                  <span className="font-mono text-xs text-[#0B0B0B]/60 block">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Click to swap CAD or Image file
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="font-display text-sm sm:text-base font-bold uppercase tracking-tight text-[#0B0B0B] block break-words max-w-full px-1">
                    DROP YOUR CAD BLUEPRINT OR IMAGE HERE
                  </span>
                  <span className="font-mono text-xs text-[#0B0B0B]/60 block">
                    .STL, .OBJ, .GLB, .STEP, .PNG, .JPG up to 150 MB &bull; Instant Slicing Analysis
                  </span>
                </div>
              )}
            </div>

            {/* Material Selection Tabs */}
            <div className="space-y-2">
              <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#0B0B0B] block">
                1. SELECT MATERIAL
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(materialRates).map(([key, item]) => {
                  const isSelected = material === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setMaterial(key)}
                      className={`text-left p-2.5 font-mono text-xs font-bold transition-all hairline cursor-pointer rounded-xs ${
                        isSelected
                          ? 'bg-[#0B0B0B] text-[#FFE14D] border-ink'
                          : 'bg-white/60 text-[#0B0B0B] hover:bg-white'
                      }`}
                    >
                      <span className="block truncate text-[11px] sm:text-xs leading-tight">{item.label}</span>
                      <span className="text-[10px] opacity-70">₹{item.basePerGram}/g</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Infill Density Slider */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs font-bold text-[#0B0B0B]">
                <span className="uppercase">2. STRUCTURAL INFILL</span>
                <span className="text-[#FF5A1F]">{infill}% GYROID</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={infill}
                onChange={(e) => setInfill(Number(e.target.value))}
                className="w-full accent-[#FF5A1F] cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-[#0B0B0B]/60">
                <span>10% (Lightweight Prototype)</span>
                <span>50% (Rigid Tooling)</span>
                <span>100% (Solid Structural)</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#0B0B0B] block">
                3. PRODUCTION QUANTITY
              </label>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-white border border-ink font-mono font-bold text-lg hover:bg-[#FF5A1F] transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 h-10 text-center font-mono font-black text-lg bg-white border border-ink outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-white border border-ink font-mono font-bold text-lg hover:bg-[#FF5A1F] transition-colors"
                >
                  +
                </button>
                <div className="flex gap-1.5 font-mono text-xs">
                  {[5, 25, 100].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setQuantity(preset)}
                      className="px-2 py-1 bg-white/70 hover:bg-white hairline font-bold text-[11px]"
                    >
                      {preset} pcs
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Tiered Price Table & CTAs (LG: 6 cols, Container 2) */}
          <div data-aos="fade-up" data-aos-delay="150" className="configurator-panel lg:col-span-6 bg-white p-5 sm:p-8 hairline-ink space-y-6 rounded-xs">
            
            <div className="flex items-center justify-between hairline-b pb-4">
              <span className="font-mono text-xs font-bold text-[#0B0B0B]/70 uppercase">
                ESTIMATED UNIT & BATCH RATE
              </span>
              <span className="font-mono text-xs font-bold text-[#FF5A1F] uppercase">
                ACTIVE TIER: {activeTier.label}
              </span>
            </div>

            {/* Tiered Price Table */}
            <div className="space-y-2 font-mono text-xs">
              {tiers.map((t) => {
                const isCurrent = t === activeTier;
                const unitCost = Math.round(baseUnitPrice * (1 - t.discount));
                return (
                  <div
                    key={t.range}
                    className={`flex items-center justify-between p-2.5 transition-colors ${
                      isCurrent
                        ? 'bg-[#FFE14D] font-black border border-ink'
                        : 'text-[#0B0B0B]/70'
                    }`}
                  >
                    <span>{t.range}</span>
                    <span>{t.label}</span>
                    <span className="font-bold">₹{unitCost} / pc</span>
                  </div>
                );
              })}
            </div>

            {/* Live Total Display */}
            <div className="p-4 bg-[#FAF7F2] hairline-ink flex items-end justify-between">
              <div>
                <span className="font-mono text-xs text-[#0B0B0B]/60 block font-bold">
                  TOTAL ESTIMATE ({quantity} {quantity === 1 ? 'UNIT' : 'UNITS'})
                </span>
                <span className="font-display font-black text-3xl sm:text-4xl text-[#0B0B0B]">
                  ₹{totalEstimate.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#0B0B0B]/70 text-right">
                INCL. SLICING AUDIT<br />EXCL. GST & SHIPPING
              </span>
            </div>

            {/* Dual CTAs: Request Quote + WhatsApp with prefilled message */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brutal btn-whatsapp-brutal flex-1 text-xs sm:text-sm py-3.5 px-4 flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#0B0B0B]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>QUOTE ON WHATSAPP</span>
              </a>

              <button
                onClick={() => {
                  toast.success('Instant CAD Specification Dispatched!', {
                    description: `Connecting engineering desk for ${quantity} unit(s).`,
                  });
                }}
                className="btn-brutal btn-brutal-orange flex-1 text-xs sm:text-sm py-3.5 px-4 flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#0B0B0B]"
              >
                <span>REQUEST QUOTE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="font-mono text-[11px] text-[#0B0B0B]/60 text-center">
              Confidential CAD handling &bull; NDA protected &bull; Same-day engineering reply
            </p>

          </div>

        </div>
      </div>
    </section>
  );
}
