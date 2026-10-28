import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, UserPlus, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { authApi, getApiError } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Logo from '@/components/Logo';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

const strengthRules = [
  { label: '6+ CHARS', test: (p: string) => p.length >= 6 },
  { label: 'NUMBER', test: (p: string) => /\d/.test(p) },
  { label: 'UPPERCASE', test: (p: string) => /[A-Z]/.test(p) },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await authApi.register({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      const { token, user } = res.data.data!;
      login(user, token);
      toast.success(`Welcome to Saturn 3D, ${user.name}!`);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const passedRules = strengthRules.filter((r) => r.test(password));
  const strength = passedRules.length;

  return (
    <div className="min-h-screen bg-paper pattern-blueprint flex items-center justify-center p-4 py-16 text-ink">
      <div className="w-full max-w-[480px] relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <Logo className="h-10 mx-auto" />
          </Link>
          <div className="inline-block px-3 py-1 bg-lemon border-2 border-ink shadow-brutal-sm font-mono text-[10px] font-black uppercase tracking-wider mb-2">
            // OPERATOR REGISTRATION
          </div>
          <h1 className="font-display text-4xl font-black text-ink uppercase tracking-tight mb-2">
            CREATE ACCOUNT
          </h1>
          <p className="font-mono text-xs font-bold text-ink/70">
            Already have an account?{' '}
            <Link to="/login" className="text-saturn-orange font-black hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Sign in
            </Link>
          </p>
        </div>

        <div className="card-slab bg-paper border-4 border-ink shadow-brutal-xl p-8 sm:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="font-mono text-xs font-black uppercase tracking-wider text-ink">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Chief Engineer"
                className="h-12 bg-white border-2 border-ink font-mono text-xs shadow-brutal-sm focus:bg-lemon focus:ring-0"
                {...register('name')}
              />
              {errors.name && <p className="font-mono text-xs text-red-500 font-bold">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
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
              {errors.email && <p className="font-mono text-xs text-red-500 font-bold">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-mono text-xs font-black uppercase tracking-wider text-ink">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className="h-12 bg-white border-2 border-ink font-mono text-xs shadow-brutal-sm focus:bg-lemon focus:ring-0 pr-12"
                  {...register('password', {
                    onChange: (e) => setPassword(e.target.value),
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ink/60 hover:text-ink cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength */}
              {password.length > 0 && (
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 border border-ink transition-all ${
                          i < strength
                            ? strength === 1 ? 'bg-red-400'
                            : strength === 2 ? 'bg-lemon'
                            : 'bg-mint'
                            : 'bg-paper'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {strengthRules.map((rule) => (
                      <span 
                        key={rule.label}
                        className={`font-mono text-[8px] font-black uppercase tracking-tight ${rule.test(password) ? 'text-saturn-orange' : 'text-ink/30'}`}
                      >
                        {rule.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {errors.password && <p className="font-mono text-xs text-red-500 font-bold">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="font-mono text-xs font-black uppercase tracking-wider text-ink">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="h-12 bg-white border-2 border-ink font-mono text-xs shadow-brutal-sm focus:bg-lemon focus:ring-0"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="font-mono text-xs text-red-500 font-bold">{errors.confirmPassword.message}</p>
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
                  <UserPlus className="w-4 h-4" />
                  <span>REGISTER TO SATURN 3D</span>
                </div>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] font-black text-ink/50 uppercase tracking-widest">
          © 2026 SATURN 3D • INDUSTRIAL ADDITIVE PROTOCOL
        </p>
      </div>
    </div>
  );
}
