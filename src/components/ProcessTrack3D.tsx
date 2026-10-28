import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import * as THREE from 'three';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  PackageCheck,
  Send,
  Settings2,
  UploadCloud,
  Zap,
  Activity,
  Layers,
  Search,
  Box,
  Sliders,
} from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';

interface ProcessStep {
  number: string;
  title: string;
  stage: string;
  shortDesc: string;
  desc: string;
  specs: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  color: string;
  telemetry: string;
  milestone: string;
}

const steps: ProcessStep[] = [
  {
    number: '01',
    title: 'UPLOAD BLUEPRINT',
    stage: 'CAD ANALYSIS & INTEGRITY AUDIT',
    shortDesc: 'Automated geometric manifold & wall thickness inspection.',
    desc: 'Drag & drop your STL, OBJ, GLB, STEP, 3MF, or JPG/PNG blueprint files into our browser slicer. Our algorithms instantly inspect manifold geometry, watertight polygon boundaries, and wall thickness limits within 12 seconds.',
    specs: 'FORMATS: .STL, .OBJ, .GLB, .STEP, .3MF, .PNG, .JPG // MAX: 150MB',
    icon: UploadCloud,
    badge: 'STAGE 1',
    color: '#8EA2FF',
    telemetry: 'LIDAR_MESH_AUDIT // 100% WATERTIGHT',
    milestone: '0000 MM // UPLOAD',
  },
  {
    number: '02',
    title: 'PARAMETRIC SLICE',
    stage: 'LAYER RESOLUTION & INFILL SELECTION',
    shortDesc: '10μm to 280μm layer heights with Gyroid or Honeycomb infill.',
    desc: 'Configure layer height from 10 microns to 280 microns. Select polymer infill patterns (Gyroid, Grid, Honeycomb) from 10% lightweight to 100% solid structural metal-grade density with automated orientation.',
    specs: 'TOLERANCE: ±0.04MM // INFILL: 10%–100%',
    icon: Settings2,
    badge: 'STAGE 2',
    color: '#FFE14D',
    telemetry: 'SLICER_KERNEL // 10μm RESOLUTION',
    milestone: '0250 MM // SLICE',
  },
  {
    number: '03',
    title: 'ADDITIVE FABRICATION',
    stage: 'HEATED CHAMBER 3D PRINTING',
    shortDesc: 'High-speed 500 mm/s CoreXY & 12K optical photopolymerization.',
    desc: 'Your job routes automatically to calibrated industrial CoreXY FDM extruders with active 70°C chamber heating or monochrome 12K optical SLA photopolymer vats with real-time temperature telemetry.',
    specs: 'TEMP: UP TO 300°C // ACCEL: 20,000 MM/S²',
    icon: Zap,
    badge: 'STAGE 3',
    color: '#FF5A1F',
    telemetry: 'CLOSED_LOOP_EXTRUSION // 500 MM/S',
    milestone: '0500 MM // PRINT',
  },
  {
    number: '04',
    title: 'METROLOGY & FINISH',
    stage: 'CMM CALIPER AUDIT & POST-CURE',
    shortDesc: 'Automated laser micrometer inspection & thermal UV post-cure.',
    desc: 'Every fabricated part undergoes ultrasonic washing, UV thermal curing, and digital optical caliper inspection to verify dimensional tolerance compliance within ±0.04mm before clearing packaging.',
    specs: 'INSPECTION: 100% CMM AUDIT // FINISH: SANDED/CURED',
    icon: PackageCheck,
    badge: 'STAGE 4',
    color: '#7CF2C1',
    telemetry: 'CMM_METROLOGY // ±0.04MM VERIFIED',
    milestone: '0750 MM // AUDIT',
  },
  {
    number: '05',
    title: 'EXPRESS DISPATCH',
    stage: 'ESD SEALED & NATIONWIDE AIR COURIER',
    shortDesc: 'Vacuum-sealed in ESD moisture barriers with 24–48h express delivery.',
    desc: 'Sealed inside anti-static ESD moisture barrier bags with silica desiccants. Dispatched via priority air express across metro India with real-time telemetry tracking from our Bhopal manufacturing hub.',
    specs: 'PACKAGING: ESD VACUUM // VELOCITY: 24–48H',
    icon: Send,
    badge: 'STAGE 5',
    color: '#FF5A1F',
    telemetry: 'PRIORITY_DISPATCH // ALL-INDIA EXPRESS',
    milestone: '1000 MM // DISPATCH',
  },
];

// 5 Station Station X Coordinates along the linear rail
const STATION_X = [-3.4, -1.7, 0.0, 1.7, 3.4];

// ---------------------------------------------------------------------------
// 1. Station Machine Apparatuses along the Track
// ---------------------------------------------------------------------------
function StationApparatuses({ activeIndex }: { activeIndex: number }) {
  const scanLaserRef = useRef<THREE.Mesh>(null);
  const sliceLaserRef = useRef<THREE.Mesh>(null);
  const printHeadRef = useRef<THREE.Group>(null);
  const cmmProbeRef = useRef<THREE.Group>(null);
  const dispatchBeaconRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Station 1: Vertical scanning laser sweep
    if (scanLaserRef.current) {
      scanLaserRef.current.position.y = 0.45 + Math.sin(t * 4) * 0.35;
      scanLaserRef.current.scale.x = 0.85 + Math.sin(t * 6) * 0.15;
    }

    // Station 2: Horizontal slicing laser grid pulse
    if (sliceLaserRef.current) {
      sliceLaserRef.current.position.y = 0.2 + (Math.sin(t * 3) + 1) * 0.25;
      sliceLaserRef.current.rotation.z = Math.sin(t * 2) * 0.08;
    }

    // Station 3: 3D printing extruder nozzle toolpath motion
    if (printHeadRef.current) {
      printHeadRef.current.position.x = STATION_X[2] + Math.sin(t * 8) * 0.25;
      printHeadRef.current.position.z = Math.cos(t * 8) * 0.22;
      printHeadRef.current.position.y = 0.65 + Math.sin(t * 4) * 0.04;
    }

    // Station 4: CMM metrology touch probe vertical tapping
    if (cmmProbeRef.current) {
      cmmProbeRef.current.position.y = 0.6 + Math.sin(t * 2.5) * 0.12;
    }

    // Station 5: Dispatch amber warning beacon
    if (dispatchBeaconRef.current) {
      dispatchBeaconRef.current.intensity = 1.5 + Math.sin(t * 8) * 1.0;
    }
  });

  return (
    <group>
      {/* -------------------------------------------------------------------
          Station 1: Optical LiDAR Scanner Arch (Blue / Periwinkle)
      ------------------------------------------------------------------- */}
      <group position={[STATION_X[0], 0, 0]}>
        {/* Scanner Uprights & Arch */}
        <mesh position={[-0.45, 0.6, 0]} castShadow>
          <boxGeometry args={[0.08, 1.5, 0.12]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={2} color="#8EA2FF" />
        </mesh>
        <mesh position={[0.45, 0.6, 0]} castShadow>
          <boxGeometry args={[0.08, 1.5, 0.12]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={2} color="#8EA2FF" />
        </mesh>
        <mesh position={[0, 1.35, 0]} castShadow>
          <boxGeometry args={[1.0, 0.12, 0.18]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={2} color="#8EA2FF" />
        </mesh>
        {/* LiDAR Optical Sensor Head */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.3, 0.18, 0.22]} />
          <meshToonMaterial color="#8EA2FF" />
          <Outlines thickness={2} color="#0B0B0B" />
        </mesh>
        {/* Animated Scanning Laser Plane */}
        <mesh ref={scanLaserRef} position={[0, 0.45, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.8, 0.04]} />
          <meshBasicMaterial color="#8EA2FF" side={THREE.DoubleSide} transparent opacity={0.85} />
        </mesh>
        {activeIndex === 0 && (
          <pointLight position={[0, 0.5, 0]} color="#8EA2FF" intensity={3} distance={1.8} />
        )}
      </group>

      {/* -------------------------------------------------------------------
          Station 2: Parametric Slicing Tower (Lemon Yellow)
      ------------------------------------------------------------------- */}
      <group position={[STATION_X[1], 0, 0]}>
        {/* Slicer Gantry Arch */}
        <mesh position={[-0.45, 0.6, 0]} castShadow>
          <boxGeometry args={[0.08, 1.5, 0.12]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={2} color="#FFE14D" />
        </mesh>
        <mesh position={[0.45, 0.6, 0]} castShadow>
          <boxGeometry args={[0.08, 1.5, 0.12]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={2} color="#FFE14D" />
        </mesh>
        <mesh position={[0, 1.35, 0]}>
          <boxGeometry args={[1.0, 0.12, 0.18]} />
          <meshToonMaterial color="#FFE14D" />
          <Outlines thickness={2} color="#0B0B0B" />
        </mesh>
        {/* Laser Slicing Bar (sweeps vertically) */}
        <mesh ref={sliceLaserRef} position={[0, 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.82, 0.65]} />
          <meshBasicMaterial color="#FFE14D" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
        {activeIndex === 1 && (
          <pointLight position={[0, 0.6, 0]} color="#FFE14D" intensity={3} distance={1.8} />
        )}
      </group>

      {/* -------------------------------------------------------------------
          Station 3: Additive 3D Print CoreXY Extruder (Saturn Orange)
      ------------------------------------------------------------------- */}
      <group position={[STATION_X[2], 0, 0]}>
        {/* Heavy Gantry Framework */}
        <mesh position={[-0.52, 0.65, 0]} castShadow>
          <boxGeometry args={[0.1, 1.6, 0.14]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={2.4} color="#FF5A1F" />
        </mesh>
        <mesh position={[0.52, 0.65, 0]} castShadow>
          <boxGeometry args={[0.1, 1.6, 0.14]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={2.4} color="#FF5A1F" />
        </mesh>
        <mesh position={[0, 1.45, 0]} castShadow>
          <boxGeometry args={[1.14, 0.16, 0.2]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={2.4} color="#FF5A1F" />
        </mesh>
      </group>

      {/* Animated 3D Print Extruder Toolhead */}
      <group ref={printHeadRef} position={[STATION_X[2], 0.65, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.26, 0.22, 0.26]} />
          <meshToonMaterial color="#FF5A1F" />
          <Outlines thickness={2.2} color="#0B0B0B" />
        </mesh>
        {/* Brass Nozzle */}
        <mesh position={[0, -0.16, 0]}>
          <coneGeometry args={[0.07, 0.12, 10]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={1.8} color="#FFE14D" />
        </mesh>
        {activeIndex === 2 && (
          <pointLight position={[0, -0.2, 0]} color="#FF5A1F" intensity={5} distance={2.0} />
        )}
      </group>

      {/* -------------------------------------------------------------------
          Station 4: Optical CMM Caliper Metrology Tower (Mint Green)
      ------------------------------------------------------------------- */}
      <group position={[STATION_X[3], 0, 0]}>
        {/* Precision Measurement Frame */}
        <mesh position={[-0.45, 0.6, 0]} castShadow>
          <boxGeometry args={[0.08, 1.5, 0.12]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={2} color="#7CF2C1" />
        </mesh>
        <mesh position={[0.45, 0.6, 0]} castShadow>
          <boxGeometry args={[0.08, 1.5, 0.12]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={2} color="#7CF2C1" />
        </mesh>
        <mesh position={[0, 1.35, 0]}>
          <boxGeometry args={[1.0, 0.12, 0.18]} />
          <meshToonMaterial color="#7CF2C1" />
          <Outlines thickness={2} color="#0B0B0B" />
        </mesh>
      </group>

      {/* Animated CMM Probe */}
      <group ref={cmmProbeRef} position={[STATION_X[3], 0.6, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.45, 12]} />
          <meshToonMaterial color="#0B0B0B" />
        </mesh>
        {/* Ruby Probe Tip */}
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshToonMaterial color="#FF5A1F" />
          <Outlines thickness={1.8} color="#0B0B0B" />
        </mesh>
        {activeIndex === 3 && (
          <pointLight position={[0, 0.15, 0]} color="#7CF2C1" intensity={3.5} distance={1.8} />
        )}
      </group>

      {/* -------------------------------------------------------------------
          Station 5: Express Dispatch Packaging Gateway (Orange/Warning)
      ------------------------------------------------------------------- */}
      <group position={[STATION_X[4], 0, 0]}>
        {/* Gateway Arch */}
        <mesh position={[-0.48, 0.6, 0]} castShadow>
          <boxGeometry args={[0.1, 1.5, 0.14]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={2} color="#FFE14D" />
        </mesh>
        <mesh position={[0.48, 0.6, 0]} castShadow>
          <boxGeometry args={[0.1, 1.5, 0.14]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={2} color="#FFE14D" />
        </mesh>
        <mesh position={[0, 1.35, 0]} castShadow>
          <boxGeometry args={[1.06, 0.16, 0.2]} />
          <meshToonMaterial color="#FFE14D" />
          <Outlines thickness={2} color="#0B0B0B" />
        </mesh>
        {/* Warning Beacon Top */}
        <mesh position={[0, 1.52, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.14, 12]} />
          <meshToonMaterial color="#FF5A1F" />
          <Outlines thickness={1.8} color="#0B0B0B" />
        </mesh>
        <pointLight
          ref={dispatchBeaconRef}
          position={[0, 1.55, 0]}
          color="#FF5A1F"
          intensity={2}
          distance={2.5}
        />
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 2. High-Tech Linear Rail Track with Millimeter Rulers & Stepper Motor
// ---------------------------------------------------------------------------
function LinearRailBed({ activeIndex }: { activeIndex: number }) {
  return (
    <group position={[0, -0.22, 0]}>
      {/* Heavy Aluminum Base Extrusion (Black Ink with Orange Accent) */}
      <mesh position={[0, -0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[8.8, 0.24, 0.68]} />
        <meshToonMaterial color="#0B0B0B" />
        <Outlines thickness={2.6} color="#FF5A1F" />
      </mesh>

      {/* Dual Polished Chrome Linear Guide Shafts */}
      <mesh position={[0, -0.21, 0.16]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 8.8, 20]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, -0.21, -0.16]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 8.8, 20]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Center Precision GT2 Timing Belt (Toothed Rubber) */}
      <mesh position={[0, -0.22, 0]}>
        <boxGeometry args={[8.6, 0.03, 0.12]} />
        <meshToonMaterial color="#222222" />
      </mesh>

      {/* Left Drive: NEMA Stepper Motor Assembly */}
      <group position={[-4.55, -0.28, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.34, 0.44, 0.44]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={2} color="#FFE14D" />
        </mesh>
        <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
          <meshToonMaterial color="#FF5A1F" />
        </mesh>
      </group>

      {/* Right Drive: Idler Tensioner Block */}
      <group position={[4.55, -0.28, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.34, 0.44, 0.44]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={2} color="#FFE14D" />
        </mesh>
        <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
          <meshToonMaterial color="#FFE14D" />
        </mesh>
      </group>

      {/* 5 Physical Milestone Station Platforms on the Rail */}
      {STATION_X.map((xPos, idx) => {
        const isCurrent = idx === activeIndex;
        const isPassed = idx < activeIndex;
        return (
          <group key={idx} position={[xPos, -0.25, 0]}>
            {/* Station Mount Pad */}
            <mesh castShadow>
              <boxGeometry args={[0.55, 0.18, 0.76]} />
              <meshToonMaterial
                color={isCurrent ? '#FFE14D' : isPassed ? '#7CF2C1' : '#333333'}
              />
              <Outlines thickness={2.2} color="#0B0B0B" />
            </mesh>

            {/* Glowing Station Status LED */}
            <mesh position={[0, 0.1, 0.32]}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshBasicMaterial
                color={isCurrent ? '#FF5A1F' : isPassed ? '#7CF2C1' : '#555555'}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. The Motorized Carriage Carrying the Morphing Part
// ---------------------------------------------------------------------------
function MotorizedCarriage({ activeIndex }: { activeIndex: number }) {
  const carriageGroupRef = useRef<THREE.Group>(null);
  const partMeshRef = useRef<THREE.Mesh>(null);
  const targetX = STATION_X[activeIndex];

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (carriageGroupRef.current) {
      // Smooth linear interpolation along rail with snappy deceleration
      carriageGroupRef.current.position.x = THREE.MathUtils.lerp(
        carriageGroupRef.current.position.x,
        targetX,
        0.08
      );
    }

    if (partMeshRef.current) {
      // Continuous rotation of the artifact
      partMeshRef.current.rotation.y += 0.025;
      partMeshRef.current.position.y = 0.38 + Math.sin(t * 3.5) * 0.05;
    }
  });

  return (
    <group ref={carriageGroupRef} position={[STATION_X[0], -0.22, 0]}>
      {/* Heavy-Duty Linear Carriage CNC Block */}
      <mesh position={[0, -0.16, 0]} castShadow>
        <boxGeometry args={[0.72, 0.18, 0.52]} />
        <meshToonMaterial color="#0B0B0B" />
        <Outlines thickness={2.5} color="#FF5A1F" />
      </mesh>

      {/* Magnetic Chuck Fixture Base */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.34, 0.36, 0.08, 24]} />
        <meshToonMaterial color="#FAF7F2" />
        <Outlines thickness={2.2} color="#0B0B0B" />
      </mesh>

      {/* Glowing Carriage Status Ring */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.37, 0.42, 32]} />
        <meshBasicMaterial color="#FF5A1F" side={THREE.DoubleSide} />
      </mesh>

      {/* -----------------------------------------------------------------
          The 3D Artifact Morphing through the 5 Manufacturing Stages
      ----------------------------------------------------------------- */}
      <group position={[0, 0, 0]}>
        {/* Stage 1: Blue Wireframe Manifold Geometry */}
        {activeIndex === 0 && (
          <mesh ref={partMeshRef} position={[0, 0.38, 0]}>
            <octahedronGeometry args={[0.38, 1]} />
            <meshBasicMaterial color="#8EA2FF" wireframe />
          </mesh>
        )}

        {/* Stage 2: Sliced Layers Component (stepped fluted shape) */}
        {activeIndex === 1 && (
          <mesh ref={partMeshRef} position={[0, 0.38, 0]}>
            <cylinderGeometry args={[0.32, 0.38, 0.55, 12, 10]} />
            <meshToonMaterial color="#FFE14D" wireframe />
            <Outlines thickness={2.4} color="#0B0B0B" />
          </mesh>
        )}

        {/* Stage 3: Solid Fresh Additive Titanium Core with Thermal Glow */}
        {activeIndex === 2 && (
          <mesh ref={partMeshRef} position={[0, 0.38, 0]} castShadow>
            <dodecahedronGeometry args={[0.35, 0]} />
            <meshPhysicalMaterial
              color="#FF5A1F"
              metalness={0.7}
              roughness={0.25}
              clearcoat={0.6}
            />
            <Outlines thickness={2.6} color="#0B0B0B" />
          </mesh>
        )}

        {/* Stage 4: High-Precision Calibrated Titanium Prototype */}
        {activeIndex === 3 && (
          <mesh ref={partMeshRef} position={[0, 0.38, 0]} castShadow>
            <torusKnotGeometry args={[0.22, 0.08, 64, 16]} />
            <meshStandardMaterial color="#FFFFFF" metalness={0.85} roughness={0.2} />
            <Outlines thickness={2.6} color="#0B0B0B" />
          </mesh>
        )}

        {/* Stage 5: Finished, Inspected & Sealed Gold/Titanium Artifact */}
        {activeIndex === 4 && (
          <mesh ref={partMeshRef} position={[0, 0.38, 0]} castShadow>
            <icosahedronGeometry args={[0.36, 0]} />
            <meshStandardMaterial color="#FFE14D" metalness={0.9} roughness={0.15} />
            <Outlines thickness={3.0} color="#0B0B0B" />
          </mesh>
        )}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. Dynamic Camera Tracking Rig
// ---------------------------------------------------------------------------
function CameraRig({ activeIndex }: { activeIndex: number }) {
  const targetX = STATION_X[activeIndex];

  useFrame((state) => {
    // Graceful camera follow centering around the active station
    const targetCamX = targetX * 0.42;
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      targetCamX,
      0.05
    );
    state.camera.lookAt(targetCamX, 0.25, 0);
  });

  return null;
}

// ---------------------------------------------------------------------------
// Main Process Track Component
// ---------------------------------------------------------------------------
export default function ProcessTrack3D() {
  const [activeStep, setActiveStep] = useState(0);

  const currentStep = steps[activeStep];
  const StepIcon = currentStep.icon;

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-b-3 border-ink relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeader
            number="04"
            tag="PRODUCTION PROTOCOL"
            title="FROM STL BLUEPRINT TO DISPATCHED PART"
            highlightWord="DISPATCHED"
            subtitle="A standardized industrial workflow engineered for repeatability, micron-level accuracy, and 24-48 hour delivery."
            badgeText="5-STAGE PIPELINE"
            badgeColor="#FFE14D"
            className="mb-0"
          />

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="btn-brutal bg-white p-2.5 disabled:opacity-40"
              aria-label="Previous step"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div className="px-3.5 py-2 bg-white border-2 border-ink font-mono font-bold text-xs shadow-brutal-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] animate-pulse" />
              <span>STAGE {activeStep + 1} OF 5</span>
            </div>
            <button
              onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStep === steps.length - 1}
              className="btn-brutal btn-brutal-orange p-2.5 disabled:opacity-40"
              aria-label="Next step"
            >
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            3D Linear Rail Factory Stage Viewport (High-Presence Viewport)
        ----------------------------------------------------------------- */}
        <div className="card-slab bg-white p-3 sm:p-5 border-4 border-ink shadow-brutal-xl relative overflow-hidden">
          {/* Viewport Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b-3 border-ink text-xs font-mono font-bold bg-[#FAF7F2] -mx-3 sm:-mx-5 -mt-3 sm:-mt-5 p-3 sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 bg-[#FF5A1F] border border-ink inline-block animate-pulse" />
              <span className="text-[#0B0B0B] text-xs sm:text-sm font-black">
                ACTIVE CARRIAGE STAGE // 0{activeStep + 1}
              </span>
              <span className="hidden sm:inline text-[#FF5A1F] font-bold">
                &bull; {currentStep.telemetry}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] sm:text-xs">
              <span className="bg-[#FFE14D] px-2.5 py-0.5 border-2 border-ink font-bold shadow-brutal-xs">
                INTERACTIVE 3D RAIL
              </span>
              <span className="hidden md:inline bg-white px-2 py-0.5 border border-ink text-[#555]">
                VELOCITY: 500 MM/S
              </span>
            </div>
          </div>

          {/* Quick-Jump Station Tab Pills right above the 3D canvas */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 py-2 overflow-x-auto no-scrollbar border-b-2 border-ink/20 mb-2 font-mono text-[10px] sm:text-xs">
            {steps.map((st, i) => (
              <button
                key={st.number}
                onClick={() => setActiveStep(i)}
                className={`px-2.5 py-1 border border-ink font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  i === activeStep
                    ? 'bg-[#FF5A1F] text-black shadow-brutal-xs -translate-y-0.5'
                    : i < activeStep
                    ? 'bg-[#7CF2C1] text-black'
                    : 'bg-white hover:bg-[#FAF7F2] text-[#555]'
                }`}
              >
                <span>{st.number}</span>
                <span className="hidden sm:inline">{st.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Substantial, Tall 3D Canvas Viewport */}
          <div className="w-full h-64 sm:h-80 lg:h-[380px] relative blueprint-grid bg-[#FFFDF7] border-2 border-ink/40">
            <Canvas
              camera={{ position: [0, 1.3, 4.4], fov: 42 }}
              dpr={[1, 1.75]}
              className="w-full h-full"
            >
              {/* Studio Key & Ambient Lighting */}
              <ambientLight intensity={0.9} />
              <directionalLight position={[4, 6, 3]} intensity={1.8} castShadow />
              <directionalLight position={[-4, 3, -2]} intensity={0.8} color="#8EA2FF" />
              <pointLight position={[0, -0.5, 2]} intensity={0.5} />

              {/* Station Apparatuses (Scanners, Slicers, Extruders, Calipers) */}
              <StationApparatuses activeIndex={activeStep} />

              {/* Heavy Linear Rail Track Bed with Guide Rods & End Drives */}
              <LinearRailBed activeIndex={activeStep} />

              {/* The Motorized Carriage carrying the active Part */}
              <MotorizedCarriage activeIndex={activeStep} />

              {/* Dynamic Camera Tracking Rig */}
              <CameraRig activeIndex={activeStep} />
            </Canvas>

            {/* Viewport Floating HUD Corner Watermark */}
            <div className="absolute bottom-2 left-3 pointer-events-none font-mono text-[9px] sm:text-[10px] text-ink/70 font-bold bg-white/80 backdrop-blur-xs px-2 py-0.5 border border-ink">
              LINEAL_ENCODER: {currentStep.milestone}
            </div>

            <div className="absolute bottom-2 right-3 pointer-events-none font-mono text-[9px] sm:text-[10px] text-ink/70 font-bold bg-white/80 backdrop-blur-xs px-2 py-0.5 border border-ink">
              ACCEL: 20,000 MM/S² &bull; SERVO LOCKED
            </div>
          </div>

          {/* Viewport Bottom Station Ticks */}
          <div className="pt-2.5 mt-2 border-t-2 border-ink flex items-center justify-between text-[10px] sm:text-[11px] font-mono font-bold text-[#555]">
            <span className={activeStep === 0 ? 'text-[#FF5A1F] font-black' : ''}>
              STATION 1: UPLOAD
            </span>
            <span className={activeStep === 1 ? 'text-[#FF5A1F] font-black' : 'hidden sm:inline'}>
              STATION 2: SLICE
            </span>
            <span className={activeStep === 2 ? 'text-[#FF5A1F] font-black' : ''}>
              STATION 3: PRINT
            </span>
            <span className={activeStep === 3 ? 'text-[#FF5A1F] font-black' : 'hidden sm:inline'}>
              STATION 4: CMM AUDIT
            </span>
            <span className={activeStep === 4 ? 'text-[#FF5A1F] font-black' : ''}>
              STATION 5: EXPRESS
            </span>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            Connected 5-Stage Step Cards with Progress Track
        ----------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {steps.map((step, idx) => {
            const isActive = idx === activeStep;
            const isCompleted = idx < activeStep;
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`card-slab p-4 sm:p-5 cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#FF5A1F] text-[#0B0B0B] shadow-brutal border-4 translate-x-[-2px] translate-y-[-2px]'
                    : isCompleted
                    ? 'bg-[#FFFDF7] hover:bg-[#7CF2C1]/30 border-3 border-ink shadow-brutal-sm'
                    : 'bg-white hover:bg-[#FFE14D]/40 border-3 border-ink shadow-brutal-sm'
                }`}
              >
                <div>
                  {/* Top Row: Number & Status Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`font-display font-black text-2xl sm:text-3xl ${
                        isActive ? 'text-[#0B0B0B]' : isCompleted ? 'text-[#0B0B0B]' : 'text-[#FF5A1F]'
                      }`}
                    >
                      {step.number}
                    </span>

                    <div
                      className={`w-9 h-9 rounded-xs border-2 border-ink flex items-center justify-center ${
                        isActive
                          ? 'bg-white text-[#0B0B0B] shadow-brutal-xs'
                          : isCompleted
                          ? 'bg-[#7CF2C1] text-black'
                          : 'bg-[#FAF7F2] text-[#0B0B0B]'
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Stage Badge */}
                  <div
                    className={`inline-block text-[10px] font-mono font-black uppercase tracking-wider mb-2 px-1.5 py-0.5 border border-ink ${
                      isActive ? 'bg-[#FFE14D] text-black' : 'bg-white text-[#FF5A1F]'
                    }`}
                  >
                    {step.badge}
                  </div>

                  {/* Title */}
                  <h4 className="font-display font-black text-sm uppercase tracking-tight leading-snug mb-2">
                    {step.title}
                  </h4>

                  {/* Short Summary */}
                  <p className="font-body text-xs leading-relaxed opacity-90 line-clamp-3 mb-3">
                    {step.shortDesc}
                  </p>
                </div>

                {/* Status Pill Bottom */}
                <div className="pt-2 border-t-2 border-ink/20 flex items-center justify-between text-[10px] font-mono font-bold">
                  <span>{step.milestone.split('//')[0].trim()}</span>
                  <span
                    className={
                      isActive
                        ? 'font-black underline'
                        : isCompleted
                        ? 'text-[#0B0B0B]'
                        : 'text-[#888]'
                    }
                  >
                    {isActive ? '● DOCKED' : isCompleted ? '✓ DONE' : 'WAITING'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* -----------------------------------------------------------------
            Active Stage Detailed Deep Dive Slab
        ----------------------------------------------------------------- */}
        <div className="card-slab bg-white p-6 sm:p-8 border-4 border-ink shadow-brutal-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="section-tag text-xs font-black">
                  STAGE 0{activeStep + 1} TECHNICAL PROTOCOL
                </span>
                <span className="badge-sticker bg-[#FFE14D] text-xs font-bold">
                  {currentStep.stage}
                </span>
                <span className="badge-sticker bg-[#7CF2C1] text-xs font-bold hidden sm:inline-flex">
                  VELOCITY: 500 MM/S
                </span>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-[#0B0B0B]">
                {currentStep.title}
              </h3>

              <p className="font-body text-sm sm:text-base text-[#222] font-semibold leading-relaxed">
                {currentStep.desc}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="font-mono text-xs font-black text-[#0B0B0B] bg-[#FAF7F2] p-2.5 border-2 border-ink shadow-brutal-xs">
                  {currentStep.specs}
                </div>
                <div className="font-mono text-xs font-bold text-[#FF5A1F] bg-white p-2.5 border-2 border-ink">
                  {currentStep.telemetry}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end gap-3 pt-4 lg:pt-0 border-t-2 lg:border-t-0 border-ink">
              <a
                href="/custom-lab"
                className="btn-brutal btn-brutal-orange text-xs sm:text-sm py-3.5 px-6 flex items-center gap-2 shadow-brutal w-full sm:w-auto justify-center"
              >
                <span>TEST CAD IN THIS STAGE</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </a>
              <div className="text-[11px] font-mono font-bold text-[#555] space-y-0.5 text-left lg:text-right">
                <div>&bull; ZERO SETUP FEES // INSTANT 12S QUOTE</div>
                <div>&bull; AUTO MESH REPAIR & TOLERANCE AUDIT</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
