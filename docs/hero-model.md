# Hero Model Inspection & Technical Report: Saturn Mecha

## 1. Asset Metadata
- **Source File**: `assets-src/tmpoaxsvpt5.glb`
- **Active Model File**: `frontend/public/models/saturn-mecha.glb`
- **Format**: glTF 2.0 Binary (`.glb`)
- **Generator**: Saturn-3D-HyperRealistic-Mecha
- **Source Byte Size**: 34,028,628 bytes (~34.0 MB)

---

## 2. Geometry & Bounding Box
- **Global Scene Bounding Box**:
  - `bboxMin`: `[-0.88024, -0.53344, -0.81218]`
  - `bboxMax`: `[0.78180, 0.59424, 0.84979]`
  - Total local dimensions: Width (X) = 1.662, Height (Y) = 1.128, Depth (Z) = 1.662
- **Individual Meshes**:
  1. **`RobotMesh`** (Child of `MechaRobot` node):
     - Vertex Count: 250,006
     - Triangle Count: 499,523
     - Attributes: `POSITION:f32`, `NORMAL:f32`, `COLOR_0:f32` (vertex colors), `TEXCOORD_0:f32`
     - Bounding Box:
       - Min: `[-0.40284, -0.39433, -0.49301]`
       - Max: `[0.43821, 0.59424, 0.27462]`
       - Dimensions: Width ~ 0.841, Height ~ 0.989, Depth ~ 0.768
     - Material: `RobotTitaniumArmor`
  2. **`RockMesh`** (Child of `RockSummit` node):
     - Vertex Count: 250,573
     - Triangle Count: 500,477
     - Attributes: `POSITION:f32`, `NORMAL:f32`, `COLOR_0:f32` (vertex colors), `TEXCOORD_0:f32`
     - Bounding Box:
       - Min: `[-0.88024, -0.53344, -0.81218]`
       - Max: `[0.78180, -0.38654, 0.84979]`
       - Dimensions: Width ~ 1.662, Height ~ 0.147, Depth ~ 1.662
     - Material: `RockSummitSandstone`

- **Total Vertices**: 500,579
- **Total Triangles**: 1,000,000

---

## 3. Materials & Textures
- **Textures**: None embedded. Coloration is driven by `COLOR_0:f32` vertex color attributes containing the cyan visor illuminator, graphite mechanical joints, and white armor plating.
- **Materials**:
  1. `RobotTitaniumArmor`: PBR Metallic-Roughness (Base Color `#FFFFFF`, Metalness `0.65`, Roughness `0.22`, Opaque).
  2. `RockSummitSandstone`: PBR Metallic-Roughness (Base Color `#FFFFFF`, Metalness `0.05`, Roughness `0.88`, Opaque).

---

## 4. Rigging & Animation Clips
- **Bones / Joints**: 0 (Static rigid mesh, no skinning or inverse kinematics).
- **Skinned Meshes**: 0
- **Animation Clips**: None found.
- **Motion Implementation Plan**:
  - Procedural interactive motion implemented in `@react-three/fiber`:
    - Natural breathing floating scale / subtle Y-float (`+/-0.05` units).
    - Mouse pointer look-at yaw (`max 12 deg`) and pitch (`max 6 deg`) with smooth spring lerping.
    - Slicing plane shader print-reveal on load driven by GSAP timeline.
    - Orbit control / drag-to-rotate with spring back.

---

## 5. Model Normalization Rules
To ensure consistent rendering without hardcoded machine magic numbers:
1. Compute `THREE.Box3().setFromObject(scene)` at runtime.
2. Measure `size = box.getSize(new THREE.Vector3())` and `center = box.getCenter(new THREE.Vector3())`.
3. Normalize scale factor: `scale = 2.6 / size.y`.
4. Center X and Z: translate scene by `-center.x`, `-center.z`.
5. Ground feet/pedestal: place bottom `box.min.y` at `y = 0.0`.
6. Orient model facing camera along `+Z`.
