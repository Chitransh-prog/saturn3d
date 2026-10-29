import React from 'react';
import { ShieldCheck, Clock, Zap, Truck } from 'lucide-react';

export default function CapabilityStrip() {
  const capabilities = [
    {
      metric: '±0.04 mm',
      label: 'Verified Tolerance',
      desc: 'Precision SLA & calibrated FDM micro-metrology',
      icon: ShieldCheck,
    },
    {
      metric: '24–48h',
      label: 'Express Turnaround',
      desc: 'Rapid production dispatch from Bhopal hub',
      icon: Clock,
    },
    {
      metric: 'Zero MOQ',
      label: 'Prototyping & Batches',
      desc: 'Single part iteration to 5,000 unit production',
      icon: Zap,
    },
    {
      metric: 'All India',
      label: 'Secure Logistics',
      desc: 'Insured air courier dispatch across tier 1-3 cities',
      icon: Truck,
    },
  ];

  return (
    <section
      className="w-full bg-[#12151A] text-[#F5F6F8] border-y border-white/10 py-6 sm:py-8 px-6 sm:px-10 lg:px-16 relative z-10"
      aria-label="Saturn 3D Precision Fabrication Capabilities"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
        {capabilities.map((cap, idx) => {
          const Icon = cap.icon;
          return (
            <div
              key={idx}
              className={`flex flex-col justify-center ${
                idx > 0 ? 'pt-4 lg:pt-0 lg:pl-8' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-[#FF5A1F]" />
                <span className="font-mono text-xs text-white/50 uppercase tracking-wider">
                  {cap.label}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight">
                {cap.metric}
              </div>
              <p className="text-xs text-[#A3A9B3] mt-1 font-body">
                {cap.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
