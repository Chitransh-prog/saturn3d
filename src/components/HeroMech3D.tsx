import { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// 1. Mecha + Mountain Rock Model Component
// ---------------------------------------------------------------------------
interface MechaModelProps {
  modelUrl: string;
}

function MechaModel({ modelUrl }: MechaModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelUrl);

  // High-fidelity PBR Materials matching reference design
  const { robotArmorMaterial, rockPedestalMaterial } = useMemo(() => {
    // 1. Platinum-Silver Titanium Armor with specular luster & baked vertex details
    const robotMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFFFF'), // Pure white multiplier preserves crisp vertex colors
      metalness: 0.64,
      roughness: 0.22,
      clearcoat: 0.5,
      clearcoatRoughness: 0.16,
      reflectivity: 0.9,
      envMapIntensity: 1.25,
      vertexColors: true,
      side: THREE.FrontSide,
    });

    // 2. Weathered Sandstone/Granite Rock Pedestal
    const rockMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      metalness: 0.04,
      roughness: 0.90,
      envMapIntensity: 0.35,
      vertexColors: true,
      side: THREE.FrontSide,
    });

    return { robotArmorMaterial: robotMat, rockPedestalMaterial: rockMat };
  }, []);

  // Assign materials to meshes
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
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
        // Note: Unit-length normals are pre-baked in the GLB; do not call computeVertexNormals().
      }
    });
  }, [scene, robotArmorMaterial, rockPedestalMaterial]);

  // Interactive mouse follow & subtle organic breathing animation
  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;
    // Smooth responsive yaw/pitch following cursor
    const targetRotY = state.pointer.x * 0.32 + 0.05;
    const targetRotX = -state.pointer.y * 0.12 + 0.02;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.04);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.04);

    // Subtle natural breathing float
    groupRef.current.position.y = -0.05 + Math.sin(t * 1.2) * 0.015;
  });

  return (
    <group ref={groupRef} position={[0, -0.05, 0]} scale={1.12}>
      <primitive object={scene} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 2. Elegant Wireframe Loading Indicator
// ---------------------------------------------------------------------------
function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.8, 1]} />
        <meshBasicMaterial color="#F7931E" wireframe transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. Main Hero 3D Stage with Lighting & HDR Environment
// ---------------------------------------------------------------------------
export default function HeroMech3D() {
  const modelPath = '/tmpoaxsvpt5.glb';

  return (
    <div className="w-full h-full relative flex items-center justify-center select-none pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0.12, 2.9], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        className="w-full h-full"
      >
        {/* Studio Key Light (Top-Front-Left casting sharp architectural shadows) */}
        <directionalLight
          position={[3.8, 6.5, 4.2]}
          intensity={2.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={0.0001}
        />

        {/* Studio Fill Light (Cool sky rim light from left) */}
        <directionalLight position={[-4.0, 3.0, 2.0]} intensity={1.2} color="#E2E8F0" />

        {/* Crisp Back Rim Light for dramatic silhouette edge definition */}
        <directionalLight position={[0, 4.5, -4.5]} intensity={1.6} color="#CBD5E1" />

        {/* Warm Ground Bounce Light simulating sandy rock reflection */}
        <pointLight position={[0, -1.5, 1.8]} intensity={0.6} color="#F5ECE0" />

        {/* Ambient base lighting */}
        <ambientLight intensity={0.8} />

        {/* Studio HDR Reflections */}
        <Environment files="/potsdamer_platz_1k.hdr" />

        <Suspense fallback={<LoadingFallback />}>
          <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.15}>
            <MechaModel modelUrl={modelPath} />
          </Float>

          {/* Soft grounding shadow directly under the rock summit */}
          <ContactShadows
            position={[0, -0.68, 0]}
            opacity={0.55}
            scale={5.2}
            blur={2.2}
            far={3.0}
            color="#1A1815"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the 3D model for instant rendering
useGLTF.preload('/tmpoaxsvpt5.glb');
