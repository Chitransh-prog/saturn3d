# Saturn 3D Hero Diagnostics Report (Phase 0)

**Date**: 2026-10-28  
**Viewport Evaluated**: 1920x870 Desktop (and responsive matrix)  
**Live Evidence Capture**: `docs/hero-live-diagnose.png`

---

## 1. Summary of Identified Defects & Evidence

| # | Known Problem | Root Cause Analysis | Code Evidence / Location |
|---|---|---|---|
| **1** | **Mecha + ring cover middle of "SATURN" headline ("URN" unreadable)** | Centered single-column hero stack (`Hero.tsx` lines 148–202). The `<h1>` is laid out horizontally behind a centered Canvas wrapper (`w-full h-[600px]`), placing the 3D mecha and its ring directly over letters 'A', 'T', 'U', 'R'. | `src/sections/Hero.tsx:151-174`, `src/sections/Hero.tsx:177-195` |
| **2** | **Mecha renders muddy teal/blotchy with no toon bands and no ink outline** | 1. **Cool Lights**: Cool directional light `#93C5FD` and cyan point light `#00F0FF` cast cyan/teal shadows. <br>2. **Material Mismatch**: `MeshStandardMaterial` is applied instead of `MeshToonMaterial` (`HeroStage3D.tsx:244`). The prepared 3-step `gradientMap` was never assigned. <br>3. **Tone Mapping**: Tone mapping was left at default (filmic) without flat clamp. `renderer.outputColorSpace` and `toneMapping = THREE.NoToneMapping` were missing. <br>4. **Vertex Colors**: Photogrammetry vertex colors (`COLOR_0`) containing cyan visor bleeding and scan noise were passed raw into PBR. <br>5. **No Outlines**: `<Outlines>` was never attached to `RobotMesh`. | `src/components/HeroStage3D.tsx:244-252`<br>`src/components/HeroStage3D.tsx:415, 417`<br>`src/components/HeroStage3D.tsx:196-212` |
| **3** | **Ring looks like a flat arch cut off at bottom, not orbiting 3D ring** | Uses 2D planar `<ringGeometry args={[1.16, 1.34, 64]} />` rather than a 3D `<torusGeometry>`. Being a 2D plane tilted at -24°, the lower half intersects the ground plane/rock mound, creating a chopped arch appearance without volumetric thickness. | `src/components/HeroStage3D.tsx:139, 153, 167` |
| **4** | **Pink floor disc cropped at hairline edge; 5+ random clip-art props** | 1. **Mound/RockMesh**: The GLB asset contains a secondary mesh `RockMesh` (`RockSummitSandstone`) with pinkish/sand vertex colors. <br>2. **Stage Floor Discs**: `StageFloor()` renders multiple concentric circles and rings (`args={[1.05, 36]}`, `args={[1.35, 48]}`). <br>3. **Hairline Crop**: `Hero.tsx` has `hairline-t` at line 213, cutting across the canvas. <br>4. **Prop Clutter**: 5 distinct props tumble randomly, one overlapping the "3D" text. | `src/components/HeroStage3D.tsx:71-105`<br>`src/components/HeroStage3D.tsx:255-264`<br>`src/components/HeroStage3D.tsx:347-373`<br>`src/sections/Hero.tsx:213` |
| **5** | **Hero taller than viewport; copy half cut off and CTAs below fold** | Vertical layout stacks navbar (80px) + top eyebrow (36px) + 3D stage (600px) + bottom copy block (180px) + transition label (60px) + padding (80px), totaling >1050px. At 1920x870 viewport, copy overflows and CTAs are completely pushed below the fold. | `src/sections/Hero.tsx:130, 148, 213` |
| **6** | **WhatsApp button collides with Netlify badge; fake red "1"** | 1. `FloatingWhatsApp.tsx` hardcodes an artificial `<span ref={badgeRef}>1</span>` unread badge. <br>2. Fixed position (`bottom-[76px] right-4`) collides with bottom overlays including Netlify's injected badge. Needs safe-area and right-offset positioning. | `src/components/FloatingWhatsApp.tsx:115, 162-167` |

---

## 2. GLB Asset Technical Profile

- **Asset Path**: `saturn-3d-main/public/models/saturn-mecha.glb` (930.9 KB, meshopt-compressed).
- **Nodes**:
  - `MechaRobot` (mesh index 0): The main robot character.
  - `RockSummit` (mesh index 1): The sandstone/pink mound pedestal underneath.
- **RobotMesh Geometry**:
  - Triangles: ~499,523
  - Vertex Attributes: `POSITION:f32`, `NORMAL:f32`, `COLOR_0:f32` (RGB vertex colors).
  - Textures: 0 (No external PNG/JPG textures; coloration is vertex-color based).
- **Diagnostics Resolution**:
  - **Hide `RockSummit` / `RockMesh`**: Eliminate the pinkish lumpy floor mound entirely.
  - **Box3 Normalization**: Measure bounds strictly from `RobotMesh` so feet rest exactly on `y = 0.0` with height normalized to 3.0 units.
  - **Color by Role / Shader Luminance Remap**:
    - Armor/Plating: Off-white `#F2EEE6` with 3-step toon ramp.
    - Joints/Actuators/Cables: Ink `#1A1A1A` 2-step toon ramp.
    - Visor/Core Lights: Brand Orange `#FF5A1F` emissive glow.
  - **Inverted Hull / Drei Outlines**: Render 2.5px crisp ink outline `#0B0B0B`.

---

## 3. Architecture Plan for Phase 1 to Phase 6

1. **Phase 1: 12-Column Split Hero Layout**:
   - `height: calc(100svh - 5rem)` (fits in 1 screen, zero scrolling required for H1, copy, and CTAs at heights >= 650px).
   - Left cols (1–6): Eyebrow, H1 on 2 lines ("SATURN" ink / "3D" orange), tagline "PRINT THE IMPOSSIBLE" solid orange, copy (max 46ch), dual CTAs (brutal primary + underline secondary), inline mono spec line.
   - Right cols (6–12): 3D stage occupying 70–75% height with 10% breathing margin. Ring edge touches end of "SATURN", obscuring <25% of any letter.
2. **Phase 2: Mecha Toon Shading & Outlines**:
   - `gl.toneMapping = THREE.NoToneMapping`, `gl.outputColorSpace = THREE.SRGBColorSpace`.
   - Lights: Warm key `#FFF1D6` (top-left-front), low hemisphere fill, orange rim `#FF5A1F` (back-right). Remove cool/teal lights.
   - Separate mesh parts / shader luminance segmentation, 3-step gradient map with `NearestFilter`, ink outlines.
3. **Phase 3: Real Torus Ring & Stage Elements**:
   - Ring: Full 3D `TorusGeometry(radius, 0.09, 32, 128, Math.PI * 2)` in `#FF5A1F` + lemon secondary ring (`tube 0.04`). Tilted -20° X, 12° Z. True depth testing.
   - Stage: Lemon `#FFE14D` flat backdrop circle behind mecha; contact shadow ellipse (`#0B0B0B`, 18% opacity, zero blur) under feet.
   - Props: Max 3 flat outlined props (cube, octahedron, bolt) in lemon, periwinkle, mint. Hidden on mobile. Small "DRAG TO ROTATE" mono label.
4. **Phase 4: Interaction**:
   - Orbit drag damping 0.08, polar angle clamped 80–100°, auto-rotate (0.6) after 3s idle with gentle return. Parallax head tracking.
5. **Phase 5: GSAP Motion**:
   - Clean intro timeline <= 2.4s (H1 rise -> lemon disc scale -> print-reveal -> copy & CTAs fade). MatchMedia, reduced-motion fallback.
6. **Phase 6: WhatsApp Fix**:
   - Position `right: 20px`, `bottom: calc(20px + env(safe-area-inset-bottom))`. Remove fake red "1". Offset from Netlify badge.
