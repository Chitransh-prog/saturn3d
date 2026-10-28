import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, X, Check, FileBox, Calculator, 
  ShoppingCart, Layers, Box, Sparkles, 
  ShieldCheck, Clock, Gauge, Sliders, RotateCw,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';
import { trackFileUpload, trackQuoteFormSubmit } from '@/lib/analytics';
import STLPreviewViewer from '@/components/3d/STLPreviewViewer';

// Real industrial material options
const materials = [
  { id: 'pla', name: 'PLA Pro Eco', description: 'Precision high-detail polymer, corn-derived', price: 4.5, density: 1.24, badge: 'RAPID PROTO' },
  { id: 'petg', name: 'Industrial PETG', description: 'High chemical, moisture, and impact resistance', price: 6.0, density: 1.27, badge: 'DURABLE' },
  { id: 'abs', name: 'ABS-ESD Flame Retardant', description: 'Thermal resistance up to 98°C, electronic housings', price: 7.5, density: 1.05, badge: 'HEAT-RESIST' },
  { id: 'carbon', name: 'Carbon-X PA12', description: 'Carbon-fiber reinforced nylon, maximum structural rigidity', price: 14.0, density: 1.15, badge: 'AEROSPACE' },
  { id: 'tpu', name: 'TPU 95A Elastomer', description: 'Flexible, rubber-like vibration dampening', price: 11.0, density: 1.21, badge: 'FLEXIBLE' },
  { id: 'resin', name: 'Ultra-SLA Ceramic Resin', description: 'Glass-smooth surface with 25-micron layer detail', price: 16.0, density: 1.18, badge: 'MICRON DETAIL' },
];

// Quality options
const qualities = [
  { id: 'standard', name: 'Draft / Standard', layerHeight: '0.20 mm', speed: '24h', priceMultiplier: 1.0 },
  { id: 'high', name: 'Fine Engineering', layerHeight: '0.10 mm', speed: '36h', priceMultiplier: 1.4 },
  { id: 'ultra', name: 'Optic Precision', layerHeight: '0.05 mm', speed: '48h', priceMultiplier: 2.1 },
];

// Color options
const colors = [
  { id: 'saturn-orange', name: 'Saturn Orange', hex: '#FF5A1F' },
  { id: 'stealth-black', name: 'Stealth Black', hex: '#0B0B0B' },
  { id: 'lemon-yellow', name: 'Lemon High-Vis', hex: '#FFE14D' },
  { id: 'periwinkle-blue', name: 'Aero Periwinkle', hex: '#8EA2FF' },
  { id: 'mint-green', name: 'Mint Industrial', hex: '#7CF2C1' },
];

// Sample benchmark models for instant demo
const sampleModels = [
  { name: 'Drone_Airframe_Mount.stl', size: 2.4, dimensions: '94 × 62 × 38 mm', estWeight: 28 },
  { name: 'Helical_Gear_Compound.stl', size: 4.8, dimensions: '72 × 72 × 45 mm', estWeight: 44 },
  { name: 'Aerospace_Sensor_Baffle.stl', size: 3.1, dimensions: '110 × 55 × 25 mm', estWeight: 32 },
];

export default function CustomUpload() {
  const [step, setStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<{ 
    name: string; 
    size: number; 
    dimensions?: string; 
    estWeight?: number;
    isImage?: boolean;
  } | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [activeSample, setActiveSample] = useState<string | null>('Drone_Airframe_Mount.stl');
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
  const [selectedQuality, setSelectedQuality] = useState(qualities[1]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [infillDensity, setInfillDensity] = useState(30);
  const [quantity, setQuantity] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  // Dynamic pricing in INR
  const basePrepFee = 199.00;
  const weightGrams = uploadedFile?.estWeight || 35;
  const infillMultiplier = 0.7 + (infillDensity / 100) * 0.6;
  const rawUnitCost = (basePrepFee + weightGrams * selectedMaterial.price * infillMultiplier) * selectedQuality.priceMultiplier;
  const unitPrice = Math.max(349.00, Math.round(rawUnitCost));
  const totalPrice = unitPrice * quantity;

  const handleDimensionsCalculated = useCallback((dimensions: string, weightGrams: number) => {
    setUploadedFile((prev) => {
      if (!prev) return prev;
      return { ...prev, dimensions, estWeight: weightGrams };
    });
  }, []);

  const handleFile = useCallback((file: File) => {
    const validExtensions = [
      '.stl', '.obj', '.glb', '.gltf', '.3mf', '.step', '.stp',
      '.jpg', '.jpeg', '.png', '.webp', '.svg', '.bmp'
    ];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(ext)) {
      toast.error('Format not supported. Please upload STL, OBJ, GLB, 3MF, STEP, or JPG/PNG/WEBP.');
      return;
    }

    const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.bmp'].includes(ext);

    setIsAnalyzing(true);
    setRawFile(file);
    setActiveSample(null);

    trackFileUpload({
      fileName: file.name,
      fileSizeBytes: file.size,
      format: ext.replace('.', ''),
    });

    setUploadedFile({
      name: file.name,
      size: Number((file.size / (1024 * 1024)).toFixed(2)),
      dimensions: isImage ? '120 × 90 × 12 mm' : '108 × 74 × 42 mm',
      estWeight: Math.max(20, Math.round((file.size / (1024 * 1024)) * 14)),
      isImage,
    });

    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(2);
      if (isImage) {
        toast.success('2D Blueprint / Reference Image Loaded Client-Side (Ready for 3D Modeling & Print)');
      } else {
        toast.success('3D Geometry Analyzed Client-Side (No Upload Necessary)');
      }
    }, 800);
  }, []);

  const loadSampleModel = (sample: typeof sampleModels[0]) => {
    setIsAnalyzing(true);
    setRawFile(null);
    setActiveSample(sample.name);
    setUploadedFile({
      name: sample.name,
      size: sample.size,
      dimensions: sample.dimensions,
      estWeight: sample.estWeight,
      isImage: false,
    });

    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(2);
      toast.success(`Loaded benchmark: ${sample.name}`);
    }, 600);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const onAddToCart = () => {
    if (!uploadedFile) return;
    
    const isImage = uploadedFile.isImage || false;

    addItem(
      {
        id: `custom-${Date.now()}`,
        name: `${isImage ? 'Custom 2D Blueprint Print' : 'Custom CAD Print'}: ${uploadedFile.name}`,
        description: `${selectedMaterial.name} • ${selectedQuality.layerHeight} • ${infillDensity}% Infill • ${selectedColor.name}${isImage ? ' • 2D-to-3D Engineering' : ''}`,
        price: unitPrice,
        image: '/products/vase.jpg',
        category: isImage ? '2D-to-3D Print' : 'Custom Lab Print',
        stock: 99,
      },
      quantity,
      {
        material: selectedMaterial.name,
        quality: selectedQuality.name,
        infill: `${infillDensity}%`,
        color: selectedColor.name,
        file: uploadedFile.name,
        type: isImage ? 'Blueprint Image' : '3D Geometry',
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
    <section className="min-h-screen bg-paper pattern-blueprint pt-20 sm:pt-24 pb-12 sm:pb-16 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pb-8 border-b-3 border-ink">
          <div>
            {/* Brutalist Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-ink text-paper border-2 border-ink shadow-brutal-sm text-xs font-mono font-black uppercase tracking-wider mb-4">
              <span className="w-2.5 h-2.5 bg-saturn-orange" />
              <span>05 / RAPID ADDITIVE STUDIO</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-ink tracking-tight uppercase leading-[0.95]">
              CUSTOM CAD <br />
              <span className="text-saturn-orange outline-text">SLICER & QUOTE.</span>
            </h1>
            <p className="font-mono text-ink/80 text-xs sm:text-sm font-bold max-w-xl mt-4 leading-relaxed bg-white/70 p-3 border-2 border-ink shadow-brutal-sm">
              Upload your 3D CAD mesh (.STL, .OBJ, .GLB, .STEP) or 2D reference blueprint (.JPG, .PNG). Bounding-box and topology are computed strictly in your browser. Configure engineering polymers, inspect layer heights, and receive instant precision manufacturing pricing.
            </p>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center gap-2 bg-white p-2 border-3 border-ink shadow-brutal">
            {[
              { num: 1, label: 'Upload Mesh' },
              { num: 2, label: 'Configure Part' },
              { num: 3, label: 'Produce' }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 flex items-center justify-center text-xs font-mono font-black border-2 border-ink transition-all ${
                    step === s.num
                      ? 'bg-lemon text-ink shadow-brutal-sm'
                      : step > s.num
                      ? 'bg-mint text-ink'
                      : 'bg-paper text-ink/40'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-xs font-mono font-black uppercase tracking-wider hidden sm:inline px-1 ${step === s.num ? 'text-ink' : 'text-ink/40'}`}>
                  {s.label}
                </span>
                {s.num < 3 && <span className="text-ink/30 font-black px-1">/</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Studio Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Configuration Workspace (Col 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Real-time 3D STL & CAD Viewer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black uppercase text-ink flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-saturn-orange" />
                  CLIENT-SIDE 3D & BLUEPRINT INSPECTION
                </span>
                <span className="font-mono text-[11px] font-bold text-saturn-orange bg-lemon px-2 py-0.5 border border-ink shadow-brutal-sm">
                  ZERO DATA UPLOADED YET
                </span>
              </div>
              <STLPreviewViewer
                file={rawFile}
                sampleType={activeSample}
                color={selectedColor.hex}
                onDimensionsCalculated={handleDimensionsCalculated}
              />
            </div>

            {step === 1 && (
              <div className="space-y-6">
                {/* Drag and Drop Zone */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`relative min-h-[300px] card-slab border-3 border-dashed border-ink transition-all flex flex-col items-center justify-center p-8 text-center group cursor-pointer ${
                    isDragging ? 'bg-lemon/50 scale-[0.99]' : 'bg-white hover:bg-paper shadow-brutal'
                  }`}
                >
                  <div className="w-16 h-16 bg-saturn-orange border-3 border-ink flex items-center justify-center group-hover:scale-105 transition-transform mb-4 shadow-brutal-sm">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-black text-ink uppercase mb-2">
                    DRAG & DROP YOUR 3D CAD FILE OR IMAGE
                  </h3>
                  <p className="font-mono text-ink/70 text-xs mb-3 max-w-md font-bold">
                    Direct client parsing for <span className="text-saturn-orange font-black">.STL, .OBJ, .GLB, .STEP, .3MF, .JPG, .PNG, .WEBP</span> up to 100MB
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-1.5 mb-5 max-w-md">
                    <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-ink text-paper border border-ink">
                      3D: .STL .OBJ .GLB .STEP .3MF
                    </span>
                    <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-lemon text-ink border border-ink">
                      IMAGES: .JPG .JPEG .PNG .WEBP .SVG
                    </span>
                  </div>

                  <input 
                    type="file" 
                    accept=".stl,.obj,.glb,.gltf,.3mf,.step,.stp,.jpg,.jpeg,.png,.webp,.svg,.bmp,image/*"
                    onChange={(e) => e.target.files && handleFile(e.target.files[0])} 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  <button className="btn-brutal bg-ink text-paper hover:bg-saturn-orange hover:text-white px-6 py-3 font-mono text-xs font-black uppercase tracking-wider border-2 border-ink shadow-brutal-sm cursor-pointer">
                    SELECT CAD / IMAGE FILE
                  </button>

                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-paper/95 border-3 border-ink flex flex-col items-center justify-center z-20">
                      <div className="w-10 h-10 border-4 border-ink border-t-saturn-orange animate-spin mb-3" />
                      <p className="font-mono font-black text-ink text-sm uppercase">Calculating Bounding Box & Slices...</p>
                    </div>
                  )}
                </div>

                {/* Instant Try-it-Out Benchmark Models */}
                <div className="card-slab bg-white border-3 border-ink shadow-brutal p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-black text-ink uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-saturn-orange" />
                      OR TEST BENCHMARK WITH PRE-LOADED INDUSTRIAL GEOMETRIES:
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {sampleModels.map((sample) => (
                      <button
                        key={sample.name}
                        onClick={() => loadSampleModel(sample)}
                        className={`text-left p-3.5 border-2 border-ink transition-all cursor-pointer ${
                          activeSample === sample.name ? 'bg-lemon shadow-brutal-sm' : 'bg-paper hover:bg-lemon/30'
                        }`}
                      >
                        <p className="font-mono text-xs font-black text-ink truncate uppercase">
                          {sample.name.replace('.stl', '')}
                        </p>
                        <p className="font-mono text-[10px] text-ink/70 mt-1 font-bold">
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
                <div className="card-slab bg-ink text-paper border-3 border-ink shadow-brutal p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-saturn-orange border-2 border-paper flex items-center justify-center shadow-brutal-sm">
                      {uploadedFile?.isImage ? (
                        <ImageIcon className="w-6 h-6 text-paper" />
                      ) : (
                        <FileBox className="w-6 h-6 text-paper" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-mono font-black text-sm text-paper uppercase line-clamp-1">{uploadedFile?.name || activeSample}</h4>
                        <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 bg-lemon text-ink">
                          {uploadedFile?.isImage ? '2D BLUEPRINT / IMAGE' : '3D CAD GEOMETRY'}
                        </span>
                      </div>
                      <p className="font-mono text-paper/70 text-xs mt-0.5">
                        {uploadedFile?.size} MB • {uploadedFile?.dimensions || '94 × 62 × 38 mm'} • ~{weightGrams}g est.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setStep(1); setUploadedFile(null); setRawFile(null); }} 
                    className="p-2 bg-paper text-ink border-2 border-paper hover:bg-red-400 hover:text-white transition-colors cursor-pointer"
                    title="Change File"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Substrate Material Selection */}
                <div className="card-slab bg-white border-3 border-ink shadow-brutal p-6 space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-ink/20 pb-3">
                    <div className="flex items-center gap-2">
                      <Box className="w-4 h-4 text-saturn-orange" />
                      <h3 className="font-mono text-sm font-black text-ink uppercase">Select Production Material</h3>
                    </div>
                    <span className="font-mono text-xs font-bold text-ink/60">6 polymers in stock</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {materials.map((m) => {
                      const isSelected = selectedMaterial.id === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMaterial(m)}
                          className={`p-4 border-3 border-ink text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-lemon shadow-brutal'
                              : 'bg-paper hover:bg-white shadow-brutal-sm'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono font-black text-sm text-ink">{m.name}</span>
                            <span className="font-mono text-xs font-black text-saturn-orange">₹{m.price.toFixed(1)}/g</span>
                          </div>
                          <span className="inline-block text-[9px] font-mono font-black uppercase bg-ink text-paper px-1.5 py-0.2 mb-1.5">
                            {m.badge}
                          </span>
                          <p className="font-mono text-[11px] text-ink/70 leading-snug">{m.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Infill & Resolution Configuration */}
                <div className="card-slab bg-white border-3 border-ink shadow-brutal p-6 space-y-5">
                  <div className="flex items-center gap-2 border-b-2 border-ink/20 pb-3">
                    <Sliders className="w-4 h-4 text-saturn-orange" />
                    <h3 className="font-mono text-sm font-black text-ink uppercase">Layer Precision & Infill Density</h3>
                  </div>

                  {/* Quality Pills */}
                  <div className="grid grid-cols-3 gap-3">
                    {qualities.map((q) => {
                      const isSelected = selectedQuality.id === q.id;
                      return (
                        <button
                          key={q.id}
                          onClick={() => setSelectedQuality(q)}
                          className={`p-3 border-2 border-ink text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-saturn-orange text-white shadow-brutal'
                              : 'bg-paper hover:bg-white text-ink shadow-brutal-sm'
                          }`}
                        >
                          <p className="font-mono text-xs font-bold">{q.name}</p>
                          <p className="font-mono text-base font-black mt-0.5">{q.layerHeight}</p>
                          <p className="font-mono text-[10px] opacity-80 mt-0.5">Speed: {q.speed}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Infill Slider */}
                  <div className="pt-2 border-t-2 border-ink/20">
                    <div className="flex justify-between items-center text-xs font-mono font-bold mb-2">
                      <span className="text-ink">Internal Infill Density</span>
                      <span className="text-saturn-orange font-black bg-paper px-2 py-0.5 border border-ink">
                        {infillDensity}% ({infillDensity <= 20 ? 'Lightweight' : infillDensity <= 50 ? 'Standard Mechanical' : 'Solid Core'})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="100"
                      step="5"
                      value={infillDensity}
                      onChange={(e) => setInfillDensity(Number(e.target.value))}
                      className="w-full accent-saturn-orange h-3 bg-paper border-2 border-ink cursor-pointer"
                    />
                    <div className="flex justify-between font-mono text-[10px] text-ink/60 mt-1 font-bold">
                      <span>15% (Prototyping)</span>
                      <span>50% (Rigid)</span>
                      <span>100% (Solid Aerospace)</span>
                    </div>
                  </div>

                  {/* Color Finish Picker */}
                  <div className="pt-2 border-t-2 border-ink/20">
                    <div className="font-mono text-xs font-black text-ink mb-2 uppercase">Color / Surface Pigment</div>
                    <div className="flex flex-wrap items-center gap-3">
                      {colors.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedColor(c)}
                          className={`flex items-center gap-2 px-3 py-1.5 border-2 border-ink text-xs font-mono font-bold transition-all cursor-pointer ${
                            selectedColor.id === c.id
                              ? 'bg-lemon shadow-brutal-sm font-black'
                              : 'bg-paper text-ink hover:bg-white'
                          }`}
                        >
                          <span className="w-3.5 h-3.5 border-2 border-ink" style={{ backgroundColor: c.hex }} />
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
            <div className="card-slab bg-paper border-4 border-ink p-6 sm:p-8 shadow-brutal-xl relative">
              <div className="flex items-center justify-between pb-4 border-b-3 border-ink mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-saturn-orange border-2 border-ink flex items-center justify-center text-paper shadow-brutal-sm">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-ink uppercase">Instant CAD Quote</h3>
                    <p className="font-mono text-[10px] text-ink/70 font-bold">BHOPAL PRODUCTION FARM</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-black text-ink bg-mint px-2.5 py-1 border-2 border-ink shadow-brutal-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-ink animate-pulse" />
                  FARM ACTIVE
                </span>
              </div>

              {/* Cost breakdown */}
              <div className="space-y-3 mb-6 font-mono text-xs">
                <div className="flex justify-between items-center text-ink/80 pb-1 border-b border-ink/20">
                  <span>Base Slicing & Laser Setup:</span>
                  <span className="font-bold text-ink">₹{basePrepFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-ink/80 pb-1 border-b border-ink/20">
                  <span>Polymer ({selectedMaterial.name}):</span>
                  <span className="font-bold text-ink">
                    ₹{(weightGrams * selectedMaterial.price * infillMultiplier).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-ink/80 pb-1 border-b border-ink/20">
                  <span>Layer Precision Factor:</span>
                  <span className="font-bold text-ink">{selectedQuality.layerHeight} ({selectedQuality.priceMultiplier}x)</span>
                </div>

                {/* Quantity Selector */}
                <div className="flex justify-between items-center pt-3 border-t-2 border-ink">
                  <span className="text-ink font-black uppercase">Part Quantity:</span>
                  <div className="flex items-center gap-2 bg-white border-2 border-ink p-1 shadow-brutal-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 bg-paper border border-ink flex items-center justify-center font-black text-ink hover:bg-lemon transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-black text-ink px-2 text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 bg-paper border border-ink flex items-center justify-center font-black text-ink hover:bg-lemon transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Grand Total Slab */}
                <div className="p-4 bg-lemon border-3 border-ink shadow-brutal text-ink mt-4">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-mono text-[10px] font-black uppercase text-ink/70">Estimated Total (INR)</span>
                      <div className="text-3xl sm:text-4xl font-mono font-black text-ink tracking-tight">
                        ₹{totalPrice.toFixed(2)}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-black bg-white px-2 py-1 border-2 border-ink">
                      ₹{unitPrice.toFixed(2)} / unit
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onAddToCart}
                  disabled={!uploadedFile && !activeSample}
                  className="w-full h-14 btn-brutal bg-saturn-orange text-white hover:bg-lemon hover:text-ink font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-3 border-ink shadow-brutal cursor-pointer disabled:opacity-40"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>ADD CUSTOM PART TO PRODUCTION</span>
                </button>

                <a 
                  href={`https://wa.me/917999824632?text=${encodeURIComponent(
                    `Hello Saturn 3D team, I would like to get a quote on manufacturing: ${
                      uploadedFile 
                        ? `${uploadedFile.name} (${uploadedFile.isImage ? '2D Reference Image/Blueprint' : '3D CAD'})` 
                        : activeSample || 'Custom 3D part'
                    } in ${selectedMaterial.name} (${selectedQuality.layerHeight}, ${infillDensity}% infill, ${quantity} units).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 btn-brutal bg-[#25D366] text-ink hover:bg-white font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-3 border-ink shadow-brutal cursor-pointer"
                >
                  <span>CHAT WITH CHIEF ENGINEER (WHATSAPP)</span>
                </a>
              </div>

              {/* Guarantees */}
              <div className="mt-6 pt-6 border-t-2 border-ink/20 space-y-2.5 font-mono text-xs text-ink/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-saturn-orange shrink-0" />
                  <span>±0.05 mm mechanical fit guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-saturn-orange shrink-0" />
                  <span>Ships in {selectedQuality.speed} via Express Air</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-saturn-orange shrink-0" />
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
