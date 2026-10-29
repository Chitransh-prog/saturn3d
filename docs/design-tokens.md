# Precision Studio Design System Tokens
Project: Saturn 3D Additive Fabrication Lab (Bhopal Hub, All-India)

A modern, high-precision industrial design system replacing legacy neo-brutalism. Inspired by the clarity of Carbon3D, the specification discipline of Creality, and the CAD interaction density of CADScope.

---

## 1. Color Palette

### Base Surfaces & Neutrals
- **Graphite (Dark Background)**: `#0B0D10` (`bg-graphite`)
- **Surface Dark (Cards & Panels)**: `#12151A` (`bg-surface-dark`)
- **Surface Card Dark**: `#181C22` (`bg-surface-card`)
- **Studio Light (Light Background)**: `#F5F6F8` (`bg-studio-light`)
- **Studio Card (Pure White)**: `#FFFFFF` (`bg-studio-card` / `bg-white`)

### Typography Colors
- **Light Theme Primary**: `#0B0D10`
- **Light Theme Muted**: `#5B616B`
- **Dark Theme Primary**: `#F5F6F8` / `#FFFFFF`
- **Dark Theme Muted**: `#A3A9B3`

### Accents & Indicators
- **Saturn Orange (Sole Primary Accent)**: `#FF5A1F`
- **Saturn Orange Hover**: `#E04810`
- **WhatsApp Green (Strictly on WhatsApp CTA)**: `#25D366`
- **Nozzle Glow**: `#FF5A1F` with soft emissive bloom ($\le 12\%$ alpha)

---

## 2. Typography Scale (Sentence Case, Refined Tracking)

- **Display**: Inter Tight / Space Grotesk
  - Weight: 600
  - Tracking: `-0.035em`
  - Sentence case (No full-caps shouting)
  - Clamp: `clamp(2.5rem, 5.5vw, 5.25rem)`
- **Heading 2**: `clamp(2rem, 3.8vw, 3.5rem)`, weight 600, tracking `-0.03em`
- **Heading 3**: `clamp(1.25rem, 2.2vw, 2rem)`, weight 600, tracking `-0.02em`
- **Body**: Inter / Manrope
  - Size: `16px` (1rem)
  - Line-height: `1.65`
  - Max line-length: `62ch`
- **Technical Specs & Telemetry**: Space Mono
  - Monospace font for tolerances, layer heights, coordinate bounds, print times, and pricing.

---

## 3. Borders, Radius & Shadows

- **Borders**:
  - Surgical 1px hairlines: `rgba(11, 13, 16, 0.10)` on light surfaces, `rgba(255, 255, 255, 0.10)` on dark surfaces.
  - Zero 3px or 4px cartoon borders.
- **Border Radius**:
  - Containers & Cards: `14px` to `16px` (`rounded-xl` / `rounded-2xl`)
  - Buttons & Inputs: `10px` to `12px` (`rounded-sm` / `rounded-md`)
  - Badges & Pills: `6px` (`rounded-xs`)
  - Status Indicators: `9999px` (`rounded-full`)
- **Shadows**:
  - Soft ambient depth:
    * `shadow-precision-xs`: `0 1px 2px rgba(0, 0, 0, 0.04)`
    * `shadow-precision-sm`: `0 2px 6px rgba(0, 0, 0, 0.04)`
    * `shadow-precision-md`: `0 6px 18px rgba(0, 0, 0, 0.05)`
    * `shadow-precision-lg`: `0 12px 32px rgba(0, 0, 0, 0.06)`
  - Zero hard offset shadows.

---

## 4. Reusable Component Classes

- `.btn-precision-primary`: Saturn orange fill, white text, 10px radius, hover lift + arrow slide.
- `.btn-precision-secondary`: 1px hairline border, subtle hover tint.
- `.btn-precision-ghost`: Inline text link with orange border-bottom slide-in.
- `.card-precision`: 16px radius, 1px light hairline, soft ambient shadow.
- `.card-precision-dark`: 16px radius, 1px dark hairline, graphite elevation.
- `.precision-badge`: Monospaced 12px telemetry badge with 1px border.
