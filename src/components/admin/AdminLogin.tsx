'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertTriangle, 
  ArrowLeft,
  KeyRound,
  Terminal,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { authApi, getApiError } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Logo from '@/components/Logo';

interface AdminLoginProps {
  onSuccess?: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const { user, login } = useAuthStore();
  const [email, setEmail] = useState('saturn3d@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickFill = () => {
    setEmail('saturn3d@gmail.com');
    setPassword('Saturn3D@123');
    setErrorMessage('');
    toast.info('Loaded root administrative credentials');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both administrator email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.data.success && res.data.data) {
        const { user: loggedInUser, token } = res.data.data;

        // Strict Admin Gate check
        if (loggedInUser.role !== 'admin') {
          setErrorMessage('Access Denied: This account does not possess Administrator privileges. Only system administrators can access this terminal.');
          toast.error('Access Denied: Account lacks Administrator authorization');
          return;
        }

        login(loggedInUser, token);
        toast.success(`Welcome, Administrator ${loggedInUser.name || loggedInUser.email}!`);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setErrorMessage(res.data.error || 'Authentication rejected by security gateway');
      }
    } catch (err: any) {
      const errorMsg = getApiError(err);
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper pattern-blueprint flex flex-col justify-center items-center p-4 sm:p-6 font-mono relative selection:bg-saturn-orange selection:text-white">
      {/* Top Bar with Return Link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-ink bg-white border-2 border-ink px-3 py-1.5 shadow-brutal-sm hover:bg-lemon transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Storefront
        </Link>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 border-2 border-ink bg-lemon shadow-brutal-sm text-[10px] font-black uppercase text-ink">
          <div className="w-2 h-2 rounded-full bg-saturn-orange animate-pulse" />
          GATEWAY::LIVE
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white border-3 border-ink shadow-brutal-lg">
        {/* Terminal Header */}
        <div className="bg-ink text-paper p-4 border-b-3 border-ink flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 bg-red-500 border border-white/50" />
            <div className="w-3 h-3 bg-yellow-400 border border-white/50" />
            <div className="w-3 h-3 bg-green-500 border border-white/50" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-paper/80 uppercase ml-2 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-lemon" />
              ADMIN_TERMINAL_V2
            </span>
          </div>
          <span className="text-[9px] font-black uppercase bg-lemon text-ink px-1.5 py-0.5">
            PORT::3000
          </span>
        </div>

        {/* Brand Banner */}
        <div className="p-6 pb-2 text-center border-b-2 border-ink/10 bg-paper/30">
          <div className="inline-block mb-3">
            <Logo className="h-7 mx-auto" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-saturn-orange text-white border-2 border-ink shadow-brutal-sm mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-wider">Master Command Console</span>
          </div>
          <p className="text-[11px] font-bold text-ink/70 uppercase tracking-wide">
            Restricted System · Root Administrator Login
          </p>
        </div>

        {/* Body & Form */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Active Non-Admin User Alert */}
          {user && user.role !== 'admin' && (
            <div className="p-3 bg-lemon border-2 border-ink shadow-brutal-sm flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-saturn-orange flex-shrink-0 mt-0.5" />
              <div className="text-[11px] font-bold text-ink leading-tight">
                Currently signed in as customer <span className="font-black underline">{user.email}</span>. Master console requires Administrator authentication.
              </div>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 bg-red-100 border-2 border-red-600 text-red-900 shadow-brutal-sm flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs font-bold leading-tight">
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-saturn-orange" />
                  Admin Email
                </span>
                <span className="text-[9px] text-ink/50 uppercase font-bold">REQUIRED</span>
              </Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="saturn3d@gmail.com"
                className="h-11 font-mono font-bold border-2 border-ink shadow-brutal-sm bg-white focus-visible:ring-0 focus-visible:border-saturn-orange"
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-saturn-orange" />
                  Master Password
                </span>
                <span className="text-[9px] text-ink/50 uppercase font-bold">ENCRYPTED</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="h-11 pr-10 font-mono font-bold border-2 border-ink shadow-brutal-sm bg-white focus-visible:ring-0 focus-visible:border-saturn-orange"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/60 hover:text-ink transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Fill Button */}
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={handleQuickFill}
                className="inline-flex items-center gap-1 text-[10px] font-black text-saturn-orange hover:text-ink uppercase tracking-wide hover:underline cursor-pointer"
              >
                <Zap className="w-3 h-3 fill-saturn-orange" />
                Quick Fill Root Credentials
              </button>
              <span className="text-[9px] text-ink/50 uppercase">
                Saturn3D@123
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 bg-saturn-orange text-white hover:bg-orange-600 font-mono font-black uppercase tracking-wider border-3 border-ink shadow-brutal active:translate-x-1 active:translate-y-1 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  AUTHENTICATING ROOT...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 mr-2" />
                  AUTHENTICATE CONSOLE
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-4 bg-paper/60 border-t-2 border-ink/20 text-center font-mono text-[10px] text-ink/60 font-bold uppercase">
          Saturn 3D Precision Manufacturing Facility · Sys Node 01
        </div>
      </div>
    </div>
  );
}
