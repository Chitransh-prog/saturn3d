import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ShoppingBag, User, LogOut, Menu, ArrowRight
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();

  // Scroll listener: hide on scroll down, reveal on scroll up, hairline when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) return;
      const currentScrollY = window.scrollY;
      
      // Determine if past top threshold
      if (currentScrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Hide on scroll down, reveal on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        setIsVisible(false); // scrolling down
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true); // scrolling up
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

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

  const navLinks = [
    { name: 'THE LAB', path: '/#the-lab' },
    { name: 'MATERIALS', path: '/#materials' },
    { name: 'CATALOG', path: '/categories' },
    { name: 'ABOUT', path: '/about' },
  ];

  const isSolidHeader = isScrolled || isMobileMenuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-transform duration-300 ease-out ${
        isVisible || isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
      } ${
        isSolidHeader
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md hairline-b py-3 px-6 sm:px-10 shadow-brutal-sm'
          : 'bg-transparent py-5 px-6 sm:px-10'
      }`}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <Link
          to="/"
          className="flex items-center group transition-transform active:scale-95"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Logo className="h-7 sm:h-9" />
        </Link>

        {/* Center: 4 Clean Text Links (Underline on hover, no chip boxes) */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs font-bold uppercase tracking-wider text-[#0B0B0B]">
          {navLinks.map((link) => {
            const isHash = link.path.startsWith('/#');
            if (isHash) {
              return (
                <a
                  key={link.name}
                  href={link.path.replace('/', '')}
                  className="relative py-1 hover:text-[#FF5A1F] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#FF5A1F] hover:after:w-full after:transition-all"
                >
                  {link.name}
                </a>
              );
            }
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative py-1 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#FF5A1F] after:transition-all ${
                  pathname === link.path
                    ? 'text-[#FF5A1F] after:w-full'
                    : 'text-[#0B0B0B] hover:text-[#FF5A1F] after:w-0 hover:after:w-full'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Cluster: Cart + Auth + Primary Brutalist CTA */}
        <div className="flex items-center gap-4">
          
          {/* Cart Trigger */}
          <button
            onClick={toggleCart}
            className="relative p-2 text-[#0B0B0B] hover:text-[#FF5A1F] transition-colors cursor-pointer"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#FF5A1F] text-black font-mono text-[10px] font-black flex items-center justify-center rounded-xs">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Account / Auth Dropdown */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1.5 text-[#0B0B0B] hover:text-[#FF5A1F] transition-colors cursor-pointer"
                  aria-label="User Account"
                >
                  <User className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-[#FAF7F2] border border-ink p-1 font-mono text-xs shadow-md rounded-xs"
              >
                <DropdownMenuLabel className="font-bold text-[11px] truncate px-2 py-1">
                  {user?.name || user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-ink/10" />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer font-bold px-2 py-1.5 hover:bg-[#FFE14D]">
                      ADMIN PANEL
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="cursor-pointer px-2 py-1.5 hover:bg-[#FFE14D]">
                    MY ORDERS
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-ink/10" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 px-2 py-1.5 flex items-center gap-2 hover:bg-red-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>LOGOUT</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-block font-mono text-xs font-bold text-[#0B0B0B] hover:text-[#FF5A1F] transition-colors"
            >
              LOGIN
            </Link>
          )}

          {/* Single Primary Brutalist CTA (Right - visible on md+) */}
          <Link
            to="/custom-lab"
            className="!hidden md:!inline-flex btn-brutal btn-brutal-orange text-xs py-2 px-4 shadow-[3px_3px_0px_#0B0B0B]"
          >
            <span>GET A QUOTE</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#0B0B0B] hover:text-[#FF5A1F]"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] hairline-t hairline-b py-6 px-6 mt-3 flex flex-col gap-4 font-mono text-sm font-bold uppercase max-h-[calc(100vh-80px)] overflow-y-auto">
          {navLinks.map((link) => {
            const isHash = link.path.startsWith('/#');
            if (isHash) {
              return (
                <a
                  key={link.name}
                  href={link.path.replace('/', '')}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 hairline-b text-[#0B0B0B] hover:text-[#FF5A1F]"
                >
                  {link.name}
                </a>
              );
            }
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 hairline-b text-[#0B0B0B] hover:text-[#FF5A1F]"
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 flex flex-col gap-3">
            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs text-[#0B0B0B] py-1"
              >
                LOGIN / REGISTER
              </Link>
            )}
            <Link
              to="/custom-lab"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-brutal btn-brutal-orange text-xs py-3 text-center justify-center"
            >
              <span>GET A QUOTE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
