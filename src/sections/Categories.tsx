'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, X, SlidersHorizontal, PackageOpen, 
  Sparkles, Layers, Box, Check, ArrowRight,
  ShieldCheck, RefreshCw, Filter
} from 'lucide-react';
import { products as fallbackProducts, type Product } from '@/data/products';
import { categories as fallbackCategoriesData } from '@/data/categories';
import ProductCard from '@/components/ProductCard';

interface CategoriesProps {
  limit?: number;
  initialProducts?: Product[];
  initialCategories?: string[];
}

export default function Categories({ limit, initialProducts }: CategoriesProps) {
  const [products] = useState<Product[]>(initialProducts && initialProducts.length > 0 ? initialProducts : fallbackProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'tolerance'>('featured');

  // Sector list matching handwritten note & saturn3d.in
  const categoryTabs = useMemo(() => {
    return [
      'All',
      'Rapid Prototyping',
      'Corporate / Bulk Gifting',
      'Architectural Scale Down Models',
      'Small Batch Manufacturing',
      'Education',
      'Interior',
      'Industrial Parts Manufacturing',
      'Drone & Robotics',
    ];
  }, []);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.material && p.material.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'tolerance') {
      result.sort((a, b) => (a.tolerances || '').localeCompare(b.tolerances || ''));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const displayedProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  // Category counts
  const getCategoryCount = (catName: string) => {
    if (catName === 'All') return products.length;
    return products.filter((p) => p.category.toLowerCase() === catName.toLowerCase()).length;
  };

  return (
    <section id="catalog-matrix" className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#F6F7F9] min-h-[80vh]">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* =================================================================
            1. REFINED ARCHITECTURAL HEADER
        ================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-black/10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[#FF5A1F] font-mono text-[11px] uppercase tracking-widest">
              <Layers className="w-3.5 h-3.5" />
              <span>05 // Hardware Catalog Matrix &bull; Bhopal Additive Lab</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111215]">
              Engineered Components <br className="hidden sm:inline" />
              <span className="text-[#FF5A1F]">&amp; Stock Production Prints.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#5E6573] leading-relaxed max-w-2xl">
              Precision functional fixtures, drone spars, micro-fluidic impellers, and custom architecture models. 
              Manufactured with &plusmn;0.04mm verified metrology tolerances and express 24&ndash;48h pan-India dispatch.
            </p>
          </div>

          {/* Quick Stats & Custom Upload Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/custom-lab"
              className="px-5 py-3 rounded-xl bg-[#111215] hover:bg-[#20242D] text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
              <span>Upload Custom CAD</span>
            </Link>
          </div>
        </div>

        {/* =================================================================
            2. SEARCH & CONTROLS COMMAND BAR
        ================================================================= */}
        <div className="p-3 sm:p-4 rounded-2xl bg-white border border-black/10 shadow-sm space-y-3.5">
          
          {/* Top Row: Search Input + Sort Dropdown */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8E95A2] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by part name, material (e.g. Carbon-X, SLA, PETG), or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-[#F8F9FA] hover:bg-[#F3F4F6] focus:bg-white border border-black/10 rounded-xl font-mono text-xs text-[#111215] placeholder:text-[#8E95A2] focus:outline-none focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E95A2] hover:text-[#111215] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <span className="font-mono text-xs text-[#5E6573] flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sort:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort components by"
                className="bg-[#F8F9FA] hover:bg-[#F3F4F6] border border-black/10 px-3 py-2 text-xs font-mono font-medium rounded-xl text-[#111215] focus:outline-none focus:border-[#FF5A1F] cursor-pointer"
              >
                <option value="featured">Featured Precision Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="tolerance">Tolerances (±0.04 mm First)</option>
              </select>
            </div>

          </div>

          {/* Bottom Row: Official 8 Sectors Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 -mx-2 px-2 sm:mx-0 sm:px-0">
            {categoryTabs.map((category) => {
              const isSelected = selectedCategory === category;
              const count = getCategoryCount(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#111215] text-white border-[#111215] shadow-sm font-semibold'
                      : 'bg-[#F8F9FA] hover:bg-white text-[#5E6573] hover:text-[#111215] border-black/5 hover:border-black/20'
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-[#8E95A2]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* =================================================================
            3. RESULTS TELEMETRY SUMMARY STRIP
        ================================================================= */}
        <div className="flex items-center justify-between text-xs font-mono text-[#5E6573] px-1">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-[#111215]">{displayedProducts.length}</strong> of{' '}
              <strong className="text-[#111215]">{products.length}</strong> production components
            </span>
            {(selectedCategory !== 'All' || searchQuery) && (
              <span className="text-[#FF5A1F] font-semibold">
                (Filtered by {selectedCategory !== 'All' ? selectedCategory : `"${searchQuery}"`})
              </span>
            )}
          </div>

          {(selectedCategory !== 'All' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-[#FF5A1F] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

        {/* =================================================================
            4. PRODUCTS GRID OR EMPTY STATE
        ================================================================= */}
        {displayedProducts.length === 0 ? (
          <div className="p-12 sm:p-16 rounded-2xl bg-white border border-black/10 text-center space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center mx-auto">
              <PackageOpen className="w-6 h-6" />
            </div>
            
            <h3 className="font-sans font-bold text-lg sm:text-xl text-[#111215]">
              No components match &ldquo;{searchQuery || selectedCategory}&rdquo;
            </h3>
            
            <p className="font-sans text-xs sm:text-sm text-[#5E6573] leading-relaxed">
              We specialize in custom additive manufacturing. Upload your proprietary CAD file for instant automated volume slicing and pricing.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-black/10 text-xs font-mono font-medium hover:bg-[#F6F7F9] transition-all cursor-pointer"
              >
                Clear Filters
              </button>
              
              <Link
                href="/custom-lab"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#E04F1A] text-white text-xs font-mono font-bold transition-all shadow-sm"
              >
                Upload Custom CAD File &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Home View Limit Trigger */}
        {limit && products.length > limit && (
          <div className="pt-6 text-center">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#111215] hover:bg-[#20242D] text-white font-mono text-xs font-bold transition-all shadow-md active:scale-98"
            >
              <span>Explore All {products.length} Parts in Full Catalog</span>
              <ArrowRight className="w-4 h-4 text-[#FF5A1F]" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
