import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Outlines, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  UploadCloud, Sliders, Zap, CheckCircle2, PackageCheck, 
  ArrowRight, Move3d, Play, Pause, ChevronRight, ChevronLeft,
  Cpu, Activity, Layers, Compass
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
    title: 'UPLOAD CAD BLUEPRINT',
    stage: 'STAGE 1 // GEOMETRIC MANIFOLD AUDIT',
    headline: 'Client-Side Mesh Integrity & Watertight Audit',
    description: 'Direct browser upload for .STL, .OBJ, .GLB, .STEP, .3MF, or reference blueprints (.PNG, .JPG). Our engine validates watertight polygon boundaries, draft angles, and thin-wall geometry within 10 seconds with zero cloud leakage.',
    specs: 'FORMATS: STL, OBJ, GLB, STEP, 3MF, PNG, JPG // MAX: 150 MB',
    metric: '< 10s PARSE TIME',
    icon: UploadCloud,
  },
  {
    number: '02',
    title: 'PARAMETRIC SLICING',
    stage: 'STAGE 2 // RESOLUTION & INFILL TUNING',
    headline: 'Adaptive Micron Layering & Gyroid Geometry',
    description: 'Configure layer heights from 10 microns to 280 microns. Select internal structural infill patterns (Gyroid, Honeycomb) from 10% lightweight to 100% solid for optimal weight-to-strength ratios.',
    specs: 'LAYER: 10μm–280μm // INFILL: 10%–100%',
    metric: '10μm MIN LAYER',
    icon: Sliders,
  },
  {
    number: '03',
    title: 'ADDITIVE FABRICATION',
    stage: 'STAGE 3 // 500 MM/S COREXY & 12K SLA',
    headline: 'High-Velocity Sintering & Heated Chamber Deposition',
    description: 'Routing to active 70°C heated-chamber CoreXY extruders at 500 mm/s or monochrome 12K optical SLA resin baths with real-time laser calibration and closed-loop steppers.',
    specs: 'CHAMBER: ACTIVE 70°C // ACCEL: 20,000 MM/S²',
    metric: '500 MM/S VELOCITY',
    icon: Zap,
  },
  {
    number: '04',
    title: 'METROLOGY & FINISHING',
    stage: 'STAGE 4 // CMM AUDIT & POST-CURE',
    headline: 'Optical Coordinate Bench Verification & Annealing',
    description: 'Precision digital caliper and optical CMM audit against original CAD zero-datum plane specs, followed by ultrasonic alcohol wash, thermal oven annealing, and UV chamber cure.',
    specs: 'TOLERANCE: ±0.04 MM // CMM REPORT',
    metric: '±0.04 MM ACCURACY',
    icon: CheckCircle2,
  },
  {
    number: '05',
    title: 'EXPRESS DISPATCH',
    stage: 'STAGE 5 // ALL-INDIA LOGISTICS',
    headline: 'Electrostatic Shielding & 24-48h Air Courier',
    description: 'Electrostatic vacuum-sealed in anti-static moisture barriers with desiccant and high-density crush-proof impact packaging. Dispatched within 24 to 48 hours to any pincode across India.',
    specs: 'DISPATCH: 24–48 HOURS // ALL INDIA',
    metric: '24-48H DISPATCH',
    icon: PackageCheck,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Real Additive Manufacturing 3D Scene: Impeller Turbine, Toolhead, Laser
// ─────────────────────────────────────────────────────────────────────────────
function IndustrialFabricationCell({ progress, autoRotate }: { progress: number; autoRotate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const toolheadRef = useRef<THREE.Group>(null);

  // Height range: part spans from y = -0.75 to +1.05 (total height = 1.8)
  const clipHeight = -0.75 + progress * 1.8;

  const clippingPlane = useMemo(() => {
    return new THREE.Plane(new THREE.Vector3(0, -1, 0), clipHeight);
  }, [clipHeight]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Rotate the part slowly on the build platform
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = t * 0.28;
    }

    // Animate the active 3D printing toolhead nozzle following the perimeter of active layer
    if (toolheadRef.current) {
      const radius = 0.72 + Math.sin(t * 3.2) * 0.28;
      toolheadRef.current.position.x = Math.cos(t * 4.0) * radius;
      toolheadRef.current.position.z = Math.sin(t * 4.0) * radius;
      toolheadRef.current.position.y = clipHeight + 0.16;
    }
  });

  // Calculate radius of the active slice ring based on progress
  const activeRadius = progress < 0.2 ? 1.35 : progress < 0.7 ? 1.15 - (progress - 0.2) * 0.4 : 0.65;

  return (
    <group>
      {/* ─── Build Platform ─── */}
      <mesh position={[0, -0.92, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.12, 3.2]} />
        <meshStandardMaterial color="#18181b" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Spring-Steel Magnetic Grid Surface */}
      <gridHelper args={[3.0, 16, '#FF5A1F', '#2e2e33']} position={[0, -0.85, 0]} />

      {/* Bed Heating Coils Glow Underneath Platform */}
      <pointLight position={[0, -0.8, 0]} color="#FF5A1F" intensity={1.5} distance={3.0} />

      {/* Bed Calibration Corner Fasteners */}
      {[
        [-1.4, -0.85, -1.4],
        [1.4, -0.85, -1.4],
        [-1.4, -0.85, 1.4],
        [1.4, -0.85, 1.4],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.07, 0.07, 0.08, 16]} />
          <meshStandardMaterial color="#FFE14D" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* ─── Part Being Printed: Aerospace Impeller Turbine Assembly ─── */}
      {/* Note: NO <Outlines /> here to avoid Drei's inverted-hull clipping bug */}
      <group ref={groupRef}>
        
        {/* Base Flange Mounting Disc */}
        <mesh position={[0, -0.74, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.35, 1.35, 0.16, 36]} />
          <meshPhysicalMaterial
            color="#FF5A1F"
            roughness={0.25}
            metalness={0.15}
            clippingPlanes={[clippingPlane]}
            clipShadows
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Lower Stepped Impeller Shroud */}
        <mesh position={[0, -0.52, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.15, 1.32, 0.32, 36]} />
          <meshPhysicalMaterial
            color="#FF5A1F"
            roughness={0.28}
            metalness={0.15}
            clippingPlanes={[clippingPlane]}
            clipShadows
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Central Conical Hub Rotor */}
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.55, 0.95, 1.0, 36]} />
          <meshPhysicalMaterial
            color="#FF5A1F"
            roughness={0.25}
            metalness={0.18}
            clippingPlanes={[clippingPlane]}
            clipShadows
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner Hollow Center Shaft Bore (Graphite Core) */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 1.05, 32]} />
          <meshStandardMaterial
            color="#141417"
            roughness={0.7}
            metalness={0.3}
            clippingPlanes={[clippingPlane]}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 10 Aerodynamic Radial Impeller Blades */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
          const angle = (i * Math.PI * 2) / 10;
          return (
            <group key={i} rotation={[0, angle, 0]} position={[0, -0.15, 0]}>
              <mesh position={[0.56, 0.14, 0]} rotation={[0.18, 0.42, 0.14]} castShadow receiveShadow>
                <boxGeometry args={[0.72, 0.78, 0.06]} />
                <meshPhysicalMaterial
                  color="#FF5A1F"
                  roughness={0.3}
                  metalness={0.12}
                  clippingPlanes={[clippingPlane]}
                  clipShadows
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          );
        })}

        {/* Upper Ring Collar Rim */}
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.62, 0.62, 0.24, 36]} />
          <meshPhysicalMaterial
            color="#FF5A1F"
            roughness={0.22}
            metalness={0.2}
            clippingPlanes={[clippingPlane]}
            clipShadows
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Top Centering Spigot */}
        <mesh position={[0, 0.92, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.48, 0.18, 32]} />
          <meshPhysicalMaterial
            color="#FFE14D"
            roughness={0.3}
            metalness={0.3}
            clippingPlanes={[clippingPlane]}
            clipShadows
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* ─── Active Laser Sintered Cross-Section Glow Disc at Current Layer Height ─── */}
        {progress < 0.98 && (
          <group position={[0, clipHeight + 0.002, 0]}>
            {/* Hot Sinter Cross-Section Disc */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.26, Math.max(0.4, activeRadius), 36]} />
              <meshBasicMaterial color="#FFE14D" side={THREE.DoubleSide} transparent opacity={0.85} />
            </mesh>

            {/* Cyan Laser Beam Sinter Perimeter Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[Math.max(0.39, activeRadius - 0.03), Math.max(0.42, activeRadius + 0.04), 36]} />
              <meshBasicMaterial color="#7CF2C1" side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          </group>
        )}

      </group>

      {/* ─── Moving Extruder Hotend / Laser Nozzle ─── */}
      {progress < 0.98 && (
        <group ref={toolheadRef}>
          {/* Laser Deposition Vertical Beam */}
          <mesh position={[0, -0.07, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.14, 8]} />
            <meshBasicMaterial color="#FFE14D" />
          </mesh>

          {/* Brass Nozzle Tip */}
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.07, 0.16, 16]} />
            <meshStandardMaterial color="#FFE14D" metalness={0.9} roughness={0.15} />
          </mesh>

          {/* Aluminum Heat Block Carrier */}
          <mesh position={[0, 0.13, 0]}>
            <boxGeometry args={[0.22, 0.14, 0.22]} />
            <meshStandardMaterial color="#d4d4d8" metalness={0.85} roughness={0.25} />
          </mesh>

          {/* Heatsink Cooling Fins */}
          {[-0.03, 0.03, 0.09].map((y, idx) => (
            <mesh key={idx} position={[0, 0.25 + y, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.02, 16]} />
              <meshStandardMaterial color="#3f3f46" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}

          {/* Laser Discharge Spark Light */}
          <pointLight color="#FFE14D" intensity={3.5} distance={1.8} />
        </group>
      )}

      {/* Vertical Z-Axis Linear Rails in Background */}
      <mesh position={[-1.35, 0.2, -1.35]}>
        <cylinderGeometry args={[0.04, 0.04, 2.4, 16]} />
        <meshStandardMaterial color="#a1a1aa" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[1.35, 0.2, -1.35]}>
        <cylinderGeometry args={[0.04, 0.04, 2.4, 16]} />
        <meshStandardMaterial color="#a1a1aa" metalness={0.95} roughness={0.15} />
      </mesh>
    </group>
  );
}

export default function HowItsMade() {
  const [activeStep, setActiveStep] = useState(0);
  const [sliceProgress, setSliceProgress] = useState(0.2);
  const [autoRotate, setAutoRotate] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  // Step switch helper with GSAP feedback
  const switchStep = (idx: number) => {
    setActiveStep(idx);
    const targetProgress = (idx + 1) / steps.length;
    setSliceProgress(targetProgress);
    gsap.fromTo(
      '.how-step-content',
      { opacity: 0.4, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
  };

  const handlePrev = () => {
    const prev = (activeStep - 1 + steps.length) % steps.length;
    switchStep(prev);
  };

  const handleNext = () => {
    const next = (activeStep + 1) % steps.length;
    switchStep(next);
  };

  // Desktop Pinned Step Scrub + Mobile ScrollTrigger
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
          const p = self.progress;
          const stepIndex = Math.min(steps.length - 1, Math.floor(p * steps.length));
          setActiveStep(stepIndex);
          setSliceProgress(0.15 + p * 0.85);
        },
      });
    });

    mm.add('(max-width: 1023px)', () => {
      if (!sectionRef.current) return;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 35%',
        scrub: 0.4,
        onUpdate: (self) => {
          const p = self.progress;
          const stepIndex = Math.min(steps.length - 1, Math.floor(p * steps.length));
          setActiveStep(stepIndex);
          setSliceProgress(0.15 + p * 0.85);
        },
      });
    });

    return () => mm.revert();
  }, []);

  const current = steps[activeStep];
  const StepIcon = current.icon;

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      data-bg="#FFF4E0"
      data-fg="#0B0B0B"
      className="relative w-full min-h-screen bg-[#FFF4E0] text-[#0B0B0B] py-16 sm:py-24 px-4 sm:px-8 lg:px-14 flex flex-col justify-center overflow-hidden pattern-blueprint"
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* ─── Section Header ─── */}
        <div data-aos="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12 pb-6 border-b-2 border-ink">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-[#0B0B0B]/70">
                06 // METHODOLOGY &amp; PIPELINE
              </span>
              <span className="badge-sticker bg-[#FFE14D] text-[10px] font-black">
                5 STAGE PROCESS
              </span>
            </div>

            <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase text-ink tracking-tight leading-[0.92]">
              HOW IT’S <span className="text-[#FF5A1F]">MADE.</span>
            </h2>
          </div>

          <p className="font-mono text-xs sm:text-sm text-[#0B0B0B]/80 max-w-md font-bold leading-relaxed bg-white/70 p-3.5 border-2 border-ink shadow-brutal-sm rounded-xs">
            From file upload to finished industrial delivery. Every layer is monitored
            for optical micron accuracy, thermal annealing, and structural density.
          </p>
        </div>

        {/* ─── Mobile Horizontal Step Bar (lg:hidden) ─── */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 -mx-4 px-4 whitespace-nowrap">
          {steps.map((st, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={st.number}
                onClick={() => switchStep(idx)}
                className={`px-3.5 py-2 font-mono text-xs font-bold transition-all shrink-0 rounded-xs border-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#0B0B0B] text-[#FFE14D] border-ink font-black shadow-brutal-sm'
                    : 'bg-white text-[#0B0B0B]/70 border-ink/40 hover:bg-[#FFF4E0]'
                }`}
              >
                <span className="text-[#FF5A1F] mr-1.5">{st.number}</span>
                <span>{st.title}</span>
              </button>
            );
          })}
        </div>

        {/* ─── Main Editorial 2-Column Stage ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ══════════════════════════════════════════════════════════════════════ */}
          {/* LEFT COLUMN: PIPELINE STEPPER & ACTIVE SPEC CARD (6 COLS)              */}
          {/* ══════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 flex flex-col gap-6 order-2 lg:order-1">
            
            {/* Step Selector Timeline Rail (Desktop) */}
            <div className="hidden lg:grid grid-cols-5 gap-2 border-b-2 border-ink pb-4">
              {steps.map((st, idx) => {
                const isActive = activeStep === idx;
                const isPassed = activeStep > idx;
                return (
                  <button
                    key={st.number}
                    onClick={() => switchStep(idx)}
                    className={`py-2 px-1 text-center font-mono text-xs font-bold transition-all border-2 rounded-xs cursor-pointer ${
                      isActive
                        ? 'bg-[#0B0B0B] text-[#FFE14D] border-ink shadow-brutal-sm font-black -translate-y-0.5'
                        : isPassed
                        ? 'bg-[#7CF2C1] text-ink border-ink font-black'
                        : 'bg-white text-ink/60 border-ink/30 hover:border-ink hover:text-ink'
                    }`}
                  >
                    <span className="block text-[10px] text-[#FF5A1F] font-black">{st.number}</span>
                    <span className="block truncate text-[11px] font-mono">{st.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Step Showcase Card */}
            <div className="how-step-content card-slab bg-white border-3 border-ink shadow-brutal p-6 sm:p-8 space-y-6 rounded-xs">
              
              {/* Header: Icon + Stage Tag + Title */}
              <div className="flex items-start gap-4">
                <div className="w-13 h-13 rounded-xs bg-[#FFE14D] border-2 border-ink flex items-center justify-center shrink-0 shadow-brutal-sm">
                  <StepIcon className="w-6 h-6 text-[#0B0B0B] stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <span className="inline-block font-mono text-[11px] font-black uppercase tracking-wider text-[#FF5A1F] bg-[#FFF4E0] border border-ink px-2 py-0.5">
                    {current.stage}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-ink leading-[0.98]">
                    {current.title}
                  </h3>
                </div>
              </div>

              {/* Sub-headline */}
              <div className="font-mono text-xs font-black uppercase text-ink border-l-3 border-[#FF5A1F] pl-3">
                {current.headline}
              </div>

              {/* Detailed Description */}
              <p className="font-mono text-xs sm:text-sm text-ink/80 leading-relaxed font-bold">
                {current.description}
              </p>

              {/* Metrics & Technical Spec Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-[#FFF4E0] border-2 border-ink rounded-xs font-mono">
                  <span className="block text-[10px] uppercase font-bold text-ink/60">BENCHMARK METRIC</span>
                  <span className="block text-sm font-black text-[#FF5A1F] mt-0.5">{current.metric}</span>
                </div>
                <div className="p-3 bg-white border-2 border-ink rounded-xs font-mono">
                  <span className="block text-[10px] uppercase font-bold text-ink/60">TOLERANCE PROTOCOL</span>
                  <span className="block text-[11px] font-black text-ink mt-0.5 leading-snug">{current.specs}</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/custom-lab')}
                  className="flex-1 btn-brutal btn-brutal-orange text-xs py-3.5 px-6 flex items-center justify-center gap-2 shadow-brutal"
                >
                  <span>LAUNCH INSTANT CAD SLICER</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Stage Stepper Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handlePrev}
                    className="w-11 h-11 bg-white hover:bg-[#FFE14D] border-2 border-ink shadow-brutal-sm flex items-center justify-center cursor-pointer transition-all"
                    title="Previous Stage"
                  >
                    <ChevronLeft className="w-4 h-4 text-ink stroke-[3]" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-11 h-11 bg-white hover:bg-[#FFE14D] border-2 border-ink shadow-brutal-sm flex items-center justify-center cursor-pointer transition-all"
                    title="Next Stage"
                  >
                    <ChevronRight className="w-4 h-4 text-ink stroke-[3]" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN: HIGH-TECH 3D FABRICATION CELL STAGE (6 COLS)              */}
          {/* ══════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 flex flex-col gap-3 order-1 lg:order-2">
            
            {/* The 3D Technical Cell Container */}
            <div className="card-slab bg-[#0B0B0B] text-white border-3 border-ink shadow-brutal-xl overflow-hidden rounded-xs relative">
              
              {/* Top Telemetry HUD Header */}
              <div className="p-3.5 border-b-2 border-white/20 bg-[#141418] flex items-center justify-between font-mono text-[11px] select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7CF2C1] animate-ping" />
                  <span className="font-black text-white tracking-wider">
                    CELL-04 // OPTICAL FABRICATION
                  </span>
                </div>
                <div className="flex items-center gap-3 text-white/70 text-[10px]">
                  <span>LAYER: <strong className="text-[#FFE14D]">{activeStep * 120 + 38}/600</strong></span>
                  <span className="hidden sm:inline">&bull;</span>
                  <span className="hidden sm:inline">Z: <strong className="text-[#FF5A1F]">{(sliceProgress * 48).toFixed(1)} MM</strong></span>
                </div>
              </div>

              {/* Interactive 3D Canvas Stage */}
              <div className="h-[320px] sm:h-[420px] lg:h-[460px] relative w-full bg-radial from-[#1e1e24] to-[#0B0B0B]">
                <Canvas
                  gl={{ localClippingEnabled: true, antialias: true }}
                  camera={{ position: [0, 2.2, 4.4], fov: 42 }}
                  style={{ background: 'transparent' }}
                >
                  <ambientLight intensity={1.4} />
                  <directionalLight position={[6, 9, 6]} intensity={2.4} castShadow />
                  <directionalLight position={[-6, 4, -4]} intensity={0.9} color="#8EA2FF" />
                  <pointLight position={[0, -1, 3]} intensity={1.2} color="#FF5A1F" />
                  
                  <IndustrialFabricationCell progress={sliceProgress} autoRotate={autoRotate} />
                  
                  <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={2.8}
                    maxDistance={6.5}
                    maxPolarAngle={Math.PI / 2 + 0.1}
                  />
                </Canvas>

                {/* Live Slicing Layer Callout */}
                <div className="absolute top-3 left-3 bg-[#0B0B0B]/85 backdrop-blur-md border border-white/20 px-2.5 py-1 text-[10px] font-mono font-bold text-white shadow-xs pointer-events-none flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[#FF5A1F] animate-pulse" />
                  <span>SLICER ELEVATION: {Math.round(sliceProgress * 100)}%</span>
                </div>

                {/* Auto Rotate Toggle Button */}
                <button
                  type="button"
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-mono font-black border transition-all cursor-pointer flex items-center gap-1.5 ${
                    autoRotate
                      ? 'bg-[#FFE14D] text-black border-black shadow-xs'
                      : 'bg-black/80 text-white/70 border-white/30 hover:border-white'
                  }`}
                  title="Toggle 360° Auto Rotation"
                >
                  {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{autoRotate ? 'AUTO 360°' : 'MANUAL'}</span>
                </button>
              </div>

              {/* Bottom Telemetry Status Strip */}
              <div className="p-3 border-t-2 border-white/20 bg-[#141418] flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-white/80 select-none">
                <div className="flex items-center gap-3">
                  <span>HOTEND: <strong className="text-white">245°C</strong></span>
                  <span>BED: <strong className="text-white">85°C</strong></span>
                  <span className="hidden sm:inline">SPEED: <strong className="text-[#7CF2C1]">500 MM/S</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-white/60">
                  <Move3d className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  <span>DRAG 360° TO INSPECT LAYER DATUM</span>
                </div>
              </div>

            </div>

            {/* Quick Slicing Progress Slider */}
            <div className="p-3 bg-white border-2 border-ink shadow-brutal-sm rounded-xs flex items-center gap-4 font-mono text-xs">
              <span className="font-black text-ink whitespace-nowrap text-[11px]">
                SLICER SCRUB:
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
                className="w-full accent-[#FF5A1F] cursor-pointer h-2 bg-[#FFF4E0] border border-ink"
              />
              <span className="font-black text-[#FF5A1F] whitespace-nowrap text-xs w-12 text-right">
                {Math.round(sliceProgress * 100)}%
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
