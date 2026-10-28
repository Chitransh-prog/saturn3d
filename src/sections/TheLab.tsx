import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Heart, Eye, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';
import { Dialog, DialogContent } from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

interface LabServiceItem {
  id: string;
  name: string;
  category: 'FDM' | 'SLA Resin' | 'Carbon-X';
  oneLiner: string;
  basePrice: number;
  originalPrice: number;
  priceLabel: string;
  image: string;
  route: string;
  rating: number;
  reviews: number;
  tag: string;
}

const labServices: LabServiceItem[] = [
  {
    id: 'fdm-prototyping',
    name: 'Industrial FDM Prototyping',
    category: 'FDM',
    oneLiner: 'Tough PLA, PETG & ABS enclosures and functional jig assemblies.',
    basePrice: 299,
    originalPrice: 380,
    priceLabel: '₹299',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    route: '/custom-lab',
    rating: 5.0,
    reviews: 96,
    tag: 'New',
  },
  {
    id: 'sla-resin',
    name: '12K High-Detail SLA Resin',
    category: 'SLA Resin',
    oneLiner: 'Micro-precision dental, jewellery, and smooth cosmetic prototypes.',
    basePrice: 499,
    originalPrice: 620,
    priceLabel: '₹499',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    route: '/custom-lab',
    rating: 5.0,
    reviews: 114,
    tag: 'Hot',
  },
  {
    id: 'carbon-x',
    name: 'Carbon-X Structural Composites',
    category: 'Carbon-X',
    oneLiner: 'PA12 chopped carbon-fiber parts matching aluminum tensile strength.',
    basePrice: 1299,
    originalPrice: 1599,
    priceLabel: '₹1,299',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    route: '/custom-lab',
    rating: 4.9,
    reviews: 82,
    tag: 'Popular',
  },
  {
    id: 'fdm-batch',
    name: 'Short-Run FDM Production',
    category: 'FDM',
    oneLiner: 'Repeated batches of 10 to 500+ end-use parts with CMM verification.',
    basePrice: 1999,
    originalPrice: 2499,
    priceLabel: '₹1,999',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    route: '/custom-lab',
    rating: 5.0,
    reviews: 64,
    tag: 'Batch',
  },
  {
    id: 'sla-tough',
    name: 'SLA Impact & Tough Resins',
    category: 'SLA Resin',
    oneLiner: 'ABS-like snap-fit housings and engineering test enclosures.',
    basePrice: 699,
    originalPrice: 899,
    priceLabel: '₹699',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
    route: '/custom-lab',
    rating: 4.9,
    reviews: 73,
    tag: 'Tough',
  },
  {
    id: 'carbon-drone',
    name: 'Aerospace & Drone Airframes',
    category: 'Carbon-X',
    oneLiner: 'Ultra-lightweight high-stiffness avionics motor mounts and arms.',
    basePrice: 1499,
    originalPrice: 1899,
    priceLabel: '₹1,499',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    route: '/custom-lab',
    rating: 5.0,
    reviews: 91,
    tag: 'Aero',
  },
];

export default function TheLab() {
  const [activeTab, setActiveTab] = useState<'All' | 'FDM' | 'SLA Resin' | 'Carbon-X'>('All');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, 'single' | 'batch'>>({});
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [previewItem, setPreviewItem] = useState<LabServiceItem | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const ghostTextRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  // GSAP Text Reveal & Ghost 3D Parallax
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Line-by-line H2 text reveal
      gsap.fromTo(
        '.the-lab-h2-line',
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );

      // Product cards staggered entrance on scroll
      gsap.fromTo(
        '.lab-product-card',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#the-lab',
            start: 'top 65%',
          },
        }
      );

      // Ghost "3D" lettering parallax
      if (ghostTextRef.current) {
        gsap.to(ghostTextRef.current, {
          yPercent: -25,
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

  const filteredItems = activeTab === 'All' 
    ? labServices 
    : labServices.filter((s) => s.category === activeTab);

  const toggleVariant = (itemId: string, variant: 'single' | 'batch', e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVariants((prev) => ({ ...prev, [itemId]: variant }));
  };

  const toggleWishlist = (itemId: string, itemName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => {
      const next = !prev[itemId];
      if (next) toast.success(`Saved ${itemName} to wishlist`);
      return { ...prev, [itemId]: next };
    });
  };

  const handleAddToCart = (item: LabServiceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const variant = selectedVariants[item.id] || 'single';
    const finalPrice = variant === 'single' ? item.basePrice : Math.round(item.basePrice * 10 * 0.85);

    addItem(
      {
        id: item.id,
        name: `${item.name} (${variant === 'single' ? 'Single Prototype' : 'Batch Box 10 Pcs'})`,
        description: item.oneLiner,
        price: finalPrice,
        image: item.image,
        category: item.category,
        stock: 50,
      },
      1,
      {
        variant: variant === 'single' ? 'Single Prototype' : 'Batch Box (10 Pcs)',
      }
    );

    toast.success(`Added ${item.name} to order!`, {
      description: variant === 'single' ? 'Single Prototype Unit' : 'Batch Box of 10 units (-15%)',
      action: {
        label: 'View Cart',
        onClick: () => toggleCart(),
      },
    });
  };

  return (
    <section
      id="the-lab"
      ref={sectionRef}
      data-bg="#FFF4E0"
      data-fg="#0B0B0B"
      className="relative w-full section-padding px-6 sm:px-10 lg:px-16 bg-[#FFF4E0] text-[#0B0B0B] overflow-hidden"
    >
      {/* Ghost "3D" parallax backdrop typography */}
      <div ref={ghostTextRef} className="ghost-3d-text" aria-hidden="true">
        3D
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div data-aos="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="type-mono-eyebrow text-[#0B0B0B]/60">
                02 // THE PRINT LAB
              </span>
              <span className="sticker-minimal">
                CAPABILITIES
              </span>
            </div>

            <div className="line-reveal-mask">
              <h2 className="the-lab-h2-line type-h2">
                ENGINEERED
              </h2>
            </div>
            <div className="line-reveal-mask">
              <h2 className="the-lab-h2-line type-h2 text-[#FF5A1F]">
                FABRICATION.
              </h2>
            </div>
          </div>

          <p className="type-body font-semibold text-[#0B0B0B]/75 max-w-md">
            Direct-to-part production across polymer grades. Calibrated for micron fidelity,
            repeatable tolerances, and instant dispatch.
          </p>
        </div>

        {/* Filter Text-Tabs: Underlined (Scrollable on mobile) */}
        <div data-aos="fade-up" data-aos-delay="100" className="flex items-center gap-6 sm:gap-8 mb-8 sm:mb-12 overflow-x-auto no-scrollbar whitespace-nowrap hairline-b pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider">
          {(['All', 'FDM', 'SLA Resin', 'Carbon-X'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-2 transition-all cursor-pointer shrink-0 ${
                activeTab === tab
                  ? 'text-[#FF5A1F] after:w-full'
                  : 'text-[#0B0B0B]/60 hover:text-[#0B0B0B] after:w-0'
              } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#FF5A1F] after:transition-all`}
            >
              {tab === 'All' ? 'ALL PROCESSES' : tab}
            </button>
          ))}
        </div>

        {/* Easy Product Cards Grid matching reference image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, idx) => {
            const currentVariant = selectedVariants[item.id] || 'single';
            const price = currentVariant === 'single' ? item.basePrice : Math.round(item.basePrice * 10 * 0.85);
            const originalPrice = currentVariant === 'single' ? item.originalPrice : Math.round(item.basePrice * 10);
            const isFav = wishlist[item.id];

            return (
              <div
                key={item.id}
                data-aos="fade-up"
                data-aos-delay={(idx % 3) * 100}
                onClick={() => navigate(item.route)}
                className="lab-product-card group relative bg-[#EAF0EB] border border-[#0B0B0B] rounded-2xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-brutal-sm select-none"
              >
                <div>
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0B0B0B]/60 block truncate">
                        {item.category}
                      </span>
                      <h3 className="font-display font-black text-lg sm:text-xl text-[#0B0B0B] leading-snug tracking-tight mt-0.5 truncate group-hover:text-[#FF5A1F] transition-colors">
                        {item.name}
                      </h3>
                    </div>

                    {/* Tag & Heart */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="bg-[#FFE14D] border border-[#0B0B0B] text-[#0B0B0B] text-[10px] sm:text-[11px] font-mono font-black px-2.5 py-0.5 rounded-full shadow-xs">
                        {item.tag}
                      </span>

                      <button
                        onClick={(e) => toggleWishlist(item.id, item.name, e)}
                        className="w-8 h-8 rounded-full border border-[#0B0B0B] bg-white flex items-center justify-center hover:bg-[#FFE14D] active:scale-90 transition-transform cursor-pointer shadow-xs"
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isFav ? 'fill-[#FF5A1F] text-[#FF5A1F]' : 'text-[#0B0B0B]'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Centered Floating Image Stage */}
                  <div className="relative w-full aspect-[4/3] flex items-center justify-center my-4 overflow-hidden rounded-xl bg-white/70 p-4 border border-black/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="max-w-full max-h-full object-cover rounded-lg drop-shadow-md group-hover:scale-105 transition-transform duration-300 ease-out"
                    />
                  </div>

                  {/* One-Liner Description */}
                  <p className="font-body text-xs text-[#0B0B0B]/70 leading-relaxed line-clamp-1 mb-3">
                    {item.oneLiner}
                  </p>

                  {/* Variant Selection Pills */}
                  <div className="flex flex-wrap items-center gap-2 mb-3.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => toggleVariant(item.id, 'single', e)}
                      className={`font-mono text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        currentVariant === 'single'
                          ? 'bg-[#0B0B0B] text-white border-[#0B0B0B]'
                          : 'bg-white text-[#0B0B0B] border-[#0B0B0B] hover:bg-neutral-50'
                      }`}
                    >
                      Single Pouch 75g
                    </button>

                    <button
                      type="button"
                      onClick={(e) => toggleVariant(item.id, 'batch', e)}
                      className={`font-mono text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        currentVariant === 'batch'
                          ? 'bg-[#0B0B0B] text-white border-[#0B0B0B]'
                          : 'bg-white text-[#0B0B0B] border-[#0B0B0B] hover:bg-neutral-50'
                      }`}
                    >
                      Display Box of 10
                    </button>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#0B0B0B]/80 mb-3.5">
                    <Star className="w-3.5 h-3.5 fill-[#FFE14D] text-[#0B0B0B] stroke-[1.5]" />
                    <span>{item.rating.toFixed(1)}</span>
                    <span className="text-[#0B0B0B]/50 font-normal">({item.reviews})</span>
                  </div>
                </div>

                {/* Hairline Divider & Footer Row */}
                <div className="pt-3.5 border-t border-[#0B0B0B]/15 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display font-black text-xl text-[#0B0B0B]">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <span className="font-mono text-xs text-[#0B0B0B]/40 line-through">
                        ₹{originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#0B0B0B]/60 block mt-0.5">
                      {currentVariant === 'single' ? 'Net wt: 75g' : 'Net wt: 750g'}
                    </span>
                  </div>

                  {/* Actions: [ 👁 Quick View ] + [ 👜 Add ] */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewItem(item);
                      }}
                      className="w-9 h-9 rounded-full border border-[#0B0B0B] bg-white flex items-center justify-center hover:bg-[#FFE14D] active:scale-95 transition-all cursor-pointer shadow-xs"
                      title="Quick View"
                      aria-label="Quick View"
                    >
                      <Eye className="w-4 h-4 text-[#0B0B0B]" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(item, e)}
                      className="bg-[#E52E2E] hover:bg-[#CD2424] text-white font-display font-black text-xs px-4 py-2 rounded-full border border-[#0B0B0B] flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick View Dialog for Lab Service */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-lg bg-[#EAF0EB] border border-[#0B0B0B] rounded-2xl p-6 text-[#0B0B0B]">
          {previewItem && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase text-[#0B0B0B]/60">
                    {previewItem.category} // SATURN LAB
                  </span>
                  <h3 className="font-display font-black text-2xl text-[#0B0B0B]">
                    {previewItem.name}
                  </h3>
                </div>
                <span className="bg-[#FFE14D] border border-[#0B0B0B] text-[#0B0B0B] text-xs font-mono font-black px-2.5 py-0.5 rounded-full">
                  ₹{previewItem.basePrice}
                </span>
              </div>

              <div className="w-full aspect-[4/3] rounded-xl bg-white flex items-center justify-center p-4 border border-black/10">
                <img
                  src={previewItem.image}
                  alt={previewItem.name}
                  className="max-h-full object-cover rounded-lg drop-shadow"
                />
              </div>

              <p className="font-body text-sm text-[#0B0B0B]/80 leading-relaxed">
                {previewItem.oneLiner} Precision calibrated industrial 3D additive manufacturing with guaranteed micron tolerances.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={(e) => {
                    handleAddToCart(previewItem, e);
                    setPreviewItem(null);
                  }}
                  className="flex-1 bg-[#E52E2E] hover:bg-[#CD2424] text-white font-display font-black text-xs py-3 rounded-full border border-[#0B0B0B] flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO ORDER &bull; ₹{previewItem.basePrice}</span>
                </button>

                <button
                  onClick={() => {
                    const route = previewItem.route;
                    setPreviewItem(null);
                    navigate(route);
                  }}
                  className="px-4 py-3 bg-white hover:bg-neutral-50 text-[#0B0B0B] font-display font-bold text-xs rounded-full border border-[#0B0B0B] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>CONFIGURE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
