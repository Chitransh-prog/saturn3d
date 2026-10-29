'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SaturnPlanetAndRings() {
  const planetGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  // Saturn Planet Shader / PBR Material
  const planetMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0xdeb887,
      roughness: 0.65,
      metalness: 0.1,
    });
  }, []);

  // Saturn Ring Material with soft golden transparency
  const ringMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0xf5deb3,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
      roughness: 0.4,
      metalness: 0.25,
    });
  }, []);

  // Outer Ring Material
  const outerRingMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0xffa050,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
      roughness: 0.5,
    });
  }, []);

  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.45;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.25;
    }
    if (planetGroupRef.current) {
      // Gentle wobble / precession
      planetGroupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={planetGroupRef} rotation={[0.42, 0.2, 0.46]}>
      {/* 1. Main Planet Sphere */}
      <mesh ref={sphereRef} material={planetMat} castShadow receiveShadow>
        <sphereGeometry args={[0.52, 36, 36]} />
      </mesh>

      {/* Atmospheric equatorial bands */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.522, 0.015, 16, 48]} />
        <meshBasicMaterial color="#E28743" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.505, 0.012, 16, 48]} />
        <meshBasicMaterial color="#C88A4E" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.505, 0.012, 16, 48]} />
        <meshBasicMaterial color="#C88A4E" transparent opacity={0.6} />
      </mesh>

      {/* 2. Saturn Main Rings (Ring A & B) */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} material={ringMat} castShadow receiveShadow>
        <ringGeometry args={[0.66, 0.98, 64]} />
      </mesh>

      {/* 3. Outer Ring (Ring C / Cassini division separation) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={outerRingMat} receiveShadow>
        <ringGeometry args={[1.04, 1.24, 64]} />
      </mesh>
    </group>
  );
}

export default function RevolvingSaturn3D() {
  return (
    <div className="w-full h-full relative pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0.6, 2.6], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        {/* Sun Directional Light for dramatic planetary day/night crescent */}
        <directionalLight position={[4, 2, 3]} intensity={2.6} castShadow />
        <directionalLight position={[-3, -2, -2]} intensity={0.5} color="#FF7A30" />
        <pointLight position={[0, 2, 0]} intensity={1.2} color="#FFF5EA" />

        <SaturnPlanetAndRings />
      </Canvas>
    </div>
  );
}

