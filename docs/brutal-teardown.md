# Exhaustive Neo-Brutalist Teardown Audit
Project: Saturn 3D Additive Fabrication Lab (Bhopal Hub, All-India)

This audit documents every neo-brutalist artifact identified across the codebase, its specific code location, and the concrete replacement under the **Modern Precision-Engineering Design System ("Precision Studio")**.

---

## 1. Summary of Brutalist Artifacts to Eliminate
Acceptance criteria: Grep across `src/` must return **ZERO** occurrences of:
1. `shadow-brutal*` (zero-blur hard offset shadows)
2. `border-3`, `border-4` (heavy black cartoon border lines)
3. `btn-brutal*` (retro hard-edged press-down button states)
4. `sticker-minimal`, `badge-sticker` (yellow sticker label aesthetics)
5. `rotate-[..]`, `-rotate-[..]` (randomly tilted badges and confetti elements)
6. `-webkit-text-stroke`, `ghost-3d-text` (comic outline lettering)
7. Comic pastel block colors: `#FFF4E0` / `#FAF7F2` (cream paper), `#FFE14D` (lemon yellow), `#8EA2FF` (periwinkle), `#7CF2C1` (mint)
8. Marquee / ticker bands (`ticker-animation`, `LogoTicker`)
9. Low-poly cartoon floating stage props (cube, hex bolt, octahedron, yellow disc)

---

## 2. File-by-File Inventory of Violations

### A. Stylesheet & Configuration
- **`src/app/globals.css`**:
  * Line 10-16: `--paper: #FAF7F2`, `--lemon: #FFE14D`, `--periwinkle: #8EA2FF`, `--mint: #7CF2C1`.
  * Line 28: `--secondary: 48 100% 65%` (Lemon).
  * Line 106-119: `.type-display`, `.type-h2` with screaming all-caps, ultra-tight tracking, and oversized dimensions.
  * Line 165: `.hairline-ink` (`1px solid #0B0B0B`).
  * Line 207-263: `.btn-brutal`, `.btn-brutal-orange`, `.btn-brutal-lemon`, `.btn-brutal-ink` with `box-shadow: 2px 2px 0px #0B0B0B` and active press-down `translate(1px, 1px)`.
  * Line 284-299: `.btn-whatsapp-brutal` with offset shadow.
  * Line 301-305: `.card-slab` (`border: 2px solid #0B0B0B; box-shadow: 3px 3px 0px #0B0B0B`).
  * Line 307-320: `.badge-sticker` with hard border and offset shadow.
  * Line 332-350: `.ghost-3d-text`, `.ghost-3d-text-light` with `-webkit-text-stroke`.
  * Line 359-373: `.sticker-minimal` (`background-color: #FFE14D`).
  * Line 405-420: `.ticker-animation`.
- **`tailwind.config.js`**:
  * Colors: `paper: "#FAF7F2"`, `lemon: "#FFE14D"`, `periwinkle: "#8EA2FF"`, `mint: "#7CF2C1"`.
  * Border width: `'3': '3px'`.
  * Shadows: `'brutal-sm'`, `'brutal'`, `'brutal-lg'`, `'brutal-xl'`, `'brutal-orange'`, `'brutal-lemon'`, `'clean'`.

### B. Navigation & Shell Components
- **`src/components/Navigation.tsx`**:
  * Uses brutal buttons, stark black borders, lemon highlight states, and missing Carbon-style mega-menu.
- **`src/sections/Footer.tsx`**:
  * Uses neo-brutalist dark block with heavy borders, ticker tags, and brutal buttons.
- **`src/components/Cart.tsx`**:
  * Uses `shadow-brutal-xl`, `border-l-4`, `bg-[#FFE14D]`, `bg-[#7CF2C1]`, `btn-brutal`.
- **`src/components/FloatingWhatsApp.tsx`**:
  * Uses `.btn-whatsapp-brutal`, fake unread badge counter, and collision near viewport edge.

### C. Hero & 3D Stage
- **`src/sections/Hero.tsx`**:
  * Giant uppercase screaming headline "SATURN 3D", sticker "01 // ADDITIVE FABRICATION LAB", "BHOPAL HUB . ALL INDIA" yellow badge, brutalist CTA buttons (`btn-brutal btn-brutal-orange`).
- **`src/components/HeroStage3D.tsx`**:
  * Floating confetti chips (`FloatingChips`), yellow/pink floor disc (`DiscGeometry`), low-poly clip-art shapes (octahedron, box, cylinder), cartoonish toon shading.

### D. Home Page Sections (`src/views/Home.tsx` & `src/sections/*`)
- **`src/sections/TheLab.tsx`**: Neo-brutalist grid, heavy black card borders, sticker category tags.
- **`src/sections/ExploreMaterials.tsx`**: Heavy cards, lemon/periwinkle pills.
- **`src/sections/MakeItYours.tsx`**: Full-bleed bright yellow lemon background (`bg-[#FFE14D]`), brutalist dropzone, 3px borders.
- **`src/sections/HowItsMade.tsx`**: Step numbers with heavy borders and comic arrows.
- **`src/sections/ProofGallery.tsx`**: Heavy brutalist borders and sticker tags.
- **`src/sections/FAQSection.tsx`**: Heavy brutalist borders on accordion rows.
- **`src/sections/CTA.tsx`**: High-contrast brutal card with hard shadow.

### E. Pages & Custom Lab
- **`src/views/CustomLab.tsx`**: Brutalist inputs, heavy 3px borders, hard shadows, lemon active tabs.
- **`src/views/ProductDetail.tsx`**: Brutal slab cards, yellow accent boxes, heavy 3px quantity selector.
- **`src/views/CategoriesPage.tsx` & `src/views/CategoryPage.tsx`**: Brutal category cards, badges, and offset shadows.
- **`src/views/CheckoutPage.tsx` & `src/views/OrdersPage.tsx`**: Brutal tables, form inputs, status tags.
- **`src/views/LoginPage.tsx` & `src/views/RegisterPage.tsx`**: Brutal form slabs, lemon input focus states.
- **`src/views/AdminPanel.tsx` & `src/app/admin/page.tsx`**: Brutal dashboard cards and table headers.

---

## 3. Systematic Replacement Matrix

| Brutalist Element | Target "Precision Studio" Replacement |
| :--- | :--- |
| `shadow-brutal` (3px hard offset) | Very soft ambient shadow `shadow-precision-sm` / `shadow-precision-lg` (`0 12px 32px rgba(0,0,0,0.06)`) |
| `border-3`, `border-4` | Surgical 1px hairline `border border-neutral-200 dark:border-white/10` |
| `btn-brutal` with offset shadow & jump | `.btn-precision-primary` (Saturn orange `#FF5A1F`, rounded 10px, soft shadow, smooth hover lift + icon nudge) |
| `btn-brutal-lemon` / yellow buttons | Replaced with `.btn-precision-secondary` (1px hairline outline) |
| `sticker-minimal` / `badge-sticker` | `.precision-badge` (1px hairline, monospace uppercase, muted subtle fill `#F0F2F5` / `rgba(255,255,255,0.06)`) |
| `rotate-[..]` random tilts | Zero rotation: crisp horizontal alignment on 8px engineering grid |
| `-webkit-text-stroke` ghost text | Crisp sentence-case headings with Geist/Inter Tight typography |
| Paper `#FAF7F2` & Lemon `#FFE14D` | Calm Studio Light `#F5F6F8` / Pure White `#FFFFFF` alternating with Dark Graphite `#0B0D10` |
| Low-poly clip-art floating props | Clean 3D studio stage with realistic PBR shading, soft contact shadows, depth-correct orange orbital ring, and 3 leader-line hotspots |
| Marquee / Ticker tape | Precision inline capability strip with monospaced labels and 1px hairline dividers |

