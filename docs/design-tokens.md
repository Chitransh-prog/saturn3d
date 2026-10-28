# Neo-Brutalist Design Tokens & Engineering Guide: Saturn 3D

> **Design Direction**: Neo-Brutalism Fused with 3D  
> **Aesthetic Philosophy**: Hand-art-directed, visceral, mechanical, bold, unapologetic, highly tactile. Zero purple gradients, zero uniform card grids, zero generic glassmorphism. Flat paper fills, hard shadows, visible grid construction lines, 3px solid ink borders, rotated sticker badges, cel-shaded 3D objects with ink outlines.

---

## 1. Color Palette (Flat Fills Only &bull; Zero Blur)

| Token Name | Hex Value | Semantic Role | Rule / Usage |
| :--- | :--- | :--- | :--- |
| `--bg-paper` | `#FFF4E0` | Foundation Base | Warm vintage blueprint paper. Used across the entire site body and major sections. |
| `--ink` | `#0B0B0B` | Ink / Lines / Text | Maximum density black. Used for all 3px borders, hard offset shadows, and primary type. |
| `--saturn-orange` | `#FF5A1F` | Primary Brand Energy | High-voltage industrial orange. Active tabs, hero highlights, primary action buttons. |
| `--lemon` | `#FFE14D` | Accent Block / Warning | Punchy technical yellow. Price chips, sticker badges, discount flags. |
| `--periwinkle` | `#8EA2FF` | Technical Accent | Deep blueprint periwinkle. Process cards, secondary badge stamps, spec headers. |
| `--mint` | `#7CF2C1` | Validation Accent | High-visibility mint. In-stock indicators, verified operator badges, micron flags. |
| `--wa-green` | `#25D366` | WhatsApp Specific | Dedicated strictly to the WhatsApp floating slab and direct WhatsApp triggers. |
| `--white` | `#FFFFFF` | Contrast Slabs | Clean high-contrast card faces behind 3px ink borders. |

---

## 2. Border & Shadow System

### Borders
- **Standard Structural Border**: `3px solid #0B0B0B`
- **Heavy Frame Border**: `4px solid #0B0B0B` (Hero stage card, giant quote slab)
- **Thin Technical Divider**: `1.5px solid #0B0B0B` (Inner spec matrix cells)

### Corner Radii
- **Strict Range**: `0px` to `6px`
- `0px` (`rounded-none`): Raw architectural cut. Tables, spec blocks, footer slab.
- `3px` (`rounded-xs`): Stamp edges, chips, input fields.
- `6px` (`rounded-sm`): Slab cards, primary buttons, interactive modals.
- *Strict Rule*: No pill buttons (`rounded-full`) except genuine mechanical rotation dials.

### Hard Offset Shadows (Zero Blur)
- `--shadow-sm`: `3px 3px 0px #0B0B0B`
- `--shadow-md`: `5px 5px 0px #0B0B0B`
- `--shadow-lg`: `8px 8px 0px #0B0B0B`
- `--shadow-xl`: `12px 12px 0px #0B0B0B` (Hero 3D Stage Card, Master Quote Slab)
- **Hover State**: `transform: translate(-3px, -3px); box-shadow: 8px 8px 0px #0B0B0B;`
- **Active / Pressed State**: `transform: translate(4px, 4px); box-shadow: 0px 0px 0px #0B0B0B;`

---

## 3. Typography System

### Display & Headlines: **Space Grotesk**
- **Justification**: Space Grotesk (700 Bold / 800 Heavy) combines brutalist architectural angularity with space-age geometric proportion. Its distinct letterforms (wide proportions, angular leg on 'R', flared terminal 't') echo aerospace manufacturing blueprints.
- **Headlines Scale**: `clamp(3rem, 11vw, 10.5rem)`
- **Leading**: `0.88` to `0.92` (Tight, interlocking brutalist tracking)
- **Transform**: Strict `uppercase`
- **Outline Technique**: `-webkit-text-stroke: 2.5px #0B0B0B; color: transparent;` for layered 3D weave effects.

### Specifications & Numbers: **Space Mono**
- **Family**: `'Space Mono', monospace`
- **Weights**: `400 Regular`, `700 Bold`
- **Role**: Coordinates, dimensions, infill percentages, price readouts, step numbering (`01 / SERVICES`), and data tables.

### Body & Descriptions: **Manrope / Space Grotesk**
- **Family**: `'Manrope', system-ui, sans-serif`
- **Tracking**: `-0.01em`
- **Line Height**: `1.5`

---

## 4. Neo-Brutalist Graphic Accents

1. **Visible 12-Column Blueprint Grid**: 
   - Faint 1px ink grid lines (`rgba(11,11,11,0.08)`) with crosshair intersection marks (`+`) across the hero and section dividers.
2. **Rotated Stamp Badges**:
   - Tilted `-3deg` to `+4deg` with 3px ink border, flat lemon or mint fill, hard 4px shadow, and mono typography.
3. **Halftone / Film Noise Overlay**:
   - Procedural SVG fractal noise overlay at `6%` opacity for tactile risograph/newsprint texture.
4. **Marquee Ticker Strips**:
   - High-contrast caution-style ticker bands (Saturn Orange `#FF5A1F` background, 3px ink borders top and bottom, black uppercase mono text).
5. **Section Numbered Tags**:
   - `01 / HERO`, `02 / SERVICES`, `03 / MATERIALS`, `04 / PROCESS`, `05 / PROOF`, `06 / QUOTE`, `07 / FAQ`.

---

## 5. 3D Cel-Shading & Outline Standard
- **Material Strategy**: Stylised Cel/Toon Shading (`MeshToonMaterial` with custom 3-step luminance ramp).
- **Outlines**: Thick 2.5px - 3.5px ink outlines using inverted-hull backface extrusion or Drei `<Outlines thickness={3} color="#0B0B0B" />`.
- **Palette**: Flat Saturn Orange `#FF5A1F`, Ink `#0B0B0B`, Lemon `#FFE14D`, Paper `#FFF4E0`.
- **Lighting**: Non-photoreal direct sunlight with zero soft ambient occlusion; hard contact plane shadows.
