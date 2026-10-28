import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ChevronRight, Home, Factory } from 'lucide-react';
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
        color: metadata.color || 'bg-lemon text-ink',
        borderColor: 'border-ink'
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
      <div className="flex items-center justify-center min-h-[60vh] bg-paper pattern-blueprint">
        <div className="card-slab bg-white border-3 border-ink shadow-brutal p-8 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          <p className="font-mono text-xs font-black text-ink uppercase tracking-wider">Loading Sector Catalog...</p>
        </div>
      </div>
    );
  }

  if (error && !category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center bg-paper pattern-blueprint">
        <div className="card-slab bg-white border-4 border-ink shadow-brutal-xl p-8 max-w-md">
          <h2 className="font-display text-3xl font-black text-ink mb-2 uppercase">SECTOR NOT FOUND</h2>
          <p className="font-mono text-xs font-bold text-ink/70 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/categories')} 
            className="btn-brutal bg-ink text-paper hover:bg-saturn-orange hover:text-white px-6 py-3 font-mono text-xs font-black uppercase tracking-wider border-2 border-ink shadow-brutal-sm cursor-pointer"
          >
            BROWSE ALL SECTORS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pattern-blueprint">
      {/* Header / Hero */}
      <div className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 bg-paper border-b-3 border-ink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 mb-8 font-mono text-xs font-black uppercase text-ink/60">
            <button onClick={() => navigate('/')} className="hover:text-saturn-orange transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> HOME
            </button>
            <span>/</span>
            <button onClick={() => navigate('/categories')} className="hover:text-saturn-orange transition-colors">
              CATEGORIES
            </button>
            <span>/</span>
            <span className="text-ink bg-lemon px-2 py-0.5 border border-ink shadow-brutal-sm">{category?.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-ink text-paper border-2 border-ink shadow-brutal-sm font-mono text-xs font-black uppercase tracking-wider mb-4">
                <span className="w-2.5 h-2.5 bg-saturn-orange" />
                <span>{categories.find(c => c.slug === slug) ? 'INDUSTRY SECTOR PROTOCOL' : 'HARDWARE CATEGORY PROTOCOL'}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-ink tracking-tight uppercase mb-4 leading-[0.92] break-words">
                {category?.title}
              </h1>
              <p className="font-mono text-xs sm:text-sm text-ink/80 font-bold leading-relaxed max-w-2xl bg-white/70 p-4 border-2 border-ink shadow-brutal-sm">
                {category?.description}
              </p>
            </div>
            
            <div className="hidden lg:block">
               <div className="w-40 h-40 card-slab bg-lemon border-3 border-ink shadow-brutal flex items-center justify-center rotate-3">
                  {category && <category.icon className="w-20 h-20 text-ink" />}
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-10 pb-4 border-b-2 border-ink/20">
           <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-saturn-orange border border-ink" />
              <p className="font-mono text-xs font-black text-ink uppercase tracking-wider">
                /{products.length} PRECISION COMPONENTS READY FOR DISPATCH
              </p>
           </div>
        </div>

        {/* Loading Products */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          </div>
        ) : products.length === 0 ? (
          <div className="card-slab bg-white border-3 border-ink shadow-brutal p-10 text-center max-w-2xl mx-auto space-y-4">
            <span className="font-mono text-xs font-black text-saturn-orange uppercase">// BESPOKE RUN REQUIRED</span>
            <h4 className="font-display text-2xl font-black text-ink uppercase tracking-tight">
              NO STANDARDIZED STOCK PARTS FOR THIS SECTOR YET
            </h4>
            <p className="font-mono text-xs text-ink/70 max-w-md mx-auto font-bold leading-relaxed">
              We specialize in custom manufacturing for {category?.title}. Upload your 3D CAD files for an immediate quote or explore our custom engineering lab.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button 
                onClick={() => navigate('/custom-lab')} 
                className="btn-brutal bg-saturn-orange text-white hover:bg-lemon hover:text-ink px-6 py-3 font-mono text-xs font-black uppercase tracking-wider border-2 border-ink shadow-brutal-sm cursor-pointer"
              >
                LAUNCH CUSTOM LAB
              </button>
              <button 
                onClick={() => navigate('/categories')} 
                className="btn-brutal bg-white hover:bg-lemon text-ink px-6 py-3 font-mono text-xs font-black uppercase tracking-wider border-2 border-ink shadow-brutal-sm cursor-pointer"
              >
                BROWSE ALL HARDWARE
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
