import { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Outlines, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface HeroFusion3DProps {
  printProgress?: number; // 0 to 1
  isPrinting?: boolean;
}

// ---------------------------------------------------------------------------
// 1. Scene Setup Component (enables local clipping on renderer)
// ---------------------------------------------------------------------------
function SceneSetup() {
  const { gl } = useThree();
  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);
  return null;
}

// ---------------------------------------------------------------------------
// 2. Chunky Toon Saturn Planet with Orbiting Rings (Halo Backdrop)
// ---------------------------------------------------------------------------
function ToonSaturnRing() {
  const saturnGroup = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (saturnGroup.current) {
      // Gentle orbit weaving behind the mecha
      saturnGroup.current.position.y = 0.35 + Math.sin(t * 0.7) * 0.1;
      saturnGroup.current.rotation.y = t * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.08;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -t * 0.1;
    }
  });

  return (
    <group ref={saturnGroup} position={[0.1, 0.35, -0.9]}>
      {/* Central Planet Sphere (Paper/Lemon Cel Shaded) positioned behind robot */}
      <mesh castShadow>
        <sphereGeometry args={[0.72, 32, 24]} />
        <meshToonMaterial color="#FFE14D" />
        <Outlines thickness={2.6} color="#0B0B0B" />
      </mesh>

      {/* Chunky Flat Saturn Ring (Saturn Orange Cel Shaded) */}
      <mesh
        ref={ringRef}
        rotation={[Math.PI / 3, 0.22, 0]}
        castShadow
      >
        <ringGeometry args={[1.65, 2.35, 48]} />
        <meshToonMaterial color="#FF5A1F" side={THREE.DoubleSide} />
        <Outlines thickness={2.6} color="#0B0B0B" />
      </mesh>

      {/* Secondary Outer Thin Ring (Periwinkle Accent) */}
      <mesh
        ref={outerRingRef}
        rotation={[Math.PI / 3, 0.22, 0]}
      >
        <ringGeometry args={[2.48, 2.68, 48]} />
        <meshToonMaterial color="#8EA2FF" side={THREE.DoubleSide} />
        <Outlines thickness={2.0} color="#0B0B0B" />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. Mecha Robot + Rock Summit Component (tmpoaxsvpt5.glb)
// ---------------------------------------------------------------------------
function MechaPrintedModel({
  progress = 1,
  isPrinting = true,
  clippingPlane,
}: {
  progress: number;
  isPrinting: boolean;
  clippingPlane: THREE.Plane;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/tmpoaxsvpt5.glb');

  // High-fidelity Titanium Armor & Rock Pedestal Materials with active clipping plane
  const { robotArmorMaterial, rockPedestalMaterial } = useMemo(() => {
    // 1. Platinum Titanium Armor with specular luster & baked vertex details
    const robotMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFFFF'),
      metalness: 0.65,
      roughness: 0.22,
      clearcoat: 0.5,
      clearcoatRoughness: 0.16,
      reflectivity: 0.9,
      envMapIntensity: 1.25,
      vertexColors: true,
      side: THREE.FrontSide,
      clippingPlanes: [clippingPlane],
      clipShadows: true,
    });

    // 2. Weathered Sandstone/Granite Rock Pedestal
    const rockMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      metalness: 0.05,
      roughness: 0.90,
      envMapIntensity: 0.4,
      vertexColors: true,
      side: THREE.FrontSide,
      clippingPlanes: [clippingPlane],
      clipShadows: true,
    });

    return { robotArmorMaterial: robotMat, rockPedestalMaterial: rockMat };
  }, [clippingPlane]);

  // Clone scene so materials can be safely assigned without mutating the shared cache
  const clonedScene = useMemo(() => {
    return scene.clone(true);
  }, [scene]);

  // Assign materials to meshes
  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const name = (mesh.name || '').toLowerCase();
        if (name.includes('rock') || name.includes('summit')) {
          mesh.material = rockPedestalMaterial;
        } else {
          mesh.material = robotArmorMaterial;
        }
      }
    });
  }, [clonedScene, robotArmorMaterial, rockPedestalMaterial]);

  // Interactive mouse follow & subtle organic breathing animation
  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;
    // Responsive yaw/pitch following cursor
    const targetRotY = state.pointer.x * 0.32;
    const targetRotX = -state.pointer.y * 0.12;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);

    // Subtle natural breathing float once printed
    const breath = !isPrinting || progress >= 0.98 ? Math.sin(t * 1.3) * 0.015 : 0;
    groupRef.current.position.y = -0.35 + breath;
  });

  return (
    <group ref={groupRef} position={[0, -0.35, 0]} scale={1.46}>
      <primitive object={clonedScene} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. Chunky Brutalist CoreXY Printer Frame with Extruder Head
// ---------------------------------------------------------------------------
function BrutalistPrinter({
  progress = 1,
  isPrinting = true,
  currentCutY,
}: {
  progress: number;
  isPrinting: boolean;
  currentCutY: number;
}) {
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (headRef.current && isPrinting && progress < 0.98) {
      // Active toolpath motion across the model build layer
      const radius = 0.58;
      headRef.current.position.x = Math.cos(t * 7.5) * radius;
      headRef.current.position.z = Math.sin(t * 7.5) * radius;
      headRef.current.position.y = currentCutY + 0.10;
    } else if (headRef.current) {
      // Park head cleanly to the top-right corner of the CoreXY frame
      headRef.current.position.x = THREE.MathUtils.lerp(headRef.current.position.x, 1.3, 0.05);
      headRef.current.position.z = THREE.MathUtils.lerp(headRef.current.position.z, 1.3, 0.05);
      headRef.current.position.y = THREE.MathUtils.lerp(headRef.current.position.y, 1.25, 0.05);
    }
  });

  return (
    <group position={[0, -0.05, 0]}>
      {/* 4 Corner Heavy Ink Aluminum Extrusions with Orange Accents */}
      {[
        [-1.52, 0, -1.52],
        [1.52, 0, -1.52],
        [-1.52, 0, 1.52],
        [1.52, 0, 1.52],
      ].map((pos, idx) => (
        <mesh key={idx} position={[pos[0], 0, pos[2]]} castShadow>
          <boxGeometry args={[0.2, 2.9, 0.2]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={2.4} color="#FF5A1F" />
        </mesh>
      ))}

      {/* Top Gantry Beams */}
      <mesh position={[0, 1.45, -1.52]}>
        <boxGeometry args={[3.04, 0.18, 0.18]} />
        <meshToonMaterial color="#0B0B0B" />
        <Outlines thickness={2.0} color="#FFFFFF" />
      </mesh>
      <mesh position={[0, 1.45, 1.52]}>
        <boxGeometry args={[3.04, 0.18, 0.18]} />
        <meshToonMaterial color="#0B0B0B" />
        <Outlines thickness={2.0} color="#FFFFFF" />
      </mesh>
      <mesh position={[-1.52, 1.45, 0]}>
        <boxGeometry args={[0.18, 0.18, 3.04]} />
        <meshToonMaterial color="#0B0B0B" />
        <Outlines thickness={2.0} color="#FFFFFF" />
      </mesh>
      <mesh position={[1.52, 1.45, 0]}>
        <boxGeometry args={[0.18, 0.18, 3.04]} />
        <meshToonMaterial color="#0B0B0B" />
        <Outlines thickness={2.0} color="#FFFFFF" />
      </mesh>

      {/* Heated Bed Plate (Paper Base with Hard Outlines) */}
      <mesh position={[0, -1.2, 0]} receiveShadow>
        <boxGeometry args={[2.7, 0.16, 2.7]} />
        <meshToonMaterial color="#FFF4E0" />
        <Outlines thickness={2.8} color="#0B0B0B" />
      </mesh>

      {/* Extruder Head Assembly */}
      <group ref={headRef} position={[0, currentCutY + 0.1, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.32, 0.38]} />
          <meshToonMaterial color="#FFE14D" />
          <Outlines thickness={2.4} color="#0B0B0B" />
        </mesh>
        {/* Hotend Brass Nozzle */}
        <mesh position={[0, -0.2, 0]}>
          <coneGeometry args={[0.09, 0.14, 12]} />
          <meshToonMaterial color="#0B0B0B" />
          <Outlines thickness={2} color="#FF5A1F" />
        </mesh>
        {/* Active Laser/Thermal Guide Point */}
        {isPrinting && progress < 0.98 && (
          <pointLight color="#FF5A1F" intensity={4} distance={1.6} decay={2} />
        )}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 5. Parallax Real Image Cutout Plane (Real Printer Photography)
// ---------------------------------------------------------------------------
function RealImagePlane() {
  const planeRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load('/hero-printer.jpg');
  }, []);

  useFrame((state) => {
    if (planeRef.current) {
      // Subtle opposite parallax so photo layer floats behind stylized models
      planeRef.current.position.x = -1.9 + state.pointer.x * -0.2;
      planeRef.current.position.y = -0.1 + state.pointer.y * -0.1;
    }
  });

  return (
    <group position={[-1.8, -0.1, -2.1]}>
      <mesh ref={planeRef} rotation={[0, 0.28, 0]}>
        <planeGeometry args={[2.6, 3.0]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
        <Outlines thickness={3} color="#0B0B0B" />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 6. Holographic Wireframe Loading Fallback
// ---------------------------------------------------------------------------
function ModelLoadingHologram() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 1.2;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.6;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.8, 1]} />
        <meshBasicMaterial color="#FF5A1F" wireframe transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Main Shared Canvas Scene
// ---------------------------------------------------------------------------
export default function HeroFusion3D({ printProgress = 0.5, isPrinting = true }: HeroFusion3DProps) {
  // Height coordinates for progressive layer printing
  const bedTopY = -1.12;
  const mechaTopY = 0.54;
  const currentCutY = isPrinting && printProgress < 0.99
    ? bedTopY + printProgress * (mechaTopY - bedTopY + 0.06)
    : 999.0;

  // Clipping plane to simulate progressive layer printing
  const clippingPlane = useMemo(() => {
    return new THREE.Plane(new THREE.Vector3(0, -1, 0), currentCutY);
  }, []);

  // Update clipping plane constant synchronously every frame
  clippingPlane.constant = currentCutY;

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [1.7, 1.2, 4.0], fov: 40 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          localClippingEnabled: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        className="w-full h-full"
      >
        <SceneSetup />

        {/* Directional Key Light & Studio Environment for High-Fidelity Titanium */}
        <ambientLight intensity={0.85} />
        <directionalLight
          position={[4.2, 7.5, 4.5]}
          intensity={2.6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-4.0, 3.2, 2.0]} intensity={1.2} color="#E2E8F0" />
        <directionalLight position={[0, 4.5, -4.5]} intensity={1.5} color="#CBD5E1" />
        <pointLight position={[0, -1.3, 1.8]} intensity={0.7} color="#FFF4E0" />

        {/* Studio HDR Reflections */}
        <Environment files="/potsdamer_platz_1k.hdr" />

        {/* Real Photography Cutout Layer with Parallax */}
        <RealImagePlane />

        {/* Orbiting Chunky Cel-Shaded Saturn Ring (Halo Backdrop) */}
        <ToonSaturnRing />

        {/* Brutalist CoreXY 3D Printer with Extruder & Heated Bed */}
        <BrutalistPrinter
          progress={printProgress}
          isPrinting={isPrinting}
          currentCutY={currentCutY}
        />

        {/* The 3D Printed Mecha Model (tmpoaxsvpt5.glb) */}
        <Suspense fallback={<ModelLoadingHologram />}>
          <MechaPrintedModel
            progress={printProgress}
            isPrinting={isPrinting}
            clippingPlane={clippingPlane}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the 3D model for instant rendering
useGLTF.preload('/tmpoaxsvpt5.glb');
