'use client';

import React, { useState } from 'react';
import { ArrowRight, Instagram, Linkedin, Twitter, MessageSquare, Mail, Phone, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
    <footer className="w-full bg-[#0B0D10] text-[#F5F6F8] pt-20 pb-28 sm:pb-16 relative overflow-hidden select-none border-t border-white/10 font-body">
      {/* Background Engineering Dot Matrix (Exact Match to Reference Style) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 1.5px 1.5px, #FFFFFF 1.5px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Top 5-Column Precision Navigation Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10 pb-16 border-b border-white/10 text-xs">
          
          {/* Column 1: Processes */}
          <div className="space-y-4">
            <h4 className="type-mono-eyebrow text-white/50 text-[11px] uppercase tracking-wider">
              Processes
            </h4>
            <ul className="space-y-2.5 text-white/70">
              <li>
                <Link to="/custom-lab" className="hover:text-white transition-colors">
                  Industrial FDM & CoreXY
                </Link>
              </li>
              <li>
                <Link to="/custom-lab" className="hover:text-white transition-colors">
                  12K SLA Photopolymer Resin
                </Link>
              </li>
              <li>
                <Link to="/custom-lab" className="hover:text-white transition-colors">
                  Continuous Carbon-X PA12
                </Link>
              </li>
              <li>
                <Link to="/custom-lab" className="hover:text-white transition-colors">
                  Automated Slicing Analysis
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">
                  Production Batch Runs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Materials */}
          <div className="space-y-4">
            <h4 className="type-mono-eyebrow text-white/50 text-[11px] uppercase tracking-wider">
              Materials
            </h4>
            <ul className="space-y-2.5 text-white/70">
              <li>
                <a href="#specs" className="hover:text-white transition-colors">
                  Carbon-X PA12-CF
                </a>
              </li>
              <li>
                <a href="#specs" className="hover:text-white transition-colors">
                  PETG Industrial Grade
                </a>
              </li>
              <li>
                <a href="#specs" className="hover:text-white transition-colors">
                  Precision Tough SLA Resin
                </a>
              </li>
              <li>
                <a href="#specs" className="hover:text-white transition-colors">
                  High-Temp 300°C Resin
                </a>
              </li>
              <li>
                <a href="#specs" className="hover:text-white transition-colors">
                  PLA Pro Low-Shrinkage
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Industries */}
          <div className="space-y-4">
            <h4 className="type-mono-eyebrow text-white/50 text-[11px] uppercase tracking-wider">
              Industries
            </h4>
            <ul className="space-y-2.5 text-white/70">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Aerospace & Drone Spars
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Automotive & Motorsport
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Medical & Surgical Guides
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Robotics End-Effectors
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Electronics Jigs & Fixtures
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources & Knowledge */}
          <div className="space-y-4">
            <h4 className="type-mono-eyebrow text-white/50 text-[11px] uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2.5 text-white/70">
              <li>
                <Link to="/tech" className="hover:text-white transition-colors">
                  Design for Additive Guide
                </Link>
              </li>
              <li>
                <Link to="/tech" className="hover:text-white transition-colors">
                  Shop Metrology Standard
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <Link to="/design-system" className="hover:text-white transition-colors text-white/40">
                  Precision Design System
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Terms & Shipping Policies
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Telemetry Dispatch & Contact */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h4 className="type-mono-eyebrow text-white/50 text-[11px] uppercase tracking-wider">
              Engineering Dispatch
            </h4>
            <p className="text-[#A3A9B3] text-xs leading-relaxed">
              Additive case studies, polymer datasheets, and shop metrology benchmarks.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex items-center bg-[#12151A] border border-white/10 rounded-lg p-1 focus-within:border-[#FF5A1F] transition-colors">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="bg-transparent text-white text-xs px-2.5 py-1.5 outline-none flex-1 placeholder:text-white/30"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="w-7 h-7 bg-[#FF5A1F] text-white hover:bg-[#E04810] rounded-md transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="pt-2 text-xs text-[#A3A9B3] space-y-1.5">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
                <span className="truncate">Sector B, Govindpura Industrial Area, Bhopal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
                <span>+91 88899 88874</span>
              </div>
            </div>
          </div>

        </div>

        {/* ===================================================================
            ICONIC FOOTER BRAND MONUMENT: CIRCULAR BADGE + GIANT "SATURN 3D"
        =================================================================== */}
        <div className="pt-16 pb-8 relative flex flex-col items-center justify-center text-center overflow-hidden">
          
          {/* Centered Circular Seal Medallion Overlapping Wordmark */}
          <div className="relative z-20 -mb-10 sm:-mb-14 md:-mb-18 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-[#0B0D10] border-4 border-[#FF5A1F] shadow-[0_12px_40px_rgba(255,90,31,0.4)] flex items-center justify-center p-1.5 sm:p-2 group hover:scale-105 transition-all duration-300">
              
              {/* Inner Medallion Badge Disk */}
              <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-2.5 sm:p-3 relative shadow-inner overflow-hidden border border-[#FF5A1F]/30">
                
                {/* Micro Circular Brand Label */}
                <span className="font-mono text-[7px] sm:text-[8px] font-bold tracking-widest text-[#FF5A1F] uppercase mb-0.5 sm:mb-1">
                  EST. BHOPAL
                </span>

                {/* Saturn 3D Emblem Image */}
                <img
                  src="/logo-orange.png"
                  alt="Saturn 3D Official Seal"
                  className="w-10 sm:w-14 md:w-16 h-auto object-contain drop-shadow"
                />

                {/* Bottom Spec Tag */}
                <span className="font-mono text-[6px] sm:text-[7px] font-semibold tracking-wider text-[#0B0D10]/80 uppercase mt-0.5">
                  &plusmn;0.04mm // INDIA
                </span>
              </div>

            </div>
          </div>

          {/* Massive Typographic Wordmark Spanning Across Screen */}
          <div className="w-full overflow-hidden select-none pointer-events-none py-2">
            <h2 className="font-display font-black text-white text-[14.5vw] sm:text-[15.5vw] leading-[0.82] tracking-tighter uppercase text-center w-full block">
              SATURN 3D
            </h2>
          </div>

          {/* Sub-Brand Geographic Verification Slogan */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono text-[10px] sm:text-xs text-white/50 tracking-wider uppercase mt-4">
            <span>Additive Fabrication Lab</span>
            <span className="text-[#FF5A1F]">&bull;</span>
            <span>Bhopal Central Hub</span>
            <span className="text-[#FF5A1F]">&bull;</span>
            <span>Pan-India 24-48h Express Air Cargo</span>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Telemetry, and Socials */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3A9B3]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span className="font-mono text-[11px]">Cell Status: Online // Micron Tolerances Verified</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/saturn3d.in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/918889988874"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:text-[#25D366] transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/company/saturn3d"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-white transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com/saturn3d_in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="hover:text-white transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>

          <p className="font-mono text-[11px] text-white/40">
            &copy; {new Date().getFullYear()} Saturn 3D Printing Co. All rights reserved.
          </p>
        </div>

      </div>

      {/* Mobile Sticky Action Bar: Clean Precision */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0D10]/95 backdrop-blur-md border-t border-white/10 p-3 flex items-center justify-between gap-3"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="font-mono text-[11px] text-white/80 pl-24 truncate">
          <span>&plusmn;0.04 mm</span> &bull; <span>24-48h Dispatch</span>
        </div>
        <button
          onClick={() => navigate('/custom-lab')}
          className="btn-precision-primary text-xs py-2 px-4 flex items-center gap-1.5"
        >
          <span>Get a quote</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
