# UI Box Audit & De-Boxing Inventory: Saturn 3D
Audited at viewports: 1440px (Desktop), 768px (Tablet), 390px (Mobile)

---

## 1. Executive Summary
- **Current State**: The existing Neo-Brutalist design over-indexes on 3px ink borders and hard offset box-shadows (`shadow-brutal`), placing almost every UI element into an isolated card or sticker box.
- **Problem**: In a single 1440px viewport, users encounter between **8 to 16 bordered/shadowed boxes simultaneously**, causing extreme visual clutter, fragmented reading rhythm, and competing focal points.
- **Goal**: Enforce the **"Box Budget"** rule: **Maximum 3 bordered/shadowed containers visible in any viewport**. Replace heavy card containers with generous whitespace, 1px ink hairlines, large section numerals, and full-bleed colored tint bands.

---

## 2. Viewport Box Counts (Baseline vs. Target)

| Section / Viewport | Current Visible Boxes (1440px) | Current Visible Boxes (390px) | Target Box Budget | Strategy |
| :--- | :---: | :---: | :---: | :--- |
| **00. Header & Nav** | 6 (Logo box, 4 links, Cart pill, Currency pill) | 4 | 1 (Primary CTA only) | Transparent, logo left, 4 text links, hairline border only on scroll |
| **01. Hero Section** | 12 (3 top badges, poster block, stats slab with 4 sub-boxes, tagline, 2 buttons) | 8 | **2** (Primary CTA + WhatsApp) | Remove stats slab and badge clutter. Single inline mono line. |
| **02. The Lab (Catalog)** | 9 (Filter bar chips, 6 product cards with 3px border + hard shadow) | 5 | **0–1** (Open grid + 1px hairlines) | Text-tabs with underline. Open 3-column list without card boxes. |
| **03. Material Showcase** | 7 (Tab boxes, spec card, material chip slab) | 4 | **1** (Interactive 3D Stage) | Pinned 2-col editorial layout. Numbered text rail on left, 3D part on right. |
| **04. Quote Configurator** | 11 (Outer card, dropzone box, 4 tiered pricing boxes, summary, submit) | 8 | **2** (Dropzone hairline + Primary Submit) | Full-bleed lemon tint band (`#FFE14D`), open form fields, unboxed tiered table. |
| **05. Use-Cases Strip** | 6 (6 bordered cards with hard shadows) | 2 | **0** (Open image tiles) | Pinned horizontal scroll strip of open imagery with clean typographic captions. |
| **06. How It's Made** | 8 (5 timeline step boxes, 3D stage card) | 4 | **1** (3D stage) | Open left rail of numbers (`01–05`), scrub-driven 3D layer reveal without card wrapper. |
| **07. Bulk Runs** | 5 (Calculator card, input box, estimate slab, CTA) | 4 | **1** (WhatsApp CTA) | Minimal inline calculator on paper background. |
| **08. Proof / Gallery** | 8 (6 gallery card tiles, filter pills) | 4 | **0** (Open masonry) | Edge-to-edge open photography masonry with hover metadata overlay. |
| **09. FAQ Accordion** | 6 (6 bordered FAQ cards with shadows) | 4 | **0** (Hairlines only) | Clean 1px hairline border-b dividers, zero container card boxes. |
| **10. Footer** | 7 (Newsletter card, input box, social boxes, bottom bar) | 5 | **1** (Subscribe button) | Giant editorial wordmark, open link columns, clean hairlines. |

---

## 3. Element-by-Element De-Boxing Inventory

### A. Navigation & Floating UI
| Component | Current Style | Audit Verdict | Target Implementation |
| :--- | :--- | :---: | :--- |
| Top Nav Bar | 3px ink border, white background, boxed buttons | **FLATTEN** | Transparent bar, logo left, 4 text links, hairline border on scroll only |
| Currency Selector | Boxed pill with border and shadow | **FLATTEN** | Clean text dropdown with minimal hairline |
| Cart Button | Pill with red background, 2px border, shadow | **FLATTEN** | Minimalist bag icon + text count, subtle 1px border |
| Floating WhatsApp | Green circular button with 3px border & hard shadow | **KEEP** | Essential conversion action; preserved with clear margin separation |
| Skip Intro Button | Yellow brutalist box | **REMOVE** | Clean text link / ghost button |

### B. Hero Section
| Component | Current Style | Audit Verdict | Target Implementation |
| :--- | :--- | :---: | :--- |
| Top Status Sub-bar | 3 sticker chips (`01 // SYSTEM`, `TOLERANCE`, `BHOPAL HUB`) | **REMOVE** | Reduced to a single quiet mono eyebrow: `01 // SATURN 3D ADDITIVE LAB` |
| Reprint Chip | White button with border and shadow | **FLATTEN** | Subtle ghost text button with rotating icon |
| Yellow Stage Poster | 4px border, hard shadow, tilted rounded rectangle | **FLATTEN** | Replaced by full-bleed background storytelling and 3D depth |
| Hero Stats Slab | White card with 4 bordered sub-boxes | **REMOVE** | Replaced by single inline mono line: `±0.04 MM · 24–48H DISPATCH · ALL INDIA` |
| Spec Pin Badges | 3 floating chips over 3D model | **REMOVE** | Eliminated from hero; technical specs integrated into dedicated sections |
| "PRINT THE IMPOSSIBLE" | Heavy orange slab with 4px border & shadow | **FLATTEN** | Bold typography headline / tagline with crisp ink contrast |
| Hero Dual CTAs | 2 brutalist buttons with 3px border & shadows | **KEEP** | Primary CTA retains brutalist border + shadow; secondary becomes ghost text link |

### C. The Lab (Services / Catalog Grid)
| Component | Current Style | Audit Verdict | Target Implementation |
| :--- | :--- | :---: | :--- |
| Category Filter Tabs | Row of pill buttons with 2px borders | **FLATTEN** | Minimalist underlined text tabs (`All / FDM / SLA Resin / Carbon-X`) |
| Product Cards | 3px border, white fill, 6px hard shadow, badge | **FLATTEN** | Open list/grid with 1px hairline dividers; image hover zoom + slide-in arrow |
| Product Badge Chips | Offset sticker chips on every card | **REMOVE** | Max 1 subtle text badge per section (e.g. `NEW` or `AEROSPACE GRADE`) |
| Price & Add Button | Bordered sub-box inside card | **FLATTEN** | Clean typographic price (`from ₹___`) with inline text action |

### D. Material Showcase (03)
| Component | Current Style | Audit Verdict | Target Implementation |
| :--- | :--- | :---: | :--- |
| Material Tabs | Heavy bordered cards | **FLATTEN** | Numbered text list rail (`01`, `02`, `03`...) on left |
| 3D Viewer Container | Framed viewport with border & shadow | **FLATTEN** | Full-bleed transparent 3D canvas stage with seamless object swapping |
| Spec Table | Heavy bordered table cells | **FLATTEN** | Open 2-column typographic spec list with 1px hairlines |

### E. Quote Configurator (04 - Make It Yours)
| Component | Current Style | Audit Verdict | Target Implementation |
| :--- | :--- | :---: | :--- |
| Configurator Wrapper | Thick bordered card container | **FLATTEN** | Full-bleed warm lemon tint band (`#FFE14D`), open asymmetric layout |
| CAD Dropzone | Thick dashed box with heavy shadow | **FLATTEN** | Clean 1px ink hairline dropzone with drag-and-drop feedback |
| Quantity / Tier Boxes | Row of boxed buttons with borders | **FLATTEN** | Clean tiered table with 1px horizontal hairlines |
| Submit Button | Brutalist orange button with 3px border & shadow | **KEEP** | Core conversion action retains bold border + hard shadow |
| WhatsApp Quote Button | Brutalist button with shadow | **KEEP** | Instant direct chat CTA retains brutalist border + hard shadow |

### F. How It's Made, Proof, FAQ & Footer
| Component | Current Style | Audit Verdict | Target Implementation |
| :--- | :--- | :---: | :--- |
| Process Steps | 5 individual card containers | **FLATTEN** | Vertical open rail with progressive numbering and layer-reveal 3D model |
| Gallery Tiles | Cards with 3px borders and shadows | **FLATTEN** | Borderless photography masonry grid with hover image reveal |
| FAQ Accordions | Boxed cards with 3px border and shadow | **FLATTEN** | Hairline accordion (1px border-b, zero box containers) |
| Footer Wrapper | Heavy bordered box | **FLATTEN** | Full-bleed deep ink section with massive oversized wordmark |
