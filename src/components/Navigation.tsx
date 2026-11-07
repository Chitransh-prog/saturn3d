import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ShoppingBag, User, LogOut, Menu, ArrowRight, ChevronDown, 
  Layers, Cpu, ShieldCheck, FileCode, Sparkles, Search, Box
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

// Home Page Section Jump Items (Streamlined, no duplicate categories)
const HOME_SECTIONS = [
  { id: 'products', label: 'Products' },
  { id: 'hardware', label: 'Fleet' },
  { id: 'gallery', label: 'Gallery' },
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

    const sectionIds = ['overview', 'products', 'categories', 'hardware', 'gallery', 'faq'];

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
            { 
              name: 'Industrial FDM Prototyping', 
              desc: 'Large build volumes up to 350mm³ with engineering thermoplastics', 
              href: '/custom-lab',
              icon: Box
            },
            { 
              name: 'High-Resolution SLA Resin', 
              desc: '0.025–0.05 mm layer precision for surgical & aesthetic parts', 
              href: '/custom-lab',
              icon: Sparkles
            },
            { 
              name: 'Carbon-X Reinforced FFF', 
              desc: 'Continuous carbon fiber matrices replacing machined aluminum', 
              href: '/custom-lab',
              icon: Layers
            },
          ],
        },
        {
          title: 'Capabilities',
          links: [
            { 
              name: 'Instant CAD Telemetry & Slicing', 
              desc: 'Upload .STEP or .STL for immediate volumetric estimation', 
              href: '/custom-lab',
              icon: FileCode
            },
            { 
              name: 'Small-Batch Production Runs', 
              desc: '10 to 5,000 unit production with batch repeatability', 
              href: '/#hardware',
              icon: Cpu
            },
            { 
              name: 'Post-Processing & Vapor Smoothing', 
              desc: 'Chemical smoothing, thread inserts, and UV cure annealing', 
              href: '/categories',
              icon: ShieldCheck
            },
          ],
        },
      ],
      featured: {
        title: 'Precision SLA Impeller',
        spec: 'Tough Resin // ±0.04 mm // 0.05 mm layers',
        badge: 'SHOWCASE',
        href: '/categories',
        image: '/showcase/sla-turbine-impeller.webp',
      },
    },
    materials: {
      title: 'Materials',
      columns: [
        {
          title: 'Engineering Thermoplastics',
          links: [
            { name: 'Carbon-X PA12-CF', desc: 'High stiffness, 140°C heat deflection, chemical resistant', href: '/custom-lab', icon: Layers },
            { name: 'PETG Industrial', desc: 'Durable, moisture resistant, certified food & chemical contact', href: '/custom-lab', icon: Box },
            { name: 'ABS High-Impact', desc: 'Machinable, impact-resistant production grade polymer', href: '/custom-lab', icon: Box },
          ],
        },
        {
          title: 'Specialty Formulations',
          links: [
            { name: 'Precision Tough SLA Resin', desc: 'ABS-like mechanical behavior with injection molded finish', href: '/custom-lab', icon: Sparkles },
            { name: 'High-Temperature Resin (300°C)', desc: 'Engineered for tooling, gas nozzles, and autoclave exposure', href: '/custom-lab', icon: ShieldCheck },
            { name: 'PLA Pro (Precision Grade)', desc: 'Ultra-low shrinkage, high dimensional stability for rapid mockups', href: '/custom-lab', icon: Box },
          ],
        },
      ],
      featured: {
        title: 'Carbon-X Drone Spar',
        spec: 'PA12 + 20% Carbon Fiber // 180 MPa Flexural',
        badge: 'MATERIAL SPOTLIGHT',
        href: '/categories',
        image: '/showcase/carbon-drone-spar.webp',
      },
    },
    industries: {
      title: 'Industries',
      columns: [
        {
          title: 'High-Trust Sectors',
          links: [
            { name: 'Aerospace & UAS Drone Frames', desc: 'Lightweight airframes, sensor brackets, avionics housings', href: '/about', icon: Layers },
            { name: 'Automotive & Motorsport', desc: 'Custom intake runners, jigs, brackets, and testing manifolds', href: '/about', icon: Cpu },
            { name: 'Medical Devices & Orthotics', desc: 'Biocompatible custom housings and surgical drill guides', href: '/about', icon: Sparkles },
          ],
        },
        {
          title: 'Industrial Applications',
          links: [
            { name: 'Assembly Jigs & End-Effectors', desc: 'Robot grippers and factory floor assembly positioning fixtures', href: '/about', icon: Box },
            { name: 'Consumer Hardware R&D', desc: 'Rapid iterative form, fit, and functional tactile verification', href: '/about', icon: FileCode },
            { name: 'Electronic Enclosures', desc: 'Flame-retardant enclosures with custom brass threaded inserts', href: '/about', icon: ShieldCheck },
          ],
        },
      ],
      featured: {
        title: 'Robotic Gripper Arm',
        spec: 'Direct Tooling // 24h Turnaround // Bhopal Hub',
        badge: 'APPLICATION',
        href: '/categories',
        image: '/showcase/robotic-gripper.webp',
      },
    },
  };

  return (
    <>
      {/* Dimming Backdrop Overlay for Desktop Mega Menu */}
      {activeMegaMenu && (
        <div
          className="hidden lg:block fixed inset-0 top-[60px] bg-black/25 backdrop-blur-[2px] z-40 transition-opacity duration-200"
          onClick={() => setActiveMegaMenu(null)}
          aria-hidden="true"
        />
      )}

      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isVisible || isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        } ${
          activeMegaMenu
            ? 'bg-white py-2.5 px-4 sm:px-8 border-b border-neutral-200 shadow-md'
            : isScrolled || isMobileMenuOpen
            ? 'bg-white/95 backdrop-blur-md py-2.5 px-4 sm:px-8 border-b border-neutral-200/80 shadow-sm'
            : 'bg-white/90 backdrop-blur-md py-3 px-4 sm:px-8 border-b border-neutral-200/50'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          
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

          {/* Center: Clean Modern SaaS Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            
            {/* Mega-Menu Services Trigger */}
            <div className="relative">
              <button
                aria-expanded={activeMegaMenu === 'services'}
                aria-haspopup="true"
                onClick={() => setActiveMegaMenu(activeMegaMenu === 'services' ? null : 'services')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#412f91] ${
                  activeMegaMenu === 'services'
                    ? 'text-neutral-900 bg-neutral-100 font-semibold shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMegaMenu === 'services' ? 'rotate-180 text-[#412f91]' : 'opacity-50'}`} />
              </button>
            </div>

            {/* Direct Link: Products (homepage anchor) */}
            <button
              onClick={() => scrollToSection('products')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#412f91] ${
                isHomePage && activeSection === 'products'
                  ? 'text-neutral-900 bg-neutral-100 font-semibold shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              Products
            </button>

            {/* Direct Link: Catalog (full component catalog page) */}
            <Link
              to="/categories"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#412f91] ${
                pathname === '/categories'
                  ? 'text-neutral-900 bg-neutral-100 font-semibold shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
              onClick={() => setActiveMegaMenu(null)}
            >
              Catalog
            </Link>

            {/* Remaining Clean Anchor Sections */}
            {HOME_SECTIONS.filter(s => s.id !== 'products').map((sec) => {
              const isActive = isHomePage && activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#412f91] ${
                    isActive
                      ? 'text-neutral-900 bg-neutral-100 font-semibold shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
                  }`}
                >
                  {sec.label}
                </button>
              );
            })}

          </nav>

          {/* Right Action Cluster: Search + Cart + Auth + Orange "Get Quote" Button */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Quick Search Link */}
            <Link
              to="/categories"
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors flex items-center"
              title="Search component catalog"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#412f91] text-white font-mono text-[9px] font-bold flex items-center justify-center rounded-full shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                    aria-label="User Account"
                  >
                    <User className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 bg-white border border-neutral-200 p-1.5 font-body text-xs shadow-xl rounded-xl text-neutral-900"
                >
                  <DropdownMenuLabel className="font-medium text-[11px] text-neutral-500 truncate px-2 py-1.5">
                    {user?.name || user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-neutral-200" />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer font-medium px-2 py-2 hover:bg-neutral-100 rounded-lg text-neutral-900">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer px-2 py-2 hover:bg-neutral-100 rounded-lg text-neutral-600 hover:text-neutral-900">
                      Order History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-neutral-200" />
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
                className="hidden md:inline-block font-body text-xs font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5 transition-colors"
              >
                Sign in
              </Link>
            )}

            {/* SaaS Primary Action Button */}
            <Link
              to="/custom-lab"
              className="inline-flex items-center justify-center gap-1.5 bg-[#412f91] hover:bg-[#342575] text-white text-xs font-semibold px-3.5 sm:px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all active:scale-[0.98]"
            >
              <span className="hidden sm:inline whitespace-nowrap">Instant CAD Quote</span>
              <span className="sm:hidden whitespace-nowrap text-[11px]">Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mega Menu Dropdown Panel (Desktop) - 100% Solid Opaque White Background */}
        {activeMegaMenu && megaMenuData[activeMegaMenu as keyof typeof megaMenuData] && (
          <div className="hidden lg:block absolute top-full left-0 right-0 bg-white border-b border-neutral-200 shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-in fade-in slide-in-from-top-1 duration-200 z-50">
            <div className="max-w-7xl mx-auto px-8 py-7">
              <div className="grid grid-cols-12 gap-8 items-start">
                
                {/* Columns 1 & 2: Categorised Links with Icons */}
                <div className="col-span-8 grid grid-cols-2 gap-8">
                  {megaMenuData[activeMegaMenu as keyof typeof megaMenuData].columns.map((col, idx) => (
                    <div key={idx} className="space-y-3">
                      <h3 className="font-mono text-neutral-400 text-[11px] pb-1.5 border-b border-neutral-200 uppercase tracking-widest font-semibold">
                        {col.title}
                      </h3>
                      <ul className="space-y-1.5">
                        {col.links.map((link, lIdx) => {
                          const Icon = link.icon || Box;
                          return (
                            <li key={lIdx}>
                              <Link
                                to={link.href}
                                onClick={() => setActiveMegaMenu(null)}
                                className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-100/90 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-[#412f91]/10 border border-neutral-200 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                                  <Icon className="w-4 h-4 text-neutral-600 group-hover:text-[#412f91] transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-semibold text-neutral-900 group-hover:text-[#412f91] transition-colors flex items-center justify-between">
                                    <span>{link.name}</span>
                                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#412f91]" />
                                  </div>
                                  <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1 leading-normal">
                                    {link.desc}
                                  </p>
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Column 3: Featured Part Showcase Card */}
                <div className="col-span-4 pl-8 border-l border-neutral-200">
                  <div className="font-mono text-neutral-400 text-[11px] pb-1.5 border-b border-neutral-200 mb-3 uppercase tracking-widest font-semibold flex items-center justify-between">
                    <span>{megaMenuData[activeMegaMenu as keyof typeof megaMenuData].featured.badge}</span>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Industrial Grade</span>
                  </div>
                  <Link
                    to={megaMenuData[activeMegaMenu as keyof typeof megaMenuData].featured.href}
                    onClick={() => setActiveMegaMenu(null)}
                    className="block p-3.5 group hover:border-[#412f91]/40 transition-all rounded-xl bg-neutral-50 hover:bg-neutral-100/90 border border-neutral-200 shadow-xs"
                  >
                    <div className="aspect-[16/10] w-full rounded-lg bg-neutral-200 border border-neutral-200 mb-3 relative overflow-hidden">
                      <img 
                        src={megaMenuData[activeMegaMenu as keyof typeof megaMenuData].featured.image}
                        alt={megaMenuData[activeMegaMenu as keyof typeof megaMenuData].featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs font-mono text-[9px] font-bold text-neutral-900 uppercase tracking-wider shadow-xs">
                        {megaMenuData[activeMegaMenu as keyof typeof megaMenuData].featured.badge}
                      </div>
                    </div>
                    <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-[#412f91] transition-colors flex items-center justify-between">
                      <span>{megaMenuData[activeMegaMenu as keyof typeof megaMenuData].featured.title}</span>
                      <ArrowRight className="w-4 h-4 text-[#412f91] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="font-mono text-xs text-neutral-500 mt-1">
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
          <div className="lg:hidden bg-white border-t border-neutral-200 py-5 px-5 mt-2.5 max-h-[calc(100vh-70px)] overflow-y-auto shadow-2xl">
            
            {/* Mobile Jump Section Pills */}
            <div className="pb-4 mb-4 border-b border-neutral-200">
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-semibold">
                Page Navigation
              </span>
              <div className="grid grid-cols-2 gap-2">
                {HOME_SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                      isHomePage && activeSection === sec.id
                        ? 'bg-[#412f91] text-white font-semibold'
                        : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                    }`}
                  >
                    {sec.label}
                  </button>
                ))}
                <Link
                  to="/categories"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-left bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                >
                  Catalog &rarr;
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {Object.entries(megaMenuData).map(([key, item]) => {
                const isExpanded = mobileExpandedSection === key;
                return (
                  <div key={key} className="border-b border-neutral-100 pb-2">
                    <button
                      onClick={() => setMobileExpandedSection(isExpanded ? null : key)}
                      className="w-full py-2 flex items-center justify-between text-sm font-semibold text-neutral-900"
                    >
                      <span>{item.title}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#412f91]' : 'text-neutral-400'}`} />
                    </button>
                    {isExpanded && (
                      <div className="pl-3 py-2 space-y-2.5">
                        {item.columns.flatMap(c => c.links).map((link, idx) => (
                          <Link
                            key={idx}
                            to={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-xs text-neutral-600 hover:text-neutral-900 py-1"
                          >
                            <div className="font-semibold text-neutral-900">{link.name}</div>
                            <div className="text-[11px] text-neutral-500 line-clamp-1">{link.desc}</div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-3 flex flex-col gap-2.5">
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
                  >
                    Sign in / Register
                  </Link>
                )}
                <Link
                  to="/custom-lab"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-[#412f91] hover:bg-[#342575] text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm"
                >
                  <span>Instant CAD Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}