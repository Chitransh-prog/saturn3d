import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import * as THREE from 'three';

function TiltingSaturnCore() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const { pointer } = state;
    // Tilts dynamically toward the cursor
    const targetRotX = -pointer.y * 0.5 + 0.25;
    const targetRotY = pointer.x * 0.7;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);

    if (ringRef.current) {
      ringRef.current.rotation.z += 0.008;
    }
  });

  return (
    <group ref={groupRef} scale={1.25}>
      {/* Central Planet Sphere (Cel Shaded Saturn Orange) */}
      <mesh castShadow>
        <sphereGeometry args={[1.0, 32, 24]} />
        <meshToonMaterial color="#FF5A1F" />
        <Outlines thickness={2.5} color="#0B0B0B" />
      </mesh>

      {/* Primary Chunky Ring (Lemon Yellow) */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0.25, 0]}>
        <ringGeometry args={[1.4, 2.2, 48]} />
        <meshToonMaterial color="#FFE14D" side={THREE.DoubleSide} />
        <Outlines thickness={2.5} color="#0B0B0B" />
      </mesh>

      {/* Secondary Outer Thin Ring (Mint Green) */}
      <mesh rotation={[Math.PI / 3, 0.25, 0]}>
        <ringGeometry args={[2.35, 2.55, 48]} />
        <meshToonMaterial color="#7CF2C1" side={THREE.DoubleSide} />
        <Outlines thickness={2} color="#0B0B0B" />
      </mesh>
    </group>
  );
}

export default function FooterMedallion3D() {
  return (
    <div className="relative flex items-center justify-center select-none group">
      {/* Outer Medallion Shell with Hard Shadow */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#FFE14D] border-4 border-[#0B0B0B] shadow-[4px_4px_0px_#0B0B0B] sm:shadow-[6px_6px_0px_#0B0B0B] flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105">
        
        {/* Rotating Circular Text Ribbon */}
        <div className="absolute inset-0 pointer-events-none animate-[spin_24s_linear_infinite]">
          <svg viewBox="0 0 160 160" className="w-full h-full">
            <path
              id="circlePath"
              d="M 80, 80 m -62, 0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0"
              fill="none"
            />
            <text className="font-mono text-[9px] font-black uppercase tracking-[0.22em] fill-[#0B0B0B]">
              <textPath href="#circlePath" startOffset="0%">
                ★ SATURN 3D PRECISION LAB ★ BHOPAL, INDIA ★ EST. 2026 ★
              </textPath>
            </text>
          </svg>
        </div>

        {/* Inner Dark Planet Porthole */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0B0B0B] border-3 border-[#0B0B0B] shadow-inner relative flex items-center justify-center overflow-hidden">
          {/* Subtle grid in porthole */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />

          {/* 3D Tilting Saturn Canvas */}
          <Canvas
            camera={{ position: [0, 0, 4.2], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <ambientLight intensity={1.1} />
            <directionalLight position={[4, 5, 3]} intensity={2.0} />
            <directionalLight position={[-4, -2, -2]} intensity={0.6} />
            <TiltingSaturnCore />
          </Canvas>

          {/* Central Logo Overlay Watermark */}
          <div className="absolute bottom-1 bg-[#FF5A1F] text-white border border-[#0B0B0B] text-[8px] font-mono font-black px-1.5 py-0.2 rounded-xs shadow-[1px_1px_0px_#0B0B0B] pointer-events-none">
            3DP
          </div>
        </div>

        {/* Outer Top Decorative Stars */}
        <div className="absolute top-1 text-[10px] text-[#0B0B0B] font-black pointer-events-none">★</div>
      </div>
    </div>
  );
}
