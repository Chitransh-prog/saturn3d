import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, PackageOpen } from 'lucide-react';
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
    <section id="categories" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-studio-light border-b hairline relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/[0.04] border hairline rounded-full font-mono text-[11px] font-medium uppercase tracking-wider text-muted-dark mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-saturn-orange" />
              <span>05 // Catalog Matrix</span>
            </div>
            <h2 className="font-display font-semibold text-2xl sm:text-4xl text-graphite tracking-tight">
              Engineered components & stock prints.
            </h2>
            <p className="font-body text-xs sm:text-sm text-muted mt-2 max-w-xl leading-relaxed">
              Standard functional fixtures, drone frames, and precision enclosures manufactured with micron repeatability.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="w-full lg:w-80 relative">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by part or spec..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white border hairline rounded-xl font-mono text-xs text-graphite placeholder:text-muted focus:outline-hidden focus:border-saturn-orange focus:ring-2 focus:ring-saturn-orange/20 transition-all shadow-precision-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-graphite cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar & Sort Controls */}
        <div className="border-b hairline pb-4 mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categoriesList.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-graphite text-white border-graphite shadow-precision-xs'
                      : 'bg-white text-muted hover:text-graphite border-black/10 hover:border-black/25'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 font-mono text-xs text-muted shrink-0 self-end md:self-auto">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border hairline px-3 py-1.5 text-xs font-mono font-medium rounded-xl focus:outline-hidden focus:border-saturn-orange cursor-pointer shadow-precision-xs text-graphite"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Loading / Error / Grid States */}
        {loading ? (
          <div className="card-precision bg-white p-12 text-center">
            <div className="inline-block w-8 h-8 border-2 border-black/10 border-t-saturn-orange rounded-full animate-spin mb-3" />
            <div className="font-mono text-xs text-muted">
              Loading engineered catalog archive...
            </div>
          </div>
        ) : error ? (
          <div className="card-precision bg-white p-8 text-center space-y-3">
            <div className="font-display font-semibold text-lg text-red-600">Failed to load catalog</div>
            <p className="font-mono text-xs text-muted">{error}</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="card-precision bg-white p-12 text-center space-y-3 max-w-md mx-auto">
            <PackageOpen className="w-10 h-10 text-saturn-orange mx-auto" />
            <h3 className="font-display font-semibold text-lg text-graphite">
              No components matching "{searchQuery}"
            </h3>
            <p className="font-body text-xs text-muted">
              Try searching by general polymer or clear active search filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="btn-precision-secondary text-xs py-2 px-4 mt-2 cursor-pointer"
            >
              Reset catalog filters
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
              className="btn-precision-secondary text-xs sm:text-sm py-3 px-6 inline-flex items-center gap-2 mx-auto cursor-pointer"
            >
              <span>View complete catalog ({products.length} components)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
