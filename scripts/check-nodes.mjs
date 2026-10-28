import fs from 'node:fs';

const buf = fs.readFileSync('saturn-3d-main/public/models/saturn-mecha.glb');
const jsonLen = buf.readUInt32LE(12);
const jsonBuf = buf.subarray(20, 20 + jsonLen);
const gltf = JSON.parse(jsonBuf.toString('utf8'));
console.log('Nodes:', gltf.nodes);
console.log('Meshes:', gltf.meshes);

