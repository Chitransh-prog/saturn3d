'use client';

import React, { useState } from 'react';
import { ArrowRight, Instagram, Linkedin, Twitter, MessageSquare, Mail, Phone, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
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
    <footer className="w-full bg-[#0B0D10] text-[#F5F6F8] pt-16 sm:pt-24 pb-28 sm:pb-16 relative overflow-hidden select-none border-t border-white/10 font-body">
      
      {/* Background Engineering Dot Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 space-y-16">
        
        {/* =================================================================
            MONUMENTAL ONE-LINE BRAND BANNER WITH 3D REVOLVING SATURN EMBLEM
            (Exact layout inspired by user reference: One-Line + Revolving 3D Saturn in circle)
        ================================================================= */}
        <div className="relative w-full py-6 sm:py-12 border-b border-white/10 flex flex-col items-center justify-center overflow-hidden">
          
          {/* Subtle Orange Atmospheric Ambient Flare */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-4xl h-36 bg-gradient-to-r from-transparent via-[#FF5A1F]/15 to-transparent blur-3xl pointer-events-none" />

          {/* Monumental One-Line Wordmark with 3D Revolving Saturn Circle */}
          <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-4 md:gap-6 w-full max-w-full overflow-hidden select-none">
            
            {/* SATURN in Giant Bold White Lettering */}
            <span className="font-sans font-black tracking-tighter text-white uppercase text-[clamp(2.75rem,11.5vw,11.5rem)] leading-none">
              SATURN
            </span>

            {/* Circular Badge with Live 3D Revolving Planet Saturn */}
            <div className="relative shrink-0 flex items-center justify-center -my-2 sm:-my-4">
              {/* Outer Golden/Orange Glowing Ring */}
              <div className="relative w-14 h-14 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full p-[2px] sm:p-[3px] bg-gradient-to-tr from-[#FF5A1F] via-[#FBBF24] to-[#FF8A50] shadow-[0_0_35px_rgba(255,90,31,0.45)]">
                {/* Inner Dark Planet Chamber */}
                <div className="w-full h-full rounded-full bg-[#080A0D] border border-white/20 overflow-hidden relative shadow-inner">
                  {/* Real-time 3D Canvas with Revolving Saturn */}
                  <RevolvingSaturn3D />
                </div>
              </div>

              {/* Verified Holographic Precision Pip */}
              <span className="absolute -bottom-1 sm:-bottom-2 px-1.5 py-0.5 rounded-full bg-[#0B0D10] border border-[#FF5A1F]/50 font-mono text-[7px] sm:text-[9px] text-amber-300 font-semibold uppercase tracking-widest whitespace-nowrap shadow-md">
                3D HUB
              </span>
            </div>

            {/* 3D in Giant Bold White Lettering */}
            <span className="font-sans font-black tracking-tighter text-white uppercase text-[clamp(2.75rem,11.5vw,11.5rem)] leading-none">
              3D
            </span>

          </div>

          {/* Subtitle / Geotag Bar */}
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-mono text-[10px] sm:text-xs text-white/60 tracking-wider uppercase text-center px-4">
            <span className="text-[#FF5A1F] font-semibold">Additive Fabrication Facility</span>
            <span>&bull;</span>
            <span>Bhopal Industrial Hub, MP</span>
            <span>&bull;</span>
            <span className="text-emerald-400">24–48h Pan-India Express Air Cargo</span>
          </div>

        </div>

        {/* =================================================================
            5-COLUMN PRECISION DIRECTORY MATRIX
        ================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-white/10 text-xs">
          
          {/* Column 1: Processes */}
          <div className="space-y-4">
            <h4 className="type-mono-eyebrow text-white/50 text-[11px] uppercase tracking-wider">
              Processes
            </h4>
            <ul className="space-y-2.5 text-white/70">
              <li>
                <Link to="/custom-lab" className="hover:text-white transition-colors">
                  Industrial FDM Slicing
                </Link>
              </li>
              <li>
                <Link to="/custom-lab" className="hover:text-white transition-colors">
                  12K SLA Photopolymer Resin
                </Link>
              </li>
              <li>
                <Link to="/custom-lab" className="hover:text-white transition-colors">
                  Carbon-X Continuous Fiber
                </Link>
              </li>
              <li>
                <Link to="/custom-lab" className="hover:text-white transition-colors">
                  Automated CAD Telemetry
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
                  Aerospace & UAS Drone Frames
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Automotive & Motorsport
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Medical & Dental Splints
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Robotics End-Effectors
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Electronics Enclosures
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
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
                  Terms & Dispatch Policies
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Dispatch Newsletter & Quick Contact */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h4 className="type-mono-eyebrow text-white/50 text-[11px] uppercase tracking-wider">
              Engineering Dispatch
            </h4>
            <p className="text-[#A3A9B3] text-xs leading-relaxed">
              Monthly additive case studies, new polymer releases, and metrology benchmarks.
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
                <span className="truncate">Sector B, Govindpura Industrial Hub, Bhopal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
                <span>+91 88899 88874</span>
              </div>
            </div>
          </div>

        </div>

        {/* =================================================================
            BOTTOM COMPLIANCE & SOCIAL BAR
        ================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3A9B3]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span className="font-mono text-[11px]">
              Facility Status: Online &bull; Bhopal Hub &bull; All-India Express Air Cargo
            </span>
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
          <span>±0.04 mm</span> &bull; <span>24-48h Dispatch</span>
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
