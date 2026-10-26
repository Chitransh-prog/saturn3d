import { useState } from 'react';
import { ChevronDown, ShieldCheck, Clock, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FAQItem {
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  tag: string;
}

const faqs: FAQItem[] = [
  {
    tag: 'Pricing & Cost',
    question: 'How much does custom 3D printing cost in India and what drives the price?',
    shortAnswer: 'In India, custom 3D printing typically costs between ₹3.50 to ₹18 per gram for standard FDM polymers (PLA/PETG), ₹15 to ₹35 per ml for precision SLA resin, and ₹25 to ₹65 per gram for Carbon-X PA12 engineering nylon.',
    detailedAnswer: 'Final pricing is determined by four verifiable factors: (1) Material mass and volume, (2) Machine runtime based on layer height (e.g. 0.1mm vs 0.2mm), (3) Infill density percentage (15% for aesthetic models vs 60%+ for structural mounts), and (4) Secondary support removal and post-curing. Saturn 3D provides transparent pricing with no hidden setup surcharges and volume discounts up to 25% for batches of 50+ units.',
  },
  {
    tag: 'CAD File Prep',
    question: 'What CAD file formats do you accept, and how should I export them?',
    shortAnswer: 'We accept .STEP, .STP, .STL, .OBJ, and .3MF file formats. For mechanical and engineering components, .STEP is strongly recommended.',
    detailedAnswer: 'Exporting as STEP or STP preserves the original mathematical NURBS curvature of your model, eliminating the faceted polygon edges common to low-resolution STLs. When exporting STLs from SolidWorks or Fusion 360, set chord height/deviation to <0.01mm and angular deviation to <1° to ensure smooth, watertight surfaces.',
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
    tag: 'Batch Production',
    question: 'Can you manufacture small batches without tooling costs?',
    shortAnswer: 'Yes, we specialize in low-volume bridge manufacturing from 10 to 500+ units, completely eliminating costly hard-tooling and injection molds.',
    detailedAnswer: 'Bridge manufacturing via additive manufacturing allows hardware startups and OEMs to deliver pilot production runs to customers immediately while refining CAD designs. Our tiered volume pricing automatically reduces per-unit costs by 10% to 25%.',
  },
  {
    tag: 'Design & Infill',
    question: 'How do I select the right infill percentage and pattern for mechanical strength?',
    shortAnswer: 'Use 15–20% Gyroid infill for display or cosmetic prototypes, 30–45% Grid infill for general electronic enclosures, and 60–100% for high-stress load-bearing brackets.',
    detailedAnswer: 'Gyroid infill provides isotropic strength across all three axes (X, Y, and Z), preventing directional sheer failure. Increasing outer wall perimeters (3 to 5 perimeters) often contributes more to bending stiffness than increasing internal infill above 60%.',
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
  const navigate = useNavigate();

  const tags = ['All', 'Pricing & Cost', 'CAD File Prep', 'Technology Selection', 'Tolerances & Quality', 'Lead Time & Shipping'];

  const filteredFaqs = selectedTag === 'All'
    ? faqs
    : faqs.filter(f => f.tag === selectedTag);

  return (
    <section className="py-16 sm:py-24 px-3 sm:px-6 lg:px-10 bg-[#E5E5E5] relative overflow-hidden">
      {/* Framed Section Card matching Hero Bezel */}
      <div className="w-full max-w-[1440px] mx-auto rounded-[32px] sm:rounded-[44px] bg-[#EDEDED] border border-black/5 p-6 sm:p-10 lg:p-14 shadow-xl relative overflow-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16 pb-8 border-b border-black/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F7931E]" />
              <span className="font-mono-tech text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-slate-700">
                07 / KNOWLEDGE BASE & AUDITED TELEMETRY
              </span>
            </div>

            <h2 className="font-monumental text-5xl sm:text-7xl lg:text-8xl font-black text-black tracking-tight leading-[0.88] uppercase">
              TECHNICAL <span className="text-[#F7931E]">FAQ</span>
            </h2>
          </div>

          {/* Direct Answer Snippet Box for AEO */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-black/10 shadow-2xs max-w-xl">
            <p className="font-mono-tech text-[10px] sm:text-[11px] text-slate-700 uppercase tracking-wider leading-relaxed">
              Saturn 3D provides industrial additive fabrication in India. Turnaround 24–48h. FDM: ₹3.50–₹18/g. SLA Resin: ₹15–₹35/ml. Carbon-X: ₹25–₹65/g. Direct quotes calculated via CAD upload.
            </p>
          </div>
        </div>

        {/* Filter Capsule Pills */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-black/5">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-[10px] font-mono-tech font-bold uppercase tracking-wider transition-all border ${
                selectedTag === tag
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white text-slate-700 hover:border-black hover:text-black border-black/10'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* FAQ Accordion Grid */}
        <div className="grid lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-8 space-y-3.5">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-[1.75rem] transition-all duration-200 overflow-hidden border ${
                    isOpen
                      ? 'bg-white border-black shadow-md'
                      : 'bg-white/80 border-black/10 hover:border-black/30'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full text-left p-6 flex items-start justify-between gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1.5">
                      <span className="font-mono-tech text-[9px] font-bold uppercase tracking-widest text-[#F7931E]">
                        {faq.tag}
                      </span>
                      <h3 className="font-monumental text-xl sm:text-2xl font-black text-black tracking-wide uppercase leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 bg-black text-white' : 'bg-[#EAEAEA] text-black'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 space-y-3 border-t border-black/5 text-xs sm:text-sm">
                      <p className="font-mono-tech text-[11px] uppercase font-bold text-black bg-[#F7F7F7] p-4 rounded-xl border border-black/5 leading-relaxed">
                        {faq.shortAnswer}
                      </p>
                      <p className="font-body text-slate-600 leading-relaxed pt-1">
                        {faq.detailedAnswer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Side Support Card */}
          <div className="lg:col-span-4">
            <div className="p-8 rounded-[2rem] bg-black text-white space-y-6 sticky top-28 shadow-xl">
              <div>
                <span className="font-mono-tech text-[9px] font-bold uppercase tracking-widest text-[#F7931E] block mb-2">
                  CUSTOM SPEC INQUIRY
                </span>
                <h3 className="font-monumental text-3xl font-black text-white tracking-wide uppercase leading-tight">
                  Need Custom Slicing or GD&T Advice?
                </h3>
              </div>

              <p className="font-mono-tech text-xs text-slate-400 uppercase tracking-wider leading-relaxed">
                Connect directly with our engineering staff in Bhopal for thermal simulations, mass reduction analysis, or material substitution.
              </p>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  onClick={() => navigate('/custom-lab')}
                  className="w-full py-3.5 rounded-full bg-[#F7931E] hover:bg-[#e07f12] text-white font-mono-tech text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Launch Custom CAD Lab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="https://wa.me/917999824632?text=Hello%20Saturn%203D,%20I%20have%20a%20technical%20question%20regarding%20my%20CAD%20tolerances."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full bg-[#25D366] hover:bg-emerald-600 text-white font-mono-tech text-xs font-bold uppercase tracking-widest transition-all active:scale-95 text-center flex items-center justify-center gap-2"
                >
                  <span>WhatsApp Engineering</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
