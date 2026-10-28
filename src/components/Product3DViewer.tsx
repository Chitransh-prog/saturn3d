import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { 
  RotateCcw, Eye, Layers,
  Sparkles, Compass, Box
} from 'lucide-react';
import type { Product } from '@/lib/api';

// =============================================================================
// Material Configurator Hook / Generator
// =============================================================================
interface MaterialProps {
  materialType: string;
  wireframe: boolean;
}

function useProductMaterial({ materialType, wireframe }: MaterialProps) {
  return useMemo(() => {
    if (wireframe) {
      return new THREE.MeshStandardMaterial({
        color: '#F7931E',
        wireframe: true,
        emissive: '#F7931E',
        emissiveIntensity: 0.4,
      });
    }

    switch (materialType) {
      case 'ABS':
        // Flame retardant ESD-safe matte dark charcoal
        return new THREE.MeshPhysicalMaterial({
          color: '#1c1d22',
          roughness: 0.65,
          metalness: 0.18,
          clearcoat: 0.1,
          clearcoatRoughness: 0.4,
        });

      case 'PETG':
        // Industrial high-impact gloss slate / cyan tint
        return new THREE.MeshPhysicalMaterial({
          color: '#2a3b4c',
          roughness: 0.18,
          metalness: 0.25,
          clearcoat: 0.85,
          clearcoatRoughness: 0.1,
        });

      case 'TPU':
        // Dense rubber elastomer
        return new THREE.MeshStandardMaterial({
          color: '#232326',
          roughness: 0.88,
          metalness: 0.02,
        });

      case 'PLA':
      default:
        // High-precision silky polymer, light studio ivory
        return new THREE.MeshPhysicalMaterial({
          color: '#F3F2F0',
          roughness: 0.28,
          metalness: 0.08,
          clearcoat: 0.4,
          clearcoatRoughness: 0.2,
        });
    }
  }, [materialType, wireframe]);
}

// =============================================================================
// 1. Procedural Model: Modular Pen & Caliper Station (Product #9)
// =============================================================================
function PenCaliperStationModel({ material, wireframe }: { material: THREE.Material; wireframe: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  // Pen materials
  const chromeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d4d4d8',
        metalness: 0.92,
        roughness: 0.15,
        wireframe,
      }),
    [wireframe]
  );

  const blackPenMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#18181b',
        metalness: 0.3,
        roughness: 0.4,
        wireframe,
      }),
    [wireframe]
  );

  const caliperBladeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#94a3b8',
        metalness: 0.85,
        roughness: 0.2,
        wireframe,
      }),
    [wireframe]
  );

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Heavy Base Disc */}
      <mesh position={[0, 0.08, 0]} material={material}>
        <cylinderGeometry args={[1.35, 1.4, 0.16, 48]} />
      </mesh>

      {/* Outer Lattice Perforated Cylinder Body */}
      {Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const x = Math.cos(angle) * 1.25;
        const z = Math.sin(angle) * 1.25;
        return (
          <mesh
            key={`pillar-${i}`}
            position={[x, 1.15, z]}
            rotation={[0, -angle, (i % 2 === 0 ? 0.08 : -0.08)]}
            material={material}
          >
            <boxGeometry args={[0.18, 2.0, 0.12]} />
          </mesh>
        );
      })}

      {/* Internal Mid-Height Reinforcing Ring */}
      <mesh position={[0, 1.1, 0]} material={material}>
        <torusGeometry args={[1.22, 0.09, 16, 48]} />
      </mesh>

      {/* Top Chamfered Collar Ring */}
      <mesh position={[0, 2.15, 0]} material={material}>
        <cylinderGeometry args={[1.36, 1.32, 0.22, 48]} />
      </mesh>

      {/* Inner Floor Support */}
      <mesh position={[0, 0.22, 0]} material={material}>
        <cylinderGeometry args={[1.2, 1.2, 0.12, 32]} />
      </mesh>

      {/* Digital Caliper Stood in Vertical Slot (Right Side) */}
      <group position={[0.45, 1.7, 0]} rotation={[0.05, 0.1, -0.05]}>
        {/* Caliper Long Stainless Blade */}
        <mesh position={[0, 0.3, 0]} material={caliperBladeMaterial}>
          <boxGeometry args={[0.22, 2.4, 0.04]} />
        </mesh>
        {/* Caliper Measuring Head / Digital Unit */}
        <mesh position={[0, 0.8, 0.06]}>
          <boxGeometry args={[0.45, 0.55, 0.14]} />
          <meshStandardMaterial color="#09090b" roughness={0.3} metalness={0.2} wireframe={wireframe} />
        </mesh>
        {/* Digital LCD screen */}
        <mesh position={[0, 0.8, 0.14]}>
          <planeGeometry args={[0.3, 0.16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        {/* Caliper Jaws */}
        <mesh position={[-0.2, 1.4, 0]} material={caliperBladeMaterial}>
          <boxGeometry args={[0.35, 0.1, 0.04]} />
        </mesh>
      </group>

      {/* Precision Drafting Stylus (Left Center) */}
      <group position={[-0.35, 1.5, 0.2]} rotation={[-0.12, 0, 0.08]}>
        <mesh position={[0, 0, 0]} material={chromeMaterial}>
          <cylinderGeometry args={[0.08, 0.08, 2.2, 24]} />
        </mesh>
        {/* Conical Tip */}
        <mesh position={[0, -1.18, 0]} material={chromeMaterial}>
          <coneGeometry args={[0.08, 0.2, 24]} />
        </mesh>
        {/* Chrome Clip */}
        <mesh position={[0.09, 0.8, 0]} material={chromeMaterial}>
          <boxGeometry args={[0.04, 0.5, 0.02]} />
        </mesh>
      </group>

      {/* Technical Pen (Back Center) */}
      <group position={[0, 1.6, -0.35]} rotation={[0.08, 0.2, -0.05]}>
        <mesh position={[0, 0, 0]} material={blackPenMaterial}>
          <cylinderGeometry args={[0.09, 0.09, 2.4, 24]} />
        </mesh>
        {/* Accent Ring */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.095, 0.095, 0.05, 24]} />
          <meshBasicMaterial color="#F7931E" />
        </mesh>
      </group>
    </group>
  );
}

// =============================================================================
// 1. Procedural Model: Hexagonal Carbon Vase (Product #1)
// =============================================================================
function HexVaseModel({ material }: { material: THREE.Material }) {
  const geometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.85, 1.35, 3.2, 6, 32, false);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const angle = (y + 1.6) * 0.45;
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      pos.setX(i, x * cos - z * sin);
      pos.setZ(i, x * sin + z * cos);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <group position={[0, -0.4, 0]}>
      <mesh geometry={geometry} material={material} />
      {/* Top opening rim */}
      <mesh position={[0, 1.62, 0]} material={material}>
        <torusGeometry args={[0.82, 0.08, 16, 6]} />
      </mesh>
      {/* Internal hollow depth */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.7, 0.5, 1.8, 16]} />
        <meshBasicMaterial color="#111" />
      </mesh>
    </group>
  );
}

// =============================================================================
// 2. Procedural Model: Tech Organizer Elite (Product #2)
// =============================================================================
function TechOrganizerModel({ material }: { material: THREE.Material }) {
  return (
    <group position={[0, -0.3, 0]}>
      {/* Main Dock Platform Base Tray */}
      <mesh position={[0, 0.15, 0]} material={material}>
        <boxGeometry args={[3.4, 0.35, 2.2]} />
      </mesh>

      {/* Raised Perimeter Lip */}
      <mesh position={[0, 0.36, -1.05]} material={material}>
        <boxGeometry args={[3.4, 0.15, 0.1]} />
      </mesh>
      <mesh position={[0, 0.36, 1.05]} material={material}>
        <boxGeometry args={[3.4, 0.15, 0.1]} />
      </mesh>
      <mesh position={[-1.65, 0.36, 0]} material={material}>
        <boxGeometry args={[0.1, 0.15, 2.2]} />
      </mesh>
      <mesh position={[1.65, 0.36, 0]} material={material}>
        <boxGeometry args={[0.1, 0.15, 2.2]} />
      </mesh>

      {/* Upright Tablet Standing in Left Slot */}
      <group position={[-0.75, 0.95, -0.45]} rotation={[0.08, 0, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 1.1, 0.06]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Tablet Glass Screen */}
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[1.4, 1.0]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* Angled Smartphone on Right Rest */}
      <group position={[0.75, 0.8, -0.35]} rotation={[-0.32, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.85, 1.45, 0.06]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[0.8, 1.38]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
      </group>

      {/* MagSafe Circular Puck Indentation (Right Front) */}
      <mesh position={[0.75, 0.34, 0.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.45, 32]} />
        <meshBasicMaterial color="#334155" />
      </mesh>

      {/* Cable Channels & Coiled Wire (Left Front) */}
      <mesh position={[-0.75, 0.38, 0.55]}>
        <torusGeometry args={[0.32, 0.07, 16, 32]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.6} metalness={0.1} />
      </mesh>
    </group>
  );
}

// =============================================================================
// 3. Procedural Model: Articulated Architect Desk Lamp (Product #3)
// =============================================================================
function ArticulatedLampModel({ material, wireframe }: { material: THREE.Material; wireframe: boolean }) {
  const orangeAccent = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#F7931E',
        roughness: 0.3,
        metalness: 0.2,
        wireframe,
      }),
    [wireframe]
  );

  return (
    <group position={[0, -1.0, 0]}>
      {/* Heavy Circular Base Disc */}
      <mesh position={[0, 0.1, 0]} material={material}>
        <cylinderGeometry args={[1.1, 1.15, 0.2, 36]} />
      </mesh>
      {/* Base Perimeter Accent Pads */}
      <mesh position={[0, 0.11, 0]} material={orangeAccent}>
        <torusGeometry args={[1.08, 0.03, 12, 36]} />
      </mesh>

      {/* Swivel Base Turret */}
      <mesh position={[0, 0.3, 0]} material={orangeAccent}>
        <cylinderGeometry args={[0.2, 0.2, 0.25, 20]} />
      </mesh>

      {/* Lower Arm Pivot Knuckle */}
      <mesh position={[0, 0.48, 0]} rotation={[0, 0, Math.PI / 2]} material={orangeAccent}>
        <cylinderGeometry args={[0.18, 0.18, 0.36, 16]} />
      </mesh>

      {/* Lower Dual Strut Arm (Angled Back 22°) */}
      <group position={[0, 0.48, 0]} rotation={[0.42, 0, 0]}>
        <mesh position={[-0.12, 0.8, 0]} material={material}>
          <boxGeometry args={[0.06, 1.5, 0.12]} />
        </mesh>
        <mesh position={[0.12, 0.8, 0]} material={material}>
          <boxGeometry args={[0.06, 1.5, 0.12]} />
        </mesh>

        {/* Mid Elbow Knuckle Joint */}
        <group position={[0, 1.55, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={orangeAccent}>
            <cylinderGeometry args={[0.22, 0.22, 0.42, 18]} />
          </mesh>

          {/* Upper Dual Strut Arm (Angled Forward 55°) */}
          <group rotation={[-1.15, 0, 0]}>
            <mesh position={[-0.12, 0.75, 0]} material={material}>
              <boxGeometry args={[0.06, 1.45, 0.12]} />
            </mesh>
            <mesh position={[0.12, 0.75, 0]} material={material}>
              <boxGeometry args={[0.06, 1.45, 0.12]} />
            </mesh>

            {/* Head Pivot Knuckle */}
            <group position={[0, 1.5, 0]}>
              <mesh rotation={[0, 0, Math.PI / 2]} material={orangeAccent}>
                <cylinderGeometry args={[0.16, 0.16, 0.36, 16]} />
              </mesh>

              {/* Sleek Hooded Lamp Head */}
              <group position={[0, 0.05, 0.75]} rotation={[-0.45, 0, 0]}>
                <mesh material={material}>
                  <boxGeometry args={[0.5, 0.16, 1.6]} />
                </mesh>
                {/* Orange End Cap */}
                <mesh position={[0, 0, -0.8]} material={orangeAccent}>
                  <boxGeometry args={[0.51, 0.17, 0.12]} />
                </mesh>
                {/* Underneath Illuminated LED Diffuser Screen */}
                <mesh position={[0, -0.09, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[0.42, 1.35]} />
                  <meshBasicMaterial color="#fffbeb" />
                </mesh>
                {/* Downward Warm Point Light */}
                <pointLight position={[0, -0.4, 0]} intensity={1.5} distance={5} color="#fffbeb" />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

// =============================================================================
// 4. Procedural Model: Monolithic Heavy Bookends (Product #4)
// =============================================================================
function MonolithicBookendsModel({ material, wireframe }: { material: THREE.Material; wireframe: boolean }) {
  return (
    <group position={[0, -0.4, 0]}>
      {/* ---------------- Left Bookend ---------------- */}
      <group position={[-1.1, 0, 0]}>
        {/* Main Monolith Body */}
        <mesh position={[0, 0.9, 0]} material={material}>
          <boxGeometry args={[0.9, 1.8, 1.35]} />
        </mesh>
        {/* Sculpted Geometric Facet Insets */}
        <mesh position={[0.1, 1.15, 0]} rotation={[0, 0, 0.4]} material={material}>
          <octahedronGeometry args={[0.42, 0]} />
        </mesh>
        <mesh position={[0.1, 0.6, 0]} rotation={[0.3, 0.2, 0]} material={material}>
          <octahedronGeometry args={[0.38, 0]} />
        </mesh>
        {/* Outer Chamfer Wedge */}
        <mesh position={[-0.38, 1.55, 0]} rotation={[0, 0, 0.7]} material={material}>
          <boxGeometry args={[0.4, 0.4, 1.36]} />
        </mesh>
      </group>

      {/* ---------------- 3 Center Standing Hardcover Books ---------------- */}
      {/* Book 1: Burgundy Red */}
      <group position={[-0.32, 0.92, 0]}>
        <mesh>
          <boxGeometry args={[0.26, 1.85, 1.3]} />
          <meshStandardMaterial color="#881337" roughness={0.4} wireframe={wireframe} />
        </mesh>
        {/* Gold Spine Stripe */}
        <mesh position={[-0.132, 0, 0]}>
          <boxGeometry args={[0.005, 1.84, 0.08]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
        {/* Top Paper Pages */}
        <mesh position={[0.02, 0.926, 0]}>
          <planeGeometry args={[0.22, 1.25]} />
          <meshBasicMaterial color="#fef3c7" />
        </mesh>
      </group>

      {/* Book 2: Deep Navy Slate */}
      <group position={[-0.05, 0.88, 0]}>
        <mesh>
          <boxGeometry args={[0.24, 1.76, 1.24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} wireframe={wireframe} />
        </mesh>
        <mesh position={[-0.122, 0, 0]}>
          <boxGeometry args={[0.005, 1.75, 0.08]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        {/* Top Paper Pages */}
        <mesh position={[0.02, 0.881, 0]}>
          <planeGeometry args={[0.2, 1.18]} />
          <meshBasicMaterial color="#fef3c7" />
        </mesh>
      </group>

      {/* Book 3: Terracotta / Saturn Orange Cloth */}
      <group position={[0.2, 0.83, 0]}>
        <mesh>
          <boxGeometry args={[0.22, 1.66, 1.18]} />
          <meshStandardMaterial color="#ea580c" roughness={0.6} wireframe={wireframe} />
        </mesh>
        {/* Top Paper Pages */}
        <mesh position={[0.02, 0.831, 0]}>
          <planeGeometry args={[0.18, 1.12]} />
          <meshBasicMaterial color="#fef3c7" />
        </mesh>
      </group>

      {/* ---------------- Right Bookend ---------------- */}
      <group position={[1.1, 0, 0]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.9, 0]} material={material}>
          <boxGeometry args={[0.9, 1.8, 1.35]} />
        </mesh>
        <mesh position={[0.1, 1.15, 0]} rotation={[0, 0, 0.4]} material={material}>
          <octahedronGeometry args={[0.42, 0]} />
        </mesh>
        <mesh position={[0.1, 0.6, 0]} rotation={[0.3, 0.2, 0]} material={material}>
          <octahedronGeometry args={[0.38, 0]} />
        </mesh>
        <mesh position={[-0.38, 1.55, 0]} rotation={[0, 0, 0.7]} material={material}>
          <boxGeometry args={[0.4, 0.4, 1.36]} />
        </mesh>
      </group>
    </group>
  );
}

// =============================================================================
// 5. Procedural Model: Faceted Architectural Wall Hooks (Product #5)
// =============================================================================
function FacetedWallHookModel({ material, wireframe }: { material: THREE.Material; wireframe: boolean }) {
  const metalKeyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#cbd5e1',
        metalness: 0.95,
        roughness: 0.15,
        wireframe,
      }),
    [wireframe]
  );

  const brassKeyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f59e0b',
        metalness: 0.9,
        roughness: 0.2,
        wireframe,
      }),
    [wireframe]
  );

  const leatherStrapMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.85,
        metalness: 0.05,
        wireframe,
      }),
    [wireframe]
  );

  return (
    <group position={[0, 0.1, 0]}>
      {/* ---------------- Main Horizontal Connecting Faceted Beam ---------------- */}
      <mesh position={[0, 0, 0]} material={material}>
        <boxGeometry args={[3.2, 0.42, 0.35]} />
      </mesh>

      {/* Triangular Low-Poly Faceted Bridging Wedges */}
      <mesh position={[-0.6, 0, 0.1]} rotation={[0, 0, Math.PI / 4]} material={material}>
        <octahedronGeometry args={[0.35, 0]} />
      </mesh>
      <mesh position={[0.6, 0, 0.1]} rotation={[0, 0, -Math.PI / 4]} material={material}>
        <octahedronGeometry args={[0.35, 0]} />
      </mesh>

      {/* ---------------- 3 Vertical Faceted Posts with Prongs ---------------- */}
      {[-1.25, 0, 1.25].map((xPos, idx) => (
        <group key={`post-${idx}`} position={[xPos, 0, 0]}>
          {/* Main Faceted Upward Tower / Prong */}
          <mesh position={[0, 0.45, 0.08]} material={material}>
            <cylinderGeometry args={[0.18, 0.32, 1.3, 4]} />
          </mesh>
          {/* Beveled Faceted Top Tip */}
          <mesh position={[0, 1.15, 0.06]} rotation={[0.2, 0, 0]} material={material}>
            <coneGeometry args={[0.18, 0.45, 4]} />
          </mesh>

          {/* Lower Angled Hook Arm */}
          <mesh position={[0, -0.42, 0.12]} material={material}>
            <boxGeometry args={[0.22, 0.55, 0.3]} />
          </mesh>
          {/* Hook Forward Peg Lip */}
          <mesh position={[0, -0.62, 0.32]} rotation={[-0.35, 0, 0]} material={material}>
            <boxGeometry args={[0.2, 0.38, 0.18]} />
          </mesh>
        </group>
      ))}

      {/* ---------------- Hanging Props from Photo ---------------- */}
      {/* Center Hook: Dangling Keyring + 3 Metal Keys */}
      <group position={[0, -0.7, 0.42]}>
        {/* Split Ring */}
        <mesh material={metalKeyMat}>
          <torusGeometry args={[0.14, 0.018, 16, 32]} />
        </mesh>
        {/* Key 1 (Silver) */}
        <group position={[-0.04, -0.32, 0]} rotation={[0, 0, 0.1]}>
          <mesh material={metalKeyMat}>
            <boxGeometry args={[0.07, 0.48, 0.02]} />
          </mesh>
          <mesh position={[0, 0.26, 0]} material={metalKeyMat}>
            <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
          </mesh>
        </group>
        {/* Key 2 (Brass) */}
        <group position={[0.04, -0.36, 0.02]} rotation={[0, 0, -0.15]}>
          <mesh material={brassKeyMat}>
            <boxGeometry args={[0.07, 0.54, 0.02]} />
          </mesh>
          <mesh position={[0, 0.28, 0]} material={brassKeyMat}>
            <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
          </mesh>
        </group>
      </group>

      {/* Left Hook: Dangling Tote Bag Strap */}
      <group position={[-1.25, -0.7, 0.42]}>
        <mesh material={leatherStrapMat}>
          <torusGeometry args={[0.3, 0.03, 16, 32]} />
        </mesh>
        <mesh position={[-0.1, -0.7, 0]} material={leatherStrapMat}>
          <boxGeometry args={[0.04, 0.8, 0.02]} />
        </mesh>
      </group>

      {/* Right Hook: Small Crossbody Bag Strap */}
      <group position={[1.25, -0.7, 0.42]}>
        <mesh material={leatherStrapMat}>
          <torusGeometry args={[0.25, 0.025, 16, 32]} />
        </mesh>
        {/* Mini Crossbody Bag body */}
        <mesh position={[0.05, -1.1, 0.05]} material={leatherStrapMat}>
          <boxGeometry args={[0.45, 0.65, 0.25]} />
        </mesh>
        {/* Zipper Pull */}
        <mesh position={[0.05, -0.9, 0.18]} material={metalKeyMat}>
          <boxGeometry args={[0.04, 0.14, 0.02]} />
        </mesh>
      </group>
    </group>
  );
}

// =============================================================================
// 6. Procedural Model: Precision Modular Cable Management (Product #6)
// =============================================================================
function ModularCableClipModel({ material, wireframe }: { material: THREE.Material; wireframe: boolean }) {
  const cableMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#cbd5e1',
        roughness: 0.6,
        metalness: 0.1,
        wireframe,
      }),
    [wireframe]
  );

  const blackWireMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.4,
        metalness: 0.2,
        wireframe,
      }),
    [wireframe]
  );

  const redWireMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#dc2626',
        roughness: 0.5,
        wireframe,
      }),
    [wireframe]
  );

  return (
    <group position={[0, -0.2, 0]}>
      {/* 4 Interlocking Modular Cable Clip Blocks */}
      {[
        { x: -1.35, z: -0.15, rot: 0.05 },
        { x: -0.45, z: 0.18, rot: -0.04 },
        { x: 0.45, z: -0.12, rot: 0.06 },
        { x: 1.35, z: 0.14, rot: -0.05 },
      ].map((b, i) => (
        <group key={`block-${i}`} position={[b.x, 0, b.z]} rotation={[0, b.rot, 0]}>
          <mesh material={material}>
            <boxGeometry args={[0.65, 0.55, 0.65]} />
          </mesh>
          {/* Top Cable Guide Slit */}
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.14, 0.18, 0.66]} />
            <meshBasicMaterial color="#020617" />
          </mesh>
        </group>
      ))}

      {/* Main Silver Braided Nylon Cable traversing all blocks */}
      <mesh position={[0, 0.14, 0]} rotation={[0, 0, Math.PI / 2]} material={cableMat}>
        <cylinderGeometry args={[0.07, 0.07, 3.4, 24]} />
      </mesh>

      {/* Black Silicone Power Wire */}
      <mesh position={[0, -0.05, 0.12]} rotation={[0, 0, Math.PI / 2]} material={blackWireMat}>
        <cylinderGeometry args={[0.05, 0.05, 3.5, 20]} />
      </mesh>
      {/* Molded USB-C Plugs on ends */}
      <mesh position={[-1.85, -0.05, 0.12]} rotation={[0, 0, Math.PI / 2]} material={blackWireMat}>
        <boxGeometry args={[0.12, 0.25, 0.2]} />
      </mesh>
      <mesh position={[-2.05, -0.05, 0.12]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.04, 0.14, 0.12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Secondary Red / Black Wire on Top Channel */}
      <mesh position={[0.5, 0.25, -0.08]} rotation={[0, 0, Math.PI / 2]} material={redWireMat}>
        <cylinderGeometry args={[0.035, 0.035, 2.2, 16]} />
      </mesh>
    </group>
  );
}

// =============================================================================
// 7. Procedural Model: Articulated Smartphone Folding Stand (Product #7)
// =============================================================================
function ArticulatedPhoneStandModel({ material, wireframe }: { material: THREE.Material; wireframe: boolean }) {
  const blueKnuckleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0284c7',
        roughness: 0.25,
        metalness: 0.85,
        wireframe,
      }),
    [wireframe]
  );

  return (
    <group position={[0, -0.8, 0]}>
      {/* ---------------- U-Shaped Desktop Base ---------------- */}
      <group position={[0, 0.08, 0.1]}>
        {/* Left Prong */}
        <mesh position={[-0.55, 0, 0]} material={material}>
          <boxGeometry args={[0.38, 0.16, 1.8]} />
        </mesh>
        {/* Right Prong */}
        <mesh position={[0.55, 0, 0]} material={material}>
          <boxGeometry args={[0.38, 0.16, 1.8]} />
        </mesh>
        {/* Rear Crossbar */}
        <mesh position={[0, 0, -0.8]} material={material}>
          <boxGeometry args={[1.48, 0.16, 0.24]} />
        </mesh>

        {/* 4 Blue Silicone Anti-Slip Pads */}
        {[
          [-0.55, 0.8],
          [0.55, 0.8],
          [-0.55, -0.7],
          [0.55, -0.7],
        ].map(([px, pz], i) => (
          <mesh key={i} position={[px, 0.09, pz]} material={blueKnuckleMat}>
            <boxGeometry args={[0.26, 0.02, 0.26]} />
          </mesh>
        ))}
      </group>

      {/* ---------------- Lower Anodized Blue Pivot Hinge ---------------- */}
      <group position={[0, 0.24, -0.65]}>
        <mesh rotation={[0, 0, Math.PI / 2]} material={blueKnuckleMat}>
          <cylinderGeometry args={[0.18, 0.18, 1.1, 24]} />
        </mesh>

        {/* ---------------- Skeletonized Dual Riser Arm (Tilted 55°) ---------------- */}
        <group rotation={[0.62, 0, 0]}>
          <mesh position={[-0.32, 0.8, 0]} material={material}>
            <boxGeometry args={[0.14, 1.55, 0.35]} />
          </mesh>
          <mesh position={[0.32, 0.8, 0]} material={material}>
            <boxGeometry args={[0.14, 1.55, 0.35]} />
          </mesh>

          {/* ---------------- Upper Anodized Blue Tilt Hinge ---------------- */}
          <group position={[0, 1.55, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} material={blueKnuckleMat}>
              <cylinderGeometry args={[0.18, 0.18, 0.9, 24]} />
            </mesh>

            {/* ---------------- Phone Cradle Backplate & Resting Phone ---------------- */}
            <group rotation={[-1.15, 0, 0]}>
              {/* Backplate */}
              <mesh position={[0, 0.45, 0.04]} material={material}>
                <boxGeometry args={[1.2, 1.4, 0.08]} />
              </mesh>
              {/* Bottom Support Shelf Claws */}
              <mesh position={[0, -0.25, 0.22]} material={material}>
                <boxGeometry args={[1.2, 0.08, 0.36]} />
              </mesh>
              <mesh position={[0, -0.15, 0.38]} material={blueKnuckleMat}>
                <boxGeometry args={[1.2, 0.2, 0.04]} />
              </mesh>

              {/* Resting Titanium Smartphone */}
              <group position={[0, 0.65, 0.16]}>
                {/* Phone Body */}
                <mesh>
                  <boxGeometry args={[1.1, 2.1, 0.07]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} wireframe={wireframe} />
                </mesh>
                {/* OLED Glass Screen */}
                <mesh position={[0, 0, 0.038]}>
                  <planeGeometry args={[1.04, 2.02]} />
                  <meshBasicMaterial color="#020617" />
                </mesh>
                {/* Speaker Notch */}
                <mesh position={[0, 0.96, 0.04]}>
                  <boxGeometry args={[0.2, 0.02, 0.005]} />
                  <meshBasicMaterial color="#334155" />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

// =============================================================================
// 8. Procedural Model: Parametric Fractal Planter (Product #8)
// =============================================================================
function ParametricPlanterModel({ material, wireframe }: { material: THREE.Material; wireframe: boolean }) {
  const succulentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#10b981',
        roughness: 0.45,
        metalness: 0.05,
        wireframe,
      }),
    [wireframe]
  );

  const succulentTipMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f43f5e',
        roughness: 0.5,
        wireframe,
      }),
    [wireframe]
  );

  return (
    <group position={[0, -0.4, 0]}>
      {/* ---------------- Upper Planter Pot (Tapered Diamond Relief) ---------------- */}
      <mesh position={[0, 0.65, 0]} material={material}>
        <cylinderGeometry args={[1.3, 1.1, 1.35, 16]} />
      </mesh>
      {/* Top Smooth Lip Collar */}
      <mesh position={[0, 1.35, 0]} material={material}>
        <cylinderGeometry args={[1.25, 1.25, 0.1, 32]} />
      </mesh>

      {/* ---------------- Lower Drip Saucer / Base ---------------- */}
      <mesh position={[0, -0.45, 0]} material={material}>
        <cylinderGeometry args={[1.08, 1.2, 0.85, 16]} />
      </mesh>

      {/* Potting Soil Bed */}
      <mesh position={[0, 1.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.18, 32]} />
        <meshStandardMaterial color="#1c140e" roughness={0.95} />
      </mesh>

      {/* ---------------- Lush Rosette Succulent Plant ---------------- */}
      <group position={[0, 1.32, 0]}>
        {/* Central Heart of Rosette */}
        <mesh position={[0, 0.35, 0]} material={succulentMat}>
          <coneGeometry args={[0.25, 0.4, 12]} />
        </mesh>

        {/* 24 Fleshy Succulent Leaves in Golden Spiral */}
        {Array.from({ length: 24 }).map((_, i) => {
          const goldenAngle = i * 2.39996; // Golden ratio in radians
          const radius = 0.25 + Math.sqrt(i) * 0.18;
          const x = Math.cos(goldenAngle) * radius;
          const z = Math.sin(goldenAngle) * radius;
          const y = 0.08 + (24 - i) * 0.012;
          const scale = 0.5 + Math.sqrt(i) * 0.18;

          return (
            <group
              key={`leaf-${i}`}
              position={[x, y, z]}
              rotation={[-0.45 + (i * 0.02), -goldenAngle, 0]}
              scale={[scale, scale * 0.6, scale * 1.2]}
            >
              {/* Leaf Body */}
              <mesh material={succulentMat}>
                <sphereGeometry args={[0.22, 12, 12]} />
              </mesh>
              {/* Rosy Pink Leaf Tip */}
              <mesh position={[0, 0, 0.22]} material={succulentTipMat}>
                <coneGeometry args={[0.08, 0.14, 8]} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

// =============================================================================
// Product Model Resolver
// =============================================================================
function ProductModelRenderer({
  product,
  material,
  wireframe,
}: {
  product: Product;
  material: THREE.Material;
  wireframe: boolean;
}) {
  const name = product.name.toLowerCase();
  const id = product.id;
  const img = (product.image || '').toLowerCase();

  // 1. Hexagonal Honeycomb Vase (Product #1)
  if (id === '1' || img.includes('vase') || name.includes('vase')) {
    return <HexVaseModel material={material} />;
  }

  // 2. Tech Organizer Elite (Product #2)
  if (id === '2' || img.includes('organizer') || name.includes('organizer') || name.includes('dock')) {
    return <TechOrganizerModel material={material} />;
  }

  // 3. Articulated Task Lamp (Product #3)
  if (id === '3' || img.includes('lamp') || name.includes('chassis') || name.includes('lamp')) {
    return <ArticulatedLampModel material={material} wireframe={wireframe} />;
  }

  // 4. Monolithic Heavy Bookends (Product #4)
  if (id === '4' || img.includes('bookends') || name.includes('bookend') || name.includes('monolithic')) {
    return <MonolithicBookendsModel material={material} wireframe={wireframe} />;
  }

  // 5. Faceted Architectural Wall Hook Rack (Product #5 - Exact user screenshot!)
  if (id === '5' || img.includes('wall-hooks') || name.includes('facade') || name.includes('hook') || name.includes('urban')) {
    return <FacetedWallHookModel material={material} wireframe={wireframe} />;
  }

  // 6. Modular Cable Management System (Product #6)
  if (id === '6' || img.includes('cable-management') || name.includes('coupling') || name.includes('cable')) {
    return <ModularCableClipModel material={material} wireframe={wireframe} />;
  }

  // 7. Articulated Smartphone Stand (Product #7)
  if (id === '7' || img.includes('phone-stand') || name.includes('gear') || name.includes('stand')) {
    return <ArticulatedPhoneStandModel material={material} wireframe={wireframe} />;
  }

  // 8. Parametric Fractal Planter with Succulent (Product #8)
  if (id === '8' || img.includes('plant-pot') || name.includes('planter') || name.includes('pot') || name.includes('fractal')) {
    return <ParametricPlanterModel material={material} wireframe={wireframe} />;
  }

  // 9. Modular Pen & Caliper Station (Product #9)
  if (id === '9' || img.includes('pen-holder') || name.includes('pen') || name.includes('caliper')) {
    return <PenCaliperStationModel material={material} wireframe={wireframe} />;
  }

  // Fallback to Faceted Wall Hook Rack
  return <FacetedWallHookModel material={material} wireframe={wireframe} />;
}

// =============================================================================
// Main Product3DViewer Component
// =============================================================================
interface Product3DViewerProps {
  product: Product;
  selectedMaterial: string;
}

export default function Product3DViewer({ product, selectedMaterial }: Product3DViewerProps) {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<any>(null);

  const material = useProductMaterial({
    materialType: selectedMaterial,
    wireframe,
  });

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-stone-100 to-stone-200 border border-black/10 shadow-sm transition-all duration-300">
      <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
              <span className="w-6 h-6 border-2 border-black/20 border-t-[#F7931E] rounded-full animate-spin" />
              <span className="font-mono-tech text-[10px] tracking-widest uppercase">Initializing 3D Stage...</span>
            </div>
          }
        >
            <Canvas
              camera={{ position: [0, 1.5, 5.8], fov: 44 }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
              }}
              dpr={[1, 1.75]}
              className="w-full h-full"
            >
              {/* Studio Lighting Setup */}
              <ambientLight intensity={1.2} />
              <directionalLight position={[6, 9, 5]} intensity={1.8} castShadow />
              <directionalLight position={[-6, 4, -4]} intensity={0.7} color="#cbd5e1" />
              <pointLight position={[0, -2, 3]} intensity={0.5} color="#F7931E" />
              <pointLight position={[0, 4, -2]} intensity={0.4} color="#38bdf8" />

              {/* Centered Floating Model */}
              <Float speed={autoRotate ? 1.4 : 0} rotationIntensity={autoRotate ? 0.05 : 0} floatIntensity={0.15}>
                <ProductModelRenderer
                  product={product}
                  material={material}
                  wireframe={wireframe}
                />
              </Float>

              {/* Realistic Contact Shadow on Floor */}
              <ContactShadows
                position={[0, -1.35, 0]}
                opacity={0.55}
                scale={9}
                blur={2.4}
                far={4}
                color="#0f172a"
              />

              {/* Orbit Controls with Damping and Safe Polar Angle */}
              <OrbitControls
                ref={controlsRef}
                enablePan={true}
                enableZoom={true}
                enableDamping={true}
                dampingFactor={0.06}
                rotateSpeed={0.8}
                autoRotate={autoRotate}
                autoRotateSpeed={1.5}
                minDistance={2.4}
                maxDistance={8.5}
                maxPolarAngle={Math.PI / 2 + 0.15}
              />
            </Canvas>
          </Suspense>

          {/* -----------------------------------------------------------------
              Bottom 3D Toolbar: Wireframe, Auto-Rotate, Reset Camera
          ----------------------------------------------------------------- */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-2 pointer-events-none">
            
            {/* Gesture Hint Pill */}
            <div className="pointer-events-auto hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[9px] font-mono-tech font-bold uppercase tracking-widest shadow-2xs">
              <Compass className="w-3 h-3 text-[#F7931E]" />
              <span>DRAG 360° &bull; SCROLL TO ZOOM</span>
            </div>

            {/* Quick Action Pills */}
            <div className="pointer-events-auto ml-auto flex items-center gap-1.5">
              
              {/* Wireframe / Shaded CAD Toggle */}
              <button
                onClick={() => setWireframe(!wireframe)}
                className={`h-8 px-3 rounded-full text-[10px] font-mono-tech font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all shadow-2xs active:scale-95 ${
                  wireframe
                    ? 'bg-[#F7931E] border-[#F7931E] text-white shadow-orange-500/20'
                    : 'bg-white/95 backdrop-blur-md border-black/10 text-slate-800 hover:border-black'
                }`}
                title="Toggle Wireframe CAD Mesh"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{wireframe ? 'SOLID' : 'CAD MESH'}</span>
              </button>

              {/* Auto-Rotate Toggle */}
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`h-8 px-3 rounded-full text-[10px] font-mono-tech font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all shadow-2xs active:scale-95 ${
                  autoRotate
                    ? 'bg-black text-white border-black'
                    : 'bg-white/95 backdrop-blur-md border-black/10 text-slate-800 hover:border-black'
                }`}
                title="Toggle 360° Auto Rotation"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                <span className="hidden xs:inline">{autoRotate ? 'AUTO' : 'MANUAL'}</span>
              </button>

              {/* Reset Camera Position */}
              <button
                onClick={handleResetCamera}
                className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-black/10 text-slate-800 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-2xs active:scale-95"
                title="Reset Camera Angle"
              >
                <Compass className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>
        </div>
    </div>
  );
}
