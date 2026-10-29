import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Box, Check, Copy, Layers, ShieldCheck, Sparkles, Terminal, Sliders, Sun, Moon } from 'lucide-react';

export default function DesignSystem() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToken = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(null), 1800);
  };

  const colors = [
    { name: 'Graphite', token: '--graphite', hex: '#0B0D10', role: 'Primary dark background & dark surfaces' },
    { name: 'Surface Dark', token: '--surface-dark', hex: '#12151A', role: 'Dark cards, toolbars, modal sheets' },
    { name: 'Surface Card', token: '--surface-card', hex: '#181C22', role: 'Elevated dark container surfaces' },
    { name: 'Studio Light', token: '--studio-light', hex: '#F5F6F8', role: 'Calm engineered light background' },
    { name: 'Studio Card', token: '--studio-card', hex: '#FFFFFF', role: 'Crisp white light cards and table panels' },
    { name: 'Saturn Orange', token: '--saturn-orange', hex: '#FF5A1F', role: 'Sole primary action accent & nozzle glow' },
    { name: 'WhatsApp Green', token: '--wa-green', hex: '#25D366', role: 'Dedicated customer communication channel' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F6F8] pb-24 font-body">
      {/* Top Bar */}
      <header className="glass-nav sticky top-0 z-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="btn-precision-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Live Lab
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] shadow-[0_0_8px_#FF5A1F] inline-block" />
            <h1 className="text-base font-display font-semibold tracking-tight text-white">
              Saturn 3D Precision Studio // Design System v3.0
            </h1>
          </div>
        </div>
        <div className="precision-badge text-xs">
          ENGINEERING SPECIFICATION // PRODUCTION
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-16">
        {/* Section 00: Overview Banner */}
        <section className="card-precision-dark p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5A1F]/8 rounded-full blur-3xl pointer-events-none" />
          <span className="type-mono-eyebrow text-[#FF5A1F] block mb-3">00 // DESIGN PHILOSOPHY</span>
          <h2 className="type-h2 text-white mb-4">
            Industrial Trust & Surgical Precision
          </h2>
          <p className="type-body text-[#A3A9B3] text-base sm:text-lg mb-6 leading-relaxed">
            The Precision Studio design system delivers high-trust additive manufacturing aesthetics.
            Zero comic outlines, zero brutalist offset shadows, zero saturated novelty tints. Built with 
            calm graphite dark zones, clean studio white surfaces, 1px surgical hairlines, and single-accent 
            Saturn Orange (<code className="text-[#FF5A1F]">#FF5A1F</code>) focus states.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="precision-badge">1px Surgical Hairlines</span>
            <span className="precision-badge">14–16px Card Radii</span>
            <span className="precision-badge">Inter & Space Mono</span>
            <span className="precision-badge">PBR Realistic Shading</span>
          </div>
        </section>

        {/* Section 01: Color Tokens */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="type-mono-eyebrow text-white/70">01 // COLOR TOKENS</span>
            <span className="font-mono text-xs text-[#A3A9B3]">Strict single-accent hierarchy</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {colors.map((c) => (
              <div
                key={c.name}
                onClick={() => copyToken(c.hex)}
                className="card-precision-dark p-5 flex flex-col justify-between h-44 cursor-pointer group hover:border-[#FF5A1F]/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-8 h-8 rounded-md border border-white/15"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="font-mono text-xs text-[#A3A9B3] group-hover:text-white flex items-center gap-1">
                    {copied === c.hex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
                    {c.hex}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">{c.name}</div>
                  <div className="font-mono text-[11px] text-white/40">{c.token}</div>
                  <div className="text-xs text-[#A3A9B3] mt-1">{c.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 02: Typography */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="type-mono-eyebrow text-white/70">02 // TYPOGRAPHY HIERARCHY</span>
            <span className="font-mono text-xs text-[#A3A9B3]">Inter Tight + Inter + Space Mono</span>
          </div>

          <div className="space-y-6 card-precision-dark p-8">
            <div className="border-b border-white/5 pb-6">
              <span className="font-mono text-xs text-[#A3A9B3] block mb-2">Display (clamp 2.5rem – 5.25rem, weight 600)</span>
              <div className="type-display text-white">
                Additive fabrication at micron scale.
              </div>
            </div>
            <div className="border-b border-white/5 pb-6">
              <span className="font-mono text-xs text-[#A3A9B3] block mb-2">Section Heading 2 (clamp 2rem – 3.5rem, weight 600)</span>
              <div className="type-h2 text-white">
                Engineered polymers for end-use parts.
              </div>
            </div>
            <div className="border-b border-white/5 pb-6">
              <span className="font-mono text-xs text-[#A3A9B3] block mb-2">Section Heading 3 (clamp 1.25rem – 2rem, weight 600)</span>
              <div className="type-h3 text-white">
                Continuous fiber reinforcement with Carbon-X.
              </div>
            </div>
            <div>
              <span className="font-mono text-xs text-[#A3A9B3] block mb-2">Body Text (16px, line-height 1.65, max 62ch)</span>
              <p className="type-body text-[#A3A9B3]">
                Saturn 3D operates an industrial additive manufacturing hub delivering high-tensile 
                prototypes and production components across India. Verified dimensional accuracy up to 
                ±0.04 mm with automated telemetry slicing.
              </p>
            </div>
          </div>
        </section>

        {/* Section 03: Button Components */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="type-mono-eyebrow text-white/70">03 // BUTTON STATES & CTAS</span>
            <span className="font-mono text-xs text-[#A3A9B3]">Micro-interaction lift with subtle shadows</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-precision-dark p-6 flex flex-col justify-between items-start gap-4">
              <div>
                <div className="font-semibold text-sm text-white mb-1">Primary Action</div>
                <div className="text-xs text-[#A3A9B3]">Saturn Orange with hover lift and arrow nudge</div>
              </div>
              <button className="btn-precision-primary">
                Launch Custom Lab <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="card-precision-dark p-6 flex flex-col justify-between items-start gap-4">
              <div>
                <div className="font-semibold text-sm text-white mb-1">Secondary Outline</div>
                <div className="text-xs text-[#A3A9B3]">1px hairline border with gentle background tint</div>
              </div>
              <button className="btn-precision-secondary text-white">
                Explore Materials Catalog
              </button>
            </div>

            <div className="card-precision-dark p-6 flex flex-col justify-between items-start gap-4">
              <div>
                <div className="font-semibold text-sm text-white mb-1">WhatsApp FAB</div>
                <div className="text-xs text-[#A3A9B3]">Soft ambient green shadow, rounded pill</div>
              </div>
              <a href="#wa" className="btn-whatsapp-precision px-4 py-2 text-xs font-semibold flex items-center gap-2">
                Verify via WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
