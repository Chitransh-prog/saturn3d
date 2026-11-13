import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  SITE_URL, 
  SITE_NAME, 
  GEO_CONFIG, 
  BHOPAL_FAQS, 
  getFaqSchema, 
  getBhopalLandingSchema, 
  getBreadcrumbSchema 
} from '@/lib/seo-config';
import { 
  MapPin, Phone, MessageSquare, ArrowRight, CheckCircle2, 
  ShieldCheck, Zap, Clock, Cpu, Award, FileCode, Layers, 
  Sparkles, ChevronRight, Star, Building2, Factory
} from 'lucide-react';

export const metadata: Metadata = {
  title: '3D Printing Service in Bhopal | Industrial Rapid Prototyping | Saturn 3D',
  description:
    '#1 industrial 3D printing in Bhopal, MP. FDM, 12K SLA optical resin & Carbon-X PA12 printing with ±0.04mm tolerances at Govindpura Industrial Area. Same-day walk-in pickup, 0 MOQ, instant CAD quote. Call +91 88899 88874.',
  keywords: [
    '3D printing Bhopal',
    '3D printing service in Bhopal',
    '3D printing in Bhopal',
    '3D printing Govindpura Bhopal',
    'Industrial 3D printing Bhopal',
    'Rapid prototyping Bhopal',
    '3D printer shop in Bhopal',
    '3D printing near me Bhopal',
    'Custom 3D printing Bhopal Madhya Pradesh',
    'SLA resin 3D printing Bhopal',
    'Carbon fiber 3D printing Bhopal',
    'Mandideep 3D printing service',
    'MANIT Bhopal 3D prototyping',
    'Best 3D printing company Bhopal',
  ],
  alternates: {
    canonical: `${SITE_URL}/3d-printing-in-bhopal`,
  },
  openGraph: {
    title: '3D Printing Service in Bhopal | Govindpura Lab | Saturn 3D',
    description:
      'Premier additive manufacturing lab in Sector B, Govindpura Industrial Area, Bhopal. FDM, 12K SLA resin, Carbon-X PA12. Same-day pickup, 0 MOQ, 24h express turnaround.',
    url: `${SITE_URL}/3d-printing-in-bhopal`,
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Saturn 3D Industrial 3D Printing Facility in Govindpura, Bhopal, MP',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Printing Service in Bhopal | Saturn 3D',
    description:
      'Precision rapid prototyping in Bhopal, MP. ±0.04mm tolerance, FDM & 12K SLA. Same-day Govindpura facility pickup.',
    images: ['/og-image.webp'],
  },
};

export default function BhopalLandingPage() {
  const bhopalSchema = getBhopalLandingSchema();
  const faqSchema = getFaqSchema(BHOPAL_FAQS);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: '3D Printing in Bhopal', url: '/3d-printing-in-bhopal' },
  ]);

  const bhopalClusters = [
    {
      name: 'Govindpura Industrial Area',
      detail: 'Direct facility walk-in pickup, immediate machine inspection & CAD review at Sector B.',
      transit: 'Immediate Walk-in',
      badge: 'Headquarters Lab',
    },
    {
      name: 'Mandideep Industrial Zone',
      detail: 'Heavy industrial prototypes, factory tooling, jigs & chemical-resistant enclosures.',
      transit: 'Same-Day Express',
      badge: 'Manufacturing Hub',
    },
    {
      name: 'MP Nagar & Commercial Core',
      detail: 'Architectural scale models, tech startup product housings & corporate gift batches.',
      transit: '2–4 Hour Courier',
      badge: 'Startup Corridor',
    },
    {
      name: 'MANIT, IISER & IIIT Bhopal',
      detail: 'Student formula race parts, robotics club spars, biomedical thesis prototypes (15-25% student discount).',
      transit: 'Same-Day Campus Drop',
      badge: 'Academic Prototyping',
    },
  ];

  const materialSpecs = [
    {
      name: 'Carbon-X PA12-CF',
      type: 'Aerospace Composite',
      rate: 'From ₹25/g',
      tolerance: '±0.04 mm',
      benefit: 'Replaces CNC machined aluminum 6061; 115 MPa tensile strength.',
    },
    {
      name: '12K Precision SLA Resin',
      type: 'Photopolymer',
      rate: 'From ₹14/ml',
      tolerance: '±0.04 mm',
      benefit: 'Injection-molded finish with 25-micron layers for microfluidics & aesthetics.',
    },
    {
      name: 'Industrial PETG Chemical Grade',
      type: 'Engineering Polymer',
      rate: 'From ₹6/g',
      tolerance: '±0.08 mm',
      benefit: 'Ductile, shatterproof, chemical and water-resistant mechanical parts.',
    },
    {
      name: 'PLA Pro Matte Precision',
      type: 'Rapid Prototyping',
      rate: 'From ₹3.50/g',
      tolerance: '±0.10 mm',
      benefit: 'Ultra-low shrinkage, fastest form & fit verification.',
    },
  ];

  const bhopalReviews = [
    {
      name: 'Er. Rajesh Malviya',
      role: 'Tooling Lead, Govindpura Industrial Cluster',
      rating: 5,
      date: 'September 2026',
      text: 'Having Saturn 3D right in Govindpura has cut our tool fabrication lead time from 3 weeks to under 24 hours. The Carbon-X nylon jigs hold up perfectly under production line stresses.',
    },
    {
      name: 'Aayush Sharma',
      role: 'Robotics Lead, MANIT Bhopal',
      rating: 5,
      date: 'October 2026',
      text: 'Super fast turnaround and great student discounts. Our drone arm mounts were printed and picked up the same afternoon. Tolerances were bang on ±0.04mm.',
    },
    {
      name: 'Dr. S. K. Nambiar',
      role: 'Orthopedic Consultant, Bhopal',
      rating: 5,
      date: 'August 2026',
      text: 'The 12K SLA resin models for preoperative bone drill templates were flawless. Clean, smooth, and dimensionally accurate.',
    },
  ];

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bhopalSchema) }}
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
            <span className="text-[#111215] font-semibold">3D Printing in Bhopal</span>
          </nav>
        </div>

        {/* HERO: Local Dominance */}
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
                <MapPin className="w-3.5 h-3.5" />
                <span>Sector B, Govindpura Industrial Area, Bhopal (PIN 462023)</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight mb-4 font-sans">
                #1 Industrial 3D Printing Service in Bhopal.
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed mb-8">
                Precision rapid prototyping and production-grade additive manufacturing in Bhopal. 
                Equipped with high-speed CoreXY print farms, 12K SLA resin optics, and continuous 
                Carbon-X PA12 with verified tolerances down to <strong className="text-neutral-900 font-semibold">±0.04mm</strong>. 
                Same-day walk-in pickup at our Govindpura facility, 0 MOQ, and instant online CAD quotes.
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
                  href="https://wa.me/918889988874?text=Hi%20Saturn%203D%2C%20I%20need%20a%203D%20printing%20quote%20in%20Bhopal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95 text-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Bhopal Desk (+91 88899 88874)</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-neutral-100 text-xs font-mono text-neutral-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Same-Day Pickup</span>
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
                  <span>18% GST Invoicing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BHOPAL REGIONAL INDUSTRIAL CLUSTERS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
          <div className="mb-8">
            <span className="text-xs font-mono text-[#412f91] uppercase tracking-wider font-semibold">Local Coverage</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              Serving All Key Industrial & Academic Zones in Bhopal
            </h2>
            <p className="text-sm text-neutral-600 mt-2">
              Whether you need walk-in collection at Govindpura or doorstep express delivery across MP, our facility handles high-precision orders daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {bhopalClusters.map((cluster) => (
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
                  <span className="text-neutral-500">Dispatch:</span>
                  <span className="text-emerald-600 font-bold">{cluster.transit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MATERIAL & PRICE SPECS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
          <div className="mb-8">
            <span className="text-xs font-mono text-[#412f91] uppercase tracking-wider font-semibold">Factory Formulations</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              Production Materials &amp; Live Rates in Bhopal
            </h2>
            <p className="text-sm text-neutral-600 mt-2">
              All materials certified for dimensional stability, chemical resilience, and thermal endurance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {materialSpecs.map((m) => (
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

        {/* LOCAL BHOPAL CUSTOMER REVIEWS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-mono text-[#412f91] uppercase tracking-wider font-semibold">Verified Feedback</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
                What Bhopal Engineers &amp; Founders Say
              </h2>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 shadow-2xs font-mono text-xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-neutral-900">4.9 / 5.0</span>
              <span className="text-neutral-500">(34 Bhopal Reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {bhopalReviews.map((rev) => (
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

        {/* LOCAL FAQS */}
        <section className="max-w-4xl mx-auto px-4 sm:px-8 mb-16">
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-[#412f91] uppercase tracking-wider font-semibold">Bhopal Support</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              Frequently Asked Questions About 3D Printing in Bhopal
            </h2>
          </div>

          <div className="space-y-4">
            {BHOPAL_FAQS.map((faq, i) => (
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

        {/* MAP & FACILITY CONTACT CARD */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
          <div className="rounded-3xl bg-neutral-900 text-white p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-neutral-300 mb-3">
                <Factory className="w-3.5 h-3.5 text-[#a495ee]" />
                <span>Govindpura Engineering Hub</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 font-sans">
                Visit Saturn 3D Facility in Bhopal
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                Sector B, Govindpura Industrial Area, Bhopal, MP 462023. Walk-ins welcomed Monday through Saturday, 9:00 AM to 8:00 PM for project evaluation, physical material comparisons, and instant collection.
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
                <a 
                  href="https://maps.google.com/?q=23.259933,77.412615" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#a495ee] hover:underline"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open in Google Maps &rarr;</span>
                </a>
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
                href="https://wa.me/918889988874?text=Hi%20Saturn%203D%2C%20I%20am%20in%20Bhopal%20and%20would%20like%20to%20discuss%20a%203D%20printing%20job"
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
