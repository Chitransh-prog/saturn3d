import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    shortAnswer: 'In India, custom 3D printing typically costs between ₹4.50 to ₹18 per gram for standard polymers (PLA/PETG), ₹14 to ₹35 per ml for precision SLA resin, and ₹26 to ₹65 per gram for Carbon-X PA12 engineering nylon.',
    detailedAnswer: 'Final pricing is determined by four verifiable factors: (1) Material mass and volume, (2) Machine runtime based on layer height (e.g. 0.05mm vs 0.20mm), (3) Infill density percentage (15% for aesthetic mockups vs 60%+ for structural mounts), and (4) Secondary support removal, thermal annealing, and UV post-curing. Saturn 3D provides transparent automated pricing with zero hidden machine calibration fees and volume discounts up to 32% for production runs.',
  },
  {
    tag: 'CAD File Prep',
    question: 'What CAD file formats do you accept, and how should I export them?',
    shortAnswer: 'We accept 3D CAD formats (.STEP, .STP, .STL, .OBJ, .GLB, .3MF) and 2D engineering blueprints (.PNG, .JPG, .PDF).',
    detailedAnswer: 'Exporting as STEP or STP preserves the original mathematical NURBS curvature of your model, eliminating faceted polygon chord errors on curved bearings and cylinders. STL, OBJ, and GLB files are parsed directly client-side in our real-time 3D slicer. For custom reverse engineering from physical parts, you can upload dimensioned reference drawings.',
  },
  {
    tag: 'Technology Selection',
    question: 'What is the practical difference between FDM and SLA Resin printing?',
    shortAnswer: 'FDM is ideal for durable, structural parts and larger enclosures in engineering polymers. SLA Resin delivers injection-mold surface smoothness and micron-level detail for intricate or micro-fluidic geometries.',
    detailedAnswer: 'Choose Industrial FDM when you need functional impact resistance, snap-fit latches, large build volumes (up to 350×350×350 mm), or high heat deflection (ABS/Carbon-X up to 150°C). Choose SLA (Stereolithography) when layer lines must be imperceptible (<25µm), such as for fluidic manifolds, dental/medical anatomical replicas, or cosmetic enclosures.',
  },
  {
    tag: 'Tolerances & Quality',
    question: 'What tolerances and layer resolutions can Saturn 3D achieve?',
    shortAnswer: 'We guarantee dimensional tolerances down to ±0.04 mm on precision SLA resin components and ±0.08 mm to ±0.15 mm on calibrated industrial FDM printers.',
    detailedAnswer: 'Our print fleet utilizes active heated chambers, closed-loop linear motors, and laser-guided bed leveling to eliminate thermal warping. Critical bore holes and pin joints are dimensionally compensated to account for isotropic polymer shrinkage.',
  },
  {
    tag: 'Lead Time & Shipping',
    question: 'What is the typical turnaround and delivery time to Indian cities?',
    shortAnswer: 'Standard prototype fabrication takes 24 to 48 hours. Express same-day production is available for urgent engineering sprints.',
    detailedAnswer: 'Once fabrication passes QA inspection, parts are vacuum-sealed with desiccant and dispatched via insured air express courier. Transit time is 24 hours to major metros including Mumbai, Delhi-NCR, Bengaluru, Pune, Hyderabad, and Indore, and 48 hours for tier-2/3 industrial hubs.',
  },
  {
    tag: 'Facility & Location',
    question: 'Where is Saturn 3D based and do you support local pickups?',
    shortAnswer: 'Saturn 3D is headquartered in Govindpura Industrial Area, Bhopal, Madhya Pradesh (PIN 462023). We welcome same-day local pickups.',
    detailedAnswer: 'Centrally located in Bhopal, we serve as an agile manufacturing partner for local engineering colleges (MANIT Bhopal, IISER, AIIMS) as well as the Mandideep, Govindpura, and Pithampur industrial corridors, with overnight air and rail freight connectivity across India.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const navigate = useNavigate();

  const tags = ['All', 'Pricing & Cost', 'CAD File Prep', 'Technology Selection', 'Tolerances & Quality', 'Lead Time & Shipping'];

  const filteredFaqs = selectedTag === 'All'
    ? faqs
    : faqs.filter((f) => f.tag === selectedTag);

  return (
    <section
      id="faq"
      className="w-full bg-[#F5F6F8] text-[#0B0D10] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 overflow-hidden font-body border-t border-black/10"
      aria-label="Frequently Asked Questions"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10 scroll-reveal">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
              <span className="type-mono-eyebrow text-[#5B616B]">
                09 // Knowledge Base
              </span>
            </div>
            <h2 className="type-h2 text-[#0B0D10]">
              Frequently answered questions.
            </h2>
            <p className="type-body text-[#5B616B] mt-2">
              Transparent, verifiable answers on custom 3D printing costs in India, tolerances, material selections, and express dispatch.
            </p>
          </div>

          <div className="precision-badge text-xs shrink-0">
            Additive FAQ &bull; 2026
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 scroll-reveal">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedTag === t
                  ? 'bg-[#0B0D10] text-white shadow-sm'
                  : 'bg-white border border-black/10 text-[#5B616B] hover:text-[#0B0D10] hover:border-black/20'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Precision Hairline Accordion */}
        <div className="card-precision divide-y divide-black/5 overflow-hidden scroll-reveal">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.question} className="transition-colors">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-5 px-6 sm:px-8 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-neutral-50/60 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-xs font-medium text-[#FF5A1F] mt-0.5 shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="text-base sm:text-lg font-semibold text-[#0B0D10] leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div className={`w-7 h-7 rounded-full border border-black/10 flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#FF5A1F] text-white border-transparent' : 'text-[#5B616B]'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-6 pl-14 sm:pl-16 space-y-3 text-sm text-[#5B616B] leading-relaxed">
                    <p className="font-medium text-[#0B0D10]">
                      {faq.shortAnswer}
                    </p>
                    <p className="text-xs leading-relaxed text-[#5B616B]">
                      {faq.detailedAnswer}
                    </p>
                    <div className="pt-2">
                      <span className="precision-badge text-[10px]">
                        {faq.tag}
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
