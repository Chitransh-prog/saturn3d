import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ShoppingBag, User, LogOut, Menu, ArrowRight, ChevronDown, 
  Layers, Cpu, ShieldCheck, FileCode, Sparkles, Search, Compass, ExternalLink, Box
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

// Home Page Section Jump Items (Merged from SubNav)
const HOME_SECTIONS = [
  { id: 'products', label: '3D Products' },
  { id: 'categories', label: 'Categories' },
  { id: 'hardware', label: 'Hardware Fleet' },
  { id: 'specs', label: 'Materials & Specs' },
  { id: 'configurator', label: 'Instant Quote' },
  { id: 'gallery', label: 'Real Prints' },
  { id: 'faq', label: 'FAQ' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('products');
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHomePage = pathname === '/';

  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();

  // 1. Scroll listener: glass background & hide/show on scroll
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

      if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
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

  // 2. ScrollSpy for Home Page Sections
  useEffect(() => {
    if (!isHomePage) return;

    const sectionIds = ['overview', 'products', 'categories', 'hardware', 'specs', 'configurator', 'gallery', 'faq'];

    const handleScrollSpy = () => {
      const scrollPos = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(id === 'overview' ? 'products' : id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [isHomePage]);

  // Smooth scroll handler for section pills
  const scrollToSection = (id: string) => {
    setActiveMegaMenu(null);
    setIsMobileMenuOpen(false);

    if (!isHomePage) {
      navigate(`/#${id}`);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const yOffset = -72; // Header offset
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(y);
      } else {
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      setActiveSection(id);
    }
  };

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
            { name: 'Small-Batch Production Runs', desc: '10 to 5,000 unit production with batch repeatability', href: '/#hardware' },
            { name: 'Post-Processing & Vapor Smoothing', desc: 'Chemical smoothing, thread inserts, and UV cure annealing', href: '/#specs' },
          ],
        },
      ],
      featured: {
        title: 'Precision SLA Impeller',
        spec: 'Tough Resin // ±0.04 mm // 0.05 mm layers',
        badge: 'SHOWCASE',
        href: '/product/1',
      },
    },
    materials: {
      title: 'Materials',
      columns: [
        {
          title: 'Engineering Thermoplastics',
          links: [
            { name: 'Carbon-X PA12-CF', desc: 'High stiffness, 140°C heat deflection, chemical resistant', href: '/#specs' },
            { name: 'PETG Industrial', desc: 'Durable, moisture resistant, certified food & chemical contact', href: '/#specs' },
            { name: 'ABS High-Impact', desc: 'Machinable, impact-resistant production grade polymer', href: '/#specs' },
          ],
        },
        {
          title: 'Specialty Formulations',
          links: [
            { name: 'Precision Tough SLA Resin', desc: 'ABS-like mechanical behavior with injection molded finish', href: '/#specs' },
            { name: 'High-Temperature Resin (300°C)', desc: 'Engineered for tooling, gas nozzles, and autoclave exposure', href: '/#specs' },
            { name: 'PLA Pro (Precision Grade)', desc: 'Ultra-low shrinkage, high dimensional stability for rapid mockups', href: '/#specs' },
          ],
        },
      ],
      featured: {
        title: 'Carbon-X Drone Spar',
        spec: 'PA12 + 20% Carbon Fiber // 180 MPa Flexural',
        badge: 'MATERIAL SPOTLIGHT',
        href: '/product/2',
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
        href: '/product/5',
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
          ? 'glass-nav py-2.5 px-4 sm:px-8 border-b border-black/10 shadow-sm'
          : 'bg-white/90 backdrop-blur-md py-3 px-4 sm:px-8 border-b border-black/5'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Wordmark */}
        <div className="flex items-center shrink-0">
          <Link
            to="/"
            className="flex items-center group transition-transform active:scale-98"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setActiveMegaMenu(null);
            }}
          >
            <Logo variant="dark" className="h-6 sm:h-7" />
          </Link>
        </div>

        {/* Center: Merged Navigation (Pills + Dropdowns) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          
          {/* Mega-Menu Services Trigger */}
          <div className="relative">
            <button
              onClick={() => setActiveMegaMenu(activeMegaMenu === 'services' ? null : 'services')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeMegaMenu === 'services'
                  ? 'text-[#111215] bg-black/10'
                  : 'text-[#4B5262] hover:text-[#111215] hover:bg-black/5'
              }`}
            >
              <span>Services</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeMegaMenu === 'services' ? 'rotate-180 text-[#FF5A1F]' : 'opacity-60'}`} />
            </button>
          </div>

          {/* Integrated Home Page Section Pills (with Active Orange Pill Indicator) */}
          {HOME_SECTIONS.map((sec) => {
            const isActive = isHomePage && activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF5A1F] text-white font-semibold shadow-sm shadow-[#FF5A1F]/30'
                    : 'text-[#4B5262] hover:text-[#111215] hover:bg-black/5'
                }`}
              >
                {sec.label}
              </button>
            );
          })}

          {/* Direct Link: Catalog */}
          <Link
            to="/categories"
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              pathname === '/categories'
                ? 'bg-[#FF5A1F] text-white font-semibold shadow-sm'
                : 'text-[#4B5262] hover:text-[#111215] hover:bg-black/5'
            }`}
            onClick={() => setActiveMegaMenu(null)}
          >
            Catalog
          </Link>

        </nav>

        {/* Right Action Cluster: Search + Cart + Auth + Orange "Instant CAD Quote" Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Quick Search Link */}
          <Link
            to="/categories"
            className="p-1.5 sm:p-2 text-[#4B5262] hover:text-[#111215] hover:bg-black/5 rounded-full transition-all flex items-center"
            title="Search parts"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={toggleCart}
            className="relative p-1.5 sm:p-2 text-[#4B5262] hover:text-[#111215] hover:bg-black/5 rounded-full transition-all cursor-pointer"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#FF5A1F] text-white font-mono text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Account / Auth Dropdown */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1.5 sm:p-2 text-[#4B5262] hover:text-[#111215] hover:bg-black/5 rounded-full transition-all cursor-pointer"
                  aria-label="User Account"
                >
                  <User className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 bg-white border border-black/10 p-1.5 font-body text-xs shadow-xl rounded-xl text-[#111215]"
              >
                <DropdownMenuLabel className="font-medium text-[11px] text-[#5E6573] truncate px-2 py-1.5">
                  {user?.name || user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-black/10" />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer font-medium px-2 py-2 hover:bg-black/5 rounded-lg text-[#111215]">
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="cursor-pointer px-2 py-2 hover:bg-black/5 rounded-lg text-[#5E6573] hover:text-[#111215]">
                    Order History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-black/10" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 px-2 py-2 flex items-center gap-2 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-block font-body text-xs font-medium text-[#4B5262] hover:text-[#111215] px-2.5 py-1.5 transition-colors"
            >
              Sign in
            </Link>
          )}

          {/* Merged Single Orange CAD Quote Button */}
          <Link
            to="/custom-lab"
            className="btn-precision-primary text-xs py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <span className="hidden sm:inline whitespace-nowrap">Instant CAD Quote</span>
            <span className="sm:hidden whitespace-nowrap text-[11px]">Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-[#4B5262] hover:text-[#111215] hover:bg-black/5 rounded-md"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mega Menu Dropdown Panel (Desktop) */}
      {activeMegaMenu && megaMenuData[activeMegaMenu as keyof typeof megaMenuData] && (
        <div className="hidden lg:block absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl border-b border-black/10 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="grid grid-cols-12 gap-8">
              
              {/* Columns 1 & 2: Categorised Links */}
              <div className="col-span-8 grid grid-cols-2 gap-8">
                {megaMenuData[activeMegaMenu as keyof typeof megaMenuData].columns.map((col, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="type-mono-eyebrow text-[#8A91A0] text-[11px] pb-1 border-b border-black/10 uppercase tracking-wider">
                      {col.title}
                    </h3>
                    <ul className="space-y-2">
                      {col.links.map((link, lIdx) => (
                        <li key={lIdx}>
                          <Link
                            to={link.href}
                            onClick={() => setActiveMegaMenu(null)}
                            className="group block p-2 rounded-lg hover:bg-black/5 transition-colors"
                          >
                            <div className="text-sm font-medium text-[#111215] group-hover:text-[#FF5A1F] transition-colors flex items-center justify-between">
                              <span>{link.name}</span>
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#FF5A1F]" />
                            </div>
                            <p className="text-xs text-[#5E6573] mt-0.5 line-clamp-1">
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
              <div className="col-span-4 pl-6 border-l border-black/10">
                <div className="type-mono-eyebrow text-[#8A91A0] text-[11px] pb-1 border-b border-black/10 mb-3 uppercase tracking-wider">
                  {megaMenuData[activeMegaMenu as keyof typeof megaMenuData].featured.badge}
                </div>
                <Link
                  to={megaMenuData[activeMegaMenu as keyof typeof megaMenuData].featured.href}
                  onClick={() => setActiveMegaMenu(null)}
                  className="block card-precision p-4 group hover:border-[#FF5A1F]/40 transition-all rounded-xl bg-[#F8F9FA] border border-black/10"
                >
                  <div className="aspect-video w-full rounded-lg bg-[#EEF0F4] border border-black/5 flex items-center justify-center mb-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5A1F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Cpu className="w-8 h-8 text-[#8A91A0] group-hover:text-[#FF5A1F] transition-colors" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#111215] group-hover:text-[#FF5A1F] transition-colors">
                    {megaMenuData[activeMegaMenu as keyof typeof megaMenuData].featured.title}
                  </h4>
                  <p className="font-mono text-xs text-[#5E6573] mt-1">
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
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-black/10 py-5 px-5 mt-2.5 max-h-[calc(100vh-70px)] overflow-y-auto">
          
          {/* Mobile Jump Section Pills */}
          <div className="pb-4 mb-4 border-b border-black/10">
            <span className="font-mono text-[10px] text-[#8A91A0] uppercase tracking-widest block mb-2">
              Page Navigation
            </span>
            <div className="grid grid-cols-2 gap-2">
              {HOME_SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                    isHomePage && activeSection === sec.id
                      ? 'bg-[#FF5A1F] text-white font-semibold'
                      : 'bg-black/5 text-[#111215] hover:bg-black/10'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {Object.entries(megaMenuData).map(([key, item]) => {
              const isExpanded = mobileExpandedSection === key;
              return (
                <div key={key} className="border-b border-black/5 pb-2">
                  <button
                    onClick={() => setMobileExpandedSection(isExpanded ? null : key)}
                    className="w-full py-2 flex items-center justify-between text-sm font-semibold text-[#111215]"
                  >
                    <span>{item.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#FF5A1F]' : 'text-[#8A91A0]'}`} />
                  </button>
                  {isExpanded && (
                    <div className="pl-3 py-2 space-y-2.5">
                      {item.columns.flatMap(c => c.links).map((link, idx) => (
                        <Link
                          key={idx}
                          to={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-xs text-[#5E6573] hover:text-[#111215] py-1"
                        >
                          <div className="font-medium text-[#111215]">{link.name}</div>
                          <div className="text-[11px] text-[#5E6573] line-clamp-1">{link.desc}</div>
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
              className="py-2.5 text-sm font-semibold text-[#111215] border-b border-black/5"
            >
              Catalog
            </Link>

            <div className="pt-3 flex flex-col gap-2.5">
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-precision-secondary text-xs text-center py-2.5 text-[#111215] border-black/15"
                >
                  Sign in / Register
                </Link>
              )}
              <Link
                to="/custom-lab"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-precision-primary text-xs py-2.5 text-center justify-center"
              >
                <span>Instant CAD Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
