import fs from 'node:fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const buf = fs.readFileSync('saturn-3d-main/public/models/saturn-mecha.glb');
const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

loader.parse(arrayBuffer, '', (gltf) => {
  const scene = gltf.scene;
  scene.updateMatrixWorld(true);

  let robot = null;
  scene.traverse((c) => {
    console.log('child:', c.name, 'type:', c.type);
    if (c.isMesh) {
      if (c.name.toLowerCase().includes('rock')) {
        c.visible = false;
      } else {
        robot = c;
      }
    }
  });

  if (robot) {
    const box = new THREE.Box3().setFromObject(robot);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    console.log('robot box:', box);
    console.log('robot size:', size);
    console.log('robot center:', center);

    const targetHeight = 3.0;
    const scale = targetHeight / (size.y || 1);
    const offset = new THREE.Vector3(
      -center.x * scale,
      -box.min.y * scale,
      -center.z * scale
    );
    console.log('scale:', scale, 'offset:', offset);

    const parentGroup = new THREE.Group();
    const subGroup = new THREE.Group();
    subGroup.position.copy(offset);
    subGroup.scale.set(scale, scale, scale);
    subGroup.add(scene);
    parentGroup.add(subGroup);
    parentGroup.updateMatrixWorld(true);

    const finalBox = new THREE.Box3().setFromObject(robot);
    console.log('finalBox of robot after parenting:', finalBox);
    console.log('color attr:', robot.geometry.attributes.color);
  }
}, (err) => console.error(err));
