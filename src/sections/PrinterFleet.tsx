import React, { useState } from 'react';
import { ArrowRight, Cpu, Layers, Zap, Shield, CheckCircle2, Sliders, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PrinterSpec {
  label: string;
  value: string;
}

interface PrinterItem {
  id: string;
  badge?: string;
  name: string;
  headline: string;
  description: string;
  image: string;
  specs: PrinterSpec[];
  highlights: string[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

const fleetData: PrinterItem[] = [
  {
    id: 'sparkx-i8',
    badge: 'COREXY HIGH SPEED',
    name: 'SPARKX i8',
    headline: 'Fastest Prints. Least Waste. Unlimited Creations.',
    description: 'Industrial open-chassis CoreXY architecture engineered for ultra-rapid prototyping and zero-latency iterations. Features active input shaping and precision direct-drive extrusion.',
    image: '/printers/saturn-sparkx-i8.jpg',
    specs: [
      { label: 'Max Speed', value: '600 mm/s' },
      { label: 'Acceleration', value: '20,000 mm/s²' },
      { label: 'Build Envelope', value: '300 × 300 × 330 mm' },
      { label: 'Layer Precision', value: '±0.04 mm' },
    ],
    highlights: [
      'Dual-Gear Direct Drive with hardened steel gears',
      'Textured PEI spring-steel flex build plate',
      'High-rigidity all-metal linear motion rails',
      'Active acoustic vibration compensation'
    ],
    primaryCta: { label: 'Learn More', href: '/custom-lab' },
  },
  {
    id: 'k3-enclosed',
    badge: 'MULTI-MATERIAL ENCLOSED',
    name: 'K3',
    headline: 'Beyond Nozzles. Conquer Materials.',
    description: 'Fully enclosed thermoregulated chamber with automated Quad-Color Filament System (CFS). Optimized for structural engineering composites and carbon-reinforced polymers.',
    image: '/printers/saturn-k3-enclosed.jpg',
    specs: [
      { label: 'CFS Capacity', value: '4-Color Continuous' },
      { label: 'Chamber Temp', value: 'Active 65°C Heated' },
      { label: 'Hotend Temp', value: '300°C All-Metal' },
      { label: 'Air System', value: 'HEPA H13 + Carbon' },
    ],
    highlights: [
      'Carbon-X PA12, High-Temp ABS & PC certified',
      'Multi-spool automatic filament failover',
      'Dark-tinted tempered glass observation door',
      'Integrated real-time optical layer inspection'
    ],
    primaryCta: { label: 'Learn More', href: '/custom-lab' },
    secondaryCta: { label: 'Order Print', href: '/custom-lab' },
  },
];

export default function PrinterFleet() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'sparkx' | 'k3'>('all');

  return (
    <section className="relative w-full bg-white py-24 md:py-32 border-b border-[#0B0D10]/10 overflow-hidden">
      {/* Subtle background studio grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0B0D10 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F6F8] border border-[#0B0D10]/10 text-xs font-mono tracking-wider text-[#5B616B] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] animate-pulse" />
            SATURN INDUSTRIAL HARDWARE FLEET
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#0B0D10] font-sans">
            Engineered Machines for Demanding Parts
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#5B616B] leading-relaxed">
            From lightning-fast mechanical validation to temperature-controlled composite production, our precision printer fleet delivers micron-level repeatability on every job.
          </p>
        </div>

        {/* 2-Column Creality / SparkX Style Hardware Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {fleetData.map((printer) => (
            <div
              key={printer.id}
              className="group relative flex flex-col justify-between bg-[#FAFAFB] hover:bg-white rounded-3xl p-8 md:p-12 border border-[#0B0D10]/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/[0.04]"
            >
              {/* Top Typography & CTAs (Exact Creality / SparkX Studio Layout) */}
              <div className="flex flex-col items-center text-center">
                <span className="text-[11px] font-mono tracking-wider text-[#5B616B] uppercase mb-2">
                  {printer.badge}
                </span>

                <h3 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#0B0D10] font-sans">
                  {printer.name}
                </h3>

                <p className="text-base md:text-lg text-[#5B616B] mt-2 mb-6 font-medium max-w-md">
                  {printer.headline}
                </p>

                {/* Pill Action Buttons */}
                <div className="flex items-center gap-3 mb-8">
                  <button
                    onClick={() => navigate(printer.primaryCta.href)}
                    className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#0B0D10] text-white text-sm font-medium tracking-wide transition-all duration-200 hover:bg-[#FF5A1F] hover:shadow-lg hover:shadow-[#FF5A1F]/20 active:scale-95"
                  >
                    {printer.primaryCta.label}
                  </button>

                  {printer.secondaryCta && (
                    <button
                      onClick={() => navigate(printer.secondaryCta!.href)}
                      className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-white text-[#0B0D10] border border-[#0B0D10]/20 text-sm font-medium tracking-wide transition-all duration-200 hover:border-[#0B0D10] hover:bg-[#F5F6F8] active:scale-95"
                    >
                      {printer.secondaryCta.label}
                    </button>
                  )}
                </div>
              </div>

              {/* Product Photography Centerpiece */}
              <div className="relative w-full aspect-square max-w-[440px] mx-auto my-4 flex items-center justify-center">
                <div className="absolute inset-0 bg-radial from-[#FF5A1F]/5 via-transparent to-transparent rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <img
                  src={printer.image}
                  alt={`${printer.name} industrial 3D printer`}
                  className="w-full h-full object-contain relative z-10 transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Engineering Specs Strip */}
              <div className="mt-6 pt-6 border-t border-[#0B0D10]/10">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  {printer.specs.map((spec, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-[11px] font-mono text-[#5B616B] uppercase tracking-wider">
                        {spec.label}
                      </span>
                      <span className="text-sm font-semibold text-[#0B0D10] mt-0.5">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Highlights List */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                  {printer.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#5B616B]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A1F] flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Capabilities Banner */}
        <div className="mt-12 rounded-2xl bg-[#0B0D10] text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-[#FF5A1F]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Need a Dedicated Fleet Production Run?</h4>
              <p className="text-sm text-[#A3A9B3] mt-0.5">
                We operate multiple synchronized Voron, CoreXY, and SLA print farms with 24-48h dispatch across India.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/custom-lab')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-medium text-sm transition-all duration-200 flex-shrink-0 shadow-lg shadow-[#FF5A1F]/20"
          >
            Launch Instant Lab
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
