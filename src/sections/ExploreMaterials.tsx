'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowRight, Sparkles, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

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
    description: 'High-tensile PA12 reinforced with micro-carbon fiber. Replaces CNC machined 6061-T6 aluminum in drone spars and end effectors.',
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
    description: 'Surgical accuracy with injection-molded surface smoothness. Cured with monochrome 12K LCD optical matrices down to 0.025 mm layers.',
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
    description: 'Glycol-modified polyester with high elongation at break and chemical resistance for snap-fits and positioning fixtures.',
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
    description: 'High dimensional fidelity bio-polymer with near-zero thermal shrinkage for rapid mechanical fit and assembly verification.',
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

// Rich spectrum of high-tech engineering colors that morph smoothly with scroll
const SCROLL_COLOR_SPECTRUM = [
  { stop: 0.00, hex: '#181A20', roughness: 0.80, metalness: 0.15, label: 'Carbon-X Stealth' },
  { stop: 0.18, hex: '#412F91', roughness: 0.35, metalness: 0.40, label: 'Saturn Royal Purple' },
  { stop: 0.36, hex: '#0284C7', roughness: 0.15, metalness: 0.25, label: '12K SLA Photopolymer' },
  { stop: 0.54, hex: '#D97706', roughness: 0.25, metalness: 0.45, label: 'Aerospace Amber' },
  { stop: 0.72, hex: '#059669', roughness: 0.30, metalness: 0.30, label: 'ESD Flame Retardant' },
  { stop: 0.90, hex: '#94A3B8', roughness: 0.20, metalness: 0.85, label: 'Titanium Metrology' },
  { stop: 1.00, hex: '#412F91', roughness: 0.35, metalness: 0.40, label: 'Saturn Precision Purple' },
];

function getScrollMaterialProps(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  for (let i = 0; i < SCROLL_COLOR_SPECTRUM.length - 1; i++) {
    const s1 = SCROLL_COLOR_SPECTRUM[i];
    const s2 = SCROLL_COLOR_SPECTRUM[i + 1];
    if (p >= s1.stop && p <= s2.stop) {
      const localT = (p - s1.stop) / (s2.stop - s1.stop);
      const c1 = new THREE.Color(s1.hex);
      const c2 = new THREE.Color(s2.hex);
      c1.lerp(c2, localT);
      const roughness = THREE.MathUtils.lerp(s1.roughness, s2.roughness, localT);
      const metalness = THREE.MathUtils.lerp(s1.metalness, s2.metalness, localT);
      return {
        color: c1,
        colorHex: '#' + c1.getHexString(),
        roughness,
        metalness,
        label: localT < 0.5 ? s1.label : s2.label,
      };
    }
  }
  const last = SCROLL_COLOR_SPECTRUM[SCROLL_COLOR_SPECTRUM.length - 1];
  return {
    color: new THREE.Color(last.hex),
    colorHex: last.hex,
    roughness: last.roughness,
    metalness: last.metalness,
    label: last.label,
  };
}

// Interactive 3D Part with Realistic PBR Shading, Smooth Rotation & Dynamic Scroll Color
function MaterialSamplePart({
  scrollProgress,
  activeMaterial,
}: {
  scrollProgress: number;
  activeMaterial: MaterialItem;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const collarMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const vanesMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.45 + state.pointer.x * 0.35;
    groupRef.current.rotation.x = 0.22 + state.pointer.y * 0.18;

    // Dynamically calculate the scroll color
    const scrollProps = getScrollMaterialProps(scrollProgress);

    // Smoothly lerp towards target scroll color & PBR values
    if (meshMaterialRef.current) {
      meshMaterialRef.current.color.lerp(scrollProps.color, 0.08);
      meshMaterialRef.current.roughness = THREE.MathUtils.lerp(meshMaterialRef.current.roughness, scrollProps.roughness, 0.08);
      meshMaterialRef.current.metalness = THREE.MathUtils.lerp(meshMaterialRef.current.metalness, scrollProps.metalness, 0.08);
    }
    if (collarMaterialRef.current) {
      collarMaterialRef.current.color.lerp(scrollProps.color, 0.08);
    }
    if (vanesMaterialRef.current) {
      vanesMaterialRef.current.color.lerp(scrollProps.color, 0.08);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Precision Rotor Hub Assembly */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, 0.4, 48]} />
        <meshPhysicalMaterial
          ref={meshMaterialRef}
          color={activeMaterial.colorHex}
          roughness={activeMaterial.roughness}
          metalness={activeMaterial.metalness}
          transmission={activeMaterial.transmission}
          opacity={activeMaterial.opacity}
          transparent={activeMaterial.transparent}
          ior={1.48}
        />
      </mesh>

      {/* Internal Center Collar */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.45, 36]} />
        <meshStandardMaterial
          ref={collarMaterialRef}
          color={activeMaterial.colorHex}
          roughness={activeMaterial.roughness}
          metalness={activeMaterial.metalness}
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
            ref={vanesMaterialRef}
            color={activeMaterial.colorHex}
            roughness={activeMaterial.roughness}
            metalness={activeMaterial.metalness}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ExploreMaterials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const currentMaterial = materialsData[activeIndex];

  // Efficient window scroll listener to dynamically morph 3D model color
  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const docElem = document.documentElement;
        const scrollHeight = docElem.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
          const progress = Math.min(1, Math.max(0, window.scrollY / scrollHeight));
          setScrollProgress(progress);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const currentScrollProps = getScrollMaterialProps(scrollProgress);

  return (
    <section
      id="specs"
      className="w-full bg-[#F8F9FA] text-[#111215] py-12 sm:py-16 px-4 sm:px-6 lg:px-10 relative overflow-hidden font-body border-t border-black/10"
      aria-label="Saturn 3D Materials and Metrology Specs"
    >
      <div id="materials" className="absolute -top-24 left-0 pointer-events-none" />
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-black/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/10 text-xs font-mono text-[#5E6573] mb-2 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#412f91] animate-pulse" />
              <span>Materials Science // Metrology</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111215] font-display">
              Production Polymers &amp; Metrology
            </h2>
            <p className="text-xs sm:text-sm text-[#5E6573] mt-1 max-w-2xl leading-relaxed">
              Tested for dimensional accuracy and thermal endurance from continuous composites to sub-micron optical resins.
            </p>
          </div>

          <Link
            href="/custom-lab"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#412f91] hover:bg-[#342575] text-white text-xs font-medium transition-all shadow-sm shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <span>Configure Custom Material</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Compact Interactive Deck: Selector & Telemetry (Left) + 3D Stage (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Material Selector + Compact Telemetry HUD */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            
            {/* 4 Compact Material Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {materialsData.map((mat, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={mat.id}
                    onClick={() => setActiveIndex(idx)}
                    type="button"
                    className={`p-3.5 text-left rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'border border-[#412f91] bg-white ring-1 ring-[#412f91] shadow-xs'
                        : 'bg-white border border-black/10 hover:border-black/25 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] uppercase font-semibold text-[#5E6573] px-2 py-0.5 rounded bg-black/5">
                        {mat.group}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#412f91]">
                        {mat.price}
                      </span>
                    </div>
                    <div className="font-semibold text-xs sm:text-sm text-[#111215]">
                      {mat.name}
                    </div>
                    <div className="text-[11px] text-[#5E6573] truncate mt-0.5">
                      {mat.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Material Detailed Telemetry HUD */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-black/10 shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentScrollProps.colorHex }} />
                    <h3 className="text-sm font-bold text-[#111215]">
                      {currentMaterial.name} Telemetry
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#412f91]/10 text-[#412f91] border border-[#412f91]/20 font-semibold uppercase">
                    Verified Shop Specs
                  </span>
                </div>
                <p className="text-xs text-[#5E6573] leading-relaxed mb-4">
                  {currentMaterial.description}
                </p>
              </div>

              {/* 4-Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-black/10 font-mono text-xs">
                <div className="p-2 rounded-lg bg-black/[0.02]">
                  <span className="text-[9px] text-[#8A91A0] block font-semibold uppercase">TENSILE YIELD</span>
                  <span className="text-[#111215] font-bold text-xs">{currentMaterial.specs.tensile}</span>
                </div>
                <div className="p-2 rounded-lg bg-black/[0.02]">
                  <span className="text-[9px] text-[#8A91A0] block font-semibold uppercase">HEAT DEFLECTION</span>
                  <span className="text-[#111215] font-bold text-xs">{currentMaterial.specs.hdt}</span>
                </div>
                <div className="p-2 rounded-lg bg-black/[0.02]">
                  <span className="text-[9px] text-[#8A91A0] block font-semibold uppercase">DENSITY</span>
                  <span className="text-[#111215] font-bold text-xs">{currentMaterial.specs.density}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#412f91]/5 border border-[#412f91]/15">
                  <span className="text-[9px] text-[#412f91] block font-semibold uppercase">TOLERANCE</span>
                  <span className="text-[#412f91] font-bold text-xs">{currentMaterial.specs.tolerance}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right: 3D Stage with Dynamic Scroll Color Morphing */}
          <div className="lg:col-span-5 h-[320px] sm:h-[360px] lg:h-auto min-h-[320px] rounded-2xl relative overflow-hidden bg-white border border-black/10 shadow-xs flex flex-col justify-between">
            
            {/* Top 3D Status Overlay: Live Color & Morph Telemetry */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md text-white font-mono text-[10px] border border-white/10 shadow-sm pointer-events-auto">
                <span
                  className="w-2 h-2 rounded-full ring-2 ring-white/30 transition-colors duration-300"
                  style={{ backgroundColor: currentScrollProps.colorHex }}
                />
                <span className="font-semibold">{currentScrollProps.label}</span>
                <span className="text-white/40">//</span>
                <span className="text-[#A78BFA] font-bold">{currentScrollProps.colorHex.toUpperCase()}</span>
              </div>

              <div className="hidden xs:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/5 text-[#5E6573] font-mono text-[9px] uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#412f91]" />
                <span>Scroll to Morph</span>
              </div>
            </div>

            {/* 3D Canvas */}
            <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
              <Canvas camera={{ position: [0, 1.2, 3.8], fov: 38 }} dpr={[1, 2]} style={{ touchAction: 'pan-y' }}>
                <ambientLight intensity={0.75} />
                <directionalLight position={[-3, 4, 3]} intensity={2.2} color="#FFF8F0" />
                <directionalLight position={[3, 2, -2]} intensity={2.0} color="#412f91" />
                <ContactShadows position={[0, -0.6, 0]} opacity={0.35} scale={4} blur={2.0} color="#000000" />
                <MaterialSamplePart
                  scrollProgress={scrollProgress}
                  activeMaterial={currentMaterial}
                />
              </Canvas>
            </div>

            {/* Bottom Subtle Interaction Hint */}
            <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between text-[10px] font-mono text-[#5E6573] pointer-events-none">
              <span className="bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded border border-black/5">
                360° Drag Orbit &bull; Scroll-Morph PBR
              </span>
              <span className="bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded border border-black/5 font-semibold text-[#412f91]">
                {Math.round(scrollProgress * 100)}% Page Depth
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
