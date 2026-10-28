import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Layers } from 'lucide-react';

type ModelType = 'gyroid' | 'impeller' | 'polyhedron';

// ---------------------------------------------------------------------------
// 1. Model A: Neural Gyroid Lattice Metamaterial (Stylized Brutalist Cel)
// ---------------------------------------------------------------------------
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
        <meshToonMaterial
          color="#FF5A1F"
          wireframe={wireframe}
        />
      </mesh>

      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshToonMaterial
          color="#FFE14D"
          wireframe={true}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 2. Model B: Aerospace Helical Impeller / Turbine Rotor
// ---------------------------------------------------------------------------
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
        <meshToonMaterial
          color="#8EA2FF"
          wireframe={wireframe}
        />
      </mesh>

      {/* Center Bore Ring */}
      <mesh position={[0, 0.46, 0]}>
        <ringGeometry args={[0.15, 0.35, 32]} />
        <meshBasicMaterial
          color="#0B0B0B"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Aerodynamic Impeller Blades */}
      {blades.map((b, i) => (
        <group key={i} rotation={[0, b.angle, 0]}>
          <mesh position={[0.75, 0, 0]} rotation={[0.4, 0.2, 0.1]}>
            <boxGeometry args={[0.7, 0.6, 0.08]} />
            <meshToonMaterial
              color="#FFE14D"
              wireframe={wireframe}
            />
          </mesh>
        </group>
      ))}

      {/* Outer Shroud Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.35, 0.06, 16, 64]} />
        <meshToonMaterial
          color="#0B0B0B"
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. Model C: Precision Calibration Polyhedron
// ---------------------------------------------------------------------------
function PolyhedronModel({ wireframe }: { wireframe: boolean }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.x += delta * 0.35;
      outerRef.current.rotation.y += delta * 0.5;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.5;
      innerRef.current.rotation.z += delta * 0.4;
    }
  });

  return (
    <group>
      <mesh ref={outerRef}>
        <dodecahedronGeometry args={[1.2, 0]} />
        <meshToonMaterial
          color="#7CF2C1"
          wireframe={wireframe}
        />
      </mesh>

      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshToonMaterial
          color="#FF5A1F"
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. Ambient Orbiting Geometric Markers
// ---------------------------------------------------------------------------
function AmbientMarkers() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  const markers = useMemo(() => [
    { pos: [1.8, 0.8, -0.6] as [number, number, number], r: 0.14, color: '#FF5A1F' },
    { pos: [-1.7, -0.6, 0.7] as [number, number, number], r: 0.18, color: '#8EA2FF' },
    { pos: [0.8, -1.4, -1.2] as [number, number, number], r: 0.12, color: '#FFE14D' },
    { pos: [-1.2, 1.2, 1.1] as [number, number, number], r: 0.15, color: '#7CF2C1' },
  ], []);

  return (
    <group ref={groupRef}>
      {markers.map((s, idx) => (
        <mesh key={idx} position={s.pos}>
          <boxGeometry args={[s.r * 1.5, s.r * 1.5, s.r * 1.5]} />
          <meshToonMaterial color={s.color} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 5. Scene Lighting & Floating Rig
// ---------------------------------------------------------------------------
function FloatingStage({ activeModel, wireframe }: { activeModel: ModelType; wireframe: boolean }) {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 8, 5]} intensity={2.0} />
      <directionalLight position={[-4, -2, -3]} intensity={0.8} />

      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
        {activeModel === 'gyroid' && <GyroidModel wireframe={wireframe} />}
        {activeModel === 'impeller' && <ImpellerModel wireframe={wireframe} />}
        {activeModel === 'polyhedron' && <PolyhedronModel wireframe={wireframe} />}
        <AmbientMarkers />
      </Float>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={1.5}
        maxPolarAngle={Math.PI / 1.7}
        minPolarAngle={Math.PI / 3.2}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// 6. Main Exported Interactive 3D Component
// ---------------------------------------------------------------------------
export default function FloatingModels3D() {
  const [activeModel, setActiveModel] = useState<ModelType>('gyroid');
  const [wireframe, setWireframe] = useState<boolean>(false);

  const modelMetadata = {
    gyroid: {
      name: 'NEURAL GYROID METAMATERIAL',
      material: 'SLA OPTIC CERAMIC',
      tolerance: '±0.01 MM',
      density: '99.9%',
    },
    impeller: {
      name: 'AEROSPACE HELICAL ROTOR',
      material: 'CARBON-X PA12',
      tolerance: '±0.03 MM',
      density: '100% SOLID',
    },
    polyhedron: {
      name: 'CALIBRATION POLYHEDRON',
      material: 'OPTICAL CLEAR RESIN',
      tolerance: '±0.01 MM',
      density: 'SOLID CORE',
    },
  };

  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[520px] flex flex-col justify-between overflow-hidden select-none bg-paper pattern-blueprint">
      
      {/* Background Giant Brutalist Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="font-display text-8xl sm:text-9xl lg:text-[11rem] font-black text-ink/5 select-none tracking-wider">
          3DP
        </span>
      </div>

      {/* Top Controls Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6 pb-0">
        {/* Model Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border-2 border-ink shadow-brutal-sm">
          {(['gyroid', 'impeller', 'polyhedron'] as ModelType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveModel(type)}
              className={`px-3 py-1 text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeModel === type
                  ? 'bg-saturn-orange text-white shadow-brutal-sm'
                  : 'text-ink hover:bg-lemon'
              }`}
            >
              {type === 'gyroid' ? 'GYROID' : type === 'impeller' ? 'IMPELLER' : 'CRYSTAL'}
            </button>
          ))}
        </div>

        {/* Wireframe / Shader Toggle */}
        <button
          onClick={() => setWireframe(!wireframe)}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-ink text-[10px] font-mono font-black uppercase tracking-wider shadow-brutal-sm transition-all cursor-pointer ${
            wireframe
              ? 'bg-lemon text-ink'
              : 'bg-white text-ink hover:bg-saturn-orange hover:text-white'
          }`}
          title="Toggle Wireframe Mesh"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{wireframe ? 'WIREFRAME' : 'CEL SURFACE'}</span>
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

      {/* Bottom HUD: Live Telemetry Readout & System Badge */}
      <div className="relative z-10 p-4 sm:p-5 border-t-3 border-ink flex flex-col sm:flex-row items-center justify-between gap-2 bg-ink text-paper">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-saturn-orange animate-pulse" />
          <span className="font-mono text-[11px] font-black uppercase tracking-widest text-paper">
            {modelMetadata[activeModel].name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-paper/70 uppercase">
            DRAG 360° //
          </span>
          <span className="font-mono text-[10px] font-black uppercase tracking-wider text-ink bg-lemon px-2.5 py-0.5 border border-ink shadow-brutal-sm">
            SATURN SYSTEM V8.2
          </span>
        </div>
      </div>

    </div>
  );
}
