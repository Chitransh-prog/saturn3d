'use client';

import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Sliders, RotateCw, RefreshCw, Zap, Cpu } from 'lucide-react';

interface HeroStage3DProps {
  printProgress?: number;
  isPrinting?: boolean;
  reducedMotion?: boolean;
  onTriggerReprint?: () => void;
}

// ---------------------------------------------------------------------------
// 1. Procedural High-Precision Industrial CoreXY 3D Printer
// ---------------------------------------------------------------------------
function SaturnCorePrinter({
  layerProgress,
  isPrinting,
}: {
  layerProgress: number;
  isPrinting: boolean;
}) {
  const gantryRef = useRef<THREE.Group>(null);
  const toolheadRef = useRef<THREE.Group>(null);
  const nozzleGlowRef = useRef<THREE.PointLight>(null);
  const printheadLedRef = useRef<THREE.MeshStandardMaterial>(null);

  // Materials
  const materials = useMemo(() => {
    return {
      // Anodized dark graphite 2020/2040 aluminum frame
      frame: new THREE.MeshStandardMaterial({
        color: 0x181a20,
        metalness: 0.85,
        roughness: 0.3,
      }),
      // Saturn Orange CNC milled corner brackets
      orangeAccent: new THREE.MeshStandardMaterial({
        color: 0xff5a1f,
        metalness: 0.4,
        roughness: 0.35,
      }),
      // Polished stainless steel linear guide rods & lead screws
      steelRod: new THREE.MeshStandardMaterial({
        color: 0xe5e7eb,
        metalness: 0.95,
        roughness: 0.12,
      }),
      // Heated aluminum bed subplate
      bedPlate: new THREE.MeshStandardMaterial({
        color: 0x1f242d,
        metalness: 0.7,
        roughness: 0.4,
      }),
      // Textured gold-sheen PEI spring steel build surface
      peiSheet: new THREE.MeshStandardMaterial({
        color: 0x222630,
        metalness: 0.5,
        roughness: 0.5,
      }),
      // PEI Gold accent edge
      peiGoldEdge: new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.8,
        roughness: 0.25,
      }),
      // Smoked tinted acrylic side/rear enclosure
      smokedGlass: new THREE.MeshPhysicalMaterial({
        color: 0x0f1318,
        transmission: 0.65,
        opacity: 0.45,
        transparent: true,
        roughness: 0.2,
        metalness: 0.1,
      }),
      // Toolhead industrial shroud
      shroud: new THREE.MeshStandardMaterial({
        color: 0x12151b,
        metalness: 0.6,
        roughness: 0.4,
      }),
      // Brass Volcano Hotend Nozzle
      brassNozzle: new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.9,
        roughness: 0.2,
      }),
      // Hotend Molten Deposition Glow
      moltenGlow: new THREE.MeshBasicMaterial({
        color: 0xff5a1f,
      }),
      // Carbon composite printed part
      carbonPart: new THREE.MeshStandardMaterial({
        color: 0x161920,
        metalness: 0.35,
        roughness: 0.45,
      }),
      // Orange part detail
      orangePart: new THREE.MeshStandardMaterial({
        color: 0xff5a1f,
        metalness: 0.3,
        roughness: 0.35,
      }),
    };
  }, []);

  // Frame Dimensions
  const W = 2.4; // Width (X)
  const D = 2.4; // Depth (Z)
  const H = 2.7; // Height (Y)
  const beamR = 0.045; // Beam half-thickness
  const bedY = 0.75 + layerProgress * 0.1; // Bed sits at solid position

  // Toolhead kinematics animation loop
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * (isPrinting ? 2.2 : 1.4);

    // Realistic Lissajous toolpath on the X-Z plane
    const targetX = Math.sin(t * 1.8) * 0.42 + Math.sin(t * 3.6) * 0.12;
    const targetZ = Math.cos(t * 1.5) * 0.42 + Math.cos(t * 3.0) * 0.10;

    if (toolheadRef.current) {
      toolheadRef.current.position.x = THREE.MathUtils.lerp(
        toolheadRef.current.position.x,
        targetX,
        0.25
      );
    }

    if (gantryRef.current) {
      gantryRef.current.position.z = THREE.MathUtils.lerp(
        gantryRef.current.position.z,
        targetZ,
        0.25
      );
    }

    // Dynamic nozzle glow pulse
    if (nozzleGlowRef.current) {
      nozzleGlowRef.current.intensity = 3.5 + Math.sin(t * 8) * 1.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ===================================================================
          1. RIGID 2040 ANODIZED ALUMINUM OUTER CHASSIS
      =================================================================== */}
      {/* 4 Vertical Main Corner Pillars */}
      {[
        [-W / 2 + beamR, -D / 2 + beamR],
        [W / 2 - beamR, -D / 2 + beamR],
        [-W / 2 + beamR, D / 2 - beamR],
        [W / 2 - beamR, D / 2 - beamR],
      ].map(([x, z], i) => (
        <group key={`col-${i}`} position={[x, H / 2, z]}>
          <mesh material={materials.frame} castShadow receiveShadow>
            <boxGeometry args={[beamR * 2, H, beamR * 2]} />
          </mesh>
          {/* Top & Bottom Rubber/Silicone Shock Absorber Foot */}
          <mesh material={materials.frame} position={[0, -H / 2 - 0.03, 0]}>
            <cylinderGeometry args={[0.07, 0.08, 0.06, 16]} />
          </mesh>
        </group>
      ))}

      {/* 4 Bottom Horizontal Base Extrusions */}
      <mesh material={materials.frame} position={[0, beamR, -D / 2 + beamR]}>
        <boxGeometry args={[W, beamR * 2, beamR * 2]} />
      </mesh>
      <mesh material={materials.frame} position={[0, beamR, D / 2 - beamR]}>
        <boxGeometry args={[W, beamR * 2, beamR * 2]} />
      </mesh>
      <mesh material={materials.frame} position={[-W / 2 + beamR, beamR, 0]}>
        <boxGeometry args={[beamR * 2, beamR * 2, D]} />
      </mesh>
      <mesh material={materials.frame} position={[W / 2 - beamR, beamR, 0]}>
        <boxGeometry args={[beamR * 2, beamR * 2, D]} />
      </mesh>

      {/* 4 Top Horizontal Gantry Frame Extrusions */}
      <mesh material={materials.frame} position={[0, H - beamR, -D / 2 + beamR]}>
        <boxGeometry args={[W, beamR * 2, beamR * 2]} />
      </mesh>
      <mesh material={materials.frame} position={[0, H - beamR, D / 2 - beamR]}>
        <boxGeometry args={[W, beamR * 2, beamR * 2]} />
      </mesh>
      <mesh material={materials.frame} position={[-W / 2 + beamR, H - beamR, 0]}>
        <boxGeometry args={[beamR * 2, beamR * 2, D]} />
      </mesh>
      <mesh material={materials.frame} position={[W / 2 - beamR, H - beamR, 0]}>
        <boxGeometry args={[beamR * 2, beamR * 2, D]} />
      </mesh>

      {/* 8 Saturn Orange CNC Corner Brackets with Bolt Detail */}
      {[
        [-W / 2 + 0.1, 0.1, -D / 2 + 0.1],
        [W / 2 - 0.1, 0.1, -D / 2 + 0.1],
        [-W / 2 + 0.1, 0.1, D / 2 - 0.1],
        [W / 2 - 0.1, 0.1, D / 2 - 0.1],
        [-W / 2 + 0.1, H - 0.1, -D / 2 + 0.1],
        [W / 2 - 0.1, H - 0.1, -D / 2 + 0.1],
        [-W / 2 + 0.1, H - 0.1, D / 2 - 0.1],
        [W / 2 - 0.1, H - 0.1, D / 2 - 0.1],
      ].map(([x, y, z], i) => (
        <mesh key={`bracket-${i}`} material={materials.orangeAccent} position={[x, y, z]}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
        </mesh>
      ))}

      {/* Smoked Tinted Acrylic Side & Back Panels (Open Front Chamber for Crystal Clear View) */}
      {/* Back Panel */}
      <mesh material={materials.smokedGlass} position={[0, H / 2, -D / 2 + 0.01]}>
        <boxGeometry args={[W - 0.1, H - 0.12, 0.015]} />
      </mesh>
      {/* Left Panel */}
      <mesh material={materials.smokedGlass} position={[-W / 2 + 0.01, H / 2, 0]}>
        <boxGeometry args={[0.015, H - 0.12, D - 0.1]} />
      </mesh>
      {/* Right Panel */}
      <mesh material={materials.smokedGlass} position={[W / 2 - 0.01, H / 2, 0]}>
        <boxGeometry args={[0.015, H - 0.12, D - 0.1]} />
      </mesh>

      {/* Top Front Saturn Orange Logo Badge */}
      <mesh material={materials.orangeAccent} position={[0, H - 0.03, D / 2 - 0.01]}>
        <boxGeometry args={[0.7, 0.04, 0.02]} />
      </mesh>

      {/* ===================================================================
          2. DUAL Z-AXIS LEAD SCREWS & LINEAR GUIDE RODS
      =================================================================== */}
      {/* Left Z-Axis: Linear Rod + Trapezoidal Lead Screw */}
      <mesh material={materials.steelRod} position={[-W / 2 + 0.22, H / 2, 0]}>
        <cylinderGeometry args={[0.016, 0.016, H - 0.2, 20]} />
      </mesh>
      <mesh material={materials.steelRod} position={[-W / 2 + 0.32, H / 2, 0]}>
        <cylinderGeometry args={[0.012, 0.012, H - 0.2, 20]} />
      </mesh>

      {/* Right Z-Axis: Linear Rod + Trapezoidal Lead Screw */}
      <mesh material={materials.steelRod} position={[W / 2 - 0.22, H / 2, 0]}>
        <cylinderGeometry args={[0.016, 0.016, H - 0.2, 20]} />
      </mesh>
      <mesh material={materials.steelRod} position={[W / 2 - 0.32, H / 2, 0]}>
        <cylinderGeometry args={[0.012, 0.012, H - 0.2, 20]} />
      </mesh>

      {/* ===================================================================
          3. HEATED BED PLATFORM & TEXTURED PEI SPRING STEEL SHEET
      =================================================================== */}
      <group position={[0, bedY, 0]}>
        {/* Aluminum Sub-Bed Carrier */}
        <mesh material={materials.bedPlate} position={[0, -0.04, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.04, 1.7]} />
        </mesh>

        {/* 4 Corner Bed Leveling Knobs (Saturn Orange) */}
        {[
          [-0.75, -0.75],
          [0.75, -0.75],
          [-0.75, 0.75],
          [0.75, 0.75],
        ].map(([kx, kz], idx) => (
          <mesh
            key={`knob-${idx}`}
            material={materials.orangeAccent}
            position={[kx, -0.07, kz]}
          >
            <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
          </mesh>
        ))}

        {/* Textured PEI Spring Steel Build Sheet with Gold Trim */}
        <mesh material={materials.peiGoldEdge} position={[0, -0.015, 0]} receiveShadow>
          <boxGeometry args={[1.62, 0.01, 1.62]} />
        </mesh>
        <mesh material={materials.peiSheet} position={[0, -0.008, 0]} receiveShadow>
          <boxGeometry args={[1.58, 0.008, 1.58]} />
        </mesh>

        {/* Precision Laser-Etched Bed Calibration Grid Lines */}
        {[-0.5, -0.25, 0, 0.25, 0.5].map((pos, idx) => (
          <React.Fragment key={`grid-${idx}`}>
            {/* X-direction lines */}
            <mesh position={[0, -0.003, pos]}>
              <boxGeometry args={[1.4, 0.002, 0.004]} />
              <meshBasicMaterial color="#374151" />
            </mesh>
            {/* Z-direction lines */}
            <mesh position={[pos, -0.003, 0]}>
              <boxGeometry args={[0.004, 0.002, 1.4]} />
              <meshBasicMaterial color="#374151" />
            </mesh>
          </React.Fragment>
        ))}

        {/* Center Target Mark */}
        <mesh position={[0, -0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08, 0.09, 32]} />
          <meshBasicMaterial color="#FF5A1F" />
        </mesh>

        {/* ===================================================================
            4. THE REAL HIGH-TECH ENGINEERING PART BEING PRINTED
        =================================================================== */}
        <group position={[0, 0, 0]}>
          {/* Base Mounting Hub / Planetary Carrier */}
          <mesh material={materials.carbonPart} position={[0, 0.04, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.55, 0.62, 0.08, 36]} />
          </mesh>

          {/* Hexagonal Core Base Boss */}
          <mesh material={materials.orangePart} position={[0, 0.09, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.04, 6]} />
          </mesh>

          {/* Precision Aerospace Turbomachinery Stator Core */}
          <mesh material={materials.carbonPart} position={[0, 0.22, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.46, 0.24, 32]} />
          </mesh>

          {/* Dynamic Spiral Impeller Aerodynamic Vanes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <group key={`vane-${i}`} rotation={[0, rad, 0]} position={[0, 0.22, 0]}>
                <mesh
                  material={materials.orangePart}
                  position={[0.26, 0, 0]}
                  rotation={[0.25, 0.35, 0.05]}
                  castShadow
                >
                  <boxGeometry args={[0.18, 0.22, 0.035]} />
                </mesh>
              </group>
            );
          })}

          {/* Top Drive Hub Flange */}
          <mesh material={materials.carbonPart} position={[0, 0.38, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.24, 0.28, 0.12, 24]} />
          </mesh>

          {/* Central Shaft Bore (Metallic Hollow Core) */}
          <mesh material={materials.steelRod} position={[0, 0.39, 0]}>
            <cylinderGeometry args={[0.10, 0.10, 0.14, 20]} />
          </mesh>

          {/* Active Deposition Contact Ring (Where molten filament is bonding) */}
          <mesh position={[0, 0.445, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.12, 0.26, 32]} />
            <meshBasicMaterial color="#FF5A1F" transparent opacity={0.9} />
          </mesh>
        </group>
      </group>

      {/* ===================================================================
          5. COREXY GANTRY & ACTIVE MOVING TOOLHEAD
      =================================================================== */}
      {/* Dual Left & Right Y-Axis Stainless Linear Rails */}
      <mesh material={materials.steelRod} position={[-W / 2 + 0.18, H - 0.38, 0]}>
        <boxGeometry args={[0.02, 0.03, D - 0.4]} />
      </mesh>
      <mesh material={materials.steelRod} position={[W / 2 - 0.18, H - 0.38, 0]}>
        <boxGeometry args={[0.02, 0.03, D - 0.4]} />
      </mesh>

      {/* Moving X-Axis Cross Gantry Bridge */}
      <group ref={gantryRef} position={[0, H - 0.38, 0]}>
        {/* Main Gantry Crossbeam (Carbon / Anodized Aluminum) */}
        <mesh material={materials.frame} castShadow>
          <boxGeometry args={[W - 0.32, 0.05, 0.06]} />
        </mesh>
        {/* Stainless Steel X Linear Rail */}
        <mesh material={materials.steelRod} position={[0, 0.026, 0.015]}>
          <boxGeometry args={[W - 0.36, 0.015, 0.02]} />
        </mesh>

        {/* Left & Right Y-Axis Linear Carriage Blocks */}
        <mesh material={materials.orangeAccent} position={[-W / 2 + 0.18, 0, 0]}>
          <boxGeometry args={[0.05, 0.06, 0.1]} />
        </mesh>
        <mesh material={materials.orangeAccent} position={[W / 2 - 0.18, 0, 0]}>
          <boxGeometry args={[0.05, 0.06, 0.1]} />
        </mesh>

        {/* =================================================================
            ACTIVE TOOLHEAD CARRIAGE (Moves along X axis on the gantry)
        ================================================================= */}
        <group ref={toolheadRef} position={[0, -0.12, 0]}>
          {/* Main Stealth Printhead Shroud */}
          <mesh material={materials.shroud} position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.18, 0.18, 0.16]} />
          </mesh>

          {/* Front Air Intake Fan Grill */}
          <mesh position={[0, 0.02, 0.082]}>
            <circleGeometry args={[0.055, 20]} />
            <meshStandardMaterial color="#0B0D10" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Status Indicator LED (Saturn Orange) */}
          <mesh position={[0, 0.09, 0.082]}>
            <planeGeometry args={[0.06, 0.015]} />
            <meshBasicMaterial color="#FF5A1F" />
          </mesh>

          {/* Left & Right Part Cooling Blower Ducts */}
          <mesh material={materials.orangeAccent} position={[-0.07, -0.06, 0.02]}>
            <boxGeometry args={[0.035, 0.08, 0.06]} />
          </mesh>
          <mesh material={materials.orangeAccent} position={[0.07, -0.06, 0.02]}>
            <boxGeometry args={[0.035, 0.08, 0.06]} />
          </mesh>

          {/* Aluminum Hotend Heatsink */}
          <mesh material={materials.steelRod} position={[0, -0.06, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.06, 16]} />
          </mesh>

          {/* Brass Volcano Hotend Nozzle */}
          <mesh material={materials.brassNozzle} position={[0, -0.11, 0]}>
            <coneGeometry args={[0.03, 0.06, 16]} />
          </mesh>

          {/* Molten Extrusion Nozzle Tip Bead */}
          <mesh material={materials.moltenGlow} position={[0, -0.142, 0]}>
            <sphereGeometry args={[0.012, 12, 12]} />
          </mesh>

          {/* Real-time Dynamic Point Light Cast Directly onto the Printed Part! */}
          <pointLight
            ref={nozzleGlowRef}
            color="#FF5A1F"
            intensity={4}
            distance={1.6}
            decay={2}
            position={[0, -0.15, 0]}
          />
        </group>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 2. Camera Configuration & Studio Lighting Rig
// ---------------------------------------------------------------------------
function CameraAndStudioSetup() {
  const { gl } = useThree();

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.25;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);

  return (
    <>
      {/* Studio Key Light (Pure Cool White Directional Light) */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={2.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Rim Light for Dramatic Contour Shading */}
      <directionalLight position={[-4, 3, -4]} intensity={1.5} color="#A3A9B3" />

      {/* Warm Saturn Orange Fill from the base */}
      <directionalLight position={[0, 1, 4]} intensity={0.8} color="#FF8A50" />

      {/* Balanced Ambient Light */}
      <ambientLight intensity={0.9} />
    </>
  );
}

// ---------------------------------------------------------------------------
// 3. Main Hero Stage 3D Export
// ---------------------------------------------------------------------------
export default function HeroStage3D({
  printProgress = 1.0,
  isPrinting = false,
  reducedMotion = false,
  onTriggerReprint,
}: HeroStage3DProps) {
  const [manualProgress, setManualProgress] = useState(1.0);
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<any>(null);

  const activeProgress = manualProgress !== 1.0 ? manualProgress : printProgress;

  const handleResetCamera = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#0B0D10] via-[#101318] to-[#0B0D10] border border-white/10 shadow-2xl flex flex-col justify-between select-none">
      
      {/* 3D Canvas Renders 100% INSTANTLY with 0 delay */}
      <Canvas
        shadows
        camera={{ position: [3.4, 2.7, 4.2], fov: 36 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <CameraAndStudioSetup />

        {/* Our Custom Procedural Precision 3D Printer */}
        <SaturnCorePrinter
          layerProgress={activeProgress}
          isPrinting={isPrinting}
        />

        {/* Studio Soft Floor Contact Shadow */}
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.65}
          scale={7}
          blur={1.8}
          far={3}
          color="#000000"
        />

        {/* Orbit Controls (Full Inspection, Smooth Damping) */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={2.6}
          maxDistance={7.5}
          maxPolarAngle={Math.PI / 2 + 0.02}
          autoRotate={autoRotate && !reducedMotion}
          autoRotateSpeed={0.7}
          target={[0, 1.25, 0]}
        />
      </Canvas>

      {/* Top Right Discreet View Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 pointer-events-auto">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title="Toggle Smooth Auto-Rotation"
          className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
            autoRotate
              ? 'bg-[#FF5A1F]/20 border-[#FF5A1F] text-[#FF5A1F]'
              : 'bg-[#0B0D10]/80 border-white/10 text-[#A3A9B3] hover:text-white'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleResetCamera}
          title="Reset Isometric Angle"
          className="p-2 rounded-xl bg-[#0B0D10]/80 border border-white/10 text-[#A3A9B3] hover:text-white backdrop-blur-md transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Minimalist Engineered Bottom Bar: Layer Scrubber + Clean Status */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#0B0D10]/90 border border-white/10 backdrop-blur-md z-20 pointer-events-auto shadow-xl">
        {/* Layer Slicing Scrubber */}
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#A3A9B3] flex-shrink-0">
            <Sliders className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>Layer Slicing:</span>
          </div>

          <input
            type="range"
            min="0.05"
            max="1.0"
            step="0.01"
            value={activeProgress}
            onChange={(e) => setManualProgress(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#FF5A1F]"
          />

          <span className="font-mono text-xs text-[#FF5A1F] font-semibold flex-shrink-0 min-w-[36px]">
            {Math.round(activeProgress * 100)}%
          </span>
        </div>

        {/* Clean Machine Telemetry Status Line */}
        <div className="flex items-center gap-2.5 text-[11px] font-mono text-[#A3A9B3] border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-3 flex-shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            CoreXY Active
          </span>
          <span className="text-[#FF5A1F]">•</span>
          <span>Nozzle 245°C</span>
          <span className="text-[#FF5A1F]">•</span>
          <span>Bed 90°C</span>
          <span className="text-[#FF5A1F]">•</span>
          <span className="text-white">±0.04mm</span>
        </div>
      </div>
    </div>
  );
}
