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
      className="w-full bg-white text-[#111215] border-y border-black/10 py-6 sm:py-8 px-4 sm:px-8 lg:px-16 relative z-10"
      aria-label="Saturn 3D Precision Fabrication Capabilities"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 lg:divide-x lg:divide-black/10">
        {capabilities.map((cap, idx) => {
          const Icon = cap.icon;
          return (
            <div
              key={idx}
              data-aos="fade-up"
              data-aos-delay={idx * 75}
              className={`flex flex-col justify-center p-3.5 sm:p-4 rounded-xl bg-neutral-50/70 border border-neutral-200/60 lg:bg-transparent lg:border-0 lg:p-0 ${
                idx > 0 ? 'lg:pl-8' : ''
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#412f91] shrink-0" />
                <span className="font-mono text-[10px] sm:text-xs text-[#8A91A0] uppercase tracking-wider font-semibold truncate">
                  {cap.label}
                </span>
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-[#111215] tracking-tight">
                {cap.metric}
              </div>
              <p className="text-[11px] sm:text-xs text-[#5E6573] mt-1 font-body leading-relaxed line-clamp-2">
                {cap.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
