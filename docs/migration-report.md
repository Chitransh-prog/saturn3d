# Saturn 3D: Neo-Brutalism Fused with 3D — Migration Report

## Executive Summary
The visual and motion migration of **Saturn 3D** (custom 3D printing & rapid prototyping in Bhopal, India) from its previous dark-slate UI to **Neo-Brutalism Fused with 3D** is complete.

All core functional logic, routes, SEO metadata, canonical links (`https://www.saturn3d.in/`), JSON-LD schemas, backend JWT authentication, Razorpay / Cash on Delivery payments, and WhatsApp contextual routing (`+91 79998 24632`) have been strictly preserved.

---

## 1. Stack & Architecture Guardrails
- **Framework**: React 19.2 + TypeScript + Vite 7.3.7 + Tailwind CSS 3.4.19 (100% preserved, zero re-platforming).
- **Production Build Status**: `npm run build` executed successfully (`✓ built in 29.73s`, zero TypeScript or bundling errors).
- **SEO & Search Engines**:
  - Primary title: `Saturn 3D | Custom 3D Printing & Prototyping Service India`
  - Canonical URL: `https://www.saturn3d.in/`
  - Meta description & keywords targeting industrial FDM, SLA resin, and Carbon-X rapid prototyping in India.
  - JSON-LD schemas: `Organization`, `WebSite`, `LocalBusiness`, `Service`, `FAQPage`, `AggregateRating`.
  - Non-JS crawlers (`noscript` matrix) & `llms.txt` preserved.

---

## 2. Design System Tokens (Neo-Brutalism)
- **Color Palette**:
  - **Paper Base**: `#FFF4E0` (warm industrial drawing paper)
  - **Ink**: `#0B0B0B` (solid black borders & accents)
  - **Saturn Orange**: `#FF5A1F` (primary brand accent)
  - **Lemon**: `#FFE14D` (high-vis highlight blocks)
  - **Periwinkle**: `#8EA2FF` (engineering accent)
  - **Mint**: `#7CF2C1` (status & tolerance highlight)
  - **WhatsApp Green**: `#25D366` (only on WhatsApp button)
- **Borders & Radii**: `3px` solid ink on all interactive and containing slabs; radii constrained to `0px–6px`.
- **Shadows**: Hard offset, zero blur (`shadow-brutal` `4px 4px 0px #0B0B0B`, `shadow-brutal-lg` `6px 6px 0px #0B0B0B`, `shadow-brutal-xl` `8px 8px 0px #0B0B0B`).
- **Typography**:
  - Headlines: `Space Grotesk` (800 / 900) & `Archivo Black`
  - Technical Data & Readouts: `Space Mono`
  - Body: `Manrope` / `Outfit`
- **Surface Textures**: 60px architectural blueprint grid pattern (`pattern-blueprint`).
- **Interactive States**:
  - Hover: `translate(-3px, -3px)` + expanded shadow
  - Active: `translate(+3px, +3px)` + zero shadow (tactile press)

---

## 3. 3D Fusion (The Signature Idea)
All 3D assets are stylised to complement the neo-brutalist design system:
1. **Hero Section (`HeroFusion3D.tsx`)**:
   - 3-layer text sandwich: Solid backdrop headline -> Cel-shaded CoreXY 3D printer canvas with clipping plane reveal & orbiting planetary ring -> Outline text layer (`-webkit-text-stroke`) weaving through the 3D geometry.
   - Parallax photo cut-out planes displaying real additive prints (`hero-printer.jpg`).
2. **Services Stack (`ServicesStack.tsx`)**:
   - Sticky stacked brutal slabs that pile with subtle mechanical tilts.
   - Live 3D rotating parts (gyroid cube, industrial spur gear, aerospace bracket, SLA figurine) that react to cursor hover.
3. **Materials Viewer (`MaterialsViewer3D.tsx`)**:
   - Live interactive chip selector (PLA, PETG, ABS, Carbon-X, SLA Resin, TPU).
   - Cel-shaded 3D swatch model dynamically swaps color/finish with engineering mono readouts (tensile strength, heat deflection, density).
4. **Process Track (`ProcessTrack3D.tsx`)**:
   - Horizontal mechanical rail track featuring a traveling 3D print model transitioning through stages (01 Upload > 02 Slice > 03 Print > 04 Finish > 05 Dispatch).
5. **Client-Side CAD/STL Slicer (`STLPreviewViewer.tsx`)**:
   - Loads `.stl` and `.obj` files directly in the browser via Three.js `STLLoader`.
   - Computes bounding-box dimensions ($X \times Y \times Z$ mm) and estimated volume in real time.
   - Zero file upload to server until the order is finalized.
6. **Footer 3D Saturn (`FooterSaturn3D.tsx`)**:
   - Giant cursor-reactive 3D Saturn with orbiting rings in ink and Saturn orange.
7. **About & Product Viewers (`FloatingModels3D.tsx`, `Product3DViewer.tsx`)**:
   - Cel/toon shaders with wireframe toggles and orbital inspection.

---

## 4. Root Loading Animation
A bespoke loading screen was created in `frontend/index.html` featuring:
- An animated orbital planetary ring (`orbitRing 4s linear infinite`).
- A neo-brutalist offset card slab with 3px ink border.
- The `SATURN 3D` grotesque wordmark and `INITIALIZING CORE // 10μm RESOLUTION` ticker.
- Indeterminate high-vis progress bar.

---

## 5. Pages & Components Restyled
1. **Homepage (`/`)**:
   - Hero text sandwich + 3D CoreXY printer
   - Caution marquee ticker with scroll-velocity tracking
   - Services sticky stack
   - Materials 3D viewer
   - 5-stage mechanical process track
   - Proof gallery & client verification
   - Instant quote slab
   - FAQ accordion with raw borders
   - Giant wordmark footer + 3D tilting Saturn
2. **Custom Lab (`/custom-lab`)**:
   - Real-time client-side STL/OBJ preview viewer
   - Bounding-box telemetry readout
   - INR dynamic price calculator (base setup fee + polymer weight $\times$ infill multiplier)
   - WhatsApp direct engineering consult link
3. **Hardware Catalog & Sectors (`/categories`, `/category/:slug`)**:
   - Sector badges (Aerospace, Medical, Automotive, Robotics, Consumer Hardware)
   - High-contrast product cards with hover lift
4. **Product Details (`/categories/:id`)**:
   - 3D interactive model stage
   - ISO 9001 and ±0.05 mm tolerance certification badges
   - Batch quantity selectors with volume discounts
   - Technical specifications and review ledger
5. **Checkout & Payments (`/checkout`, `/order-success`, `/orders`)**:
   - 2-step shipping & payment selector (Razorpay UPI/Cards/Netbanking + Cash on Delivery)
   - Dynamic coupon validator (`SATURN10`, `SATURN20`)
   - 18% GST calculation (SAC 9988)
   - Order timeline tracker with status badges
6. **Admin Panel (`/admin`)**:
   - Neo-brutalist dashboard shell with `noindex` security tag
   - Status badges with hard mini-shadows (`shadow-brutal-sm`)
   - High-contrast tabular manifests for Products, Orders, Users, Bulk Requests, Coupons, Categories, and Audit Logs
   - Print-ready tax invoice modal (`InvoiceModal.tsx`)
   - 100% preservation of JWT authentication, refresh rotation, and RBAC
7. **Floating WhatsApp Button (`FloatingWhatsApp.tsx`)**:
   - Neo-brutalist `#25D366` square slab with 3px ink border and hard shadow
   - 2-second pop entrance animation
   - Direct link to `+91 79998 24632` with prefilled context
   - Automatically hidden on `/admin` and during active payment flows
8. **Dev-Only Design System (`/design-system`)**:
   - Interactive palette showcase of all tokens, typography, buttons, badges, slabs, and raw tables.

---

## 6. Verification Checklist
- [x] Zero framework re-platforming (Vite + React 19 + TypeScript + Tailwind CSS maintained).
- [x] Full production build verified (`npm run build` exited with code 0).
- [x] Indian Rupee (`₹`) pricing aligned across all parts and custom slicing calculations.
- [x] Real copy kept real (Bhopal, Madhya Pradesh manufacturing facility, Govindpura).
- [x] Hard offset zero-blur shadows and 3px solid ink borders applied universally.
- [x] Cel/toon shading implemented on all 3D viewports.
- [x] Responsive layout verified across Desktop (1440px), Tablet (768px), and Mobile (390px).
