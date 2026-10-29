'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Box, Check, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { type Product } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const items = useCartStore((state) => state.items);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const cartItem = items.find((item) => item.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const originalPrice = Math.round(product.price * 1.25);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
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
      1,
      {
        variant: 'Standard Precision Unit',
      }
    );

    toast.success(`Added ${product.name} to order`, {
      description: `₹${product.price.toLocaleString('en-IN')} • 24–48h Dispatch`,
      action: {
        label: 'View Cart',
        onClick: () => toggleCart(),
      },
    });

    setTimeout(() => setIsAdding(false), 600);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isWishlisted;
    setIsWishlisted(next);
    if (next) {
      toast.success(`Saved to project bookmarks`, {
        description: product.name,
      });
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-black/10 hover:border-[#FF5A1F]/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 select-none">
      
      {/* 1. Card Top Bar: Sector Eyebrow + Status + Wishlist */}
      <div className="p-4 sm:p-5 pb-0 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FF5A1F] truncate">
            {product.category || 'RAPID PROTOTYPING'}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="font-mono text-[10px] text-[#5E6573] bg-[#F4F5F7] border border-black/5 px-2 py-0.5 rounded-md">
            {product.leadTime || '24-48h'}
          </span>
          <button
            type="button"
            onClick={handleToggleWishlist}
            className="w-7 h-7 rounded-lg border border-black/5 hover:border-black/20 bg-white flex items-center justify-center transition-all cursor-pointer text-[#8E95A2] hover:text-[#111215] active:scale-90"
            title="Bookmark Part"
            aria-label="Bookmark"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isWishlisted ? 'fill-[#FF5A1F] text-[#FF5A1F]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Visual Studio: Product Photograph Stage */}
      <Link
        href={`/product/${product.id}`}
        className="block px-4 sm:px-5 my-3 relative group/visual cursor-pointer"
      >
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-b from-[#F7F8FA] to-[#ECEEF2] border border-black/5 flex items-center justify-center p-3 sm:p-4">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover/visual:scale-108"
            onError={(e) => {
              e.currentTarget.src = '/products/vase.jpg';
            }}
          />

          {/* Interactive 3D CAD Inspect Hover Tag */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/visual:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-[#111215] font-mono text-[11px] font-bold shadow-lg transform translate-y-1 group-hover/visual:translate-y-0 transition-transform">
              <Box className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Inspect in 3D CAD</span>
            </span>
          </div>

          {/* Micro Telemetry Pill */}
          <div className="absolute bottom-2 left-2 pointer-events-none">
            <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white/90 backdrop-blur-sm">
              {product.tolerances || '±0.04 mm'}
            </span>
          </div>
        </div>
      </Link>

      {/* 3. Specifications & Title Content */}
      <div className="px-4 sm:px-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link href={`/product/${product.id}`} className="block group-hover:text-[#FF5A1F] transition-colors">
            <h3 className="font-sans font-bold text-base sm:text-lg text-[#111215] tracking-tight leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Material Spec Badge */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-[#5E6573]">
            <span className="inline-block px-2 py-0.5 rounded bg-[#F0F2F5] border border-black/5 font-medium text-[#111215]">
              {product.material || 'Engineering Polymer'}
            </span>
            {product.dimensions && (
              <span className="text-[#8E95A2] text-[10px] hidden sm:inline">
                {product.dimensions}
              </span>
            )}
          </div>

          {/* One-Line Description */}
          <p className="font-sans text-xs text-[#5E6573] leading-relaxed line-clamp-2 mt-2 mb-4">
            {product.description}
          </p>
        </div>

        {/* 4. Pricing & Action Controls Footer */}
        <div className="pt-3.5 border-t border-black/5 flex items-center justify-between gap-2 pb-4 sm:pb-5">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans font-extrabold text-xl sm:text-2xl text-[#111215] tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="font-mono text-xs text-[#8E95A2] line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="font-mono text-[10px] text-emerald-600 font-semibold block">
              ● Ready to print // 0 MOQ
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* View 3D Page */}
            <Link
              href={`/product/${product.id}`}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-black/10 hover:border-[#FF5A1F] bg-[#F8F9FB] hover:bg-white text-[#111215] hover:text-[#FF5A1F] transition-all flex items-center gap-1 font-mono text-xs"
              title="Inspect Part in 3D"
            >
              <Box className="w-4 h-4 text-[#FF5A1F]" />
              <span className="hidden md:inline font-semibold">3D</span>
            </Link>

            {/* Quick Add To Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
                inCartQty > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                  : 'bg-[#FF5A1F] hover:bg-[#E04F1A] text-white shadow-[#FF5A1F]/20'
              }`}
            >
              {inCartQty > 0 ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>({inCartQty})</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
