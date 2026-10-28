import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowUpRight, Check, Flame, Layers, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '@/components/SectionHeader';

// ---------------------------------------------------------------------------
// 3D Miniature Shapes for Slabs (Gyroid, Gear, Bracket, Figurine)
// ---------------------------------------------------------------------------
function ToonGyroidCube({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      const speed = isHovered ? 2.5 : 0.8;
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.015 * speed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshToonMaterial color="#FF5A1F" />
      <Outlines thickness={2.5} color="#0B0B0B" />
    </mesh>
  );
}

function ToonGear({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      const speed = isHovered ? 3.0 : 0.9;
      groupRef.current.rotation.z += 0.012 * speed;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.4, 0.4, 0]}>
      {/* Central hub */}
      <mesh>
        <cylinderGeometry args={[0.9, 0.9, 0.4, 20]} />
        <meshToonMaterial color="#8EA2FF" />
        <Outlines thickness={2.5} color="#0B0B0B" />
      </mesh>
      {/* 8 Gear Teeth */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI) / 4) * 0.95,
            Math.sin((i * Math.PI) / 4) * 0.95,
            0,
          ]}
          rotation={[0, 0, (i * Math.PI) / 4]}
        >
          <boxGeometry args={[0.3, 0.35, 0.38]} />
          <meshToonMaterial color="#FFE14D" />
          <Outlines thickness={2.2} color="#0B0B0B" />
        </mesh>
      ))}
    </group>
  );
}

function ToonBracket({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      const speed = isHovered ? 2.5 : 0.7;
      meshRef.current.rotation.y += 0.012 * speed;
      meshRef.current.rotation.x = 0.3 + Math.sin(state.clock.elapsedTime * speed) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[0.85, 0.35, 16, 32]} />
      <meshToonMaterial color="#0B0B0B" />
      <Outlines thickness={2.8} color="#FF5A1F" />
    </mesh>
  );
}

function ToonResinFigurine({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      const speed = isHovered ? 2.5 : 0.8;
      meshRef.current.rotation.y += 0.015 * speed;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * speed * 2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1.1, 1]} />
      <meshToonMaterial color="#7CF2C1" />
      <Outlines thickness={2.5} color="#0B0B0B" />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Main Services Stack Component
// ---------------------------------------------------------------------------
interface ServiceItem {
  number: string;
  badge: string;
  title: string;
  subtitle: string;
  desc: string;
  specs: { label: string; val: string }[];
  accentColor: string;
  rotation: string;
  component: (hovered: boolean) => React.ReactNode;
}

const servicesData: ServiceItem[] = [
  {
    number: '01',
    badge: 'HIGH-VOLUME FDM',
    title: 'INDUSTRIAL FDM PRINTING',
    subtitle: 'ENGINEERING POLYMERS // ±0.08MM ACCURACY',
    desc: 'High-strength functional components in PLA, PETG, and heat-resistant ABS-ESD. Maximum build volume of 350 × 350 × 400 mm for robust mechanical housings, drone arms, and factory assembly jigs.',
    specs: [
      { label: 'TOLERANCE', val: '±0.08 mm' },
      { label: 'BUILD VOLUME', val: '350 × 350 × 400 mm' },
      { label: 'BASE RATE', val: '₹3.50 / g' },
      { label: 'DISPATCH', val: '24–48 Hours' },
    ],
    accentColor: '#FF5A1F',
    rotation: '-rotate-1',
    component: (h) => <ToonGyroidCube isHovered={h} />,
  },
  {
    number: '02',
    badge: 'MICRON STEREO',
    title: 'ULTRA-PRECISION SLA RESIN',
    subtitle: 'SUB-MICRON FINISH // 10–50μM LAYERS',
    desc: 'Stereolithography engineered for micro-fluidics, dental masters, fine jewelry patterns, and injection-mold surface fidelity. Leaves zero visible layer striations on complex curved surfaces.',
    specs: [
      { label: 'TOLERANCE', val: '±0.02 mm' },
      { label: 'LAYER HEIGHT', val: '10–50 μm' },
      { label: 'BASE RATE', val: '₹18.00 / ml' },
      { label: 'FINISH', val: 'Optical Smooth' },
    ],
    accentColor: '#8EA2FF',
    rotation: 'rotate-1.5',
    component: (h) => <ToonGear isHovered={h} />,
  },
  {
    number: '03',
    badge: 'AEROSPACE GRADE',
    title: 'CARBON-X COMPOSITE PARTS',
    subtitle: 'METAL REPLACEMENT // 115 MPA YIELD',
    desc: 'Chopped carbon-fiber reinforced PA12 nylon delivering aircraft-grade stiffness at 60% lighter weight than aluminum. Tested to withstand up to 150°C continuous heat in engine bays and UAV pods.',
    specs: [
      { label: 'TENSILE YIELD', val: '115 MPa' },
      { label: 'HEAT DEFLECTION', val: '150°C HDT' },
      { label: 'BASE RATE', val: '₹25.00 / g' },
      { label: 'DENSITY', val: '1.14 g/cm³' },
    ],
    accentColor: '#FFE14D',
    rotation: '-rotate-0.5',
    component: (h) => <ToonBracket isHovered={h} />,
  },
  {
    number: '04',
    badge: 'BATCH PRODUCTION',
    title: 'BRIDGE MANUFACTURING & PROTOTYPES',
    subtitle: '10 TO 500+ UNITS // ZERO TOOLING FEE',
    desc: 'Accelerate hardware go-to-market cycles with rapid batch production. Eliminate expensive injection molds with parallel multi-unit print farms and automated digital CMM quality verification.',
    specs: [
      { label: 'BATCH CAP', val: '500+ Units/batch' },
      { label: 'MOLD COST', val: '₹0 (Zero Tooling)' },
      { label: 'VOLUME SAVING', val: 'Up to 25% Off' },
      { label: 'SHIPPING', val: 'Express Air Metro' },
    ],
    accentColor: '#7CF2C1',
    rotation: 'rotate-1',
    component: (h) => <ToonResinFigurine isHovered={h} />,
  },
];

export default function ServicesStack() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-[#FFF4E0] border-b-3 border-ink relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          number="02"
          tag="CORE SERVICES"
          title="ENGINEERED ADDITIVE FABRICATION"
          highlightWord="FABRICATION"
          subtitle="Industrial-grade additive manufacturing capabilities engineered for high-stress prototypes, low-volume bridge production, and aerospace tolerances."
          badgeText="CENTRAL INDIA LAB"
          badgeColor="#FFE14D"
        />

        {/* Sticky Piling Stack of Slabs */}
        <div className="space-y-10 sm:space-y-12">
          {servicesData.map((service, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={service.number}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`card-slab p-6 sm:p-10 bg-white transition-all duration-200 transform ${service.rotation} hover:rotate-0 hover:scale-[1.01]`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Column: Number, Badge, Title, Description */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display font-black text-2xl sm:text-3xl text-[#FF5A1F]">
                        {service.number} //
                      </span>
                      <span
                        className="badge-sticker"
                        style={{ backgroundColor: service.accentColor }}
                      >
                        {service.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-4xl font-display font-black uppercase tracking-tight text-[#0B0B0B]">
                      {service.title}
                    </h3>

                    <div className="font-mono-tech text-xs sm:text-sm font-bold text-[#FF5A1F] uppercase tracking-wider">
                      {service.subtitle}
                    </div>

                    <p className="font-body text-sm sm:text-base text-[#333] leading-relaxed">
                      {service.desc}
                    </p>

                    {/* Spec Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
                      {service.specs.map((spec, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-[#FFF4E0] border-2 border-ink p-2 text-center rounded-xs"
                        >
                          <div className="text-[10px] font-mono text-[#555] uppercase font-bold">
                            {spec.label}
                          </div>
                          <div className="text-xs font-mono font-black text-[#0B0B0B] mt-0.5 truncate">
                            {spec.val}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-wrap gap-3">
                      <button
                        onClick={() => navigate('/custom-lab')}
                        className="btn-brutal btn-brutal-orange text-xs py-2 px-4 flex items-center gap-1.5"
                      >
                        <span>CONFIGURE PART</span>
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                      <button
                        onClick={() => navigate('/categories')}
                        className="btn-brutal bg-white text-xs py-2 px-4"
                      >
                        VIEW SAMPLE PRINTS
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Interactive 3D Miniature Box */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="w-full max-w-[340px] h-64 sm:h-72 bg-[#FFF4E0] border-3 border-ink shadow-brutal rounded-xs p-2 relative overflow-hidden flex flex-col justify-between">
                      {/* Top Bar on 3D Box */}
                      <div className="flex items-center justify-between px-2 pt-1 border-b border-ink text-[10px] font-mono font-bold">
                        <span>LIVE 3D MESH</span>
                        <span className="text-[#FF5A1F]">HOVER TO ACCELERATE</span>
                      </div>

                      {/* 3D Canvas */}
                      <div className="w-full h-48 sm:h-56">
                        <Canvas
                          camera={{ position: [0, 0, 3.2], fov: 45 }}
                          dpr={[1, 1.5]}
                        >
                          <ambientLight intensity={0.9} />
                          <directionalLight position={[3, 4, 2]} intensity={1.5} />
                          {service.component(isHovered)}
                        </Canvas>
                      </div>

                      <div className="px-2 pb-1 text-[9px] font-mono text-[#666] flex justify-between border-t border-ink">
                        <span>CEL-SHADED TOON</span>
                        <span>INK OUTLINE 3PX</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
