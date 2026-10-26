# Live Site Audit: Saturn 3D (saturn3d.in)

> **Audit Date**: October 2026  
> **Target URL**: https://www.saturn3d.in/  
> **Local Reference**: Local environment running on `http://localhost:5173`  
> **Brand**: Saturn 3D — *"The Future of Precision Printing"*  
> **Headquarters / Operations**: Bhopal, Madhya Pradesh, India  
> **Contact**: `+91 79998 24632` (WhatsApp) • `hello@saturn3d.in`

---

## 1. Sitemap & Section-by-Section Inventory

The current live site operates as a single-page marketing application with client-side routed sub-views:

| Route | Page Name | Primary Objective |
| :--- | :--- | :--- |
| `/` | Home Landing Page | Brand positioning, 3D visual hook, services overview, catalog preview, social proof, CTA |
| `/categories` | Hardware Catalog | Complete collection of standard 3D printed components with live search & filters |
| `/categories/:id` | Product Specification Detail | High-resolution imagery, material selector, batch pricing tiers, technical specs tab |
| `/custom-lab` | Custom CAD Upload Studio | Drag-and-drop CAD analysis (.STL, .OBJ, .3MF, .STEP), material selection, infill density, live quotation |
| `/category/:slug` | Industry Sector View | Focused solutions for aerospace, automotive, medical, electronics, architecture, and tooling |
| `/about` | Protocol & About Studio | Brand philosophy ("Redefining Materiality"), core principles, vision metrics |
| `/cart` (drawer) | Order Manifest | Slide-over cart with free delivery calculation, options summary, and checkout actions |
| `/checkout` | Secure Checkout | Shipping address capture and Stripe gateway redirect |
| `/login` / `/register` | Authentication | Account management and order tracking |
| `/orders` | Order History | Customer dashboard for tracking active fabrication jobs |

---

### Home Page Sections (in exact scroll order)

#### A. Global Navigation (`<Navigation />`)
- **Logo**: Saturn 3D logomark (Saturn planetary ring icon + "Saturn 3D")
- **Links**: `Home`, `Categories` (dropdown with domain links), `Custom Lab`, `About`
- **Actions**:
  - `Bulk Quote` modal trigger
  - Cart toggle with dynamic count pill
  - `Sign In` / User Account menu

#### B. Hero Section (`<Hero />`)
- **Badge**: `From Concept to Cosmos` (with glowing radar pulse indicator)
- **Primary Headline**: `PRINT THE IMPOSSIBLE` (gradient accent on "IMPOSSIBLE")
- **Subhead**: *"Professional-grade 3D printing with micron-level precision. Upload, configure, and receive industrial parts in record time."*
- **CTAs**:
  - Primary CTA: `Launch Custom Lab` (routes to `/custom-lab`)
  - Secondary CTA: `Browse Catalog` (routes to `/categories`)
- **Micro Stats Bar**:
  - Precision: `10μm`
  - Uptime: `99.9%`
  - Lab Status: `Active`
- **Interactive 3D Stage**: WebGL / Three.js interactive coreXY 3D printer model with nozzle heat glow, rotating filament spool, and shader-based progressive layer growth.
- **Floating Status Widgets**:
  - Widget 1: *Layer Resolution / Micron Precision (10μm)*
  - Widget 2: *Active Print Farm / 5.2k+ Parts Shipped* (with verified team avatars)

#### C. Industrial Partners & Technology Marquee (`<LogoTicker />`)
- **Header**: `Strategic Partnerships In Industrial Hardware`
- **Marquee Cards**: Continuous velocity-aware ticker displaying industrial icons and technology partners (TechCorp, GlobalMfg, InnovateInc, WorldWide, BuildCo).

#### D. Visual Archive & Laboratory Gallery (`<Gallery />`)
- **Badge**: `Visual Archive`
- **Headline**: `PRECISION IN MOTION.`
- **Subhead**: *"A collection of manufactured artifacts, industrial prototypes, and material studies captured directly from our print laboratory."*
- **Media Assets**: 32 high-resolution workshop captures and videos demonstrating live FDM extrusions, SLA clear resin curing, compound gear teeth, and structural lattices. Includes lightbox expand view.

#### E. Standard Catalog & Engineered Components (`<Categories />`)
- **Badge**: `Industrial Hardware & Prototyping`
- **Headline**: `Engineered Parts & Precision Prints`
- **Subhead**: *"Explore our catalog of functional prototypes, high-density enclosures, and structural components manufactured with micron-level fidelity."*
- **Live Search & Filter Controls**: Real-time keyword search, sort options (Featured, Price Low-High, Price High-Low), and category filters.
- **Real Products with Exact Pricing**:
  1. *Hexagonal Carbon Vase* — **$49.00** (Carbon-Fiber PLA, ±0.08mm)
  2. *Tech Organizer Elite* — **$42.00** (Matte Industrial PETG, ±0.1mm)
  3. *Industrial Chassis V1* — **$119.00** (ABS-ESD Flame Retardant, ±0.05mm)
  4. *Monolithic Heavy Bookends* — **$58.00** (Stone-Filled PLA, ±0.1mm)
  5. *Urban Planning Facade Scale* — **$165.00** (Engineering SLA Tough Resin, ±0.04mm)
  6. *Precision Flexible Couplings* — **$24.00** (TPU 95A Industrial, ±0.05mm)
  7. *Planetary Gear Reducer Kit* — **$68.00** (Nylon PA12 / Carbon, ±0.08mm)
  8. *Parametric Fractal Planter* — **$36.00** (Bio-Polymer Matte PLA, ±0.1mm)
  9. *Modular Pen & Caliper Station* — **$32.00** (Recycled Stealth Matte Black PETG, ±0.1mm)
- **Card CTAs**: `Add to Cart`, `Bulk` (launches pre-filled WhatsApp inquiry)

#### F. Industry Sectors & Solutions at Scale (`<Sectors />`)
- **Badge**: `Industrial Sectors & Applications`
- **Headline**: `Production Solutions at Scale`
- **Subhead**: *"From consumer electronics prototyping to aerospace brackets and architectural scale models, we engineer hardware tailored to exacting domain demands."*
- **Sectors Covered**:
  1. *Aerospace & Drone* — Carbon-reinforced airframes and vibration-damping sensor pods.
  2. *Medical & Bio-Models* — Precision anatomical structures and ergonomic surgical fixtures.
  3. *Automotive & EV* — Heat-deflection manifolds, ducting prototypes, and sensor brackets.
  4. *Consumer Electronics* — Snap-fit enclosures, rapid ergonomics testing, and production jigs.
  5. *Architecture & Facades* — Micro-detail elevation studies and complex kinetic facade assemblies.
  6. *Tooling & Fixtures* — Assembly jigs, CMM inspection nests, and robotic end-effectors.

#### G. The Operation Protocol (`<HowItWorks />`)
- **Badge**: `The Operation Protocol`
- **Headline**: `ENGINEERING PRECISION.`
- **Subhead**: *"A standardized workflow designed for industrial reliability and unmatched additive manufacturing performance."*
- **Steps**:
  - `01. Upload Your Model` — Drag and drop STL, OBJ, or 3MF. Automated design mesh validation.
  - `02. Choose Your Settings` — Select material, color, and layer height. Instant pricing and machine time estimate.
  - `03. Get Your Print` — Rapid dispatch with protective ESD vacuum sealing and real-time tracking.

#### H. Operational Feedback & Social Proof (`<Testimonials />`)
- **Badge**: `Operational Feedback`
- **Headline**: `TRUSTED BY OPERATORS.`
- **Verified Client Reviews**:
  - **Arjun Mehta** (Operations Director, Precision Dynamics): *"The industrial parts we received were highly accurate and delivered on time. Saturn3D has become an indispensable additive partner for our rapid manufacturing cycles."* (5/5 Stars)
  - **Kavya Nair** (Principal Architect, Studio Form): *"Their architectural scale models allowed us to present complex kinetic facades beautifully. The surface fidelity and dimensional accuracy exceeded expectations."* (5/5 Stars)
  - **Rohan Khanna** (Co-Founder, AeroNest Robotics): *"Saturn3D supported our drone prototyping with impressive speed and precision. The Carbon-X parts fit perfectly on the first print, eliminating costly CNC revisions."* (5/5 Stars)

#### I. Conversion Call-to-Action (`<CTA />`)
- **Badge**: `Network Ready`
- **Headline**: `READY TO INITIALIZE?`
- **Subhead**: *"Upload your blueprint and bridge the gap between digital precision and physical reality."*
- **Buttons**:
  - `START PRINTING` -> `/custom-lab`
  - `INDUSTRIAL BULK ORDER` -> Opens `<BulkOrderForm />`

#### J. Global Footer (`<Footer />`)
- **Brand Summary**: *"Forging the future of physical intelligence through precision hardware."*
- **Quick Links**: Home, Categories, Custom Lab, About, Privacy Policy, Terms of Service
- **Direct Email**: `hello@saturn3d.in` (Action: `Contact Engineering`)
- **Live Status Indicator**: `● Print Farm Online • 99.98% Uptime`
- **Copyright**: `© 2026 Saturn3D Studio. All rights reserved.`

---

## 2. Current Visual System

### Palette
| Token | Value / HSL | Usage |
| :--- | :--- | :--- |
| Base Background | `hsl(210 40% 98%)` / `#fafafa` | Canvas background, clean studio aesthetic |
| Dark Foreground | `hsl(222 47% 11%)` / `#0f172a` | Primary typography, high-contrast headings |
| Primary Accent | `hsl(224 76% 48%)` / `#2563eb` | Brand blue, active indicators, interactive elements |
| Heated Accent | `#ff6b35` / `#ea580c` | Warm filament glow, warning/status badges, laser guide |
| Card Surface | `#ffffff` | Pure white card tiles with subtle `border-slate-200/80` |
| Subdued Text | `#64748b` (Slate-500) | Secondary specs, descriptions, metadata |
| Verification Green | `#10b981` (Emerald-500) | Live status pulses, in-stock badges, free shipping bar |

### Typography
- **Headings**: `'Outfit', sans-serif` (300, 500, 700, 800) — geometric, technical, space-age feel.
- **Body & Controls**: `'Manrope', sans-serif` (400, 500, 600, 700) — clean, highly legible grotesque grotesque sans for specifications.
- **Monospace / Numerical**: System mono / tabular-nums for coordinates, tolerances, and pricing.

### Spatial Rhythm & Borders
- Grid: Standard 12-column container maxing out at `1280px` (`max-w-7xl`).
- Corner Radii: Modern rounded corners (`rounded-2xl` for controls, `rounded-3xl` for cards, `rounded-full` for status chips).
- Borders: Crisp `1px solid rgba(226, 232, 240, 0.8)` (`border-slate-200`).

### Motion Language
- Initial entrance via GSAP timelines (`power4.out`, `expo.out`).
- Micro-interactions on buttons (`scale(0.98)` on active, subtle lift on hover).
- Continuous background shader and spool rotation in Three.js canvas.

---

## 3. Technical Stack & Clues

- **Core Framework**: React 19 + TypeScript + Vite 7.
- **Styling**: Tailwind CSS 3.4 with custom `@layer base` CSS variables + `tailwindcss-animate`.
- **3D Engine**: Three.js `0.184.0` with `@react-three/fiber` `9.6.0` and `@react-three/drei` `10.7.7`.
- **Motion Engine**: GSAP `3.15.0` with ScrollTrigger plugin.
- **Scroll Smoothing**: Lenis (`@studio-freight/lenis`).
- **State Management**: Zustand `5.0.12` with persistent localStorage middleware.
- **UI Primitives**: Radix UI primitives (`@radix-ui/react-dropdown-menu`, `dialog`, `slot`).
- **Icons**: Lucide React (`0.562.0`).
- **Toast Notifications**: Sonner (`2.0.7`).
- **Network / Hosting**: Vercel / Cloudflare edge network, HTTP/2, Gzip/Brotli compression.

### Asset Weight Profile
- `index.js` client bundle: ~2.1 MB uncompressed (~626 kB gzip).
- `index.css`: ~142 kB uncompressed (~22 kB gzip).
- 3D Environment Map (`potsdamer_platz_1k.hdr`): 1.54 MB.
- Gallery Images: ~32 JPEG files averaging 600KB - 1MB each (total ~25 MB if un-lazy-loaded).
- Gallery Videos: ~3.7 MB total.

---

## 4. Weaknesses in UX, Conversion, Mobile, SEO & Speed

1. **Client-Side SPA Bottlenecks (SEO & First Paint)**:
   - The current Vite SPA outputs a bare `<div id="root"></div>`. Web crawlers that do not execute heavy JS see zero initial markup, limiting organic ranking for keywords like *"custom 3D printing service in India"* or *"rapid prototyping Bhopal"*.
2. **Initial JavaScript Payload (LCP Impact)**:
   - Bundling Three.js, R3F, Drei, GSAP, Lucide, and all page modules into a single 2.1 MB bundle delays First Contentful Paint (FCP) and Largest Contentful Paint (LCP) on throttled mobile connections.
3. **Gallery Asset Overhead**:
   - The gallery embeds 32 raw camera export photos without modern WebP/AVIF formatting or responsive `srcset` scaling, leading to excessive bandwidth consumption on mobile viewports.
4. **Mobile Navigation & Viewport Scaling**:
   - At 390px width, complex 3D scenes without canvas resolution clamping (`dpr` caps) trigger GPU thermal throttling on lower-end mobile chipsets.
5. **Conversion Friction in Quote Flow**:
   - The quote flow currently relies on multiple disconnected touchpoints (Custom Lab vs. WhatsApp button vs. Bulk Modal). Consolidating into a unified instant-quote engine with immediate visual feedback will drive significantly higher quote submissions.

---

## 5. Five Sharp Opportunities for 3D & Motion

1. **Interactive Layer-by-Layer "Print Reveal" Hero**:
   - Instead of a static or passively rotating model, feature a real industrial mechanical part that "prints itself" slice-by-slice as the user scrolls, with a glowing hot-end nozzle tracking the build plane and a subtle Saturn ring orbit.
2. **Real-Time Interactive Material Switcher**:
   - A single high-fidelity 3D model where clicking **PLA**, **PETG**, **ABS**, **Carbon Fiber**, or **Ultra-Resin** dynamically alters the PBR shader parameters (roughness, clearcoat, subsurface scattering, metallic sheen, and layer striations) to tangibly demonstrate material differences before purchase.
3. **Scroll-Pinned 5-Stage Process Walkthrough**:
   - Replace static text steps with a scroll-pinned cinematic 3D camera that travels between stations: *CAD Upload -> Slicing Simulator -> Heated Chamber Print -> Ultrasonic Wash/Cure -> Precision Inspection & Box*.
4. **Interactive 3D Dimensional Caliper Inspector**:
   - An interactive inspection tool showing real-time digital calipers measuring critical tolerances (`±0.05mm`) across complex internal geometries, instantly resolving the visitor's core objection regarding dimensional accuracy.
5. **Interactive 3D Product Tiles in Catalog**:
   - Replace flat photos with lightweight, tilt-reactive interactive 3D cards that allow 360° inspection on hover, backed by instant WebGL fallbacks for low-power devices.
