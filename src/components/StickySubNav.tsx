import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SubNavItem {
  id: string;
  label: string;
}

interface StickySubNavProps {
  items?: SubNavItem[];
  quoteCtaHref?: string;
  quoteCtaLabel?: string;
}

const defaultItems: SubNavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'specs', label: 'Specifications' },
  { id: 'materials', label: 'Materials' },
  { id: 'gallery', label: 'Real Prints' },
  { id: 'faq', label: 'FAQ' },
];

export default function StickySubNav({
  items = defaultItems,
  quoteCtaHref = '/custom-lab',
  quoteCtaLabel = 'Get a quote',
}: StickySubNavProps) {
  const [activeSection, setActiveSection] = useState<string>(items[0]?.id || 'overview');
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 400);

      // Find current section in viewport
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div
      className={`sticky top-[58px] z-40 w-full transition-all duration-200 border-y border-neutral-200/80 dark:border-white/10 ${
        isSticky
          ? 'bg-white/90 dark:bg-[#0B0D10]/90 backdrop-blur-md shadow-precision-xs'
          : 'bg-white/70 dark:bg-[#0B0D10]/70 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12">
        {/* Horizontal Navigation Pills */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {items.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF5A1F] text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Anchored Quote CTA */}
        <div className="flex items-center pl-4 shrink-0">
          <Link
            href={quoteCtaHref}
            className="btn-precision-primary text-[11px] py-1.5 px-3"
          >
            <span>{quoteCtaLabel}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

