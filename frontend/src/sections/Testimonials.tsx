import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Rocket, Cpu, Layers, Box, Zap, HeartHandshake } from 'lucide-react';

interface TestimonialItem {
  id: number;
  quote: string;
  name: string;
  role: string;
  companyName: string;
  location: string;
  avatar: string;
  techSpec: string;
  category: string;
  icon: typeof Rocket;
}

const testimonials: TestimonialItem[] = [
  {
    id: 1,
    quote: 'They tailor their additive solutions to our micron tolerances. The Carbon-X drone brackets replaced CNC aluminum with a 62% weight reduction and zero delamination under high-G shock loads.',
    name: 'Dr. Vikram Singhania',
    role: 'VP of Hardware Engineering',
    companyName: 'SkyVolt Avionics',
    location: 'Bengaluru, India',
    avatar: '/avatar4.jpg',
    techSpec: 'CARBON-X FDM • 36H DISPATCH',
    category: 'AVIONICS & UAV',
    icon: Rocket,
  },
  {
    id: 2,
    quote: 'They organized our batch production sprint and internal dispatch management was outstanding. 48 functional CoreXY production parts delivered dimensionally spot-on on the very first pass.',
    name: 'Arjun Mehta',
    role: 'Director of Prototyping',
    companyName: 'Hyperion Dynamics',
    location: 'Pune, India',
    avatar: '/avatar5.jpg',
    techSpec: 'INDUSTRIAL NYLON-CF12 • 48-PART BATCH',
    category: 'AUTOMOTIVE HARDWARE',
    icon: Cpu,
  },
  {
    id: 3,
    quote: 'Working with Saturn 3D was a flawless experience from direct CAD upload to delivery. High-resolution resin captured micro surgical guide geometry with true injection-mold surface finish.',
    name: 'Dr. Neha Kapoor',
    role: 'Chief Medical Device Lead',
    companyName: 'BioMatrix Ortho',
    location: 'Mumbai, India',
    avatar: '/avatar6.jpg',
    techSpec: 'SLA HIGH-RES RESIN • 25-MICRON LAYER',
    category: 'BIOMEDICAL DEVICES',
    icon: ShieldCheck,
  },
  {
    id: 4,
    quote: 'The turnaround speed from STEP upload to high-tensile ULTEM manifolds in our hands within 48 hours accelerated our thermal testing cycle by an entire production quarter.',
    name: 'Marcus Vance',
    role: 'Head of Additive Manufacturing',
    companyName: 'Kinetix Automation',
    location: 'Munich & Delhi',
    avatar: '/avatar2.jpg',
    techSpec: 'AEROSPACE ULTEM 9085 • 180°C HDT',
    category: 'INDUSTRIAL AUTOMATION',
    icon: Box,
  },
  {
    id: 5,
    quote: 'Their micro-kinetic architectural facade prints captured complex organic algorithms with zero stepping artifacts. Direct nationwide white-glove logistics was seamless.',
    name: 'Anya Shenoy',
    role: 'Principal Design Architect',
    companyName: 'Forma Spatial Labs',
    location: 'Hyderabad, India',
    avatar: '/avatar3.jpg',
    techSpec: 'OPTICAL CLEAR RESIN • UV ANNEALED',
    category: 'PARAMETRIC FACADES',
    icon: Layers,
  },
  {
    id: 6,
    quote: 'We validated three ergonomic enclosure iterations in one week. The matte finish and snap-fit flexural hinges behaved identically to final production injection-molded ABS.',
    name: 'Rhea Chawla',
    role: 'Lead Industrial Designer',
    companyName: 'OmniPulse Tech',
    location: 'Bengaluru, India',
    avatar: '/avatar1.jpg',
    techSpec: 'INDUSTRIAL TOUGH RESIN • SNAP-FIT READY',
    category: 'CONSUMER ELECTRONICS',
    icon: Zap,
  },
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Update arrow availability
  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll]);

  // Smooth scroll handler
  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.querySelector<HTMLElement>('[data-testimonial-card]');
    const cardWidth = card ? card.offsetWidth + 24 : 420;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (direction === 'right' && container.scrollLeft >= maxScroll - 20) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (direction === 'left' && container.scrollLeft <= 20) {
      container.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, []);

  // Smooth Autoplay interval: advances every 3.8s when not hovered or touched
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const container = scrollRef.current;
      const card = container.querySelector<HTMLElement>('[data-testimonial-card]');
      const cardWidth = card ? card.offsetWidth + 24 : 420;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll - 20) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section 
      id="testimonials" 
      className="w-full bg-[#EDEDED] border-y border-black/10 py-16 sm:py-24 px-4 sm:px-8 lg:px-14 relative overflow-hidden select-none"
    >
      <div className="w-full max-w-[1680px] mx-auto">
        
        {/* -----------------------------------------------------------------
            Header Row: Brand index, Title matching reference with Saturn Orange highlight & Arrows
        ----------------------------------------------------------------- */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14 pb-8 border-b border-black/10">
          <div className="space-y-3">
            {/* Minimalist Subtitle matching reference: OUR REVIEWS */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F7931E] animate-pulse" />
              <span className="font-mono-tech text-xs font-bold uppercase tracking-[0.24em] text-neutral-500">
                OUR REVIEWS
              </span>
            </div>

            {/* Clean Editorial Title matching reference image layout */}
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.05]">
              What Our <span className="text-[#F7931E]">Clients</span> Say
            </h2>
          </div>

          {/* Minimalist Black Circular Navigation Arrows exactly matching reference image */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full bg-black text-white hover:bg-[#F7931E] hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 shadow-md group"
              aria-label="Previous review"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full bg-black text-white hover:bg-[#F7931E] hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 shadow-md group"
              aria-label="Next review"
            >
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            Interactive Autoplay Reviews Carousel
        ----------------------------------------------------------------- */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex items-stretch gap-6 sm:gap-8 overflow-x-auto scrollbar-none scroll-smooth pb-4 -mx-2 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                data-testimonial-card
                className="w-[320px] sm:w-[380px] lg:w-[410px] flex-shrink-0 flex flex-col justify-between rounded-[32px] sm:rounded-[36px] bg-white border border-black/[0.07] p-7 sm:p-9 shadow-sm hover:shadow-xl hover:border-[#F7931E]/40 hover:-translate-y-1 transition-all duration-300 relative group"
              >
                <div>
                  {/* Top Row: Avatar on Left + Company Pill Badge on Right */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    {/* Client Avatar with Ring */}
                    <div className="w-12 h-12 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] rounded-full overflow-hidden border border-black/10 shadow-2xs shrink-0 bg-neutral-100 group-hover:ring-2 group-hover:ring-[#F7931E]/40 transition-all">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-full h-full object-cover block rounded-full"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = '/avatar1.jpg';
                        }}
                      />
                    </div>

                    {/* Company Pill Badge with Icon */}
                    <div className="rounded-full border border-black/10 bg-[#FAFAFA] px-4 py-1.5 flex items-center gap-2 shadow-2xs group-hover:border-[#F7931E]/30 group-hover:bg-white transition-all">
                      <Icon className="w-3.5 h-3.5 text-[#F7931E]" />
                      <span className="font-heading text-xs font-bold text-neutral-800 tracking-wide uppercase">
                        {item.companyName}
                      </span>
                    </div>
                  </div>

                  {/* Additive Manufacturing Tech Spec Badge */}
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-orange-50/90 border border-orange-200/80 px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F7931E]" />
                    <span className="font-mono-tech text-[10px] font-bold text-[#F7931E] uppercase tracking-wider">
                      {item.techSpec}
                    </span>
                  </div>

                  {/* Stylized Quote Mark matching reference */}
                  <div className="mb-3 text-[#F7931E]">
                    <svg
                      className="w-7 h-7 opacity-90"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Main Client Quote Statement with Modern Headline Hierarchy */}
                  <p className="font-heading text-[18px] sm:text-[20px] font-semibold text-neutral-900 leading-[1.4] tracking-[-0.015em]">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Bottom Card Footer: Author Signature with Saturn Orange Accent Bar matching reference */}
                <div className="mt-8 pt-5 border-t border-black/5 flex items-end justify-between gap-3">
                  <div className="border-l-2 border-[#F7931E] pl-3.5 space-y-0.5">
                    <h4 className="font-heading text-sm font-bold text-neutral-950 tracking-tight">
                      {item.name}
                    </h4>
                    <p className="font-mono-tech text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                      {item.role}
                    </p>
                    <p className="font-mono-tech text-[9px] text-neutral-400 font-normal">
                      {item.location}
                    </p>
                  </div>

                  {/* Verified Order Tag */}
                  <span className="rounded-full bg-emerald-50 border border-emerald-200/90 px-2.5 py-1 text-[8px] sm:text-[9px] font-mono-tech font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1 shadow-2xs flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Order
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

