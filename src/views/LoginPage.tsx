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
  email: z.string().email('Enter a valid email'),
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

  // Already logged in — redirect away
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
    <div className="min-h-screen bg-paper pattern-blueprint flex items-center justify-center p-4 py-16 text-ink">
      <div className="w-full max-w-[440px] relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <Logo className="h-10 mx-auto" />
          </Link>
          <div className="inline-block px-3 py-1 bg-lemon border-2 border-ink shadow-brutal-sm font-mono text-[10px] font-black uppercase tracking-wider mb-2">
            // OPERATOR PORTAL ACCESS
          </div>
          <h1 className="font-display text-4xl font-black text-ink uppercase tracking-tight mb-2">
            WELCOME BACK
          </h1>
          <p className="font-mono text-xs font-bold text-ink/70">
            New to Saturn 3D?{' '}
            <Link to="/register" className="text-saturn-orange font-black hover:underline inline-flex items-center gap-1">
              Create an account <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>

        <div className="card-slab bg-paper border-4 border-ink shadow-brutal-xl p-8 sm:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-mono text-xs font-black uppercase tracking-wider text-ink">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="engineer@company.com"
                className="h-12 bg-white border-2 border-ink font-mono text-xs shadow-brutal-sm focus:bg-lemon focus:ring-0"
                {...register('email')}
              />
              {errors.email && (
                <p className="font-mono text-xs text-red-500 font-bold">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-mono text-xs font-black uppercase tracking-wider text-ink">
                  Password
                </Label>
                <a href="#" className="font-mono text-[10px] font-black text-saturn-orange uppercase hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-12 bg-white border-2 border-ink font-mono text-xs shadow-brutal-sm focus:bg-lemon focus:ring-0 pr-12"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ink/60 hover:text-ink cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="font-mono text-xs text-red-500 font-bold">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 btn-brutal bg-saturn-orange text-white hover:bg-lemon hover:text-ink font-mono font-black uppercase tracking-wider text-xs border-3 border-ink shadow-brutal cursor-pointer disabled:opacity-40"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>SIGN IN TO SATURN 3D</span>
                </div>
              )}
            </Button>
          </form>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/admin"
            className="font-mono text-[10px] font-bold text-ink/60 hover:text-saturn-orange uppercase tracking-wider underline"
          >
            System Administrator? Access Master Console →
          </Link>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] font-black text-ink/50 uppercase tracking-widest">
          © 2026 SATURN 3D • BHOPAL MANUFACTURING HUB
        </p>
      </div>
    </div>
  );
}
