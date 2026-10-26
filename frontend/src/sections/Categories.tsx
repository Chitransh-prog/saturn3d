import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import { productsApi, type Product } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

interface CategoriesProps {
  limit?: number;
}

export default function Categories({ limit }: CategoriesProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    productsApi
      .getCategories()
      .then((res) => {
        if (res.data.data?.categories) {
          const filtered = res.data.data.categories.filter((c) => c.toLowerCase() !== 'all');
          setCategoriesList(['All', ...filtered]);
        }
      })
      .catch(() => console.warn('Could not load categories'));
  }, []);

  // Fetch initial products
  useEffect(() => {
    setLoading(true);
    setError(null);
    productsApi
      .getAll({})
      .then((res) => {
        if (res.data.data?.products) {
          setProducts(res.data.data.products);
        }
      })
      .catch(() => setError('Could not load products.'))
      .finally(() => setLoading(false));
  }, []);

  // Filter and sort products locally for instant response
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const displayedProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  return (
    <section id="categories" className="py-16 sm:py-24 px-3 sm:px-6 lg:px-10 bg-[#E5E5E5] relative overflow-hidden">
      {/* Framed Section Card matching Hero Bezel */}
      <div className="w-full max-w-[1440px] mx-auto rounded-[32px] sm:rounded-[44px] bg-[#EDEDED] border border-black/5 p-6 sm:p-10 lg:p-14 shadow-xl relative overflow-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col mb-12 sm:mb-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#F7931E]" />
            <span className="font-mono-tech text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-slate-700">
              03 / HARDWARE & MATERIAL CATALOG
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-black/10">
            <div>
              <h2 className="font-monumental text-5xl sm:text-7xl lg:text-8xl font-black text-black tracking-tight leading-[0.88] uppercase">
                ENGINEERED <span className="text-[#F7931E]">HARDWARE</span>
              </h2>
              <p className="font-mono-tech text-[11px] sm:text-xs text-slate-600 uppercase tracking-widest max-w-xl mt-3 leading-relaxed">
                Production-grade mechanical prototypes, continuous carbon-fiber brackets, and micro-stereolithography parts.
              </p>
            </div>

            {/* Quick search input */}
            <div className="w-full lg:w-80 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="SEARCH COMPONENTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-white border border-black/10 rounded-full text-xs font-mono-tech text-black placeholder:text-slate-400 focus:outline-none focus:border-black transition-all shadow-2xs uppercase tracking-wider"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Bar & Category Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-black/5">
          {/* Category Capsule Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
            {categoriesList.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-[10px] font-mono-tech font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 border ${
                    isSelected
                      ? 'bg-black border-black text-white shadow-xs'
                      : 'bg-white border-black/10 text-slate-700 hover:border-black hover:text-black hover:bg-white'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-[10px] font-mono-tech uppercase text-slate-500 font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-black/10 rounded-full px-3 py-1.5 text-[10px] font-mono-tech uppercase text-black font-bold focus:outline-none focus:border-black cursor-pointer shadow-2xs"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-black/10 p-5 space-y-4 animate-pulse">
                <div className="aspect-[4/3] bg-slate-100 rounded-2xl" />
                <div className="h-6 bg-slate-100 rounded-full w-3/4" />
                <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                <div className="h-11 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-white rounded-[2rem] border border-black/10 p-8 shadow-xs">
            <p className="font-mono-tech font-bold text-black text-sm uppercase mb-2">{error}</p>
            <p className="text-xs text-slate-500 mb-6 text-center max-w-md">
              Unable to reach the live store catalog. Please check your network connection or try again.
            </p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                productsApi
                  .getAll({})
                  .then((res) => {
                    if (res.data.data?.products) {
                      setProducts(res.data.data.products);
                    }
                  })
                  .catch((err) => setError(err.response?.data?.error || 'Failed to fetch products'))
                  .finally(() => setLoading(false));
              }}
              className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-mono-tech font-bold uppercase tracking-widest"
            >
              Retry Sync
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && displayedProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-black/10 p-8 text-center">
            <h3 className="font-monumental text-3xl font-black text-black tracking-wide uppercase mb-2">No Matching Parts</h3>
            <p className="text-xs font-mono-tech text-slate-500 mb-6 max-w-md uppercase tracking-wider">
              No components match your current query or category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-full bg-black text-white text-[10px] font-mono-tech font-bold uppercase tracking-widest"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && displayedProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* See More Link if limited */}
        {limit && filteredProducts.length > limit && (
          <div className="mt-14 text-center">
            <button
              onClick={() => navigate('/categories')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-black hover:bg-neutral-800 text-white font-mono-tech text-xs font-bold uppercase tracking-[0.18em] rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-95 group"
            >
              <span>EXPLORE FULL HARDWARE CATALOG ({filteredProducts.length})</span>
              <ArrowRight className="w-4 h-4 text-[#F7931E] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
