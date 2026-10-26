import Categories from '@/sections/Categories';
import CTA from '@/sections/CTA';

export default function CategoriesPage() {
  return (
    <div className="pt-0 min-h-screen bg-zinc-50 relative overflow-hidden">
      {/* Subtle background industrial pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
      
      <div className="relative z-10">
        <Categories />
        <CTA />
      </div>
    </div>
  );
}
