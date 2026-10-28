import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowRight, Check, Move3d } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MaterialItem {
  number: string;
  id: string;
  name: string;
  subtitle: string;
  description: string;
  specs: {
    tensile: string;
    temp: string;
    density: string;
    accuracy: string;
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
    number: '01',
    id: 'pla-matte',
    name: 'PLA MATTE PRO',
    subtitle: 'Standard Rapid Bio-Polymer',
    description: 'Crisp layered aesthetic with low reflectivity. Ideal for visual prototypes, scale architectural models, and ergonomic form validations.',
    specs: {
      tensile: '55 MPa (Rigid)',
      temp: '65°C HDT',
      density: '1.24 g/cm³',
      accuracy: '±0.1 mm',
    },
    price: 'from ₹3.50 / g',
    colorHex: '#FF5A1F',
    roughness: 0.45,
    metalness: 0.05,
    transmission: 0.0,
    opacity: 1.0,
    transparent: false,
  },
  {
    number: '02',
    id: 'petg-industrial',
    name: 'PETG INDUSTRIAL',
    subtitle: 'Semi-Ductile & Water-Tight',
    description: 'High impact resistance with glycol-enhanced ductility. Excellent for fluid tanks, outdoor enclosures, mechanical clips, and snap-latches.',
    specs: {
      tensile: '50 MPa (Ductile)',
      temp: '80°C HDT',
      density: '1.27 g/cm³',
      accuracy: '±0.08 mm',
    },
    price: 'from ₹5.00 / g',
    colorHex: '#8EA2FF',
    roughness: 0.15,
    metalness: 0.1,
    transmission: 0.75,
    opacity: 0.88,
    transparent: true,
  },
  {
    number: '03',
    id: 'abs-esd',
    name: 'ABS-ESD FLAME RETARDANT',
    subtitle: 'Electrostatic Discharge Safe',
    description: 'Surface resistivity 10^7–10^9 ohms. Engineered for semiconductor assembly trays, PCB enclosures, and under-hood automotive brackets.',
    specs: {
      tensile: '45 MPa (High Impact)',
      temp: '100°C HDT',
      density: '1.08 g/cm³',
      accuracy: '±0.06 mm',
    },
    price: 'from ₹8.00 / g',
    colorHex: '#262626',
    roughness: 0.65,
    metalness: 0.2,
    transmission: 0.0,
    opacity: 1.0,
    transparent: false,
  },
  {
    number: '04',
    id: 'carbon-x',
    name: 'CARBON-X PA12 NYLON',
    subtitle: 'Aerospace Structural Composite',
    description: 'Chopped carbon fibers embedded in a polyamide 12 matrix. Replaces CNC machined aluminum in drone airframes, robotics arms, and high-load tooling.',
    specs: {
      tensile: '115 MPa (Metal Yield)',
      temp: '150°C HDT',
      density: '1.14 g/cm³',
      accuracy: '±0.04 mm',
    },
    price: 'from ₹25.00 / g',
    colorHex: '#0D0D0D',
    roughness: 0.85,
    metalness: 0.25,
    transmission: 0.0,
    opacity: 1.0,
    transparent: false,
  },
  {
    number: '05',
    id: 'sla-resin',
    name: '12K OPTICAL SLA RESIN',
    subtitle: 'Micro-Fluidic & Mirror Finish',
    description: 'Photopolymer cured with monochrome 12K LCD screens down to 10 micron layer heights. Produces glass-smooth cosmetic surfaces and jewellery molds.',
    specs: {
      tensile: '65 MPa (Crisp)',
      temp: '75°C HDT',
      density: '1.18 g/cm³',
      accuracy: '±0.02 mm',
    },
    price: 'from ₹14.00 / g',
    colorHex: '#FFE14D',
    roughness: 0.08,
    metalness: 0.15,
    transmission: 0.65,
    opacity: 0.92,
    transparent: true,
  },
];

// Interactive 3D Precision Engineering Component that responds to material props
function InteractiveMaterialPart({ material }: { material: MaterialItem }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.35 + state.pointer.x * 0.5;
    meshRef.current.rotation.x = 0.25 + state.pointer.y * 0.3;
  });

  return (
    <group ref={meshRef}>
      {/* Precision Mechanical Impeller / Manifold Assembly */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.35, 0.45, 32]} />
        <meshPhysicalMaterial
          color={material.colorHex}
          roughness={material.roughness}
          metalness={material.metalness}
          transmission={material.transmission}
          opacity={material.opacity}
          transparent={material.transparent}
          ior={1.5}
        />
        <Outlines thickness={2} color="#0B0B0B" />
      </mesh>

      {/* Internal Rotor Hub */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.65, 0.75, 0.5, 24]} />
        <meshStandardMaterial
          color={material.colorHex}
          roughness={material.roughness}
          metalness={material.metalness}
        />
        <Outlines thickness={1.8} color="#0B0B0B" />
      </mesh>

      {/* Radial Fins */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((angle * Math.PI) / 180) * 1.05,
            0.15,
            Math.sin((angle * Math.PI) / 180) * 1.05,
          ]}
          rotation={[0, -(angle * Math.PI) / 180, 0]}
        >
          <boxGeometry args={[0.08, 0.4, 0.7]} />
          <meshStandardMaterial
            color={material.colorHex}
            roughness={material.roughness}
            metalness={material.metalness}
          />
          <Outlines thickness={1.5} color="#0B0B0B" />
        </mesh>
      ))}
    </group>
  );
}

export default function ExploreMaterials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const contentWrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const currentMat = materialsData[activeIndex];

  // Animated material switch
  const switchMaterial = (idx: number) => {
    if (idx === activeIndex) return;
    setActiveIndex(idx);
    gsap.fromTo(
      '.material-spec-card',
      { opacity: 0.6, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
  };

  // GSAP Scrubbed Selector Pin on Desktop + Mobile Reveal
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      if (!sectionRef.current) return;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 30%',
        end: 'bottom 70%',
        scrub: 0.5,
        onUpdate: (self) => {
          const idx = Math.min(
            materialsData.length - 1,
            Math.floor(self.progress * materialsData.length)
          );
          setActiveIndex(idx);
        },
      });
    });

    mm.add('(max-width: 1023px)', () => {
      if (!sectionRef.current) return;

      gsap.fromTo(
        '.material-spec-card',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="materials"
      ref={sectionRef}
      data-bg="#0B0B0B"
      data-fg="#FAF7F2"
      className="relative w-full min-h-screen bg-[#0B0B0B] text-[#FAF7F2] py-16 sm:py-20 lg:py-24 px-6 sm:px-10 lg:px-16 flex flex-col justify-center overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col justify-between h-full">
        {/* Section Header */}
        <div data-aos="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8 lg:mb-8">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="type-mono-eyebrow text-[#FFE14D] text-xs font-mono font-bold">
                03 // MATERIAL SCIENCE
              </span>
              <span className="sticker-minimal bg-[#FF5A1F] text-[#0B0B0B] text-[10px] font-black px-2 py-0.5">
                5 GRADED POLYMERS
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black uppercase tracking-tight leading-[0.95]">
              <span className="text-[#FAF7F2] mr-2.5">EXPLORE EVERY</span>
              <span className="text-[#FFE14D]">MATERIAL.</span>
            </h2>
          </div>

          <p className="type-body text-[#FAF7F2]/70 max-w-md text-xs sm:text-sm font-medium leading-relaxed">
            From flexible elastomeric seals to metal-yield carbon composites.
            Select or scroll to inspect mechanical tolerances and real-time surface properties.
          </p>
        </div>

        {/* Mobile Horizontal Material Switcher Bar (lg:hidden) */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4 -mx-6 px-6 whitespace-nowrap">
          {materialsData.map((mat, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={mat.id}
                onClick={() => switchMaterial(idx)}
                className={`px-3.5 py-2 font-mono text-xs font-bold transition-all shrink-0 rounded-xs border cursor-pointer ${
                  isActive
                    ? 'bg-[#FF5A1F] text-[#0B0B0B] border-[#FF5A1F] shadow-sm font-black'
                    : 'bg-white/10 text-white/70 border-white/15 hover:bg-white/20'
                }`}
              >
                <span className="opacity-70 mr-1.5">{mat.number}</span>
                <span>{mat.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* 2-Column Pinned Selector Layout */}
        <div ref={contentWrapRef} className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center flex-1 my-auto">
          
          {/* Left Column: Numbered List 01-05 (Hidden on mobile, 40% width on desktop) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col space-y-1.5">
            {materialsData.map((mat, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={mat.id}
                  onClick={() => switchMaterial(idx)}
                  className={`w-full text-left py-2.5 px-3.5 transition-all flex items-start gap-3.5 cursor-pointer hairline-b-white rounded-xs ${
                    isActive
                      ? 'bg-white/10 text-white pl-5'
                      : 'text-white/40 hover:text-white/80 hover:pl-4.5'
                  }`}
                >
                  <span className={`font-mono text-sm font-black ${isActive ? 'text-[#FF5A1F]' : 'text-white/30'}`}>
                    {mat.number}
                  </span>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-base font-bold uppercase tracking-tight">
                        {mat.name}
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 bg-[#FF5A1F] inline-block shrink-0" />
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-white/50 block mt-0.5">
                      {mat.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: 3D Part + Changing Headline & CTA (100% on mobile, 60% width on desktop) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative w-full">
            
            {/* 3D Part Canvas (Inspectable, drag to rotate) */}
            <div className="w-full h-[220px] sm:h-[260px] lg:h-[280px] xl:h-[300px] relative flex items-center justify-center cursor-grab active:cursor-grabbing">
              <Canvas
                camera={{ position: [0, 1.8, 3.8], fov: 42 }}
                style={{ background: 'transparent' }}
              >
                <ambientLight intensity={1.2} />
                <directionalLight position={[4, 8, 4]} intensity={2.0} />
                <pointLight position={[-4, 2, -2]} intensity={1.0} color={currentMat.colorHex} />
                <InteractiveMaterialPart material={currentMat} />
              </Canvas>

              {/* 360 hint */}
              <div className="absolute bottom-1 right-3 flex items-center gap-1.5 font-mono text-[10px] text-white/40 uppercase tracking-widest pointer-events-none">
                <Move3d className="w-3 h-3 text-[#FFE14D]" />
                <span>360&deg; PREVIEW</span>
              </div>
            </div>

            {/* Changing Material Spec Details & Primary CTA */}
            <div className="material-spec-card w-full mt-2 lg:mt-3 p-4 sm:p-5 bg-white/5 hairline-white space-y-2.5 rounded-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-black text-[#FFE14D] uppercase">
                    {currentMat.name}
                  </h3>
                  <p className="font-mono text-xs text-white/60">
                    {currentMat.subtitle} &bull; <span className="text-[#FF5A1F] font-bold">{currentMat.price}</span>
                  </p>
                </div>

                <button
                  onClick={() => navigate('/custom-lab')}
                  className="btn-brutal btn-brutal-orange text-xs py-2 px-4 flex items-center justify-center gap-2 cursor-pointer shadow-[2px_2px_0px_#0B0B0B] w-full sm:w-auto shrink-0"
                >
                  <span>CONFIGURE IN THIS MATERIAL</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="font-body text-xs sm:text-[13px] text-white/70 leading-relaxed max-w-2xl line-clamp-2">
                {currentMat.description}
              </p>

              {/* Minimal specs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 font-mono text-xs hairline-t-white">
                <div>
                  <span className="text-white/40 block text-[10px]">TENSILE:</span>
                  <span className="text-white font-bold">{currentMat.specs.tensile}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px]">HEAT RESIST:</span>
                  <span className="text-white font-bold">{currentMat.specs.temp}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px]">DENSITY:</span>
                  <span className="text-white font-bold">{currentMat.specs.density}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px]">TOLERANCE:</span>
                  <span className="text-[#FFE14D] font-bold">{currentMat.specs.accuracy}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
