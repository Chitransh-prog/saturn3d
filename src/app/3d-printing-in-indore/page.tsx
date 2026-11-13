import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  SITE_URL, 
  SITE_NAME, 
  GEO_CONFIG, 
  INDORE_FAQS, 
  getFaqSchema, 
  getIndoreLandingSchema, 
  getBreadcrumbSchema 
} from '@/lib/seo-config';
import { 
  MapPin, Phone, MessageSquare, ArrowRight, CheckCircle2, 
  ShieldCheck, Zap, Clock, Cpu, Award, FileCode, Layers, 
  Sparkles, ChevronRight, Star, Building2, Factory, Truck
} from 'lucide-react';

export const metadata: Metadata = {
  title: '3D Printing Service in Indore | Rapid Prototyping & Pithampur Auto Parts | Saturn 3D',
  description:
    '#1 industrial 3D printing in Indore & Pithampur. High-speed CoreXY FDM, 12K SLA resin & Carbon-X PA12 with ±0.04mm tolerances. 12-24h express doorstep delivery across Indore, Sanwer Road & Pithampur. Instant CAD quote. Call +91 88899 88874.',
  keywords: [
    '3D printing service in Indore',
    '3D printing in Indore',
    '3D printing Indore',
    '3D printing Pithampur Indore',
    'Industrial 3D printing Indore',
    'Rapid prototyping Indore',
    '3D printing near me Indore',
    'Automotive 3D printing Pithampur',
    'Sanwer Road 3D printing service',
    'Custom 3D printing Indore Madhya Pradesh',
    'IIT Indore 3D printing',
    'SGSITS Indore 3D prototyping',
    'Carbon fiber 3D printing Indore',
    'SLA resin 3D printing Indore',
    'Best 3D printing company Indore',
  ],
  alternates: {
    canonical: `${SITE_URL}/3d-printing-in-indore`,
  },
  openGraph: {
    title: '3D Printing Service in Indore | Pithampur Industrial Prototyping | Saturn 3D',
    description:
      'Premier industrial 3D printing service serving Indore, Pithampur & Sanwer Road. 12-24h express delivery corridor, 12K SLA optical resin, continuous Carbon-X PA12, zero MOQ.',
    url: `${SITE_URL}/3d-printing-in-indore`,
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Saturn 3D Industrial 3D Printing Service for Indore and Pithampur, MP',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Printing Service in Indore & Pithampur | Saturn 3D',
    description:
      'Precision rapid prototyping in Indore, MP. Carbon-X PA12 & 12K SLA. Express 12-24h doorstep delivery to Pithampur and Indore.',
    images: ['/og-image.webp'],
  },
};

export default function IndoreLandingPage() {
  const indoreSchema = getIndoreLandingSchema();
  const faqSchema = getFaqSchema(INDORE_FAQS);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: '3D Printing in Indore', url: '/3d-printing-in-indore' },
  ]);

  const indoreClusters = [
    {
      name: 'Pithampur Industrial Corridor (Auto Cluster)',
      detail: 'Automotive tier-1/tier-2 assembly jigs, under-hood engine brackets, and robotic end-effectors in Carbon-X PA12.',
      transit: '12–24h Doorstep Drop',
      badge: 'Auto Manufacturing',
    },
    {
      name: 'Sanwer Road Industrial Area',
      detail: 'Machinery replacement gears, chemical-resistant fluid manifolds in PETG, and durable electrical housings.',
      transit: 'Same-Day Dispatch',
      badge: 'Engineering & MSME',
    },
    {
      name: 'Electronic Complex & Pardesipura',
      detail: 'Precision electronic enclosures with brass threaded inserts, cosmetic prototypes, and tactile button panels.',
      transit: '12h Express Transit',
      badge: 'Electronics & Tech',
    },
    {
      name: 'IIT Indore (Simrol) & SGSITS',
      detail: 'Formula Student carbon race chassis parts, robotics club actuators, and academic thesis prototypes with 15-25% educational rebate.',
      transit: 'Express Campus Delivery',
      badge: 'R&D & Research',
    },
  ];

  const indoreMaterials = [
    {
      name: 'Carbon-X PA12-CF',
      type: 'Industrial Composite',
      rate: 'From ₹25/g',
      tolerance: '±0.04 mm',
      benefit: 'Tensile yield 115 MPa. Replaces CNC machined aluminum 6061 in automotive and robotics fixtures.',
    },
    {
      name: 'ABS-ESD Flame Retardant',
      type: 'Automotive Grade',
      rate: 'From ₹8.50/g',
      tolerance: '±0.08 mm',
      benefit: 'Electrostatic discharge safe, heat deflection up to 98°C for electronic testing jigs.',
    },
    {
      name: '12K High-Res SLA Tough Resin',
      type: 'Sub-Micron Photopolymer',
      rate: 'From ₹14/ml',
      tolerance: '±0.04 mm',
      benefit: 'Injection-mold smooth cosmetic surfaces for consumer product form and fit trials.',
    },
    {
      name: 'Industrial PETG Chemical Grade',
      type: 'Impact Thermoplastic',
      rate: 'From ₹6/g',
      tolerance: '±0.08 mm',
      benefit: 'High impact resilience, moisture proof, certified for food/fluid contact manifolds.',
    },
  ];

  const indoreReviews = [
    {
      name: 'Sunil K. Patidar',
      role: 'Production Engineer, Pithampur Sector 3',
      rating: 5,
      date: 'September 2026',
      text: 'Saturn 3D has been a game-changer for our Pithampur production line. We uploaded a CAD for a broken robotic gripper bracket at 4 PM and had the Carbon-X replacement on our shop floor by noon next day.',
    },
    {
      name: 'Priyanshu Chouhan',
      role: 'Powertrain Lead, IIT Indore Motorsports',
      rating: 5,
      date: 'October 2026',
      text: 'Best prototyping partner in MP. The custom intake runner printed in high-temp nylon handled full dyno testing without deforming. Excellent tolerance repeatability.',
    },
    {
      name: 'Ananya Mehta',
      role: 'Hardware Startup Founder, Vijay Nagar Indore',
      rating: 5,
      date: 'August 2026',
      text: 'The 12K SLA resin finish looks like production injection molding. Helped us close our seed angel round with physical, fully functional product samples.',
    },
  ];

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(indoreSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="w-full bg-[#F8F9FB] text-[#111215] pt-24 pb-16">
        
        {/* Top Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#5E6573]">
            <Link href="/" className="hover:text-[#412f91] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#111215] font-semibold">3D Printing in Indore</span>
          </nav>
        </div>

        {/* HERO: Indore Local Dominance */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
          <div className="relative rounded-3xl bg-white border border-neutral-200/90 p-6 sm:p-10 lg:p-14 shadow-lg overflow-hidden">
            {/* Background Grid */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />

            <div className="relative z-10 max-w-3xl">
              {/* Local Facility Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#412f91]/10 border border-[#412f91]/20 text-[#412f91] text-xs font-mono font-semibold mb-4">
                <Truck className="w-3.5 h-3.5" />
                <span>Indore Express Corridor: 12–24h Doorstep Delivery to Pithampur &amp; Indore</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight mb-4 font-sans">
                #1 3D Printing Service in Indore &amp; Pithampur.
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed mb-8">
                Industrial rapid prototyping and batch manufacturing engineered for Indore&apos;s automotive, 
                electronics, and startup clusters. High-speed CoreXY kinematics, 12K optical SLA resin, and 
                continuous Carbon-X PA12 with micron tolerances down to <strong className="text-neutral-900 font-semibold">±0.04mm</strong>. 
                Connected by a daily direct highway expressway shuttle ensuring express 12 to 24-hour delivery directly to your facility.
              </p>

              {/* Conversion Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8">
                <Link
                  href="/custom-lab"
                  className="px-7 py-3.5 rounded-xl bg-[#412f91] hover:bg-[#342575] text-white font-mono font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#412f91]/25 active:scale-95 text-center"
                >
                  <span>Upload CAD for Instant Slicer Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://wa.me/918889988874?text=Hi%20Saturn%203D%2C%20I%20need%20a%203D%20printing%20quote%20in%20Indore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95 text-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Indore Desk (+91 88899 88874)</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-neutral-100 text-xs font-mono text-neutral-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>12–24h Indore Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>±0.04mm Metrology</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero MOQ (1 to 5k+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full Corporate GST ITC</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INDORE INDUSTRIAL CORRIDORS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
          <div className="mb-8">
            <span className="text-xs font-mono text-[#412f91] uppercase tracking-wider font-semibold">Indore Hub Coverage</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              Direct Daily Fulfillment Across Key Indore Industrial Belts
            </h2>
            <p className="text-sm text-neutral-600 mt-2">
              Our direct Bhopal-Indore logistics express corridor delivers certified parts to Pithampur, Sanwer Road, and Indore tech parks every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {indoreClusters.map((cluster) => (
              <div
                key={cluster.name}
                className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between hover:border-[#412f91]/50 transition-all"
              >
                <div>
                  <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#412f91]/10 text-[#412f91] mb-3">
                    {cluster.badge}
                  </div>
                  <h3 className="font-bold text-base text-neutral-900 mb-2">{cluster.name}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-4">{cluster.detail}</p>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-500">Transit:</span>
                  <span className="text-emerald-600 font-bold">{cluster.transit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MATERIAL SPECS FOR INDORE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
          <div className="mb-8">
            <span className="text-xs font-mono text-[#412f91] uppercase tracking-wider font-semibold">Engineered Polymers</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              Industrial Materials &amp; Live Rates in Indore
            </h2>
            <p className="text-sm text-neutral-600 mt-2">
              From continuous carbon fiber matrices to ESD safe polymers and optical SLA resin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {indoreMaterials.map((m) => (
              <div key={m.name} className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-mono text-[#5E6573] mb-2">
                  <span>{m.type}</span>
                  <span className="font-bold text-[#412f91]">{m.rate}</span>
                </div>
                <h3 className="font-bold text-base text-neutral-900 mb-1">{m.name}</h3>
                <div className="text-[11px] font-mono text-emerald-600 font-semibold mb-3">
                  Tolerance: {m.tolerance}
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">{m.benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* INDORE CUSTOMER TESTIMONIALS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-mono text-[#412f91] uppercase tracking-wider font-semibold">Verified Feedback</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
                What Indore &amp; Pithampur Engineers Say
              </h2>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 shadow-2xs font-mono text-xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-neutral-900">4.9 / 5.0</span>
              <span className="text-neutral-500">(24 Indore Reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {indoreReviews.map((rev) => (
              <div key={rev.name} className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex text-amber-500 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed mb-4 italic">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-neutral-100">
                  <div className="text-xs font-bold text-neutral-900">{rev.name}</div>
                  <div className="text-[11px] text-neutral-500 font-mono">{rev.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INDORE FAQS */}
        <section className="max-w-4xl mx-auto px-4 sm:px-8 mb-16">
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-[#412f91] uppercase tracking-wider font-semibold">Indore Support</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              Frequently Asked Questions About 3D Printing in Indore
            </h2>
          </div>

          <div className="space-y-4">
            {INDORE_FAQS.map((faq, i) => (
              <details
                key={i}
                className="group p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs open:border-[#412f91]/40 transition-all cursor-pointer"
              >
                <summary className="font-bold text-sm sm:text-base text-neutral-900 list-none flex items-center justify-between gap-4 select-none">
                  <span>{faq.question}</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed pt-3 border-t border-neutral-100">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* INDORE DISPATCH CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
          <div className="rounded-3xl bg-neutral-900 text-white p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-neutral-300 mb-3">
                <Truck className="w-3.5 h-3.5 text-[#a495ee]" />
                <span>Pithampur &amp; Indore Express Hub</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 font-sans">
                Order High-Precision 3D Parts for Indore &amp; Pithampur
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                Fast CAD verification, zero MOQ, instant quotes, and 12-24h express highway transit directly to your Indore factory or doorstep.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-200">
                <a href="tel:+918889988874" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-[#a495ee]" />
                  <span>+91 88899 88874</span>
                </a>
                <a href="mailto:hello@saturn3d.in" className="flex items-center gap-2 hover:text-white transition-colors">
                  <FileCode className="w-4 h-4 text-[#a495ee]" />
                  <span>hello@saturn3d.in</span>
                </a>
                <span className="flex items-center gap-2 text-neutral-400">
                  <Clock className="w-4 h-4 text-[#a495ee]" />
                  <span>Express 12–24h Highway Dispatch</span>
                </span>
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
              <Link
                href="/custom-lab"
                className="px-6 py-3.5 rounded-xl bg-[#412f91] hover:bg-[#342575] text-white font-mono font-semibold text-xs text-center transition-all shadow-md active:scale-95"
              >
                Upload CAD Slicer &rarr;
              </Link>
              <a
                href="https://wa.me/918889988874?text=Hi%20Saturn%203D%2C%20I%20am%20in%20Indore%20and%20would%20like%20to%20discuss%20a%203D%20printing%20job"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold text-xs text-center transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
