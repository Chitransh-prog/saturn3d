import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { MessageSquare, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { trackWhatsAppClick } from '@/lib/analytics';

export default function FloatingWhatsApp() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Hidden on admin and checkout routes
  const isHiddenRoute = location.pathname.startsWith('/admin') || location.pathname === '/checkout';

  // Configured WhatsApp number (country code 91, no + sign)
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '917999824632';

  // Context-aware pre-filled message
  const getContextMessage = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://www.saturn3d.in';
    
    if (totalItems > 0) {
      const itemSummaries = items.slice(0, 3).map((it) => `${it.quantity}x ${it.name}`).join(', ');
      return `Hi Saturn 3D, I have ${totalItems} item(s) in my cart (${itemSummaries}) on ${currentUrl}. Can you assist with my quotation?`;
    }

    if (location.pathname.startsWith('/categories/')) {
      return `Hi Saturn 3D, I am interested in this component specification on ${currentUrl}.`;
    }

    if (location.pathname === '/custom-lab') {
      return `Hi Saturn 3D, I am configuring a custom CAD file in the Custom Lab on ${currentUrl}. Can an engineer review my tolerances?`;
    }

    if (location.pathname.startsWith('/category/')) {
      const sector = location.pathname.split('/').pop()?.replace(/-/g, ' ');
      return `Hi Saturn 3D, I am inquiring about 3D printing solutions for ${sector} on ${currentUrl}.`;
    }

    return `Hi Saturn 3D, I would like to inquire about your precision additive manufacturing services on ${currentUrl}.`;
  };

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(getContextMessage())}`;

  useEffect(() => {
    if (isHiddenRoute) return;

    // Check if reduced motion is requested
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // GSAP entrance after ~2s
    const ctx = gsap.context(() => {
      gsap.fromTo(
        buttonRef.current,
        {
          opacity: 0,
          scale: 0.4,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: prefersReducedMotion ? 0.2 : 0.8,
          delay: 1.8,
          ease: 'back.out(1.8)',
          onComplete: () => {
            // Show initial greeting tooltip for 4.5 seconds
            setShowTooltip(true);
            const hideTimer = setTimeout(() => {
              setShowTooltip(false);
            }, 5000);
            return () => clearTimeout(hideTimer);
          },
        }
      );
    });

    return () => ctx.revert();
  }, [isHiddenRoute]);

  const handleClick = () => {
    trackWhatsAppClick('floating_widget');
  };

  if (isHiddenRoute) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 select-none"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      {/* Tooltip on First Visit or Hover */}
      {(showTooltip || isHovered) && (
        <div
          ref={tooltipRef}
          className="hidden sm:flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-3.5 py-2 rounded-2xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-right-3 duration-300"
        >
          <span>Chat with engineering</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white p-0.5"
            aria-label="Close tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 56px Circular WhatsApp Button */}
      <a
        ref={buttonRef}
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Chat with Saturn 3D on WhatsApp"
        className="relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-hidden focus:ring-4 focus:ring-[#25D366]/50 group"
      >
        {/* Subtle Periodic Pulse Ring (respecting prefers-reduced-motion) */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 motion-safe:animate-ping pointer-events-none" />

        {/* WhatsApp Official Style Icon */}
        <svg
          viewBox="0 0 24 24"
          width="30"
          height="30"
          stroke="currentColor"
          strokeWidth="0"
          fill="currentColor"
          className="drop-shadow-xs transition-transform duration-300 group-hover:scale-110"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.34C9.36 7.34 9.09 7.4 8.87 7.65C8.65 7.89 8.02 8.48 8.02 9.7C8.02 10.92 8.91 12.1 9.03 12.26C9.15 12.43 10.74 14.96 13.25 15.96C15.35 16.79 15.77 16.63 16.23 16.59C16.69 16.55 17.7 15.98 17.91 15.38C18.12 14.79 18.12 14.29 18.06 14.18C18 14.07 17.83 14.01 17.58 13.88C17.33 13.76 16.1 13.15 15.87 13.07C15.65 12.98 15.48 12.94 15.31 13.19C15.14 13.44 14.67 14.01 14.52 14.18C14.37 14.35 14.23 14.37 13.98 14.24C13.73 14.12 12.93 13.86 11.98 13.01C11.24 12.35 10.74 11.53 10.6 11.28C10.45 11.03 10.58 10.89 10.71 10.77C10.82 10.66 10.96 10.48 11.08 10.33C11.21 10.18 11.25 10.08 11.33 9.91C11.42 9.74 11.38 9.6 11.31 9.47C11.25 9.35 10.74 8.1 10.53 7.59C10.33 7.09 10.12 7.16 9.96 7.15C9.81 7.15 9.64 7.14 9.53 7.34Z" />
        </svg>
      </a>
    </div>
  );
}
