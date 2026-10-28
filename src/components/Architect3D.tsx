import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// =============================================================================
// Parametric Architectural Spire & Active Slicing Scanner
// =============================================================================
function ParametricSpire() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const scanPlaneRef = useRef<THREE.Mesh>(null);

  // Materials
  const concreteMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#EDEDF2',
        roughness: 0.25,
        metalness: 0.15,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
        flatShading: true,
      }),
    []
  );

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#1e293b',
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
      }),
    []
  );

  const orangeGlowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#F7931E',
        emissive: '#F7931E',
        emissiveIntensity: 1.8,
        wireframe: false,
      }),
    []
  );

  // Procedural twisting architectural floors (14 levels)
  const floors = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const y = (i - 7) * 0.32;
      const progress = i / 14;
      // Parabolic taper: wide base, slender waist, flared crown
      const scale = 1.4 - Math.sin(progress * Math.PI) * 0.45;
      const rotationY = progress * Math.PI * 0.85; // Twisting helix
      return { y, scale, rotationY, i };
    });
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.6;
      ringRef.current.rotation.y -= delta * 0.8;
    }
    if (scanPlaneRef.current) {
      // Slicing laser moves smoothly up and down the tower
      scanPlaneRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.6) * 2.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Heavy Stepped Foundation Podium */}
      <mesh position={[0, -2.4, 0]} material={concreteMaterial}>
        <cylinderGeometry args={[1.8, 2.1, 0.4, 8]} />
      </mesh>
      <mesh position={[0, -2.15, 0]} material={concreteMaterial}>
        <cylinderGeometry args={[1.5, 1.8, 0.25, 8]} />
      </mesh>

      {/* 2. Illuminated Central Structural Core */}
      <mesh position={[0, 0, 0]} material={orangeGlowMaterial}>
        <cylinderGeometry args={[0.22, 0.28, 4.6, 16]} />
      </mesh>

      {/* 3. Stacked Twisting Floor Plates */}
      {floors.map(({ y, scale, rotationY, i }) => (
        <group key={i} position={[0, y, 0]} rotation={[0, rotationY, 0]} scale={[scale, 1, scale]}>
          {/* Main Floor Cantilever Plate */}
          <mesh material={concreteMaterial}>
            <boxGeometry args={[1.6, 0.08, 1.6]} />
          </mesh>
          {/* Recessed Glazed Facade Core */}
          <mesh position={[0, 0.12, 0]} material={glassMaterial}>
            <boxGeometry args={[1.25, 0.16, 1.25]} />
          </mesh>
          {/* Corner Vertical Diagrid Fin */}
          {[-0.78, 0.78].map((x, xi) =>
            [-0.78, 0.78].map((z, zi) => (
              <mesh key={`${xi}-${zi}`} position={[x, 0.12, z]} material={concreteMaterial}>
                <boxGeometry args={[0.06, 0.22, 0.06]} />
              </mesh>
            ))
          )}
        </group>
      ))}

      {/* 4. Architectural Crown & Transmission Spire */}
      <group position={[0, 2.5, 0]}>
        <mesh material={concreteMaterial}>
          <coneGeometry args={[0.65, 0.9, 8]} />
        </mesh>
        <mesh position={[0, 0.85, 0]} material={orangeGlowMaterial}>
          <cylinderGeometry args={[0.03, 0.08, 1.2, 12]} />
        </mesh>
      </group>

      {/* 5. Holographic Construction Scanner Laser Plane */}
      <group ref={scanPlaneRef} position={[0, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 2.2, 32]} />
          <meshBasicMaterial
            color="#F7931E"
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.35}
          />
        </mesh>
        {/* Intense Outer Laser Trim Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.18, 2.22, 32]} />
          <meshBasicMaterial color="#F7931E" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 6. Orbital Additive Gantry Ring */}
      <mesh ref={ringRef} position={[0, 0.5, 0]}>
        <torusGeometry args={[2.6, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

// =============================================================================
// Exported Responsive 3D Canvas
// =============================================================================
export default function Architect3D() {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [3.8, 1.5, 5.2], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.75]}
        className="w-full h-full"
      >
        {/* Dramatic Studio Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[6, 8, 5]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-5, -2, -4]} intensity={0.9} color="#38bdf8" />
        <pointLight position={[0, 0, 0]} intensity={2.0} color="#F7931E" distance={6} />
        <pointLight position={[2, 3, 2]} intensity={1.2} color="#F7931E" />

        {/* Gentle Floating Motion */}
        <Float speed={1.8} rotationIntensity={0.12} floatIntensity={0.3}>
          <ParametricSpire />
        </Float>

        {/* Intuitive Touch & Mouse Orbit Rotation */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.06}
          rotateSpeed={0.7}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2 + 0.3}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>

      {/* Interactive Badge Hint */}
      <div className="absolute bottom-3 right-3 z-10 pointer-events-none hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/70 text-[9px] font-mono-tech uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F7931E] animate-pulse" />
        <span>3D ARCHITECTURAL TWIN &bull; DRAG TO ROTATE</span>
      </div>
    </div>
  );
}
