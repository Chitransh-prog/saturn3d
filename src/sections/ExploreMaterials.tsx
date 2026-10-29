'use client';

import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowRight, Check, Layers, Cpu, ShieldCheck, Zap, Thermometer, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MaterialItem {
  id: string;
  name: string;
  group: 'Composites' | 'Specialty Resins' | 'Engineering' | 'Standard';
  subtitle: string;
  description: string;
  specs: {
    tensile: string;
    hdt: string;
    density: string;
    tolerance: string;
  };
  price: string;
  colorHex: string;
  roughness: number;
  metalness: number;
  transmission: number;
  opacity: number;
  transparent: boolean;
}

const materialsData: MaterialItem[] = [
  {
    id: 'carbon-x',
    name: 'Carbon-X PA12-CF',
    group: 'Composites',
    subtitle: 'Continuous Carbon Fiber Matrix',
    description: 'High-tensile polyamide 12 reinforced with micro-carbon fiber. Replaces CNC machined aluminum 6061 in drone arms, suspension links, and industrial robot effectors.',
    specs: {
      tensile: '115 MPa',
      hdt: '150°C',
      density: '1.15 g/cm³',
      tolerance: '±0.04 mm',
    },
    price: '₹26.00 / g',
    colorHex: '#181A1F',
    roughness: 0.75,
    metalness: 0.15,
    transmission: 0.0,
    opacity: 1.0,
    transparent: false,
  },
  {
    id: 'sla-tough',
    name: 'Precision Tough SLA Resin',
    group: 'Specialty Resins',
    subtitle: 'Sub-Micron Photopolymer',
    description: 'Surgical accuracy with injection-molded surface smoothness. Cured with monochrome 12K LCD optical matrices down to 0.025 mm layers for fluidics and impellers.',
    specs: {
      tensile: '65 MPa',
      hdt: '75°C',
      density: '1.18 g/cm³',
      tolerance: '±0.04 mm',
    },
    price: '₹14.00 / g',
    colorHex: '#4A6572',
    roughness: 0.15,
    metalness: 0.05,
    transmission: 0.45,
    opacity: 0.95,
    transparent: true,
  },
  {
    id: 'petg-industrial',
    name: 'PETG Industrial Chemical Grade',
    group: 'Engineering',
    subtitle: 'High-Impact Ductile Thermoplastic',
    description: 'Glycol-modified polyester with high elongation at break and chemical resistance. Ideal for snap-fits, fluid reservoirs, and factory floor positioning jigs.',
    specs: {
      tensile: '52 MPa',
      hdt: '80°C',
      density: '1.27 g/cm³',
      tolerance: '±0.08 mm',
    },
    price: '₹6.00 / g',
    colorHex: '#2B4C7E',
    roughness: 0.25,
    metalness: 0.1,
    transmission: 0.6,
    opacity: 0.9,
    transparent: true,
  },
  {
    id: 'pla-pro',
    name: 'PLA Pro Precision Polymer',
    group: 'Standard',
    subtitle: 'Low-Shrinkage Fast Iteration',
    description: 'High dimensional fidelity bio-polymer with near-zero warp. Engineered for rapid mechanical fit verification and high-detail aesthetic mockups.',
    specs: {
      tensile: '55 MPa',
      hdt: '62°C',
      density: '1.24 g/cm³',
      tolerance: '±0.10 mm',
    },
    price: '₹4.50 / g',
    colorHex: '#F2EEE6',
    roughness: 0.4,
    metalness: 0.02,
    transmission: 0.0,
    opacity: 1.0,
    transparent: false,
  },
];

// Interactive 3D Part with Realistic PBR Shading & Rotating Hub
function MaterialSamplePart({ material }: { material: MaterialItem }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.4 + state.pointer.x * 0.4;
    groupRef.current.rotation.x = 0.25 + state.pointer.y * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Precision Rotor Hub Assembly */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, 0.4, 48]} />
        <meshPhysicalMaterial
          color={material.colorHex}
          roughness={material.roughness}
          metalness={material.metalness}
          transmission={material.transmission}
          opacity={material.opacity}
          transparent={material.transparent}
          ior={1.48}
        />
      </mesh>

      {/* Internal Center Collar */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.45, 36]} />
        <meshStandardMaterial
          color={material.colorHex}
          roughness={material.roughness}
          metalness={material.metalness}
        />
      </mesh>

      {/* Radial Aerodynamic Vanes */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((angle * Math.PI) / 180) * 1.05,
            0.12,
            Math.sin((angle * Math.PI) / 180) * 1.05,
          ]}
          rotation={[0, -(angle * Math.PI) / 180, 0.15]}
        >
          <boxGeometry args={[0.07, 0.35, 0.65]} />
          <meshStandardMaterial
            color={material.colorHex}
            roughness={material.roughness}
            metalness={material.metalness}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ExploreMaterials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const currentMaterial = materialsData[activeIndex];

  const comparisonRows = [
    {
      feature: 'Best For',
      fdm: 'Large housings, rugged prototypes & batch runs',
      sla: 'Micro-details, smooth cosmetic surfaces & fluidics',
      carbon: 'Structural parts replacing machined aluminum',
    },
    {
      feature: 'Max Build Volume',
      fdm: '350 × 350 × 350 mm',
      sla: '218 × 123 × 250 mm',
      carbon: '300 × 300 × 300 mm',
    },
    {
      feature: 'Min Layer Height',
      fdm: '0.10 mm (100 µm)',
      sla: '0.025 mm (25 µm)',
      carbon: '0.12 mm (120 µm)',
    },
    {
      feature: 'Shop Tolerance',
      fdm: '±0.12 mm',
      sla: '±0.04 mm',
      carbon: '±0.05 mm',
    },
    {
      feature: 'Tensile Strength',
      fdm: '45–55 MPa',
      sla: '65–75 MPa',
      carbon: '115–140 MPa',
    },
    {
      feature: 'Heat Deflection (HDT)',
      fdm: '65–85°C',
      sla: '75–300°C (High-Temp Resin)',
      carbon: '150°C',
    },
    {
      feature: 'Starting Rate',
      fdm: '₹4.50 / gram',
      sla: '₹14.00 / gram',
      carbon: '₹26.00 / gram',
    },
    {
      feature: 'Standard Turnaround',
      fdm: '24–48 Hours',
      sla: '24–48 Hours',
      carbon: '48–72 Hours (Annealed)',
    },
  ];

  return (
    <section
      id="materials"
      className="w-full bg-[#0B0D10] text-[#F5F6F8] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 relative overflow-hidden font-body"
      aria-label="Saturn 3D Materials and Process Science"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10 scroll-reveal">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
              <span className="type-mono-eyebrow text-white/60">
                03 // Material Science & Processes
              </span>
            </div>
            <h2 className="type-h2 text-white">
              Engineering polymers, verified on the test bench.
            </h2>
            <p className="type-body text-[#A3A9B3] mt-2">
              From continuous carbon-fiber reinforcement to sub-micron optical resins, every formulation is calibrated for mechanical integrity.
            </p>
          </div>

          <button
            onClick={() => navigate('/custom-lab')}
            className="btn-precision-primary text-xs py-2.5 px-4 shrink-0"
          >
            <span>Configure custom material</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Interactive Material Selector & 3D Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Material List & Mechanical Telemetry */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {materialsData.map((mat, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <div
                    key={mat.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`card-precision-dark p-4 cursor-pointer transition-all ${
                      isActive
                        ? 'border-[#FF5A1F] bg-[#181C22]'
                        : 'hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="precision-badge text-[10px]">
                        {mat.group}
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#FF5A1F]">
                        {mat.price}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      {mat.name}
                    </h3>
                    <p className="text-xs text-[#A3A9B3] mt-1 line-clamp-2">
                      {mat.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Active Material Detailed Specifications Card */}
            <div className="card-precision-dark p-6 mt-4 border-[#FF5A1F]/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-white">
                  {currentMaterial.name} Telemetry
                </h4>
                <span className="precision-badge-orange text-[10px]">
                  VERIFIED SHOP SPECS
                </span>
              </div>
              <p className="text-xs text-[#A3A9B3] leading-relaxed mb-5">
                {currentMaterial.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-white/40 block">TENSILE YIELD</span>
                  <span className="text-white font-semibold">{currentMaterial.specs.tensile}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block">HEAT DEFLECTION</span>
                  <span className="text-white font-semibold">{currentMaterial.specs.hdt}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block">POLYMER DENSITY</span>
                  <span className="text-white font-semibold">{currentMaterial.specs.density}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block">TOLERANCE</span>
                  <span className="text-[#FF5A1F] font-semibold">{currentMaterial.specs.tolerance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: 3D Studio Material Visualizer */}
          <div className="lg:col-span-5 h-[380px] sm:h-[440px] card-precision-dark relative overflow-hidden p-4 flex items-center justify-center">
            <div className="absolute top-4 left-4 z-10">
              <span className="precision-badge text-[10px]">
                3D PBR SHADER PREVIEW // {currentMaterial.name}
              </span>
            </div>

            <div className="w-full h-full relative">
              <Canvas camera={{ position: [0, 1.2, 3.8], fov: 38 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[-3, 4, 3]} intensity={2.0} color="#FFF8F0" />
                <directionalLight position={[3, 2, -2]} intensity={2.5} color="#FF5A1F" />
                <ContactShadows position={[0, -0.6, 0]} opacity={0.4} scale={4} blur={2.0} />
                <MaterialSamplePart material={currentMaterial} />
              </Canvas>
            </div>
          </div>

        </div>

        {/* Creality-Style Process Comparison Table */}
        <div className="space-y-6 pt-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="type-mono-eyebrow text-white/60">
                BENCHMARK MATRIX
              </span>
              <h3 className="type-h3 text-white mt-1">
                Process Comparison: FDM vs SLA vs Carbon-X
              </h3>
            </div>
            <span className="text-xs text-[#A3A9B3]">
              Swipe horizontally on mobile &rarr;
            </span>
          </div>

          <div className="overflow-x-auto no-scrollbar card-precision-dark border border-white/10">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-[#181C22] text-white font-semibold">
                  <th className="py-3.5 px-4 sm:px-6">Parameter</th>
                  <th className="py-3.5 px-4 sm:px-6 text-[#FF5A1F]">Industrial FDM</th>
                  <th className="py-3.5 px-4 sm:px-6">12K SLA Resin</th>
                  <th className="py-3.5 px-4 sm:px-6 text-emerald-400">Carbon-X Composite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[11px] sm:text-xs">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 sm:px-6 font-semibold text-white/90">
                      {row.feature}
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-[#A3A9B3]">
                      {row.fdm}
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-[#A3A9B3]">
                      {row.sla}
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-white">
                      {row.carbon}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
