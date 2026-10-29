import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingBag, Star, Truck, Shield, 
  RotateCcw, Check, Loader2, Package, Award, 
  ChevronRight, ChevronLeft, ChevronDown, Heart, 
  Share2, MessageSquare, Zap, Lock, Eye, Box,
  Maximize2, X, Sparkles, CheckCircle2
} from 'lucide-react';
import { productsApi, type Product } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import CTA from '@/sections/CTA';
import Product3DViewer from '@/components/Product3DViewer';
import ProductCard from '@/components/ProductCard';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Real industrial material options with pricing multipliers
const materials = [
  { 
    id: 'PLA', 
    name: 'PLA Pro Precision', 
    multiplier: 1.0, 
    badge: 'Standard Protocol', 
    desc: 'Precision high-detail polymer, corn-derived, smooth surface finish' 
  },
  { 
    id: 'PETG', 
    name: 'Industrial PETG', 
    multiplier: 1.15, 
    badge: 'Chemical & Moisture Proof', 
    desc: 'High impact resilience, chemical proof, moisture resistant' 
  },
  { 
    id: 'ABS', 
    name: 'ABS High-Impact', 
    multiplier: 1.30, 
    badge: 'Thermal Deflection 98°C', 
    desc: 'Impact-resistant production polymer for functional fixtures' 
  },
  { 
    id: 'CARBON', 
    name: 'Carbon-X PA12-CF', 
    multiplier: 1.55, 
    badge: 'Aerospace Grade Composite', 
    desc: 'Carbon-fiber reinforced nylon, maximum structural tensile strength' 
  },
];

// Verified Customer Reviews data
const reviews = [
  {
    name: 'Dr. Vikram Singhania',
    role: 'VP of Hardware, SkyVolt Avionics',
    rating: 5,
    date: '14 days ago',
    verified: true,
    material: 'Carbon-X PA12',
    comment: 'Mating tolerances matched our CAD zero-datum plane perfectly. Passed 15G dynamic vibration bench testing with zero layer separation. Dispatched to Bengaluru in 36 hours.',
  },
  {
    name: 'Kavita Menon',
    role: 'Product Lead, PulseBio Medical',
    rating: 5,
    date: '3 weeks ago',
    verified: true,
    material: '12K SLA Resin',
    comment: 'The sub-surface definition on the diagnostic housing is immaculate. No post-processing sanding was required. Truly injection-mold equivalent.',
  },
  {
    name: 'Arjun Nambiar',
    role: 'Lead Powertrain Engineer, Team Raftaar',
    rating: 5,
    date: '1 month ago',
    verified: true,
    material: 'ABS-ESD Flame Retardant',
    comment: 'Surpassed 95°C under-hood intake air temperatures without softening or creeping. Quick WhatsApp technical response from their Bhopal facility.',
  },
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Configuration state
  const [selectedMaterial, setSelectedMaterial] = useState<string>('CARBON');
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [mediaMode, setMediaMode] = useState<'3d' | 'photo'>('3d');
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [zoomModalOpen, setZoomModalOpen] = useState<boolean>(false);

  // Accordion state
  const [accordions, setAccordions] = useState({
    description: true,
    shipping: false,
    guarantee: false,
  });

  const toggleAccordion = (key: keyof typeof accordions) => {
    setAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadData() {
      if (!id) return;
      setLoading(true);
      setNotFound(false);

      try {
        const productRes = await productsApi.getById(id);
        const data = productRes.data?.data;
        const currentProd = data?.product;

        if (!currentProd && isMounted) {
          setNotFound(true);
          return;
        }

        if (isMounted && currentProd) {
          setProduct(currentProd);
        }

        const allRes = await productsApi.getAll({ limit: 12 });
        const list = allRes.data?.data?.products || [];

        if (isMounted) {
          setAllProducts(list);
          if (currentProd) {
            const rel = list.filter(
              (p) => p.category === currentProd.category && p.id !== currentProd.id
            );
            setRelated(rel.slice(0, 4));
          }
        }
      } catch (err) {
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const selectedMatObj = useMemo(() => {
    return materials.find((m) => m.id === selectedMaterial) || materials[0];
  }, [selectedMaterial]);

  const basePrice = product?.price || 499;
  const unitPrice = Math.round(basePrice * selectedMatObj.multiplier);
  const subtotalPrice = unitPrice * selectedQty;
  const originalSubtotalPrice = Math.round(subtotalPrice * 1.18);

  // Next / Prev Product Navigation
  const handlePrevProduct = () => {
    if (!allProducts.length || !product) return;
    const currentIndex = allProducts.findIndex((p) => p.id === product.id);
    const prevIndex = (currentIndex - 1 + allProducts.length) % allProducts.length;
    navigate(`/product/${allProducts[prevIndex].id}`);
  };

  const handleNextProduct = () => {
    if (!allProducts.length || !product) return;
    const currentIndex = allProducts.findIndex((p) => p.id === product.id);
    const nextIndex = (currentIndex + 1) % allProducts.length;
    navigate(`/product/${allProducts[nextIndex].id}`);
  };

  // Add to Cart
  const handleAddToCart = () => {
    if (!product) return;

    addItem(
      {
        id: product.id,
        name: product.name,
        price: unitPrice,
        image: product.image,
        category: product.category,
        description: product.description,
        stock: product.stock,
      },
      selectedQty,
      {
        material: selectedMatObj.name,
      }
    );

    toast.success(`${product.name} added to order manifest!`, {
      description: `${selectedQty}x in ${selectedMatObj.name} (₹${subtotalPrice.toLocaleString('en-IN')})`,
      action: {
        label: 'View Cart',
        onClick: () => toggleCart(),
      },
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Blueprint link copied to clipboard!');
  };

  const handleAskQuestion = () => {
    const text = encodeURIComponent(
      `Hello Saturn 3D engineering team, I have a technical inquiry regarding ${product?.name} (Material: ${selectedMatObj.name}, Qty: ${selectedQty} units) on ${window.location.href}.`
    );
    window.open(`https://wa.me/918889988874?text=${text}`, '_blank');
  };

  const toggleWishlist = () => {
    setIsWishlisted((prev) => {
      const next = !prev;
      if (next) toast.success('Added component to project wishlist');
      else toast.info('Removed from project wishlist');
      return next;
    });
  };

  const peopleAlsoNeed = useMemo(() => {
    if (!product) return [];
    const pool = related.length >= 4 
      ? related 
      : allProducts.filter((p) => p.id !== product.id);
    return pool.slice(0, 4);
  }, [related, allProducts, product]);

  const recentlyViewed = useMemo(() => {
    if (!product) return [];
    const pool = allProducts.filter(
      (p) => p.id !== product.id && !peopleAlsoNeed.some((r) => r.id === p.id)
    );
    return (pool.length >= 4 ? pool : allProducts.filter((p) => p.id !== product.id)).slice(0, 4);
  }, [allProducts, product, peopleAlsoNeed]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F6F8] font-body">
        <div className="card-precision p-8 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
          <p className="font-mono text-xs text-[#5B616B] uppercase tracking-wider">
            Loading Engineering Specification...
          </p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F6F8] px-6 font-body">
        <div className="card-precision p-8 max-w-md text-center">
          <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#FF5A1F]">
            <Package className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-semibold text-[#0B0D10] mb-2">
            Component Not Found
          </h2>
          <p className="text-xs text-[#5B616B] mb-6">
            The requested hardware specification could not be located in the current catalog.
          </p>
          <button
            onClick={() => navigate('/categories')}
            className="btn-precision-primary text-xs py-2.5 px-5 w-full"
          >
            Browse Hardware Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#0B0D10] font-body select-none">
      
      {/* 1. Top Breadcrumb & Next/Prev Navigation */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-24 pb-4">
        <div className="flex items-center justify-between py-2 border-b border-black/10 text-xs">
          <nav className="flex items-center gap-1.5 font-mono text-[#5B616B] truncate">
            <Link to="/" className="hover:text-[#0B0D10] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/categories" className="hover:text-[#0B0D10] transition-colors">Catalog</Link>
            <span>/</span>
            <span className="text-[#0B0D10] font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="flex items-center gap-1 shrink-0 ml-4">
            <button
              onClick={handlePrevProduct}
              className="w-7 h-7 rounded-lg border border-black/10 bg-white hover:border-black/30 flex items-center justify-center text-[#0B0D10] cursor-pointer transition-colors"
              title="Previous Component"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextProduct}
              className="w-7 h-7 rounded-lg border border-black/10 bg-white hover:border-black/30 flex items-center justify-center text-[#0B0D10] cursor-pointer transition-colors"
              title="Next Component"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Product Showcase Split */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: 3D Stage / Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Stage */}
            <div className="card-precision overflow-hidden min-h-[380px] sm:min-h-[460px] flex items-center justify-center relative bg-white">
              <div className="w-full h-[400px] sm:h-[480px] relative">
                {mediaMode === '3d' ? (
                  <Product3DViewer product={product} selectedMaterial={selectedMaterial} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-6 bg-neutral-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-[380px] max-w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/products/vase.jpg';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Media Selector Strip */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMediaMode('3d')}
                className={`px-3 py-2 rounded-xl border text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  mediaMode === '3d'
                    ? 'border-[#FF5A1F] bg-[#FF5A1F]/10 text-[#FF5A1F]'
                    : 'border-black/10 bg-white text-[#5B616B] hover:text-[#0B0D10]'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Interactive</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaMode('photo')}
                className={`px-3 py-2 rounded-xl border text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  mediaMode === 'photo'
                    ? 'border-[#FF5A1F] bg-[#FF5A1F]/10 text-[#FF5A1F]'
                    : 'border-black/10 bg-white text-[#5B616B] hover:text-[#0B0D10]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Photo Blueprint</span>
              </button>
            </div>

            {/* Quality Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
              <div className="card-precision p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block leading-tight">ISO Standard</span>
                  <span className="text-[10px] text-[#5B616B] block">Pending Audit Protocols</span>
                </div>
              </div>
              <div className="card-precision p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 text-[#0B0D10] flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block leading-tight">±0.04 mm Tol</span>
                  <span className="text-[10px] text-[#5B616B] block">Optical CMM Verified</span>
                </div>
              </div>
              <div className="card-precision p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block leading-tight">Fit Guarantee</span>
                  <span className="text-[10px] text-[#5B616B] block">100% Replacement QA</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Parameters & Purchase (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div>
              <div className="precision-badge text-[10px] mb-2">
                Production Part &bull; 24-48h Dispatch
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#0B0D10] leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-[#5B616B] mt-1.5 leading-relaxed">
                Industrial additive manufacturing part fabricated for mission-critical mechanical assemblies.
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 pb-3 border-b border-black/10 text-xs">
              <div className="flex text-[#FF5A1F]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-semibold text-[#0B0D10]">4.9</span>
              <span className="text-[#5B616B]">(34 verified customer benchmarks)</span>
            </div>

            {/* Price Block */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-display font-semibold text-[#FF5A1F]">
                ₹{subtotalPrice.toLocaleString('en-IN')}.00
              </span>
              <span className="text-sm font-mono text-[#5B616B] line-through">
                ₹{originalSubtotalPrice.toLocaleString('en-IN')}.00
              </span>
              <span className="precision-badge-orange text-[10px]">
                Save 18%
              </span>
            </div>

            {/* Delivery Banner */}
            <div className="p-3.5 rounded-xl bg-white border border-black/10 flex items-center gap-2.5 text-xs">
              <Truck className="w-4 h-4 text-[#FF5A1F] shrink-0" />
              <div>
                <span className="font-medium text-[#0B0D10]">Complimentary Air Express above ₹1,499</span>
                <span className="block text-[11px] text-[#5B616B]">Dispatch within 24–48 hours from Bhopal hub</span>
              </div>
            </div>

            {/* Material Grade Selector */}
            <div className="space-y-2">
              <label className="font-mono text-xs text-[#5B616B] uppercase tracking-wider block">
                Select Polymer Specification:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {materials.map((m) => {
                  const isSelected = selectedMaterial === m.id;
                  const matPrice = Math.round(basePrice * m.multiplier);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMaterial(m.id)}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF5A1F] bg-[#FF5A1F]/5 text-[#0B0D10]'
                          : 'border-black/10 bg-white text-[#5B616B] hover:border-black/25'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#0B0D10]">{m.name}</span>
                        <span className="text-[#FF5A1F] font-mono">₹{matPrice}</span>
                      </div>
                      <span className="text-[10px] text-[#5B616B] block mt-0.5 truncate">
                        {m.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper & Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-black/10 bg-white rounded-xl h-11 px-1">
                <button
                  type="button"
                  onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                  className="w-8 h-8 flex items-center justify-center text-sm font-semibold hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-mono text-xs font-semibold">
                  {selectedQty}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedQty(selectedQty + 1)}
                  className="w-8 h-8 flex items-center justify-center text-sm font-semibold hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 h-11 btn-precision-primary text-xs font-semibold flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={toggleWishlist}
                className={`w-11 h-11 border border-black/10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                  isWishlisted ? 'bg-red-50 text-red-600' : 'bg-white hover:border-black/30'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600 text-red-600' : 'text-[#5B616B]'}`} />
              </button>
            </div>

            {/* WhatsApp Technical Consultation */}
            <button
              type="button"
              onClick={handleAskQuestion}
              className="w-full btn-whatsapp-precision py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Technical Review on WhatsApp</span>
            </button>

            {/* Collapsible Accordions */}
            <div className="border-t border-black/10 divide-y divide-black/5 text-xs">
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('description')}
                  className="w-full flex items-center justify-between text-xs font-semibold text-[#0B0D10] py-1 cursor-pointer"
                >
                  <span>Description & Application</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${accordions.description ? 'rotate-180 text-[#FF5A1F]' : 'text-[#5B616B]'}`} />
                </button>
                {accordions.description && (
                  <div className="pt-2 text-xs text-[#5B616B] leading-relaxed space-y-1">
                    <p>{product.description}</p>
                    <p>&bull; 100% ultrasonic wash and optical CMM check before air dispatch.</p>
                  </div>
                )}
              </div>

              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-xs font-semibold text-[#0B0D10] py-1 cursor-pointer"
                >
                  <span>Shipping & Packaging Protocol</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${accordions.shipping ? 'rotate-180 text-[#FF5A1F]' : 'text-[#5B616B]'}`} />
                </button>
                {accordions.shipping && (
                  <div className="pt-2 text-xs text-[#5B616B] leading-relaxed space-y-1">
                    <p>&bull; 24–48 hour turnaround across tier-1 manufacturing hubs.</p>
                    <p>&bull; Electrostatic vacuum-sealed in moisture barrier packaging.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3. Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 mt-16 pt-12 border-t border-black/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="type-mono-eyebrow text-[#5B616B]">Quality Verification</span>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#0B0D10] mt-1">
              Verified Benchmark Reviews
            </h2>
          </div>
          <div className="precision-badge text-xs">
            4.9 / 5.0 Rating &bull; 100% Recommendation
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <div key={i} className="card-precision p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#FF5A1F]">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-[#5B616B]">{rev.date}</span>
                </div>
                <p className="text-xs text-[#5B616B] leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-black/5 mt-4">
                <div className="font-semibold text-xs text-[#0B0D10]">{rev.name}</div>
                <div className="text-[11px] text-[#5B616B]">{rev.role}</div>
                <span className="precision-badge text-[9px] mt-2">
                  {rev.material}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CTA */}
      <div className="mt-16">
        <CTA />
      </div>
    </div>
  );
}
