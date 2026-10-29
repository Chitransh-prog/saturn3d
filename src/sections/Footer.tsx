import React, { useState } from 'react';
import { ArrowRight, Instagram, Linkedin, Twitter, MessageSquare, Mail, Phone, MapPin } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        
        {/* Top 5-Column Carbon-Style Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10 pb-16 border-b border-white/10 text-xs">
          
          {/* Column 1: Services */}
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
                  High-Resolution SLA Resin
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
                <a href="#materials" className="hover:text-white transition-colors">
                  Carbon-X PA12-CF
                </a>
              </li>
              <li>
                <a href="#materials" className="hover:text-white transition-colors">
                  PETG Industrial Grade
                </a>
              </li>
              <li>
                <a href="#materials" className="hover:text-white transition-colors">
                  Precision Tough Resin
                </a>
              </li>
              <li>
                <a href="#materials" className="hover:text-white transition-colors">
                  High-Temp 300°C Resin
                </a>
              </li>
              <li>
                <a href="#materials" className="hover:text-white transition-colors">
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
                  Aerospace & UAS Frames
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Automotive & Motorsport
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Medical Device Housings
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

          {/* Column 4: Resources & Legal */}
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

          {/* Column 5: Telemetry Dispatch Newsletter */}
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

            <div className="pt-2 text-xs text-[#A3A9B3] space-y-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>Govindpura Industrial Hub, Bhopal, MP</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>+91 88899 88874</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Social, Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3A9B3]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>Fabrication Cell Status: Online // Bhopal Hub, All-India Express</span>
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
            &copy; {new Date().getFullYear()} Saturn 3D Printing Co.
          </p>
        </div>

      </div>

      {/* Mobile Sticky Action Bar: Clean Precision (pl-24 clears Netlify badge) */}
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
