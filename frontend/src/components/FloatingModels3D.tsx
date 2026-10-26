import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Layers, RefreshCw, Eye } from 'lucide-react';

type ModelType = 'gyroid' | 'impeller' | 'polyhedron';

// ---------------------------------------------------------------------------
// 1. Model A: Neural Gyroid Lattice Metamaterial
// ---------------------------------------------------------------------------
function GyroidModel({ wireframe }: { wireframe: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
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
      {/* Outer Torus Knot Lattice */}
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.05, 0.32, 128, 32, 2, 3]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.15}
          metalness={0.1}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          wireframe={wireframe}
          transparent={wireframe}
          opacity={wireframe ? 0.7 : 1}
        />
      </mesh>

      {/* Inner Glowing Alignment Sphere */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color="#2563EB"
          emissive="#2563EB"
          emissiveIntensity={0.5}
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
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.85}
          roughness={0.25}
          wireframe={wireframe}
        />
      </mesh>

      {/* Center Bore Ring with Accent Glow */}
      <mesh position={[0, 0.46, 0]}>
        <ringGeometry args={[0.15, 0.35, 32]} />
        <meshStandardMaterial
          color="#F7931E"
          emissive="#F7931E"
          emissiveIntensity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Aerodynamic Impeller Blades */}
      {blades.map((b, i) => (
        <group key={i} rotation={[0, b.angle, 0]}>
          <mesh position={[0.75, 0, 0]} rotation={[0.4, 0.2, 0.1]}>
            <boxGeometry args={[0.7, 0.6, 0.06]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.2}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      ))}

      {/* Outer Shroud Protective Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.35, 0.06, 16, 64]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.7}
          roughness={0.3}
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
      {/* Outer Faceted Calibration Shell */}
      <mesh ref={outerRef}>
        <dodecahedronGeometry args={[1.2, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.1}
          metalness={0.2}
          transmission={0.4}
          opacity={0.85}
          transparent={true}
          wireframe={wireframe}
          clearcoat={1}
        />
      </mesh>

      {/* Inner Precision Octahedron Core */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#F7931E"
          emissive="#F7931E"
          emissiveIntensity={0.6}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. Ambient Orbiting Polymer Spheres
// ---------------------------------------------------------------------------
function AmbientSpheres() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  const spheres = useMemo(() => [
    { pos: [1.8, 0.8, -0.6] as [number, number, number], r: 0.14, color: '#2563EB' },
    { pos: [-1.7, -0.6, 0.7] as [number, number, number], r: 0.18, color: '#ffffff' },
    { pos: [0.8, -1.4, -1.2] as [number, number, number], r: 0.12, color: '#F7931E' },
    { pos: [-1.2, 1.2, 1.1] as [number, number, number], r: 0.15, color: '#ffffff' },
  ], []);

  return (
    <group ref={groupRef}>
      {spheres.map((s, idx) => (
        <mesh key={idx} position={s.pos}>
          <sphereGeometry args={[s.r, 32, 32]} />
          <meshPhysicalMaterial
            color={s.color}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
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
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.6} castShadow />
      <pointLight position={[-4, -2, -3]} color="#2563EB" intensity={1.2} />
      <pointLight position={[3, -3, 2]} color="#F7931E" intensity={0.8} />

      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
        {activeModel === 'gyroid' && <GyroidModel wireframe={wireframe} />}
        {activeModel === 'impeller' && <ImpellerModel wireframe={wireframe} />}
        {activeModel === 'polyhedron' && <PolyhedronModel wireframe={wireframe} />}
        <AmbientSpheres />
      </Float>

      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.35}
        scale={6}
        blur={2.4}
        far={3.5}
        color="#1e293b"
      />

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
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[520px] flex flex-col justify-between overflow-hidden select-none">
      
      {/* Background 3DP Large Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="font-heading text-8xl sm:text-9xl lg:text-[11rem] font-black text-white/50 select-none tracking-wider transition-all duration-700">
          3DP
        </span>
      </div>

      {/* Top HUD Controls: Model Switcher & Wireframe Toggle */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 p-5 sm:p-6 pb-0">
        {/* Model Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/80 backdrop-blur-md border border-black/10 shadow-2xs">
          {(['gyroid', 'impeller', 'polyhedron'] as ModelType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveModel(type)}
              className={`px-3 py-1 rounded-full text-[9px] font-mono-tech font-bold uppercase tracking-wider transition-all active:scale-95 ${
                activeModel === type
                  ? 'bg-black text-white shadow-2xs'
                  : 'text-slate-600 hover:text-black hover:bg-black/5'
              }`}
            >
              {type === 'gyroid' ? 'GYROID' : type === 'impeller' ? 'IMPELLER' : 'CRYSTAL'}
            </button>
          ))}
        </div>

        {/* Wireframe / Shader Toggle */}
        <button
          onClick={() => setWireframe(!wireframe)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono-tech font-bold uppercase tracking-wider transition-all border active:scale-95 backdrop-blur-md ${
            wireframe
              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-2xs'
              : 'bg-white/80 text-black border-black/10 hover:border-black'
          }`}
          title="Toggle Wireframe Mesh"
        >
          <Layers className="w-3 h-3" />
          <span>{wireframe ? 'WIREFRAME' : 'SURFACE'}</span>
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
      <div className="relative z-10 p-5 sm:p-6 pt-0 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-2 bg-white/40 backdrop-blur-sm rounded-b-[36px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
          <span className="font-mono-tech text-[10px] font-bold uppercase tracking-widest text-slate-700">
            {modelMetadata[activeModel].name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono-tech text-[9px] text-slate-400 uppercase tracking-wider">
            DRAG TO ROTATE 360°
          </span>
          <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em] text-[#2563EB] bg-blue-50/80 px-2.5 py-0.5 rounded-full border border-blue-200">
            SATURN SYSTEMS V8.2
          </span>
        </div>
      </div>

    </div>
  );
}
