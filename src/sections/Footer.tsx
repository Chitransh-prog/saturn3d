'use client';

import React, { useState } from 'react';
import { ArrowRight, Instagram, Linkedin, Twitter, MessageSquare, Mail, Phone, MapPin, Sparkles, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import RevolvingSaturn3D from '@/components/RevolvingSaturn3D';

export default function Footer() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid work email address');
      return;
    }
    toast.success('Subscribed to Saturn 3D Engineering Telemetry!', {
      description: `Updates will be dispatched to ${email}`,
    });
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#F8F9FA] text-[#111215] pt-16 sm:pt-20 pb-28 sm:pb-16 relative overflow-hidden select-none border-t border-black/10 font-body">
      
      {/* Background Engineering Ambient Lighting */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #000000 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-5xl h-44 bg-gradient-to-b from-[#FF5A1F]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 space-y-14">
        
        {/* =================================================================
            1. MONUMENTAL ONE-LINE BRAND BANNER WITH 3D REVOLVING SATURN EMBLEM
        ================================================================= */}
        <div className="relative w-full py-4 sm:py-8 flex flex-col items-center justify-center">
          
          <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-4 md:gap-6 w-full max-w-full overflow-hidden select-none">
            
            {/* SATURN in Giant Bold Dark Lettering */}
            <span className="font-sans font-black tracking-tighter text-[#111215] uppercase text-[clamp(2.5rem,11vw,11rem)] leading-none select-none">
              SATURN
            </span>

            {/* Circular Badge with Live 3D Revolving Planet Saturn */}
            <div className="relative shrink-0 flex items-center justify-center -my-2 sm:-my-4">
              <div className="relative w-14 h-14 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full p-[2px] sm:p-[2.5px] bg-gradient-to-tr from-[#FF5A1F] via-[#FBBF24] to-[#FF8A50] shadow-[0_4px_24px_rgba(255,90,31,0.25)]">
                <div className="w-full h-full rounded-full bg-[#0B0D10] border border-black/10 overflow-hidden relative shadow-inner">
                  <RevolvingSaturn3D />
                </div>
              </div>

              {/* Verified Precision Pip */}
              <span className="absolute -bottom-1 sm:-bottom-2 px-2 py-0.5 rounded-full bg-white border border-[#FF5A1F]/40 font-mono text-[7px] sm:text-[9px] text-[#FF5A1F] font-bold uppercase tracking-widest whitespace-nowrap shadow-xs">
                3D HUB
              </span>
            </div>

            {/* 3D in Giant Bold Dark Lettering */}
            <span className="font-sans font-black tracking-tighter text-[#111215] uppercase text-[clamp(2.5rem,11vw,11rem)] leading-none select-none">
              3D
            </span>

          </div>

          {/* Clean Modern Geotag & Facility Strip */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 font-mono text-[11px] text-[#5E6573] tracking-wider uppercase text-center px-4">
            <span className="text-[#FF5A1F] font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] animate-pulse" />
              Bhopal Facility (Govindpura)
            </span>
            <span className="opacity-40">&bull;</span>
            <span>Indore Express Corridor (Pithampur / Sanwer Rd)</span>
            <span className="opacity-40">&bull;</span>
            <span className="text-emerald-600 font-semibold">24–48h Pan-India Express Air Cargo</span>
          </div>

        </div>

        {/* =================================================================
            2. SIMPLISTIC & MODERN 3-COLUMN ARCHITECTURE
        ================================================================= */}
        <div className="pt-8 border-t border-black/10 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Col 1: About / Facility Telemetry (4 Cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-[#111215] tracking-wider uppercase">
                Facility Status: Online
              </span>
            </div>
            <p className="text-sm text-[#5E6573] leading-relaxed max-w-sm">
              Central India&apos;s premier additive manufacturing hub serving Indore and Bhopal. High-speed CoreXY kinematics, 
              12K SLA optics, and aerospace-certified composites engineered with micron repeatability.
            </p>
            <div className="pt-1 flex flex-col gap-2 font-mono text-xs text-[#5E6573]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
                <span>Govindpura Hub, Bhopal • Indore Express Line (Pithampur)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
                <span>+91 88899 88874 / +91 79998 24632 &bull; Mon–Sat 9AM–8PM IST</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Modern Jump Navigation (4 Cols) */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#8A91A0] font-semibold">
                Navigation
              </h4>
              <ul className="space-y-2 text-[#5E6573]">
                <li>
                  <Link to="/#products" className="hover:text-[#111215] transition-colors">
                    3D Products
                  </Link>
                </li>
                <li>
                  <Link to="/#hardware" className="hover:text-[#111215] transition-colors">
                    Hardware Fleet
                  </Link>
                </li>
                <li>
                  <Link to="/#specs" className="hover:text-[#111215] transition-colors">
                    Materials & Specs
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="hover:text-[#111215] transition-colors">
                    Component Catalog
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#8A91A0] font-semibold">
                Engineering
              </h4>
              <ul className="space-y-2 text-[#5E6573]">
                <li>
                  <Link to="/custom-lab" className="hover:text-[#111215] transition-colors text-[#FF5A1F] font-bold">
                    Instant CAD Slicer &rarr;
                  </Link>
                </li>
                <li>
                  <Link to="/tech" className="hover:text-[#111215] transition-colors">
                    Metrology Standard
                  </Link>
                </li>
                <li>
                  <Link to="/#faq" className="hover:text-[#111215] transition-colors">
                    FAQ & Dispatch
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#111215] transition-colors">
                    About the Hub
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Col 3: Sleek Modern Newsletter & WhatsApp Action (4 Cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#8A91A0] font-semibold">
              Technical Dispatch
            </h4>
            <p className="text-xs text-[#5E6573] leading-relaxed">
              Receive monthly additive whitepapers, material releases, and metrology benchmarks.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="relative">
              <div className="flex items-center bg-white border border-black/15 rounded-xl p-1 focus-within:border-[#FF5A1F] transition-all shadow-2xs">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter work email..."
                  className="bg-transparent text-[#111215] text-xs px-3 py-2 outline-none flex-1 placeholder:text-black/35 font-body"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to telemetry"
                  className="px-3 py-2 bg-[#FF5A1F] text-white hover:bg-[#E04810] rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-xs"
                >
                  <span>Subscribe</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>

            <div className="pt-1">
              <a
                href="https://wa.me/918889988874"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono transition-all font-medium"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Engineering Support on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* =================================================================
            3. MINIMALIST BOTTOM BAR & SOCIAL LINKS
        ================================================================= */}
        <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5E6573]">
          
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-[#5E6573]">
              &copy; {new Date().getFullYear()} Saturn 3D Printing Co.
            </span>
            <span className="text-black/20">&bull;</span>
            <span className="font-mono text-[11px] text-[#8A91A0]">
              Precision Additive Manufacturing &bull; Bhopal &amp; Indore, MP, India
            </span>
          </div>

          {/* Sleek Minimalist Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/918889988874"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-8 h-8 rounded-lg bg-white hover:bg-black/5 border border-black/10 text-[#5E6573] hover:text-[#111215] flex items-center justify-center transition-all shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://instagram.com/saturn3d.in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-lg bg-white hover:bg-black/5 border border-black/10 text-[#5E6573] hover:text-[#111215] flex items-center justify-center transition-all shadow-2xs"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://linkedin.com/company/saturn3d"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-lg bg-white hover:bg-black/5 border border-black/10 text-[#5E6573] hover:text-[#111215] flex items-center justify-center transition-all shadow-2xs"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://twitter.com/saturn3d_in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="w-8 h-8 rounded-lg bg-white hover:bg-black/5 border border-black/10 text-[#5E6573] hover:text-[#111215] flex items-center justify-center transition-all shadow-2xs"
            >
              <Twitter className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>

      {/* Mobile Sticky Quick Action Bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/10 p-3 flex items-center justify-between gap-3 shadow-lg"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="font-mono text-[11px] text-[#111215] pl-24 truncate font-medium">
          <span>±0.04 mm</span> &bull; <span>24-48h Air Cargo</span>
        </div>
        <button
          onClick={() => navigate('/custom-lab')}
          className="btn-precision-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
        >
          <span>Get Quote</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </footer>
  );
}
