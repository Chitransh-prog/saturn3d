'use client';

import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Outlines } from '@react-three/drei';
import * as THREE from 'three';

interface HeroStage3DProps {
  printProgress?: number; // 0 to 1
  isPrinting?: boolean;
  reducedMotion?: boolean;
  onFirstInteract?: () => void;
  onTriggerReprint?: () => void;
}

// ---------------------------------------------------------------------------
// 1. Camera & Scene Setup
// ---------------------------------------------------------------------------
function CameraAndSceneSetup() {
  const { gl, camera, scene } = useThree();

  useEffect(() => {
    (window as any).__SCENE = scene;
    (window as any).__CAMERA = camera;
    (window as any).__GL = gl;
    gl.localClippingEnabled = true;
    gl.toneMapping = THREE.NoToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    camera.position.set(0, 1.5, 6.2);
    camera.lookAt(0, 1.5, 0);
  }, [gl, camera, scene]);

  useFrame(() => {
    camera.lookAt(0, 1.5, 0);
  });

  return null;
}

// ---------------------------------------------------------------------------
// 2. Max 3 Outlined Floating Low-Poly Props (Cube, Octahedron, Bolt)
// ---------------------------------------------------------------------------
function StageProps({ pointerParallax }: { pointerParallax: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useFrame((state) => {
    if (!groupRef.current || isMobile) return;
    const t = state.clock.elapsedTime;
    const children = groupRef.current.children;

    // Prop 1: Lemon Cube (Top-Right)
    if (children[0]) {
      children[0].rotation.x = t * 0.35;
      children[0].rotation.y = t * 0.4;
      children[0].position.y = 2.45 + Math.sin(t * 1.1) * 0.08 + pointerParallax.y * 0.15;
      children[0].position.x = 2.05 + pointerParallax.x * 0.2;
    }
    // Prop 2: Periwinkle Hex Bolt (Top-Left)
    if (children[1]) {
      children[1].rotation.y = t * 0.45;
      children[1].rotation.z = t * 0.25;
      children[1].position.y = 2.2 + Math.cos(t * 1.3) * 0.07 + pointerParallax.y * 0.12;
      children[1].position.x = -2.05 + pointerParallax.x * 0.18;
    }
    // Prop 3: Mint Octahedron (Lower-Right)
    if (children[2]) {
      children[2].rotation.x = t * 0.5;
      children[2].rotation.z = t * 0.35;
      children[2].position.y = 0.65 + Math.sin(t * 1.4 + 1.5) * 0.06 + pointerParallax.y * 0.1;
      children[2].position.x = 2.15 + pointerParallax.x * 0.15;
    }
  });

  if (isMobile) return null;

  return (
    <group ref={groupRef}>
      {/* 1. Lemon Cube (<= 8% mecha height) */}
      <mesh position={[2.05, 2.45, -0.4]}>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshBasicMaterial color="#FFE14D" />
        <Outlines thickness={2} color="#0B0B0B" />
      </mesh>

      {/* 2. Periwinkle Hex Bolt */}
      <mesh position={[-2.05, 2.2, -0.5]}>
        <cylinderGeometry args={[0.13, 0.13, 0.08, 6]} />
        <meshBasicMaterial color="#8EA2FF" />
        <Outlines thickness={1.8} color="#0B0B0B" />
      </mesh>

      {/* 3. Mint Octahedron */}
      <mesh position={[2.15, 0.65, 0.3]}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshBasicMaterial color="#7CF2C1" />
        <Outlines thickness={1.8} color="#0B0B0B" />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. Real 3D Orbiting Torus Ring (Passes in front of legs, behind torso)
// ---------------------------------------------------------------------------
function SaturnOrbitRing({
  isHovered,
  scale = 1.0,
}: {
  isHovered: boolean;
  scale?: number;
}) {
  const primaryMeshRef = useRef<THREE.Mesh>(null);
  const secondaryMeshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const speedMult = isHovered ? 2.5 : 1.0;
    if (primaryMeshRef.current) {
      primaryMeshRef.current.rotation.z += delta * 0.25 * speedMult;
    }
    if (secondaryMeshRef.current) {
      secondaryMeshRef.current.rotation.z -= delta * 0.35 * speedMult;
    }
  });

  return (
    // Centred on waist at y = 1.5, tilted -20 deg X and 12 deg Z
    // Radius ~1.28 circles the waist; front passes in front of legs, back passes behind torso
    <group
      position={[0, 1.5, 0]}
      rotation={[-0.349, 0, 0.209]}
      scale={scale}
    >
      {/* Primary Band: Saturn Orange Torus (Tube ~0.085, 128 segments, arc 2*PI) */}
      <mesh ref={primaryMeshRef}>
        <torusGeometry args={[1.28, 0.085, 24, 128, Math.PI * 2]} />
        <meshBasicMaterial color="#FF5A1F" />
        <Outlines thickness={2.0} color="#0B0B0B" />
      </mesh>

      {/* Secondary Thinner Band: Lemon Ring (Radius +0.14, Tube 0.035) */}
      <mesh ref={secondaryMeshRef}>
        <torusGeometry args={[1.42, 0.035, 20, 128, Math.PI * 2]} />
        <meshBasicMaterial color="#FFE14D" />
        <Outlines thickness={1.6} color="#0B0B0B" />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. Mecha Character: Clean Toon & Inverted Hull Ink Outline
// ---------------------------------------------------------------------------
function MechaCharacter({
  printProgress = 1.0,
  isPrinting = false,
  reducedMotion = false,
  pointerParallax,
  onInteract,
  onTriggerReprint,
  setIsHovered,
  stageRotationY,
}: {
  printProgress: number;
  isPrinting: boolean;
  reducedMotion: boolean;
  pointerParallax: { x: number; y: number };
  onInteract?: () => void;
  onTriggerReprint?: () => void;
  setIsHovered: (hovered: boolean) => void;
  stageRotationY: number;
}) {
  console.log('[STAGE3D] MechaCharacter START RENDER');
  const groupRef = useRef<THREE.Group>(null);

  // Load optimized mecha model
  const { scene } = useGLTF('/models/saturn-mecha.glb');

  // Calculate cut Y in world-space: mecha goes from y = 0 to y = 3.0
  const currentCut = reducedMotion || !isPrinting || printProgress >= 0.99
    ? 999.0
    : printProgress * 3.15;

  const clippingPlane = useMemo(() => {
    return new THREE.Plane(new THREE.Vector3(0, -1, 0), currentCut);
  }, []);
  clippingPlane.constant = currentCut;

  // 3-Step Toon Gradient Map with NearestFilter [0.28, 0.6, 1.0]
  const gradientMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 3;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#CFC6B8'; // Warm grey shadow
    ctx.fillRect(0, 0, 1, 1);
    ctx.fillStyle = '#EAE4D9'; // Neutral midtone
    ctx.fillRect(1, 0, 1, 1);
    ctx.fillStyle = '#F2EEE6'; // Highlight off-white
    ctx.fillRect(2, 0, 1, 1);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Isolate RobotMesh, ignore RockSummit, sanitize vertex colors & normalize height
  const { robotMesh, targetScale, targetOffset } = useMemo<{
    robotMesh: THREE.Mesh | null;
    targetScale: number;
    targetOffset: THREE.Vector3;
  }>(() => {
    let robot: THREE.Mesh | null = null;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        if (child.name.toLowerCase().includes('rock')) {
          child.visible = false;
        } else {
          robot = child as THREE.Mesh;
          robot.visible = true;
        }
      }
    });

    if (robot) {

      scene.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(robot);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // Normalize height to exactly 3.0 units, feet at y = 0
      const targetHeight = 3.0;
      const scale = targetHeight / (size.y || 1);
      const offset = new THREE.Vector3(
        -center.x * scale,
        -box.min.y * scale,
        -center.z * scale
      );

      return {
        robotMesh: robot,
        targetScale: scale,
        targetOffset: offset,
      };
    }

    return {
      robotMesh: null,
      targetScale: 1,
      targetOffset: new THREE.Vector3(0, 0, 0),
    };
  }, [scene]);

  // Phase 2 Toon Material with Hardware Clipping during printing
  const toonMaterial = useMemo(() => {
    return new THREE.MeshToonMaterial({
      color: new THREE.Color('#FFFFFF'),
      gradientMap,
      vertexColors: true,
      side: THREE.DoubleSide,
      clippingPlanes: isPrinting && printProgress < 0.99 ? [clippingPlane] : [],
      clipShadows: true,
    });
  }, [gradientMap, clippingPlane, isPrinting, printProgress]);

  // Phase 2 Crisp Inverted Hull Ink Outline (~2.5px along normals)
  const outlineMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        outlineThickness: { value: 0.0065 },
        outlineColor: { value: new THREE.Color('#0B0B0B') },
      },
      vertexShader: `
        uniform float outlineThickness;
        void main() {
          vec3 newPos = position + normal * outlineThickness;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 outlineColor;
        void main() {
          gl_FragColor = vec4(outlineColor, 1.0);
        }
      `,
      side: THREE.BackSide,
      clippingPlanes: isPrinting && printProgress < 0.99 ? [clippingPlane] : [],
    });
  }, [clippingPlane, isPrinting, printProgress]);

  // Attach Toon Material & Inverted Hull Ink Outline to robotMesh
  useEffect(() => {
    if (!robotMesh) return;
    robotMesh.material = toonMaterial;
    robotMesh.castShadow = false;
    robotMesh.receiveShadow = false;

    const outlineMesh = new THREE.Mesh(robotMesh.geometry, outlineMaterial);
    robotMesh.add(outlineMesh);

    return () => {
      robotMesh.remove(outlineMesh);
    };
  }, [robotMesh, toonMaterial, outlineMaterial]);

  // Procedural breathing + pointer parallax + stage rotation
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    const breath = Math.sin(t * 1.5);
    const scaleBreath = 1.0 + breath * 0.005;
    groupRef.current.scale.set(scaleBreath, scaleBreath, scaleBreath);

    const targetPitch = -pointerParallax.y * (5 * Math.PI / 180);
    const targetYaw = pointerParallax.x * (10 * Math.PI / 180);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetPitch, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      stageRotationY + targetYaw,
      0.08
    );
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onDoubleClick={() => onTriggerReprint?.()}
    >
      <group position={targetOffset} scale={targetScale}>
        <primitive object={scene} />
      </group>

      {/* Laser Cut Glow Line during printing */}
      {isPrinting && printProgress < 0.99 && (
        <group position={[0, currentCut, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.01, 1.4, 48]} />
            <meshBasicMaterial
              color="#FF5A1F"
              side={THREE.DoubleSide}
              transparent
              opacity={0.88}
            />
          </mesh>
          <pointLight color="#FF5A1F" intensity={4} distance={2.0} decay={2} />
        </group>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 5. Stage Elements: Lemon Circle Backdrop & Hard Contact Shadow
// ---------------------------------------------------------------------------
function StageElements({
  discScale = 1.0,
}: {
  discScale?: number;
}) {
  return (
    <group>
      {/* Stage Backdrop: Flat lemon circle (no border, no shadow), ~0.85 x mecha height (radius ~1.28) */}
      {/* Sits behind mecha and behind ring's back arc at z = -0.8 */}
      <mesh position={[0.22, 1.4, -0.8]} scale={discScale}>
        <circleGeometry args={[1.28, 64]} />
        <meshBasicMaterial color="#FFE14D" />
      </mesh>

      {/* Flat Hard Contact Shadow Ellipse under feet: ink at ~18% opacity, zero blur */}
      <mesh
        position={[0.10, 0.002, 0.08]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1.15, 0.65, 1]}
      >
        <circleGeometry args={[0.72, 48]} />
        <meshBasicMaterial color="#0B0B0B" transparent opacity={0.18} />
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
  onFirstInteract,
  onTriggerReprint,
}: HeroStage3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [pointerParallax, setPointerParallax] = useState({ x: 0, y: 0 });

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, rotY: 0 });
  const [manualRotY, setManualRotY] = useState(0);
  const lastInteractionTimeRef = useRef(Date.now());

  const registerInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      onFirstInteract?.();
    }
    lastInteractionTimeRef.current = Date.now();
  }, [hasInteracted, onFirstInteract]);

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setPointerParallax({
      x: THREE.MathUtils.clamp(nx, -1, 1),
      y: THREE.MathUtils.clamp(ny, -1, 1),
    });

    if (isDraggingRef.current) {
      const deltaX = (e.clientX - dragStartRef.current.x) * 0.009;
      const maxAngle = 80 * Math.PI / 180;
      const newRot = THREE.MathUtils.clamp(dragStartRef.current.rotY + deltaX, -maxAngle, maxAngle);
      setManualRotY(newRot);
      lastInteractionTimeRef.current = Date.now();
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, rotY: manualRotY };
    registerInteraction();
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setManualRotY((r) => Math.max(r - 0.15, -80 * Math.PI / 180));
      registerInteraction();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setManualRotY((r) => Math.min(r + 0.15, 80 * Math.PI / 180));
      registerInteraction();
    }
  };

  // Idle auto-rotate return after 3s without input
  useEffect(() => {
    let animId: number;
    const tick = () => {
      const elapsedSinceInput = Date.now() - lastInteractionTimeRef.current;
      if (!isDraggingRef.current && elapsedSinceInput > 3000 && !reducedMotion) {
        setManualRotY((current) => THREE.MathUtils.lerp(current, 0, 0.04));
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative select-none cursor-grab active:cursor-grabbing outline-none"
      tabIndex={0}
      role="region"
      aria-label="Interactive 3D model of Saturn 3D mecha character. Drag horizontally or use arrow keys to rotate."
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        isDraggingRef.current = false;
        setPointerParallax({ x: 0, y: 0 });
      }}
    >
      <Canvas
        camera={{ position: [0, 1.5, 6.2], fov: 34 }}
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

        {/* Phase 2 Clean Lighting: Warm key directional (top-left-front), low fill, orange rim (back-right) */}
        <directionalLight position={[-3, 5, 4]} intensity={2.2} color="#FFF1D6" />
        <hemisphereLight args={['#FFFFFF', '#F5EFE6', 0.55]} />
        <directionalLight position={[4, 3, -4]} intensity={2.8} color="#FF5A1F" />

        {/* Stage Lemon Disc (Behind) & Hard Contact Shadow (Floor) */}
        <StageElements />

        {/* Real 3D Orbiting Saturn Ring (passes in front of legs, behind torso) */}
        <SaturnOrbitRing isHovered={isHovered} />

        {/* Mecha Robot with Clean Toon Shading & Ink Outline */}
        <React.Suspense fallback={null}>
          <MechaCharacter
            printProgress={printProgress}
            isPrinting={isPrinting}
            reducedMotion={reducedMotion}
            pointerParallax={pointerParallax}
            onInteract={registerInteraction}
            onTriggerReprint={onTriggerReprint}
            setIsHovered={setIsHovered}
            stageRotationY={manualRotY}
          />
        </React.Suspense>

        {/* Max 3 Outlined Floating Props */}
        <StageProps pointerParallax={pointerParallax} />
      </Canvas>
    </div>
  );
}

// Preload optimized asset
useGLTF.preload('/models/saturn-mecha.glb');
