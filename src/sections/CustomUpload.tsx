'use client';

import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, X, Check, FileBox, Calculator, 
  ShoppingCart, Layers, Box, Sparkles, 
  ShieldCheck, Clock, Gauge, Sliders, RotateCw,
  MessageSquare, ArrowRight, Info, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';
import { trackFileUpload, trackQuoteFormSubmit } from '@/lib/analytics';
import PartViewer from '@/components/PartViewer';

// Real industrial material matrix
const materials = [
  { id: 'pla', name: 'PLA Pro Precision', description: 'Low-shrinkage rapid bio-polymer', price: 4.5, density: 1.24, tolerance: '±0.10 mm' },
  { id: 'petg', name: 'Industrial PETG', description: 'High chemical, moisture, and impact resistance', price: 6.0, density: 1.27, tolerance: '±0.08 mm' },
  { id: 'abs', name: 'ABS High-Impact', description: 'Thermal resistance up to 98°C, electronic housings', price: 8.5, density: 1.08, tolerance: '±0.06 mm' },
  { id: 'carbon', name: 'Carbon-X PA12-CF', description: 'Continuous carbon-fiber matrix, replaces 6061 aluminium', price: 26.0, density: 1.15, tolerance: '±0.04 mm' },
  { id: 'tpu', name: 'TPU 95A Elastomer', description: 'Flexible, rubber-like vibration dampening', price: 12.0, density: 1.21, tolerance: '±0.15 mm' },
  { id: 'resin', name: 'Precision Tough SLA Resin', description: 'Glass-smooth surface with 25-micron layer detail', price: 14.0, density: 1.18, tolerance: '±0.04 mm' },
];

const qualities = [
  { id: 'standard', name: 'Draft Standard', layerHeight: '0.20 mm', speed: '24h', multiplier: 1.0 },
  { id: 'high', name: 'Engineering Fine', layerHeight: '0.10 mm', speed: '36h', multiplier: 1.35 },
  { id: 'ultra', name: 'Optic Precision', layerHeight: '0.05 mm', speed: '48h', multiplier: 1.85 },
];

const sampleModels = [
  { name: 'Drone_Airframe_Mount.stl', dimensions: '94 × 62 × 38 mm', estWeight: 28 },
  { name: 'Helical_Gear_Compound.stl', dimensions: '72 × 72 × 45 mm', estWeight: 44 },
  { name: 'Turbine_Impeller_Rotor.stl', dimensions: '110 × 55 × 25 mm', estWeight: 32 },
];

export default function CustomUpload() {
  const [uploadedFile, setUploadedFile] = useState<{ 
    name: string; 
    size: number; 
    dimensions?: string; 
    estWeight?: number;
    volumeCm3?: number;
    isImage?: boolean;
  } | null>({
    name: 'Turbine_Impeller_Rotor.stl',
    size: 2.8,
    dimensions: '110 × 55 × 25 mm',
    estWeight: 32,
    volumeCm3: 24,
    isImage: false,
  });

  const [rawFile, setRawFile] = useState<File | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[3]); // Carbon-X default
  const [selectedQuality, setSelectedQuality] = useState(qualities[1]);
  const [infillDensity, setInfillDensity] = useState(30);
  const [quantity, setQuantity] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  // Dynamic pricing calculation in INR
  const basePrepFee = 150.00;
  const weightGrams = uploadedFile?.estWeight || 35;
  const infillMultiplier = 0.7 + (infillDensity / 100) * 0.6;
  const rawUnitCost = (basePrepFee + weightGrams * selectedMaterial.price * infillMultiplier) * selectedQuality.multiplier;

  // Volume tier discount
  let volumeDiscount = 0;
  if (quantity >= 200) volumeDiscount = 0.32;
  else if (quantity >= 50) volumeDiscount = 0.22;
  else if (quantity >= 10) volumeDiscount = 0.12;

  const unitPrice = Math.max(299, Math.round(rawUnitCost * (1 - volumeDiscount)));
  const totalPrice = unitPrice * quantity;

  const handleDimensionsCalculated = useCallback((dimensions: string, weightGrams: number, volumeCm3: number) => {
    setUploadedFile((prev) => {
      if (!prev) return prev;
      return { ...prev, dimensions, estWeight: weightGrams, volumeCm3 };
    });
  }, []);

  const handleFile = useCallback((file: File) => {
    const validExts = ['.stl', '.obj', '.glb', '.gltf', '.3mf', '.step', '.stp', '.jpg', '.jpeg', '.png', '.webp'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExts.includes(ext)) {
      toast.error('Format not supported. Please upload STL, OBJ, GLB, 3MF, STEP, or reference drawings.');
      return;
    }

    const isImage = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    setRawFile(file);

    trackFileUpload({
      fileName: file.name,
      fileSizeBytes: file.size,
      format: ext.replace('.', ''),
    });

    setUploadedFile({
      name: file.name,
      size: Number((file.size / (1024 * 1024)).toFixed(2)),
      dimensions: '108 × 74 × 42 mm',
      estWeight: Math.max(20, Math.round((file.size / (1024 * 1024)) * 14)),
      isImage,
    });

    toast.success(`Loaded CAD geometry: ${file.name}`);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const onAddToCart = () => {
    if (!uploadedFile) return;

    addItem(
      {
        id: `custom-${Date.now()}`,
        name: `Custom CAD Part: ${uploadedFile.name}`,
        description: `${selectedMaterial.name} • ${selectedQuality.layerHeight} • ${infillDensity}% Infill`,
        price: unitPrice,
        image: '/products/vase.jpg',
        category: 'Custom Lab Print',
        stock: 99,
      },
      quantity,
      {
        material: selectedMaterial.name,
        quality: selectedQuality.name,
        infill: `${infillDensity}%`,
        file: uploadedFile.name,
      }
    );

    trackQuoteFormSubmit({
      material: selectedMaterial.name,
      quantity,
      estimatedPrice: totalPrice,
      infill: infillDensity,
      technology: selectedMaterial.id === 'resin' ? '12K SLA Resin' : 'Industrial FDM',
    });

    toast.success('Custom component added to cart!', {
      description: `${quantity}x ${uploadedFile.name} in ${selectedMaterial.name}`,
      action: {
        label: 'View Cart',
        onClick: () => toggleCart(),
      },
    });
  };

  const whatsappNumber = '918889988874';
  const getWhatsAppMessage = () => {
    const fileName = uploadedFile ? uploadedFile.name : 'Custom 3D CAD Component';
    return `Hi Saturn 3D engineering, I would like to confirm my custom CAD quote:
- File: ${fileName}
- Material: ${selectedMaterial.name}
- Layer Resolution: ${selectedQuality.layerHeight}
- Infill Density: ${infillDensity}%
- Quantity: ${quantity} units
- Target Tolerance: ${selectedMaterial.tolerance}
- Estimated Subtotal: ₹${totalPrice.toLocaleString('en-IN')}
Can an engineer review my file geometry for additive fabrication?`;
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(getWhatsAppMessage())}`;

  return (
    <section className="min-h-screen bg-[#F5F6F8] text-[#0B0D10] pt-24 pb-16 px-6 sm:px-10 lg:px-16 font-body">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
              <span className="type-mono-eyebrow text-[#5B616B]">
                05 // Rapid Additive Studio
              </span>
            </div>
            <h1 className="type-h2 text-[#0B0D10]">
              Custom CAD quote & slicing engine.
            </h1>
            <p className="type-body text-[#5B616B] mt-2">
              Upload your 3D CAD mesh (.STL, .STEP, .OBJ, .GLB) or reference blueprint. Geometry parsed directly client-side. Inspect mechanical tolerances and configure production runs.
            </p>
          </div>

          <div className="precision-badge text-xs shrink-0">
            Client-Side Parsing // Zero Cloud Leaks
          </div>
        </div>

        {/* 2-Column Precision Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive 3D <PartViewer> (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="h-[480px] sm:h-[540px] w-full card-precision overflow-hidden relative">
              <PartViewer
                file={rawFile}
                initialMaterialColor="#F2EEE6"
                onDimensionsCalculated={handleDimensionsCalculated}
              />
            </div>

            {/* Quick Benchmark Model Selector */}
            <div className="card-precision p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="font-mono text-[#5B616B] text-[11px] uppercase tracking-wider">
                Test Industrial Benchmarks:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {sampleModels.map((sample) => (
                  <button
                    key={sample.name}
                    onClick={() => {
                      setRawFile(null);
                      setUploadedFile({
                        name: sample.name,
                        size: 2.5,
                        dimensions: sample.dimensions,
                        estWeight: sample.estWeight,
                        volumeCm3: 22,
                        isImage: false,
                      });
                      toast.success(`Loaded benchmark: ${sample.name}`);
                    }}
                    className="px-2.5 py-1 rounded-lg border border-black/10 bg-white hover:border-[#FF5A1F] text-[#0B0D10] text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    {sample.name.replace('.stl', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Precision Parameter Form & Quote Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* File Upload Trigger */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`p-4 rounded-xl border border-dashed transition-all flex items-center justify-between cursor-pointer ${
                isDragging ? 'border-[#FF5A1F] bg-[#FF5A1F]/5' : 'border-black/15 bg-white hover:border-black/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".stl,.obj,.glb,.gltf,.3mf,.step,.stp,.jpg,.jpeg,.png,.webp"
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                className="hidden"
              />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-[#FF5A1F]">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#0B0D10] truncate max-w-[200px]">
                    {uploadedFile ? uploadedFile.name : 'Upload CAD File (.STL, .STEP, .OBJ)'}
                  </div>
                  <div className="font-mono text-[10px] text-[#5B616B]">
                    {uploadedFile?.dimensions || 'Click or drag CAD geometry'}
                  </div>
                </div>
              </div>
              <span className="btn-precision-secondary text-[11px] py-1 px-2.5">
                Swap File
              </span>
            </div>

            {/* Material Selector */}
            <div className="space-y-2">
              <label className="font-mono text-xs text-[#5B616B] uppercase tracking-wider block">
                Engineering Polymer Selection
              </label>
              <div className="grid grid-cols-2 gap-2">
                {materials.map((m) => {
                  const isSelected = selectedMaterial.id === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMaterial(m)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF5A1F] bg-[#FF5A1F]/5 text-[#0B0D10]'
                          : 'border-black/10 bg-white text-[#5B616B] hover:border-black/20'
                      }`}
                    >
                      <div className="font-semibold text-xs text-[#0B0D10] truncate">
                        {m.name}
                      </div>
                      <div className="font-mono text-[10px] text-[#FF5A1F] mt-0.5">
                        ₹{m.price}/g &bull; {m.tolerance}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layer Resolution Selector */}
            <div className="space-y-2">
              <label className="font-mono text-xs text-[#5B616B] uppercase tracking-wider block">
                Layer Resolution Standard
              </label>
              <div className="grid grid-cols-3 gap-2">
                {qualities.map((q) => {
                  const isSelected = selectedQuality.id === q.id;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuality(q)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF5A1F] bg-[#FF5A1F]/5 text-[#0B0D10]'
                          : 'border-black/10 bg-white text-[#5B616B] hover:border-black/20'
                      }`}
                    >
                      <div className="font-semibold text-xs text-[#0B0D10]">{q.name}</div>
                      <div className="font-mono text-[10px] text-[#5B616B] mt-0.5">{q.layerHeight}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Infill & Quantity Controls */}
            <div className="card-precision p-4 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#5B616B] uppercase">Gyroid Infill:</span>
                  <span className="font-semibold text-[#FF5A1F]">{infillDensity}% Density</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={infillDensity}
                  onChange={(e) => setInfillDensity(Number(e.target.value))}
                  className="w-full accent-[#FF5A1F] cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-[#5B616B] uppercase block">Quantity</span>
                  {volumeDiscount > 0 && (
                    <span className="text-[10px] font-mono text-emerald-600">
                      {(volumeDiscount * 100).toFixed(0)}% Volume Discount
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg border border-black/10 hover:border-black/30 flex items-center justify-center text-xs"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 h-7 text-center bg-white border border-black/10 rounded-lg text-xs font-mono"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-lg border border-black/10 hover:border-black/30 flex items-center justify-center text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Total Quotation Summary */}
            <div className="card-precision p-5 space-y-4 border-[#FF5A1F]/30 bg-white">
              <div className="flex items-baseline justify-between pb-3 border-b border-black/5">
                <div>
                  <span className="text-xs text-[#5B616B] block">Total Estimated Price</span>
                  <span className="font-mono text-[10px] text-neutral-400">Exclusive of GST & Shipping</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-display font-semibold text-[#0B0D10]">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                  <div className="font-mono text-[10px] text-[#5B616B]">₹{unitPrice} / unit</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={onAddToCart}
                  className="btn-precision-primary text-xs py-3 px-4 flex items-center justify-center gap-2 w-full"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-precision text-xs py-3 px-4 flex items-center justify-center gap-2 w-full"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
