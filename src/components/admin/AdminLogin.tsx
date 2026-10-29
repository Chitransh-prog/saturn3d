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

      const user = res.data?.data?.user;
      const token = res.data?.data?.token;

      if (user && token) {
        if (user.role !== 'admin') {
          setErrorMessage('Access Denied: Account lacks Master Console administrative permissions.');
          toast.error('Insufficient privileges: Admin role required.');
          return;
        }

        login(user, token);
        toast.success(`Welcome back, ${user.name || 'Administrator'}!`);
        onSuccess?.();
      } else {
        setErrorMessage('Authentication rejected. Please verify your credentials.');
      }
    } catch (err) {
      const msg = getApiError(err);
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F6F8] flex flex-col items-center justify-center p-4 sm:p-6 relative select-none font-body">
      {/* Top Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 text-xs text-white/60">
        <Link
          href="/"
          className="btn-precision-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-white/80 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Store
        </Link>
        <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          GATEWAY::ONLINE
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md card-precision-dark overflow-hidden border-white/10 shadow-precision-xl">
        {/* Brand Banner */}
        <div className="p-6 text-center border-b border-white/10 bg-[#181C22]">
          <div className="inline-block mb-3">
            <Logo variant="white" className="h-7 mx-auto" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 text-[#FF5A1F] text-xs font-mono font-semibold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Master Console Authentication</span>
          </div>
          <p className="text-xs text-[#A3A9B3]">
            Restricted Operator Access &bull; Bhopal Additive Hub
          </p>
        </div>

        {/* Body & Form */}
        <div className="p-6 sm:p-8 space-y-5">
          {user && user.role !== 'admin' && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                Signed in as customer <span className="underline">{user.email}</span>. Master console requires administrator authentication.
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-[#A3A9B3] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  Administrator Email
                </span>
                <span className="text-[10px] text-white/40">REQUIRED</span>
              </Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="saturn3d@gmail.com"
                className="h-10 font-mono bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-[#FF5A1F]"
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-[#A3A9B3] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  Master Password
                </span>
                <span className="text-[10px] text-white/40">ENCRYPTED</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="h-10 pr-10 font-mono bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-[#FF5A1F]"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Fill Button */}
            <div className="pt-1 flex items-center justify-between font-mono text-xs">
              <button
                type="button"
                onClick={handleQuickFill}
                className="inline-flex items-center gap-1 text-[#FF5A1F] hover:underline cursor-pointer text-[11px]"
              >
                <Zap className="w-3 h-3" />
                Fill Root Credentials
              </button>
              <span className="text-[10px] text-white/40">
                Saturn3D@123
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-precision-primary w-full py-3 text-xs font-semibold flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating console...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate Console</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 bg-[#181C22] border-t border-white/10 text-center font-mono text-[10px] text-white/40">
          Saturn 3D Precision Manufacturing Facility &bull; Sys Node 01
        </div>
      </div>
    </div>
  );
}
