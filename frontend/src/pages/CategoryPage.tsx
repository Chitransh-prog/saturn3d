import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowUpRight, Loader2, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { productsApi, type Product } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';
import { categories, unslugify, getCategoryMetadata } from '@/data/categories';
import type { Category } from '@/data/categories';
import CTA from '@/sections/CTA';
import { Factory } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);
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
        color: metadata.color || 'bg-slate-500/10 text-slate-500',
        borderColor: 'hover:border-slate-500/50'
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <h2 className="text-3xl font-black text-black mb-4 uppercase tracking-tighter">Oops!</h2>
        <p className="text-slate-500 mb-8 font-medium">{error}</p>
        <Button onClick={() => navigate('/categories')} className="rounded-2xl font-black uppercase tracking-widest text-xs h-14 px-8">
          Browse All Categories
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50">
      {/* Header / Hero */}
      <div className="relative pt-12 pb-24 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 mb-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <button onClick={() => navigate('/')} className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" /> Home
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-300">Categories</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black">{category?.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0D1117] text-white text-[10px] font-mono-tech font-bold uppercase tracking-[0.25em] mb-6 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#F7931E] animate-pulse" />
                <span>{categories.find(c => c.slug === slug) ? 'INDUSTRY SECTOR PROTOCOL' : 'HARDWARE CATEGORY PROTOCOL'}</span>
              </div>
              <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-black tracking-tight leading-[0.92] uppercase mb-6">
                {category?.title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 === 1 ? 'text-[#F7931E] italic' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              <p className="font-heading text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                {category?.description}
              </p>
            </div>
            
            <div className="hidden lg:block">
               <div className="w-48 h-48 rounded-[36px] bg-black/5 border border-black/5 flex items-center justify-center rotate-6 relative">
                  <div className="absolute inset-0 bg-[#F7931E]/5 blur-2xl rounded-full" />
                  {category && <category.icon className="w-20 h-20 text-black/10" />}
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 relative z-10">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-12">
           <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-black/15" />
              <p className="font-mono-tech text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">
                /{products.length} PRECISION INSTRUMENTS CONFIGURED
              </p>
           </div>
        </div>

        {/* Loading Products */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#F7931E]" />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[#FAFAFA] rounded-[36px] border border-black/10 p-12 text-center shadow-xs max-w-2xl mx-auto">
            <h4 className="font-heading text-xl font-black text-black uppercase tracking-tight mb-3">No standardized catalog items for this sector yet</h4>
            <p className="font-heading text-slate-500 text-sm max-w-md mx-auto mb-8 font-medium leading-relaxed">
              We specialize in custom manufacturing for {category?.title}. Upload your 3D CAD files for an immediate quote or browse our existing hardware.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => navigate('/custom-lab')} className="h-12 px-7 rounded-full font-heading font-black text-xs uppercase tracking-wider bg-black text-white hover:bg-neutral-800 transition-all active:scale-95 shadow-xs">
                Launch Custom Lab
              </button>
              <button onClick={() => navigate('/categories')} className="h-12 px-7 rounded-full font-heading font-black text-xs uppercase tracking-wider border border-black/15 bg-white text-black hover:bg-slate-50 transition-all active:scale-95">
                Browse All Hardware
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
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
