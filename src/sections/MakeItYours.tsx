'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Check, MessageSquare, ArrowRight, FileCheck, Layers, Cpu, ShieldCheck, Sliders, Info } from 'lucide-react';
import { toast } from 'sonner';

interface Tier {
  range: string;
  discount: number;
  label: string;
}

const tiers: Tier[] = [
  { range: '1 – 9 pcs', discount: 0, label: 'Single Prototyping' },
  { range: '10 – 49 pcs', discount: 0.12, label: 'Pilot Batch (-12%)' },
  { range: '50 – 199 pcs', discount: 0.22, label: 'Production Run (-22%)' },
  { range: '200+ pcs', discount: 0.32, label: 'Volume Tier (-32%)' },
];

const materialsConfig: Record<string, { basePerGram: number; process: string; label: string; tolerance: string }> = {
  pla: { basePerGram: 4.5, process: 'Industrial FDM', label: 'PLA Pro Matte', tolerance: '±0.10 mm' },
  petg: { basePerGram: 6.0, process: 'Industrial FDM', label: 'PETG Industrial', tolerance: '±0.08 mm' },
  abs: { basePerGram: 8.5, process: 'Industrial FDM', label: 'ABS High-Impact', tolerance: '±0.06 mm' },
  carbon: { basePerGram: 26.0, process: 'Reinforced FFF', label: 'Carbon-X PA12-CF', tolerance: '±0.04 mm' },
  sla: { basePerGram: 14.0, process: '12K SLA Resin', label: 'Precision Tough SLA Resin', tolerance: '±0.04 mm' },
};

export default function MakeItYours() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [material, setMaterial] = useState<string>('carbon');
  const [quantity, setQuantity] = useState<number>(1);
  const [infill, setInfill] = useState<number>(30);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setSelectedFile(file);
    toast.success(`Loaded CAD File: ${file.name}`, {
      description: `${(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for automated volumetric analysis`,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const currentMat = materialsConfig[material] || materialsConfig.carbon;
  const estimatedGrams = Math.round(52 * (infill / 30));
  const baseUnitPrice = Math.round(estimatedGrams * currentMat.basePerGram + 150);

  const activeTier = tiers.find((t, i) => {
    if (i === 0 && quantity < 10) return true;
    if (i === 1 && quantity >= 10 && quantity < 50) return true;
    if (i === 2 && quantity >= 50 && quantity < 200) return true;
    if (i === 3 && quantity >= 200) return true;
    return false;
  }) || tiers[0];

  const discountedUnitPrice = Math.round(baseUnitPrice * (1 - activeTier.discount));
  const totalEstimate = discountedUnitPrice * quantity;

  const whatsappNumber = '918889988874';
  const getWhatsAppMessage = () => {
    const fileName = selectedFile ? selectedFile.name : 'Custom 3D CAD Component';
    return `Hi Saturn 3D engineering, I would like an official fabrication quotation:
- CAD File: ${fileName}
- Material: ${currentMat.label} (${currentMat.process})
- Infill Density: ${infill}%
- Quantity: ${quantity} units
- Target Tolerance: ${currentMat.tolerance}
- Estimated Total: ₹${totalEstimate.toLocaleString('en-IN')}
Can an engineer review my file geometry for additive fabrication?`;
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(getWhatsAppMessage())}`;

  return (
    <section
      id="configurator"
      className="w-full bg-white text-[#111215] py-20 sm:py-28 px-4 sm:px-8 lg:px-16 relative overflow-hidden font-body border-t border-black/10"
      aria-label="Instant CAD Quote Configurator"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div data-aos="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200 scroll-reveal">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700 mb-3 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#412f91]" />
              <span>Instant Pricing Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 font-sans">
              Instant quote configurator.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-2">
              Upload your CAD geometry (.STL, .STEP, .OBJ, .GLB), select polymer grades, and calculate live volume pricing.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 font-mono text-xs text-neutral-600 shrink-0">
            <span>Automated Slicing v3.0</span>
          </div>
        </div>

        {/* 2-Column Precision Intake Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-reveal">
          
          {/* Left Column: Dropzone + Sliders */}
          <div data-aos="fade-up" data-aos-delay="100" className="lg:col-span-7 space-y-6">
            
            {/* 1px Hairline CAD Dropzone with Accessible Drag & Drop */}
            <div
              tabIndex={0}
              role="button"
              aria-label="Upload CAD model file"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`group cursor-pointer p-8 sm:p-10 border-2 rounded-2xl transition-all flex flex-col items-center justify-center text-center relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#412f91] ${
                isDragging
                  ? 'border-[#412f91] bg-[#412f91]/10 ring-4 ring-[#412f91]/20 scale-[1.01]'
                  : 'border-dashed border-black/20 hover:border-[#412f91] bg-[#F8F9FA] hover:bg-white shadow-2xs'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".stl,.obj,.glb,.gltf,.3mf,.step,.stp,.jpg,.jpeg,.png,.webp,.svg,.bmp"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className={`w-12 h-12 mb-3 rounded-xl border flex items-center justify-center transition-all shadow-2xs ${
                isDragging
                  ? 'bg-[#412f91] text-white border-[#412f91]'
                  : 'bg-white border-black/10 text-[#5E6573] group-hover:text-[#412f91] group-hover:border-[#412f91]/40'
              }`}>
                {selectedFile ? <FileCheck className="w-6 h-6 text-[#412f91]" /> : <UploadCloud className="w-6 h-6" />}
              </div>

              {selectedFile ? (
                <div>
                  <div className="font-semibold text-sm text-[#111215] truncate max-w-sm">
                    {selectedFile.name}
                  </div>
                  <div className="font-mono text-xs text-[#5E6573] mt-0.5">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Click or drop another file to swap
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm font-semibold text-[#111215] group-hover:text-[#412f91] transition-colors">
                    {isDragging ? 'Release to upload CAD geometry' : 'Drop your CAD model or technical drawing here'}
                  </div>
                  <div className="font-mono text-xs text-[#5E6573] mt-1">
                    .STL, .STEP, .OBJ, .GLB up to 100 MB &bull; Instant Slicing Ready
                  </div>
                </div>
              )}
            </div>

            {/* Material Selection Pills */}
            <div className="space-y-3">
              <label className="font-mono text-xs text-[#5E6573] uppercase tracking-wider font-semibold block">
                Engineering Polymer Selection
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.entries(materialsConfig).map(([key, config]) => {
                  const isSelected = material === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setMaterial(key)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#412f91] bg-[#412f91]/10 text-[#111215] shadow-xs'
                          : 'border-black/10 bg-[#F8F9FA] hover:bg-white text-[#5E6573] hover:text-[#111215] hover:border-black/20'
                      }`}
                    >
                      <div className="font-semibold text-xs text-[#111215] truncate">
                        {config.label}
                      </div>
                      <div className="font-mono text-[11px] text-[#5E6573] mt-0.5">
                        ₹{config.basePerGram}/g &bull; {config.tolerance}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Infill Density Slider */}
            <div className="card-precision p-5 space-y-3 bg-[#F8F9FA] border border-black/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#5E6573] uppercase tracking-wider font-semibold">
                  Internal Infill Density
                </span>
                <span className="font-mono font-bold text-[#412f91]">
                  {infill}% Gyroid Infill
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={infill}
                onChange={(e) => setInfill(Number(e.target.value))}
                className="w-full accent-[#412f91] cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-[#8A91A0]">
                <span>10% Light Mockup</span>
                <span>30% Standard Functional</span>
                <span>100% Solid Solidified</span>
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="card-precision p-5 flex items-center justify-between bg-[#F8F9FA] border border-black/10">
              <div>
                <span className="font-mono text-xs text-[#5E6573] uppercase tracking-wider font-semibold block">
                  Batch Quantity
                </span>
                <span className="text-xs text-[#5E6573]">
                  {activeTier.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg border border-black/15 hover:border-black/30 bg-white text-[#111215] flex items-center justify-center text-sm cursor-pointer shadow-2xs"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 h-8 text-center bg-white border border-black/15 rounded-lg text-[#111215] font-mono text-xs font-semibold"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-black/15 hover:border-black/30 bg-white text-[#111215] flex items-center justify-center text-sm cursor-pointer shadow-2xs"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Live Quotation Summary Card */}
          <div data-aos="fade-up" data-aos-delay="200" className="lg:col-span-5 card-precision p-6 sm:p-8 space-y-6 bg-white border border-black/10 shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-black/10">
              <h3 className="text-base font-bold text-[#111215]">
                Quotation Telemetry
              </h3>
              <span className="precision-badge text-[10px] bg-white border-black/10 text-[#5E6573]">
                ESTIMATE
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between text-[#5E6573]">
                <span>Selected Polymer:</span>
                <span className="text-[#111215] font-semibold">{currentMat.label}</span>
              </div>
              <div className="flex justify-between text-[#5E6573]">
                <span>Process Standard:</span>
                <span className="text-[#111215] font-semibold">{currentMat.process}</span>
              </div>
              <div className="flex justify-between text-[#5E6573]">
                <span>Estimated Mass:</span>
                <span className="text-[#111215] font-semibold">~{estimatedGrams}g / unit</span>
              </div>
              <div className="flex justify-between text-[#5E6573]">
                <span>Base Unit Rate:</span>
                <span className="text-[#111215] font-semibold">₹{baseUnitPrice}</span>
              </div>
              {activeTier.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Batch Volume Discount:</span>
                  <span>-{(activeTier.discount * 100).toFixed(0)}%</span>
                </div>
              )}
              <div className="flex justify-between text-[#5E6573]">
                <span>Discounted Unit:</span>
                <span className="text-[#111215] font-semibold">₹{discountedUnitPrice}</span>
              </div>
              <div className="flex justify-between text-[#5E6573]">
                <span>Total Quantity:</span>
                <span className="text-[#111215] font-semibold">{quantity} pcs</span>
              </div>
            </div>

            <div className="pt-4 border-t border-black/10 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#5E6573] block">Estimated Subtotal</span>
                <span className="font-mono text-[10px] text-[#8A91A0]">Exclusive of GST & Shipping</span>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-display font-bold text-[#111215]">
                  ₹{totalEstimate.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-whatsapp-precision py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Verify & Order via WhatsApp</span>
              </a>

              <a
                href="/custom-lab"
                className="w-full btn-precision-primary py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <span>Open Full Custom Lab</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[#5E6573]">
              <Info className="w-3.5 h-3.5 text-[#412f91]" />
              <span>Quotes confirmed within 30 minutes during shop hours.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
