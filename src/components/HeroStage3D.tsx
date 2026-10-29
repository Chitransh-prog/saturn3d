'use client';

import React, { useRef, useMemo, useEffect, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCw, RefreshCw, Sliders, Box, Layers, Eye, Cpu } from 'lucide-react';

interface HeroStage3DProps {
  printProgress?: number;
  isPrinting?: boolean;
  reducedMotion?: boolean;
  onFirstInteract?: () => void;
  onTriggerReprint?: () => void;
}

const MODEL_ROBOT = '/tmpoaxsvpt5.glb';
const MODEL_PRINTER = '/voron-cascade.glb';

// ---------------------------------------------------------------------------
// 1. Camera & Scene Environment
// ---------------------------------------------------------------------------
function CameraAndSceneSetup({ viewMode }: { viewMode: 'combo' | 'robot' | 'printer' }) {
  const { gl, camera } = useThree();

  useEffect(() => {
    gl.localClippingEnabled = true;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.15;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);

  useFrame(() => {
    const targetPos = viewMode === 'robot' 
      ? new THREE.Vector3(0, 1.5, 5.2)
      : viewMode === 'printer'
      ? new THREE.Vector3(0, 1.8, 6.4)
      : new THREE.Vector3(0, 1.6, 5.8);

    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(0, viewMode === 'robot' ? 1.4 : 1.6, 0);
  });

  return null;
}

// ---------------------------------------------------------------------------
// 2. High-Precision Voron Cascade 3D Printer Model
// ---------------------------------------------------------------------------
function VoronCascadePrinter({
  viewMode,
  printProgress,
}: {
  viewMode: 'combo' | 'robot' | 'printer';
  printProgress: number;
}) {
  if (viewMode === 'robot') return null;

  const { scene } = useGLTF(MODEL_PRINTER, '/draco/');

  // Normalize Voron Cascade printer assembly (size approx 1.21m x 0.87m x 0.86m)
  const { normalizedScene, scale, offset } = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.castShadow = true;
        m.receiveShadow = true;
        if (m.material) {
          // Enhance metalness and industrial contrast
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
    const s = targetHeight / 0.867; // scale factor approx 4.15
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
// 3. Robot Model (tmpoaxsvpt5.glb) Printed On The Bed
// ---------------------------------------------------------------------------
function RobotModel({
  printProgress,
  isPrinting,
  reducedMotion,
  clippingPlane,
  pbrMaterial,
  viewMode,
}: {
  printProgress: number;
  isPrinting: boolean;
  reducedMotion: boolean;
  clippingPlane: THREE.Plane;
  pbrMaterial: THREE.Material;
  viewMode: 'combo' | 'robot' | 'printer';
}) {
  if (viewMode === 'printer') return null;

  const { scene } = useGLTF(MODEL_ROBOT);

  const { clonedScene, scale, positionY } = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.material = pbrMaterial;
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });

    // In combo mode, the robot fits inside the Voron build volume (bed height y ~ 0.5)
    const s = viewMode === 'robot' ? 1.0 : 0.72;
    const posY = viewMode === 'robot' ? 0.0 : 0.45;

    return { clonedScene: clone, scale: s, positionY: posY };
  }, [scene, pbrMaterial, viewMode]);

  return (
    <group position={[0, positionY, 0]} scale={[scale, scale, scale]}>
      <primitive object={clonedScene} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. Hotspots (Toolhead, Heated Bed, CoreXY Gantry)
// ---------------------------------------------------------------------------
function CalloutHotspots({
  active,
  currentCut,
  viewMode,
}: {
  active: boolean;
  currentCut: number;
  viewMode: 'combo' | 'robot' | 'printer';
}) {
  if (!active) return null;

  const toolheadPos: [number, number, number] = [
    0.35,
    viewMode === 'robot' ? currentCut + 0.1 : Math.min(2.7, currentCut * 0.72 + 0.55),
    0.2,
  ];

  return (
    <group>
      {/* 1. Toolhead Nozzle Hotspot */}
      <group position={toolheadPos}>
        <Html distanceFactor={8} position={[0.2, 0.1, 0]}>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0B0D10]/85 border hairline-dark shadow-precision-md backdrop-blur-md whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-90 duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] animate-ping" />
            <span className="font-mono text-[10px] text-white font-medium">Toolhead Nozzle: 245°C</span>
          </div>
        </Html>
      </group>

      {/* 2. Heated Build Bed Hotspot */}
      <group position={[-1.2, 0.45, 0.5]}>
        <Html distanceFactor={8} position={[-0.2, 0.1, 0]}>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0B0D10]/85 border hairline-dark shadow-precision-md backdrop-blur-md whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-90 duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px] text-white font-medium">PEI Bed: 90°C • ±0.04 mm</span>
          </div>
        </Html>
      </group>

      {/* 3. CoreXY Gantry Motion Hotspot */}
      {viewMode !== 'robot' && (
        <group position={[1.1, 3.2, -0.4]}>
          <Html distanceFactor={8} position={[0.2, 0.1, 0]}>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0B0D10]/85 border hairline-dark shadow-precision-md backdrop-blur-md whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-90 duration-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="font-mono text-[10px] text-white font-medium">Voron CoreXY: 500 mm/s</span>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 5. Active Slicing Laser Ring & Nozzle Light
// ---------------------------------------------------------------------------
function ActiveLaserRing({
  currentCut,
  isPrinting,
  printProgress,
  viewMode,
}: {
  currentCut: number;
  isPrinting: boolean;
  printProgress: number;
  viewMode: 'combo' | 'robot' | 'printer';
}) {
  if (viewMode === 'printer' || !isPrinting || printProgress >= 0.99) return null;

  const actualY = viewMode === 'robot' ? currentCut : currentCut * 0.72 + 0.45;
  const radius = viewMode === 'robot' ? 1.35 : 0.95;

  return (
    <group position={[0, actualY, 0]}>
      {/* Concentric laser scanning ring on active layer */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.01, radius, 48]} />
        <meshBasicMaterial
          color="#FF5A1F"
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Micro print bead point light */}
      <pointLight color="#FF5A1F" intensity={6} distance={2.2} decay={2} />
      {/* Toolhead Extruder Nozzle Tip */}
      <mesh position={[0, 0.12, 0]}>
        <coneGeometry args={[0.06, 0.22, 16]} />
        <meshStandardMaterial
          color="#D97706"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 6. Interactive 3D Stage Composition
// ---------------------------------------------------------------------------
function CombinedStage({
  printProgress,
  isPrinting,
  reducedMotion,
  pointerParallax,
  onInteract,
  onTriggerReprint,
  setIsHovered,
  stageRotationY,
  viewMode,
  showHotspots,
}: {
  printProgress: number;
  isPrinting: boolean;
  reducedMotion: boolean;
  pointerParallax: { x: number; y: number };
  onInteract?: () => void;
  onTriggerReprint?: () => void;
  setIsHovered: (hovered: boolean) => void;
  stageRotationY: number;
  viewMode: 'combo' | 'robot' | 'printer';
  showHotspots: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // World-space cut Y
  const currentCut = reducedMotion || !isPrinting || printProgress >= 0.99
    ? 999.0
    : printProgress * 3.15;

  const clippingPlane = useMemo(() => {
    return new THREE.Plane(new THREE.Vector3(0, -1, 0), currentCut);
  }, []);
  clippingPlane.constant = currentCut;

  // Studio PBR Material for the robot (Warm-White ABS body)
  const pbrMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F2EEE6'),
      roughness: 0.38,
      metalness: 0.12,
      clippingPlanes: isPrinting && printProgress < 0.99 ? [clippingPlane] : [],
      clipShadows: true,
    });
  }, [clippingPlane, isPrinting, printProgress]);

  // Gentle breathing & rotation lerp
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const breath = Math.sin(t * 1.6);
    const scaleBreath = 1.0 + breath * 0.002;
    groupRef.current.scale.set(scaleBreath, scaleBreath, scaleBreath);

    const targetPitch = -pointerParallax.y * (3 * Math.PI / 180);
    const targetYaw = pointerParallax.x * (6 * Math.PI / 180);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetPitch, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      stageRotationY + targetYaw,
      0.08
    );
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onDoubleClick={() => onTriggerReprint?.()}
    >
      {/* 1. Voron Cascade 3D Printer Assembly */}
      <Suspense fallback={null}>
        <VoronCascadePrinter
          viewMode={viewMode}
          printProgress={printProgress}
        />
      </Suspense>

      {/* 2. Mecha Robot Model (tmpoaxsvpt5.glb) being printed */}
      <Suspense fallback={null}>
        <RobotModel
          printProgress={printProgress}
          isPrinting={isPrinting}
          reducedMotion={reducedMotion}
          clippingPlane={clippingPlane}
          pbrMaterial={pbrMaterial}
          viewMode={viewMode}
        />
      </Suspense>

      {/* 3. Laser Cut Horizon & Nozzle Tip */}
      <ActiveLaserRing
        currentCut={currentCut}
        isPrinting={isPrinting}
        printProgress={printProgress}
        viewMode={viewMode}
      />

      {/* 4. Hotspot Callout Overlays */}
      <CalloutHotspots
        active={showHotspots}
        currentCut={currentCut}
        viewMode={viewMode}
      />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 7. Main HeroStage3D Component with CADScope Controls
// ---------------------------------------------------------------------------
export default function HeroStage3D({
  printProgress = 1.0,
  isPrinting = false,
  reducedMotion = false,
  onFirstInteract,
  onTriggerReprint,
}: HeroStage3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [pointerParallax, setPointerParallax] = useState({ x: 0, y: 0 });
  const [manualRotY, setManualRotY] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [viewMode, setViewMode] = useState<'combo' | 'robot' | 'printer'>('combo');
  const [manualScrub, setManualScrub] = useState<number | null>(null);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, rotY: 0 });
  const lastInteractionTimeRef = useRef(Date.now());

  const effectiveProgress = manualScrub !== null ? manualScrub : printProgress;

  const registerInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      onFirstInteract?.();
    }
    lastInteractionTimeRef.current = Date.now();
  }, [hasInteracted, onFirstInteract]);

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setPointerParallax({
      x: THREE.MathUtils.clamp(nx, -1, 1),
      y: THREE.MathUtils.clamp(ny, -1, 1),
    });

    if (isDraggingRef.current) {
      const deltaX = (e.clientX - dragStartRef.current.x) * 0.009;
      const maxAngle = 90 * Math.PI / 180;
      const newRot = THREE.MathUtils.clamp(dragStartRef.current.rotY + deltaX, -maxAngle, maxAngle);
      setManualRotY(newRot);
      lastInteractionTimeRef.current = Date.now();
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, rotY: manualRotY };
    registerInteraction();
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
  };

  // Subtle turntable auto-rotation
  useEffect(() => {
    if (!autoRotate || reducedMotion) return;
    let animId: number;
    let angle = manualRotY;
    const tick = () => {
      const elapsed = Date.now() - lastInteractionTimeRef.current;
      if (!isDraggingRef.current && elapsed > 2500) {
        angle += 0.003;
        setManualRotY(angle);
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [autoRotate, reducedMotion, manualRotY]);

  const resetView = () => {
    setManualRotY(0);
    setManualScrub(null);
    registerInteraction();
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative select-none cursor-grab active:cursor-grabbing outline-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        isDraggingRef.current = false;
        setPointerParallax({ x: 0, y: 0 });
      }}
    >
      {/* Soft Radial Ambient Orange Glow Behind Stage (<= 12% alpha) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[#FF5A1F]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top View Mode Selector Pills */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 rounded-full bg-[#12151A]/85 backdrop-blur-md border hairline-dark shadow-precision-md">
        <button
          onClick={(e) => { e.stopPropagation(); setViewMode('combo'); registerInteraction(); }}
          className={`px-3 py-1 rounded-full font-mono text-[11px] font-medium transition-all cursor-pointer ${
            viewMode === 'combo' ? 'bg-[#FF5A1F] text-white shadow-precision-xs' : 'text-white/60 hover:text-white'
          }`}
        >
          Voron + Robot
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setViewMode('robot'); registerInteraction(); }}
          className={`px-3 py-1 rounded-full font-mono text-[11px] font-medium transition-all cursor-pointer ${
            viewMode === 'robot' ? 'bg-[#FF5A1F] text-white shadow-precision-xs' : 'text-white/60 hover:text-white'
          }`}
        >
          Robot Part
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setViewMode('printer'); registerInteraction(); }}
          className={`px-3 py-1 rounded-full font-mono text-[11px] font-medium transition-all cursor-pointer ${
            viewMode === 'printer' ? 'bg-[#FF5A1F] text-white shadow-precision-xs' : 'text-white/60 hover:text-white'
          }`}
        >
          CoreXY Frame
        </button>
      </div>

      <Canvas
        camera={{ position: [0, 1.6, 5.8], fov: 32 }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          localClippingEnabled: true,
          powerPreference: 'high-performance',
          antialias: true,
        }}
        className="w-full h-full"
      >
        <CameraAndSceneSetup viewMode={viewMode} />

        {/* Studio PBR Lighting Setup */}
        <ambientLight intensity={0.45} />
        <directionalLight position={[-5, 7, 5]} intensity={2.4} color="#FFF8F0" />
        <directionalLight position={[5, 4, -3]} intensity={2.6} color="#FF5A1F" />
        <directionalLight position={[0, -2, 3]} intensity={0.35} color="#FFFFFF" />

        {/* Soft Contact Shadows on Floor */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.5}
          scale={5.5}
          blur={2.4}
          far={3.2}
        />

        {/* 3D Combined Stage */}
        <CombinedStage
          printProgress={effectiveProgress}
          isPrinting={isPrinting || manualScrub !== null}
          reducedMotion={reducedMotion}
          pointerParallax={pointerParallax}
          onInteract={registerInteraction}
          onTriggerReprint={onTriggerReprint}
          setIsHovered={setIsHovered}
          stageRotationY={manualRotY}
          viewMode={viewMode}
          showHotspots={showHotspots}
        />
      </Canvas>

      {/* CADScope-Style Floating Stage Controls Toolbar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#12151A]/85 backdrop-blur-md border hairline-dark shadow-precision-lg max-w-[95%]">
        <button
          onClick={(e) => { e.stopPropagation(); resetView(); }}
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          title="Reset Camera View"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-3 bg-white/10" />

        <button
          onClick={(e) => { e.stopPropagation(); setAutoRotate(!autoRotate); }}
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
            autoRotate ? 'text-[#FF5A1F] bg-[#FF5A1F]/15' : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-3 bg-white/10" />

        {/* Interactive Layer Slicing Slider */}
        <div className="flex items-center gap-1.5 px-2" onClick={(e) => e.stopPropagation()}>
          <Sliders className="w-3 h-3 text-muted-dark" />
          <input
            type="range"
            min="0.05"
            max="1.0"
            step="0.01"
            value={effectiveProgress}
            onChange={(e) => {
              setManualScrub(parseFloat(e.target.value));
              registerInteraction();
            }}
            className="w-16 sm:w-24 h-1 bg-white/20 accent-[#FF5A1F] rounded-lg cursor-pointer"
            title="Interactive Layer Slicing Slider"
          />
          <span className="font-mono text-[9px] text-white/70 w-7">
            {Math.round(effectiveProgress * 100)}%
          </span>
        </div>

        <div className="w-[1px] h-3 bg-white/10" />

        <button
          onClick={(e) => { e.stopPropagation(); setShowHotspots(!showHotspots); }}
          className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-colors cursor-pointer ${
            showHotspots ? 'text-[#FF5A1F] bg-[#FF5A1F]/15' : 'text-white/70 hover:text-white'
          }`}
          title="Toggle Telemetry Hotspots"
        >
          Hotspots
        </button>
      </div>
    </div>
  );
}

useGLTF.preload(MODEL_ROBOT);
useGLTF.preload(MODEL_PRINTER, '/draco/');
