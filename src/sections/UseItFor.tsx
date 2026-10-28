import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UseCaseItem {
  id: string;
  number: string;
  title: string;
  caption: string;
  specs: string;
  image: string;
  route: string;
}

const useCases: UseCaseItem[] = [
  {
    id: 'drones-uav',
    number: '01',
    title: 'DRONES & UAVS',
    caption: 'Aerodynamic carbon airframes, motor mounts, camera gimbals, and lightweight telemetry pods.',
    specs: 'CARBON-X PA12 // 0.08MM ACCURACY',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    route: '/custom-lab',
  },
  {
    id: 'robotics-automation',
    number: '02',
    title: 'ROBOTICS & AUTOMATION',
    caption: 'Custom end-effectors, soft robotic grippers, planetary gearboxes, and sensor brackets.',
    specs: 'PETG INDUSTRIAL & TPU 95A',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    route: '/custom-lab',
  },
  {
    id: 'medical-dental',
    number: '03',
    title: 'MEDICAL & DENTAL',
    caption: 'Biocompatible dental study casts, surgical drill guides, and orthotic anatomical splints.',
    specs: 'CLASS IIA BIO-RESIN // 25μm',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    route: '/custom-lab',
  },
  {
    id: 'product-design',
    number: '04',
    title: 'PRODUCT DESIGN',
    caption: 'Consumer electronics enclosures, click-feeling button mechanisms, and packaging prototypes.',
    specs: '12K OPTIC RESIN // 10μm SLICE',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
    route: '/custom-lab',
  },
  {
    id: 'student-projects',
    number: '05',
    title: 'STUDENT & RESEARCH',
    caption: 'Formula Student aerodynamics, university lab testing, robotics club chassis, and thesis models.',
    specs: 'SPECIAL ACADEMIC DISCOUNTS',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    route: '/custom-lab',
  },
  {
    id: 'architecture',
    number: '06',
    title: 'ARCHITECTURE MODELS',
    caption: 'High-detail facade studies, masterplan site topography, and client presentation showcases.',
    specs: 'LARGE FORMAT PLA // SEAMLESS',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    route: '/custom-lab',
  },
];

export default function UseItFor() {
  const navigate = useNavigate();

  return (
    <section
      id="use-it-for"
      data-bg="#FAF7F2"
      data-fg="#0B0B0B"
      className="relative w-full bg-[#FAF7F2] text-[#0B0B0B] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div data-aos="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="type-mono-eyebrow text-[#0B0B0B]/70">
                05 // APPLICATIONS &amp; CLIENT DOMAINS
              </span>
              <span className="sticker-minimal">
                VERSATILE
              </span>
            </div>

            <div className="line-reveal-mask">
              <h2 className="type-h2 text-[#0B0B0B]">
                USE IT
              </h2>
            </div>
            <div className="line-reveal-mask">
              <h2 className="type-h2 text-[#FF5A1F]">
                FOR.
              </h2>
            </div>
          </div>

          <p className="type-body text-[#0B0B0B]/75 max-w-md font-semibold">
            Across industrial labs, hardware startups, racing teams, and architecture studios.
            Engineered for high mechanical demands and rapid turnaround.
          </p>
        </div>

        {/* 3-Column Responsive Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {useCases.map((item, idx) => (
            <div
              key={item.id}
              data-aos="fade-up"
              data-aos-delay={(idx % 3) * 100}
              onClick={() => navigate(item.route)}
              className="use-case-card group cursor-pointer bg-white/70 border-2 border-ink rounded-lg p-5 flex flex-col justify-between shadow-brutal-sm hover:shadow-brutal hover:-translate-y-1 transition-all duration-200 select-none"
            >
              <div>
                {/* Image Tile with Subdued Clean Hairline */}
                <div className="w-full aspect-[16/10] overflow-hidden bg-neutral-200 mb-4 relative rounded-md border border-ink/20">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#0B0B0B] text-[#FAF7F2] font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs">
                    {item.number}
                  </div>
                </div>

                {/* Title & Arrow */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-[#0B0B0B] group-hover:text-[#FF5A1F] transition-colors">
                    {item.title}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-[#0B0B0B] shrink-0 transform transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#FF5A1F]" />
                </div>

                {/* Caption */}
                <p className="font-body text-xs text-[#0B0B0B]/75 leading-relaxed mb-4">
                  {item.caption}
                </p>
              </div>

              {/* Specs Badge */}
              <div className="pt-3 border-t border-ink/10 font-mono text-[10px] font-bold text-[#FF5A1F] uppercase tracking-wider">
                {item.specs}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
