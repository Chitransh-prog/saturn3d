'use client';

import React, { useState } from 'react';
import { ArrowRight, Instagram, Linkedin, Twitter, MessageSquare, Mail, Phone, MapPin, Sparkles, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-5xl h-44 bg-gradient-to-b from-[#412f91]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 space-y-12">
        
        {/* =================================================================
            1. SIMPLISTIC & MODERN 3-COLUMN ARCHITECTURE
        ================================================================= */}
        <div data-aos="fade-up" className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
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
                <MapPin className="w-3.5 h-3.5 text-[#412f91] shrink-0" />
                <span>Govindpura Hub, Bhopal • Indore Express Line (Pithampur)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#412f91] shrink-0" />
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
                  <Link to="/custom-lab" className="hover:text-[#111215] transition-colors">
                    Custom Slicer &amp; CAD
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
                  <Link to="/custom-lab" className="hover:text-[#111215] transition-colors text-[#412f91] font-bold">
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
              <div className="flex items-center bg-white border border-black/15 rounded-xl p-1 focus-within:border-[#412f91] transition-all shadow-2xs">
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
                  className="px-3 py-2 bg-[#412f91] text-white hover:bg-[#342575] rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-xs"
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
            2. MONUMENTAL SATURN 3D BRAND BANNER & FACILITY STRIP
        ================================================================= */}
        <div data-aos="fade-up" data-aos-delay="100" className="pt-10 pb-4 border-t border-black/10 flex flex-col items-center justify-center text-center">
          <Link to="/" className="group relative z-10 flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]">
            <img
              src="/logo.webp"
              alt="Saturn 3D Printing Company"
              className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto max-w-[85vw] object-contain select-none drop-shadow-xs"
            />
          </Link>

          {/* Clean Modern Geotag & Facility Strip */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-neutral-500 text-center px-4">
            <span className="text-neutral-900 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Bhopal Engineering Facility (Govindpura)
            </span>
            <span className="text-neutral-300">&bull;</span>
            <span className="text-neutral-600">Indore Industrial Corridor (Pithampur)</span>
            <span className="text-neutral-300">&bull;</span>
            <span className="text-emerald-700 font-medium">24–48h Air Cargo Dispatch</span>
          </div>
        </div>

        {/* =================================================================
            3. MINIMALIST BOTTOM BAR & SOCIAL LINKS
        ================================================================= */}
        <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5E6573]">
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-center sm:text-left">
            <span className="font-mono text-[11px] text-[#5E6573]">
              &copy; {new Date().getFullYear()} Saturn 3D Printing Co.
            </span>
            <span className="text-black/20 hidden xs:inline">&bull;</span>
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
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/10 px-4 py-3 flex items-center justify-between gap-3 shadow-lg"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="font-mono text-[11px] text-[#111215] truncate font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Bhopal Hub &bull; ±0.04mm Express</span>
        </div>
        <button
          onClick={() => navigate('/custom-lab')}
          className="btn-precision-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#412f91]"
        >
          <span>Instant Quote</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </footer>
  );
}
