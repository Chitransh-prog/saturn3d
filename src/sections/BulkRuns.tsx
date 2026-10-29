import React, { useState } from 'react';
import { MessageSquare, Calculator, ArrowRight, Layers, ShieldCheck, Check } from 'lucide-react';

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

  const currentType = partTypes.find((p) => p.id === selectedType) || partTypes[1];

  let discount = 0.15;
  if (quantity >= 500) discount = 0.38;
  else if (quantity >= 200) discount = 0.30;
  else if (quantity >= 100) discount = 0.22;

  const unitPrice = Math.round(currentType.basePrice * (1 - discount));
  const estimatedTotal = unitPrice * quantity;

  const whatsappNumber = '918889988874';
  const getWhatsAppMsg = () => {
    return `Hi Saturn 3D engineering, I would like to schedule a volume production run:
- Part Size Category: ${currentType.label}
- Batch Quantity: ${quantity} units
- Target Unit Price: ₹${unitPrice}
- Estimated Total: ₹${estimatedTotal.toLocaleString('en-IN')}
Please share production slot availability and dispatch schedule.`;
  };

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(getWhatsAppMsg())}`;

  return (
    <section
      id="bulk-runs"
      className="w-full bg-[#F5F6F8] text-[#0B0D10] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 overflow-hidden font-body border-t border-black/10"
      aria-label="Small-Batch Production Runs"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
              <span className="type-mono-eyebrow text-[#5B616B]">
                07 // Volume Production Runs
              </span>
            </div>
            <h2 className="type-h2 text-[#0B0D10]">
              Batch production without tooling costs.
            </h2>
            <p className="type-body text-[#5B616B] mt-2">
              From 50 to 5,000+ units. Scale directly from prototype to bridge production with automated volume tiering and CMM quality verification.
            </p>
          </div>

          <div className="precision-badge text-xs shrink-0">
            Zero Injection Mold Tooling
          </div>
        </div>

        {/* Precision Batch Calculator */}
        <div className="card-precision p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Input Selection (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-2">
              <label className="font-mono text-xs text-[#5B616B] uppercase tracking-wider block">
                1. Select Part Dimension Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {partTypes.map((pt) => {
                  const isSelected = selectedType === pt.id;
                  return (
                    <button
                      key={pt.id}
                      onClick={() => setSelectedType(pt.id)}
                      className={`p-3.5 text-left rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF5A1F] bg-[#FF5A1F]/5 text-[#0B0D10]'
                          : 'border-black/10 bg-neutral-50 text-[#5B616B] hover:border-black/20'
                      }`}
                    >
                      <span className="block font-semibold text-xs text-[#0B0D10] truncate">{pt.label}</span>
                      <span className="text-[11px] text-[#5B616B] block mt-1">{pt.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs text-[#0B0D10]">
                <span className="text-[#5B616B] uppercase">2. Batch Quantity</span>
                <span className="font-semibold text-[#FF5A1F]">{quantity} Units</span>
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
              <div className="flex justify-between font-mono text-[10px] text-[#5B616B]">
                <span>50 pcs (-15%)</span>
                <span>200 pcs (-30%)</span>
                <span>500+ pcs (-38% Volume Tier)</span>
              </div>
            </div>

          </div>

          {/* Right: Output & Action (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-neutral-50 border border-black/10 rounded-2xl flex flex-col justify-between space-y-6">
            
            <div className="space-y-3">
              <div className="flex justify-between font-mono text-xs text-[#5B616B]">
                <span>Discounted Unit Cost:</span>
                <span className="font-semibold text-[#0B0D10]">₹{unitPrice} / unit</span>
              </div>
              <div className="flex justify-between font-mono text-xs text-[#5B616B]">
                <span>Production Batch Size:</span>
                <span className="font-semibold text-[#0B0D10]">{quantity} pcs</span>
              </div>

              <div className="pt-3 border-t border-black/10">
                <span className="font-mono text-[11px] text-[#5B616B] block">
                  Estimated Batch Investment
                </span>
                <span className="font-display font-semibold text-3xl sm:text-4xl text-[#0B0D10] mt-1 block">
                  ₹{estimatedTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-precision w-full py-3.5 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discuss Batch Scheduling on WhatsApp</span>
            </a>

          </div>

        </div>
      </div>
    </section>
  );
}
