import { useState } from 'react';
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
    const from = (location.state as { from?: string })?.from || consumeRedirectPath();
    return <Navigate to={from || '/'} replace />;
  }

  const from = (location.state as { from?: string })?.from || '/';

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
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animation-delay-2000 animate-pulse" />
      
      <div className="w-full max-w-[440px] relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-8">
            <Logo className="h-9 mx-auto" />
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">Welcome Back</h1>
          <p className="text-slate-500 font-medium">
            New to Saturn 3D?{' '}
            <Link to="/register" className="text-primary font-black hover:underline inline-flex items-center gap-1 group">
              Create an account <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-8 sm:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all font-medium px-5"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label htmlFor="password" className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Password
                </Label>
                <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-black transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all font-medium px-5 pr-14"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-black transition-colors rounded-xl"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-bold ml-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-15 bg-black hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-black/10 transition-all active:scale-[0.98] py-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In To Saturn 3D</span>
                </div>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          © 2026 SATURN 3D • ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
}
