import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowUpRight, Check, MessageSquare } from 'lucide-react';
import { type Product } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { slugify } from '@/data/categories';

interface ProductCardProps {
  product: Product & {
    rating?: number;
    reviewsCount?: number;
    tolerances?: string;
    leadTime?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const items = useCartStore((state) => state.items);

  const cartItem = items.find((item) => item.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart!`, {
      action: {
        label: 'View Cart',
        onClick: () => toggleCart(),
      },
    });
  };

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/category/${slugify(product.category)}`);
  };

  return (
    <div
      onClick={() => navigate(`/categories/${product.id}`)}
      className="group relative bg-white rounded-[2rem] border border-black/10 overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-black hover:-translate-y-1.5"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EAEAEA]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/products/vase.jpg';
          }}
        />

        {/* Category Capsule Tag */}
        <div
          onClick={handleCategoryClick}
          className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-black/15 text-[9px] font-mono-tech font-bold uppercase tracking-[0.16em] text-black shadow-xs hover:bg-black hover:text-white transition-all z-10"
        >
          {product.category}
        </div>

        {/* Stock Status Badge */}
        {product.stock === 0 ? (
          <div className="absolute bottom-3.5 left-3.5 px-3 py-1 rounded-full bg-rose-600 text-white text-[9px] font-mono-tech font-bold uppercase tracking-wider z-10 shadow-xs">
            Sold Out
          </div>
        ) : (
          <div className="absolute bottom-3.5 left-3.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[9px] font-mono-tech font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>In Stock</span>
          </div>
        )}

        {/* View Arrow Badge */}
        <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-black/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 shadow-xs">
          <ArrowUpRight className="w-3.5 h-3.5 text-black" />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3 className="font-monumental text-2xl font-black text-black tracking-wide uppercase leading-tight group-hover:text-[#F7931E] transition-colors">
              {product.name}
            </h3>
            <div className="font-monumental text-2xl font-black text-black shrink-0 tracking-tight">
              ${product.price.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-[10px] font-mono-tech font-bold text-slate-500 uppercase tracking-widest mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[#F7931E]">TOLERANCE:</span>
              <span>{product.tolerances || '±0.05mm'}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-700">
              <span className="text-amber-500">★</span>
              <span>{product.rating || 4.9}</span>
              <span className="text-slate-400">({product.reviewsCount || 34})</span>
            </div>
          </div>

          <p className="font-body text-slate-600 text-xs leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Pill Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-black/5">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-[3] h-11 rounded-full font-mono-tech text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 ${
              inCartQty > 0
                ? 'bg-emerald-600 text-white'
                : 'bg-black hover:bg-neutral-800 text-white shadow-xs'
            }`}
          >
            {inCartQty > 0 ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Cart ({inCartQty})</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                `https://wa.me/917999824632?text=${encodeURIComponent(
                  `Hello Saturn 3D, I would like to inquire about specifications for: ${product.name} (₹${product.price}).`
                )}`,
                '_blank'
              );
            }}
            className="flex-1 h-11 rounded-full bg-[#EAEAEA] hover:bg-[#DDDDDD] text-black font-mono-tech text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center active:scale-95"
            title="Consult Engineering"
          >
            Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
