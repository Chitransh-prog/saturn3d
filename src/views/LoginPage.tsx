import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { authApi, getApiError, consumeRedirectPath } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Logo from '@/components/Logo';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (isAuthenticated) {
    if (isAdmin) return <Navigate to="/admin" replace />;
    const from = (location.state as any)?.from || consumeRedirectPath();
    return <Navigate to={from || '/'} replace />;
  }

  const from = (location.state as any)?.from || '/';

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      const { token, user } = res.data.data!;
      login(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        const savedRedirect = consumeRedirectPath();
        navigate(savedRedirect !== '/' ? savedRedirect : from, { replace: true });
      }
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#111215] flex items-center justify-center p-4 py-20 font-body select-none">
      <div className="w-full max-w-[420px] relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <Logo variant="dark" className="h-8 mx-auto" />
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-black/10 rounded-full font-mono text-[11px] font-medium text-[#5E6573] shadow-sm mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
            <span>Operator Account Access</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#111215] tracking-tight mb-2">
            Sign in to Saturn 3D
          </h1>
          <p className="text-xs text-[#5E6573]">
            New to the fabrication lab?{' '}
            <Link to="/register" className="text-[#FF5A1F] hover:underline inline-flex items-center gap-1 font-medium">
              Create an account <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-black/10 shadow-lg rounded-2xl p-8 sm:p-9 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-mono text-xs text-[#5E6573] uppercase">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="engineer@company.com"
                className="h-10 bg-[#F8F9FB] border-black/10 text-[#111215] placeholder:text-black/30 rounded-xl text-xs font-mono focus-visible:ring-1 focus-visible:ring-[#FF5A1F]"
                {...register('email')}
              />
              {errors.email && (
                <p className="font-mono text-[11px] text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-mono text-xs text-[#5E6573] uppercase">
                  Password
                </Label>
                <a href="#" className="font-mono text-[11px] text-[#FF5A1F] hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-10 bg-[#F8F9FB] border-black/10 text-[#111215] placeholder:text-black/30 rounded-xl text-xs font-mono pr-10 focus-visible:ring-1 focus-visible:ring-[#FF5A1F]"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="font-mono text-[11px] text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-precision-primary py-3 text-xs font-semibold flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-5 text-center">
          <Link
            to="/admin"
            className="font-mono text-[11px] text-[#5E6573] hover:text-[#111215] transition-colors"
          >
            System Administrator? Master Console &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
