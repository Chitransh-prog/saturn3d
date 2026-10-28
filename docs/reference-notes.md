# Reference Notes: Scroll-Driven Storytelling & Open Layout Patterns
Source Reference: mrmawaa.com (Audited at 1440px desktop & 390px mobile viewports)

---

## 1. Motion Philosophy & Feel
- **Tone**: Calm, confident, deliberate. Motion is not gratuitous; every animation clarifies state change or guides user reading flow.
- **Easing & Durations**:
  - Durations: `0.6s – 1.1s` for reveals; instant or `0.3s` for micro-interactions.
  - Easing: `power3.out` and `expo.out` for organic deceleration; linear (`none`) for scroll-scrubbed timelines.
- **One Focus Rule**: Only ONE primary element or motion dominates the viewport at any time, preventing cognitive overload.

---

## 2. Preloader
- **Visuals**: Center-aligned narrative animation. Circular spinning dashed stroke, brand emblem, and dynamic loading percentage (`0% -> 100%`).
- **Narrative Subtitle**: Single status line describing the physical preparation process ("Warming the nozzle, slicing layers...").
- **Exit Motion**: Fast vertical curtain wipe (Ink `#0B0B0B` slicing up into Paper `#FFF4E0`).
- **Rules**: Plays once per browser session via `sessionStorage`, fully skippable via click or Esc, max duration capped at 2.5s.

---

## 3. Scroll-Scrubbed Hero & Pinned Stage
- **Structure**: Full-bleed hero stage pinned across `~150vh` of scroll.
- **Scrub Behavior**:
  - As user scrolls, camera gently dollies in (`~15%`), increasing intimacy with the 3D subject.
  - The planetary ring tilts dynamically from horizontal inclination to an orbital sweep.
  - The 3D model smoothly rotates up to 180° revealing back thrusters and engineering joints.
  - Display headline letters drift apart horizontally and fade out.
  - Transition trigger: At scroll completion, the hero ring line cuts directly into the next section with an inline marker: `"ENTERING THE LAB"`.

---

## 4. The Open Catalog / The Lab
- **De-boxed Structure**: Zero card boxes or 3px container borders. Open grid with subtle 1px ink hairlines separating rows/columns.
- **Filter Navigation**: Pure text-based underlined tabs (`All / FDM / SLA Resin / Carbon-X`), eliminating pill and button clutter.
- **Hover Micro-interactions**: Smooth image scale (`scale(1.03)` with `cubic-bezier(0.16, 1, 0.3, 1)`), subtle diagonal arrow slide-in (`translate(4px, -4px)`).

---

## 5. Pinned Material Selector (03)
- **Layout**: 2-column editorial split screen pinned for `(items * 80vh)`.
  - **Left Rail**: Monospaced numbered list (`01`, `02`, `03`...), active indicator hairline, bold material headline, one-line spec summary, and direct CTA button.
  - **Right Stage**: Prominent 3D engineering part floating in space.
- **Interaction**:
  - Scroll-scrub advances the active material step-by-step.
  - Direct click on any material index jumps the scroll smoothly to that item.
  - The 3D part transitions physical materials (color, metalness, roughness, translucency) with seamless shader lerping.

---

## 6. Configurator on Tint Band (04 - Make It Yours)
- **Background**: Full-bleed solid tint band (e.g. warm lemon `#FFE14D` or periwinkle `#8EA2FF`) spanning the complete viewport width, giving section rhythm without card boundaries.
- **Dropzone & Configurator**: Clean 1px hairline drag-and-drop container for CAD files (`.STL`, `.OBJ`, `.STEP`).
- **Tiered Table**: Clean unboxed tiered price calculation with live total, "Request Quote", and WhatsApp prefill integration.

---

## 7. Horizontal Use-Case Strip (05)
- **Desktop**: Pinned horizontal scroll track converting vertical wheel motion into a smooth horizontal pan. Open image tiles parallax at subtle staggered speeds (`-8%` to `+8%`).
- **Mobile**: Seamless native touch scroll with touch momentum and snap alignment.

---

## 8. Progressive Step-by-Step Process (06 - How It's Made)
- **Flow**: `01 Upload` > `02 Slice` > `03 Print` > `04 Finish` > `05 Deliver`.
- **Pinned Storytelling**:
  - Left vertical number rail highlights the active operational phase.
  - Center/Right 3D build plate displays the part progressively fabricating via hardware clipping shader / layer reveal.

---

## 9. Color Morphing & Section Rhythm
- **Seamless Atmosphere**: Full-bleed background color transitions triggered by ScrollTrigger (`data-bg` and `data-fg`):
  - Hero: Paper Cream (`#FFF4E0`)
  - The Lab: Paper Cream (`#FFF4E0`)
  - Materials: Deep Industrial Ink (`#0B0B0B`)
  - Quote Configurator: Lemon Tint Band (`#FFE14D`)
  - How It's Made: Paper Cream (`#FFF4E0`)
  - Footer: Deep Industrial Ink (`#0B0B0B`)

---

## 10. Typography, Spacing & Layout Hierarchy
- **Type System**:
  - Display: Uppercase heavy geometric sans, `clamp(3.5rem, 11vw, 12rem)` for mega titles, `clamp(2.5rem, 6vw, 6rem)` for H2.
  - Body: Clean humanist grotesque sans, 17–18px, max line-length `62ch` for effortless readability.
  - Eyebrows & Tech Specs: Monospaced uppercase with generous letter-spacing (`tracking-widest`).
- **Spacing Grid**: 8px modular scale. Section padding `clamp(96px, 14vh, 200px)` for high-end luxury editorial air.
- **Hairlines**: 1px crisp ink borders replacing heavy 3px outlines across all non-action components.

---

## 11. Cart Drawer & Header
- **Navigation**: Clean transparent header with left wordmark, 4 links, and one primary CTA button. Hides on scroll-down, smoothly reveals on scroll-up; subtle hairline appears only when scrolled.
- **Cart Drawer**: Clean side-sheet with dynamic free-delivery meter (`Complimentary Pan-India Express above ₹1,499`) and instant checkout CTA.
