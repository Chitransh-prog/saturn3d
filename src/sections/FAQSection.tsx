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
    tag: 'Indore & Bhopal',
    question: 'Where can I get industrial 3D printing in Indore and Bhopal?',
    shortAnswer: 'Saturn 3D operates Central India’s premier additive manufacturing facility in Govindpura Industrial Area, Bhopal, with a dedicated daily express supply corridor to Indore (Pithampur Auto Cluster, Sanwer Road, Electronic Complex).',
    detailedAnswer: 'Clients across Indore and Bhopal enjoy instant online CAD quotation, local engineering support, same-day facility pickup in Bhopal, and 12-to-24 hour express courier delivery to Indore. We eliminate the multi-day delays and exorbitant transit costs of ordering from Mumbai, Pune, or Bengaluru.',
  },
  {
    tag: 'Pricing & Cost',
    question: 'How much does custom 3D printing cost in Indore and Bhopal?',
    shortAnswer: 'Custom 3D printing at Saturn 3D starts at ₹3.50 to ₹12 per gram for FDM polymers (PLA+, PETG, ABS), ₹14 to ₹28 per ml for 12K optical SLA photopolymer resin, and ₹25 to ₹55 per gram for Carbon-X PA12 engineering nylon.',
    detailedAnswer: 'Pricing is transparently calculated in our web slicer based on material mass, layer resolution, and infill density. There are zero machine calibration charges, zero tooling setup fees, zero minimum order quantities (MOQ = 1), and production volume discounts up to 32% for runs over 50 units.',
  },
  {
    tag: 'Lead Time & Delivery',
    question: 'How fast can 3D printed parts be delivered from Bhopal to Indore or Pithampur?',
    shortAnswer: 'Standard turnaround is 24 to 48 hours. Urgent engineering prototypes can be produced and delivered to Indore, Pithampur, or Sanwer Road within 12 to 24 hours via the 195 km expressway corridor.',
    detailedAnswer: 'For Bhopal clients, completed parts can be picked up the same day directly from our Govindpura manufacturing lab. For Indore, Mandideep, Dewas, and Ujjain clients, parts are vacuum-sealed with desiccant and dispatched via same-day regional express line-haul.',
  },
  {
    tag: 'Materials & Auto',
    question: 'What engineering materials can you 3D print for automotive parts in Pithampur and Govindpura?',
    shortAnswer: 'We print Carbon-Fiber Nylon (Carbon-X PA12), High-Temp ABS/ASA (heat deflection up to 105°C), Flexible TPU 95A, Tough SLA Photopolymer Resin, and ESD-safe polymers for electronics.',
    detailedAnswer: 'These materials are chosen specifically for functional testing, under-the-hood engine bay bracketry, jigs, fixtures, robotic end-effectors, fluid conduits, and interior snap-fit clips used by automotive OEMs and Tier-1 suppliers across Pithampur and Mandideep.',
  },
  {
    tag: 'Indore & Bhopal',
    question: 'Can engineering students and researchers from IIT Indore and MANIT Bhopal get discounts?',
    shortAnswer: 'Yes. Saturn 3D offers a verified 15% academic discount for students, research scholars, and robotics teams from IIT Indore, MANIT Bhopal, SGSITS Indore, IISER, and IIITDM Jabalpur.',
    detailedAnswer: 'We proudly sponsor Formula Student SAE teams, BAJA racing prototypes, drone robotics research, and medical innovation projects across Madhya Pradesh universities with discounted rates, free DFM design reviews, and fast track turnaround.',
  },
  {
    tag: 'Tech & CAD',
    question: 'What CAD file formats do you accept for online 3D slicing quotes?',
    shortAnswer: 'We accept STEP (.step, .stp), STL (.stl), OBJ (.obj), 3MF (.3mf), and GLTF/GLB (.glb) 3D model formats, as well as 2D engineering drawings (.PDF, .PNG, .JPG).',
    detailedAnswer: 'Exporting in STEP or STP format is recommended because it retains original mathematical NURBS curvatures for pristine cylindrical bearing bores and mounting holes. Our in-browser custom slicer parses files instantly without storing your IP on external clouds.',
  },
  {
    tag: 'Tech & CAD',
    question: 'What dimensional tolerances and surface finishes can Saturn 3D achieve?',
    shortAnswer: 'We guarantee dimensional tolerances down to ±0.04 mm on precision 12K SLA resin components and ±0.08 mm to ±0.15 mm on calibrated industrial CoreXY FDM printers.',
    detailedAnswer: 'Our fleet uses enclosed active heated chambers, Voron kinematics, and closed-loop steppers to eliminate thermal warping. Secondary post-processing includes ultrasonic solvent wash, multi-wavelength UV curing, vapor smoothing, bead blasting, and threaded brass heat-set inserts.',
  },
  {
    tag: 'Pricing & Cost',
    question: 'Can Saturn 3D manufacture small-batch production runs without tooling?',
    shortAnswer: 'Yes. Saturn 3D specializes in bridge manufacturing and on-demand batches from 10 to 5,000 units with zero tooling or mold charges.',
    detailedAnswer: 'By bypassing traditional injection mold tooling lead times (4-8 weeks) and upfront costs (₹1.5L to ₹8L), hardware startups and tier suppliers in MP can take new industrial products to market in days rather than months.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const navigate = useNavigate();

  const tags = ['All', 'Indore & Bhopal', 'Pricing & Cost', 'Materials & Auto', 'Lead Time & Delivery', 'Tech & CAD'];

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
