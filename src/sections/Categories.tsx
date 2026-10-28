import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ArrowRight, PackageOpen } from 'lucide-react';
import { productsApi, type Product } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import SectionHeader from '@/components/SectionHeader';
import { products as fallbackProducts } from '@/data/products';
import { categories as fallbackCategoriesData } from '@/data/categories';

interface CategoriesProps {
  limit?: number;
  initialProducts?: Product[];
  initialCategories?: string[];
}

export default function Categories({ limit, initialProducts, initialCategories }: CategoriesProps) {
  const defaultCats = useMemo(() => {
    if (initialCategories && initialCategories.length > 0) {
      return initialCategories.includes('All') ? initialCategories : ['All', ...initialCategories];
    }
    return ['All', ...fallbackCategoriesData.map((c) => c.title)];
  }, [initialCategories]);

  const defaultProds = useMemo(() => {
    if (initialProducts && initialProducts.length > 0) {
      return initialProducts;
    }
    return fallbackProducts;
  }, [initialProducts]);

  const [products, setProducts] = useState<Product[]>(defaultProds);
  const [categoriesList, setCategoriesList] = useState<string[]>(defaultCats);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Sync state if initial props change
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
    }
  }, [initialProducts]);

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategoriesList(
        initialCategories.includes('All') ? initialCategories : ['All', ...initialCategories]
      );
    }
  }, [initialCategories]);

  // Silent background revalidation for categories
  useEffect(() => {
    productsApi
      .getCategories()
      .then((res) => {
        if (res.data.data?.categories && res.data.data.categories.length > 0) {
          const filtered = res.data.data.categories.filter((c) => c.toLowerCase() !== 'all');
          setCategoriesList(['All', ...filtered]);
        }
      })
      .catch(() => {});
  }, []);

  // Silent background revalidation for products
  useEffect(() => {
    productsApi
      .getAll({})
      .then((res) => {
        if (res.data.data?.products && res.data.data.products.length > 0) {
          setProducts(res.data.data.products);
        }
      })
      .catch((err) => {
        // If initial products are already shown, do not flash error
        if (products.length === 0) {
          setError('Could not load products.');
        }
      });
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
    <section id="categories" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] hairline-b relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <SectionHeader
            number="05"
            tag="CATALOG MATRIX"
            title="ENGINEERED COMPONENTS & PRINTS"
            highlightWord="COMPONENTS"
            subtitle="Explore standard functional prototypes, high-density enclosures, and structural fixtures manufactured with micron-level fidelity."
            badgeText="INSTANT DISPATCH"
            badgeColor="#FFE14D"
            className="mb-0"
          />

          {/* Quick Search Input */}
          <div className="w-full lg:w-80 relative">
            <Search className="w-4 h-4 text-[#0B0B0B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
            <input
              type="text"
              placeholder="SEARCH BY PART OR SPEC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-white hairline rounded-xs font-mono text-xs uppercase text-[#0B0B0B] placeholder:text-[#777] focus:outline-hidden focus:bg-[#FAF7F2] transition-all font-bold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B0B0B] hover:text-[#FF5A1F]"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar & Sort Controls */}
        <div className="hairline-b pb-4 mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 font-mono text-xs font-bold uppercase tracking-wider">
            {categoriesList.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative pb-2 whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'text-[#FF5A1F] after:w-full font-black'
                      : 'text-[#0B0B0B]/60 hover:text-[#0B0B0B] after:w-0'
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#FF5A1F] after:transition-all`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#0B0B0B] shrink-0 self-end md:self-auto">
            <span>SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF7F2] border-2 border-ink px-2.5 py-1 text-xs font-mono font-bold uppercase rounded-xs focus:outline-hidden cursor-pointer shadow-brutal-sm"
            >
              <option value="featured">FEATURED</option>
              <option value="price-asc">PRICE: LOW &rarr; HIGH</option>
              <option value="price-desc">PRICE: HIGH &rarr; LOW</option>
            </select>
          </div>
        </div>

        {/* Loading / Error / Grid States */}
        {loading ? (
          <div className="card-slab bg-white p-12 text-center border-3 border-ink shadow-brutal">
            <div className="inline-block w-8 h-8 border-4 border-ink border-t-[#FF5A1F] animate-spin mb-3" />
            <div className="font-mono text-xs font-bold text-[#0B0B0B]">
              LOADING ENGINEERED CATALOG ARCHIVE...
            </div>
          </div>
        ) : error ? (
          <div className="card-slab bg-[#FAF7F2] p-8 border-3 border-ink shadow-brutal text-center space-y-3">
            <div className="font-display font-black text-xl text-red-600">FAILED TO LOAD CATALOG</div>
            <p className="font-mono text-xs text-[#555]">{error}</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="card-slab bg-white p-12 text-center border-3 border-ink shadow-brutal space-y-3">
            <PackageOpen className="w-12 h-12 text-[#FF5A1F] mx-auto stroke-[2]" />
            <h3 className="font-display font-black text-xl text-[#0B0B0B] uppercase">
              NO COMPONENTS MATCHING "{searchQuery}"
            </h3>
            <p className="font-mono text-xs text-[#666]">
              Try searching by general polymer (PLA, PETG, ABS) or clear search filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="btn-brutal btn-brutal-orange text-xs py-2 px-4 mt-2"
            >
              RESET CATALOG FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Button if on Home with Limit */}
        {limit && products.length > limit && (
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/categories')}
              className="btn-brutal btn-brutal-orange text-xs sm:text-sm py-3.5 px-8 flex items-center gap-2 mx-auto"
            >
              <span>VIEW COMPLETE CATALOG ({products.length} COMPONENTS)</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
