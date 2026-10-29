const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/components/Product3DViewer.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const premierModelsCode = `
// =============================================================================
// PREMIER INDUSTRIAL 3D MODELS
// =============================================================================

// 1. Micro-Fluidic Centrifugal Impeller Model
function Impeller3DModel({ material, wireframe }: { material: THREE.Material; wireframe: boolean }) {
  return (
    <group position={[0, -0.2, 0]}>
      <mesh material={material} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.6, 0.22, 48]} />
      </mesh>
      <mesh position={[0, 0.45, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.5, 0.95, 0.7, 36]} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.85, 24]} />
        <meshStandardMaterial color="#0B0D10" metalness={0.9} roughness={0.15} wireframe={wireframe} />
      </mesh>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={i} rotation={[0, rad, 0]} position={[0, 0.4, 0]}>
            <mesh
              material={material}
              position={[0.78, 0, 0]}
              rotation={[0.3, 0.45, 0.1]}
              castShadow
            >
              <boxGeometry args={[0.65, 0.6, 0.08]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// 2. UAS Carbon-X Drone Arm Spar Model
function DroneSpar3DModel({ material, wireframe }: { material: THREE.Material; wireframe: boolean }) {
  return (
    <group position={[0, 0, 0]} rotation={[0.2, 0.4, 0]}>
      <mesh material={material} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.24, 0.45]} />
      </mesh>
      <mesh position={[1.55, 0, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.28, 32]} />
      </mesh>
      <mesh position={[1.55, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.32, 20]} />
        <meshStandardMaterial color="#0B0D10" metalness={0.9} roughness={0.15} wireframe={wireframe} />
      </mesh>
      <mesh position={[-1.55, 0, 0]} material={material} castShadow>
        <boxGeometry args={[0.45, 0.38, 0.55]} />
      </mesh>
      {[-0.8, -0.2, 0.4, 1.0].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
          <meshStandardMaterial color="#0B0D10" wireframe={wireframe} />
        </mesh>
      ))}
    </group>
  );
}

// 3. CoreXY Structural Enclosure Chassis Model
function IndustrialChassis3DModel({ material, wireframe }: { material: THREE.Material; wireframe: boolean }) {
  return (
    <group position={[0, -0.3, 0]} rotation={[0.35, -0.4, 0]}>
      <mesh material={material} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.85, 1.8]} />
      </mesh>
      <mesh position={[0, 0.45, 0]} material={material}>
        <boxGeometry args={[2.38, 0.1, 1.68]} />
      </mesh>
      {[-0.6, -0.3, 0, 0.3, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0.1, 0.91]}>
          <boxGeometry args={[0.18, 0.04, 0.03]} />
          <meshStandardMaterial color="#0B0D10" metalness={0.8} roughness={0.2} wireframe={wireframe} />
        </mesh>
      ))}
      {[
        [-1.0, -0.7],
        [1.0, -0.7],
        [-1.0, 0.7],
        [1.0, 0.7],
      ].map(([sx, sz], i) => (
        <mesh key={i} position={[sx, 0.35, sz]} material={material}>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
        </mesh>
      ))}
    </group>
  );
}

// 4. High-Torque Planetary Reduction Gearbox Model
function PlanetaryGearbox3DModel({ material, wireframe }: { material: THREE.Material; wireframe: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.4, 0, 0]}>
      <mesh material={material} castShadow receiveShadow>
        <torusGeometry args={[1.5, 0.22, 16, 48]} />
      </mesh>
      <mesh material={material} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.35, 24]} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.4, 16]} />
        <meshStandardMaterial color="#0B0D10" metalness={0.9} roughness={0.1} wireframe={wireframe} />
      </mesh>
      {[0, 120, 240].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const px = Math.cos(rad) * 0.95;
        const pz = Math.sin(rad) * 0.95;
        return (
          <group key={i} position={[px, 0, pz]}>
            <mesh material={material} castShadow>
              <cylinderGeometry args={[0.38, 0.38, 0.32, 20]} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.1, 0.1, 0.38, 12]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.15} wireframe={wireframe} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// 5. Robotic End-Effector Gripper Finger Model
function RoboticGripper3DModel({ material, wireframe }: { material: THREE.Material; wireframe: boolean }) {
  return (
    <group position={[0, -0.4, 0]} rotation={[0.2, 0.3, 0]}>
      <mesh material={material} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.6, 0.8]} />
      </mesh>
      <group position={[-0.4, 0.7, 0]} rotation={[0, 0, -0.3]}>
        <mesh material={material} position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.2, 1.2, 0.4]} />
        </mesh>
        <mesh position={[0.12, 0.6, 0]}>
          <boxGeometry args={[0.06, 0.9, 0.36]} />
          <meshStandardMaterial color="#FF5A1F" roughness={0.8} metalness={0.1} wireframe={wireframe} />
        </mesh>
      </group>
      <group position={[0.4, 0.7, 0]} rotation={[0, 0, 0.3]}>
        <mesh material={material} position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.2, 1.2, 0.4]} />
        </mesh>
        <mesh position={[-0.12, 0.6, 0]}>
          <boxGeometry args={[0.06, 0.9, 0.36]} />
          <meshStandardMaterial color="#FF5A1F" roughness={0.8} metalness={0.1} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

// 6. Biomedical Mandibular Surgical Guide Model
function SurgicalGuide3DModel({ material, wireframe }: { material: THREE.Material; wireframe: boolean }) {
  return (
    <group position={[0, 0, 0]} rotation={[0.5, 0.3, 0]}>
      <mesh material={material} castShadow receiveShadow>
        <torusGeometry args={[1.2, 0.22, 16, 36, Math.PI * 1.15]} />
      </mesh>
      {[-0.8, 0, 0.8].map((x, i) => (
        <group key={i} position={[x, 0.25, 0.65 - Math.abs(x) * 0.3]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.15, 0.4, 20]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.96} roughness={0.1} wireframe={wireframe} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.42, 16]} />
            <meshBasicMaterial color="#0B0D10" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

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

  // Premier Engineering Products
  if (id === '1' || img.includes('impeller') || name.includes('impeller') || name.includes('turbine')) {
    return <Impeller3DModel material={material} wireframe={wireframe} />;
  }

  if (id === '2' || img.includes('drone') || name.includes('drone') || name.includes('spar')) {
    return <DroneSpar3DModel material={material} wireframe={wireframe} />;
  }

  if (id === '3' || img.includes('chassis') || name.includes('chassis') || name.includes('enclosure')) {
    return <IndustrialChassis3DModel material={material} wireframe={wireframe} />;
  }

  if (id === '4' || img.includes('gear') || name.includes('gear') || name.includes('planetary')) {
    return <PlanetaryGearbox3DModel material={material} wireframe={wireframe} />;
  }

  if (id === '5' || img.includes('gripper') || name.includes('gripper') || name.includes('effector')) {
    return <RoboticGripper3DModel material={material} wireframe={wireframe} />;
  }

  if (id === '6' || img.includes('biomedical') || name.includes('surgical') || name.includes('guide')) {
    return <SurgicalGuide3DModel material={material} wireframe={wireframe} />;
  }

  // Fallbacks
  if (id === '7' || img.includes('cable-management') || name.includes('cable')) {
    return <ModularCableClipModel material={material} wireframe={wireframe} />;
  }

  if (id === '8' || img.includes('plant-pot') || name.includes('planter') || name.includes('pot')) {
    return <ParametricPlanterModel material={material} wireframe={wireframe} />;
  }

  if (id === '9' || img.includes('pen-holder') || name.includes('pen') || name.includes('caliper')) {
    return <PenCaliperStationModel material={material} wireframe={wireframe} />;
  }

  return <Impeller3DModel material={material} wireframe={wireframe} />;
}
`;

// Replace from 'function ProductModelRenderer' to the end of that function
const startIdx = content.indexOf('function ProductModelRenderer');
const endMarker = 'export default function Product3DViewer';
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.slice(0, startIdx) + premierModelsCode + '\n\n' + content.slice(endIdx);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated Product3DViewer.tsx with premier models!');
} else {
  console.error('Could not find markers:', { startIdx, endIdx });
}
