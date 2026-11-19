const fs = require('fs');
const path = require('path');

const filePath = path.resolve('saturn-3d-main/src/components/Product3DViewer.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Normalize line breaks to \n
code = code.replace(/\r\n/g, '\n');

// 2. Update wireframe color
code = code.replace(
  /color:\s*'#F7931E',\s*wireframe:\s*true,\s*emissive:\s*'#F7931E',\s*emissiveIntensity:\s*0\.4/,
  "color: '#412f91',\n        wireframe: true,\n        emissive: '#412f91',\n        emissiveIntensity: 0.5"
);

// 3. Add CARBON material in useProductMaterial
if (!code.includes("case 'CARBON':")) {
  const carbonCase = `      case 'CARBON':
        // Carbon-fiber reinforced PA12, stealth matte micro-texture
        return new THREE.MeshPhysicalMaterial({
          color: '#1a1b1e',
          roughness: 0.72,
          metalness: 0.15,
          clearcoat: 0.2,
          clearcoatRoughness: 0.5,
        });

      case 'ABS':`;
  code = code.replace("      case 'ABS':", carbonCase);
}

// 4. Update orange accents
code = code.replace(/<meshBasicMaterial color="#F7931E" \/>/g, '<meshBasicMaterial color="#412f91" />');
code = code.replace(
  /color:\s*'#F7931E',\s*roughness:\s*0\.3,\s*metalness:\s*0\.2/g,
  "color: '#412f91',\n        roughness: 0.3,\n        metalness: 0.2"
);
code = code.replace(
  /<pointLight position={\[0, -2, 3\]} intensity={0\.5} color="#F7931E" \/>/g,
  '<pointLight position={[0, -2, 3]} intensity={0.5} color="#412f91" />'
);

// 5. Replace ProductModelRenderer with 14-product mapping
const startIdx = code.indexOf('function ProductModelRenderer(');
const endIdx = code.indexOf('export interface Product3DViewerProps {');

if (startIdx !== -1 && endIdx !== -1) {
  const newRenderer = `function ProductModelRenderer({
  product,
  material,
  wireframe,
}: {
  product: Product;
  material: THREE.Material;
  wireframe: boolean;
}) {
  const name = (product.name || '').toLowerCase();
  const slug = (product.slug || '').toLowerCase();
  const id = String(product.id || '');
  const img = (product.image || '').toLowerCase();

  // 1. Hexagonal Carbon Vase / Geometric Vase (Interior)
  if (img.includes('vase') || name.includes('vase') || slug.includes('vase') || id === '1') {
    return <HexVaseModel material={material} />;
  }

  // 2. Tech Organizer Elite (Corporate / Bulk Gifting)
  if (img.includes('organizer') || name.includes('organizer') || slug.includes('organizer') || id === '2') {
    return <TechOrganizerModel material={material} />;
  }

  // 3. Articulated High-Torque Desk Lamp (Drone & Robotics)
  if (img.includes('lamp') || name.includes('lamp') || slug.includes('lamp') || id === '3') {
    return <ArticulatedLampModel material={material} wireframe={wireframe} />;
  }

  // 4. Monolithic Sculptural Bookends
  if (img.includes('bookend') || name.includes('bookend') || slug.includes('bookend') || id === '4') {
    return <MonolithicBookendsModel material={material} wireframe={wireframe} />;
  }

  // 5. Faceted Architectural Wall Hooks
  if (img.includes('wall-hook') || img.includes('hook') || name.includes('hook') || slug.includes('hook') || id === '5') {
    return <FacetedWallHookModel material={material} wireframe={wireframe} />;
  }

  // 6. Modular Interlocking Cable Track
  if (img.includes('cable') || name.includes('cable') || slug.includes('cable') || id === '6') {
    return <ModularCableClipModel material={material} wireframe={wireframe} />;
  }

  // 7. Geometric Self-Watering Planter / Plant Pot
  if (img.includes('plant') || img.includes('pot') || name.includes('planter') || name.includes('plant') || slug.includes('planter') || id === '7') {
    return <ParametricPlanterModel material={material} wireframe={wireframe} />;
  }

  // 8. Bespoke CNC-Fit Phone Stand
  if (img.includes('phone') || name.includes('phone') || name.includes('stand') || slug.includes('phone') || id === '8') {
    return <ArticulatedPhoneStandModel material={material} wireframe={wireframe} />;
  }

  // 9. Lattice Pen Holder & Caliper Station
  if (img.includes('pen-holder') || img.includes('pen') || name.includes('pen') || name.includes('caliper') || slug.includes('pen') || id === '9') {
    return <PenCaliperStationModel material={material} wireframe={wireframe} />;
  }

  // 10. Micro-Fluidic Centrifugal Impeller
  if (img.includes('impeller') || name.includes('impeller') || name.includes('turbine') || slug.includes('impeller') || id === '10') {
    return <Impeller3DModel material={material} wireframe={wireframe} />;
  }

  // 11. UAS Carbon-X Drone Arm Spar
  if (img.includes('drone') || img.includes('spar') || name.includes('drone') || name.includes('spar') || slug.includes('drone') || id === '11') {
    return <DroneSpar3DModel material={material} wireframe={wireframe} />;
  }

  // 12. CoreXY Structural Enclosure Chassis
  if (img.includes('chassis') || name.includes('chassis') || name.includes('enclosure') || slug.includes('chassis') || id === '12') {
    return <IndustrialChassis3DModel material={material} wireframe={wireframe} />;
  }

  // 13. High-Torque Planetary Reduction Gearbox
  if (img.includes('gear') || name.includes('gear') || name.includes('planetary') || slug.includes('gear') || id === '13') {
    return <PlanetaryGearbox3DModel material={material} wireframe={wireframe} />;
  }

  // 14. Robotic End-Effector Gripper Finger
  if (img.includes('gripper') || name.includes('gripper') || name.includes('effector') || slug.includes('gripper') || id === '14') {
    return <RoboticGripper3DModel material={material} wireframe={wireframe} />;
  }

  return <HexVaseModel material={material} />;
}

`;
  code = code.substring(0, startIdx) + newRenderer + code.substring(endIdx);
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated Product3DViewer.tsx!');
