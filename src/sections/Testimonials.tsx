import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

/* ─── 1. ORIGAMI FOLDED CORNER ARROW STICKER ─── */
interface OrigamiArrowProps {
  color?: 'blue' | 'orange' | 'yellow' | 'pink';
  position?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left' | 'left' | 'right' | 'custom';
  className?: string;
}

export function OrigamiArrow({
  color = 'blue',
  position = 'top-left',
  className = '',
}: OrigamiArrowProps) {
  const palette = {
    blue: { main: '#5B7FFF', fold: '#2A4CC7' },
    orange: { main: '#FF5A1F', fold: '#C93B08' },
    yellow: { main: '#FFE14D', fold: '#D4B200' },
    pink: { main: '#FF85C0', fold: '#D94D93' },
  }[color];

  const posClass = {
    'top-left': 'absolute -top-3 -left-3 rotate-[-15deg]',
    'top-right': 'absolute -top-3 -right-3 rotate-[75deg]',
    'bottom-right': 'absolute -bottom-3 -right-3 rotate-[165deg]',
    'bottom-left': 'absolute -bottom-3 -left-3 rotate-[-105deg]',
    'left': 'absolute -left-3.5 top-1/2 -translate-y-1/2 rotate-[-45deg]',
    'right': 'absolute -right-3.5 top-1/2 -translate-y-1/2 rotate-[135deg]',
    'custom': '',
  }[position];

  return (
    <div
      className={`pointer-events-none select-none z-20 transition-transform duration-300 group-hover:scale-110 ${posClass} ${className}`}
      aria-hidden="true"
    >
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" className="filter drop-shadow-xs">
        {/* Main arrowhead body */}
        <polygon
          points="4,6 30,14 18,18 14,30"
          fill={palette.main}
          stroke="#0B0B0B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Folded corner tab */}
        <polygon
          points="18,18 30,14 22,8"
          fill={palette.fold}
          stroke="#0B0B0B"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ─── 2. VINTAGE RUBBER HATCH STAMP SEAL ─── */
export function HatchSeal({
  rotation = 12,
  className = '',
}: {
  rotation?: number;
  className?: string;
}) {
  return (
    <div
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`pointer-events-none select-none z-20 text-ink/75 transition-transform duration-300 group-hover:rotate-[22deg] ${className}`}
      aria-hidden="true"
    >
      <svg width="46" height="46" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="20" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="22" cy="22" r="16" stroke="currentColor" strokeWidth="1" strokeDasharray="2.5 2.5" />
        {/* Diagonal hatches */}
        <line x1="11" y1="16" x2="33" y2="28" stroke="currentColor" strokeWidth="1.25" />
        <line x1="13" y1="11" x2="31" y2="33" stroke="currentColor" strokeWidth="1.25" />
        <line x1="9" y1="22" x2="35" y2="22" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="22" cy="22" r="4.5" fill="white" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="22" cy="22" r="1.75" fill="currentColor" />
      </svg>
    </div>
  );
}

/* ─── 3. SPARKLE STARBURST ─── */
export function SparkleDeco({
  size = 28,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      className={`pointer-events-none select-none text-ink/70 ${className}`}
      aria-hidden="true"
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

/* ─── 4. 5 SOLID BLACK STARS ─── */
export function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-1 text-[#0B0B0B]" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── 5. SATURN PLANET EMBLEM ─── */
export function SaturnPlanetIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="44" height="30" viewBox="0 0 42 28" fill="none" className={className} aria-hidden="true">
      {/* Elliptical ring back */}
      <ellipse cx="21" cy="14" rx="19" ry="6" stroke="#0B0B0B" strokeWidth="2" strokeDasharray="3 0" />
      {/* Planet sphere */}
      <circle cx="21" cy="14" r="8" fill="#FFE14D" stroke="#0B0B0B" strokeWidth="2" />
      {/* Front half of ring */}
      <path d="M4 14C4 17.5 11.6 20 21 20C30.4 20 38 17.5 38 14" stroke="#0B0B0B" strokeWidth="2" />
      {/* Sparkle */}
      <path d="M35 3L36 6L39 7L36 8L35 11L34 8L31 7L34 6L35 3Z" fill="#FF5A1F" />
    </svg>
  );
}

/* ─── MAIN NEO-BRUTALIST TESTIMONIALS SECTION ─── */
interface TestimonialsProps {
  standalone?: boolean;
}

export default function Testimonials({ standalone = false }: TestimonialsProps) {
  return (
    <section className={`w-full ${standalone ? 'py-20 px-4 sm:px-6 lg:px-12 bg-[#FAF5EC] border-b-3 border-ink' : ''}`}>
      <div className="max-w-7xl mx-auto">

        {/* Header Bar */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-[#FF5A1F] border-2 border-black flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-mono text-xs font-black uppercase tracking-wider text-ink block">
                VERIFIED OPERATOR AUDITS // BENCHMARK REPORTS
              </span>
              <span className="font-mono text-[11px] text-ink/70">
                Direct feedback from aerospace directors, robotics leads &amp; biomedical architects
              </span>
            </div>
          </div>
          <span className="self-start sm:self-auto font-mono text-xs font-black text-[#FF5A1F] bg-[#FFF4E0] border-2 border-ink px-3 py-1 rounded-xs shadow-xs">
            100% RETENTION &bull; 0 DELAMINATION &bull; ISO 9001
          </span>
        </div>

        {/* ─── NEO-BRUTALISM TESTIMONIAL CARDS MASONRY / GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">

          {/* ─────────────────────────────────────────────────────────────
              CARD 1: Dr. Vikram Singhania
              ARCHETYPE A: Arched alcove portrait with yellow background,
              blue corner arrow, stamped hatch seal, 5 stars, quote.
          ───────────────────────────────────────────────────────────── */}
          <div data-aos="fade-up" data-aos-delay="0" className="group relative bg-white border-2 border-black rounded-2xl p-6 sm:p-7 shadow-brutal-sm hover:shadow-brutal hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center">
            {/* Origami folded corner arrow sticker */}
            <OrigamiArrow color="blue" position="top-left" />

            {/* Circular hatch seal overlapping right edge */}
            <HatchSeal rotation={16} className="absolute -right-3.5 top-28" />

            {/* Arched alcove portrait */}
            <div className="w-32 h-36 bg-[#FFE14D] border-2 border-black rounded-t-full rounded-b-md overflow-hidden relative mb-4 p-1 flex items-end justify-center shadow-inner">
              <img
                src="/avatar4.jpg"
                alt="Dr. Vikram Singhania"
                className="w-full h-full object-cover object-top rounded-t-full rounded-b-xs"
              />
            </div>

            {/* Author Name */}
            <h3 className="font-mono text-base font-black text-ink tracking-tight mb-0.5 flex items-center gap-1.5 justify-center">
              <span>Dr. Vikram Singhania</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            </h3>
            <span className="font-mono text-[11px] font-bold text-ink/70 uppercase tracking-wider mb-2.5">
              VP Hardware &bull; SkyVolt Avionics
            </span>

            {/* 5 Stars */}
            <div className="mb-3">
              <StarRating count={5} />
            </div>

            {/* Quote */}
            <p className="font-mono text-xs sm:text-[13px] text-ink/90 font-medium leading-relaxed">
              &ldquo;They tailor their additive solutions to our micron tolerances. The Carbon-X drone brackets replaced CNC aluminum with a 62% weight reduction and zero delamination under high-G dynamic shock loads.&rdquo;
            </p>

            {/* Spec Tag */}
            <div className="mt-4 pt-3 border-t-2 border-black/10 w-full flex items-center justify-between text-[10px] font-mono font-black text-ink/75">
              <span>BENGALURU</span>
              <span className="bg-[#FFE14D] px-2 py-0.5 border border-black rounded-xs">CARBON-X FDM</span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              CARD 2: Arjun Mehta
              ARCHETYPE B: Full photo top in pastel frame with overlapping
              pink pill ribbon name tag, orange corner arrow, quote.
          ───────────────────────────────────────────────────────────── */}
          <div data-aos="fade-up" data-aos-delay="100" className="group relative bg-white border-2 border-black rounded-2xl p-6 sm:p-7 shadow-brutal-sm hover:shadow-brutal hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center">
            {/* Origami folded arrow on left border */}
            <OrigamiArrow color="orange" position="left" className="top-28" />

            {/* Photo frame */}
            <div className="w-full h-40 bg-[#FFF0B8] border-2 border-black rounded-xl overflow-hidden relative p-1 shadow-inner">
              <img
                src="/avatar5.jpg"
                alt="Arjun Mehta"
                className="w-full h-full object-cover object-top rounded-lg"
              />
            </div>

            {/* Overlapping Pink Pill Ribbon Tag */}
            <div className="-mt-4 relative z-10 inline-flex items-center gap-1 bg-[#FF85C0] text-black border-2 border-black font-black text-xs px-4 py-1.5 rounded-full shadow-[2px_2px_0px_#000] uppercase tracking-wider">
              <span>Arjun Mehta</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
            </div>

            <span className="font-mono text-[11px] font-bold text-ink/70 uppercase tracking-wider mt-2 mb-2.5">
              Director Prototyping &bull; Hyperion Dynamics
            </span>

            {/* 5 Stars */}
            <div className="mb-3">
              <StarRating count={5} />
            </div>

            {/* Quote */}
            <p className="font-mono text-xs sm:text-[13px] text-ink/90 font-medium leading-relaxed">
              &ldquo;Highly recommend Saturn 3D for high-speed production sprints. 48 functional CoreXY production parts delivered dimensionally spot-on on the very first pass.&rdquo;
            </p>

            {/* Spec Tag */}
            <div className="mt-4 pt-3 border-t-2 border-black/10 w-full flex items-center justify-between text-[10px] font-mono font-black text-ink/75">
              <span>PUNE</span>
              <span className="bg-[#FF85C0] px-2 py-0.5 border border-black rounded-xs">NYLON-CF12 BATCH</span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              CARD 3: Dr. Neha Kapoor
              ARCHETYPE C: Horizontal split with mint green arched alcove,
              orange corner arrow, sparkle star, 5 stars, quote.
          ───────────────────────────────────────────────────────────── */}
          <div data-aos="fade-up" data-aos-delay="200" className="group relative bg-white border-2 border-black rounded-2xl p-6 sm:p-7 shadow-brutal-sm hover:shadow-brutal hover:-translate-y-1 transition-all duration-200">
            {/* Origami folded arrow at top edge */}
            <OrigamiArrow color="orange" position="top-right" className="-top-3 right-24 rotate-[-30deg]" />

            {/* Sparkle top right */}
            <SparkleDeco size={26} className="absolute top-3 right-3 text-ink" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Left: Mint green arched alcove */}
              <div className="w-24 h-28 bg-[#7CF2C1] border-2 border-black rounded-t-full rounded-b-md overflow-hidden shrink-0 relative p-1 shadow-inner">
                <img
                  src="/avatar6.jpg"
                  alt="Dr. Neha Kapoor"
                  className="w-full h-full object-cover object-top rounded-t-full rounded-b-xs"
                />
              </div>

              {/* Right: Info + quote */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-mono text-base font-black text-ink tracking-tight flex items-center gap-1.5 justify-center sm:justify-start">
                  <span>Dr. Neha Kapoor</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </h3>
                <span className="font-mono text-[11px] font-bold text-ink/70 uppercase tracking-wider block mb-2">
                  Medical Device Lead &bull; BioMatrix Ortho
                </span>
                <div className="flex justify-center sm:justify-start mb-2.5">
                  <StarRating count={5} />
                </div>
                <p className="font-mono text-xs sm:text-[13px] text-ink/90 font-medium leading-relaxed">
                  &ldquo;Working with Saturn 3D was a flawless experience from direct CAD upload to delivery. High-res resin captured micro surgical guide geometry with true injection-mold surface finish.&rdquo;
                </p>
              </div>
            </div>

            {/* Spec Tag */}
            <div className="mt-4 pt-3 border-t-2 border-black/10 w-full flex items-center justify-between text-[10px] font-mono font-black text-ink/75">
              <span>MUMBAI</span>
              <span className="bg-[#7CF2C1] px-2 py-0.5 border border-black rounded-xs">25μm HIGH-RES RESIN</span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              CARD 4: Marcus Vance
              ARCHETYPE D: Tall editorial photo card with yellow backdrop,
              quote, 5 stars, blue folded corner arrow bottom-right.
          ───────────────────────────────────────────────────────────── */}
          <div data-aos="fade-up" data-aos-delay="0" className="group relative bg-white border-2 border-black rounded-2xl p-6 sm:p-7 shadow-brutal-sm hover:shadow-brutal hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
            {/* Origami folded corner arrow at bottom-right */}
            <OrigamiArrow color="blue" position="bottom-right" />

            <div>
              {/* Top photo with yellow backing */}
              <div className="w-full h-44 bg-[#FFE14D] border-2 border-black rounded-xl overflow-hidden relative p-1 mb-4 shadow-inner">
                <img
                  src="/avatar2.jpg"
                  alt="Marcus Vance"
                  className="w-full h-full object-cover object-top rounded-lg"
                />
              </div>

              {/* Quote */}
              <p className="font-mono text-xs sm:text-[13px] text-ink/90 font-medium leading-relaxed mb-4 text-center">
                &ldquo;The turnaround speed from STEP upload to high-tensile ULTEM manifolds in our hands within 48 hours accelerated our thermal testing cycle by an entire production quarter.&rdquo;
              </p>
            </div>

            <div className="flex flex-col items-center text-center pt-2">
              <div className="mb-2">
                <StarRating count={5} />
              </div>
              <h3 className="font-mono text-base font-black text-ink tracking-tight flex items-center gap-1.5">
                <span>Marcus Vance</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </h3>
              <span className="font-mono text-[11px] font-bold text-ink/70 uppercase tracking-wider mb-3">
                Head of Additive &bull; Kinetix Automation
              </span>

              {/* Spec Tag */}
              <div className="pt-3 border-t-2 border-black/10 w-full flex items-center justify-between text-[10px] font-mono font-black text-ink/75">
                <span>MUNICH &amp; DELHI</span>
                <span className="bg-[#FFE14D] px-2 py-0.5 border border-black rounded-xs">AEROSPACE ULTEM 9085</span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              CARD 5: Kabir Sen
              ARCHETYPE E: Horizontal split with right-side sky-blue arch,
              blue arrow sticker, stamped hatch seal over top border.
          ───────────────────────────────────────────────────────────── */}
          <div data-aos="fade-up" data-aos-delay="100" className="group relative bg-white border-2 border-black rounded-2xl p-6 sm:p-7 shadow-brutal-sm hover:shadow-brutal hover:-translate-y-1 transition-all duration-200">
            {/* Stamped seal overlapping top border */}
            <HatchSeal rotation={-8} className="absolute -top-4 right-20" />

            <div className="flex flex-col-reverse sm:flex-row items-center sm:items-start gap-4">
              {/* Left: Info + quote */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-mono text-base font-black text-ink tracking-tight flex items-center gap-1.5 justify-center sm:justify-start">
                  <span>Kabir Sen</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </h3>
                <span className="font-mono text-[11px] font-bold text-ink/70 uppercase tracking-wider block mb-2">
                  Robotics Lead &bull; Novatech Robotics
                </span>
                <div className="flex justify-center sm:justify-start mb-2.5">
                  <StarRating count={5} />
                </div>
                <p className="font-mono text-xs sm:text-[13px] text-ink/90 font-medium leading-relaxed">
                  &ldquo;The kinematic tolerances on our multi-axis robotic end-effectors fit bearing assemblies with zero post-machining. Unmatched consistency across runs.&rdquo;
                </p>
              </div>

              {/* Right: Sky-blue arched alcove with blue arrow */}
              <div className="relative shrink-0">
                <OrigamiArrow color="blue" position="top-left" className="-top-2 -left-2" />
                <div className="w-24 h-28 bg-[#93C5FD] border-2 border-black rounded-t-full rounded-b-md overflow-hidden relative p-1 shadow-inner">
                  <img
                    src="/avatar1.jpg"
                    alt="Kabir Sen"
                    className="w-full h-full object-cover object-top rounded-t-full rounded-b-xs"
                  />
                </div>
              </div>
            </div>

            {/* Spec Tag */}
            <div className="mt-4 pt-3 border-t-2 border-black/10 w-full flex items-center justify-between text-[10px] font-mono font-black text-ink/75">
              <span>CHENNAI</span>
              <span className="bg-[#93C5FD] px-2 py-0.5 border border-black rounded-xs">CORE-XY SLS NYLON</span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              CARD 6: Aditya Varma (David Brown Archetype)
              ARCHETYPE F: Top quote, 5 stars, horizontal divider line with
              circular photo medallion centered right in the middle, seal + sparkle.
          ───────────────────────────────────────────────────────────── */}
          <div data-aos="fade-up" data-aos-delay="200" className="group relative bg-white border-2 border-black rounded-2xl p-6 sm:p-7 shadow-brutal-sm hover:shadow-brutal hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between text-center">
            {/* Stamped seal on left edge */}
            <HatchSeal rotation={-14} className="absolute -left-3.5 top-1/2 -translate-y-1/2" />

            {/* Sparkle on right edge */}
            <SparkleDeco size={28} className="absolute -right-3 top-16 text-ink/70" />

            {/* Top: Quote + Stars */}
            <div>
              <p className="font-mono text-xs sm:text-[13px] text-ink/90 font-medium leading-relaxed mb-3">
                &ldquo;Love the absolute precision of their instant quoting pipeline. We upload complex STEP assemblies, lock our infill density, and receive dispatch tracking the very next morning.&rdquo;
              </p>
              <div className="flex justify-center mb-4">
                <StarRating count={5} />
              </div>
            </div>

            {/* Center Divider with Circular Avatar Medallion */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full h-[2px] bg-black" />
              <div className="absolute w-14 h-14 rounded-full border-2 border-black overflow-hidden bg-[#FFE14D] p-0.5 shadow-[2px_2px_0px_#000]">
                <img
                  src="/avatar3.jpg"
                  alt="Aditya Varma"
                  className="w-full h-full object-cover object-top rounded-full"
                />
              </div>
            </div>

            {/* Bottom: Name & Role */}
            <div className="pt-2">
              <h3 className="font-mono text-base font-black text-ink tracking-tight flex items-center gap-1.5 justify-center">
                <span>Aditya Varma</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </h3>
              <span className="font-mono text-[11px] font-bold text-ink/70 uppercase tracking-wider block mb-3">
                Lead Mechatronics &bull; AgniAero
              </span>

              {/* Spec Tag */}
              <div className="pt-3 border-t-2 border-black/10 w-full flex items-center justify-between text-[10px] font-mono font-black text-ink/75">
                <span>HYDERABAD</span>
                <span className="bg-[#FFE14D] px-2 py-0.5 border border-black rounded-xs">AEROSPACE PEEK 280°C</span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              CARD 7: Smith Defense & Aerospace
              ARCHETYPE G: Wide card, quote, 5 stars, stamped seal on bottom right,
              stacked verified operator avatars badge.
          ───────────────────────────────────────────────────────────── */}
          <div data-aos="fade-up" data-aos-delay="0" className="group relative bg-white border-2 border-black rounded-2xl p-6 sm:p-7 shadow-brutal-sm hover:shadow-brutal hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
            {/* Stamped seal on bottom right border */}
            <HatchSeal rotation={18} className="absolute -bottom-3 -right-3" />

            <div>
              <p className="font-mono text-xs sm:text-[13px] text-ink/90 font-medium leading-relaxed mb-4 text-center">
                &ldquo;The automated CMM inspection logs and density reports are invaluable for keeping our flight hardware certified. Can't imagine our hardware verification sprint without Saturn 3D!&rdquo;
              </p>

              <div className="flex justify-center mb-3">
                <StarRating count={5} />
              </div>

              <div className="text-center mb-3">
                <h3 className="font-mono text-base font-black text-ink tracking-tight flex items-center gap-1.5 justify-center">
                  <span>Smith Defense &amp; Aerospace</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </h3>
                <span className="font-mono text-[11px] font-bold text-ink/70 uppercase tracking-wider">
                  Precision Flight Hardware &bull; Hyderabad
                </span>
              </div>
            </div>

            {/* Stacked Social Proof Avatars Pill */}
            <div className="pt-3 border-t-2 border-black/10 flex items-center justify-center gap-3">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" src="/avatar1.jpg" alt="" />
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" src="/avatar2.jpg" alt="" />
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" src="/avatar3.jpg" alt="" />
              </div>
              <span className="font-mono text-[10px] font-black text-ink uppercase tracking-wider bg-[#FFF4E0] border border-black px-2 py-0.5 rounded-full">
                +180 BATCH RUNS CERTIFIED
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              CARD 8: Anya Shenoy (Jennifer Davis Archetype)
              ARCHETYPE H: Floating circular avatar medallion overlapping top
              border, giant editorial quotation marks, centered quote, stars, seal.
          ───────────────────────────────────────────────────────────── */}
          <div data-aos="fade-up" data-aos-delay="100" className="group relative bg-white border-2 border-black rounded-2xl p-6 sm:p-7 pt-9 shadow-brutal-sm hover:shadow-brutal hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center">
            {/* Floating circular avatar medallion overlapping top border */}
            <div className="w-14 h-14 rounded-full border-2 border-black absolute -top-7 left-1/2 -translate-x-1/2 bg-[#FF85C0] p-0.5 z-10 overflow-hidden shadow-[2px_2px_0px_#000]">
              <img
                src="/avatar6.jpg"
                alt="Anya Shenoy"
                className="w-full h-full object-cover object-top rounded-full"
              />
            </div>

            {/* Stamped seal on right border */}
            <HatchSeal rotation={10} className="absolute -right-3 top-16" />

            {/* Giant quotation marks */}
            <div className="w-full flex items-center justify-between text-ink/30 font-serif text-3xl font-black select-none -mt-2 mb-1 px-2">
              <span>&ldquo;</span>
              <span>&rdquo;</span>
            </div>

            {/* Quote */}
            <p className="font-mono text-xs sm:text-[13px] text-ink/90 font-medium leading-relaxed mb-4">
              &ldquo;Their micro-kinetic architectural facade prints captured complex organic algorithms with zero stepping artifacts. Direct nationwide white-glove logistics was seamless.&rdquo;
            </p>

            {/* 5 Stars */}
            <div className="mb-3">
              <StarRating count={5} />
            </div>

            {/* Name & Role */}
            <h3 className="font-mono text-base font-black text-ink tracking-tight flex items-center gap-1.5 justify-center">
              <span>Anya Shenoy</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            </h3>
            <span className="font-mono text-[11px] font-bold text-ink/70 uppercase tracking-wider mb-3">
              Principal Architect &bull; Forma Spatial Labs
            </span>

            {/* Spec Tag */}
            <div className="pt-3 border-t-2 border-black/10 w-full flex items-center justify-between text-[10px] font-mono font-black text-ink/75">
              <span>HYDERABAD</span>
              <span className="bg-[#FF85C0] px-2 py-0.5 border border-black rounded-xs">OPTICAL CLEAR RESIN</span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              CARD 9: Rhea Chawla (Daniel Martinez Archetype)
              ARCHETYPE I: Horizontal split, square framed photo with yellow
              folded origami arrow on its edge pointing to quote, stars, name.
          ───────────────────────────────────────────────────────────── */}
          <div data-aos="fade-up" data-aos-delay="200" className="group relative bg-white border-2 border-black rounded-2xl p-6 sm:p-7 shadow-brutal-sm hover:shadow-brutal hover:-translate-y-1 transition-all duration-200">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Left: Square framed photo with yellow corner arrow */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#FFE14D] border-2 border-black rounded-xl overflow-hidden p-1 shadow-inner">
                  <img
                    src="/avatar5.jpg"
                    alt="Rhea Chawla"
                    className="w-full h-full object-cover object-top rounded-lg"
                  />
                </div>
                {/* Yellow folded arrow pointing right towards the quote */}
                <OrigamiArrow color="yellow" position="right" className="top-1/2 -right-3" />
              </div>

              {/* Right: Info + quote */}
              <div className="flex-1 text-center sm:text-left">
                <p className="font-mono text-xs sm:text-[13px] text-ink/90 font-medium leading-relaxed mb-3">
                  &ldquo;We validated three ergonomic enclosure iterations in one week. The matte finish and snap-fit flexural hinges behaved identically to final production injection-molded ABS.&rdquo;
                </p>
                <div className="flex justify-center sm:justify-start mb-2.5">
                  <StarRating count={5} />
                </div>
                <h3 className="font-mono text-base font-black text-ink tracking-tight flex items-center gap-1.5 justify-center sm:justify-start">
                  <span>Rhea Chawla</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </h3>
                <span className="font-mono text-[11px] font-bold text-ink/70 uppercase tracking-wider">
                  Lead Industrial Designer &bull; OmniPulse Tech
                </span>
              </div>
            </div>

            {/* Spec Tag */}
            <div className="mt-4 pt-3 border-t-2 border-black/10 w-full flex items-center justify-between text-[10px] font-mono font-black text-ink/75">
              <span>BENGALURU</span>
              <span className="bg-[#FFE14D] px-2 py-0.5 border border-black rounded-xs">TOUGH RESIN SNAP-FIT</span>
            </div>
          </div>

        </div>

        {/* ─── BOTTOM NEO-BRUTALISM TEMPLATE EMBLEM / FOOTER ─── */}
        <div className="mt-12 pt-8 border-t-2 border-black/15 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <SaturnPlanetIcon />
            <div>
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-ink/60 block">
                NEO-BRUTALISM
              </span>
              <span className="font-mono text-lg font-black text-ink tracking-tight block">
                Testimonial Cards Template
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SparkleDeco size={22} className="text-[#FF5A1F]" />
            <span className="font-mono text-xs font-black text-ink uppercase tracking-wider">
              100% GENUINE INDIAN HARDWARE OPERATOR BENCHMARKS
            </span>
            <SparkleDeco size={22} className="text-[#5B7FFF]" />
          </div>
        </div>

      </div>
    </section>
  );
}
