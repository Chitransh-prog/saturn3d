import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Eye, Star, Check, ArrowRight } from 'lucide-react';
import { type Product } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { slugify } from '@/data/categories';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ProductCardProps {
  product: Product & {
    rating?: number;
    reviewsCount?: number;
    tolerances?: string;
    leadTime?: string;
    originalPrice?: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const items = useCartStore((state) => state.items);

  const [selectedVariant, setSelectedVariant] = useState<'single' | 'batch'>('single');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const cartItem = items.find((item) => item.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  // Calculate price based on selected variant
  const singlePrice = product.price;
  const originalSinglePrice = product.originalPrice || Math.round(singlePrice * 1.25);

  // Batch of 10 pcs with 15% discount
  const batchUnits = 10;
  const batchPrice = Math.round(singlePrice * batchUnits * 0.85);
  const originalBatchPrice = Math.round(singlePrice * batchUnits);

  const currentPrice = selectedVariant === 'single' ? singlePrice : batchPrice;
  const currentOriginalPrice = selectedVariant === 'single' ? originalSinglePrice : originalBatchPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const qty = selectedVariant === 'single' ? 1 : batchUnits;
    addItem(
      {
        id: product.id,
        name: `${product.name} (${selectedVariant === 'single' ? 'Single Part' : 'Batch of 10'})`,
        description: product.description,
        price: currentPrice,
        image: product.image,
        category: product.category,
        stock: product.stock,
      },
      1,
      {
        variant: selectedVariant === 'single' ? 'Single Part' : 'Batch Box (10 Sachets/Parts)',
      }
    );

    toast.success(`Added ${product.name} to order!`, {
      description: selectedVariant === 'single' ? 'Single Part' : 'Batch Box of 10 pcs',
      action: {
        label: 'View Cart',
        onClick: () => toggleCart(),
      },
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    if (nextState) {
      toast.success(`Saved ${product.name} to favorites`);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/category/${slugify(product.category)}`);
  };

  return (
    <>
      <div
        onClick={() => navigate(`/categories/${product.id}`)}
        className="group relative bg-[#EAF0EB] border border-[#0B0B0B] rounded-2xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0B0B0B] select-none"
      >
        {/* 1. Header: Eyebrow + Title + (Badge & Heart Action) */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 pr-2">
              <span
                onClick={handleCategoryClick}
                className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0B0B0B]/60 hover:text-[#FF5A1F] transition-colors block truncate"
              >
                {product.category || 'PRECISION ADDITIVE'}
              </span>
              <h3 className="font-display font-black text-lg sm:text-xl text-[#0B0B0B] leading-snug tracking-tight mt-0.5 truncate group-hover:text-[#FF5A1F] transition-colors">
                {product.name}
              </h3>
            </div>

            {/* Top Right Badges & Wishlist Button */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="bg-[#FFE14D] border border-[#0B0B0B] text-[#0B0B0B] text-[10px] sm:text-[11px] font-mono font-black px-2.5 py-0.5 rounded-full shadow-xs">
                New
              </span>

              <button
                onClick={handleToggleWishlist}
                className="w-8 h-8 rounded-full border border-[#0B0B0B] bg-white flex items-center justify-center hover:bg-[#FFE14D] active:scale-90 transition-transform cursor-pointer shadow-xs"
                title="Add to Wishlist"
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isWishlisted ? 'fill-[#FF5A1F] text-[#FF5A1F]' : 'text-[#0B0B0B]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 2. Floating Centered Product Image */}
          <div className="relative w-full aspect-[4/3] flex items-center justify-center my-4 overflow-hidden rounded-xl bg-white/70 p-4 border border-black/5">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="max-w-full max-h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300 ease-out"
              onError={(e) => {
                e.currentTarget.src = '/products/vase.jpg';
              }}
            />
          </div>

          {/* 3. Subtitle / One-Line Description */}
          <p className="font-body text-xs text-[#0B0B0B]/70 leading-relaxed line-clamp-1 mb-3">
            {product.description || 'Precision calibrated polymer • Micron fidelity • 24-48h dispatch'}
          </p>

          {/* 4. Interactive Variant Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-3.5" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedVariant('single')}
              className={`font-mono text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                selectedVariant === 'single'
                  ? 'bg-[#0B0B0B] text-white border-[#0B0B0B]'
                  : 'bg-white text-[#0B0B0B] border-[#0B0B0B] hover:bg-neutral-50'
              }`}
            >
              Single Part
            </button>

            <button
              type="button"
              onClick={() => setSelectedVariant('batch')}
              className={`font-mono text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                selectedVariant === 'batch'
                  ? 'bg-[#0B0B0B] text-white border-[#0B0B0B]'
                  : 'bg-white text-[#0B0B0B] border-[#0B0B0B] hover:bg-neutral-50'
              }`}
            >
              Batch Box (10 Pcs)
            </button>
          </div>

          {/* 5. Star Rating */}
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#0B0B0B]/80 mb-3.5">
            <Star className="w-3.5 h-3.5 fill-[#FFE14D] text-[#0B0B0B] stroke-[1.5]" />
            <span>5.0</span>
            <span className="text-[#0B0B0B]/50 font-normal">({product.reviewsCount || 96})</span>
          </div>
        </div>

        {/* 6. Hairline Divider & Footer Row */}
        <div className="pt-3.5 border-t border-[#0B0B0B]/15 flex items-center justify-between gap-3">
          {/* Price & Weight/Lead-time */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-xl text-[#0B0B0B]">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              <span className="font-mono text-xs text-[#0B0B0B]/40 line-through">
                ₹{currentOriginalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#0B0B0B]/60 block mt-0.5">
              {selectedVariant === 'single' ? 'Net wt: 75g' : 'Net wt: 750g (Box)'}
            </span>
          </div>

          {/* Right Action Buttons Cluster: [ 👁 Quick View ] + [ 👜 Add ] */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickView}
              className="w-9 h-9 rounded-full border border-[#0B0B0B] bg-white flex items-center justify-center hover:bg-[#FFE14D] active:scale-95 transition-all cursor-pointer shadow-xs"
              title="Quick View Specifications"
              aria-label="Quick View"
            >
              <Eye className="w-4 h-4 text-[#0B0B0B]" />
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-[#E52E2E] hover:bg-[#CD2424] text-white font-display font-black text-xs px-4 py-2 rounded-full border border-[#0B0B0B] flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{inCartQty > 0 ? `Added (${inCartQty})` : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Dialog - Only mounted on demand for high performance */}
      {quickViewOpen && (
        <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
          <DialogContent className="max-w-[92vw] sm:max-w-lg bg-[#EAF0EB] border border-[#0B0B0B] rounded-2xl p-5 sm:p-6 text-[#0B0B0B] max-h-[90vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-[#0B0B0B]/60">
                  {product.category}
                </span>
                <h3 className="font-display font-black text-2xl text-[#0B0B0B]">
                  {product.name}
                </h3>
              </div>
              <span className="bg-[#FFE14D] border border-[#0B0B0B] text-[#0B0B0B] text-xs font-mono font-black px-2.5 py-0.5 rounded-full">
                ₹{currentPrice}
              </span>
            </div>

            <div className="w-full aspect-[4/3] rounded-xl bg-white flex items-center justify-center p-4 border border-black/10">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full object-contain drop-shadow"
              />
            </div>

            <p className="font-body text-sm text-[#0B0B0B]/80 leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs bg-white/70 p-3 rounded-lg border border-black/10">
              <div>
                <span className="text-black/50 block text-[10px]">TOLERANCE:</span>
                <span className="font-bold">±0.04 MM</span>
              </div>
              <div>
                <span className="text-black/50 block text-[10px]">DISPATCH:</span>
                <span className="font-bold">24–48 HOURS</span>
              </div>
              <div>
                <span className="text-black/50 block text-[10px]">MATERIAL:</span>
                <span className="font-bold">HIGH-DENSITY POLYMER</span>
              </div>
              <div>
                <span className="text-black/50 block text-[10px]">DELIVERY:</span>
                <span className="font-bold text-[#E52E2E]">ALL INDIA AIR EXPRESS</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={(e) => {
                  handleAddToCart(e);
                  setQuickViewOpen(false);
                }}
                className="flex-1 bg-[#E52E2E] hover:bg-[#CD2424] text-white font-display font-black text-xs py-3 rounded-full border border-[#0B0B0B] flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART &bull; ₹{currentPrice}</span>
              </button>

              <button
                onClick={() => {
                  setQuickViewOpen(false);
                  navigate(`/categories/${product.id}`);
                }}
                className="px-4 py-3 bg-white hover:bg-neutral-50 text-[#0B0B0B] font-display font-bold text-xs rounded-full border border-[#0B0B0B] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>FULL DETAILS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      )}
    </>
  );
};

export default ProductCard;
