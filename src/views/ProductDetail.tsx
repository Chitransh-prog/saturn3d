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
    name: 'PLA Pro Eco', 
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
    name: 'ABS-ESD Flame Retardant', 
    multiplier: 1.30, 
    badge: 'High Heat / Electronics', 
    desc: 'Thermal resistance up to 98°C, flame retardant, impact proof' 
  },
  { 
    id: 'CARBON', 
    name: 'Carbon-X PA12', 
    multiplier: 1.55, 
    badge: 'Aerospace Grade Rigid', 
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
    name: 'Arjun Mehta',
    role: 'Director of Prototyping, Hyperion Motors',
    rating: 5,
    date: '1 month ago',
    verified: true,
    material: 'Industrial PETG',
    comment: 'Turnaround within 36 hours saved our engineering sprints critical bench testing time. Clean ultrasonic surface finish without any visible stepping.',
  },
  {
    name: 'Priya Sharma',
    role: 'Robotics Lead, Aerotech India',
    rating: 5,
    date: '2 months ago',
    verified: true,
    material: 'ABS-ESD Flame Retardant',
    comment: 'Thermal dissipation and electronic housing tolerances fit standard heat-set M3 inserts flawlessly. Quality rivaling high-end German industrial print farms.',
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

  // User configuration states
  const [selectedMaterial, setSelectedMaterial] = useState<string>('PLA');
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [mediaMode, setMediaMode] = useState<'3d' | 'photo'>('3d');
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [zoomModalOpen, setZoomModalOpen] = useState<boolean>(false);

  // Accordion drawer states
  const [accordions, setAccordions] = useState({
    description: true,
    shipping: false,
    guarantee: false,
  });

  const toggleAccordion = (key: 'description' | 'shipping' | 'guarantee') => {
    setAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Fetch full product catalog for Next/Prev and related rows
  useEffect(() => {
    productsApi
      .getAll({ limit: 40 })
      .then((res) => {
        if (res.data?.data?.products) {
          setAllProducts(res.data.data.products);
        }
      })
      .catch(() => console.warn('Could not load catalog list'));
  }, []);

  // Fetch active product
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);

    productsApi
      .getById(id)
      .then((res) => {
        if (res.data.success && res.data.data?.product) {
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

    // Scroll back to top on product change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Pricing calculations
  const selectedMatObj = useMemo(
    () => materials.find((m) => m.id === selectedMaterial) || materials[0],
    [selectedMaterial]
  );

  const basePrice = product?.price || 1499;
  const unitPrice = Math.round(basePrice * selectedMatObj.multiplier);
  const originalUnitPrice = Math.round(unitPrice * 1.25); // 20% MSRP comparison
  const subtotalPrice = unitPrice * selectedQty;
  const originalSubtotalPrice = originalUnitPrice * selectedQty;

  // Next / Previous Navigation
  const handlePrevProduct = () => {
    if (allProducts.length === 0 || !product) return;
    const idx = allProducts.findIndex((p) => p.id === product.id);
    const prevIdx = (idx - 1 + allProducts.length) % allProducts.length;
    navigate(`/categories/${allProducts[prevIdx].id}`);
  };

  const handleNextProduct = () => {
    if (allProducts.length === 0 || !product) return;
    const idx = allProducts.findIndex((p) => p.id === product.id);
    const nextIdx = (idx + 1) % allProducts.length;
    navigate(`/categories/${allProducts[nextIdx].id}`);
  };

  // Add to Cart handler
  const handleAddToCart = () => {
    if (!product) return;

    addItem(
      {
        id: product.id,
        name: `${product.name} (${selectedMatObj.name})`,
        description: product.description,
        price: unitPrice,
        image: product.image,
        category: product.category,
        stock: product.stock,
      },
      selectedQty,
      {
        material: selectedMatObj.name,
        grade: selectedMatObj.badge,
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

  // Share Blueprint handler
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Blueprint link copied to clipboard!');
  };

  // Ask Engineer on WhatsApp
  const handleAskQuestion = () => {
    const text = encodeURIComponent(
      `Hello Saturn 3D engineering team, I have a technical inquiry regarding ${product?.name} (Material: ${selectedMatObj.name}, Qty: ${selectedQty} units) on ${window.location.href}.`
    );
    window.open(`https://wa.me/917999824632?text=${text}`, '_blank');
  };

  // Wishlist toggle
  const toggleWishlist = () => {
    setIsWishlisted((prev) => {
      const next = !prev;
      if (next) {
        toast.success('Added component to project wishlist');
      } else {
        toast.info('Removed from project wishlist');
      }
      return next;
    });
  };

  // Distinct items for "People Also Need" and "Recently Viewed"
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
      <div className="min-h-screen flex items-center justify-center bg-[#FFF4E0] pattern-blueprint">
        <div className="card-slab bg-white border-3 border-ink shadow-brutal p-8 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
          <p className="font-mono text-xs font-black text-ink uppercase tracking-wider">
            Loading Engineering Blueprint...
          </p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF4E0] pattern-blueprint px-6">
        <div className="card-slab bg-white border-4 border-ink shadow-brutal-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-[#FF5A1F] border-3 border-ink flex items-center justify-center mx-auto mb-6 shadow-brutal-sm">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-2xl font-black text-ink uppercase tracking-tight mb-2">
            COMPONENT NOT FOUND
          </h2>
          <p className="font-mono text-xs font-bold text-ink/70 mb-6">
            The requested industrial part could not be found or may have been retired from our active catalog.
          </p>
          <button
            onClick={() => navigate('/categories')}
            className="btn-brutal bg-ink text-white hover:bg-[#FF5A1F] px-6 py-3 font-mono text-xs font-black uppercase tracking-wider border-2 border-ink shadow-brutal-sm w-full cursor-pointer"
          >
            BROWSE HARDWARE CATALOG
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF4E0] pattern-blueprint text-ink selection:bg-[#FFE14D]">
      
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 1. TOP BREADCRUMB & PREV/NEXT PRODUCT ROW (MATCHING MR. MAWAA)             */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-20 sm:pt-24 pb-4">
        <div className="flex items-center justify-between py-2 border-b-2 border-ink/15">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs font-bold text-ink/60 uppercase truncate">
            <Link to="/" className="hover:text-[#FF5A1F] transition-colors">
              HOME
            </Link>
            <span>/</span>
            <Link to="/categories" className="hover:text-[#FF5A1F] transition-colors">
              HARDWARE
            </Link>
            <span>/</span>
            <span className="text-ink font-black truncate max-w-[140px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>

          {/* Next / Previous Product Switchers */}
          <div className="flex items-center gap-1 shrink-0 ml-4">
            <button
              onClick={handlePrevProduct}
              className="w-8 h-8 rounded-xs border-2 border-ink bg-white hover:bg-[#FFE14D] shadow-xs flex items-center justify-center transition-all cursor-pointer"
              title="Previous Component"
            >
              <ChevronLeft className="w-4 h-4 text-ink stroke-[2.5]" />
            </button>
            <button
              onClick={handleNextProduct}
              className="w-8 h-8 rounded-xs border-2 border-ink bg-white hover:bg-[#FFE14D] shadow-xs flex items-center justify-center transition-all cursor-pointer"
              title="Next Component"
            >
              <ChevronRight className="w-4 h-4 text-ink stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 2. MAIN PRODUCT HERO SHOWCASE (EDITORIAL 2-COLUMN SPLIT)                   */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* ════════════════════════════════════════════════════════════════════════ */}
          {/* LEFT COLUMN: MEDIA GALLERY & 3D INTERACTIVE STAGE (7 COLS)              */}
          {/* ════════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col gap-4">

            {/* Main Stage Card Container */}
            <div className="relative card-slab bg-white border-3 border-ink shadow-brutal overflow-hidden min-h-[380px] sm:min-h-[480px] flex items-center justify-center rounded-xs">
              <div className="w-full h-[400px] sm:h-[500px] relative">
                {mediaMode === '3d' ? (
                  <Product3DViewer product={product} selectedMaterial={selectedMaterial} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-6 bg-[#FAFAFA]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-[420px] max-w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/products/vase.jpg';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Selectors Strip */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMediaMode('3d')}
                className={`w-16 h-16 rounded-xs border-2 border-ink bg-[#FFF4E0] flex flex-col items-center justify-center gap-1 font-mono text-[9px] font-black transition-all cursor-pointer ${
                  mediaMode === '3d'
                    ? 'ring-2 ring-[#FF5A1F] shadow-brutal-sm bg-[#FFE14D]'
                    : 'hover:bg-white'
                }`}
              >
                <Box className="w-5 h-5 text-ink stroke-[2.5]" />
                <span>3D MODEL</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaMode('photo')}
                className={`w-16 h-16 rounded-xs border-2 border-ink bg-white overflow-hidden transition-all cursor-pointer p-1 ${
                  mediaMode === 'photo'
                    ? 'ring-2 ring-[#FF5A1F] shadow-brutal-sm'
                    : 'hover:opacity-85'
                }`}
              >
                <img
                  src={product.image}
                  alt="Thumbnail"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/products/vase.jpg';
                  }}
                />
              </button>
            </div>

            {/* Quality Certification Badges Strip (3 Slabs) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white border-2 border-ink shadow-brutal-sm p-3.5 flex items-center gap-3 rounded-xs">
                <div className="w-8 h-8 rounded-xs bg-[#FF5A1F] border-2 border-ink text-white flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <span className="font-mono text-xs font-black block leading-tight">ISO 9001:2015</span>
                  <span className="font-mono text-[10px] text-ink/70 font-bold block">Certified Production</span>
                </div>
              </div>
              <div className="bg-white border-2 border-ink shadow-brutal-sm p-3.5 flex items-center gap-3 rounded-xs">
                <div className="w-8 h-8 rounded-xs bg-[#FFE14D] border-2 border-ink text-ink flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <span className="font-mono text-xs font-black block leading-tight">±0.04 MM TOL</span>
                  <span className="font-mono text-[10px] text-ink/70 font-bold block">Optical CMM Verified</span>
                </div>
              </div>
              <div className="bg-white border-2 border-ink shadow-brutal-sm p-3.5 flex items-center gap-3 rounded-xs">
                <div className="w-8 h-8 rounded-xs bg-[#7CF2C1] border-2 border-ink text-ink flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <span className="font-mono text-xs font-black block leading-tight">DATUM FIT</span>
                  <span className="font-mono text-[10px] text-ink/70 font-bold block">100% Replacement QA</span>
                </div>
              </div>
            </div>

          </div>

          {/* ════════════════════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN: PRODUCT DETAILS & PURCHASE MANIFEST FORM (5 COLS)         */}
          {/* ════════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* 1. Status Eyebrow & Category */}
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#0B0B0B] text-white border-2 border-ink shadow-xs text-[10px] font-mono font-black uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
                <span>INDUSTRIAL SPEC PROTOCOL &bull; RAPID DISPATCH</span>
              </div>

              {/* Product Headline */}
              <h1 className="font-display font-black text-3xl sm:text-4xl text-ink uppercase tracking-tight leading-[0.95] mb-2">
                {product.name}
              </h1>

              {/* Application Subtitle */}
              <p className="font-mono text-xs sm:text-sm text-ink/75 font-bold leading-relaxed">
                Industrial-grade additive manufacturing component fabricated for mission-critical mechanical assemblies.
              </p>
            </div>

            {/* 2. Rating & Verified Social Proof */}
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b-2 border-ink/15">
              <div className="flex items-center gap-1 text-[#FF5A1F]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-[#FF5A1F] text-[#FF5A1F]" />
                ))}
              </div>
              <span className="font-mono text-xs font-black text-ink">4.9 / 5.0</span>
              <span className="text-ink/40 font-bold">&bull;</span>
              <span className="font-mono text-xs font-black text-ink/70">
                (34 VERIFIED REVIEWS)
              </span>
              <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] font-black text-emerald-700 bg-[#7CF2C1]/40 border border-emerald-600/40 px-2 py-0.5 rounded-xs">
                <CheckCircle2 className="w-3 h-3" />
                ZERO DEFECT GUARANTEE
              </span>
            </div>

            {/* 3. Pricing Block & Promo Discount Sticker */}
            <div className="flex items-baseline gap-3">
              <span className="font-display font-black text-3xl sm:text-4xl text-[#FF5A1F] tracking-tight">
                ₹{subtotalPrice.toLocaleString('en-IN')}.00
              </span>
              <span className="font-mono text-sm text-ink/50 line-through font-bold">
                ₹{originalSubtotalPrice.toLocaleString('en-IN')}.00
              </span>
              <span className="badge-sticker bg-[#FFE14D] text-[#0B0B0B] text-[11px] font-black shadow-xs">
                SAVE 16% TODAY
              </span>
            </div>

            {/* 4. Special High-Vis Delivery Offer Banner (Mr. Mawaa Yellow Banner) */}
            <div className="bg-[#FFE14D] border-2 border-ink shadow-brutal-sm p-3.5 rounded-xs flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-ink shrink-0 stroke-[2.5]" />
              <div className="font-mono text-xs font-black text-ink leading-tight">
                <span>FREE PAN-INDIA AIR COURIER ON ORDERS ABOVE ₹1,499</span>
                <span className="block text-[10px] font-bold text-ink/80 mt-0.5">
                  Standard dispatch within 24–48 hours from Bhopal Central Facility
                </span>
              </div>
            </div>

            {/* 5. Ask an Engineer & Share Blueprint Links */}
            <div className="flex items-center justify-between py-1 font-mono text-xs font-black border-b-2 border-ink/15 text-ink">
              <button
                type="button"
                onClick={handleAskQuestion}
                className="flex items-center gap-1.5 hover:text-[#FF5A1F] transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]" />
                <span>ASK AN ENGINEER (WHATSAPP)</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-[#FF5A1F] transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>SHARE BLUEPRINT</span>
              </button>
            </div>

            {/* 6. Material Grade Selector Pills (Mr. Mawaa Style) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between font-mono text-xs font-black uppercase tracking-wider">
                <span>SELECT MATERIAL GRADE:</span>
                <span className="text-[#FF5A1F] bg-[#FFF4E0] border border-ink px-1.5 py-0.5 text-[10px]">
                  {selectedMatObj.badge}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {materials.map((m) => {
                  const isSelected = selectedMaterial === m.id;
                  const matPrice = Math.round(basePrice * m.multiplier);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMaterial(m.id)}
                      className={`p-3 text-left border-2 rounded-xs transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#0B0B0B] text-white border-ink shadow-brutal-sm'
                          : 'bg-white text-ink border-ink/40 hover:border-ink hover:bg-[#FFF4E0]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-xs font-black uppercase">
                          {m.name}
                        </span>
                        <span
                          className={`font-mono text-xs font-black ${
                            isSelected ? 'text-[#FFE14D]' : 'text-[#FF5A1F]'
                          }`}
                        >
                          ₹{matPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span
                        className={`font-mono text-[10px] mt-1 line-clamp-1 ${
                          isSelected ? 'text-white/80' : 'text-ink/65 font-bold'
                        }`}
                      >
                        {m.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 7. Quantity Stepper + Add to Manifest + Wishlist (Mr. Mawaa Action Cluster) */}
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border-3 border-ink bg-white shadow-brutal-sm rounded-xs">
                <button
                  type="button"
                  onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                  className="w-10 h-12 flex items-center justify-center hover:bg-[#FFE14D] font-mono text-base font-black transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  &minus;
                </button>
                <span className="w-11 text-center font-mono font-black text-sm">
                  {selectedQty}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedQty(selectedQty + 1)}
                  className="w-10 h-12 flex items-center justify-center hover:bg-[#FFE14D] font-mono text-base font-black transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  &#43;
                </button>
              </div>

              {/* Primary Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 h-12 btn-brutal btn-brutal-orange text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-brutal cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span>ADD TO ORDER MANIFEST</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={toggleWishlist}
                className={`w-12 h-12 border-3 border-ink shadow-brutal-sm flex items-center justify-center rounded-xs transition-all cursor-pointer ${
                  isWishlisted
                    ? 'bg-red-50 text-red-600'
                    : 'bg-white hover:bg-[#FFE14D] text-ink'
                }`}
                title="Save Blueprint to Wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? 'fill-red-600 text-red-600' : ''
                  }`}
                />
              </button>
            </div>

            {/* 8. Secondary Full-Width Instant Express Button */}
            <button
              type="button"
              onClick={() => {
                handleAddToCart();
                navigate('/checkout');
              }}
              className="w-full py-3.5 px-4 bg-[#FFE14D] hover:bg-[#FFE873] active:bg-[#FFE14D] text-[#0B0B0B] border-3 border-ink shadow-brutal font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current text-ink" />
              <span>INSTANT BUY NOW WITH UPI &amp; CARDS ⚡</span>
            </button>

            {/* 9. Availability & Meta Info List */}
            <div className="font-mono text-xs space-y-1.5 py-1 text-ink/80 font-bold border-b-2 border-ink/15 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-ink">Availability:</span>
                <span className="text-emerald-700 font-black">
                  In Stock &bull; 24-48h Dispatch
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-ink">Tolerance:</span>
                <span className="font-black">±0.04 mm Optical CMM Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-ink">Sector:</span>
                <span className="font-black">{product.category}</span>
              </div>
            </div>

            {/* 10. Guaranteed Safe Checkout Badges (Mr. Mawaa Style) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] font-black text-ink uppercase">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  GUARANTEED SAFE CHECKOUT
                </span>
                <span className="text-emerald-700">256-BIT ENCRYPTED</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {['UPI / QR', 'VISA', 'MASTERCARD', 'RUPAY', 'NET BANKING'].map((method) => (
                  <span
                    key={method}
                    className="px-2.5 py-1 bg-white border border-ink/40 font-mono text-[10px] font-black text-ink tracking-wider rounded-xs shadow-xs"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* 11. Collapsible Technical Accordions (Mr. Mawaa Style) */}
            <div className="border-t-3 border-ink divide-y-2 divide-ink/20 pt-2 font-mono text-xs">
              
              {/* Description Accordion */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('description')}
                  className="w-full flex items-center justify-between font-mono text-xs font-black uppercase tracking-wider text-ink py-1 text-left cursor-pointer"
                >
                  <span>DESCRIPTION &amp; APPLICATION</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      accordions.description ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {accordions.description && (
                  <div className="pt-3 space-y-2 text-ink/80 leading-relaxed font-bold animate-in fade-in duration-200 text-[11px]">
                    <p>{product.description}</p>
                    <ul className="list-disc list-inside space-y-1 pt-1">
                      <li>
                        Manufactured under strict ISO 9001 additive production tolerances at Saturn 3D Hub, Bhopal.
                      </li>
                      <li>
                        Optimized for thermal stability, anti-warping infill geometries, and precision assembly mating.
                      </li>
                      <li>
                        Compatible with standard threaded heat-set inserts (M3, M4, M5) for structural enclosures.
                      </li>
                      <li>
                        100% ultrasonic wash and optical inspection before dispatch.
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Shipping & Delivery Accordion */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between font-mono text-xs font-black uppercase tracking-wider text-ink py-1 text-left cursor-pointer"
                >
                  <span>SHIPPING &amp; DISPATCH TIMELINE</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      accordions.shipping ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {accordions.shipping && (
                  <div className="pt-3 space-y-2 text-ink/80 leading-relaxed font-bold animate-in fade-in duration-200 text-[11px]">
                    <p>
                      &bull; <strong>Pan-India Air Express:</strong> 24–48 hour turnaround across Delhi NCR, Bengaluru, Mumbai, Pune, Hyderabad, and Chennai.
                    </p>
                    <p>
                      &bull; <strong>Surface Logistics:</strong> 3–5 working days for industrial manufacturing corridors across all states.
                    </p>
                    <p>
                      &bull; <strong>Free Air Courier:</strong> Automatically unlocked on purchase orders exceeding ₹1,499.
                    </p>
                    <p>
                      &bull; <strong>Protective Packaging:</strong> Electrostatic vacuum-sealed with moisture desiccant to prevent ambient humidity absorption.
                    </p>
                  </div>
                )}
              </div>

              {/* Quality Guarantee Accordion */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('guarantee')}
                  className="w-full flex items-center justify-between font-mono text-xs font-black uppercase tracking-wider text-ink py-1 text-left cursor-pointer"
                >
                  <span>STORAGE &amp; QA QUALITY GUARANTEE</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      accordions.guarantee ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {accordions.guarantee && (
                  <div className="pt-3 space-y-2 text-ink/80 leading-relaxed font-bold animate-in fade-in duration-200 text-[11px]">
                    <p>
                      &bull; <strong>Zero-Datum Fit Guarantee:</strong> If the fabricated part deviates beyond the specified CAD tolerance, we re-slice, re-print, and air-ship a replacement within 24 hours at zero cost.
                    </p>
                    <p>
                      &bull; <strong>Storage Conditions:</strong> Store in a cool, dry environment away from direct UV exposure (temperature range: -10°C to 45°C).
                    </p>
                    <p>
                      &bull; <strong>Thermal Deflection:</strong> PETG up to 75°C, ABS up to 98°C, and Carbon-X up to 135°C under continuous mechanical load.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 3. CUSTOMER REVIEWS SECTION (MATCHING MR. MAWAA REVIEWS)                   */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-20 pt-16 border-t-3 border-ink">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-black text-ink uppercase tracking-tight mb-2">
            CUSTOMER REVIEWS
          </h2>
          <p className="font-mono text-xs font-bold text-ink/70 uppercase">
            Authentic benchmark feedback from hardware engineers, robotics developers, and aerospace leads.
          </p>
        </div>

        {/* Overall Rating Slab */}
        <div className="card-slab bg-[#FFF4E0] border-3 border-ink shadow-brutal p-6 sm:p-8 max-w-2xl mx-auto mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xs">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="font-display font-black text-5xl sm:text-6xl text-ink leading-none">
              4.9
            </div>
            <div>
              <div className="flex text-[#FF5A1F] text-lg mb-1">
                {'★★★★★'}
              </div>
              <p className="font-mono text-xs font-black text-ink uppercase">
                BASED ON 34 VERIFIED BENCHMARKS
              </p>
              <p className="font-mono text-[10px] text-ink/60 font-bold uppercase">
                100% RECOMMENDATION RATE &bull; VERIFIED PURCHASES
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast.info('Review submission form will open shortly')}
            className="btn-brutal bg-white hover:bg-[#FFE14D] text-ink font-mono text-xs font-black px-6 py-3 border-2 border-ink shadow-brutal-sm cursor-pointer whitespace-nowrap"
          >
            WRITE A REVIEW
          </button>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="card-slab bg-white border-2 border-ink shadow-brutal-sm p-5 flex flex-col justify-between rounded-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#FF5A1F] text-sm">{'★★★★★'}</span>
                  <span className="font-mono text-[10px] font-bold text-ink/60">
                    {rev.date}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-3 font-mono text-[11px] font-black text-emerald-700">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>VERIFIED HARDWARE ENGINEER</span>
                </div>
                <p className="font-mono text-xs text-ink/80 leading-relaxed font-bold mb-4">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-ink/20 font-mono text-xs">
                <div className="font-black text-ink">{rev.name}</div>
                <div className="text-[10px] text-ink/70 font-medium">{rev.role}</div>
                <div className="inline-block mt-2 px-2 py-0.5 bg-[#FFF4E0] border border-ink text-[10px] font-bold text-[#FF5A1F]">
                  {rev.material}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 4. "PEOPLE ALSO NEED" (4-COLUMN PRODUCT GRID MATCHING MR. MAWAA)           */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {peopleAlsoNeed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-24 pt-16 border-t-3 border-ink">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-black text-ink uppercase tracking-tight mb-2">
              PEOPLE ALSO NEED
            </h2>
            <p className="font-mono text-xs font-bold text-ink/70 uppercase">
              Authentic engineered components manufactured for high-stress applications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {peopleAlsoNeed.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 5. "RECENTLY VIEWED" (4-COLUMN PRODUCT GRID MATCHING MR. MAWAA)            */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-20 pt-16 border-t-3 border-ink">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-ink uppercase tracking-tight mb-2">
              RECENTLY VIEWED
            </h2>
            <p className="font-mono text-xs font-bold text-ink/70 uppercase">
              Explore recently inspected prototypes and precision hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 6. SATURN 3D FOOTER CALL-TO-ACTION                                         */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <div className="mt-20">
        <CTA />
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 7. FULLSCREEN MEDIA ZOOM MODAL                                             */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <Dialog open={zoomModalOpen} onOpenChange={setZoomModalOpen}>
        <DialogContent className="max-w-[94vw] lg:max-w-5xl h-[85vh] bg-[#FFF4E0] border-4 border-ink shadow-brutal-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#FF5A1F]" />
              <h3 className="font-display font-black text-lg text-ink uppercase tracking-tight">
                {product.name} &bull; HIGH-PRECISION INSPECTION
              </h3>
            </div>
            <button
              onClick={() => setZoomModalOpen(false)}
              className="w-8 h-8 rounded-xs border-2 border-ink bg-white hover:bg-[#FFE14D] flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          <div className="flex-1 w-full h-full min-h-[300px] flex items-center justify-center p-4 overflow-hidden">
            {mediaMode === '3d' ? (
              <div className="w-full h-full">
                <Product3DViewer product={product} selectedMaterial={selectedMaterial} />
              </div>
            ) : (
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[60vh] max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/products/vase.jpg';
                }}
              />
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t-2 border-ink font-mono text-xs font-bold text-ink">
            <span>MATERIAL: {selectedMatObj.name} ({selectedMatObj.badge})</span>
            <span className="text-[#FF5A1F] font-black">
              PRICE: ₹{subtotalPrice.toLocaleString('en-IN')}.00
            </span>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
