import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ShoppingBag, User, LogOut, Menu, ArrowRight, ChevronDown, 
  Layers, Cpu, ShieldCheck, FileCode, Sparkles, Search, Compass, ExternalLink
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import Logo from './Logo';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();

  // Scroll listener: hide on scroll down, reveal on scroll up, glass background
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) return;
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
        setActiveMegaMenu(null);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    logout();
    toast.success('Logged out successfully.');
    navigate('/');
  };

  const megaMenuData = {
    services: {
      title: 'Services',
      columns: [
        {
          title: 'Processes',
          links: [
            { name: 'Industrial FDM Prototyping', desc: 'Large build volumes up to 350mm³ with high reliability', href: '/custom-lab' },
            { name: 'High-Resolution SLA Resin', desc: '0.025–0.05 mm layer precision for surgical & aesthetic parts', href: '/custom-lab' },
            { name: 'Carbon-X Reinforced FFF', desc: 'Continuous carbon fiber matrices replacing machined aluminum', href: '/custom-lab' },
          ],
        },
        {
          title: 'Capabilities',
          links: [
            { name: 'Instant CAD Telemetry & Slicing', desc: 'Upload .STEP or .STL for immediate volumetric estimation', href: '/custom-lab' },
            { name: 'Small-Batch Production Runs', desc: '10 to 5,000 unit production with batch repeatability', href: '/#the-lab' },
            { name: 'Post-Processing & Vapor Smoothing', desc: 'Chemical smoothing, thread inserts, and UV cure annealing', href: '/#materials' },
          ],
        },
      ],
      featured: {
        title: 'Precision SLA Impeller',
        spec: 'Tough Resin // ±0.04 mm // 0.05 mm layers',
        badge: 'SHOWCASE',
        href: '/custom-lab',
      },
    },
    materials: {
      title: 'Materials',
      columns: [
        {
          title: 'Engineering Thermoplastics',
          links: [
            { name: 'Carbon-X PA12-CF', desc: 'High stiffness, 140°C heat deflection, chemical resistant', href: '/#materials' },
            { name: 'PETG Industrial', desc: 'Durable, moisture resistant, certified food & chemical contact', href: '/#materials' },
            { name: 'ABS High-Impact', desc: 'Machinable, impact-resistant production grade polymer', href: '/#materials' },
          ],
        },
        {
          title: 'Specialty Formulations',
          links: [
            { name: 'Precision Tough SLA Resin', desc: 'ABS-like mechanical behavior with injection molded finish', href: '/#materials' },
            { name: 'High-Temperature Resin (300°C)', desc: 'Engineered for tooling, gas nozzles, and autoclave exposure', href: '/#materials' },
            { name: 'PLA Pro (Precision Grade)', desc: 'Ultra-low shrinkage, high dimensional stability for rapid mockups', href: '/#materials' },
          ],
        },
      ],
      featured: {
        title: 'Carbon-X Drone Spar',
        spec: 'PA12 + 20% Carbon Fiber // 180 MPa Flexural',
        badge: 'MATERIAL SPOTLIGHT',
        href: '/#materials',
      },
    },
    industries: {
      title: 'Industries',
      columns: [
        {
          title: 'High-Trust Sectors',
          links: [
            { name: 'Aerospace & UAS Drone Frames', desc: 'Lightweight airframes, sensor brackets, avionics housings', href: '/about' },
            { name: 'Automotive & Motorsport', desc: 'Custom intake runners, jigs, brackets, and testing manifolds', href: '/about' },
            { name: 'Medical Devices & Orthotics', desc: 'Biocompatible custom housings and surgical drill guides', href: '/about' },
          ],
        },
        {
          title: 'Industrial Applications',
          links: [
            { name: 'Assembly Jigs & End-Effectors', desc: 'Robot grippers and factory floor assembly positioning fixtures', href: '/about' },
            { name: 'Consumer Hardware R&D', desc: 'Rapid iterative form, fit, and functional tactile verification', href: '/about' },
            { name: 'Electronic Enclosures', desc: 'Flame-retardant enclosures with custom brass threaded inserts', href: '/about' },
          ],
        },
      ],
      featured: {
        title: 'Robotic Gripper Arm',
        spec: 'Direct Tooling // 24h Turnaround // Bhopal Hub',
        badge: 'APPLICATION',
        href: '/about',
      },
    },
    resources: {
      title: 'Resources',
      columns: [
        {
          title: 'Technical Guides',
          links: [
            { name: 'Design for Additive Manufacturing', desc: 'Wall thickness, hole tolerances, overhang rules & draft angles', href: '/tech' },
            { name: 'Polymer Mechanical Data Sheets', desc: 'Compare tensile, flexural, elongation, and heat deflection', href: '/#materials' },
            { name: 'Tolerance & Metrology Standard', desc: 'SLA ±0.04 mm and FDM ±0.15 mm shop verification thresholds', href: '/tech' },
          ],
        },
        {
          title: 'Company & Facility',
          links: [
            { name: 'About the Bhopal Fabrication Hub', desc: 'Our machine fleet, quality control cell, and team', href: '/about' },
            { name: 'Frequently Asked Questions', desc: 'Dispatch windows, file formats, surface finishes, payment', href: '/#faq' },
            { name: 'Direct WhatsApp Engineering Line', desc: 'Immediate design review with a fabrication specialist', href: 'https://wa.me/918889988874' },
          ],
        },
      ],
      featured: {
        title: 'Additive Sizing Guide',
        spec: 'Complete 2026 Polymer & Resin Compendium',
        badge: 'ENGINEERING PDF',
        href: '/tech',
      },
    },
  };

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isVisible || isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled || isMobileMenuOpen || activeMegaMenu
          ? 'glass-nav py-3 px-6 sm:px-10'
          : 'bg-transparent py-4 px-6 sm:px-10'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center group transition-transform active:scale-98"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setActiveMegaMenu(null);
            }}
          >
            <Logo variant="white" className="h-7 sm:h-8" />
          </Link>

          {/* Center-Left: Mega Menu Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 font-body text-xs font-medium text-white/80">
            {Object.entries(megaMenuData).map(([key, item]) => {
              const isOpen = activeMegaMenu === key;
              return (
                <div key={key} className="relative">
                  <button
                    onClick={() => setActiveMegaMenu(isOpen ? null : key)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-all cursor-pointer ${
                      isOpen
                        ? 'text-white bg-white/10'
                        : 'hover:text-white hover:bg-white/5'
                    }`}
                    aria-expanded={isOpen}
                  >
                    <span>{item.title}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#FF5A1F]' : 'opacity-60'}`} />
                  </button>
                </div>
              );
            })}

            {/* Direct Link: Catalog */}
            <Link
              to="/categories"
              className="px-3.5 py-2 rounded-md hover:text-white hover:bg-white/5 transition-all text-white/80"
              onClick={() => setActiveMegaMenu(null)}
            >
              Catalog
            </Link>
          </nav>
        </div>

        {/* Right Action Cluster: Search + Cart + Auth + Orange Quote Button */}
        <div className="flex items-center gap-3">
          
          {/* Quick Search Link */}
          <Link
            to="/categories"
            className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-all hidden sm:flex items-center gap-1.5 text-xs"
            title="Search parts"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={toggleCart}
            className="relative p-2 text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-all cursor-pointer"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF5A1F] text-white font-mono text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Account / Auth Dropdown */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-all cursor-pointer"
                  aria-label="User Account"
                >
                  <User className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 bg-[#12151A] border border-white/10 p-1.5 font-body text-xs shadow-precision-lg rounded-xl text-white"
              >
                <DropdownMenuLabel className="font-medium text-[11px] text-white/60 truncate px-2 py-1.5">
                  {user?.name || user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer font-medium px-2 py-2 hover:bg-white/10 rounded-lg text-white">
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="cursor-pointer px-2 py-2 hover:bg-white/10 rounded-lg text-white/80 hover:text-white">
                    Order History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-400 px-2 py-2 flex items-center gap-2 hover:bg-red-500/10 rounded-lg"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-block font-body text-xs font-medium text-white/80 hover:text-white px-3 py-1.5 transition-colors"
            >
              Sign in
            </Link>
          )}

          {/* Primary Orange "Get a Quote" Button */}
          <Link
            to="/custom-lab"
            className="!hidden sm:!inline-flex btn-precision-primary text-xs py-2 px-3.5"
          >
            <span>Get a quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/5 rounded-md"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mega Menu Dropdown Panel (Desktop) */}
      {activeMegaMenu && megaMenuData[activeMegaMenu as keyof typeof megaMenuData] && (
        <div className="hidden lg:block absolute top-full left-0 right-0 bg-[#0B0D10]/95 backdrop-blur-xl border-b border-white/10 shadow-precision-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto px-10 py-8">
            <div className="grid grid-cols-12 gap-8">
              
              {/* Columns 1 & 2: Categorised Links */}
              <div className="col-span-8 grid grid-cols-2 gap-8">
                {megaMenuData[activeMegaMenu as keyof typeof megaMenuData].columns.map((col, idx) => (
                  <div key={idx} className="space-y-4">
                    <h3 className="type-mono-eyebrow text-white/50 text-[11px] pb-1 border-b border-white/10">
                      {col.title}
                    </h3>
                    <ul className="space-y-3">
                      {col.links.map((link, lIdx) => (
                        <li key={lIdx}>
                          <Link
                            to={link.href}
                            onClick={() => setActiveMegaMenu(null)}
                            className="group block p-2 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <div className="text-sm font-medium text-white group-hover:text-[#FF5A1F] transition-colors flex items-center justify-between">
                              <span>{link.name}</span>
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#FF5A1F]" />
                            </div>
                            <p className="text-xs text-[#A3A9B3] mt-0.5 line-clamp-2">
                              {link.desc}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Column 3: Featured Part Showcase */}
              <div className="col-span-4 pl-4 border-l border-white/10">
                <div className="type-mono-eyebrow text-white/50 text-[11px] pb-1 border-b border-white/10 mb-4">
                  {megaMenuData[activeMegaMenu as keyof typeof megaMenuData].featured.badge}
                </div>
                <Link
                  to={megaMenuData[activeMegaMenu as keyof typeof megaMenuData].featured.href}
                  onClick={() => setActiveMegaMenu(null)}
                  className="block card-precision-dark p-5 group hover:border-[#FF5A1F]/40 transition-all"
                >
                  <div className="aspect-video w-full rounded-lg bg-[#181C22] border border-white/5 flex items-center justify-center mb-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5A1F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Cpu className="w-10 h-10 text-white/30 group-hover:text-[#FF5A1F] transition-colors" />
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-[#FF5A1F] transition-colors">
                    {megaMenuData[activeMegaMenu as keyof typeof megaMenuData].featured.title}
                  </h4>
                  <p className="font-mono text-xs text-[#A3A9B3] mt-1">
                    {megaMenuData[activeMegaMenu as keyof typeof megaMenuData].featured.spec}
                  </p>
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Mobile Accordion Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0D10]/98 backdrop-blur-xl border-t border-white/10 py-6 px-6 mt-3 max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex flex-col gap-2">
            {Object.entries(megaMenuData).map(([key, item]) => {
              const isExpanded = mobileExpandedSection === key;
              return (
                <div key={key} className="border-b border-white/5 pb-2">
                  <button
                    onClick={() => setMobileExpandedSection(isExpanded ? null : key)}
                    className="w-full py-2.5 flex items-center justify-between text-sm font-semibold text-white"
                  >
                    <span>{item.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#FF5A1F]' : 'text-white/50'}`} />
                  </button>
                  {isExpanded && (
                    <div className="pl-3 py-2 space-y-3">
                      {item.columns.flatMap(c => c.links).map((link, idx) => (
                        <Link
                          key={idx}
                          to={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-xs text-white/70 hover:text-white py-1"
                        >
                          <div className="font-medium text-white/90">{link.name}</div>
                          <div className="text-[11px] text-[#A3A9B3] line-clamp-1">{link.desc}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              to="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-3 text-sm font-semibold text-white border-b border-white/5"
            >
              Catalog
            </Link>

            <div className="pt-4 flex flex-col gap-3">
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-precision-secondary text-xs text-center py-2.5 text-white"
                >
                  Sign in / Register
                </Link>
              )}
              <Link
                to="/custom-lab"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-precision-primary text-xs py-3 text-center justify-center"
              >
                <span>Get a quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
