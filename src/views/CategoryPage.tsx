import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Home, Factory } from 'lucide-react';
import { productsApi, type Product } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { categories, unslugify, getCategoryMetadata } from '@/data/categories';
import type { Category } from '@/data/categories';
import CTA from '@/sections/CTA';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    
    // Check static industry categories first
    const foundCategory = categories.find((c) => c.slug === slug);
    
    if (foundCategory) {
      setCategory(foundCategory);
      fetchProducts(foundCategory.title);
    } else {
      // Handle dynamic product categories
      const title = unslugify(slug);
      const metadata = getCategoryMetadata(title);
      
      const dynamicCategory: Category = {
        title,
        slug,
        description: `Advanced industrial solutions and precision hardware for ${title} applications.`,
        icon: metadata.icon || Factory,
        color: metadata.color || 'bg-studio-light text-graphite',
        borderColor: 'border-black/10'
      };
      
      setCategory(dynamicCategory);
      fetchProducts(title);
    }
  }, [slug]);

  const fetchProducts = (categoryTitle: string) => {
    setLoading(true);
    setError(null);
    productsApi.getAll({ category: categoryTitle })
      .then((res) => {
        if (res.data.data?.products) {
          setProducts(res.data.data.products);
        }
      })
      .catch(() => {
        setError('Could not load products. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  if (loading && !category) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-studio-light">
        <div className="card-precision bg-white p-8 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          <p className="font-mono text-xs font-medium text-muted uppercase tracking-wider">Loading Sector Catalog...</p>
        </div>
      </div>
    );
  }

  if (error && !category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center bg-studio-light">
        <div className="card-precision bg-white p-8 max-w-md">
          <h2 className="font-display text-2xl font-semibold text-graphite mb-2">Sector Not Found</h2>
          <p className="font-body text-xs text-muted mb-6">{error}</p>
          <button 
            onClick={() => navigate('/categories')} 
            className="btn-precision-primary px-6 py-2.5 text-xs font-mono uppercase tracking-wider cursor-pointer"
          >
            Browse All Sectors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-studio-light text-graphite">
      {/* Header / Hero */}
      <div className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 bg-white border-b hairline">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 mb-6 font-mono text-xs text-muted">
            <button onClick={() => navigate('/')} className="hover:text-saturn-orange transition-colors flex items-center gap-1 cursor-pointer">
              <Home className="w-3.5 h-3.5" /> Home
            </button>
            <span>/</span>
            <button onClick={() => navigate('/categories')} className="hover:text-saturn-orange transition-colors cursor-pointer">
              Categories
            </button>
            <span>/</span>
            <span className="text-graphite font-medium bg-studio-light px-2.5 py-0.5 rounded-md border hairline">{category?.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/[0.04] border hairline rounded-full font-mono text-[11px] font-medium text-muted-dark mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-saturn-orange" />
                <span>{categories.find(c => c.slug === slug) ? 'INDUSTRY SECTOR PROTOCOL' : 'HARDWARE CATEGORY PROTOCOL'}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold text-graphite tracking-tight mb-4">
                {category?.title}
              </h1>
              <p className="font-body text-xs sm:text-sm text-muted leading-relaxed max-w-2xl bg-studio-light/60 p-4 rounded-xl border hairline">
                {category?.description}
              </p>
            </div>
            
            <div className="hidden lg:block">
               <div className="w-32 h-32 card-precision bg-studio-light flex items-center justify-center">
                  {category && <category.icon className="w-16 h-16 text-muted-dark" />}
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b hairline">
           <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-saturn-orange" />
              <p className="font-mono text-xs font-medium text-muted uppercase tracking-wider">
                {products.length} precision components ready for dispatch
              </p>
           </div>
        </div>

        {/* Loading Products */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          </div>
        ) : products.length === 0 ? (
          <div className="card-precision bg-white p-10 text-center max-w-2xl mx-auto space-y-4">
            <span className="font-mono text-xs font-medium text-saturn-orange uppercase">// Custom Run Required</span>
            <h4 className="font-display text-xl font-semibold text-graphite">
              No Standardized Stock Parts for This Sector Yet
            </h4>
            <p className="font-body text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
              We specialize in custom manufacturing for {category?.title}. Upload your 3D CAD files for an immediate quote or explore our custom engineering lab.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button 
                onClick={() => navigate('/custom-lab')} 
                className="btn-precision-primary px-5 py-2.5 text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Launch Custom Lab
              </button>
              <button 
                onClick={() => navigate('/categories')} 
                className="btn-precision-secondary px-5 py-2.5 text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Browse All Hardware
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <CTA />
    </div>
  );
}
