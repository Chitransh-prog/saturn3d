'use client';

import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { 
  Box as BoxIcon, Eye, RotateCw, ZoomIn, ZoomOut, Layers,
  Compass, Maximize2, Minimize2, Sun, Moon, Sliders, Share2,
  Check, RefreshCw, FileText, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export interface PartViewerProps {
  file?: File | null;
  modelUrl?: string;
  sampleType?: string;
  initialMaterialColor?: string;
  onDimensionsCalculated?: (dimensions: string, weightGrams: number, volumeCm3: number) => void;
  className?: string;
}

// Camera controller component responding to preset commands
function CameraDirector({
  targetView,
  zoomAction,
  onActionHandled,
}: {
  targetView: string | null;
  zoomAction: 'in' | 'out' | null;
  onActionHandled: () => void;
}) {
  const { camera } = useThree();

  useEffect(() => {
    if (!targetView) return;
    const dist = 5.2;

    switch (targetView) {
      case 'home':
        camera.position.set(3.5, 3.2, 4.0);
        break;
      case 'top':
        camera.position.set(0, dist, 0.01);
        break;
      case 'front':
        camera.position.set(0, 0, dist);
        break;
      case 'back':
        camera.position.set(0, 0, -dist);
        break;
      case 'left':
        camera.position.set(-dist, 0, 0);
        break;
      case 'right':
        camera.position.set(dist, 0, 0);
        break;
    }
    camera.lookAt(0, 0, 0);
    onActionHandled();
  }, [targetView, camera, onActionHandled]);

  useEffect(() => {
    if (!zoomAction) return;
    const factor = zoomAction === 'in' ? 0.8 : 1.25;
    camera.position.multiplyScalar(factor);
    onActionHandled();
  }, [zoomAction, camera, onActionHandled]);

  return null;
}

export default function PartViewer({
  file,
  modelUrl,
  sampleType = 'impeller',
  initialMaterialColor = '#F2EEE6',
  onDimensionsCalculated,
  className = '',
}: PartViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [backdropTheme, setBackdropTheme] = useState<'dark' | 'light'>('dark');
  const [brightness, setBrightness] = useState(1.0);
  const [clipZ, setClipZ] = useState(1.0); // 0 to 1
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [targetView, setTargetView] = useState<string | null>('home');
  const [zoomAction, setZoomAction] = useState<'in' | 'out' | null>(null);

  // Model telemetry
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [dimensions, setDimensions] = useState<{ x: number; y: number; z: number }>({ x: 45, y: 32, z: 28 });
  const [volumeCm3, setVolumeCm3] = useState(18.5);
  const [triangleCount, setTriangleCount] = useState(4820);
  const [partName, setPartName] = useState('Benchmark Impeller');

  // Parse uploaded file or URL
  useEffect(() => {
    if (!file && !modelUrl) {
      // Default benchmark CAD impeller model
      const points = [
        new THREE.Vector2(0.25, -0.6),
        new THREE.Vector2(1.4, -0.6),
        new THREE.Vector2(1.45, -0.45),
        new THREE.Vector2(1.05, -0.2),
        new THREE.Vector2(0.7, 0.1),
        new THREE.Vector2(0.5, 0.4),
        new THREE.Vector2(0.45, 0.65),
        new THREE.Vector2(0.25, 0.65),
        new THREE.Vector2(0.25, -0.6),
      ];
      const geom = new THREE.LatheGeometry(points, 48);
      geom.computeVertexNormals();
      setGeometry(geom);
      setDimensions({ x: 58, y: 42, z: 58 });
      setVolumeCm3(28.6);
      setTriangleCount(4608);
      setPartName('Aerospace Centrifugal Impeller');
      onDimensionsCalculated?.('58 × 42 × 58 mm', 35, 28.6);
      return;
    }

    if (file) {
      setPartName(file.name);
      const ext = file.name.split('.').pop()?.toLowerCase();
      const reader = new FileReader();

      if (ext === 'stl') {
        reader.onload = (e) => {
          const buffer = e.target?.result as ArrayBuffer;
          if (!buffer) return;
          try {
            const loader = new STLLoader();
            const geom = loader.parse(buffer);
            geom.center();
            geom.computeVertexNormals();
            processGeometry(geom, file.name);
          } catch (err) {
            console.error('Error parsing STL', err);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (ext === 'obj') {
        reader.onload = (e) => {
          const text = e.target?.result as string;
          try {
            const loader = new OBJLoader();
            const group = loader.parse(text);
            let mergedGeom = new THREE.BufferGeometry();
            group.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                mergedGeom = (child as THREE.Mesh).geometry.clone();
              }
            });
            mergedGeom.center();
            mergedGeom.computeVertexNormals();
            processGeometry(mergedGeom, file.name);
          } catch (err) {
            console.error('Error parsing OBJ', err);
          }
        };
        reader.readAsText(file);
      } else {
        // Fallback for STEP / 3MF
        const fallbackGeom = new THREE.BoxGeometry(2.0, 1.2, 1.5);
        fallbackGeom.computeVertexNormals();
        processGeometry(fallbackGeom, file.name);
      }
    }
  }, [file, modelUrl]);

  const processGeometry = (geom: THREE.BufferGeometry, name: string) => {
    geom.computeBoundingBox();
    const bbox = geom.boundingBox || new THREE.Box3();
    const size = new THREE.Vector3();
    bbox.getSize(size);

    const dimX = Math.round(size.x * 20);
    const dimY = Math.round(size.y * 20);
    const dimZ = Math.round(size.z * 20);

    const vol = Math.max(1, Math.round((dimX * dimY * dimZ * 0.45) / 1000));
    const mass = Math.round(vol * 1.25);
    const tris = geom.attributes.position ? geom.attributes.position.count / 3 : 1200;

    setGeometry(geom);
    setDimensions({ x: dimX, y: dimY, z: dimZ });
    setVolumeCm3(vol);
    setTriangleCount(Math.round(tris));
    onDimensionsCalculated?.(`${dimX} × ${dimY} × ${dimZ} mm`, mass, vol);
  };

  // Clipping plane
  const clippingPlane = useMemo(() => {
    const cut = -2 + clipZ * 4;
    return new THREE.Plane(new THREE.Vector3(0, -1, 0), cut);
  }, [clipZ]);

  // Share URL state hash
  const shareState = () => {
    const hash = `#view=${targetView || 'home'}&theme=${backdropTheme}&clip=${clipZ.toFixed(2)}`;
    window.location.hash = hash;
    navigator.clipboard.writeText(window.location.href);
    toast.success('Inspection link copied to clipboard!');
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full rounded-2xl overflow-hidden border transition-colors select-none font-body ${
        backdropTheme === 'dark'
          ? 'bg-[#0B0D10] border-white/10 text-white'
          : 'bg-[#F5F6F8] border-black/10 text-[#0B0D10]'
      } ${className}`}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [3.5, 3.2, 4.0], fov: 38 }}
        gl={{ localClippingEnabled: true, antialias: true }}
      >
        <ambientLight intensity={0.4 * brightness} />
        <directionalLight position={[5, 8, 5]} intensity={2.2 * brightness} color="#FFF8F0" />
        <directionalLight position={[-4, 3, -3]} intensity={1.4 * brightness} color="#FF5A1F" />

        <CameraDirector
          targetView={targetView}
          zoomAction={zoomAction}
          onActionHandled={() => {
            setTargetView(null);
            setZoomAction(null);
          }}
        />

        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
          enableDamping
          dampingFactor={0.05}
        />

        <Center>
          {geometry && (
            <mesh geometry={geometry} castShadow receiveShadow>
              <meshStandardMaterial
                color={initialMaterialColor}
                roughness={0.35}
                metalness={0.12}
                wireframe={wireframe}
                clippingPlanes={clipZ < 0.99 ? [clippingPlane] : []}
                clipShadows
              />
            </mesh>
          )}
        </Center>

        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.45}
          scale={6}
          blur={2.4}
        />
      </Canvas>

      {/* Top Floating View Presets Bar (CADScope Style) */}
      <div className={`absolute top-3 left-3 z-20 flex items-center gap-1 p-1 rounded-xl backdrop-blur-md border shadow-precision-md text-xs ${
        backdropTheme === 'dark'
          ? 'bg-[#12151A]/85 border-white/10 text-white'
          : 'bg-white/92 border-black/10 text-[#111215]'
      }`}>
        {['home', 'top', 'front', 'right', 'left', 'back'].map((v) => (
          <button
            key={v}
            onClick={() => setTargetView(v)}
            className={`px-2.5 py-1 rounded-lg uppercase font-mono text-[10px] transition-colors cursor-pointer ${
              backdropTheme === 'dark'
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-[#5E6573] hover:text-[#111215] hover:bg-black/5'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Top Right Controls (Fullscreen, Share, Theme) */}
      <div className={`absolute top-3 right-3 z-20 flex items-center gap-1.5 p-1 rounded-xl backdrop-blur-md border shadow-precision-md ${
        backdropTheme === 'dark'
          ? 'bg-[#12151A]/85 border-white/10 text-white'
          : 'bg-white/92 border-black/10 text-[#111215]'
      }`}>
        <button
          onClick={() => setBackdropTheme(backdropTheme === 'dark' ? 'light' : 'dark')}
          className={`p-1.5 rounded-lg transition-colors ${
            backdropTheme === 'dark'
              ? 'text-white/70 hover:text-white hover:bg-white/10'
              : 'text-[#5E6573] hover:text-[#111215] hover:bg-black/5'
          }`}
          title="Toggle Studio Backdrop"
        >
          {backdropTheme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={shareState}
          className={`p-1.5 rounded-lg transition-colors ${
            backdropTheme === 'dark'
              ? 'text-white/70 hover:text-white hover:bg-white/10'
              : 'text-[#5E6573] hover:text-[#111215] hover:bg-black/5'
          }`}
          title="Share View Link"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={toggleFullscreen}
          className={`p-1.5 rounded-lg transition-colors ${
            backdropTheme === 'dark'
              ? 'text-white/70 hover:text-white hover:bg-white/10'
              : 'text-[#5E6573] hover:text-[#111215] hover:bg-black/5'
          }`}
          title="Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Bottom Floating CAD Stage Toolbar */}
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 rounded-full backdrop-blur-md border shadow-precision-lg text-xs ${
        backdropTheme === 'dark'
          ? 'bg-[#12151A]/90 border-white/10 text-white'
          : 'bg-white/92 border-black/10 text-[#111215]'
      }`}>
        <button
          onClick={() => setZoomAction('in')}
          className={`p-1.5 rounded-full ${
            backdropTheme === 'dark' ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-[#5E6573] hover:text-[#111215] hover:bg-black/5'
          }`}
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoomAction('out')}
          className={`p-1.5 rounded-full ${
            backdropTheme === 'dark' ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-[#5E6573] hover:text-[#111215] hover:bg-black/5'
          }`}
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <div className={`w-[1px] h-3 ${backdropTheme === 'dark' ? 'bg-white/15' : 'bg-black/10'}`} />
        <button
          onClick={() => setWireframe(!wireframe)}
          className={`px-2 py-0.5 rounded-full font-mono text-[10px] transition-colors ${
            wireframe ? 'bg-[#FF5A1F] text-white font-medium' : backdropTheme === 'dark' ? 'text-white/70 hover:text-white' : 'text-[#5E6573] hover:text-[#111215]'
          }`}
          title="Toggle Mesh Wireframe"
        >
          Wireframe
        </button>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-1.5 rounded-full transition-colors ${
            autoRotate ? 'text-[#FF5A1F] bg-[#FF5A1F]/15' : 'text-white/70 hover:text-white'
          }`}
          title="Auto Rotate"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-3 bg-white/15" />
        {/* Cross-section clipping slider */}
        <div className="flex items-center gap-1.5 px-2">
          <span className="font-mono text-[9px] text-white/50">SECTION</span>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.02"
            value={clipZ}
            onChange={(e) => setClipZ(parseFloat(e.target.value))}
            className="w-16 accent-[#FF5A1F] h-1 bg-white/20 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Collapsible Model Information Panel */}
      {showInfoPanel && (
        <div className="absolute bottom-14 left-3 z-20 p-3.5 rounded-xl bg-[#12151A]/90 backdrop-blur-md border border-white/10 shadow-precision-lg text-white font-mono text-[11px] space-y-1.5 max-w-[240px]">
          <div className="flex items-center justify-between pb-1 border-b border-white/10">
            <span className="text-[10px] text-white/50 uppercase">TELEMETRY</span>
            <span className="text-[#FF5A1F] truncate max-w-[120px]">{partName}</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Dimensions:</span>
            <span className="text-white">{dimensions.x}×{dimensions.y}×{dimensions.z}mm</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Volume:</span>
            <span className="text-white">{volumeCm3} cm³</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Polygons:</span>
            <span className="text-white">{triangleCount.toLocaleString()} Δ</span>
          </div>
        </div>
      )}
    </div>
  );
}

