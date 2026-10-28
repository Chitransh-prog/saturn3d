import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowRight, Check, Flame, ShieldAlert, Sparkles, Thermometer, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '@/components/SectionHeader';
import MaterialChip from '@/components/MaterialChip';

interface MaterialSpec {
  id: string;
  name: string;
  type: string;
  price: string;
  colorHex: string;
  threeColor: string;
  opacity: number;
  transparent: boolean;
  roughness: number;
  specs: {
    tensile: string;
    temp: string;
    density: string;
    surface: string;
    application: string;
  };
}

const materials: MaterialSpec[] = [
  {
    id: 'pla',
    name: 'PLA MATTE',
    type: 'Standard Rapid Bio-Polymer',
    price: '₹3.50 / g',
    colorHex: '#FF5A1F',
    threeColor: '#FF5A1F',
    opacity: 1.0,
    transparent: false,
    roughness: 0.4,
    specs: {
      tensile: '55 MPa (Rigid)',
      temp: '65°C HDT',
      density: '1.24 g/cm³',
      surface: 'Matte Layered 0.1mm',
      application: 'Visual prototypes, architectural scale facades, consumer testing',
    },
  },
  {
    id: 'petg',
    name: 'PETG INDUSTRIAL',
    type: 'Chemical & Impact Resistant',
    price: '₹5.00 / g',
    colorHex: '#8EA2FF',
    threeColor: '#8EA2FF',
    opacity: 0.85,
    transparent: true,
    roughness: 0.2,
    specs: {
      tensile: '50 MPa (Semi-Ductile)',
      temp: '80°C HDT',
      density: '1.27 g/cm³',
      surface: 'Glossy Translucent',
      application: 'Water-tight enclosures, outdoor brackets, snap-fit snap latches',
    },
  },
  {
    id: 'abs',
    name: 'ABS-ESD FLAME RETARDANT',
    type: 'Electrostatic Discharge Safe',
    price: '₹8.00 / g',
    colorHex: '#222222',
    threeColor: '#1A1A1A',
    opacity: 1.0,
    transparent: false,
    roughness: 0.7,
    specs: {
      tensile: '45 MPa (High Impact)',
      temp: '100°C HDT',
      density: '1.08 g/cm³',
      surface: 'Textured Industrial',
      application: 'PCB test fixtures, electronics housings, automotive under-hood clips',
    },
  },
  {
    id: 'carbon',
    name: 'CARBON-X PA12',
    type: 'Chopped Carbon-Fiber Composite',
    price: '₹25.00 / g',
    colorHex: '#0B0B0B',
    threeColor: '#0B0B0B',
    opacity: 1.0,
    transparent: false,
    roughness: 0.8,
    specs: {
      tensile: '115 MPa (Metal Yield)',
      temp: '150°C HDT (High Temp)',
      density: '1.14 g/cm³',
      surface: 'Micro-Carbon Stippled',
      application: 'Drone airframe arms, avionics mounts, robotics structural brackets',
    },
  },
  {
    id: 'resin',
    name: 'ULTRA-SLA RESIN',
    type: 'Micron Engineering Photopolymer',
    price: '₹18.00 / ml',
    colorHex: '#FFE14D',
    threeColor: '#FFE14D',
    opacity: 0.92,
    transparent: true,
    roughness: 0.05,
    specs: {
      tensile: '68 MPa (High Modulus)',
      temp: '85°C HDT',
      density: '1.18 g/cm³',
      surface: 'Injection Mold Mirror Finish',
      application: 'Microfluidic channels, dental study models, master casting molds',
    },
  },
];

// ---------------------------------------------------------------------------
// 3D Test Swatch Geometry with Dynamic Cel Shading
// ---------------------------------------------------------------------------
function MaterialPartMesh({ activeMat }: { activeMat: MaterialSpec }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.x = 0.2 + Math.sin(state.clock.elapsedTime * 0.6) * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]} scale={1.3}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[0.9, 0.32, 100, 16, 2, 3]} />
        <meshToonMaterial
          color={activeMat.threeColor}
          transparent={activeMat.transparent}
          opacity={activeMat.opacity}
        />
        <Outlines thickness={3} color="#0B0B0B" />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function MaterialsViewer3D() {
  const [selectedId, setSelectedId] = useState('carbon');
  const navigate = useNavigate();

  const activeMaterial = materials.find((m) => m.id === selectedId) || materials[0];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-white border-b-3 border-ink relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          number="03"
          tag="MATERIALS LABORATORY"
          title="TACTILE POLYMERS & COMPOSITES"
          highlightWord="COMPOSITES"
          subtitle="Explore the exact thermal, mechanical, and surface properties of our certified polymer catalogue. Tap any material to examine its structural performance."
          badgeText="ISO 9001 VERIFIED"
          badgeColor="#7CF2C1"
        />

        {/* Interactive Grid: Chips List + 3D Viewer + Spec Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Material Chips (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#777] block">
                SELECT ENGINEERING POLYMER:
              </span>
              {materials.map((mat) => (
                <MaterialChip
                  key={mat.id}
                  id={mat.id}
                  name={mat.name}
                  type={mat.type}
                  price={mat.price}
                  colorHex={mat.colorHex}
                  isActive={mat.id === selectedId}
                  onClick={() => setSelectedId(mat.id)}
                />
              ))}
            </div>

            <div className="card-slab bg-[#FAF7F2] p-4 text-xs font-mono space-y-2 border-2 border-ink">
              <div className="flex items-center gap-2 font-bold text-[#FF5A1F]">
                <Flame className="w-4 h-4" />
                <span>THERMAL VERIFICATION</span>
              </div>
              <p className="text-[#333] leading-relaxed">
                All materials are desiccated in sealed dry-boxes prior to extrusion, maintaining &lt;10% relative humidity for maximum layer adhesion.
              </p>
            </div>
          </div>

          {/* Center Column: 3D Cel-Shaded Part Preview (4 cols) */}
          <div className="lg:col-span-4 card-slab bg-[#FAF7F2] p-4 border-3 border-ink shadow-brutal flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b-2 border-ink font-mono text-xs font-bold">
              <span className="text-[#FF5A1F]">ACTIVE: {activeMaterial.name}</span>
              <span className="bg-white px-2 py-0.5 border border-ink text-[10px]">360&deg; ROTATE</span>
            </div>

            {/* 3D Canvas */}
            <div className="w-full h-72 sm:h-80 my-2">
              <Canvas
                camera={{ position: [0, 0, 3.8], fov: 45 }}
                dpr={[1, 1.75]}
              >
                <ambientLight intensity={0.9} />
                <directionalLight position={[4, 5, 3]} intensity={1.6} />
                <directionalLight position={[-3, -2, -2]} intensity={0.5} />
                <MaterialPartMesh activeMat={activeMaterial} />
              </Canvas>
            </div>

            <div className="pt-2 border-t-2 border-ink flex items-center justify-between text-xs font-mono">
              <span className="font-bold">{activeMaterial.price}</span>
              <span className="bg-[#FFE14D] px-2 py-0.5 border border-ink font-bold text-[10px]">
                IN-STOCK &bull; READY
              </span>
            </div>
          </div>

          {/* Right Column: Mono Technical Readout (4 cols) */}
          <div className="lg:col-span-4 card-slab bg-white p-6 border-3 border-ink shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-ink mb-4">
                <span className="section-tag text-xs">SPECIFICATION SHEET</span>
                <span className="text-xs font-mono font-bold text-[#FF5A1F]">{activeMaterial.name}</span>
              </div>

              {/* Data Table */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between p-2 bg-[#FAF7F2] border border-ink">
                  <span className="font-bold text-[#555]">TENSILE YIELD:</span>
                  <span className="font-black text-[#0B0B0B]">{activeMaterial.specs.tensile}</span>
                </div>

                <div className="flex justify-between p-2 bg-[#FAF7F2] border border-ink">
                  <span className="font-bold text-[#555]">HEAT DEFLECTION:</span>
                  <span className="font-black text-[#FF5A1F]">{activeMaterial.specs.temp}</span>
                </div>

                <div className="flex justify-between p-2 bg-[#FAF7F2] border border-ink">
                  <span className="font-bold text-[#555]">POLYMER DENSITY:</span>
                  <span className="font-black text-[#0B0B0B]">{activeMaterial.specs.density}</span>
                </div>

                <div className="flex justify-between p-2 bg-[#FAF7F2] border border-ink">
                  <span className="font-bold text-[#555]">SURFACE FINISH:</span>
                  <span className="font-black text-[#0B0B0B]">{activeMaterial.specs.surface}</span>
                </div>

                <div className="p-3 bg-white border-2 border-ink mt-2">
                  <span className="font-bold text-[#555] block mb-1">IDEAL APPLICATIONS:</span>
                  <p className="font-body text-xs text-[#222] leading-relaxed">
                    {activeMaterial.specs.application}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-ink mt-6 space-y-2">
              <button
                onClick={() => navigate('/custom-lab')}
                className="btn-brutal btn-brutal-orange w-full py-3 text-xs flex items-center justify-center gap-2"
              >
                <span>UPLOAD BLUEPRINT FOR {activeMaterial.name}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
