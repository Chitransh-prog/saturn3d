import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const partners = [
  'DRDO LABS // DEFENSE PROTOCOLS',
  'ISRO COMPONENT VENDORS',
  'AEROSPACE DRONE CELLS',
  'AUTOMOTIVE EV MANIFOLDS',
  'BHOPAL ADDITIVE BATCH HUB',
  'PRECISION ROBOTICS INDIA',
  'BIOMEDICAL SCALE IMPLANTS',
  'KINETIC FACADE ARCHITECTURE',
];

export default function LogoTicker() {
  const sectionRef = useRef<HTMLElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scrollVelocity = 0;
    let lastScrollTop = 0;

    const updateVelocity = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      scrollVelocity = st - lastScrollTop;
      lastScrollTop = st;

      if (tickerRef.current) {
        const currentAnimation = gsap.getTweensOf(tickerRef.current);
        if (currentAnimation.length > 0) {
          const boost = Math.min(3, 1 + Math.abs(scrollVelocity) * 0.05);
          gsap.to(currentAnimation[0], {
            timeScale: boost,
            duration: 0.3,
            ease: 'power1.out',
          });
        }
      }
    };

    window.addEventListener('scroll', updateVelocity, { passive: true });
    return () => window.removeEventListener('scroll', updateVelocity);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#FFE14D] hairline-t-ink hairline-b-ink py-3.5 relative overflow-hidden select-none z-10"
      aria-label="Industry Verification Marquee"
    >
      <div className="flex overflow-hidden py-0.5">
        <div ref={tickerRef} className="flex ticker-animation gap-10 sm:gap-14 items-center whitespace-nowrap">
          {[...partners, ...partners, ...partners].map((item, index) => (
            <div key={index} className="flex items-center gap-4 shrink-0">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0B0B0B]">
                {item}
              </span>
              <span className="w-1.5 h-1.5 bg-[#FF5A1F] rounded-none inline-block" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
