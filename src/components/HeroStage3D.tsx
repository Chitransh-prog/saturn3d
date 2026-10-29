'use client';

import React, { useRef, useMemo, useEffect, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCw, RefreshCw, Sliders, Box, Layers, Eye, Cpu, Zap, Activity } from 'lucide-react';

interface HeroStage3DProps {
  printProgress?: number;
  isPrinting?: boolean;
  reducedMotion?: boolean;
  onFirstInteract?: () => void;
  onTriggerReprint?: () => void;
}

const MODEL_PRINTER = '/voron-cascade.glb';

// ---------------------------------------------------------------------------
// 1. Camera & Scene Environment
// ---------------------------------------------------------------------------
function CameraAndSceneSetup({ viewMode }: { viewMode: 'printer' | 'bed' | 'toolhead' }) {
  const { gl, camera } = useThree();

  useEffect(() => {
    gl.localClippingEnabled = true;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.2;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);

  useFrame(() => {
    const targetPos = viewMode === 'bed'
      ? new THREE.Vector3(0, 1.6, 3.8)
      : viewMode === 'toolhead'
      ? new THREE.Vector3(0.5, 2.3, 3.4)
      : new THREE.Vector3(0, 1.9, 5.8);

    const targetLookAt = viewMode === 'bed'
      ? new THREE.Vector3(0, 1.35, 0)
      : viewMode === 'toolhead'
      ? new THREE.Vector3(0, 2.0, 0)
      : new THREE.Vector3(0, 1.6, 0);

    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(targetLookAt);
  });

  return null;
}

// ---------------------------------------------------------------------------
// 2. High-Precision Voron Cascade CoreXY 3D Printer
// ---------------------------------------------------------------------------
function VoronCascadePrinter({
  viewMode,
}: {
  viewMode: 'printer' | 'bed' | 'toolhead';
}) {
  const { scene } = useGLTF(MODEL_PRINTER, '/draco/');

  // Normalize Voron Cascade printer assembly to fit the hero viewport
  const { normalizedScene, scale, offset } = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.castShadow = true;
        m.receiveShadow = true;
        if (m.material) {
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.roughness = Math.min(mat.roughness, 0.6);
              }
            });
          } else if (m.material instanceof THREE.MeshStandardMaterial) {
            m.material.roughness = Math.min(m.material.roughness, 0.6);
          }
        }
      }
    });

    const targetHeight = 3.6;
    const s = targetHeight / 0.867; // scale factor ~4.15
    const ox = -0.192 * s;
    const oy = 0.5 * s; // align feet to ground y=0
    const oz = 0.097 * s;

    return { normalizedScene: clone, scale: s, offset: new THREE.Vector3(ox, oy, oz) };
  }, [scene]);

  return (
    <group position={offset} scale={[scale, scale, scale]}>
      <primitive object={normalizedScene} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. Technical Mechanical Part Being Printed on the Heated Bed
// ---------------------------------------------------------------------------
function PrintedMechanicalPart({
  printProgress,
  isPrinting,
  clippingPlane,
}: {
  printProgress: number;
  isPrinting: boolean;
  clippingPlane: THREE.Plane;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Carbon-Fiber PA12 composite engineering material
  const carbonMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.45,
      metalness: 0.25,
      clippingPlanes: [clippingPlane],
      clipShadows: true,
      shadowSide: THREE.DoubleSide,
    });
  }, [clippingPlane]);

  // Accent Saturn Orange engineering polymer material
  const orangeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0xff5a1f,
      roughness: 0.35,
      metalness: 0.3,
      clippingPlanes: [clippingPlane],
      clipShadows: true,
      shadowSide: THREE.DoubleSide,
    });
  }, [clippingPlane]);

  // Subtle slow rotation when printing
  useFrame((_, delta) => {
    if (groupRef.current && isPrinting) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  // Bed sits at y = 1.02 inside the Voron printer frame
  return (
    <group ref={groupRef} position={[0, 1.02, 0]}>
      {/* 1. Base Mounting Flange Disc */}
      <mesh material={carbonMaterial} castShadow receiveShadow position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.75, 0.82, 0.08, 36]} />
      </mesh>

      {/* 2. Perimeter Bolt Mounting Lugs */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = Math.cos(rad) * 0.68;
        const z = Math.sin(rad) * 0.68;
        return (
          <mesh
            key={i}
            material={orangeMaterial}
            position={[x, 0.09, z]}
            castShadow
          >
            <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
          </mesh>
        );
      })}

      {/* 3. Lower Helical Ring Gear Body */}
      <mesh material={carbonMaterial} castShadow receiveShadow position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.62, 0.70, 0.28, 32]} />
      </mesh>

      {/* 4. Orange Accent Tolerance Calibration Ring */}
      <mesh material={orangeMaterial} castShadow position={[0, 0.37, 0]}>
        <torusGeometry args={[0.58, 0.035, 16, 48]} />
      </mesh>

      {/* 5. Central Spiral Impeller / Turbine Stator Core */}
      <mesh material={carbonMaterial} castShadow receiveShadow position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.42, 0.56, 0.32, 28]} />
      </mesh>

      {/* 6. Aerodynamic Curved Turbine Vanes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={i} rotation={[0, rad, 0]} position={[0, 0.52, 0]}>
            <mesh
              material={orangeMaterial}
              position={[0.34, 0, 0]}
              rotation={[0.3, 0.4, 0.1]}
              castShadow
            >
              <boxGeometry args={[0.22, 0.26, 0.04]} />
            </mesh>
          </group>
        );
      })}

      {/* 7. Precision Central Drive Spindle & Shaft Bore */}
      <mesh material={carbonMaterial} castShadow receiveShadow position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.22, 24]} />
      </mesh>

      {/* 8. Top Hexagonal Drive Lock Ring */}
      <mesh material={orangeMaterial} castShadow position={[0, 0.90, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.06, 6]} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. Live Laser Scanning Ring & Active Extruder Nozzle Glow
// ---------------------------------------------------------------------------
function ActiveNozzleDeposition({
  currentCut,
  isPrinting,
  printProgress,
}: {
  currentCut: number;
  isPrinting: boolean;
  printProgress: number;
}) {
  const actualY = 1.02 + currentCut;
  const radius = Math.max(0.2, 0.78 - currentCut * 0.4);

  return (
    <group position={[0, actualY, 0]}>
      {/* Active Molten Laser Slicing Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.02, radius, 48]} />
        <meshBasicMaterial
          color="#FF5A1F"
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* High-intensity molten bead point light */}
      <pointLight color="#FF5A1F" intensity={5} distance={1.8} decay={2} />

      {/* Extruder Hotend Nozzle Tip */}
      <group position={[Math.cos(printProgress * Math.PI * 4) * radius * 0.5, 0.14, Math.sin(printProgress * Math.PI * 4) * radius * 0.5]}>
        <mesh>
          <coneGeometry args={[0.06, 0.20, 16]} />
          <meshStandardMaterial
            color="#D97706"
            metalness={0.85}
            roughness={0.2}
            emissive="#FF5A1F"
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 5. Telemetry Hotspots
// ---------------------------------------------------------------------------
function CalloutHotspots({
  active,
  currentCut,
  viewMode,
}: {
  active: boolean;
  currentCut: number;
  viewMode: 'printer' | 'bed' | 'toolhead';
}) {
  if (!active) return null;

  const actualCutY = 1.02 + currentCut;

  return (
    <group>
      {/* 1. Hotend Nozzle Telemetry */}
      <group position={[0.2, actualCutY + 0.15, 0.2]}>
        <Html distanceFactor={8} position={[0.2, 0.1, 0]}>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0B0D10]/90 border border-white/10 shadow-lg backdrop-blur-md whitespace-nowrap pointer-events-none animate-in fade-in duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] animate-ping" />
            <span className="font-mono text-[10px] text-white font-medium">Hotend: 245°C • 0.4mm Hardened Nozzle</span>
          </div>
        </Html>
      </group>

      {/* 2. Heated PEI Bed Telemetry */}
      <group position={[-1.1, 1.02, 0.5]}>
        <Html distanceFactor={8} position={[-0.2, 0.1, 0]}>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0B0D10]/90 border border-white/10 shadow-lg backdrop-blur-md whitespace-nowrap pointer-events-none animate-in fade-in duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px] text-white font-medium">PEI Bed: 90°C • Auto Mesh ±0.04mm</span>
          </div>
        </Html>
      </group>

      {/* 3. CoreXY Kinematics Gantry */}
      {viewMode === 'printer' && (
        <group position={[1.0, 3.1, -0.3]}>
          <Html distanceFactor={8} position={[0.2, 0.1, 0]}>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0B0D10]/90 border border-white/10 shadow-lg backdrop-blur-md whitespace-nowrap pointer-events-none animate-in fade-in duration-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="font-mono text-[10px] text-white font-medium">Voron CoreXY: 600 mm/s Speed</span>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 6. Interactive 3D Stage Composition
// ---------------------------------------------------------------------------
function CombinedStage({
  printProgress,
  isPrinting,
  pointerParallax,
  onInteract,
  setIsHovered,
  stageRotationY,
  viewMode,
  showHotspots,
}: {
  printProgress: number;
  isPrinting: boolean;
  pointerParallax: { x: number; y: number };
  onInteract?: () => void;
  setIsHovered: (hovered: boolean) => void;
  stageRotationY: number;
  viewMode: 'printer' | 'bed' | 'toolhead';
  showHotspots: boolean;
}) {
  const rootGroupRef = useRef<THREE.Group>(null);

  // Clipping plane calculation for the mechanical print (from y=1.02 to y=2.02)
  const currentCut = useMemo(() => {
    return Math.max(0.01, Math.min(1.0, printProgress));
  }, [printProgress]);

  const clippingPlane = useMemo(() => {
    // Normal points down so geometry below y = 1.02 + currentCut is visible
    return new THREE.Plane(new THREE.Vector3(0, -1, 0), 1.02 + currentCut);
  }, [currentCut]);

  useFrame((_, delta) => {
    if (rootGroupRef.current) {
      const targetRotY = stageRotationY + pointerParallax.x * 0.25;
      const targetRotX = pointerParallax.y * 0.12;

      rootGroupRef.current.rotation.y = THREE.MathUtils.damp(
        rootGroupRef.current.rotation.y,
        targetRotY,
        4,
        delta
      );
      rootGroupRef.current.rotation.x = THREE.MathUtils.damp(
        rootGroupRef.current.rotation.x,
        targetRotX,
        4,
        delta
      );
    }
  });

  return (
    <group
      ref={rootGroupRef}
      onPointerDown={() => onInteract?.()}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      {/* 1. Voron Cascade CoreXY 3D Printer */}
      <VoronCascadePrinter viewMode={viewMode} />

      {/* 2. Precision Mechanical Part Being Printed on the Bed */}
      <PrintedMechanicalPart
        printProgress={printProgress}
        isPrinting={isPrinting}
        clippingPlane={clippingPlane}
      />

      {/* 3. Live Molten Laser Ring & Nozzle Light */}
      <ActiveNozzleDeposition
        currentCut={currentCut}
        isPrinting={isPrinting}
        printProgress={printProgress}
      />

      {/* 4. Telemetry Callout Hotspots */}
      <CalloutHotspots
        active={showHotspots}
        currentCut={currentCut}
        viewMode={viewMode}
      />

      {/* 5. Warm Industrial Illumination */}
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={2.0}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-4, 3, -3]} intensity={0.9} color="#FFE14D" />
      <directionalLight position={[0, -2, 4]} intensity={0.5} color="#FF5A1F" />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 7. Main Component Export
// ---------------------------------------------------------------------------
export default function HeroStage3D({
  printProgress = 1.0,
  isPrinting = false,
  reducedMotion = false,
  onFirstInteract,
  onTriggerReprint,
}: HeroStage3DProps) {
  const [viewMode, setViewMode] = useState<'printer' | 'bed' | 'toolhead'>('printer');
  const [autoRotate, setAutoRotate] = useState(!reducedMotion);
  const [showHotspots, setShowHotspots] = useState(true);
  const [manualProgress, setManualProgress] = useState<number | null>(null);
  const [pointerParallax, setPointerParallax] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [stageRotationY, setStageRotationY] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastMouseXRef = useRef(0);

  const activeProgress = manualProgress !== null ? manualProgress : printProgress;

  // Auto rotation loop
  useEffect(() => {
    if (!autoRotate || isDraggingRef.current || isHovered) return;
    const interval = setInterval(() => {
      setStageRotationY((prev) => prev + 0.004);
    }, 16);
    return () => clearInterval(interval);
  }, [autoRotate, isHovered]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastMouseXRef.current = e.clientX;
    onFirstInteract?.();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      const deltaX = e.clientX - lastMouseXRef.current;
      lastMouseXRef.current = e.clientX;
      setStageRotationY((prev) => prev + deltaX * 0.007);
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -2;
    setPointerParallax({ x, y });
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[440px] flex items-center justify-center select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* 3D Canvas */}
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          localClippingEnabled: true,
        }}
        camera={{ position: [0, 1.7, 5.6], fov: 42 }}
        className="cursor-grab active:cursor-grabbing w-full h-full"
      >
        <CameraAndSceneSetup viewMode={viewMode} />
        <Suspense fallback={null}>
          <CombinedStage
            printProgress={activeProgress}
            isPrinting={isPrinting}
            pointerParallax={pointerParallax}
            onInteract={onFirstInteract}
            setIsHovered={setIsHovered}
            stageRotationY={stageRotationY}
            viewMode={viewMode}
            showHotspots={showHotspots}
          />
        </Suspense>
      </Canvas>

      {/* Top Floating View Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20 pointer-events-none">
        {/* View Mode Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0B0D10]/85 border border-white/10 backdrop-blur-md pointer-events-auto shadow-lg">
          <button
            onClick={() => setViewMode('printer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              viewMode === 'printer'
                ? 'bg-[#FF5A1F] text-white font-semibold'
                : 'text-[#A3A9B3] hover:text-white'
            }`}
          >
            Voron Printer
          </button>
          <button
            onClick={() => setViewMode('bed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              viewMode === 'bed'
                ? 'bg-[#FF5A1F] text-white font-semibold'
                : 'text-[#A3A9B3] hover:text-white'
            }`}
          >
            Print Bed
          </button>
          <button
            onClick={() => setViewMode('toolhead')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              viewMode === 'toolhead'
                ? 'bg-[#FF5A1F] text-white font-semibold'
                : 'text-[#A3A9B3] hover:text-white'
            }`}
          >
            Toolhead
          </button>
        </div>

        {/* Hotspots & Orbit Toggles */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            title="Toggle Telemetry Hotspots"
            className={`p-2 rounded-lg border backdrop-blur-md transition-colors ${
              showHotspots
                ? 'bg-[#FF5A1F]/20 border-[#FF5A1F] text-[#FF5A1F]'
                : 'bg-[#0B0D10]/85 border-white/10 text-[#A3A9B3] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle Auto Rotation"
            className={`p-2 rounded-lg border backdrop-blur-md transition-colors ${
              autoRotate
                ? 'bg-[#FF5A1F]/20 border-[#FF5A1F] text-[#FF5A1F]'
                : 'bg-[#0B0D10]/85 border-white/10 text-[#A3A9B3] hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {onTriggerReprint && (
            <button
              onClick={onTriggerReprint}
              title="Re-run Simulation"
              className="p-2 rounded-lg bg-[#0B0D10]/85 border border-white/10 text-[#A3A9B3] hover:text-[#FF5A1F] backdrop-blur-md transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Slicing Scrub Controller */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#0B0D10]/90 border border-white/10 backdrop-blur-md z-20 pointer-events-auto shadow-xl">
        {/* Layer Slicing Slider */}
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

        {/* Telemetry Status Line */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-[#A3A9B3] border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-3 flex-shrink-0">
          <span>Z: {(activeProgress * 65).toFixed(1)} mm</span>
          <span className="text-[#FF5A1F]">•</span>
          <span>Layer: {Math.round(activeProgress * 540)} / 540</span>
          <span className="text-[#FF5A1F]">•</span>
          <span className="text-emerald-400">Voron CoreXY Online</span>
        </div>
      </div>
    </div>
  );
}

// Preload ONLY the Voron printer assembly
useGLTF.preload(MODEL_PRINTER, '/draco/');
