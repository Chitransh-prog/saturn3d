import { useState, useRef, useCallback } from 'react';
import { 
  Upload, X, Check, FileBox, Settings, Calculator, 
  ShoppingCart, ArrowRight, Layers, Box, Cpu, Sparkles, 
  ShieldCheck, Clock, Gauge, Sliders, Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';
import { trackFileUpload, trackQuoteFormSubmit } from '@/lib/analytics';

// Material options
const materials = [
  { id: 'pla', name: 'PLA Pro Eco', description: 'Precision high-detail polymer, vegetable-derived', price: 0.06, color: 'bg-emerald-500', density: 1.24 },
  { id: 'petg', name: 'Industrial PETG', description: 'High chemical, moisture, and impact resistance', price: 0.08, color: 'bg-blue-500', density: 1.27 },
  { id: 'abs', name: 'ABS-ESD Flame Retardant', description: 'Thermal resistance up to 98°C, engineering housings', price: 0.10, color: 'bg-zinc-800', density: 1.05 },
  { id: 'carbon', name: 'Carbon-X PA12', description: 'Carbon-fiber reinforced nylon, maximum structural rigidity', price: 0.18, color: 'bg-slate-900', density: 1.15 },
  { id: 'tpu', name: 'TPU 95A Elastomer', description: 'Flexible, rubber-like vibration dampening', price: 0.14, color: 'bg-orange-500', density: 1.21 },
  { id: 'resin', name: 'Ultra-SLA Ceramic Resin', description: 'Glass-smooth surface with 25-micron layer detail', price: 0.22, color: 'bg-purple-600', density: 1.18 },
];

// Quality options
const qualities = [
  { id: 'standard', name: 'Draft / Standard', layerHeight: '0.20 mm', speed: '24h', priceMultiplier: 1.0 },
  { id: 'high', name: 'Fine Engineering', layerHeight: '0.10 mm', speed: '36h', priceMultiplier: 1.4 },
  { id: 'ultra', name: 'Optic Precision', layerHeight: '0.05 mm', speed: '48h', priceMultiplier: 2.1 },
];

// Color options
const colors = [
  { id: 'stealth-black', name: 'Stealth Black', hex: '#18181b' },
  { id: 'signal-white', name: 'Cosmic White', hex: '#f8fafc' },
  { id: 'space-gray', name: 'Industrial Gray', hex: '#64748b' },
  { id: 'cobalt-blue', name: 'Saturn Blue', hex: '#2563eb' },
  { id: 'safety-orange', name: 'Safety Orange', hex: '#f97316' },
];

// Sample models for instant demo
const sampleModels = [
  { name: 'Drone_Airframe_Mount.stl', size: 2.4, dimensions: '94 × 62 × 38 mm', estWeight: 28 },
  { name: 'Helical_Gear_Compound.obj', size: 4.8, dimensions: '72 × 72 × 45 mm', estWeight: 44 },
  { name: 'Aerospace_Sensor_Baffle.3mf', size: 3.1, dimensions: '110 × 55 × 25 mm', estWeight: 32 },
];

export default function CustomUpload() {
  const [step, setStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; dimensions?: string; estWeight?: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
  const [selectedQuality, setSelectedQuality] = useState(qualities[1]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [infillDensity, setInfillDensity] = useState(30);
  const [quantity, setQuantity] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  // Dynamic pricing calculation
  const basePrepFee = 12.00;
  const weightGrams = uploadedFile?.estWeight || (uploadedFile ? (uploadedFile.size * 10) : 35);
  const infillMultiplier = 0.7 + (infillDensity / 100) * 0.6;
  const rawUnitCost = (basePrepFee + weightGrams * selectedMaterial.price * infillMultiplier) * selectedQuality.priceMultiplier;
  const unitPrice = Math.max(18.00, Number(rawUnitCost.toFixed(2)));
  const totalPrice = Number((unitPrice * quantity).toFixed(2));

  const handleFile = useCallback((file: File) => {
    const validExtensions = ['.stl', '.obj', '.3mf', '.step', '.stp', '.png', '.jpg', '.jpeg'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(ext)) {
      toast.error('Format not supported. Please upload STL, OBJ, 3MF, STEP, or CAD preview.');
      return;
    }

    setIsAnalyzing(true);
    trackFileUpload({
      fileName: file.name,
      fileSizeBytes: file.size,
      format: ext.replace('.', ''),
    });
    setUploadedFile({
      name: file.name,
      size: Number((file.size / (1024 * 1024)).toFixed(2)),
      dimensions: '108 × 74 × 42 mm',
      estWeight: Math.max(20, Math.round((file.size / (1024 * 1024)) * 12)),
    });

    if (ext.match(/\.(png|jpg|jpeg)$/)) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }

    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(2);
      toast.success('3D Geometry Analyzed & Validated');
    }, 1200);
  }, []);

  const loadSampleModel = (sample: typeof sampleModels[0]) => {
    setIsAnalyzing(true);
    setUploadedFile({
      name: sample.name,
      size: sample.size,
      dimensions: sample.dimensions,
      estWeight: sample.estWeight,
    });
    setPreviewUrl(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(2);
      toast.success(`Loaded sample: ${sample.name}`);
    }, 900);
  };

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
        name: `Custom Print: ${uploadedFile.name}`,
        description: `${selectedMaterial.name} • ${selectedQuality.layerHeight} • ${infillDensity}% Infill • ${selectedColor.name}`,
        price: unitPrice,
        image: previewUrl || '/products/vase.jpg',
        category: 'Custom Lab Print',
        stock: 99,
      },
      quantity,
      {
        material: selectedMaterial.name,
        quality: selectedQuality.name,
        infill: `${infillDensity}%`,
        color: selectedColor.name,
        file: uploadedFile.name,
      }
    );

    trackQuoteFormSubmit({
      material: selectedMaterial.name,
      quantity,
      estimatedPrice: totalPrice,
      infill: infillDensity,
      technology: selectedMaterial.id === 'resin' ? 'SLA Resin' : 'Industrial FDM',
    });

    toast.success('Custom part added to cart!', {
      description: `${quantity}x ${uploadedFile.name} configured in ${selectedMaterial.name}`,
      action: {
        label: 'View Cart',
        onClick: () => toggleCart(),
      },
    });
  };

  return (
    <section className="min-h-screen bg-white py-8 lg:py-16 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pb-8 border-b border-black/10">
          <div>
            {/* Protocol Eyebrow Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0D1117] text-white text-[10px] font-mono-tech font-bold uppercase tracking-[0.25em] mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#F7931E] animate-pulse" />
              <span>THE RAPID STUDIO</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-black tracking-tight leading-[0.92] uppercase">
              CUSTOM PRINT <br />
              <span className="text-[#F7931E] italic">CONFIGURATOR.</span>
            </h1>
            <p className="font-heading text-slate-500 text-sm sm:text-base font-medium max-w-xl mt-4 leading-relaxed">
              Upload your 3D CAD mesh to slice, configure polymer materials, inspect infill density, and receive instant precision manufacturing pricing.
            </p>
          </div>

          {/* Stepper Progress - Capsule Pills */}
          <div className="flex items-center gap-2 bg-[#F3F4F6] p-2 rounded-full border border-black/5 shadow-2xs">
            {[
              { num: 1, label: 'Upload Mesh' },
              { num: 2, label: 'Configure Part' },
              { num: 3, label: 'Produce' }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-heading font-black transition-all ${
                    step === s.num
                      ? 'bg-black text-white shadow-xs'
                      : step > s.num
                      ? 'bg-[#F7931E] text-white'
                      : 'bg-white text-slate-400 border border-black/5'
                  }`}
                >
                  {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className={`text-[11px] font-heading font-bold uppercase tracking-wider hidden sm:inline px-1 ${step === s.num ? 'text-black' : 'text-slate-400'}`}>
                  {s.label}
                </span>
                {s.num < 3 && <span className="text-slate-300 text-xs px-1">/</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Studio Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Configuration Workspace (Col 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {step === 1 && (
              <div className="space-y-6">
                {/* Drag and Drop Zone */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`relative min-h-[360px] sm:min-h-[420px] rounded-[32px] sm:rounded-[40px] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 text-center group cursor-pointer ${
                    isDragging ? 'border-[#F7931E] bg-orange-50/20 scale-[0.99]' : 'border-black/15 bg-[#FAFAFA] hover:border-black hover:bg-white shadow-xs'
                  }`}
                >
                  <div className="w-20 h-20 rounded-full bg-white border border-black/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 mb-6 shadow-xs">
                    <Upload className="w-8 h-8 text-black group-hover:text-[#F7931E] transition-colors" />
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-black text-black tracking-tight uppercase mb-2">
                    Drag and drop your 3D CAD model
                  </h3>
                  <p className="font-heading text-slate-500 text-xs sm:text-sm mb-6 max-w-sm">
                    Compatible with <span className="font-bold text-black">.STL, .OBJ, .3MF, .STEP</span> up to 100MB
                  </p>

                  <input 
                    type="file" 
                    onChange={(e) => e.target.files && handleFile(e.target.files[0])} 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  <button className="h-12 px-8 rounded-full bg-black hover:bg-neutral-800 text-white font-heading font-black text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95">
                    CHOOSE CAD FILE
                  </button>

                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-[32px] sm:rounded-[40px] flex flex-col items-center justify-center z-20">
                      <div className="w-12 h-12 border-3 border-slate-100 border-t-[#F7931E] rounded-full animate-spin mb-4" />
                      <p className="font-heading font-black text-black text-sm uppercase tracking-wider">Analyzing Mesh Topology & Wall Thickness...</p>
                      <p className="font-mono-tech text-slate-400 text-xs mt-1">Generating slicing calculations</p>
                    </div>
                  )}
                </div>

                {/* Instant Try-it-Out Sample Models */}
                <div className="bg-[#FAFAFA] p-6 rounded-[28px] border border-black/10 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono-tech text-[11px] font-bold text-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#F7931E]" />
                      OR BENCHMARK WITH PRE-LOADED INDUSTRIAL GEOMETRIES:
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {sampleModels.map((sample) => (
                      <button
                        key={sample.name}
                        onClick={() => loadSampleModel(sample)}
                        className="text-left p-4 rounded-2xl bg-white border border-black/10 hover:border-black hover:shadow-xs transition-all group"
                      >
                        <p className="font-heading text-xs font-bold text-black truncate group-hover:text-[#F7931E] transition-colors uppercase">
                          {sample.name.replace('.stl', '').replace('.obj', '').replace('.3mf', '')}
                        </p>
                        <p className="font-mono-tech text-[10px] text-slate-400 mt-1">
                          {sample.dimensions}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step >= 2 && (
              <div className="space-y-6">
                {/* Active File Card */}
                <div className="bg-slate-900 text-white p-6 rounded-3xl flex items-center justify-between shadow-xl shadow-slate-900/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                      <FileBox className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white line-clamp-1">{uploadedFile?.name}</h4>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {uploadedFile?.size} MB • {uploadedFile?.dimensions || '108 × 74 × 42 mm'} • ~{weightGrams}g
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setStep(1); setUploadedFile(null); }} 
                    className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
                    title="Change File"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Substrate Material Selection */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Box className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-bold text-slate-900">Select Production Material</h3>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">6 polymers available</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {materials.map((m) => {
                      const isSelected = selectedMaterial.id === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMaterial(m)}
                          className={`p-4 rounded-2xl border text-left transition-all relative ${
                            isSelected
                              ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-sm text-slate-900">{m.name}</span>
                            <span className="text-xs font-bold text-primary">${m.price.toFixed(2)}/g</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-snug">{m.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Infill & Resolution Configuration */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-slate-900">Layer Height & Structural Infill</h3>
                  </div>

                  {/* Quality Pills */}
                  <div className="grid grid-cols-3 gap-3">
                    {qualities.map((q) => {
                      const isSelected = selectedQuality.id === q.id;
                      return (
                        <button
                          key={q.id}
                          onClick={() => setSelectedQuality(q)}
                          className={`p-3.5 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/5 ring-1 ring-primary text-slate-900'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          <p className="text-xs font-bold">{q.name}</p>
                          <p className="text-base font-extrabold text-primary mt-0.5">{q.layerHeight}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Est: {q.speed}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Infill Slider */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs font-semibold mb-2">
                      <span className="text-slate-700">Internal Infill Density</span>
                      <span className="text-primary font-bold">{infillDensity}% ({infillDensity <= 20 ? 'Lightweight' : infillDensity <= 50 ? 'Balanced Structural' : 'High Mechanical Stress'})</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="100"
                      step="5"
                      value={infillDensity}
                      onChange={(e) => setInfillDensity(Number(e.target.value))}
                      className="w-full accent-primary h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>15% (Prototyping)</span>
                      <span>50% (Standard)</span>
                      <span>100% (Solid Core)</span>
                    </div>
                  </div>

                  {/* Color Finish Picker */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-700 mb-2">Color Surface Finish</div>
                    <div className="flex items-center gap-3">
                      {colors.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedColor(c)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                            selectedColor.id === c.id
                              ? 'border-primary bg-primary/5 text-slate-900 font-bold'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Pricing Quote & Production Card (Col 8-12) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-bold text-slate-900">Instant Manufacturing Quote</h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Farm Online
                </span>
              </div>

              {/* Cost breakdown */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Base Setup & Laser Calibration</span>
                  <span className="font-semibold text-slate-900">${basePrepFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Material ({selectedMaterial.name})</span>
                  <span className="font-semibold text-slate-900">
                    ${(weightGrams * selectedMaterial.price * infillMultiplier).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Resolution Layer Multiplier</span>
                  <span className="font-semibold text-slate-900">{selectedQuality.layerHeight} ({selectedQuality.priceMultiplier}x)</span>
                </div>

                {/* Quantity Selector */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="text-slate-700 font-semibold">Quantity</span>
                  <div className="flex items-center gap-3 bg-slate-100 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 transition-colors shadow-xs"
                    >
                      -
                    </button>
                    <span className="font-bold text-slate-900 px-1 text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 transition-colors shadow-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="h-px bg-slate-200/80 my-4" />

                {/* Total */}
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Estimated Total Price</span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      ${totalPrice.toFixed(2)}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-md">
                    ${unitPrice.toFixed(2)} / unit
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onAddToCart}
                  disabled={!uploadedFile}
                  className="w-full h-14 rounded-full bg-black hover:bg-neutral-800 text-white font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-40 active:scale-95"
                >
                  {uploadedFile ? (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>ADD CUSTOM PART TO PRODUCTION</span>
                    </>
                  ) : (
                    <span>UPLOAD CAD MESH TO CONFIGURE</span>
                  )}
                </button>

                <a 
                  href={`https://wa.me/917999824632?text=${encodeURIComponent(
                    `Hello Saturn3D team, I would like to discuss a custom production run for: ${uploadedFile ? uploadedFile.name : 'Custom 3D CAD design'} in ${selectedMaterial.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-full border border-black/10 bg-[#FAFAFA] hover:bg-white text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>CHAT WITH AN ADDITIVE ENGINEER</span>
                </a>
              </div>

              {/* Guarantees */}
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-2.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>±0.05 mm mechanical fit guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Ships in {selectedQuality.speed} via Express Air</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Non-Disclosure & IP Security assured</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
