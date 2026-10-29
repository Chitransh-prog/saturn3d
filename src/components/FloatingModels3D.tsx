import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Layers } from 'lucide-react';

type ModelType = 'gyroid' | 'impeller' | 'polyhedron';

// 1. Model A: Neural Gyroid Lattice Metamaterial (PBR Engineering Polymer)
function GyroidModel({ wireframe }: { wireframe: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.6;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.3;
      innerRef.current.rotation.y -= delta * 0.5;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.05, 0.32, 128, 32, 2, 3]} />
        <meshStandardMaterial
          color="#FF5A1F"
          wireframe={wireframe}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color="#E5E7EB"
          wireframe={true}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

// 2. Model B: Aerospace Helical Impeller / Turbine Rotor
function ImpellerModel({ wireframe }: { wireframe: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const bladesCount = 8;

  const blades = useMemo(() => {
    return Array.from({ length: bladesCount }, (_, i) => {
      const angle = (i / bladesCount) * Math.PI * 2;
      return { angle };
    });
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 1.2;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.2 + 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Center Hub */}
      <mesh>
        <cylinderGeometry args={[0.45, 0.55, 0.9, 32]} />
        <meshStandardMaterial
          color="#374151"
          wireframe={wireframe}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>

      {/* Center Bore Ring */}
      <mesh position={[0, 0.46, 0]}>
        <ringGeometry args={[0.15, 0.35, 32]} />
        <meshBasicMaterial
          color="#111827"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Aerodynamic Impeller Blades */}
      {blades.map((b, i) => (
        <group key={i} rotation={[0, b.angle, 0]}>
          <mesh position={[0.75, 0, 0]} rotation={[0.4, 0.2, 0.1]}>
            <boxGeometry args={[0.7, 0.6, 0.08]} />
            <meshStandardMaterial
              color="#FF5A1F"
              wireframe={wireframe}
              roughness={0.25}
              metalness={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 3. Model C: Optic Precision Calibration Polyhedron
function PolyhedronModel({ wireframe }: { wireframe: boolean }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const middleRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.x += delta * 0.25;
      outerRef.current.rotation.z += delta * 0.35;
    }
    if (middleRef.current) {
      middleRef.current.rotation.y -= delta * 0.45;
      middleRef.current.rotation.x += delta * 0.2;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <group>
      {/* Outer Lattice */}
      <mesh ref={outerRef}>
        <dodecahedronGeometry args={[1.35, 0]} />
        <meshStandardMaterial
          color="#9CA3AF"
          wireframe={wireframe}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* Mid Shell */}
      <mesh ref={middleRef}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#FF5A1F"
          wireframe={wireframe}
          roughness={0.3}
        />
      </mesh>

      {/* High-Density Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#1F2937"
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}

// 4. Background Orbiting Dust Particles
function OrbitingParticles() {
  const particles = useMemo(() => {
    return [
      { pos: [-1.8, 1.2, -0.5] as [number, number, number], r: 0.08, color: '#FF5A1F' },
      { pos: [1.9, 0.8, -1.0] as [number, number, number], r: 0.1, color: '#9CA3AF' },
      { pos: [-1.2, -1.5, 0.8] as [number, number, number], r: 0.09, color: '#374151' },
      { pos: [0.8, -1.4, -1.2] as [number, number, number], r: 0.12, color: '#FF5A1F' },
    ];
  }, []);

  return (
    <group>
      {particles.map((p, i) => (
        <Float key={i} speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
          <mesh position={p.pos}>
            <sphereGeometry args={[p.r, 16, 16]} />
            <meshStandardMaterial color={p.color} roughness={0.4} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// 5. Stage Lighting & Scene Composition
function FloatingStage({
  activeModel,
  wireframe,
}: {
  activeModel: ModelType;
  wireframe: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#FFFFFF" />
      <directionalLight position={[-5, -2, -5]} intensity={0.6} color="#FF5A1F" />

      <OrbitingParticles />

      <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
        {activeModel === 'gyroid' && <GyroidModel wireframe={wireframe} />}
        {activeModel === 'impeller' && <ImpellerModel wireframe={wireframe} />}
        {activeModel === 'polyhedron' && <PolyhedronModel wireframe={wireframe} />}
      </Float>

      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.3}
        scale={6}
        blur={1.5}
        far={3}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(Math.PI / 4) * 3}
      />
    </>
  );
}

// Main Interactive Floating Stage Container
export default function FloatingModels3D() {
  const [activeModel, setActiveModel] = useState<ModelType>('gyroid');
  const [wireframe, setWireframe] = useState<boolean>(false);

  const modelMetadata = {
    gyroid: {
      name: 'Neural Gyroid Metamaterial',
      material: 'SLA Optic Ceramic',
      tolerance: '±0.01 mm',
      density: '99.9%',
    },
    impeller: {
      name: 'Aerospace Helical Rotor',
      material: 'Carbon-X PA12',
      tolerance: '±0.03 mm',
      density: '100% Solid',
    },
    polyhedron: {
      name: 'Calibration Polyhedron',
      material: 'Optical Clear Resin',
      tolerance: '±0.01 mm',
      density: 'Solid Core',
    },
  };

  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[520px] flex flex-col justify-between overflow-hidden select-none bg-graphite rounded-2xl border hairline-dark">
      
      {/* Top Controls Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6 pb-0">
        {/* Model Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-dark border hairline-dark rounded-xl backdrop-blur-md">
          {(['gyroid', 'impeller', 'polyhedron'] as ModelType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveModel(type)}
              className={`px-3 py-1 text-[11px] font-mono font-medium uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeModel === type
                  ? 'bg-saturn-orange text-white shadow-precision-xs'
                  : 'text-muted-dark hover:text-white'
              }`}
            >
              {type === 'gyroid' ? 'Gyroid' : type === 'impeller' ? 'Impeller' : 'Crystal'}
            </button>
          ))}
        </div>

        {/* Wireframe / Shader Toggle */}
        <button
          onClick={() => setWireframe(!wireframe)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border hairline-dark text-[11px] font-mono font-medium uppercase tracking-wider transition-all cursor-pointer ${
            wireframe
              ? 'bg-white text-graphite'
              : 'bg-surface-dark text-muted-dark hover:text-white'
          }`}
          title="Toggle Wireframe Mesh"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{wireframe ? 'Wireframe' : 'PBR Surface'}</span>
        </button>
      </div>

      {/* 3D WebGL Canvas Layer */}
      <div className="relative z-10 w-full h-[320px] sm:h-[360px] cursor-grab active:cursor-grabbing">
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <FloatingStage activeModel={activeModel} wireframe={wireframe} />
        </Canvas>
      </div>

      {/* Bottom HUD: Live Telemetry Readout */}
      <div className="relative z-10 p-4 sm:p-5 border-t hairline-dark flex flex-col sm:flex-row items-center justify-between gap-2 bg-surface-dark/80 backdrop-blur-sm text-studio-light">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-saturn-orange animate-pulse" />
          <span className="font-mono text-xs font-medium text-white">
            {modelMetadata[activeModel].name}
          </span>
          <span className="font-mono text-[10px] text-muted-dark">
            ({modelMetadata[activeModel].material})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-muted uppercase">
            Drag to inspect 360°
          </span>
          <span className="font-mono text-[10px] text-saturn-orange bg-saturn-orange/10 px-2.5 py-0.5 rounded-full border border-saturn-orange/20">
            Tolerance {modelMetadata[activeModel].tolerance}
          </span>
        </div>
      </div>

    </div>
  );
}
