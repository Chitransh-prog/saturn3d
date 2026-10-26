import React, { useState, useEffect } from 'react';
import { 
  X, ShoppingBag, ShieldCheck, User, LogOut, ChevronDown, 
  ArrowRight, ArrowUpRight, Factory, FileText, Cpu, Globe, Calendar 
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
import { categories } from '@/data/categories';
import { authApi } from '@/lib/api';
import BulkOrderForm from '@/sections/BulkOrderForm';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBulkFormOpen, setIsBulkFormOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageToggle = () => {
    const nextLang = language === 'EN' ? 'HI' : 'EN';
    setLanguage(nextLang);
    toast.success(`Language set to ${nextLang === 'EN' ? 'English' : 'Hindi (हिंदी)'}`);
  };

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

  return (
    <>
      <BulkOrderForm isOpen={isBulkFormOpen} onClose={() => setIsBulkFormOpen(false)} />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
          isScrolled
            ? 'bg-[#EAEAEA]/90 backdrop-blur-xl border-b border-black/5 py-3 px-4 sm:px-8 shadow-xs'
            : 'bg-transparent py-4 sm:py-6 px-4 sm:px-8 lg:px-12'
        }`}
      >
        <div className="flex items-center justify-between mx-auto max-w-[1400px]">
          
          {/* Logo on Left: ((•)) SATURN 3D */}
          <Link
            to="/"
            className="group inline-flex items-center transition-transform duration-200 active:scale-95"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Logo />
          </Link>

          {/* Center Navigation: LAB | SERVICES | TECH | INDUSTRIES | ABOUT */}
          <nav className="hidden lg:flex items-center gap-7 font-heading text-[11px] font-bold tracking-[0.2em] uppercase text-black/75">
            <Link
              to="/custom-lab"
              className={`hover:text-black transition-colors ${
                pathname === '/custom-lab' ? 'text-black underline underline-offset-8 decoration-2 decoration-[#F7931E]' : ''
              }`}
            >
              LAB
            </Link>

            <Link
              to="/categories"
              className={`hover:text-black transition-colors ${
                pathname.startsWith('/categories') ? 'text-black underline underline-offset-8 decoration-2 decoration-[#F7931E]' : ''
              }`}
            >
              SERVICES
            </Link>

            <Link
              to="/tech"
              className={`hover:text-black transition-colors ${
                pathname === '/tech' || pathname === '/about' ? 'text-black underline underline-offset-8 decoration-2 decoration-[#F7931E]' : ''
              }`}
            >
              TECH
            </Link>

            {/* Industries Dropdown */}
            {/* Industries Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 hover:text-black transition-colors uppercase cursor-pointer group">
                  <span>INDUSTRIES</span>
                  <ChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-80 rounded-2xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] p-2.5 mt-2 bg-[#08090B]/95 backdrop-blur-2xl text-white overflow-hidden relative"
              >
                {/* Subtle Ambient Saturn Orange Brand Glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#F7931E]/15 rounded-full blur-2xl pointer-events-none" />

                {/* Technical Header */}
                <div className="flex items-center justify-between px-3 pt-1.5 pb-2.5 border-b border-white/10 mb-1.5 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F7931E] shadow-[0_0_8px_#F7931E]" />
                    <span className="text-[10px] font-mono-tech uppercase tracking-[0.2em] font-bold text-slate-300">
                      Target Sectors
                    </span>
                  </div>
                  <span className="text-[9px] font-mono-tech text-slate-500 uppercase tracking-wider">
                    Saturn 3D
                  </span>
                </div>

                {/* Sector Items */}
                <div className="space-y-1 relative z-10">
                  {categories.slice(0, 6).map((cat) => (
                    <DropdownMenuItem
                      key={cat.slug}
                      onClick={() => navigate(`/category/${cat.slug}`)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer group hover:bg-white/[0.08] border border-transparent hover:border-white/10 transition-all outline-hidden text-slate-300 hover:text-white"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#F7931E] group-hover:bg-[#F7931E] group-hover:text-black group-hover:border-[#F7931E] transition-all duration-200 shrink-0 shadow-xs">
                          <cat.icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-heading font-semibold truncate group-hover:text-white transition-colors">
                          {cat.title}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#F7931E] group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100 shrink-0" />
                    </DropdownMenuItem>
                  ))}
                </div>

                {/* Footer Quick Action */}
                <div className="mt-2 pt-2 border-t border-white/10 px-1 relative z-10">
                  <button
                    onClick={() => navigate('/categories')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-[#F7931E]/15 border border-white/10 hover:border-[#F7931E]/40 text-[11px] font-heading font-bold text-slate-300 hover:text-[#F7931E] transition-all cursor-pointer group"
                  >
                    <span>All Manufacturing Sectors</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/about"
              className={`hover:text-black transition-colors ${
                pathname === '/about' ? 'text-black' : ''
              }`}
            >
              ABOUT
            </Link>
          </nav>

          {/* Right Action Buttons from Reference: REQUEST A DEMO (light grey pill) + BUILD WITH US (black pill) + Calendar + Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Pill 1: REQUEST A DEMO (Light Grey Pill) */}
            <button
              onClick={() => setIsBulkFormOpen(true)}
              className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#D8D8D8] hover:bg-[#CCCCCC] text-black text-[11px] font-heading font-black uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-2xs"
            >
              REQUEST A DEMO
            </button>

            {/* Pill 2: BUILD WITH US (Solid Black Pill) */}
            <button
              onClick={() => navigate('/custom-lab')}
              className="hidden sm:inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-black hover:bg-neutral-900 text-white text-[10px] sm:text-[11px] font-heading font-black uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-xs hover:shadow-md"
            >
              BUILD WITH US
            </button>

            {/* Calendar / Demo Consultation Button */}
            <button
              onClick={() => setIsBulkFormOpen(true)}
              aria-label="Schedule Consultation"
              title="Schedule Consultation / Demo"
              className="hidden sm:flex w-10 h-10 rounded-full bg-white hover:bg-slate-50 border border-black/10 items-center justify-center text-black transition-all active:scale-95 shadow-2xs"
            >
              <Calendar className="w-4 h-4 text-slate-700" />
            </button>

            {/* Cart / Bag Icon with Badge */}
            <button
              onClick={toggleCart}
              aria-label="Shopping bag"
              className="relative w-10 h-10 rounded-full bg-white hover:bg-slate-50 border border-black/10 flex items-center justify-center text-black transition-all active:scale-95 shadow-2xs"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#F7931E] text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            {isAuthenticated && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:flex items-center gap-2 h-10 px-3 bg-white hover:bg-slate-50 border border-black/10 text-black font-semibold text-xs rounded-full transition-all active:scale-95">
                    <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline max-w-[70px] truncate">{user?.name?.split(' ')[0]}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] p-2 mt-2 bg-[#08090B]/95 backdrop-blur-2xl text-white"
                >
                  <DropdownMenuLabel className="px-3 py-2.5">
                    <p className="font-bold text-xs text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono-tech truncate">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  {isAdmin && (
                    <DropdownMenuItem
                      onClick={() => navigate('/admin')}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-semibold text-[#F7931E] hover:bg-[#F7931E]/10 hover:text-[#F7931E] transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Language Toggle (EN/HI) */}
            <button
              onClick={handleLanguageToggle}
              title={`Switch language (Currently ${language})`}
              className="hidden md:flex px-2.5 py-1.5 rounded-full bg-white hover:bg-slate-50 text-black border border-black/10 text-[10px] font-mono-tech font-bold tracking-wider transition-colors active:scale-95"
            >
              <span>{language}</span>
            </button>

            {/* Circular Menu Button (=) - Mobile/Tablet only */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-all active:scale-95 shadow-xs"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <div className="flex flex-col gap-1 items-center justify-center">
                  <span className="w-4 h-[2px] bg-white rounded-full block" />
                  <span className="w-4 h-[2px] bg-white rounded-full block" />
                </div>
              )}
            </button>

          </div>

        </div>

        {/* Mobile Slide-Down Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 p-6 rounded-3xl bg-[#08090B]/95 text-white border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-200 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#F7931E]/15 rounded-full blur-2xl pointer-events-none" />
            <Link
              to="/custom-lab"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs font-mono-tech font-bold uppercase tracking-widest text-slate-200 hover:text-[#F7931E] py-2.5 border-b border-white/10 flex items-center justify-between transition-colors"
            >
              <span>01 / CAD LAB</span>
              <ArrowRight className="w-4 h-4 text-[#F7931E]" />
            </Link>
            <Link
              to="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs font-mono-tech font-bold uppercase tracking-widest text-slate-200 hover:text-[#F7931E] py-2.5 border-b border-white/10 flex items-center justify-between transition-colors"
            >
              <span>02 / SERVICES & PRODUCTS</span>
              <ArrowRight className="w-4 h-4 text-[#F7931E]" />
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs font-mono-tech font-bold uppercase tracking-widest text-slate-200 hover:text-[#F7931E] py-2.5 border-b border-white/10 flex items-center justify-between transition-colors"
            >
              <span>03 / TECH PROTOCOL</span>
              <ArrowRight className="w-4 h-4 text-[#F7931E]" />
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsBulkFormOpen(true);
              }}
              className="text-xs font-mono-tech font-bold uppercase tracking-widest text-slate-200 hover:text-[#F7931E] py-2.5 border-b border-white/10 flex items-center justify-between text-left transition-colors"
            >
              <span>04 / SCHEDULE CONSULTATION</span>
              <Calendar className="w-4 h-4 text-[#F7931E]" />
            </button>
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsBulkFormOpen(true);
                }}
                className="w-full py-3 bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-mono-tech font-bold uppercase tracking-widest rounded-full transition-colors"
              >
                REQUEST A DEMO
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/custom-lab');
                }}
                className="w-full py-3 bg-[#F7931E] hover:bg-[#e07f12] text-white text-xs font-mono-tech font-bold uppercase tracking-widest rounded-full transition-all shadow-lg shadow-orange-500/20"
              >
                BUILD WITH US
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
