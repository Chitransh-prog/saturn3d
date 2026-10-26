import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingCart, Star, Truck, Shield, 
  RotateCcw, Check, Loader2, Info, Package, 
  Settings, Award, ChevronRight, Zap, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { productsApi, type Product } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import CTA from '@/sections/CTA';
import Product3DViewer from '@/components/Product3DViewer';

const materials = [
  { id: 'PLA', name: 'PLA Pro Eco', desc: 'Sustainable, high detail, smooth finish' },
  { id: 'ABS', name: 'ABS-ESD Pro', desc: 'Flame retardant, heat & impact resistant' },
  { id: 'PETG', name: 'PETG Industrial', desc: 'Chemical proof, durable, moisture resistant' },
  { id: 'TPU', name: 'TPU 95A Elastomer', desc: 'Tough rubber-like flexibility & damping' }
];

const quantities = [1, 2, 3, 5, 10];

type TabType = 'details' | 'specs' | 'shipping' | 'reviews';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const items = useCartStore((state) => state.items);

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedMaterial, setSelectedMaterial] = useState('PLA');
  const [selectedQty, setSelectedQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('details');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);

    productsApi.getById(id)
      .then((res) => {
        if (res.data.success && res.data.data) {
          setProduct(res.data.data.product);
          setRelated(res.data.data.related || []);
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error('Failed to load product');
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Bulk discount calculation
  const discountPercent = selectedQty >= 10 ? 15 : selectedQty >= 5 ? 10 : selectedQty >= 3 ? 5 : 0;
  const rawTotal = (product?.price || 0) * selectedQty;
  const finalTotal = rawTotal * (1 - discountPercent / 100);

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem(
      {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
      },
      selectedQty,
      { material: selectedMaterial }
    );

    setAdded(true);
    toast.success(`${product.name} added to cart!`, {
      description: `${selectedQty}x in ${selectedMaterial} ${discountPercent > 0 ? `(${discountPercent}% bulk discount applied)` : ''}`,
      action: { label: 'View Cart', onClick: () => toggleCart() },
      style: { background: '#fff', color: '#090d16', border: '1px solid #e2e8f0', borderRadius: '16px' },
    });
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-semibold text-slate-400">Loading Product Specifications...</p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
          <Package className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 text-center">Product Not Found</h2>
        <p className="text-slate-500 text-sm mb-8 text-center max-w-sm">
          The requested product could not be found or may have been updated in our catalog.
        </p>
        <Button onClick={() => navigate('/categories')} className="bg-slate-900 text-white rounded-xl px-8 h-12 font-bold text-xs hover:bg-primary transition-all">
          Browse All Products
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400 mb-4">
          <button onClick={() => navigate('/')} className="hover:text-slate-900 transition-colors">Home</button>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <button onClick={() => navigate('/categories')} className="hover:text-slate-900 transition-colors">Categories</button>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-slate-900 font-semibold truncate max-w-[180px] sm:max-w-none">{product.name}</span>
        </div>
        
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-28">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          
          {/* Layout Left: 3D Interactive Media Stage */}
          <div className="space-y-6">
            <Product3DViewer product={product} selectedMaterial={selectedMaterial} />

            {/* Quality Certifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {[
                { icon: Award, label: 'ISO 9001 Certified', sub: 'Micron Accuracy' },
                { icon: Shield, label: 'Fit Guarantee', sub: '±0.05 mm Tolerance' },
                { icon: RotateCcw, label: '30-Day Testing', sub: 'Satisfaction Guaranteed' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex sm:flex-col items-center sm:text-center gap-3 sm:gap-0">
                  <Icon className="w-4 h-4 text-[#F7931E] shrink-0 sm:mb-2" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 leading-tight block mb-0.5">{label}</span>
                    <span className="text-[11px] text-slate-500 font-medium block">{sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Layout Right: Info & Configurator */}
          <div className="flex flex-col gap-6 sm:gap-8">
            
            {/* Header info */}
            <div>
              <div 
                onClick={() => setActiveTab('reviews')}
                className="inline-flex flex-wrap items-center gap-2 sm:gap-3 mb-3 cursor-pointer group hover:opacity-80 transition-opacity"
                title="View customer reviews"
              >
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">4.9 / 5.0</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-[#F7931E] font-bold group-hover:underline">34 Verified Reviews</span>
              </div>
              
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-[0.96] uppercase mb-4">
                {product.name}
              </h1>

              <p className="font-heading text-slate-500 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                {product.description}
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 p-4 sm:p-5 rounded-[24px] bg-[#FAFAFA] border border-black/10">
                <span className="font-heading text-3xl sm:text-4xl font-black text-black tracking-tight">
                  ${product.price.toFixed(2)}
                </span>
                <span className="font-mono-tech text-[10px] text-slate-500 uppercase tracking-wider">/ UNIT (TAXES & CURE PROTOCOL INCLUDED)</span>
              </div>
            </div>

            {/* Configurator Controls */}
            <div className="space-y-6">
              
              {/* Material Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-mono-tech text-[11px] font-bold text-black uppercase tracking-[0.2em]">
                    /SELECT MATERIAL GRADE
                  </h3>
                  <span className="font-mono-tech text-xs font-bold text-[#F7931E]">{selectedMaterial}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {materials.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMaterial(m.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        selectedMaterial === m.id
                          ? 'bg-black border-black text-white shadow-xs'
                          : 'bg-white border-black/10 text-slate-700 hover:border-black'
                      }`}
                    >
                      <div className="font-heading text-xs font-bold uppercase mb-0.5">{m.name}</div>
                      <div className={`text-[11px] ${selectedMaterial === m.id ? 'text-slate-300' : 'text-slate-400'}`}>
                        {m.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-mono-tech text-[11px] font-bold text-black uppercase tracking-[0.2em]">
                    /BATCH QUANTITY
                  </h3>
                  {discountPercent > 0 && (
                    <span className="font-mono-tech text-[10px] font-bold text-[#F7931E] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                      {discountPercent}% BULK DISCOUNT APPLIED!
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {quantities.map((q) => (
                    <button
                      key={q}
                      onClick={() => setSelectedQty(q)}
                      disabled={product.stock === 0}
                      className={`h-10 min-w-10 px-4 rounded-full border text-xs font-heading font-black uppercase tracking-wider transition-all ${
                        selectedQty === q
                          ? 'bg-black border-black text-white shadow-xs'
                          : 'bg-white border-black/15 text-black hover:border-black'
                      }`}
                    >
                      {q} {q === 1 ? 'UNIT' : 'UNITS'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order summary bar */}
              <div className="flex justify-between items-center py-2 px-1 text-sm font-semibold text-slate-700">
                <span className="font-mono-tech text-xs uppercase tracking-wider text-slate-500">Total Configured:</span>
                <span className="font-heading text-2xl font-black text-black">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>

              {/* Add to Cart CTA */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full h-14 rounded-full font-heading font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-sm flex items-center justify-center gap-3 active:scale-95 ${
                    added
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : product.stock === 0
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-black hover:bg-neutral-800 text-white'
                  }`}
                >
                  {added ? (
                    <><Check className="w-4 h-4" /> ADDED TO ORDER!</>
                  ) : product.stock === 0 ? (
                    'TEMPORARILY OUT OF PRODUCTION'
                  ) : (
                    <><ShoppingCart className="w-4 h-4" /> ADD TO PRODUCTION (${finalTotal.toFixed(2)})</>
                  )}
                </button>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                  <button
                    className="h-11 rounded-full border border-black/10 bg-[#FAFAFA] hover:bg-white text-black font-heading font-bold text-[11px] uppercase tracking-wider transition-all active:scale-95"
                    onClick={() => navigate('/custom-lab')}
                  >
                    CUSTOM CAD QUOTE
                  </button>
                  <button
                    className="h-11 rounded-full border border-black/10 bg-[#FAFAFA] hover:bg-white text-black font-heading font-bold text-[11px] uppercase tracking-wider transition-all active:scale-95"
                    onClick={() => {
                      window.open(
                        `https://wa.me/917999824632?text=${encodeURIComponent(
                          `Hello, I would like to order a custom volume of ${product.name} (${selectedQty} units in ${selectedMaterial}).`
                        )}`,
                        '_blank'
                      );
                    }}
                  >
                    WHATSAPP INQUIRY
                  </button>
                </div>
              </div>
            </div>

            {/* Technical Tabs */}
            <div className="space-y-4 pt-4 border-t border-slate-200/80">
              <div className="flex gap-6 border-b border-slate-200/80">
                {(['details', 'specs', 'shipping', 'reviews'] as TabType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
                      activeTab === tab ? 'text-primary' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {tab === 'reviews' ? 'Reviews (34)' : tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-primary" />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[100px] text-sm text-slate-600 leading-relaxed">
                {activeTab === 'details' && (
                  <p>
                    {product.description}. Manufactured under stringent quality assurance protocols at Saturn 3D. 
                    Each print undergoes ultrasonic cleaning, optical dimensional verification, and thermal annealing where required.
                  </p>
                )}
                {activeTab === 'specs' && (
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">Layer Accuracy</span>
                      <p className="font-bold text-slate-900 mt-0.5">± 0.05 mm</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Tensile Strength</span>
                      <p className="font-bold text-slate-900 mt-0.5">48-65 MPa</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Thermal Deflection</span>
                      <p className="font-bold text-slate-900 mt-0.5">Up to 110°C (ABS / PETG)</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Standard Dispatch</span>
                      <p className="font-bold text-slate-900 mt-0.5">24-48 Hours</p>
                    </div>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs">
                      <Truck className="w-4 h-4" />
                      <span>Express Courier Dispatch</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Free shipping applies to all orders exceeding $50.00. Packaged in electrostatic-protective vacuum sealing with moisture desiccant.
                    </p>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {/* Summary Rating Header */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFAFA] border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="font-heading text-3xl font-black text-black">4.9</span>
                        <div>
                          <div className="flex items-center gap-1 mb-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="font-mono-tech text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                            Based on 34 Verified Industrial Orders
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toast.success('Review verification requested! Our additive QA team will send an evaluation link.')}
                        className="px-4 py-2 rounded-full bg-black hover:bg-[#F7931E] text-white font-heading font-bold text-[11px] uppercase tracking-wider transition-colors active:scale-95"
                      >
                        Submit Review
                      </button>
                    </div>

                    {/* Verified Review Cards */}
                    <div className="space-y-3">
                      {[
                        {
                          name: 'Dr. Vikram Singhania',
                          role: 'VP of Hardware, SkyVolt Avionics',
                          rating: 5,
                          material: 'Carbon-X FDM',
                          time: '3 days ago',
                          comment: 'Mating tolerances matched CAD zero-datum plane perfectly. Passed 15G dynamic bench testing with zero layer separation.',
                        },
                        {
                          name: 'Arjun Mehta',
                          role: 'Director of Prototyping, Hyperion',
                          rating: 5,
                          material: 'Industrial Nylon-CF12',
                          time: '1 week ago',
                          comment: 'Turnaround within 36 hours saved our team critical testing time. Injection-mold like finish without any visible stepping.',
                        },
                        {
                          name: 'Anya Shenoy',
                          role: 'Design Architect, Forma Labs',
                          rating: 5,
                          material: 'High-Res Optical Resin',
                          time: '2 weeks ago',
                          comment: 'Exceptional optical clarity and precision. Saturn 3D remains our benchmark supplier for additive engineering prototypes.',
                        },
                      ].map((rev, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white border border-black/10 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-heading text-xs font-bold text-black block">{rev.name}</span>
                              <span className="font-mono-tech text-[10px] text-slate-400">{rev.role}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(rev.rating)].map((_, sIdx) => (
                                <Star key={sIdx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="font-body text-xs text-slate-600 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
                          <div className="flex items-center justify-between text-[10px] font-mono-tech pt-2 border-t border-black/5">
                            <span className="font-bold text-[#F7931E] uppercase">{rev.material}</span>
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <Shield className="w-3 h-3" /> {rev.time} • Verified
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Related Products Showcase */}
        {related.length > 0 && (
          <div className="mt-24 pt-16 border-t border-slate-200/80">
            <div className="flex flex-col gap-1 mb-10">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Related Hardware</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Recommended for your workflow
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    navigate(`/categories/${p.id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="group bg-white rounded-3xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-50">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/products/vase.jpg';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{p.category}</span>
                    <h3 className="font-bold text-slate-900 text-base tracking-tight group-hover:text-primary transition-colors line-clamp-1 mt-1 mb-2">
                      {p.name}
                    </h3>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                      <span className="font-extrabold text-primary text-lg">${p.price.toFixed(2)}</span>
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 group-hover:text-primary transition-colors">
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <CTA />
    </div>
  );
}
