# UI & Technical Audit: Saturn 3D (Neo-Brutalist 3D Migration Baseline)

> **Target Site**: https://saturn-3d.netlify.app/ (Canonical: https://www.saturn3d.in/)  
> **Brand**: Saturn 3D &mdash; Custom 3D Printing & Rapid Prototyping Service, India (Bhopal, MP)  
> **Contact**: WhatsApp `+91 79998 24632` &bull; `hello@saturn3d.in`  
> **Date**: October 2026 Baseline  
> **Migration Goal**: Migrate dark-slate / soft-studio aesthetic to **Neo-Brutalism Fused with 3D**, keeping all existing routes, SEO metadata, JSON-LD, JWT admin logic, and WhatsApp prefill logic intact.

---

## 1. Existing Tech Stack & Framework Detection

| Layer | Detected Technology | Version / Config | Status for Migration |
| :--- | :--- | :--- | :--- |
| **Framework** | React + TypeScript + Vite | React 19.2.0, Vite 7.2.4, TS 5.9.3 | **Keep** &mdash; No re-platforming |
| **Routing** | React Router DOM | v7.14.1 (with legacy `/products` and `/sector` redirects) | **Preserve** all routes and redirects |
| **Styling** | Tailwind CSS 3.4.19 + CSS Variables | `@layer base` CSS vars, `tailwindcss-animate` | **Restyle** to Neo-Brutalist token set |
| **3D Rendering** | Three.js + R3F + Drei | `three@0.184.0`, `@react-three/fiber@9.6.0`, `@react-three/drei@10.7.7` | **Preserve & restyle** to cel/toon shading |
| **Motion** | GSAP 3.15.0 + ScrollTrigger | `gsap.context`, `ScrollTrigger`, Lenis smooth scroll | **Restyle** to snappy brutalist easing |
| **State** | Zustand 5.0.12 | `authStore`, `cartStore` with localStorage persistence | **Preserve** unchanged |
| **Auth & Admin** | JWT auth, Bearer tokens, RBAC | Admin panel at `/admin/*`, protected routes | **Preserve** all auth/API logic |
| **Backend** | Express + PostgreSQL / Neon | Order processing, file uploads, Razorpay/Stripe, coupons | **Untouched** |

---

## 2. Section-by-Section Inventory (Exact Scroll Order)

### 01. Global Navigation (`<Navigation />`)
- **Visuals**: Sticky frosted bar, dark-slate background with subtle 1px border.
- **Brand Mark**: Saturn planetary ring icon with "Saturn 3D" wordmark.
- **Nav Links**:
  - `Home` (`/`)
  - `Categories` (`/categories` with dropdown: All Categories, Precision Mechanical, Scale Enclosures, Resin Detail, Carbon-X Drone)
  - `Custom Lab` (`/custom-lab`)
  - `About` (`/about`)
- **Actions**:
  - `Bulk Quote` button (opens modal)
  - Cart toggle button with dynamic badge count pill
  - `Sign In` / User Account menu
- **Mobile Behavior (390px)**: Collapses into hamburger drawer; displays stacked links and quick contact.

### 02. Hero Section (`<Hero />`)
- **Eyebrow Badge**: `FROM CONCEPT TO COSMOS` with pulsing dot.
- **Main Headline**: `PRINT THE IMPOSSIBLE` (oversized uppercase display).
- **Subheadline**: *"Professional-grade 3D printing with micron-level precision. Upload, configure, and receive industrial parts in record time."*
- **Primary CTAs**:
  - `Launch Custom Lab` &rarr; routes to `/custom-lab`
  - `Browse Catalog` &rarr; routes to `/categories`
- **Micro Stats Bar**:
  - Precision: `10μm`
  - Uptime: `99.9%`
  - Lab Status: `Active`
- **3D Canvas**: Three.js WebGL canvas displaying interactive CoreXY 3D printer model, layer-by-layer progressive print reveal, nozzle glow, and orbiting wireframe elements.
- **Floating Overlays**:
  - Layer Resolution / Micron Precision badge (`10μm`)
  - Active Print Farm / 5.2k+ Parts Shipped with client avatar stack

### 03. Partner / Trust Marquee (`<LogoTicker />`)
- **Eyebrow**: `STRATEGIC PARTNERSHIPS IN INDUSTRIAL HARDWARE`
- **Content**: Continuous horizontal marquee of industrial manufacturing partners and technology brands.

### 04. Visual Archive / Print Gallery (`<Gallery />`)
- **Eyebrow Badge**: `VISUAL ARCHIVE`
- **Headline**: `PRECISION IN MOTION.`
- **Subheadline**: *"A collection of manufactured artifacts, industrial prototypes, and material studies captured directly from our print laboratory."*
- **Filter Tabs**: `All`, `Engineering`, `Architecture`, `Medical`, `Art`
- **Media**: Real high-resolution camera photography and video captures of genuine 3D printed parts (FDM lattice, SLA clear resin, carbon-fiber drone arm, titanium bracket, gear assemblies).
- **Interactions**: Lightbox modal expansion on image click.

### 05. Standard Catalog & Engineered Components (`<Categories />`)
- **Eyebrow Badge**: `INDUSTRIAL HARDWARE & PROTOTYPING`
- **Headline**: `Engineered Parts & Precision Prints`
- **Subheadline**: *"Explore our catalog of functional prototypes, high-density enclosures, and structural components manufactured with micron-level fidelity."*
- **Real Products with Exact Pricing**:
  1. *Hexagonal Carbon Vase* &mdash; ₹49.00 / $49.00 (Carbon-Fiber PLA, &plusmn;0.08mm)
  2. *Tech Organizer Elite* &mdash; ₹42.00 / $42.00 (Matte Industrial PETG, &plusmn;0.1mm)
  3. *Industrial Chassis V1* &mdash; ₹119.00 / $119.00 (ABS-ESD Flame Retardant, &plusmn;0.05mm)
  4. *Monolithic Heavy Bookends* &mdash; ₹58.00 / $58.00 (Stone-Filled PLA, &plusmn;0.1mm)
  5. *Urban Planning Facade Scale* &mdash; ₹165.00 / $165.00 (Engineering SLA Tough Resin, &plusmn;0.04mm)
  6. *Precision Flexible Couplings* &mdash; ₹24.00 / $24.00 (TPU 95A Industrial, &plusmn;0.05mm)
  7. *Planetary Gear Reducer Kit* &mdash; ₹68.00 / $68.00 (Nylon PA12 / Carbon, &plusmn;0.08mm)
  8. *Parametric Fractal Planter* &mdash; ₹36.00 / $36.00 (Bio-Polymer Matte PLA, &plusmn;0.1mm)
  9. *Modular Pen & Caliper Station* &mdash; ₹32.00 / $32.00 (Recycled Stealth Matte Black PETG, &plusmn;0.1mm)
- **CTAs**: `Add to Cart`, `Bulk Inquiry` (launches context-aware WhatsApp inquiry).

### 06. Industry Sectors & Applications (`<Sectors />`)
- **Eyebrow Badge**: `INDUSTRIAL SECTORS & APPLICATIONS`
- **Headline**: `Production Solutions at Scale`
- **Subheadline**: *"From consumer electronics prototyping to aerospace brackets and architectural scale models, we engineer hardware tailored to exacting domain demands."*
- **Sectors**:
  - *Aerospace & Drone* &mdash; Carbon-reinforced airframes, lightweight avionics brackets.
  - *Medical & Bio-Models* &mdash; High-precision anatomical study replicas, surgical fixtures.
  - *Automotive & EV* &mdash; Heat-deflection manifolds, ducting prototypes, cable harnesses.
  - *Consumer Electronics* &mdash; Snap-fit enclosures, PCB standoff alignment, handheld verification.
  - *Architecture & Facades* &mdash; Micro-detail elevation studies, kinetic facade assemblies.
  - *Tooling & Fixtures* &mdash; Assembly jigs, CMM inspection nests, robotic end-effectors.

### 07. The Operation Protocol (`<HowItWorks />`)
- **Eyebrow Badge**: `THE OPERATION PROTOCOL`
- **Headline**: `ENGINEERING PRECISION.`
- **Subheadline**: *"A standardized workflow designed for industrial reliability and unmatched additive manufacturing performance."*
- **Steps**:
  1. `01. Upload Your Model` &mdash; Drag and drop STL, OBJ, or 3MF. Automated design mesh validation.
  2. `02. Choose Your Settings` &mdash; Select material, color, and layer height. Instant pricing and machine time estimate.
  3. `03. Get Your Print` &mdash; Rapid dispatch with protective ESD vacuum sealing and real-time tracking.

### 08. Custom CAD Lab & Instant Quotation (`<CustomUpload />`)
- **Dropzone**: Accepts `.STL`, `.STEP`, `.STP`, `.OBJ`, `.3MF`. Client-side mesh bounding-box parsing and volume calculation.
- **Material Selection**: PLA (₹3.50/g), PETG (₹5.00/g), ABS-ESD (₹8.00/g), Carbon-X PA12 (₹25.00/g), Ultra-SLA Resin (₹18.00/ml).
- **Parameters**: Layer height (0.08mm &ndash; 0.28mm), Infill Density (10% &ndash; 100%), Quantity counter.
- **Dynamic Calculation**: Instant price, machine run-time, weight readout, and direct Add-to-Cart / WhatsApp submit.

### 09. Verified Client Social Proof (`<Testimonials />`)
- **Eyebrow Badge**: `OPERATIONAL FEEDBACK`
- **Headline**: `TRUSTED BY OPERATORS.`
- **Client Reviews (Real Preserved Content)**:
  - **Arjun Mehta** (Operations Director, Precision Dynamics): *"The industrial parts we received were highly accurate and delivered on time. Saturn3D has become an indispensable additive partner for our rapid manufacturing cycles."* (5/5 Stars)
  - **Kavya Nair** (Principal Architect, Studio Form): *"Their architectural scale models allowed us to present complex kinetic facades beautifully. The surface fidelity and dimensional accuracy exceeded expectations."* (5/5 Stars)
  - **Rohan Khanna** (Co-Founder, AeroNest Robotics): *"Saturn3D supported our drone prototyping with impressive speed and precision. The Carbon-X parts fit perfectly on the first print, eliminating costly CNC revisions."* (5/5 Stars)

### 10. Frequently Asked Questions (`<FAQSection />`)
- **Questions**:
  1. *How much does custom 3D printing cost in India?*
  2. *What file formats can I upload for 3D printing?*
  3. *What is the turnaround time for prototypes?*
  4. *What tolerances can Saturn 3D achieve?*
  5. *Do you offer small batch production in India?*
  6. *Where is Saturn 3D located?*

### 11. Conversion Call-to-Action (`<CTA />`)
- **Eyebrow Badge**: `NETWORK READY`
- **Headline**: `READY TO INITIALIZE?`
- **Subheadline**: *"Upload your blueprint and bridge the gap between digital precision and physical reality."*
- **CTAs**: `START PRINTING` (`/custom-lab`) and `INDUSTRIAL BULK ORDER` (modal).

### 12. Global Footer (`<Footer />`)
- **Brand Statement**: *"Forging the future of physical intelligence through precision hardware."*
- **Location**: Industrial Area, Govindpura, Bhopal, Madhya Pradesh 462023, India.
- **Contact**: `+91 79998 24632` &bull; `hello@saturn3d.in`
- **Live Status**: `● Print Farm Online • 99.98% Uptime`

---

## 3. Persistent Global Widgets & Interactivity

### WhatsApp Floating Action Widget (`<FloatingWhatsApp />`)
- **Current Styling**: Circular 56px FAB in green `#25D366` with soft shadow, pulse ring, and greeting tooltip.
- **Logic**: Target `https://wa.me/917999824632?text=...` with intelligent contextual prefill:
  - Cart has items: lists item count and names.
  - Category page: includes current category name.
  - Custom Lab: asks for engineering tolerance review.
  - Default: general additive manufacturing query.
- **Route Exclusion**: Hidden on `/admin/*` and `/checkout`.
- **Neo-Brutalist Plan**: Re-skin to square-ish slab with 3px solid ink border, `#25D366` flat fill, hard 4px offset ink shadow, "CHAT" mono tag on desktop, snappy hover press, keeping exact pre-fill logic and phone number.

---

## 4. Current Aesthetics vs. Neo-Brutalist Target

| Element | Current Dark-Slate / Soft Studio | Neo-Brutalist Target |
| :--- | :--- | :--- |
| **Base Background** | Off-white `#fafafa` / Slate `#0f172a` | Paper `#FFF4E0` flat base fill |
| **Foreground / Ink** | Slate-900 `#0f172a` / White | Deep ink `#0B0B0B` |
| **Primary Accent** | Saturn Orange `#F7931E` | Vibrant Saturn Orange `#FF5A1F` |
| **Secondary Accents** | Slate-500, soft blues | Lemon `#FFE14D`, Periwinkle `#8EA2FF`, Mint `#7CF2C1` |
| **Borders** | 1px soft gray `border-slate-200` | 3px solid Ink `#0B0B0B` |
| **Border Radius** | `rounded-2xl` (16px), `rounded-3xl` (24px) | Crisp 0px to 6px (hard corners, deliberate mix) |
| **Shadows** | Soft blurred `box-shadow: 0 20px 40px rgba(0,0,0,0.08)` | Hard zero-blur offset: `4px 4px 0 #0B0B0B`, `6px 6px 0 #0B0B0B` |
| **Typography** | Outfit + Manrope | Oversized Grotesque Display (`Space Grotesk Bold` / `Archivo Black`) + `Space Mono` |
| **3D Aesthetic** | Photoreal PBR, metallic reflections | Cel/toon shaded, thick ink outlines, flat palette colors |
| **Motion** | Smooth floaty fade-ins | Snappy, punchy easing (`power4.out`, `back.out(1.7)`), 0.25-0.5s |

---

## 5. Viewport Audit (1440px / 768px / 390px)

### Desktop (1440px)
- Multi-column grids (12-column system, 3-column product cards, 2-column hero with 3D canvas on the right).
- Full interactive WebGL CoreXY 3D printer canvas with layer-by-layer progressive print reveal.
- Desktop navigation with dropdown menus and instant action buttons.

### Tablet (768px)
- Responsive 2-column grid adaptation.
- 3D canvas scales down to prevent horizontal overflow.
- Navigation remains accessible with condensed padding.

### Mobile (390px)
- Single-column vertical stacked flow.
- Navigation folds into slide-down brutalist drawer.
- Floating WhatsApp button stays pinned at bottom-right with safe-area insets.
- Heavy 3D canvas switches to lightweight low-drawcall cel model or static poster fallback on low-power devices.
- Sticky bottom "GET A QUOTE" action bar for instant mobile conversion.

---

## 6. Performance & Lighthouse Baseline

- **Current Bundle Weight**: `dist/assets/index.js` ~ 2.38 MB minified (~675 kB gzip), `index.css` ~ 141 kB.
- **LCP Target**: Under 2.5s. Achieved by ensuring primary H1 and hero poster render immediately in static HTML before WebGL compiles.
- **CLS Target**: Under 0.1. Fixed aspect ratio containers for 3D canvas and media cards.
- **Accessibility**: 3px hard borders and high-contrast ink `#0B0B0B` on paper `#FFF4E0` guarantee WCAG AAA contrast ratio (> 12:1).

---

## 7. Preservation Checklist & Verification
- [x] `<title>`: `Saturn 3D | Custom 3D Printing & Prototyping Service India`
- [x] `<meta name="description">`: `"Precision custom 3D printing & rapid prototyping service in India. Industrial FDM, SLA resin & Carbon-X parts with micron accuracy. Instant CAD quote."`
- [x] `<link rel="canonical">`: `https://www.saturn3d.in/`
- [x] All OpenGraph and Twitter cards preserved.
- [x] Full JSON-LD structured data (`Organization`, `WebSite`, `LocalBusiness`, `Service`, `FAQPage`) preserved.
- [x] `sitemap.xml`, `robots.txt`, `llms.txt`, `_redirects` preserved.
- [x] All genuine copy preserved: "Industrial FDM, SLA resin and Carbon-X parts", micron accuracy, instant CAD quote, express nationwide delivery. No invented stats or prices.
