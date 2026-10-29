'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================================
// 1. TECHNOLOGY CARD 3D: METAMATERIAL LATTICE + OPTICAL SLA TOWER
// ============================================================================

// A procedural 3D Octahedral / Gyroid Cellular Lattice Cube
function GyroidLatticeCube({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  // Materials
  const strutMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x818cf8,
        emissive: 0x4f46e5,
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.2,
        transmission: 0.45,
        transparent: true,
        opacity: 0.9,
      }),
    []
  );

  const nodeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xc7d2fe,
        emissive: 0x6366f1,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.5,
      }),
    []
  );

  // Define 3D lattice vertices in space
  const s = 0.55;
  const nodes = useMemo(() => {
    const list: [number, number, number][] = [];
    for (let x of [-s, 0, s]) {
      for (let y of [-s, 0, s]) {
        for (let z of [-s, 0, s]) {
          // Keep a diamond/octahedral subset to form a beautiful open lattice
          if (Math.abs(x) + Math.abs(y) + Math.abs(z) <= s * 1.6) {
            list.push([x, y, z]);
          }
        }
      }
    }
    return list;
  }, [s]);

  // Connect neighboring nodes with struts
  const struts = useMemo(() => {
    const list: { start: [number, number, number]; end: [number, number, number] }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i][0] - nodes[j][0];
        const dy = nodes[i][1] - nodes[j][1];
        const dz = nodes[i][2] - nodes[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist > 0.01 && dist <= s * 1.1) {
          list.push({ start: nodes[i], end: nodes[j] });
        }
      }
    }
    return list;
  }, [nodes, s]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2 + 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 3D Joint Spheres */}
      {nodes.map((p, i) => (
        <mesh key={`n-${i}`} position={p} material={nodeMat}>
          <sphereGeometry args={[0.045, 12, 12]} />
        </mesh>
      ))}

      {/* 3D Strut Cylinders */}
      {struts.map((st, i) => {
        const p1 = new THREE.Vector3(...st.start);
        const p2 = new THREE.Vector3(...st.end);
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        const len = p1.distanceTo(p2);
        const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
        const orientation = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir
        );

        return (
          <mesh
            key={`s-${i}`}
            position={mid.toArray()}
            quaternion={orientation}
            material={strutMat}
          >
            <cylinderGeometry args={[0.02, 0.02, len, 8]} />
          </mesh>
        );
      })}
    </group>
  );
}

// 3D Optical SLA Light Engine & Slicing Vat
function OpticalSlaTower({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const gRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (gRef.current) {
      gRef.current.rotation.y = Math.sin(t * 0.3) * 0.15;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 2.5 + Math.sin(t * 5) * 1.0;
    }
  });

  return (
    <group ref={gRef} position={position}>
      {/* SLA Tower Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.65, 1.1, 0.55]} />
        <meshStandardMaterial color="#131620" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Optical Glass Resin Vat Window */}
      <mesh position={[0, 0.1, 0.28]}>
        <boxGeometry args={[0.48, 0.48, 0.04]} />
        <meshPhysicalMaterial
          color="#FF8A00"
          emissive="#FF5A1F"
          emissiveIntensity={0.6}
          transmission={0.8}
          transparent
          opacity={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* Internal UV Light Engine Point */}
      <pointLight ref={lightRef} color="#FF7A00" intensity={3} distance={1.2} position={[0, 0.1, 0.25]} />

      {/* Glowing Slicing Contour Rings */}
      {[-0.05, 0.1, 0.25].map((y, idx) => (
        <mesh key={`slice-${idx}`} position={[0, y, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.12, 0.15, 24]} />
          <meshBasicMaterial color="#FF5A1F" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Top Status LED */}
      <mesh position={[0, 0.48, 0.28]}>
        <planeGeometry args={[0.12, 0.025]} />
        <meshBasicMaterial color="#818CF8" />
      </mesh>
    </group>
  );
}

export function TechnologyCard3D() {
  return (
    <div className="w-full h-full min-h-[250px] relative">
      <Canvas
        camera={{ position: [2.2, 1.4, 2.6], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        className="cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 5, 4]} intensity={2.5} />
        <directionalLight position={[-3, 2, -2]} intensity={1.2} color="#818CF8" />

        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
          {/* Left: 3D Metamaterial Lattice */}
          <GyroidLatticeCube position={[-0.75, 0.15, 0.1]} />

          {/* Right: 3D Industrial SLA Optical Tower */}
          <OpticalSlaTower position={[0.75, -0.05, -0.1]} />
        </Float>

        <ContactShadows position={[0, -0.75, 0]} opacity={0.5} scale={4} blur={2} color="#000000" />
      </Canvas>
    </div>
  );
}

// ============================================================================
// 2. RESULTS CARD 3D: CELLULAR LATTICE + HELICAL GEAR + SURGICAL ARCH
// ============================================================================

// 1. 3D Cellular Impact Cushion (Helmet / Sneaker sole lattice)
function CellularLatticePillow({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.35;
      meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.1;
    }
  });

  // Create an array of interlaced hexagonal lattice struts
  const cells = useMemo(() => {
    const list: [number, number, number][] = [];
    const rad = 0.45;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      list.push([Math.cos(a) * rad, Math.sin(a * 2) * 0.12, Math.sin(a) * rad]);
    }
    return list;
  }, []);

  return (
    <group ref={meshRef} position={position}>
      {/* Outer Diamond Shell Ring */}
      <mesh>
        <torusGeometry args={[0.55, 0.09, 16, 32]} />
        <meshStandardMaterial color="#1E232B" metalness={0.7} roughness={0.35} />
      </mesh>

      {/* Internal Emerald Cushion Lattice Core */}
      <mesh>
        <octahedronGeometry args={[0.42, 2]} />
        <meshStandardMaterial
          color="#10B981"
          emissive="#059669"
          emissiveIntensity={0.4}
          wireframe
          roughness={0.3}
        />
      </mesh>

      {/* Internal Honeycomb Nodes */}
      {cells.map((c, idx) => (
        <mesh key={`c-${idx}`} position={c}>
          <cylinderGeometry args={[0.035, 0.035, 0.22, 12]} />
          <meshStandardMaterial color="#34D399" emissive="#10B981" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// 2. Precision 3D Helical Mechanical Gear (Automotive / Robotics)
function HelicalMechanicalGear({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const gearRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (gearRef.current) {
      gearRef.current.rotation.y -= delta * 0.6;
    }
  });

  const teeth = 14;
  const teethList = useMemo(() => {
    const arr = [];
    for (let i = 0; i < teeth; i++) {
      arr.push((i * 2 * Math.PI) / teeth);
    }
    return arr;
  }, [teeth]);

  return (
    <group ref={gearRef} position={position} rotation={[0.4, 0, 0.2]}>
      {/* Central Gear Hub */}
      <mesh>
        <cylinderGeometry args={[0.38, 0.38, 0.14, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.88} roughness={0.2} />
      </mesh>

      {/* Metallic Central Axle Bore */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.16, 20]} />
        <meshStandardMaterial color="#0F172A" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Keyway Notch */}
      <mesh position={[0.13, 0, 0]}>
        <boxGeometry args={[0.04, 0.15, 0.04]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* 14 Helical Involute Teeth */}
      {teethList.map((angle, i) => (
        <group key={`tooth-${i}`} rotation={[0, angle, 0]}>
          <mesh position={[0.42, 0, 0]} rotation={[0, 0.25, 0]}>
            <boxGeometry args={[0.12, 0.13, 0.065]} />
            <meshStandardMaterial color="#64748B" metalness={0.85} roughness={0.22} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 3. Biocompatible 3D Surgical Guide Arch (Healthcare & Medical)
function SurgicalGuideArch({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const archRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (archRef.current) {
      archRef.current.rotation.y += delta * 0.4;
      archRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.7) * 0.15;
    }
  });

  return (
    <group ref={archRef} position={position} rotation={[0.6, 0.4, 0]}>
      {/* Curved Anatomical U-Arch */}
      <mesh>
        <torusGeometry args={[0.45, 0.08, 16, 32, Math.PI * 1.2]} />
        <meshPhysicalMaterial
          color="#FDE68A"
          emissive="#D97706"
          emissiveIntensity={0.25}
          transmission={0.65}
          roughness={0.15}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Precision Metal Drill Sleeve Inserts */}
      {[-0.32, 0, 0.32].map((x, idx) => (
        <mesh key={`sleeve-${idx}`} position={[x, 0.1, 0.25]}>
          <cylinderGeometry args={[0.045, 0.045, 0.12, 16]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.12} />
        </mesh>
      ))}
    </group>
  );
}

export function ResultsCard3D() {
  return (
    <div className="w-full h-full min-h-[250px] relative">
      <Canvas
        camera={{ position: [2.5, 1.6, 2.8], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        className="cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 5, 4]} intensity={2.6} />
        <directionalLight position={[-3, 2, -2]} intensity={1.5} color="#10B981" />

        <Float speed={2.2} rotationIntensity={0.35} floatIntensity={0.65}>
          {/* Center-Top: 3D Impact Cellular Cushion Lattice */}
          <CellularLatticePillow position={[0, 0.42, 0]} />

          {/* Bottom-Left: 3D Precision Helical Gear */}
          <HelicalMechanicalGear position={[-0.85, -0.38, 0.2]} />

          {/* Bottom-Right: 3D Translucent Biocompatible Surgical Arch */}
          <SurgicalGuideArch position={[0.85, -0.35, -0.1]} />
        </Float>

        <ContactShadows position={[0, -0.85, 0]} opacity={0.55} scale={4.5} blur={2} color="#000000" />
      </Canvas>
    </div>
  );
}

