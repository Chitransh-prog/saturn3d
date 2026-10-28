import fs from 'node:fs';
import path from 'node:path';
import { Blob } from 'node:buffer';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Polyfill Blob and FileReader for GLTFExporter in Node
global.Blob = Blob;
global.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onload) this.onload();
      if (this.onloadend) this.onloadend();
    }).catch((err) => {
      if (this.onerror) this.onerror(err);
    });
  }
};

async function fixMechaGlb() {
  const sourcePath = path.resolve('saturn-3d-main/public/tmpoaxsvpt5.glb');
  console.log('Reading source model:', sourcePath);
  const buf = fs.readFileSync(sourcePath);

  const loader = new GLTFLoader();
  const gltf = await new Promise((resolve, reject) => {
    loader.parse(
      buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
      '',
      resolve,
      reject
    );
  });

  let robotMesh = null;
  gltf.scene.traverse((obj) => {
    if (obj.isMesh && obj.name === 'MechaRobot') {
      robotMesh = obj;
    }
  });

  if (!robotMesh) {
    throw new Error('MechaRobot mesh not found in GLB');
  }

  console.log('Found MechaRobot with vertices:', robotMesh.geometry.attributes.position.count);

  const pos = robotMesh.geometry.attributes.position;
  const col = robotMesh.geometry.attributes.color;

  // 1. Calculate raw bounds
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }

  const height = maxY - minY;
  const centerX = (maxX + minX) / 2;
  const centerZ = (maxZ + minZ) / 2;
  const targetHeight = 3.0; // 3.0 units high
  const scale = targetHeight / height;

  console.log('Original Bounds:');
  console.log(`  X: [${minX.toFixed(4)}, ${maxX.toFixed(4)}] | Center: ${centerX.toFixed(4)}`);
  console.log(`  Y: [${minY.toFixed(4)}, ${maxY.toFixed(4)}] | Height: ${height.toFixed(4)}`);
  console.log(`  Z: [${minZ.toFixed(4)}, ${maxZ.toFixed(4)}] | Center: ${centerZ.toFixed(4)}`);
  console.log(`  Scale factor: ${scale.toFixed(6)}`);

  // 2. Normalize positions & Remap vertex colors by role
  let visorCount = 0;
  let jointCount = 0;
  let armorCount = 0;

  // Pre-allocate new Float32Arrays
  const newPositions = new Float32Array(pos.count * 3);
  const newColors = new Float32Array(pos.count * 3);

  for (let i = 0; i < pos.count; i++) {
    const origX = pos.getX(i);
    const origY = pos.getY(i);
    const origZ = pos.getZ(i);

    const origR = col ? col.getX(i) : 0.8;
    const origG = col ? col.getY(i) : 0.8;
    const origB = col ? col.getZ(i) : 0.8;

    // Normalization: feet on y = 0, centered on X and Z, height = 3.0
    const newX = (origX - centerX) * scale;
    const newY = (origY - minY) * scale;
    const newZ = (origZ - centerZ) * scale;

    newPositions[i * 3 + 0] = newX;
    newPositions[i * 3 + 1] = newY;
    newPositions[i * 3 + 2] = newZ;

    // Detect Visor / Optics
    const isVisor = origY > 0.38 && origZ > 0.15 && origB > 0.5 && origB > origR + 0.2;
    const lum = 0.299 * origR + 0.587 * origG + 0.114 * origB;
    const isJoint = lum < 0.36;

    if (isVisor) {
      // Saturn Brand Orange #FF5A1F
      newColors[i * 3 + 0] = 1.0;
      newColors[i * 3 + 1] = 0.353;
      newColors[i * 3 + 2] = 0.122;
      visorCount++;
    } else if (isJoint) {
      // Ink joints #1A1A1A
      newColors[i * 3 + 0] = 0.102;
      newColors[i * 3 + 1] = 0.102;
      newColors[i * 3 + 2] = 0.102;
      jointCount++;
    } else {
      // Off-white armor #F2EEE6
      newColors[i * 3 + 0] = 0.949;
      newColors[i * 3 + 1] = 0.933;
      newColors[i * 3 + 2] = 0.902;
      armorCount++;
    }
  }

  console.log(`Classified: Visor: ${visorCount} | Joints/Cables: ${jointCount} | Armor Plates: ${armorCount}`);

  // Create clean BufferGeometry
  const cleanGeometry = new THREE.BufferGeometry();
  cleanGeometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
  cleanGeometry.setAttribute('color', new THREE.BufferAttribute(newColors, 3));
  if (robotMesh.geometry.index) {
    cleanGeometry.setIndex(robotMesh.geometry.index.clone());
  }
  cleanGeometry.computeVertexNormals();

  // Create clean Mesh with a neutral PBR material (or Toon material handles it in R3F)
  const cleanMaterial = new THREE.MeshStandardMaterial({
    name: 'MechaToonShaderMaterial',
    vertexColors: true,
    roughness: 0.4,
    metalness: 0.1,
  });

  const cleanMesh = new THREE.Mesh(cleanGeometry, cleanMaterial);
  cleanMesh.name = 'MechaRobot';

  // Build clean scene with ONLY MechaRobot (no RockSummit!)
  const exportScene = new THREE.Scene();
  exportScene.name = 'SaturnMechaScene';
  exportScene.add(cleanMesh);

  console.log('Exporting clean GLB...');
  const exporter = new GLTFExporter();
  const cleanGlbBuffer = await exporter.parseAsync(exportScene, { binary: true });

  console.log(`Clean GLB generated! Size: ${(cleanGlbBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`);

  // Save to public/models/saturn-mecha.glb
  const outPath1 = path.resolve('saturn-3d-main/public/models/saturn-mecha.glb');
  fs.writeFileSync(outPath1, Buffer.from(cleanGlbBuffer));
  console.log('Saved to:', outPath1);

  // Backup original tmpoaxsvpt5.glb if not already backed up
  const backupPath = path.resolve('saturn-3d-main/public/tmpoaxsvpt5.glb.bak');
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(sourcePath, backupPath);
    console.log('Backed up original tmpoaxsvpt5.glb to:', backupPath);
  }

  // Update public/tmpoaxsvpt5.glb as well so both files have the fixed model
  fs.writeFileSync(sourcePath, Buffer.from(cleanGlbBuffer));
  console.log('Updated:', sourcePath);
}

fixMechaGlb().catch(console.error);

