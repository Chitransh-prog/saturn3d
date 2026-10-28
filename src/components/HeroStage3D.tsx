import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Outlines } from '@react-three/drei';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import * as THREE from 'three';

interface HeroStage3DProps {
  printProgress?: number; // 0 to 1
  isPrinting?: boolean;
  reducedMotion?: boolean;
}

// ---------------------------------------------------------------------------
// 1. Camera & Scene Setup (Locks lookAt to robot center y = 1.05)
// ---------------------------------------------------------------------------
function CameraAndSceneSetup() {
  const { gl, camera } = useThree();

  useEffect(() => {
    gl.localClippingEnabled = true;
    // Perfectly framed camera: head to toe visible with 16% breathing room
    camera.position.set(0, 1.08, 4.3);
    camera.lookAt(0, 1.05, 0);
  }, [gl, camera]);

  useFrame(() => {
    camera.lookAt(0, 1.05, 0);
  });

  return null;
}

// ---------------------------------------------------------------------------
// 2. Low-Poly Floating Drifting Props
// ---------------------------------------------------------------------------
function FloatingProps() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!groupRef.current) return;

    const children = groupRef.current.children;
    if (children[0]) {
      children[0].rotation.x = t * 0.4;
      children[0].rotation.y = t * 0.3;
      children[0].position.y = 1.8 + Math.sin(t * 1.2) * 0.08;
    }
    if (children[1]) {
      children[1].rotation.y = t * 0.5;
      children[1].rotation.z = t * 0.3;
      children[1].position.y = 1.9 + Math.cos(t * 1.4) * 0.08;
    }
    if (children[2]) {
      children[2].rotation.z = t * 0.6;
      children[2].position.y = 0.8 + Math.sin(t * 1.5 + 1) * 0.06;
    }
    if (children[3]) {
      children[3].rotation.x = t * 0.35;
      children[3].rotation.y = t * 0.45;
      children[3].position.y = 0.6 + Math.cos(t * 1.1 + 2) * 0.06;
    }
    if (children[4]) {
      children[4].rotation.y = t * 0.25;
      children[4].position.y = 1.3 + Math.sin(t * 0.9 + 3) * 0.07;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Prop 1: Lemon Cube (Top Left) */}
      <mesh position={[-2.1, 1.8, -0.6]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshToonMaterial color="#FFE14D" />
        <Outlines thickness={2} color="#0B0B0B" />
      </mesh>

      {/* Prop 2: Saturn Orange Tetrahedron (Top Right) */}
      <mesh position={[2.1, 1.9, -0.5]} castShadow>
        <tetrahedronGeometry args={[0.18, 0]} />
        <meshToonMaterial color="#FF5A1F" />
        <Outlines thickness={2} color="#0B0B0B" />
      </mesh>

      {/* Prop 3: Periwinkle Mini Gear / Cylinder (Mid Left) */}
      <mesh position={[-2.2, 0.8, 0.4]}>
        <cylinderGeometry args={[0.15, 0.15, 0.08, 12]} />
        <meshToonMaterial color="#8EA2FF" />
        <Outlines thickness={1.8} color="#0B0B0B" />
      </mesh>

      {/* Prop 4: Mint Octahedron / Bolt (Lower Right) */}
      <mesh position={[2.2, 0.6, 0.5]}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshToonMaterial color="#7CF2C1" />
        <Outlines thickness={1.8} color="#0B0B0B" />
      </mesh>

      {/* Prop 5: Lemon Hex Bolt (Mid Right Back) */}
      <mesh position={[2.0, 1.4, -0.8]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.06, 6]} />
        <meshToonMaterial color="#FFE14D" />
        <Outlines thickness={1.6} color="#0B0B0B" />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. Multi-Banded Saturn Planetary Ring (Loops waist with true depth)
// ---------------------------------------------------------------------------
function SaturnWaistRing() {
  const ringGroup = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const orbitLineRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.10;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -t * 0.14;
    }
    if (ringGroup.current) {
      const targetTiltX = -0.42 - state.pointer.y * 0.08;
      const targetTiltY = 0.12 + state.pointer.x * 0.12;
      ringGroup.current.rotation.x = THREE.MathUtils.lerp(ringGroup.current.rotation.x, targetTiltX, 0.05);
      ringGroup.current.rotation.y = THREE.MathUtils.lerp(ringGroup.current.rotation.y, targetTiltY, 0.05);
    }
  });

  return (
    // Circling waist at y = 0.96, tilted -24 deg: front passes in front of legs, back passes behind torso
    <group ref={ringGroup} position={[0, 0.96, 0]} rotation={[-0.42, 0.12, -0.05]}>
      {/* Primary Band: Saturn Orange */}
      <mesh ref={ringRef}>
        <ringGeometry args={[1.16, 1.34, 64]} />
        <meshStandardMaterial
          color="#FF5A1F"
          side={THREE.DoubleSide}
          roughness={0.4}
          metalness={0.2}
          transparent
          opacity={0.92}
        />
        <Outlines thickness={1.8} color="#0B0B0B" />
      </mesh>

      {/* Secondary Band: Lemon Accent */}
      <mesh ref={outerRingRef}>
        <ringGeometry args={[1.38, 1.46, 64]} />
        <meshStandardMaterial
          color="#FFE14D"
          side={THREE.DoubleSide}
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.88}
        />
        <Outlines thickness={1.6} color="#0B0B0B" />
      </mesh>

      {/* Tertiary Orbit Track: Fine Ink Line */}
      <mesh ref={orbitLineRef}>
        <ringGeometry args={[1.50, 1.52, 64]} />
        <meshBasicMaterial color="#0B0B0B" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. Normalized Saturn Mecha Character (Full Height visible from head to feet)
// ---------------------------------------------------------------------------
function MechaCharacter({
  printProgress = 1.0,
  isPrinting = false,
  reducedMotion = false,
  clippingPlane,
}: {
  printProgress: number;
  isPrinting: boolean;
  reducedMotion: boolean;
  clippingPlane: THREE.Plane;
}) {
  const characterRef = useRef<THREE.Group>(null);

  // Load optimized model
  const { scene } = useGLTF('/models/saturn-mecha.glb', undefined, undefined, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });

  // 3-Step Toon Gradient Map
  const gradientMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 3;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#6E6E6E'; // Shadow
    ctx.fillRect(0, 0, 1, 1);
    ctx.fillStyle = '#BCBCBC'; // Midtone
    ctx.fillRect(1, 0, 1, 1);
    ctx.fillStyle = '#FFFFFF'; // Highlight
    ctx.fillRect(2, 0, 1, 1);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    return tex;
  }, []);

  // Compute Box3 runtime normalization (target height = 2.05, perfectly framed)
  const { normalizedScene, normalizedScale, targetOffset } = useMemo(() => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const targetHeight = 2.05;
    const scale = targetHeight / (size.y || 1);

    return {
      normalizedScene: cloned,
      normalizedScale: scale,
      targetOffset: new THREE.Vector3(
        -center.x * scale,
        -box.min.y * scale,
        -center.z * scale
      ),
    };
  }, [scene]);

  // Assign clean PBR materials with hardware clipping and crisp lighting
  useEffect(() => {
    if (!normalizedScene) return;

    normalizedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const isRobot = mesh.name === 'RobotMesh' || mesh.parent?.name === 'MechaRobot';

        if (isRobot) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#FFFFFF'),
            vertexColors: true,
            metalness: 0.24,
            roughness: 0.36,
            clippingPlanes: [clippingPlane],
            clipShadows: true,
            side: THREE.DoubleSide,
          });
        } else {
          // Sandstone Rock Base
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#D2C6B2'),
            vertexColors: true,
            metalness: 0.02,
            roughness: 0.94,
            clippingPlanes: [clippingPlane],
            clipShadows: true,
            side: THREE.DoubleSide,
          });
        }
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [normalizedScene, clippingPlane]);

  // Drag-to-rotate & pointer follow with spring-back
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, rotY: 0 });
  const manualRotY = useRef(0);

  // Procedural breathing and pointer-tracking motion
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!characterRef.current) return;

    // Follow pointer (max 10 deg yaw, 5 deg pitch)
    const targetFollowYaw = state.pointer.x * (10 * Math.PI / 180);
    const targetFollowPitch = -state.pointer.y * (5 * Math.PI / 180);

    // Spring back manual rotation towards 0 when not dragging
    if (!isDraggingRef.current) {
      manualRotY.current = THREE.MathUtils.lerp(manualRotY.current, 0, 0.05);
    }

    const combinedRotY = manualRotY.current + targetFollowYaw;
    characterRef.current.rotation.y = THREE.MathUtils.lerp(
      characterRef.current.rotation.y,
      combinedRotY,
      0.06
    );
    characterRef.current.rotation.x = THREE.MathUtils.lerp(
      characterRef.current.rotation.x,
      targetFollowPitch,
      0.06
    );

    // Subtle breathing scale (1.00 - 1.012) and gentle Y float (+/-0.015)
    if (!isPrinting || printProgress >= 0.95) {
      const breath = Math.sin(t * 1.4);
      const scaleBreath = 1.0 + breath * 0.006;
      characterRef.current.scale.set(scaleBreath, scaleBreath, scaleBreath);
      characterRef.current.position.y = breath * 0.015;
    }
  });

  return (
    <group
      ref={characterRef}
      onPointerDown={(e) => {
        isDraggingRef.current = true;
        dragStartRef.current = { x: e.clientX, rotY: manualRotY.current };
        (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!isDraggingRef.current) return;
        const deltaX = (e.clientX - dragStartRef.current.x) * 0.008;
        const limit = 35 * Math.PI / 180;
        manualRotY.current = THREE.MathUtils.clamp(
          dragStartRef.current.rotY + deltaX,
          -limit,
          limit
        );
      }}
      onPointerUp={(e) => {
        isDraggingRef.current = false;
        (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
      }}
    >
      {/* Normalized Mecha Object (Centered, feet at y = 0, facing +Z) */}
      <group position={targetOffset} scale={normalizedScale}>
        <primitive object={normalizedScene} />
      </group>
    </group>
  );
}



// ---------------------------------------------------------------------------
// 6. Floor Plate & Brutalist Hard Contact Shadow
// ---------------------------------------------------------------------------
function StageFloor() {
  return (
    <group position={[0, 0, 0]}>
      {/* Hard Contact Shadow (Dark Ellipse offset down-right, zero blur) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.12, 0.003, -0.08]}>
        <circleGeometry args={[1.05, 36]} />
        <meshBasicMaterial color="#0B0B0B" opacity={0.65} transparent />
      </mesh>

      {/* Floor Circular Grid Plate in Ink & Paper */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[1.35, 48]} />
        <meshToonMaterial color="#FFF4E0" />
      </mesh>

      {/* Outer Floor Concentric Ring Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[1.33, 1.36, 48]} />
        <meshBasicMaterial color="#0B0B0B" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[0.98, 1.01, 48]} />
        <meshBasicMaterial color="#FF5A1F" />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Main Hero Stage 3D Export
// ---------------------------------------------------------------------------
export default function HeroStage3D({
  printProgress = 1.0,
  isPrinting = false,
  reducedMotion = false,
}: HeroStage3DProps) {
  // Height coordinate: model goes from y = 0 to 2.05
  const currentCutY = reducedMotion || !isPrinting || printProgress >= 0.99
    ? 999.0
    : printProgress * 2.15;

  // Hardware clipping plane
  const clippingPlane = useMemo(() => {
    return new THREE.Plane(new THREE.Vector3(0, -1, 0), currentCutY);
  }, []);

  // Update clipping plane constant synchronously every frame
  clippingPlane.constant = currentCutY;

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [0, 1.08, 4.3], fov: 38 }}
        dpr={[1, 1.75]}
        gl={{
          alpha: true,
          localClippingEnabled: true,
          powerPreference: 'high-performance',
          antialias: true,
        }}
        className="w-full h-full"
        aria-hidden="true"
      >
        <CameraAndSceneSetup />

        {/* Directional Key Sunlight & Rim Light for Premium Mecha Shading */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 4]} intensity={2.2} />
        <directionalLight position={[-4, 3, 2]} intensity={1.1} color="#93C5FD" />
        <directionalLight position={[0, 4, -4]} intensity={2.0} color="#FF5A1F" />
        <pointLight position={[0, 1.55, 0.45]} color="#00F0FF" intensity={1.5} distance={1.2} decay={2} />

        {/* Floor Plate with Brutalist Offset Hard Shadow */}
        <StageFloor />

        {/* Floating Props (Drifting low-poly shapes) */}
        <FloatingProps />

        {/* Real 3D Saturn Waist Ring (Passing in front of legs, behind torso) */}
        <SaturnWaistRing />

        {/* 3D Normalized Mecha with PBR Materials & Clipping Plane */}
        <React.Suspense fallback={null}>
          <MechaCharacter
            printProgress={printProgress}
            isPrinting={isPrinting}
            reducedMotion={reducedMotion}
            clippingPlane={clippingPlane}
          />
        </React.Suspense>

        {/* Active Laser Print Line during printing */}
        {isPrinting && printProgress < 0.99 && (
          <group position={[0, currentCutY, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.01, 1.25, 36]} />
              <meshBasicMaterial
                color="#FF5A1F"
                side={THREE.DoubleSide}
                transparent
                opacity={0.85}
              />
            </mesh>
            <pointLight color="#FF5A1F" intensity={4} distance={1.8} decay={2} />
          </group>
        )}
      </Canvas>
    </div>
  );
}

// Preload the optimized model
useGLTF.preload('/models/saturn-mecha.glb', undefined, undefined, (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
});
