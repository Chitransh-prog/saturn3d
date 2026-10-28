import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Minus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FAQItem {
  tag: string;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
}

const faqs: FAQItem[] = [
  {
    tag: 'Pricing & Cost',
    question: 'How much does custom 3D printing cost in India and what drives the price?',
    shortAnswer: 'In India, custom 3D printing typically costs between ₹3.50 to ₹18 per gram for standard FDM polymers (PLA/PETG), ₹15 to ₹35 per ml for precision SLA resin, and ₹25 to ₹65 per gram for Carbon-X PA12 engineering nylon.',
    detailedAnswer: 'Final pricing is determined by four verifiable factors: (1) Material mass and volume, (2) Machine runtime based on layer height (e.g. 0.1mm vs 0.2mm), (3) Infill density percentage (15% for aesthetic models vs 60%+ for structural mounts), and (4) Secondary support removal and post-curing. Saturn 3D provides transparent pricing with no hidden setup surcharges and volume discounts up to 35% for batch production.',
  },
  {
    tag: 'CAD File Prep',
    question: 'What CAD file formats do you accept, and how should I export them?',
    shortAnswer: 'We accept 3D formats (.STEP, .STP, .STL, .OBJ, .GLB, .GLTF, .3MF) and 2D blueprints or reference images (.JPG, .JPEG, .PNG, .WEBP, .SVG).',
    detailedAnswer: 'Exporting as STEP or STP preserves the original mathematical NURBS curvature of your model, eliminating faceted polygon edges. STL, OBJ, and GLB files are parsed directly client-side in our real-time 3D viewer. For custom modeling or reverse engineering from physical parts, you can also upload high-resolution 2D reference photos or blueprints in JPG or PNG format.',
  },
  {
    tag: 'Technology Selection',
    question: 'What is the practical difference between FDM and SLA Resin printing?',
    shortAnswer: 'FDM is ideal for durable, structural parts and larger enclosures in tough thermoplastics. SLA Resin delivers injection-mold surface smoothness and micron-level detail for intricate or micro-fluidic geometries.',
    detailedAnswer: 'Choose FDM (Fused Deposition Modeling) when you need functional impact resistance, snap-fit clips, large build volumes (up to 350×350×400mm), or high continuous temperatures (ABS/Carbon-X up to 145°C). Choose SLA (Stereolithography) when layer lines must be imperceptible (<25μm), such as for jewelry masters, dental/medical anatomical replicas, or optical mockups.',
  },
  {
    tag: 'Tolerances & Quality',
    question: 'What tolerances and layer resolutions can Saturn 3D achieve?',
    shortAnswer: 'We guarantee dimensional tolerances down to ±0.04mm on SLA resin components and ±0.08mm to ±0.15mm on calibrated industrial FDM printers.',
    detailedAnswer: 'Our print farm utilizes active heated chambers, dual closed-loop linear motors, and laser-guided bed leveling to prevent thermal warping. Critical bore holes and pin joints are dimensionally compensated to account for isotropic polymer shrinkage.',
  },
  {
    tag: 'Lead Time & Shipping',
    question: 'What is the typical turnaround and delivery time to Indian cities?',
    shortAnswer: 'Standard prototype fabrication takes 24 to 48 hours. Express same-day production is available for urgent engineering sprints.',
    detailedAnswer: 'Once fabrication passes QA inspection, parts are vacuum-sealed with desiccant and dispatched via insured air express courier. Transit time is 24 hours to major metros including Mumbai, Delhi-NCR, Bengaluru, Pune, Hyderabad, and Indore, and 48 hours for tier-2/3 industrial hubs.',
  },
  {
    tag: 'Local Presence',
    question: 'Where is Saturn 3D based and do you support local pickups?',
    shortAnswer: 'Saturn 3D is headquartered in Govindpura Industrial Area, Bhopal, Madhya Pradesh (PIN 462023). We welcome same-day local pickups.',
    detailedAnswer: 'Centrally located in Bhopal, we serve as an agile manufacturing partner for local engineering colleges (MANIT Bhopal, IISER, AIIMS) as well as the Mandideep, Govindpura, and Pithampur industrial corridors, with overnight freight connectivity across India.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const tags = ['All', 'Pricing & Cost', 'CAD File Prep', 'Technology Selection', 'Tolerances & Quality', 'Lead Time & Shipping'];

  const filteredFaqs = selectedTag === 'All'
    ? faqs
    : faqs.filter((f) => f.tag === selectedTag);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [selectedTag]);

  return (
    <section
      id="faq"
      ref={sectionRef}
      data-bg="#FAF7F2"
      data-fg="#0B0B0B"
      className="relative w-full bg-[#FAF7F2] text-[#0B0B0B] section-padding px-6 sm:px-10 lg:px-16 overflow-hidden hairline-t"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div data-aos="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="type-mono-eyebrow text-[#0B0B0B]/70">
                09 // KNOWLEDGE BASE & TRANSPARENCY
              </span>
              <span className="sticker-minimal">
                FAQ
              </span>
            </div>

            <div className="line-reveal-mask">
              <h2 className="type-h2 text-[#0B0B0B]">
                FREQUENTLY
              </h2>
            </div>
            <div className="line-reveal-mask">
              <h2 className="type-h2 text-[#FF5A1F]">
                ANSWERED.
              </h2>
            </div>
          </div>

          <p className="type-body text-[#0B0B0B]/75 max-w-md font-semibold">
            Clear, verifiable answers on custom 3D printing costs in India, tolerances,
            material selections, and express dispatch.
          </p>
        </div>

        {/* Filter Underline Tabs (Scrollable on mobile) */}
        <div className="flex items-center gap-6 mb-8 sm:mb-10 font-mono text-xs font-bold uppercase tracking-wider hairline-b pb-4 overflow-x-auto no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0 whitespace-nowrap">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`relative pb-2 transition-all cursor-pointer shrink-0 ${
                selectedTag === t
                  ? 'text-[#FF5A1F] after:w-full'
                  : 'text-[#0B0B0B]/60 hover:text-[#0B0B0B] after:w-0'
              } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#FF5A1F] after:transition-all`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Hairline Accordion (De-boxed!) */}
        <div className="space-y-0 hairline-t">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                data-aos="fade-up"
                data-aos-delay={(idx % 4) * 60}
                className="faq-item hairline-b transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-6 text-left flex items-start justify-between gap-6 cursor-pointer group"
                >
                  <div className="flex items-start gap-4 sm:gap-6 flex-1">
                    <span className="font-mono text-xs font-bold text-[#FF5A1F] mt-1 shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="font-display text-lg sm:text-xl font-bold uppercase text-[#0B0B0B] group-hover:text-[#FF5A1F] transition-colors leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-none border border-ink/30 flex items-center justify-center shrink-0 group-hover:border-[#FF5A1F] transition-colors">
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-[#FF5A1F]" />
                    ) : (
                      <Plus className="w-4 h-4 text-[#0B0B0B]" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="pb-8 pl-8 sm:pl-12 max-w-3xl space-y-4 font-body text-base text-[#0B0B0B]/80 leading-relaxed">
                    <p className="font-semibold text-[#0B0B0B]">
                      {faq.shortAnswer}
                    </p>
                    <p className="text-sm text-[#0B0B0B]/70 leading-relaxed">
                      {faq.detailedAnswer}
                    </p>
                    <div className="pt-2">
                      <span className="font-mono text-[10px] text-[#FF5A1F] uppercase font-bold tracking-wider">
                        TAG // {faq.tag}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
