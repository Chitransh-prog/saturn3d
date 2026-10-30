'use client';

import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Sliders, RotateCw, RefreshCw, Zap, Play, Pause } from 'lucide-react';

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
  isAutoPrinting,
  onCoordsUpdate,
}: {
  layerProgress: number;
  isAutoPrinting: boolean;
  onCoordsUpdate?: (x: number, y: number, z: number) => void;
}) {
  const gantryRef = useRef<THREE.Group>(null);
  const toolheadRef = useRef<THREE.Group>(null);
  const nozzleGlowRef = useRef<THREE.PointLight>(null);
  const activeExtrusionRingRef = useRef<THREE.Mesh>(null);
  const sparksRef = useRef<THREE.Points>(null);

  // Materials
  const materials = useMemo(() => {
    return {
      // Anodized dark graphite 2020/2040 aluminum frame
      frame: new THREE.MeshStandardMaterial({
        color: 0x16181f,
        metalness: 0.88,
        roughness: 0.28,
      }),
      // Saturn Orange CNC milled corner brackets
      orangeAccent: new THREE.MeshStandardMaterial({
        color: 0xff5a1f,
        metalness: 0.45,
        roughness: 0.3,
      }),
      // Polished stainless steel linear guide rods & lead screws
      steelRod: new THREE.MeshStandardMaterial({
        color: 0xeef0f4,
        metalness: 0.98,
        roughness: 0.1,
      }),
      // Heated aluminum bed subplate
      bedPlate: new THREE.MeshStandardMaterial({
        color: 0x1c2027,
        metalness: 0.75,
        roughness: 0.35,
      }),
      // Textured gold-sheen PEI spring steel build surface
      peiSheet: new THREE.MeshStandardMaterial({
        color: 0x222631,
        metalness: 0.55,
        roughness: 0.48,
      }),
      // PEI Gold accent edge
      peiGoldEdge: new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.85,
        roughness: 0.22,
      }),
      // Smoked tinted acrylic side/rear enclosure
      smokedGlass: new THREE.MeshPhysicalMaterial({
        color: 0x0e1116,
        transmission: 0.7,
        opacity: 0.4,
        transparent: true,
        roughness: 0.18,
        metalness: 0.1,
      }),
      // Toolhead industrial shroud
      shroud: new THREE.MeshStandardMaterial({
        color: 0x11141a,
        metalness: 0.65,
        roughness: 0.35,
      }),
      // Brass Volcano Hotend Nozzle
      brassNozzle: new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.92,
        roughness: 0.18,
      }),
      // Molten orange extruded filament
      moltenOrange: new THREE.MeshBasicMaterial({
        color: 0xff5a1f,
      }),
      // Carbon-X PA12 composite printed part
      carbonPart: new THREE.MeshStandardMaterial({
        color: 0x14171d,
        metalness: 0.3,
        roughness: 0.42,
      }),
      // Orange part detail
      orangePart: new THREE.MeshStandardMaterial({
        color: 0xff5a1f,
        metalness: 0.35,
        roughness: 0.32,
      }),
    };
  }, []);

  // Frame Dimensions
  const W = 2.4; // Width (X)
  const D = 2.4; // Depth (Z)
  const H = 2.6; // Height (Y)
  const beamR = 0.045; // Beam half-thickness

  // FIXED KINEMATIC ZERO PLANES:
  // The nozzle tip is at fixed height y = 1.30.
  // The bed lowers as layers accumulate from y = 1.25 down to y = 0.65!
  const NOZZLE_Y = 1.30;
  const maxPartHeight = 0.58;
  const currentPartHeight = Math.max(0.04, layerProgress * maxPartHeight);
  const bedY = NOZZLE_Y - currentPartHeight;

  // Spark / molten particles setup
  const particleCount = 20;
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.08;
      pos[i * 3 + 1] = -Math.random() * 0.05;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  // Dynamic Kinematics Toolpath Loop
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * (isAutoPrinting ? 3.2 : 1.6);

    // Multi-phase authentic toolpath (Outer circular perimeter -> Radial infill spokes)
    const phase = Math.floor(t / 6) % 2;
    let targetX = 0;
    let targetZ = 0;

    if (phase === 0) {
      // High-speed outer perimeter loop
      const r = 0.42;
      targetX = Math.cos(t * 2.2) * r;
      targetZ = Math.sin(t * 2.2) * r;
    } else {
      // Rapid infill cross-hatch
      const r = 0.12 + Math.abs(Math.sin(t * 1.2)) * 0.28;
      targetX = Math.cos(t * 4.6) * r;
      targetZ = Math.sin(t * 4.6) * r;
    }

    if (toolheadRef.current) {
      toolheadRef.current.position.x = THREE.MathUtils.lerp(
        toolheadRef.current.position.x,
        targetX,
        0.3
      );
    }

    if (gantryRef.current) {
      gantryRef.current.position.z = THREE.MathUtils.lerp(
        gantryRef.current.position.z,
        targetZ,
        0.3
      );
    }

    // Dynamic nozzle light pulse
    if (nozzleGlowRef.current) {
      nozzleGlowRef.current.intensity = 3.8 + Math.sin(t * 12) * 1.5;
    }

    // Extrusion ring rotation / pulse
    if (activeExtrusionRingRef.current) {
      activeExtrusionRingRef.current.rotation.z += 0.04;
    }

    // Telemetry callback
    if (onCoordsUpdate && Math.random() < 0.2) {
      onCoordsUpdate(
        Math.round(targetX * 250),
        Math.round(targetZ * 250),
        Math.round(currentPartHeight * 100)
      );
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
          <mesh material={materials.frame} position={[0, -H / 2 - 0.03, 0]}>
            <cylinderGeometry args={[0.07, 0.08, 0.06, 16]} />
          </mesh>
        </group>
      ))}

      {/* 4 Bottom Base Extrusions */}
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

      {/* 4 Top Gantry Frame Extrusions */}
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

      {/* 8 Saturn Orange CNC Corner Brackets */}
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

      {/* Smoked Tinted Acrylic Side & Back Panels (Open Front) */}
      <mesh material={materials.smokedGlass} position={[0, H / 2, -D / 2 + 0.01]}>
        <boxGeometry args={[W - 0.1, H - 0.12, 0.015]} />
      </mesh>
      <mesh material={materials.smokedGlass} position={[-W / 2 + 0.01, H / 2, 0]}>
        <boxGeometry args={[0.015, H - 0.12, D - 0.1]} />
      </mesh>
      <mesh material={materials.smokedGlass} position={[W / 2 - 0.01, H / 2, 0]}>
        <boxGeometry args={[0.015, H - 0.12, D - 0.1]} />
      </mesh>

      {/* ===================================================================
          2. DUAL Z-AXIS LEAD SCREWS & LINEAR GUIDE RODS
      =================================================================== */}
      <mesh material={materials.steelRod} position={[-W / 2 + 0.22, H / 2, 0]}>
        <cylinderGeometry args={[0.016, 0.016, H - 0.2, 20]} />
      </mesh>
      <mesh material={materials.steelRod} position={[-W / 2 + 0.32, H / 2, 0]}>
        <cylinderGeometry args={[0.012, 0.012, H - 0.2, 20]} />
      </mesh>
      <mesh material={materials.steelRod} position={[W / 2 - 0.22, H / 2, 0]}>
        <cylinderGeometry args={[0.016, 0.016, H - 0.2, 20]} />
      </mesh>
      <mesh material={materials.steelRod} position={[W / 2 - 0.32, H / 2, 0]}>
        <cylinderGeometry args={[0.012, 0.012, H - 0.2, 20]} />
      </mesh>

      {/* ===================================================================
          3. HEATED BED PLATFORM & ACTIVE OBJECT BEING PRINTED
      =================================================================== */}
      <group position={[0, bedY, 0]}>
        {/* Aluminum Sub-Bed Carrier */}
        <mesh material={materials.bedPlate} position={[0, -0.04, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.04, 1.7]} />
        </mesh>

        {/* 4 Corner Leveling Thumbwheels (Saturn Orange) */}
        {[
          [-0.75, -0.75],
          [0.75, -0.75],
          [-0.75, 0.75],
          [0.75, 0.75],
        ].map(([kx, kz], idx) => (
          <mesh key={`knob-${idx}`} material={materials.orangeAccent} position={[kx, -0.07, kz]}>
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

        {/* Laser-Etched Bed Calibration Grid Lines */}
        {[-0.5, -0.25, 0, 0.25, 0.5].map((pos, idx) => (
          <React.Fragment key={`grid-${idx}`}>
            <mesh position={[0, -0.003, pos]}>
              <boxGeometry args={[1.4, 0.002, 0.004]} />
              <meshBasicMaterial color="#374151" />
            </mesh>
            <mesh position={[pos, -0.003, 0]}>
              <boxGeometry args={[0.004, 0.002, 1.4]} />
              <meshBasicMaterial color="#374151" />
            </mesh>
          </React.Fragment>
        ))}

        {/* =================================================================
            4. THE OBJECT ACTIVELY BEING PRINTED
        ================================================================= */}
        <group position={[0, 0, 0]}>
          {/* Base Mounting Flange Disc */}
          <mesh material={materials.carbonPart} position={[0, Math.min(currentPartHeight * 0.15, 0.04), 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.55, 0.62, Math.min(currentPartHeight * 0.3, 0.08), 36]} />
          </mesh>

          {/* Hexagonal Mounting Boss */}
          {currentPartHeight > 0.08 && (
            <mesh material={materials.orangePart} position={[0, Math.min(currentPartHeight * 0.25, 0.09), 0]} castShadow>
              <cylinderGeometry args={[0.42, 0.42, 0.04, 6]} />
            </mesh>
          )}

          {/* Precision Aerospace Turbine Impeller Body */}
          {currentPartHeight > 0.15 && (
            <mesh
              material={materials.carbonPart}
              position={[0, currentPartHeight * 0.5, 0]}
              castShadow
              receiveShadow
            >
              <cylinderGeometry
                args={[
                  0.36 + (1 - layerProgress) * 0.1,
                  0.48,
                  currentPartHeight * 0.7,
                  32
                ]}
              />
            </mesh>
          )}

          {/* Dynamic Curved Aerodynamic Impeller Vanes */}
          {currentPartHeight > 0.25 && (
            [0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <group key={`vane-${i}`} rotation={[0, rad, 0]} position={[0, currentPartHeight * 0.55, 0]}>
                  <mesh
                    material={materials.orangePart}
                    position={[0.26, 0, 0]}
                    rotation={[0.25, 0.35, 0.05]}
                    castShadow
                  >
                    <boxGeometry args={[0.16, currentPartHeight * 0.45, 0.035]} />
                  </mesh>
                </group>
              );
            })
          )}

          {/* Active Molten Extruded Layer Boundary on Top of the Part */}
          <group position={[0, currentPartHeight - 0.002, 0]}>
            {/* Bright molten orange freshly extruded bead ring */}
            <mesh ref={activeExtrusionRingRef} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.38, 0.43, 36]} />
              <meshBasicMaterial color="#FF5A1F" side={THREE.DoubleSide} />
            </mesh>

            {/* Inner molten infill bead */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.18, 0.22, 24]} />
              <meshBasicMaterial color="#FF8A50" side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ===================================================================
          5. COREXY GANTRY & MOVING ACTIVE TOOLHEAD CARRIAGE
      =================================================================== */}
      {/* Dual Left & Right Y-Axis Stainless Linear Rails */}
      <mesh material={materials.steelRod} position={[-W / 2 + 0.18, 1.62, 0]}>
        <boxGeometry args={[0.02, 0.03, D - 0.4]} />
      </mesh>
      <mesh material={materials.steelRod} position={[W / 2 - 0.18, 1.62, 0]}>
        <boxGeometry args={[0.02, 0.03, D - 0.4]} />
      </mesh>

      {/* Moving X-Axis Cross Gantry Bridge */}
      <group ref={gantryRef} position={[0, 1.62, 0]}>
        <mesh material={materials.frame} castShadow>
          <boxGeometry args={[W - 0.32, 0.05, 0.06]} />
        </mesh>
        <mesh material={materials.steelRod} position={[0, 0.026, 0.015]}>
          <boxGeometry args={[W - 0.36, 0.015, 0.02]} />
        </mesh>

        {/* Left & Right Y-Carriages */}
        <mesh material={materials.orangeAccent} position={[-W / 2 + 0.18, 0, 0]}>
          <boxGeometry args={[0.05, 0.06, 0.1]} />
        </mesh>
        <mesh material={materials.orangeAccent} position={[W / 2 - 0.18, 0, 0]}>
          <boxGeometry args={[0.05, 0.06, 0.1]} />
        </mesh>

        {/* =================================================================
            ACTIVE MOVING TOOLHEAD CARRIAGE (Directly touches the printed part!)
        ================================================================= */}
        <group ref={toolheadRef} position={[0, -0.15, 0]}>
          {/* Main Shroud */}
          <mesh material={materials.shroud} position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.18, 0.18, 0.16]} />
          </mesh>

          {/* Front Intake Fan Grill */}
          <mesh position={[0, 0.02, 0.082]}>
            <circleGeometry args={[0.055, 20]} />
            <meshStandardMaterial color="#0B0D10" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Status LED */}
          <mesh position={[0, 0.09, 0.082]}>
            <planeGeometry args={[0.06, 0.015]} />
            <meshBasicMaterial color="#FF5A1F" />
          </mesh>

          {/* Left & Right Blower Ducts */}
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

          {/* Molten Extrusion Tip Bead (Sits right on the top layer of the part) */}
          <mesh material={materials.moltenOrange} position={[0, -0.142, 0]}>
            <sphereGeometry args={[0.012, 12, 12]} />
          </mesh>

          {/* Real-time Dynamic Molten Filament Deposition Strand */}
          <mesh position={[0, -0.155, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.025, 8]} />
            <meshBasicMaterial color="#FF5A1F" />
          </mesh>

          {/* Real-time Dynamic Molten Point Light Cast Directly onto the Object & Bed! */}
          <pointLight
            ref={nozzleGlowRef}
            color="#FF5A1F"
            intensity={4.2}
            distance={1.6}
            decay={2}
            position={[0, -0.16, 0]}
          />

          {/* Micro-spark particles drifting from extrusion contact */}
          <points ref={sparksRef} geometry={particleGeo} position={[0, -0.15, 0]}>
            <pointsMaterial
              color="#FFA07A"
              size={0.015}
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
            />
          </points>
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
      <directionalLight
        position={[4, 6, 5]}
        intensity={2.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-4, 3, -4]} intensity={1.5} color="#A3A9B3" />
      <directionalLight position={[0, 1, 4]} intensity={0.8} color="#FF8A50" />
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
  const [manualProgress, setManualProgress] = useState<number | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isAutoPrinting, setIsAutoPrinting] = useState(true);
  const [dynamicCoords, setDynamicCoords] = useState({ x: 0, y: 0, z: 34 });
  const controlsRef = useRef<any>(null);

  // Auto-advancing print layer height simulation
  const [simulatedProgress, setSimulatedProgress] = useState(0.68);

  useEffect(() => {
    if (!isAutoPrinting || reducedMotion || manualProgress !== null) return;
    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        const next = prev + 0.002;
        return next > 0.98 ? 0.35 : next;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [isAutoPrinting, reducedMotion, manualProgress]);

  const activeProgress = manualProgress !== null ? manualProgress : simulatedProgress;

  const handleResetCamera = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  const handleCoordsUpdate = useCallback((x: number, y: number, z: number) => {
    setDynamicCoords({ x, y, z });
  }, []);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden bg-gradient-to-b from-white via-[#F4F5F8] to-[#E9EBF0] border border-black/10 shadow-xl flex flex-col justify-between select-none">
      
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
          isAutoPrinting={isAutoPrinting}
          onCoordsUpdate={handleCoordsUpdate}
        />

        {/* Studio Soft Floor Contact Shadow */}
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.5}
          scale={7}
          blur={1.8}
          far={3}
          color="#000000"
        />

        {/* Orbit Controls */}
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

      {/* Top Right Discreet View & Playback Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 pointer-events-auto">
        <button
          onClick={() => setIsAutoPrinting(!isAutoPrinting)}
          title={isAutoPrinting ? 'Pause Print Kinematics' : 'Resume Print Kinematics'}
          className={`p-2 rounded-xl border backdrop-blur-md transition-all shadow-xs ${
            isAutoPrinting
              ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-[#FF5A1F]'
              : 'bg-white/90 border-black/10 text-[#5E6573] hover:text-[#111215]'
          }`}
        >
          {isAutoPrinting ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title="Toggle Smooth Auto-Rotation"
          className={`p-2 rounded-xl border backdrop-blur-md transition-all shadow-xs ${
            autoRotate
              ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-[#FF5A1F]'
              : 'bg-white/90 border-black/10 text-[#5E6573] hover:text-[#111215]'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleResetCamera}
          title="Reset Isometric Angle"
          className="p-2 rounded-xl bg-white/90 border border-black/10 text-[#5E6573] hover:text-[#111215] backdrop-blur-md transition-all shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Minimalist Engineered Bottom Bar: Layer Scrubber + Real-Time Telemetry */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white/92 border border-black/10 backdrop-blur-md z-20 pointer-events-auto shadow-xl">
        {/* Layer Slicing Scrubber */}
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#5E6573] flex-shrink-0">
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
            className="w-full h-1.5 bg-black/15 rounded-lg appearance-none cursor-pointer accent-[#FF5A1F]"
          />

          <span className="font-mono text-xs text-[#FF5A1F] font-semibold flex-shrink-0 min-w-[36px]">
            {Math.round(activeProgress * 100)}%
          </span>
        </div>

        {/* Real-Time Live Kinematics Telemetry Readout */}
        <div className="flex items-center gap-2.5 text-[11px] font-mono text-[#5E6573] border-t sm:border-t-0 sm:border-l border-black/10 pt-2 sm:pt-0 sm:pl-3 flex-shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Printing PA12-CF
          </span>
          <span className="text-[#FF5A1F]">•</span>
          <span>X: {dynamicCoords.x > 0 ? `+${dynamicCoords.x}` : dynamicCoords.x}</span>
          <span className="text-black/30">/</span>
          <span>Y: {dynamicCoords.y > 0 ? `+${dynamicCoords.y}` : dynamicCoords.y}</span>
          <span className="text-[#FF5A1F]">•</span>
          <span>Z: {(activeProgress * 58).toFixed(1)}mm</span>
          <span className="text-[#FF5A1F]">•</span>
          <span className="text-[#111215] font-semibold">±0.04mm</span>
        </div>
      </div>
    </div>
  );
}
