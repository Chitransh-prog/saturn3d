import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { track3DViewerInteraction } from '@/lib/analytics';

interface Printer3DProps {
  activeSlide?: number;
  printProgress?: number; // 0 to 1
  isPrinting?: boolean;
}

// ---------------------------------------------------------------------------
// 1. Procedural CoreXY Industrial 3D Printer Frame
// ---------------------------------------------------------------------------
function PrinterFrame() {
  const frameColor = '#2b2d42';
  const accentMetal = '#8d99ae';
  const railColor = '#e5e7eb';

  return (
    <group position={[0, 0, 0]}>
      {/* 4 Corner Aluminum Vertical Extrusions (2020 profile) */}
      {[
        [-1.6, 0, -1.6],
        [1.6, 0, -1.6],
        [-1.6, 0, 1.6],
        [1.6, 0, 1.6],
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0, pos[2]]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 3.4, 0.16]} />
          <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.8} />
        </mesh>
      ))}

      {/* Top Gantry Horizontal Rails */}
      <mesh position={[0, 1.65, -1.6]}>
        <boxGeometry args={[3.2, 0.16, 0.16]} />
        <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.65, 1.6]}>
        <boxGeometry args={[3.2, 0.16, 0.16]} />
        <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[-1.6, 1.65, 0]}>
        <boxGeometry args={[0.16, 0.16, 3.2]} />
        <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[1.6, 1.65, 0]}>
        <boxGeometry args={[0.16, 0.16, 3.2]} />
        <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Bottom Frame Rails & Base Enclosure */}
      <mesh position={[0, -1.65, 0]} receiveShadow>
        <boxGeometry args={[3.36, 0.22, 3.36]} />
        <meshStandardMaterial color="#1a1c23" roughness={0.6} metalness={0.5} />
      </mesh>

      {/* Dual Steel Polished Linear Rods (X & Y axis) */}
      <mesh position={[0, 1.45, -0.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 3.1, 16]} />
        <meshStandardMaterial color={railColor} roughness={0.1} metalness={0.95} />
      </mesh>
      <mesh position={[0, 1.45, 0.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 3.1, 16]} />
        <meshStandardMaterial color={railColor} roughness={0.1} metalness={0.95} />
      </mesh>

      {/* Heated Glass Build Bed & Aluminum Sub-carrier */}
      <group position={[0, -0.9, 0]}>
        {/* Heated Bed Plate */}
        <mesh receiveShadow>
          <boxGeometry args={[2.5, 0.06, 2.5]} />
          <meshStandardMaterial color="#18191f" roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Tempered Glass Build Surface */}
        <mesh position={[0, 0.035, 0]}>
          <boxGeometry args={[2.46, 0.015, 2.46]} />
          <meshPhysicalMaterial
            color="#2a3342"
            roughness={0.15}
            transmission={0.4}
            thickness={0.02}
            reflectivity={0.9}
          />
        </mesh>
        {/* Gold Leveling Thumb Screws under bed */}
        {[
          [-1.15, -0.08, -1.15],
          [1.15, -0.08, -1.15],
          [-1.15, -0.08, 1.15],
          [1.15, -0.08, 1.15],
        ].map((screwPos, idx) => (
          <mesh key={idx} position={[screwPos[0], screwPos[1], screwPos[2]]}>
            <cylinderGeometry args={[0.09, 0.09, 0.06, 16]} />
            <meshStandardMaterial color="#F7931E" roughness={0.3} metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Filament Spool Holder on Top Rail */}
      <group position={[1.4, 2.0, -0.6]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.42, 0.42, 0.28, 24]} />
          <meshStandardMaterial color="#1e222d" roughness={0.6} />
        </mesh>
        {/* Saturn Orange Filament Thread wound on spool */}
        <mesh>
          <cylinderGeometry args={[0.39, 0.39, 0.24, 24]} />
          <meshStandardMaterial color="#F7931E" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 2. Printed Object with Progressive Layer-by-Layer Reveal
// ---------------------------------------------------------------------------
function PrintedArtifact({
  activeSlide = 0,
  progress = 1,
}: {
  activeSlide: number;
  progress: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();

  // Enable local clipping plane in renderer
  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  // Height range: base of bed is y = -0.86, top is y = 1.05 (total height ~1.9)
  const bedY = -0.85;
  const maxHeight = 1.6;
  const currentCutY = bedY + progress * maxHeight;

  // Clipping plane pointing DOWN (clips geometry ABOVE the current print plane)
  const clippingPlane = useMemo(() => {
    return new THREE.Plane(new THREE.Vector3(0, -1, 0), currentCutY);
  }, [currentCutY]);

  // Update plane on every frame as progress changes
  useFrame(() => {
    clippingPlane.constant = currentCutY;
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  // Slide 0: Twisted Spiral Vase Geometry
  const vaseGeometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.55, 0.85, maxHeight, 36, 64);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const angle = (y / maxHeight) * Math.PI * 1.8;
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const twistX = x * Math.cos(angle) - z * Math.sin(angle);
      const twistZ = x * Math.sin(angle) + z * Math.cos(angle);
      // Fluted ribs
      const rib = 1 + 0.12 * Math.sin(Math.atan2(twistZ, twistX) * 7);
      pos.setXYZ(i, twistX * rib, y, twistZ * rib);
    }
    geom.computeVertexNormals();
    return geom;
  }, [maxHeight]);

  // Slide 1: SLA Precision Impeller / Turbine
  const impellerGeometry = useMemo(() => {
    return new THREE.TorusKnotGeometry(0.55, 0.22, 100, 16, 2, 5);
  }, []);

  // Slide 2: Carbon-X PA12 Mechanical Bracket
  const bracketGeometry = useMemo(() => {
    return new THREE.BoxGeometry(1.2, 1.2, 1.2);
  }, []);

  // Slide 3: Industrial Batch Components
  const batchGeometry = useMemo(() => {
    return new THREE.OctahedronGeometry(0.8, 1);
  }, []);

  const geometries = [vaseGeometry, impellerGeometry, bracketGeometry, batchGeometry];
  const activeGeom = geometries[activeSlide % geometries.length];

  return (
    <group position={[0, bedY + maxHeight / 2, 0]}>
      <mesh ref={meshRef} geometry={activeGeom} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={activeSlide === 2 ? '#262626' : activeSlide === 1 ? '#dbeafe' : '#f8fafc'}
          roughness={activeSlide === 1 ? 0.1 : 0.45}
          metalness={activeSlide === 2 ? 0.8 : 0.1}
          clearcoat={activeSlide === 1 ? 0.9 : 0.3}
          clippingPlanes={[clippingPlane]}
          clipShadows={true}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. Extruder Print Head with Nozzle and Orange Glow Light
// ---------------------------------------------------------------------------
function ToolHead({
  progress = 1,
  isPrinting = true,
}: {
  progress: number;
  isPrinting: boolean;
}) {
  const headRef = useRef<THREE.Group>(null);
  const bedY = -0.85;
  const maxHeight = 1.6;
  const currentY = bedY + progress * maxHeight + 0.05;

  useFrame((state) => {
    if (!headRef.current) return;

    if (isPrinting && progress < 1) {
      // Circular nozzle trajectory tracking the vase layer perimeter
      const t = state.clock.elapsedTime * 6;
      const radius = 0.75 + Math.sin(t * 0.4) * 0.1;
      headRef.current.position.x = Math.cos(t) * radius;
      headRef.current.position.z = Math.sin(t) * radius;
      headRef.current.position.y = currentY;
    } else {
      // Idle parked position
      headRef.current.position.x = 1.1;
      headRef.current.position.z = 1.1;
      headRef.current.position.y = 1.5;
    }
  });

  return (
    <group ref={headRef} position={[0, currentY, 0]}>
      {/* Extruder Carriage Housing */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.38, 0.32, 0.38]} />
        <meshStandardMaterial color="#1a1c23" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Fan Cooling Duct */}
      <mesh position={[0.2, 0.15, 0]}>
        <boxGeometry args={[0.1, 0.2, 0.26]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>

      {/* Brass Hotend Conical Nozzle */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.07, 0.12, 16]} />
        <meshStandardMaterial color="#d97706" roughness={0.25} metalness={0.9} />
      </mesh>

      {/* Heated Nozzle Tip Glow: Intense Saturn Orange (#F7931E) */}
      <pointLight
        position={[0, -0.03, 0]}
        color="#F7931E"
        intensity={progress < 1 ? 3.5 : 0.8}
        distance={1.6}
        decay={2}
      />

      {/* Visual Filament Extrusion Bead Glow */}
      {progress < 1 && (
        <mesh position={[0, -0.02, 0]}>
          <sphereGeometry args={[0.032, 12, 12]} />
          <meshBasicMaterial color="#FFB054" />
        </mesh>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. Soft Studio Contact Shadow & Floor
// ---------------------------------------------------------------------------
function StudioFloor() {
  return (
    <group position={[0, -1.85, 0]}>
      {/* Sculpted Stone Bedrock / Architectural Pedestal (from reference design) */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.8, 3.4, 0.45, 8]} />
        <meshStandardMaterial color="#D1D5DB" roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.32, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.3, 2.7, 0.2, 8]} />
        <meshStandardMaterial color="#E5E7EB" roughness={0.8} metalness={0.08} />
      </mesh>

      {/* Soft Contact Shadow beneath printer base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.05, 0]}>
        <planeGeometry args={[12, 12]} />
        <shadowMaterial opacity={0.16} />
      </mesh>

      {/* Radial soft ground disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <circleGeometry args={[4.8, 64]} />
        <meshBasicMaterial color="#e5e5e5" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 5. Main 3D Scene Controller with Slow Camera Sway
// ---------------------------------------------------------------------------
function Main3DScene({
  activeSlide = 0,
  printProgress = 1,
  isPrinting = false,
  isMobile = false,
}: {
  activeSlide: number;
  printProgress: number;
  isPrinting: boolean;
  isMobile: boolean;
}) {
  const sceneGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (sceneGroup.current) {
      // Subtle organic sway
      sceneGroup.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.06;
      sceneGroup.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.03;
    }
  });

  return (
    <>
      {/* Soft Studio Lighting */}
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[6, 8, 6]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.6} color="#e2e8f0" />
      <directionalLight position={[0, -4, 4]} intensity={0.3} color="#ffffff" />

      {/* Floating 3D Printer Rig */}
      <group
        ref={sceneGroup}
        position={[0, 0, 0]}
        scale={isMobile ? 0.78 : 1.05}
        rotation={[0.15, -0.38, 0]}
      >
        <PrinterFrame />
        <PrintedArtifact activeSlide={activeSlide} progress={printProgress} />
        <ToolHead progress={printProgress} isPrinting={isPrinting} />
        <StudioFloor />
      </group>

      <Environment preset="studio" />
    </>
  );
}

// ---------------------------------------------------------------------------
// 6. Exported High-Performance Printer3D Canvas Component
// ---------------------------------------------------------------------------
export default function Printer3D({
  activeSlide = 0,
  printProgress = 1,
  isPrinting = false,
}: Printer3DProps) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [is3DReady, setIs3DReady] = useState(false);

  const isMobile = windowWidth < 768;

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIs3DReady(true);
      track3DViewerInteraction('rotate', `saturn_s1_slide_${activeSlide}`);
    }, 100);

    return () => clearTimeout(timer);
  }, [activeSlide]);

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {/* High-priority static poster for instant LCP < 1.8s */}
      <img
        src="/hero-printer.jpg"
        alt="Saturn 3D Precision CoreXY S1 Printer"
        width="900"
        height="800"
        fetchPriority="high"
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-out select-none pointer-events-none ${
          is3DReady ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Interactive WebGL / R3F Canvas */}
      {is3DReady && (
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{
            position: isMobile ? [5.5, 3.8, 7.8] : [4.5, 3.0, 6.5],
            fov: isMobile ? 42 : 38,
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            localClippingEnabled: true,
          }}
          className="w-full h-full transition-opacity duration-700 ease-out opacity-100"
        >
          <Main3DScene
            activeSlide={activeSlide}
            printProgress={printProgress}
            isPrinting={isPrinting}
            isMobile={isMobile}
          />
        </Canvas>
      )}
    </div>
  );
}
