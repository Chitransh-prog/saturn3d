import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Box, Check, Copy, Flame, Layers, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export default function DesignSystem() {
  const colors = [
    { name: 'Base Paper', token: '--paper', hex: '#FAF7F2', text: '#0B0B0B', desc: 'Global foundation surface' },
    { name: 'Ink Black', token: '--ink', hex: '#0B0B0B', text: '#FAF7F2', desc: 'Borders, type, hard shadows' },
    { name: 'Saturn Orange', token: '--saturn-orange', hex: '#FF5A1F', text: '#0B0B0B', desc: 'Primary brand energy & action' },
    { name: 'Lemon Yellow', token: '--lemon', hex: '#FFE14D', text: '#0B0B0B', desc: 'Highlight tags & warning chips' },
    { name: 'Blueprint Periwinkle', token: '--periwinkle', hex: '#8EA2FF', text: '#0B0B0B', desc: 'Technical process & accents' },
    { name: 'Verification Mint', token: '--mint', hex: '#7CF2C1', text: '#0B0B0B', desc: 'Accuracy & live system indicators' },
    { name: 'WhatsApp Green', token: '--wa-green', hex: '#25D366', text: '#FFFFFF', desc: 'Dedicated customer messaging FAB' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0B0B0B] blueprint-grid pb-24 font-mono-tech">
      {/* Top Bar */}
      <header className="border-b-ink bg-[#FAF7F2] sticky top-0 z-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-brutal-sm">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="btn-brutal bg-white text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#FF5A1F] border-2 border-ink inline-block" />
            <h1 className="text-xl font-display font-black tracking-wider uppercase">
              SATURN 3D // DESIGN SYSTEM
            </h1>
          </div>
        </div>
        <div className="badge-sticker bg-[#FFE14D]">
          DEV ENVIRONMENT &bull; V2.0 NEO-BRUTALISM
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-16">
        {/* Section 00: Overview Banner */}
        <section className="card-slab bg-white p-8 relative overflow-hidden">
          <div className="absolute top-4 right-4 badge-sticker bg-[#FF5A1F] text-[#0B0B0B] rotate-2">
            SPECIFICATION MANUAL
          </div>
          <span className="section-tag mb-4">00 // PHILOSOPHY</span>
          <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight mt-2 mb-4">
            NEO-BRUTALISM FUSED WITH 3D
          </h2>
          <p className="font-body text-base sm:text-lg text-[#0B0B0B] max-w-3xl leading-relaxed">
            This design system rejects generic AI-template layouts, purple gradients, and soft floating glass.
            Every component is anchored by <strong>3px solid ink borders</strong>, <strong>hard zero-blur offset shadows</strong>, 
            vintage blueprint paper fills (<code>#FAF7F2</code>), vibrant high-voltage accents (<code>#FF5A1F</code>), 
            and aerospace-grade technical typography.
          </p>
        </section>

        {/* Section 01: Color Tokens */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-ink pb-3">
            <span className="section-tag">01 // COLOR TOKENS</span>
            <span className="text-xs uppercase tracking-widest text-[#555]">Flat fills &bull; Zero soft gradients</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {colors.map((c) => (
              <div
                key={c.name}
                className="card-slab p-5 flex flex-col justify-between h-48"
                style={{ backgroundColor: c.hex, color: c.text }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-black text-white border border-black inline-block">
                    {c.token}
                  </span>
                  <span className="text-sm font-bold tracking-mono">{c.hex}</span>
                </div>
                <div>
                  <h3 className="font-display font-black text-lg tracking-tight uppercase">
                    {c.name}
                  </h3>
                  <p className="text-xs mt-1 font-body opacity-90">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 02: Typography Scale */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-ink pb-3">
            <span className="section-tag">02 // TYPOGRAPHY</span>
            <span className="text-xs uppercase tracking-widest text-[#555]">Space Grotesk + Space Mono</span>
          </div>

          <div className="card-slab bg-white p-8 space-y-8">
            <div>
              <div className="text-xs text-[#666] uppercase tracking-widest mb-1">Display Hero Headline</div>
              <div className="text-5xl sm:text-7xl font-display font-black uppercase tracking-tight leading-none">
                PRINT THE IMPOSSIBLE
              </div>
            </div>

            <div>
              <div className="text-xs text-[#666] uppercase tracking-widest mb-1">Outline Display Type (Layered 3D Weave)</div>
              <div className="text-5xl sm:text-7xl font-display font-black uppercase tracking-tight leading-none outline-text">
                ADDITIVE MANUFACTURING
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t-2 border-black">
              <div>
                <div className="text-xs text-[#666] uppercase tracking-widest mb-2">Technical Mono Readout (Space Mono)</div>
                <div className="bg-[#FAF7F2] border-ink p-4 space-y-1 text-sm font-mono-tech">
                  <div>TOLERANCE: &plusmn;0.04 MM (MICRON GRADE)</div>
                  <div>BUILD VOLUME: 350 &times; 350 &times; 400 MM</div>
                  <div>MATERIAL: CARBON-X PA12 HIGH TEMP</div>
                  <div>BATCH SPEED: 24H EXPRESS DISPATCH</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-[#666] uppercase tracking-widest mb-2">Editorial Body Text (Manrope)</div>
                <p className="font-body text-base text-[#111] leading-relaxed">
                  Saturn 3D bridges digital CAD files with production-grade reality. We manufacture high-tensile 
                  prototypes for drone airframes, medical enclosures, kinetic architectural models, and automotive 
                  manifolds directly from our facility in Central India.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 03: Button Variations */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-ink pb-3">
            <span className="section-tag">03 // BUTTON PRIMITIVES</span>
            <span className="text-xs uppercase tracking-widest text-[#555]">3px Border &bull; Hard Offset Shadow &bull; Tactile Press</span>
          </div>

          <div className="card-slab bg-white p-8">
            <div className="flex flex-wrap gap-4 items-center">
              <button className="btn-brutal btn-brutal-orange">
                <Flame className="w-4 h-4" /> Saturn Orange Action
              </button>
              <button className="btn-brutal btn-brutal-lemon">
                <Zap className="w-4 h-4" /> Lemon Highlight
              </button>
              <button className="btn-brutal btn-brutal-periwinkle">
                <Box className="w-4 h-4" /> Periwinkle Spec
              </button>
              <button className="btn-brutal btn-brutal-mint">
                <ShieldCheck className="w-4 h-4" /> Mint Verified
              </button>
              <button className="btn-brutal btn-brutal-ink">
                <Layers className="w-4 h-4" /> Solid Ink
              </button>
              <button className="btn-brutal bg-white">
                White Slab
              </button>
              <a
                href="#wa-preview"
                className="btn-brutal bg-[#25D366] text-white flex items-center gap-2"
              >
                <span className="font-black text-sm">WHATSAPP CHAT</span>
              </a>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-black grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono-tech">
              <div className="p-3 bg-[#FAF7F2] border border-black">
                <strong>DEFAULT STATE:</strong> 3px solid ink, 4px 4px 0 ink shadow.
              </div>
              <div className="p-3 bg-[#FAF7F2] border border-black">
                <strong>HOVER STATE:</strong> translate(-3px, -3px), 7px 7px 0 shadow.
              </div>
              <div className="p-3 bg-[#FAF7F2] border border-black">
                <strong>ACTIVE STATE:</strong> translate(3px, 3px), 0px 0px 0 shadow (press feel).
              </div>
            </div>
          </div>
        </section>

        {/* Section 04: Badges, Stickers & Stamps */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-ink pb-3">
            <span className="section-tag">04 // STICKERS & BADGES</span>
            <span className="text-xs uppercase tracking-widest text-[#555]">Rotated -3deg to +4deg</span>
          </div>

          <div className="card-slab bg-white p-8">
            <div className="flex flex-wrap gap-6 items-center">
              <div className="badge-sticker bg-[#FFE14D] -rotate-3">
                &plusmn;0.04MM TOLERANCE
              </div>
              <div className="badge-sticker bg-[#FF5A1F] text-white rotate-2">
                EXPRESS NATIONWIDE 24H
              </div>
              <div className="badge-sticker bg-[#7CF2C1] -rotate-1">
                ISO 9001 COMPLIANT
              </div>
              <div className="badge-sticker bg-[#8EA2FF] rotate-3">
                CARBON-X COMPOSITE
              </div>
              <div className="badge-sticker bg-white -rotate-2">
                100% INFILL DENSITY
              </div>
              <div className="badge-sticker bg-[#0B0B0B] text-[#FAF7F2] rotate-1">
                CENTRAL INDIA HUB
              </div>
            </div>
          </div>
        </section>

        {/* Section 05: Raw Specification Table */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-ink pb-3">
            <span className="section-tag">05 // RAW SPECIFICATION TABLE</span>
            <span className="text-xs uppercase tracking-widest text-[#555]">High contrast engineering matrix</span>
          </div>

          <div className="card-slab overflow-x-auto p-2 bg-white">
            <table className="raw-table">
              <thead>
                <tr>
                  <th>PROCESS</th>
                  <th>MATERIAL</th>
                  <th>TOLERANCE</th>
                  <th>TENSILE YIELD</th>
                  <th>MAX TEMP</th>
                  <th>PRICING</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-bold">FDM Engineering</td>
                  <td>PLA / PETG</td>
                  <td>&plusmn;0.08 mm</td>
                  <td>55 MPa</td>
                  <td>70&deg;C</td>
                  <td className="font-bold text-[#FF5A1F]">₹3.50 &ndash; ₹5.00 / g</td>
                </tr>
                <tr>
                  <td className="font-bold">FDM Composite</td>
                  <td>Carbon-X PA12</td>
                  <td>&plusmn;0.05 mm</td>
                  <td>115 MPa</td>
                  <td>150&deg;C</td>
                  <td className="font-bold text-[#FF5A1F]">₹25.00 / g</td>
                </tr>
                <tr>
                  <td className="font-bold">SLA Precision Resin</td>
                  <td>Engineering Tough</td>
                  <td>&plusmn;0.02 mm</td>
                  <td>68 MPa</td>
                  <td>85&deg;C</td>
                  <td className="font-bold text-[#FF5A1F]">₹18.00 / ml</td>
                </tr>
                <tr>
                  <td className="font-bold">Elastomeric TPU</td>
                  <td>TPU 95A Industrial</td>
                  <td>&plusmn;0.10 mm</td>
                  <td>Flexible Shore 95A</td>
                  <td>90&deg;C</td>
                  <td className="font-bold text-[#FF5A1F]">₹8.50 / g</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 06: Form Elements */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-ink pb-3">
            <span className="section-tag">06 // FORM CONTROLS</span>
            <span className="text-xs uppercase tracking-widest text-[#555]">Thick-border inputs &bull; Mono labels</span>
          </div>

          <div className="card-slab bg-white p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 font-mono-tech">
                CAD FILENAME (.STL / .OBJ / .GLB / .PNG)
              </label>
              <input
                type="text"
                defaultValue="drone_chassis_v3.stl"
                className="w-full bg-[#FAF7F2] border-ink p-3 font-mono-tech text-sm focus:outline-hidden focus:bg-white shadow-brutal-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 font-mono-tech">
                INFILL PERCENTAGE (%)
              </label>
              <select className="w-full bg-[#FAF7F2] border-ink p-3 font-mono-tech text-sm focus:outline-hidden focus:bg-white shadow-brutal-sm">
                <option>20% &ndash; Standard Rapid Prototype</option>
                <option>50% &ndash; Semi-Functional Assembly</option>
                <option>100% &ndash; Solid Industrial Grade</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 font-mono-tech">
                TOTAL RUNTIME ESTIMATE
              </label>
              <div className="bg-[#FFE14D] border-ink p-3 font-mono-tech font-bold text-sm shadow-brutal-sm flex items-center justify-between">
                <span>EST: 4.8 HOURS</span>
                <span className="text-xs bg-black text-white px-2 py-0.5">READY</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
