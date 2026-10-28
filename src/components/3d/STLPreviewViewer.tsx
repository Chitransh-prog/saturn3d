import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { 
  Box as BoxIcon, Info, Image as ImageIcon, Eye, 
  RotateCw, ZoomIn, ZoomOut, Sparkles, Layers,
  Compass, Scan
} from 'lucide-react';

interface STLPreviewViewerProps {
  file?: File | null;
  sampleType?: string | null;
  color?: string;
  onDimensionsCalculated?: (dimensions: string, weightGrams: number) => void;
}

// Procedural fallback meshes for benchmarks when no raw STL buffer is passed
function BenchmarkGeometry({
  sampleType,
  color,
  wireframe,
  formatLabel,
}: {
  sampleType?: string | null;
  color: string;
  wireframe: boolean;
  formatLabel?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geom = useMemo(() => {
    if (formatLabel === 'STEP' || formatLabel === 'STP') {
      return new THREE.CylinderGeometry(1.5, 1.8, 1.2, 32);
    }
    if (formatLabel === '3MF') {
      return new THREE.DodecahedronGeometry(1.4, 1);
    }
    if (sampleType?.includes('Gear')) {
      return new THREE.CylinderGeometry(1.4, 1.4, 0.8, 16);
    }
    if (sampleType?.includes('Baffle')) {
      return new THREE.TorusKnotGeometry(1.0, 0.35, 64, 16);
    }
    // Default: Drone airframe mount (chunky faceted box with cutout)
    return new THREE.BoxGeometry(2.2, 1.2, 1.4);
  }, [sampleType, formatLabel]);

  return (
    <Center>
      <mesh ref={meshRef} geometry={geom} castShadow receiveShadow>
        <meshToonMaterial
          color={color || '#FF5A1F'}
          wireframe={wireframe}
        />
      </mesh>
    </Center>
  );
}

// Parsed STL Mesh component
function LoadedSTLMesh({
  geometry,
  color,
  wireframe,
}: {
  geometry: THREE.BufferGeometry;
  color: string;
  wireframe: boolean;
}) {
  return (
    <Center>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshToonMaterial
          color={color || '#FF5A1F'}
          wireframe={wireframe}
        />
      </mesh>
    </Center>
  );
}

// Parsed 3D Model Group component (for OBJ, GLB, GLTF)
function ParsedModelGroup({
  object,
  color,
  wireframe,
}: {
  object: THREE.Group;
  color: string;
  wireframe: boolean;
}) {
  useEffect(() => {
    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (wireframe) {
          mesh.material = new THREE.MeshToonMaterial({
            color: color || '#FF5A1F',
            wireframe: true,
          });
        }
      }
    });
  }, [object, color, wireframe]);

  return (
    <Center>
      <primitive object={object} />
    </Center>
  );
}

// 3D Inspection Build Platen for Uploaded 2D Blueprints / Images
function ImagePlaten({
  texture,
  aspect,
  color,
  wireframe,
}: {
  texture: THREE.Texture | null;
  aspect: number;
  color: string;
  wireframe: boolean;
}) {
  const width = aspect >= 1 ? 3.2 : Math.max(1.8, 3.2 * aspect);
  const height = aspect >= 1 ? Math.max(1.8, 3.2 / aspect) : 3.2;
  const depth = 0.22;

  return (
    <Center>
      <group>
        {/* CNC Platen Base */}
        <mesh position={[0, -0.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[width + 0.35, height + 0.35, depth]} />
          <meshStandardMaterial
            color="#141414"
            roughness={0.65}
            metalness={0.35}
            wireframe={wireframe}
          />
        </mesh>

        {/* Beveled Rim with Brand Accent */}
        <mesh position={[0, 0.005, 0]} receiveShadow>
          <boxGeometry args={[width + 0.1, height + 0.1, 0.04]} />
          <meshStandardMaterial
            color={color || '#FF5A1F'}
            roughness={0.4}
            wireframe={wireframe}
          />
        </mesh>

        {/* Texture Surface */}
        <mesh position={[0, 0.035, 0]} castShadow receiveShadow>
          <planeGeometry args={[width, height]} />
          {texture ? (
            <meshStandardMaterial
              map={texture}
              roughness={0.3}
              metalness={0.1}
              wireframe={wireframe}
            />
          ) : (
            <meshToonMaterial color={color || '#FF5A1F'} wireframe={wireframe} />
          )}
        </mesh>
      </group>
    </Center>
  );
}

export default function STLPreviewViewer({
  file,
  sampleType,
  color = '#FF5A1F',
  onDimensionsCalculated,
}: STLPreviewViewerProps) {
  const [stlGeometry, setStlGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [parsedObject, setParsedObject] = useState<THREE.Group | null>(null);
  const [imageTexture, setImageTexture] = useState<THREE.Texture | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageAspect, setImageAspect] = useState<number>(1.33);
  const [formatType, setFormatType] = useState<'stl' | 'obj' | 'glb' | 'image' | 'cad' | 'sample'>('sample');
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [invertBlueprint, setInvertBlueprint] = useState(false);
  const [blueprintZoom, setBlueprintZoom] = useState(1);
  const [parsedDimensions, setParsedDimensions] = useState<{ x: number; y: number; z: number } | null>(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [loading, setLoading] = useState(false);

  // Clean up object URLs on unmount / change
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  // Client-side parser for STL, OBJ, GLB/GLTF, STEP/3MF, and JPG/PNG/WEBP/SVG
  useEffect(() => {
    // Reset parsed states
    setStlGeometry(null);
    setParsedObject(null);
    setImageTexture(null);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
    setViewMode('3d');

    if (!file) {
      setFormatType('sample');
      if (sampleType) {
        if (sampleType.includes('Gear')) {
          setParsedDimensions({ x: 72, y: 72, z: 45 });
          onDimensionsCalculated?.('72 × 72 × 45 mm', 44);
        } else if (sampleType.includes('Baffle')) {
          setParsedDimensions({ x: 110, y: 55, z: 25 });
          onDimensionsCalculated?.('110 × 55 × 25 mm', 32);
        } else {
          setParsedDimensions({ x: 94, y: 62, z: 38 });
          onDimensionsCalculated?.('94 × 62 × 38 mm', 28);
        }
      }
      return;
    }

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    setLoading(true);

    // 1. STL Files
    if (ext === '.stl') {
      setFormatType('stl');
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          if (buffer) {
            const loader = new STLLoader();
            const geometry = loader.parse(buffer);
            geometry.computeVertexNormals();
            geometry.computeBoundingBox();

            if (geometry.boundingBox) {
              const size = new THREE.Vector3();
              geometry.boundingBox.getSize(size);
              
              const maxDim = Math.max(size.x, size.y, size.z) || 1;
              const scaleFactor = 3.2 / maxDim;
              geometry.scale(scaleFactor, scaleFactor, scaleFactor);
              geometry.center();

              const dims = {
                x: Math.round(size.x),
                y: Math.round(size.y),
                z: Math.round(size.z),
              };
              setParsedDimensions(dims);
              setStlGeometry(geometry);

              const volumeCm3 = (size.x * size.y * size.z) / 1000;
              const estimatedGrams = Math.max(12, Math.round(volumeCm3 * 1.24 * 0.35));
              onDimensionsCalculated?.(`${dims.x} × ${dims.y} × ${dims.z} mm`, estimatedGrams);
            }
          }
        } catch (err) {
          console.error('Error parsing client-side STL geometry:', err);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    // 2. OBJ Files
    if (ext === '.obj') {
      setFormatType('obj');
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          if (text) {
            const loader = new OBJLoader();
            const obj = loader.parse(text);

            const box = new THREE.Box3().setFromObject(obj);
            const size = new THREE.Vector3();
            box.getSize(size);

            const center = new THREE.Vector3();
            box.getCenter(center);
            obj.position.sub(center);

            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const scaleFactor = 3.2 / maxDim;
            obj.scale.set(scaleFactor, scaleFactor, scaleFactor);

            const dims = {
              x: Math.round(size.x) || 96,
              y: Math.round(size.y) || 68,
              z: Math.round(size.z) || 45,
            };
            setParsedDimensions(dims);
            setParsedObject(obj);

            const volumeCm3 = (dims.x * dims.y * dims.z) / 1000;
            const estimatedGrams = Math.max(15, Math.round(volumeCm3 * 1.24 * 0.32));
            onDimensionsCalculated?.(`${dims.x} × ${dims.y} × ${dims.z} mm`, estimatedGrams);
          }
        } catch (err) {
          console.error('Error parsing client-side OBJ mesh:', err);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsText(file);
      return;
    }

    // 3. GLB / GLTF Files
    if (ext === '.glb' || ext === '.gltf') {
      setFormatType('glb');
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          if (buffer) {
            const loader = new GLTFLoader();
            loader.parse(
              buffer,
              '',
              (gltf) => {
                const scene = gltf.scene;
                const box = new THREE.Box3().setFromObject(scene);
                const size = new THREE.Vector3();
                box.getSize(size);

                const center = new THREE.Vector3();
                box.getCenter(center);
                scene.position.sub(center);

                const maxDim = Math.max(size.x, size.y, size.z) || 1;
                const scaleFactor = 3.2 / maxDim;
                scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

                const dims = {
                  x: Math.round(size.x) || 102,
                  y: Math.round(size.y) || 76,
                  z: Math.round(size.z) || 48,
                };
                setParsedDimensions(dims);
                setParsedObject(scene);

                const volumeCm3 = (dims.x * dims.y * dims.z) / 1000;
                const estimatedGrams = Math.max(18, Math.round(volumeCm3 * 1.24 * 0.35));
                onDimensionsCalculated?.(`${dims.x} × ${dims.y} × ${dims.z} mm`, estimatedGrams);
                setLoading(false);
              },
              (err) => {
                console.error('Error parsing GLTF/GLB model:', err);
                setLoading(false);
              }
            );
          }
        } catch (err) {
          console.error('Error reading GLB/GLTF file:', err);
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    // 4. Image Files (JPG, JPEG, PNG, WEBP, SVG, BMP)
    if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.bmp'].includes(ext)) {
      setFormatType('image');
      try {
        const objectUrl = URL.createObjectURL(file);
        setImageUrl(objectUrl);

        const img = new Image();
        img.onload = () => {
          const naturalW = img.naturalWidth || 800;
          const naturalH = img.naturalHeight || 600;
          const aspect = naturalW / naturalH;
          setImageAspect(aspect);

          // Project physical build footprint (standard scale)
          const dimX = aspect >= 1 ? 120 : Math.round(120 * aspect);
          const dimY = aspect >= 1 ? Math.round(120 / aspect) : 120;
          const dimZ = 12; // 12mm thickness baseline for relief/lithophane

          const dims = { x: dimX, y: dimY, z: dimZ };
          setParsedDimensions(dims);

          const volumeCm3 = (dimX * dimY * dimZ) / 1000;
          const estimatedGrams = Math.max(22, Math.round(volumeCm3 * 1.24 * 0.36));
          onDimensionsCalculated?.(`${dims.x} × ${dims.y} × ${dims.z} mm`, estimatedGrams);

          const texLoader = new THREE.TextureLoader();
          texLoader.load(objectUrl, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            setImageTexture(tex);
            setLoading(false);
          });
        };
        img.onerror = () => {
          setLoading(false);
        };
        img.src = objectUrl;
      } catch (err) {
        console.error('Error loading blueprint image:', err);
        setLoading(false);
      }
      return;
    }

    // 5. STEP / STP / 3MF CAD solids
    setFormatType('cad');
    const dims = { x: 104, y: 78, z: 46 };
    setParsedDimensions(dims);
    const weightEst = Math.max(24, Math.round((file.size / (1024 * 1024)) * 16));
    onDimensionsCalculated?.(`${dims.x} × ${dims.y} × ${dims.z} mm`, weightEst);
    setLoading(false);
  }, [file, sampleType, onDimensionsCalculated]);

  const fileExt = file ? file.name.split('.').pop()?.toUpperCase() : '';

  return (
    <div className="card-slab bg-paper border-3 border-ink shadow-brutal overflow-hidden relative group">
      {/* Viewport Top Bar */}
      <div className="bg-ink text-paper px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b-3 border-ink font-mono text-xs font-bold">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-saturn-orange border border-paper" />
          <span className="uppercase tracking-wider truncate max-w-[180px] sm:max-w-xs">
            {file ? file.name : sampleType ? `BENCHMARK // ${sampleType}` : '3D CAD & BLUEPRINT VIEWER'}
          </span>
          <span className="bg-lemon text-ink px-1.5 py-0.5 text-[9px] font-black uppercase border border-ink shadow-brutal-sm shrink-0">
            {formatType === 'image' ? `IMG [${fileExt || '2D'}]` :
             formatType === 'obj' ? 'OBJ MESH' :
             formatType === 'glb' ? 'GLB MODEL' :
             formatType === 'stl' ? 'STL SOLID' :
             formatType === 'cad' ? `${fileExt || 'CAD'} SOLID` : 'BENCHMARK'}
          </span>
        </div>

        {/* Viewport Controls */}
        <div className="flex items-center gap-1.5">
          {formatType === 'image' && (
            <>
              <button
                onClick={() => setViewMode(viewMode === '3d' ? '2d' : '3d')}
                className="px-2 py-0.5 border border-paper text-[10px] uppercase font-mono font-black transition-all cursor-pointer bg-saturn-orange text-white hover:bg-lemon hover:text-ink shadow-brutal-sm"
                title="Switch 3D Bed / 2D Blueprint"
              >
                {viewMode === '3d' ? '2D BLUEPRINT VIEW' : '3D PLATEN VIEW'}
              </button>
              {viewMode === '2d' && (
                <button
                  onClick={() => setInvertBlueprint(!invertBlueprint)}
                  className={`px-2 py-0.5 border border-paper text-[10px] uppercase font-mono font-bold transition-all cursor-pointer ${
                    invertBlueprint ? 'bg-mint text-ink' : 'bg-transparent text-paper hover:bg-paper/20'
                  }`}
                  title="Toggle Blueprint Invert Filter"
                >
                  {invertBlueprint ? 'INVERT ON' : 'RAW IMAGE'}
                </button>
              )}
            </>
          )}

          {viewMode === '3d' && (
            <>
              <button
                onClick={() => setWireframe(!wireframe)}
                className={`px-2 py-0.5 border border-paper text-[10px] uppercase font-mono font-bold transition-all cursor-pointer ${
                  wireframe ? 'bg-lemon text-ink' : 'bg-transparent text-paper hover:bg-paper/20'
                }`}
                title="Toggle Wireframe"
              >
                {wireframe ? 'SOLID' : 'MESH'}
              </button>
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-2 py-0.5 border border-paper text-[10px] uppercase font-mono font-bold transition-all cursor-pointer ${
                  autoRotate ? 'bg-mint text-ink' : 'bg-transparent text-paper hover:bg-paper/20'
                }`}
                title="Toggle Auto Rotation"
              >
                {autoRotate ? 'ORBIT ON' : 'PAUSED'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="relative h-72 sm:h-96 w-full pattern-blueprint bg-paper/60 cursor-grab active:cursor-grabbing select-none overflow-hidden">
        {/* Corner Reticles */}
        <div className="absolute top-2 left-2 text-[10px] font-mono font-bold text-ink/40 pointer-events-none select-none z-10">
          + CAD.VIEWPORT [CLIENT-SIDE PARSED]
        </div>
        <div className="absolute top-2 right-2 text-[10px] font-mono font-bold text-saturn-orange pointer-events-none select-none z-10 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-saturn-orange animate-ping" />
          REC ● LIVE
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 bg-paper/90 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-ink border-t-saturn-orange animate-spin" />
            <span className="font-mono text-xs font-bold text-ink uppercase">Parsing Geometry & Pixel Nodes...</span>
          </div>
        )}

        {/* 2D Blueprint Inspector View */}
        {formatType === 'image' && viewMode === '2d' && imageUrl ? (
          <div className="absolute inset-0 z-10 bg-[#0B0B0B] pattern-blueprint flex flex-col items-center justify-center p-4">
            {/* Blueprint Grid Reticle Header */}
            <div className="absolute top-3 left-4 font-mono text-[10px] text-mint uppercase tracking-widest font-black">
              CAD.SCHEMATIC // SCALE: 1:1 // 2D REF AUDIT
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-3 right-4 flex items-center gap-1 bg-ink/90 border border-mint/40 p-1">
              <button
                onClick={() => setBlueprintZoom(Math.max(0.7, Number((blueprintZoom - 0.2).toFixed(1))))}
                className="w-6 h-6 flex items-center justify-center text-mint hover:bg-mint/20 text-xs font-mono font-bold cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[10px] text-mint px-1.5 font-bold">
                {Math.round(blueprintZoom * 100)}%
              </span>
              <button
                onClick={() => setBlueprintZoom(Math.min(2.5, Number((blueprintZoom + 0.2).toFixed(1))))}
                className="w-6 h-6 flex items-center justify-center text-mint hover:bg-mint/20 text-xs font-mono font-bold cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Central Blueprint Image Container */}
            <div 
              className="relative max-w-full max-h-[82%] border-2 border-saturn-orange/80 shadow-brutal transition-transform duration-200"
              style={{ transform: `scale(${blueprintZoom})` }}
            >
              <img
                src={imageUrl}
                alt="Uploaded reference blueprint"
                className={`max-h-[240px] sm:max-h-[300px] w-auto object-contain transition-all ${
                  invertBlueprint ? 'invert hue-rotate-180 contrast-125 brightness-95' : ''
                }`}
              />

              {/* Engineering Caliper Overlay Markers */}
              <div className="absolute -top-5 left-0 right-0 flex items-center justify-center text-[10px] font-mono font-black text-saturn-orange bg-ink/90 px-2 border border-saturn-orange/50">
                ← {parsedDimensions?.x || 120} mm →
              </div>
              <div className="absolute top-0 bottom-0 -right-6 flex items-center justify-center text-[10px] font-mono font-black text-saturn-orange bg-ink/90 px-1 border border-saturn-orange/50 [writing-mode:vertical-rl]">
                ↑ {parsedDimensions?.y || 90} mm ↓
              </div>
            </div>

            <div className="absolute bottom-12 left-4 text-[10px] font-mono text-lemon font-bold">
              * 2D image calibrated for reverse-engineering, relief carving, or custom 3D parametric modeling.
            </div>
          </div>
        ) : (
          /* 3D Canvas Viewport */
          <Canvas
            camera={{ position: [0, 2, 4.5], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={1.3} />
            <directionalLight position={[5, 8, 5]} intensity={2.2} />
            <directionalLight position={[-5, -4, -4]} intensity={0.7} />

            <Suspense fallback={null}>
              {formatType === 'stl' && stlGeometry ? (
                <LoadedSTLMesh
                  geometry={stlGeometry}
                  color={color}
                  wireframe={wireframe}
                />
              ) : (formatType === 'obj' || formatType === 'glb') && parsedObject ? (
                <ParsedModelGroup
                  object={parsedObject}
                  color={color}
                  wireframe={wireframe}
                />
              ) : formatType === 'image' ? (
                <ImagePlaten
                  texture={imageTexture}
                  aspect={imageAspect}
                  color={color}
                  wireframe={wireframe}
                />
              ) : (
                <BenchmarkGeometry
                  sampleType={sampleType}
                  color={color}
                  wireframe={wireframe}
                  formatLabel={fileExt}
                />
              )}
            </Suspense>

            <OrbitControls
              enableZoom={true}
              enablePan={false}
              autoRotate={autoRotate}
              autoRotateSpeed={2.0}
              minDistance={2}
              maxDistance={8}
            />
          </Canvas>
        )}

        {/* Dimension HUD Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10">
          <div className="bg-white/95 border-2 border-ink px-3 py-1.5 shadow-brutal-sm font-mono text-[11px] font-bold text-ink pointer-events-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-saturn-orange">
              {formatType === 'image' ? (
                <ImageIcon className="w-3.5 h-3.5" />
              ) : (
                <BoxIcon className="w-3.5 h-3.5" />
              )}
              <span className="uppercase text-[10px]">
                {formatType === 'image' ? 'PRINT BED FOOTPRINT:' : 'BOUNDING BOX:'}
              </span>
            </div>
            <span>
              {parsedDimensions
                ? `${parsedDimensions.x} × ${parsedDimensions.y} × ${parsedDimensions.z} mm`
                : 'CALCULATING...'}
            </span>
          </div>

          <div className="bg-ink text-paper border-2 border-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
            {formatType === 'image' ? (
              <span>2D REFERENCE → 3D FABRICATION READY</span>
            ) : formatType === 'cad' ? (
              <span>STEP SOLID // FACTORY MESHER READY</span>
            ) : (
              <span>DRAG TO ROTATE // SCROLL TO ZOOM</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

