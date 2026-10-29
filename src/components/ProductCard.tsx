import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Eye, Star, ArrowRight } from 'lucide-react';
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

    toast.success(`Added ${product.name} to order`, {
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
        className="group relative bg-white border hairline hover:border-black/25 rounded-2xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 shadow-precision-sm hover:shadow-precision-md hover:-translate-y-1 select-none"
      >
        {/* Header: Eyebrow + Title + Actions */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 pr-2">
              <span
                onClick={handleCategoryClick}
                className="font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-muted hover:text-saturn-orange transition-colors block truncate"
              >
                {product.category || 'PRECISION ADDITIVE'}
              </span>
              <h3 className="font-display font-semibold text-base sm:text-lg text-graphite leading-snug tracking-tight mt-0.5 truncate group-hover:text-saturn-orange transition-colors">
                {product.name}
              </h3>
            </div>

            {/* Top Right Badges & Wishlist Button */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-mono text-[10px] text-muted-dark bg-studio-light border hairline px-2.5 py-0.5 rounded-full">
                Stock
              </span>

              <button
                onClick={handleToggleWishlist}
                className="w-8 h-8 rounded-full border hairline bg-white flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
                title="Add to Wishlist"
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-colors ${
                    isWishlisted ? 'fill-saturn-orange text-saturn-orange' : 'text-muted hover:text-graphite'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Floating Centered Product Image */}
          <div className="relative w-full aspect-[4/3] flex items-center justify-center my-4 overflow-hidden rounded-xl bg-studio-light/70 p-4 border hairline">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="max-w-full max-h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300 ease-out"
              onError={(e) => {
                e.currentTarget.src = '/products/vase.jpg';
              }}
            />
          </div>

          {/* Subtitle / One-Line Description */}
          <p className="font-body text-xs text-muted leading-relaxed line-clamp-1 mb-3">
            {product.description || 'Precision calibrated polymer • Micron fidelity • 24-48h dispatch'}
          </p>

          {/* Interactive Variant Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-3.5" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedVariant('single')}
              className={`font-mono text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                selectedVariant === 'single'
                  ? 'bg-graphite text-white border-graphite shadow-precision-xs'
                  : 'bg-white text-graphite border-black/10 hover:border-black/25'
              }`}
            >
              Single Part
            </button>

            <button
              type="button"
              onClick={() => setSelectedVariant('batch')}
              className={`font-mono text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                selectedVariant === 'batch'
                  ? 'bg-graphite text-white border-graphite shadow-precision-xs'
                  : 'bg-white text-graphite border-black/10 hover:border-black/25'
              }`}
            >
              Batch (10 Pcs)
            </button>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 font-mono text-xs text-muted mb-3.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span className="font-medium text-graphite">5.0</span>
            <span className="text-muted/70">({product.reviewsCount || 96})</span>
          </div>
        </div>

        {/* Hairline Divider & Footer Row */}
        <div className="pt-3.5 border-t hairline flex items-center justify-between gap-3">
          {/* Price & Weight/Lead-time */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-semibold text-lg sm:text-xl text-graphite">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              <span className="font-mono text-xs text-muted/60 line-through">
                ₹{currentOriginalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="font-mono text-[10px] text-muted block mt-0.5">
              {selectedVariant === 'single' ? 'Net wt: 75g' : 'Net wt: 750g (Box)'}
            </span>
          </div>

          {/* Right Action Buttons Cluster: [ 👁 Quick View ] + [ 👜 Add ] */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickView}
              className="w-9 h-9 rounded-xl border hairline bg-white flex items-center justify-center hover:bg-studio-light active:scale-95 transition-all cursor-pointer text-muted hover:text-graphite"
              title="Quick View Specifications"
              aria-label="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-saturn-orange hover:bg-saturn-orange-hover text-white font-display font-medium text-xs px-3.5 py-2 rounded-xl border border-saturn-orange/80 flex items-center gap-1.5 shadow-precision-xs hover:shadow-precision-sm active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{inCartQty > 0 ? `Added (${inCartQty})` : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Dialog */}
      {quickViewOpen && (
        <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
          <DialogContent className="max-w-[92vw] sm:max-w-lg bg-white border hairline rounded-2xl p-5 sm:p-6 text-graphite max-h-[90vh] overflow-y-auto shadow-precision-lg">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted">
                    {product.category}
                  </span>
                  <h3 className="font-display font-semibold text-xl text-graphite mt-0.5">
                    {product.name}
                  </h3>
                </div>
                <span className="font-mono text-xs font-semibold text-graphite bg-studio-light border hairline px-2.5 py-1 rounded-lg">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="w-full aspect-[4/3] rounded-xl bg-studio-light/70 flex items-center justify-center p-4 border hairline">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full object-contain drop-shadow-sm"
                />
              </div>

              <p className="font-body text-xs sm:text-sm text-muted leading-relaxed">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs bg-studio-light/60 p-3.5 rounded-xl border hairline">
                <div>
                  <span className="text-muted block text-[10px] uppercase">Tolerance</span>
                  <span className="font-semibold text-graphite">±0.04 mm</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Dispatch</span>
                  <span className="font-semibold text-graphite">24–48 hours</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Material</span>
                  <span className="font-semibold text-graphite">Engineering Polymer</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Logistics</span>
                  <span className="font-semibold text-saturn-orange">Pan-India Express</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={(e) => {
                    handleAddToCart(e);
                    setQuickViewOpen(false);
                  }}
                  className="flex-1 btn-precision-primary py-2.5 text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to cart &bull; ₹{currentPrice.toLocaleString('en-IN')}</span>
                </button>

                <button
                  onClick={() => {
                    setQuickViewOpen(false);
                    navigate(`/categories/${product.id}`);
                  }}
                  className="btn-precision-secondary py-2.5 px-4 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Full specs</span>
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
