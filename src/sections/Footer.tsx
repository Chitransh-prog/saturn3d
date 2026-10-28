import React, { useState } from 'react';
import { ArrowRight, Instagram, MessageSquare, Facebook, Linkedin, Twitter } from 'lucide-react';
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
    <footer
      data-bg="#0B0B0B"
      data-fg="#FFF4E0"
      className="w-full bg-[#0B0B0B] text-white pt-20 sm:pt-28 pb-28 sm:pb-16 relative overflow-hidden select-none hairline-t-ink"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        
        {/* Top 4-Column Open Link Matrix (De-boxed!) */}
        <div data-aos="fade-up" className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-14 pb-16 font-mono text-xs hairline-b-white">
          
          {/* Column 1: SHOP & FABRICATION */}
          <div className="space-y-4">
            <span className="font-mono font-bold text-xs uppercase tracking-widest text-[#FFE14D] block">
              FABRICATION
            </span>
            <ul className="space-y-2.5 font-bold tracking-wider text-white/70">
              <li>
                <Link to="/categories" className="hover:text-[#FF5A1F] transition-colors inline-block">
                  ALL HARDWARE
                </Link>
              </li>
              <li>
                <Link to="/custom-lab" className="hover:text-[#FF5A1F] transition-colors inline-block">
                  INDUSTRIAL FDM
                </Link>
              </li>
              <li>
                <Link to="/custom-lab" className="hover:text-[#FF5A1F] transition-colors inline-block">
                  12K SLA RESIN
                </Link>
              </li>
              <li>
                <Link to="/custom-lab" className="hover:text-[#FF5A1F] transition-colors inline-block">
                  CARBON-X PA12
                </Link>
              </li>
              <li>
                <Link to="/custom-lab" className="hover:text-[#FF5A1F] transition-colors inline-block">
                  TPU ELASTOMERS
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/917999824632?text=Hello%20Saturn%203D%20team%2C%20I%20would%20like%20to%20discuss%20bulk%20enterprise%20manufacturing."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF5A1F] transition-colors inline-block text-[#FFE14D]"
                >
                  BULK ENTERPRISE &rarr;
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: ABOUT */}
          <div className="space-y-4">
            <span className="font-mono font-bold text-xs uppercase tracking-widest text-[#FFE14D] block">
              SATURN LAB
            </span>
            <ul className="space-y-2.5 font-bold tracking-wider text-white/70">
              <li>
                <Link to="/about" className="hover:text-[#FF5A1F] transition-colors inline-block">
                  OUR MISSION
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#FF5A1F] transition-colors inline-block">
                  METHODOLOGY
                </a>
              </li>
              <li>
                <a href="#materials" className="hover:text-[#FF5A1F] transition-colors inline-block">
                  MATERIAL SCIENCE
                </a>
              </li>
              <li>
                <Link to="/design-system" className="hover:text-[#FF5A1F] transition-colors inline-block text-white/40">
                  DESIGN SYSTEM
                </Link>
              </li>
              <li>
                <a href="mailto:hello@saturn3d.in" className="hover:text-[#FF5A1F] transition-colors inline-block">
                  CONTACT ENGINEERING
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: LEGAL & ACCREDITATION */}
          <div className="space-y-4">
            <span className="font-mono font-bold text-xs uppercase tracking-widest text-[#FFE14D] block">
              LEGAL & AUDIT
            </span>
            <ul className="space-y-2.5 font-bold tracking-wider text-white/70">
              <li>
                <Link to="/about" className="hover:text-[#FF5A1F] transition-colors inline-block">
                  PRIVACY POLICY
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FF5A1F] transition-colors inline-block">
                  TERMS OF SERVICE
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-[#FF5A1F] transition-colors inline-block">
                  SHIPPING & TRANSIT
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#FF5A1F] transition-colors inline-block">
                  RETURNS & RE-PRINTS
                </Link>
              </li>
              <li>
                <span className="text-[#7CF2C1] inline-block font-black">
                  ISO 9001 PROTOCOLS
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: NEWSLETTER SIGNUP */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <span className="font-mono font-bold text-xs uppercase tracking-widest text-white block">
              TELEMETRY DISPATCH
            </span>
            <p className="text-white/60 text-xs font-body leading-relaxed">
              Monthly materials research, new polymer arrivals, and rapid engineering guides.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex items-center bg-white/10 hairline-white p-1 rounded-xs">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="bg-transparent text-white text-xs font-mono px-3 py-2 outline-none flex-1 placeholder:text-white/40"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="w-8 h-8 bg-[#FF5A1F] text-black hover:bg-white transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </form>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2 text-white/60">
              <a
                href="https://instagram.com/saturn3d.in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-[#FF5A1F] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/917999824632"
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
                className="hover:text-[#FF5A1F] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/saturn3d_in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="hover:text-[#FF5A1F] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>

            <p className="text-[11px] font-mono text-white/40 pt-2">
              &copy; Saturn 3D {new Date().getFullYear()} &bull; Govindpura Industrial Area, Bhopal
            </p>
          </div>

        </div>

      </div>

      {/* Giant Colossal Wordmark: SATURN 3D */}
      <div data-aos="fade-up" data-aos-delay="100" className="w-full relative z-10 overflow-hidden leading-none select-none pointer-events-none px-4 sm:px-8 mt-12">
        <svg
          viewBox="0 0 1480 220"
          className="w-full h-auto block"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="50%"
            y="200"
            textAnchor="middle"
            fill="#FFFFFF"
            style={{
              fontFamily: "'Space Grotesk', -apple-system, sans-serif",
              fontSize: '260px',
              fontWeight: 900,
              letterSpacing: '-0.045em',
            }}
          >
            SATURN 3D
          </text>
        </svg>
      </div>

      {/* Mobile Sticky Bar: "GET A QUOTE" */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF4E0] hairline-t p-3 flex items-center justify-between gap-3 shadow-lg"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="font-mono text-xs font-bold text-[#0B0B0B] pl-2">
          <span>&plusmn;0.04 MM</span> &bull; <span>24H DISPATCH</span>
        </div>
        <button
          onClick={() => navigate('/custom-lab')}
          className="btn-brutal btn-brutal-orange text-xs py-2 px-5 flex items-center gap-1.5 shadow-[2px_2px_0px_#0B0B0B]"
        >
          <span>GET A QUOTE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
