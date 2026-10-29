import React from 'react';
import { ArrowUpRight, ArrowRight, ShieldCheck, Cpu, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CaseStudyItem {
  id: string;
  number: string;
  title: string;
  industry: string;
  problem: string;
  solution: string;
  telemetry: string;
  image: string;
  route: string;
}

const caseStudies: CaseStudyItem[] = [
  {
    id: 'drones-uav',
    number: '01',
    title: 'Aerospace Drone Airframe & Gimbal Spars',
    industry: 'Autonomous UAS & Robotics',
    problem: 'CNC aluminum motor spars added excessive mass, limiting endurance to 28 minutes.',
    solution: 'Engineered continuous Carbon-X PA12-CF spars with optimized gyroid infill, cutting mass by 38% while retaining 180 MPa stiffness.',
    telemetry: 'Carbon-X PA12-CF // 4h Turnaround // -38% Mass',
    image: '/showcase/carbon-drone-spar.jpg',
    route: '/custom-lab',
  },
  {
    id: 'robotics-automation',
    number: '02',
    title: 'Industrial Robotic End-Effector Gripper',
    industry: 'Packaging & Automation',
    problem: 'Standard silicone grippers wore out rapidly under high-cycle conveyor friction.',
    solution: 'Fabricated dual-hardness TPU 95A flexible fingers over a rigid PETG Industrial core, increasing cycle life to 250,000+ continuous operations.',
    telemetry: 'PETG + TPU 95A // ±0.08 mm // 24h Dispatch',
    image: '/showcase/robotic-gripper.jpg',
    route: '/custom-lab',
  },
  {
    id: 'medical-dental',
    number: '03',
    title: 'Orthotic Scanner & Drill Guide Prototypes',
    industry: 'Biomedical & Healthcare',
    problem: 'Required autoclave-stable, sub-50µm surface definition for surgical drill verification.',
    solution: 'Produced on 12K optical SLA photopolymer engines using High-Temp & Biocompatible resin formulations with verified ±0.04 mm accuracy.',
    telemetry: '12K Optical Resin // 25µm Layers // ±0.04 mm',
    image: '/showcase/biomedical-guide.jpg',
    route: '/custom-lab',
  },
];

export default function UseItFor() {
  const navigate = useNavigate();

  return (
    <section
      id="use-it-for"
      className="w-full bg-[#F5F6F8] text-[#0B0D10] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 overflow-hidden font-body"
      aria-label="Saturn 3D Industrial Case Studies"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
              <span className="type-mono-eyebrow text-[#5B616B]">
                05 // Case Studies & Industry Applications
              </span>
            </div>
            <h2 className="type-h2 text-[#0B0D10]">
              Built for high-demand engineering environments.
            </h2>
            <p className="type-body text-[#5B616B] mt-2">
              Explore how hardware teams, aerospace startups, and research institutions leverage our rapid additive fabrication infrastructure.
            </p>
          </div>

          <button
            onClick={() => navigate('/custom-lab')}
            className="btn-precision-primary text-xs py-2.5 px-4 shrink-0"
          >
            <span>Start your project</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3-Column Precision Case Study Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {caseStudies.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(item.route)}
              className="card-precision p-6 flex flex-col justify-between group cursor-pointer hover:border-[#FF5A1F]/30"
            >
              <div>
                {/* Image Tile */}
                <div className="w-full aspect-[16/10] overflow-hidden rounded-xl bg-neutral-200 mb-5 relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="precision-badge bg-white/90 backdrop-blur-sm text-[10px]">
                      {item.number} // {item.industry}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0B0D10] group-hover:text-[#FF5A1F] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#FF5A1F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
                </div>

                {/* Problem & Solution Breakdown */}
                <div className="space-y-2 text-xs text-[#5B616B] leading-relaxed mb-6">
                  <p>
                    <strong className="text-[#0B0D10] font-medium">Challenge: </strong>
                    {item.problem}
                  </p>
                  <p>
                    <strong className="text-[#0B0D10] font-medium">Additive Solution: </strong>
                    {item.solution}
                  </p>
                </div>
              </div>

              {/* Verified Telemetry Strip */}
              <div className="pt-4 border-t border-black/5 font-mono text-[11px] font-medium text-[#FF5A1F]">
                {item.telemetry}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
