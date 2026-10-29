import React, { useState } from 'react';
import { ArrowRight, Cpu, Layers, ShieldCheck, Clock, Weight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ShowcasePart {
  id: string;
  name: string;
  intent: 'prototyping' | 'production' | 'tooling' | 'medical' | 'concept';
  material: string;
  process: string;
  layerHeight: string;
  weight: string;
  printTime: string;
  tolerance: string;
  description: string;
  image: string;
}

const partsShowcase: ShowcasePart[] = [
  {
    id: 'drone-spar',
    name: 'UAS Carbon Drone Arm Spar',
    intent: 'production',
    material: 'Carbon-X PA12-CF',
    process: 'Industrial FDM',
    layerHeight: '0.12 mm',
    weight: '64 g',
    printTime: '4h 12m',
    tolerance: '±0.05 mm',
    description: 'High flexural modulus composite arm with gyroid lattice infill and embedded titanium inserts.',
    image: '/showcase/carbon-drone-spar.jpg',
  },
  {
    id: 'turbine-impeller',
    name: 'Precision Centrifugal Impeller',
    intent: 'prototyping',
    material: 'Precision Tough SLA Resin',
    process: '12K SLA Resin',
    layerHeight: '0.05 mm',
    weight: '42 g',
    printTime: '2h 45m',
    tolerance: '±0.04 mm',
    description: 'Ultra-smooth fluid dynamics vane geometry in optical translucent amber engineering resin.',
    image: '/showcase/sla-turbine-impeller.jpg',
  },
  {
    id: 'conveyor-guide',
    name: 'Assembly Line Positioning Jig',
    intent: 'tooling',
    material: 'PETG Industrial',
    process: 'Industrial FDM',
    layerHeight: '0.20 mm',
    weight: '185 g',
    printTime: '6h 30m',
    tolerance: '±0.12 mm',
    description: 'Chemical-resistant production fixture with integrated planetary gearing for packaging lines.',
    image: '/showcase/planetary-gears.jpg',
  },
  {
    id: 'medical-enclosure',
    name: 'Ergonomic Diagnostic Scanner Housing',
    intent: 'medical',
    material: 'Biocompatible Tough Resin',
    process: '12K SLA Resin',
    layerHeight: '0.05 mm',
    weight: '98 g',
    printTime: '5h 15m',
    tolerance: '±0.04 mm',
    description: 'Precision surgical drill guide and anatomical housing printed in certified biocompatible resin.',
    image: '/showcase/biomedical-guide.jpg',
  },
  {
    id: 'intake-manifold',
    name: 'Industrial Chassis V1 Prototype',
    intent: 'tooling',
    material: 'ABS-ESD Flame Retardant',
    process: 'Industrial FDM',
    layerHeight: '0.12 mm',
    weight: '142 g',
    printTime: '7h 20m',
    tolerance: '±0.05 mm',
    description: 'Rigid electronics prototype chassis with heat-set brass threaded inserts and ventilation louvers.',
    image: '/showcase/industrial-chassis.jpg',
  },
  {
    id: 'architecture-model',
    name: 'Robotic End-Effector Gripper',
    intent: 'concept',
    material: 'PETG + TPU 95A Elastomer',
    process: 'Dual-Extrusion FDM',
    layerHeight: '0.16 mm',
    weight: '210 g',
    printTime: '8h 40m',
    tolerance: '±0.08 mm',
    description: 'Dual-hardness robotic gripper with flexible textured TPU fingertips over a high-rigidity PETG skeleton.',
    image: '/showcase/robotic-gripper.jpg',
  },
];

const intentFilters = [
  { id: 'all', label: 'All Showcase Parts' },
  { id: 'prototyping', label: 'Functional Prototyping' },
  { id: 'production', label: 'End-Use Production' },
  { id: 'tooling', label: 'Jigs & Factory Tooling' },
  { id: 'medical', label: 'Medical & Ergonomic' },
  { id: 'concept', label: 'Scale Concepts' },
];

export default function TheLab() {
  const [activeIntent, setActiveIntent] = useState<string>('all');
  const navigate = useNavigate();

  const filteredParts = activeIntent === 'all'
    ? partsShowcase
    : partsShowcase.filter((p) => p.intent === activeIntent);

  return (
    <section
      id="the-lab"
      className="w-full bg-[#F5F6F8] text-[#0B0D10] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 relative overflow-hidden font-body"
      aria-label="Powered by Saturn Showcase"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
              <span className="type-mono-eyebrow text-[#5B616B]">
                02 // Production Showcase
              </span>
            </div>
            <h2 className="type-h2 text-[#0B0D10]">
              Powered by Saturn 3D.
            </h2>
            <p className="type-body text-[#5B616B] mt-2">
              Explore authentic components engineered in our Bhopal hub across automotive, robotics, aerospace, and medical applications.
            </p>
          </div>

          <button
            onClick={() => navigate('/custom-lab')}
            className="btn-precision-primary text-xs py-2.5 px-4 shrink-0"
          >
            <span>Quote your part</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Carbon-Style "What Are You Interested In?" Intent Chips */}
        <div className="space-y-3">
          <span className="font-mono text-xs text-[#5B616B] uppercase tracking-wider block">
            Filter By Operational Intent:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {intentFilters.map((f) => {
              const isActive = activeIntent === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveIntent(f.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0B0D10] text-white shadow-sm'
                      : 'bg-white border border-black/10 text-[#5B616B] hover:text-[#0B0D10] hover:border-black/25'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cut-Out Product Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.map((part) => (
            <div
              key={part.id}
              className="card-precision p-5 flex flex-col justify-between group hover:border-[#FF5A1F]/30"
            >
              <div>
                {/* Part Image with Soft Shadow */}
                <div className="aspect-[4/3] w-full rounded-xl bg-neutral-100 overflow-hidden relative mb-4">
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="precision-badge bg-white/90 backdrop-blur-sm text-[10px]">
                      {part.process}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="precision-badge-orange text-[10px]">
                      {part.tolerance}
                    </span>
                  </div>
                </div>

                {/* Part Metadata */}
                <h3 className="text-base font-semibold text-[#0B0D10] group-hover:text-[#FF5A1F] transition-colors">
                  {part.name}
                </h3>
                <p className="text-xs text-[#5B616B] mt-1 leading-relaxed">
                  {part.description}
                </p>
              </div>

              {/* Verified Telemetry Strip */}
              <div className="mt-5 pt-4 border-t border-black/5 grid grid-cols-3 gap-2 font-mono text-[11px] text-[#5B616B]">
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-400">MATERIAL</span>
                  <span className="font-medium text-[#0B0D10] truncate">{part.material}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-400">LAYER / TIME</span>
                  <span className="font-medium text-[#0B0D10]">{part.layerHeight} &bull; {part.printTime}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-400">MASS</span>
                  <span className="font-medium text-[#0B0D10]">{part.weight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
