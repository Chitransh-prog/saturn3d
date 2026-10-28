import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import * as THREE from 'three';

function TiltingSaturn() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const { pointer } = state;
    // Tilts dynamically toward the cursor
    const targetRotX = -pointer.y * 0.45 + 0.2;
    const targetRotY = pointer.x * 0.65;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);

    if (ringRef.current) {
      ringRef.current.rotation.z += 0.005;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.2}>
      {/* Central Planet Sphere (Cel Shaded Saturn Orange) */}
      <mesh castShadow>
        <sphereGeometry args={[1.2, 36, 28]} />
        <meshToonMaterial color="#FF5A1F" />
        <Outlines thickness={3} color="#0B0B0B" />
      </mesh>

      {/* Primary Chunky Ring (Lemon Yellow) */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0.25, 0]}>
        <ringGeometry args={[1.65, 2.7, 54]} />
        <meshToonMaterial color="#FFE14D" side={THREE.DoubleSide} />
        <Outlines thickness={3} color="#0B0B0B" />
      </mesh>

      {/* Secondary Outer Thin Ring (Periwinkle) */}
      <mesh rotation={[Math.PI / 3, 0.25, 0]}>
        <ringGeometry args={[2.9, 3.15, 54]} />
        <meshToonMaterial color="#8EA2FF" side={THREE.DoubleSide} />
        <Outlines thickness={2.5} color="#0B0B0B" />
      </mesh>
    </group>
  );
}

export default function FooterSaturn3D() {
  return (
    <div className="w-full h-56 sm:h-72 relative select-none">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 5, 3]} intensity={1.8} />
        <directionalLight position={[-4, -2, -2]} intensity={0.4} />
        <TiltingSaturn />
      </Canvas>
    </div>
  );
}
