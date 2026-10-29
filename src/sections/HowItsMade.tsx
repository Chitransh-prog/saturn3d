'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  UploadCloud, Sliders, Zap, CheckCircle2, PackageCheck, 
  ArrowRight, Move3d, Play, Pause, ChevronRight, ChevronLeft,
  Activity, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
  number: string;
  title: string;
  stage: string;
  headline: string;
  description: string;
  specs: string;
  metric: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: ProcessStep[] = [
  {
    number: '01',
    title: 'Upload CAD Model',
    stage: 'STAGE 1 // GEOMETRIC INTEGRITY AUDIT',
    headline: 'Client-Side Mesh Validation & Watertight Slicing',
    description: 'Direct browser upload for .STL, .STEP, .OBJ, .GLB, or reference blueprints. The parsing engine checks watertight boundaries, minimum wall thickness, and overhang angles within seconds.',
    specs: 'Formats: STEP, STL, OBJ, GLB // Max 100 MB',
    metric: '< 10s Parse Time',
    icon: UploadCloud,
  },
  {
    number: '02',
    title: 'Parametric Slicing',
    stage: 'STAGE 2 // RESOLUTION & INFILL OPTIMIZATION',
    headline: 'Adaptive Micron Layering & Gyroid Geometry',
    description: 'Configure layer heights from 25 microns (SLA) to 200 microns (FDM). Select lightweight internal gyroid matrices or 100% solid infill for maximum structural rigidity.',
    specs: 'Layer: 25µm–200µm // Infill: 10%–100%',
    metric: '25µm Min Layer',
    icon: Sliders,
  },
  {
    number: '03',
    title: 'Additive Fabrication',
    stage: 'STAGE 3 // ACTIVE HEATED CHAMBER & 12K OPTICS',
    headline: 'High-Velocity Sintering & Enclosed Chamber Curing',
    description: 'Dispatched to enclosed 70°C heated-chamber CoreXY printers or monochrome 12K optical SLA photopolymer engines with real-time laser calibration.',
    specs: 'Chamber: Active 70°C // Closed Loop Steppers',
    metric: '500 mm/s Motion',
    icon: Zap,
  },
  {
    number: '04',
    title: 'Metrology & Curing',
    stage: 'STAGE 4 // CMM AUDIT & UV THERMAL ANNEALING',
    headline: 'Optical Coordinate Bench Verification & Post-Cure',
    description: 'Precision digital caliper and optical CMM datum check against original CAD dimensions, followed by ultrasonic alcohol wash, thermal oven annealing, and UV chamber stabilization.',
    specs: 'Tolerance: ±0.04 mm SLA // ±0.12 mm FDM',
    metric: '±0.04 mm Accuracy',
    icon: CheckCircle2,
  },
  {
    number: '05',
    title: 'Express Dispatch',
    stage: 'STAGE 5 // ALL-INDIA TRANSIT',
    headline: 'Moisture Barrier Shielding & 24–48h Air Courier',
    description: 'Electrostatic vacuum-sealed in anti-static moisture barriers with desiccant and high-density crush-proof impact packaging. Dispatched within 24 to 48 hours across India.',
    specs: 'Dispatch: 24–48 Hours // Pan-India Air Express',
    metric: '24–48h Dispatch',
    icon: PackageCheck,
  },
];

// Industrial 3D Fabrication Cell with Moving Nozzle and Slicing Plane
function IndustrialFabricationCell({ progress, autoRotate }: { progress: number; autoRotate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const toolheadRef = useRef<THREE.Group>(null);

  const clipHeight = -0.75 + progress * 1.8;
  const clippingPlane = useMemo(() => {
    return new THREE.Plane(new THREE.Vector3(0, -1, 0), clipHeight);
  }, [clipHeight]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = t * 0.25;
    }
    if (toolheadRef.current) {
      const radius = 0.72 + Math.sin(t * 3.2) * 0.28;
      toolheadRef.current.position.x = Math.cos(t * 4.0) * radius;
      toolheadRef.current.position.z = Math.sin(t * 4.0) * radius;
      toolheadRef.current.position.y = clipHeight + 0.16;
    }
  });

  return (
    <group>
      {/* Build Platform */}
      <mesh position={[0, -0.92, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.12, 3.2]} />
        <meshStandardMaterial color="#12151A" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Subtle Engineering Grid Surface */}
      <gridHelper args={[3.0, 16, '#FF5A1F', '#262A32']} position={[0, -0.85, 0]} />

      {/* Bed Heating Coils Glow */}
      <pointLight position={[0, -0.8, 0]} color="#FF5A1F" intensity={1.2} distance={3.0} />

      {/* Turbine Impeller Geometry Sliced Dynamically */}
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Impeller Base Rotor */}
        <mesh position={[0, -0.65, 0]} castShadow>
          <cylinderGeometry args={[1.35, 1.45, 0.2, 48]} />
          <meshStandardMaterial
            color="#EAE4D9"
            roughness={0.35}
            metalness={0.15}
            clippingPlanes={[clippingPlane]}
            clipShadows
          />
        </mesh>

        {/* Central Hub */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.55, 1.25, 1.3, 36]} />
          <meshStandardMaterial
            color="#EAE4D9"
            roughness={0.35}
            metalness={0.15}
            clippingPlanes={[clippingPlane]}
            clipShadows
          />
        </mesh>

        {/* Impeller Curved Vanes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((angle * Math.PI) / 180) * 0.9,
              -0.1,
              Math.sin((angle * Math.PI) / 180) * 0.9,
            ]}
            rotation={[0, -(angle * Math.PI) / 180, 0.3]}
          >
            <boxGeometry args={[0.07, 0.95, 0.7]} />
            <meshStandardMaterial
              color="#EAE4D9"
              roughness={0.35}
              metalness={0.15}
              clippingPlanes={[clippingPlane]}
              clipShadows
            />
          </mesh>
        ))}

        {/* Active Slicing Ring Laser Glow */}
        {progress < 0.99 && (
          <group position={[0, clipHeight, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.01, 1.38, 48]} />
              <meshBasicMaterial color="#FF5A1F" side={THREE.DoubleSide} transparent opacity={0.85} />
            </mesh>
            <pointLight color="#FF5A1F" intensity={3} distance={1.8} />
          </group>
        )}
      </group>

      {/* Active Extruder Toolhead Assembly */}
      <group ref={toolheadRef} position={[0, clipHeight + 0.16, 0]}>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.28, 16]} />
          <meshStandardMaterial color="#4A4E58" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <coneGeometry args={[0.05, 0.09, 16]} />
          <meshStandardMaterial color="#FF5A1F" emissive="#FF5A1F" emissiveIntensity={1.5} />
        </mesh>
      </group>
    </group>
  );
}

export default function HowItsMade() {
  const [activeStep, setActiveStep] = useState(0);
  const [sliceProgress, setSliceProgress] = useState(0.45);
  const [autoRotate, setAutoRotate] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const switchStep = (idx: number) => {
    setActiveStep(idx);
    setSliceProgress(0.2 + idx * 0.18);
  };

  const handlePrev = () => {
    const nextIdx = (activeStep - 1 + steps.length) % steps.length;
    switchStep(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeStep + 1) % steps.length;
    switchStep(nextIdx);
  };

  const current = steps[activeStep];
  const StepIcon = current.icon;

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative w-full bg-[#0B0D10] text-[#F5F6F8] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 overflow-hidden font-body border-t border-white/10"
      aria-label="Manufacturing Process and Methodology"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
              <span className="type-mono-eyebrow text-white/60">
                06 // Fabrication Pipeline
              </span>
            </div>
            <h2 className="type-h2 text-white">
              Surgical quality control at every layer.
            </h2>
            <p className="type-body text-[#A3A9B3] mt-2">
              From automated polygon analysis to cleanroom post-curing and CMM metrology, every part follows a rigorous manufacturing protocol.
            </p>
          </div>

          <div className="precision-badge text-xs shrink-0">
            5-Stage Shop Workflow
          </div>
        </div>

        {/* Step Selector Horizontal Timeline Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {steps.map((st, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={st.number}
                onClick={() => switchStep(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#FF5A1F] bg-[#181C22] text-white shadow-sm'
                    : 'border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="font-mono text-[10px] text-[#FF5A1F] font-semibold">
                  {st.number} // STAGE
                </div>
                <div className="text-xs font-semibold text-white mt-0.5 truncate">
                  {st.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* 2-Column Split: Active Step Details + Live 3D Fabrication Cell */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Active Step Details Card */}
          <div className="lg:col-span-6 card-precision-dark p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A1F] shrink-0">
                <StepIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-[11px] text-[#FF5A1F] uppercase tracking-wider block">
                  {current.stage}
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mt-1">
                  {current.title}
                </h3>
              </div>
            </div>

            <div className="text-xs font-mono font-medium text-white/80 border-l-2 border-[#FF5A1F] pl-3">
              {current.headline}
            </div>

            <p className="text-xs sm:text-sm text-[#A3A9B3] leading-relaxed">
              {current.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] text-white/40 block">SHOP METRIC</span>
                <span className="text-[#FF5A1F] font-semibold mt-0.5 block">{current.metric}</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] text-white/40 block">VERIFIED SPEC</span>
                <span className="text-white font-medium mt-0.5 block truncate">{current.specs}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => navigate('/custom-lab')}
                className="flex-1 btn-precision-primary text-xs py-3 px-4"
              >
                <span>Upload CAD Model</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white cursor-pointer transition-colors"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white cursor-pointer transition-colors"
                  title="Next Step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3D High-Precision Fabrication Cell */}
          <div className="lg:col-span-6 card-precision-dark overflow-hidden flex flex-col">
            <div className="p-3.5 border-b border-white/10 bg-[#14171D] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium text-white text-[11px]">
                  Fabrication Cell // Optical Slicing Simulation
                </span>
              </div>
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className="p-1 rounded-md text-white/60 hover:text-white transition-colors"
                title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
              >
                {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="h-[340px] sm:h-[400px] relative w-full">
              <Canvas
                gl={{ localClippingEnabled: true, antialias: true }}
                camera={{ position: [0, 2.2, 4.4], fov: 40 }}
              >
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 8, 5]} intensity={2.0} color="#FFF8F0" />
                <directionalLight position={[-4, 3, -3]} intensity={1.5} color="#FF5A1F" />
                <IndustrialFabricationCell progress={sliceProgress} autoRotate={autoRotate} />
                <OrbitControls enablePan={false} enableZoom={true} minDistance={2.5} maxDistance={6.0} />
              </Canvas>

              <div className="absolute bottom-3 left-3 flex items-center gap-2 font-mono text-[10px] text-white/60 bg-[#0B0D10]/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 pointer-events-none">
                <Move3d className="w-3 h-3 text-[#FF5A1F]" />
                <span>Orbit 360° to inspect slicing plane</span>
              </div>
            </div>

            {/* Slicing Progress Scrubber */}
            <div className="p-3.5 border-t border-white/10 bg-[#14171D] flex items-center gap-3 font-mono text-xs">
              <span className="text-[11px] text-white/60 whitespace-nowrap">
                LAYER ELEVATION:
              </span>
              <input
                type="range"
                min="0.05"
                max="1.0"
                step="0.01"
                value={sliceProgress}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setSliceProgress(val);
                  const stepIdx = Math.min(steps.length - 1, Math.floor(val * steps.length));
                  setActiveStep(stepIdx);
                }}
                className="w-full accent-[#FF5A1F] cursor-pointer"
              />
              <span className="text-[#FF5A1F] font-semibold text-xs whitespace-nowrap w-10 text-right">
                {Math.round(sliceProgress * 100)}%
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
