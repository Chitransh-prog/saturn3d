import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ShieldCheck, Cloud } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

export default function Footer() {
  const navigate = useNavigate();
  const [timeString, setTimeString] = useState('');

  // Live dynamic clock for Indian Standard Time (IST)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      setTimeString(new Intl.DateTimeFormat('en-US', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-[#08090B] text-[#E2E8F0] pt-12 sm:pt-16 lg:pt-20 pb-6 relative overflow-hidden select-none">
      {/* Subtle Saturn Orange Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-[#F7931E]/8 rounded-full blur-[140px] pointer-events-none" />

      {/* 
        =======================================================================
        Top Navigation & Actions Bar (Full-Width, Harmonious Brand Theme)
        =======================================================================
      */}
      <div className="w-full px-6 sm:px-10 lg:px-16 mx-auto relative z-10">
        
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10 sm:gap-12 pb-8 sm:pb-12 border-b border-white/10">
          
          {/* 1. Official Saturn 3D Brand Logo */}
          <div className="flex items-center shrink-0">
            <Link
              to="/"
              className="inline-flex items-center transition-transform duration-200 active:scale-95 group"
            >
              <Logo
                variant="light"
                className="h-8 sm:h-9 opacity-95 group-hover:opacity-100 transition-opacity"
              />
            </Link>
          </div>

          {/* 2. Center 3-Column Minimal Navigation Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 text-xs sm:text-[13px] font-heading font-medium tracking-wide">
            
            {/* Column 1: Core Platform */}
            <div className="space-y-2.5">
              <Link to="/" className="text-slate-300 hover:text-[#F7931E] transition-colors block">
                Home
              </Link>
              <Link to="/custom-lab" className="text-slate-300 hover:text-[#F7931E] transition-colors block">
                Custom CAD Lab
              </Link>
              <Link to="/about" className="text-slate-300 hover:text-[#F7931E] transition-colors block">
                About Studio
              </Link>
              <Link to="/categories" className="text-slate-300 hover:text-[#F7931E] transition-colors block">
                Hardware Catalog
              </Link>
            </div>

            {/* Column 2: Legal & Protocol */}
            <div className="space-y-2.5">
              <a
                href="https://wa.me/917999824632"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-[#F7931E] transition-colors block"
              >
                Contact
              </a>
              <Link to="/custom-lab" className="text-slate-300 hover:text-[#F7931E] transition-colors block">
                Terms of Fabrication
              </Link>
              <Link to="/about" className="text-slate-300 hover:text-[#F7931E] transition-colors block">
                Privacy Policy
              </Link>
              <Link to="/tech" className="text-slate-300 hover:text-[#F7931E] transition-colors block">
                Tech Protocols
              </Link>
            </div>

            {/* Column 3: Social & Channels */}
            <div className="space-y-2.5 col-span-2 sm:col-span-1">
              <a
                href="https://twitter.com/saturn3d_in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-[#F7931E] transition-colors block"
              >
                X (Twitter)
              </a>
              <a
                href="https://instagram.com/saturn3d.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-[#F7931E] transition-colors block"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com/company/saturn3d"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-[#F7931E] transition-colors block"
              >
                LinkedIn
              </a>
              <a
                href="https://wa.me/917999824632"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-[#F7931E] transition-colors block"
              >
                WhatsApp Direct
              </a>
            </div>

          </div>

          {/* 3. Right Action Items: Quality Badge + Signature Saturn Orange Pill Button */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0">
            
            {/* Micron Quality Certification Badge */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono-tech text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F7931E]" />
              <div className="leading-tight">
                <span className="block font-bold text-white">ISO 9001</span>
                <span className="text-[9px] text-slate-400">&plusmn;0.05mm Precision</span>
              </div>
            </div>

            {/* Signature "Order now" Pill Button in Saturn Orange */}
            <button
              onClick={() => navigate('/custom-lab')}
              className="inline-flex items-center gap-3 pl-2 pr-6 py-2.5 rounded-full bg-[#F7931E] hover:bg-[#e07f12] text-white font-heading font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-orange-500/20 active:scale-95 group"
            >
              {/* Circular Arrow Badge */}
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center transition-transform group-hover:rotate-45">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </span>
              <span>Order now</span>
            </button>

          </div>

        </div>

      </div>

      {/* 
        =======================================================================
        Monumental Colossal Wordmark: Saturn 3D
        (Rendered in official Saturn Orange #F7931E with baseline crop)
        =======================================================================
      */}
      <div className="w-full mt-4 sm:mt-6 overflow-hidden leading-none select-none pointer-events-none relative z-10">
        <svg
          viewBox="0 0 1480 275"
          className="w-full h-auto block"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="saturnBrandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F7931E" />
              <stop offset="100%" stopColor="#FA9D32" />
            </linearGradient>
          </defs>
          <text
            x="50%"
            y="260"
            textAnchor="middle"
            fill="url(#saturnBrandGradient)"
            style={{
              fontFamily: "'Outfit', 'Montserrat', -apple-system, sans-serif",
              fontSize: '280px',
              fontWeight: 900,
              letterSpacing: '-0.04em',
            }}
          >
            Saturn 3D
          </text>
        </svg>
      </div>

      {/* 
        =======================================================================
        Bottom Metadata Bar: Copyright, Legal, India Time & Status
        =======================================================================
      */}
      <div className="w-full px-6 sm:px-10 lg:px-16 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono-tech text-slate-400 relative z-10">
        
        {/* Left: Copyright & Legal */}
        <div className="flex items-center gap-3">
          <span>Saturn 3D ©{new Date().getFullYear()}</span>
          <span>&bull;</span>
          <Link to="/about" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <span>&bull;</span>
          <Link to="/custom-lab" className="hover:text-white transition-colors">
            Terms of Fabrication
          </Link>
        </div>

        {/* Right: Location, Time & Weather Status */}
        <div className="flex items-center gap-2">
          <span>India (IST)</span>
          <span>&bull;</span>
          <span>{timeString || '9:40 PM'}</span>
          <span>&bull;</span>
          <span>28°C</span>
          <Cloud className="w-3.5 h-3.5 text-slate-400" />
        </div>

      </div>

    </footer>
  );
}
