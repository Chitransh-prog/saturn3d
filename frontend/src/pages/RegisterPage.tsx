import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, UserPlus, Loader2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
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
  { label: '6+ characters', test: (p: string) => p.length >= 6 },
  { label: 'Number', test: (p: string) => /\d/.test(p) },
  { label: 'Uppercase', test: (p: string) => /[A-Z]/.test(p) },
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
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden flex items-center justify-center p-4 py-16">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animation-delay-2000 animate-pulse" />
      
      <div className="w-full max-w-[480px] relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-8">
            <Logo className="h-9 mx-auto" />
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">Create Account</h1>
          <p className="text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-black hover:underline inline-flex items-center gap-1 group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Sign in
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-8 sm:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all font-medium px-5"
                {...register('name')}
              />
              {errors.name && <p className="text-xs text-red-500 font-bold ml-1">{errors.name.message}</p>}
            </div>

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
              {errors.email && <p className="text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all font-medium px-5 pr-14"
                  {...register('password', {
                    onChange: (e) => setPassword(e.target.value),
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-black transition-colors rounded-xl"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength */}
              {password.length > 0 && (
                <div className="flex items-center gap-3 px-1">
                  <div className="flex-1 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i < strength
                            ? strength === 1 ? 'bg-red-400'
                            : strength === 2 ? 'bg-amber-400'
                            : 'bg-emerald-400'
                            : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {strengthRules.map((rule) => (
                      <span 
                        key={rule.label}
                        className={`text-[8px] font-black uppercase tracking-tight ${rule.test(password) ? 'text-emerald-500' : 'text-slate-300'}`}
                      >
                        {rule.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-500 font-bold ml-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all font-medium px-5"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 font-bold ml-1">{errors.confirmPassword.message}</p>
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
                  <UserPlus className="w-4 h-4" />
                  <span>Join Saturn 3D</span>
                </div>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed px-10">
          By joining you agree to our <a href="#" className="text-slate-900 underline underline-offset-2">Terms of Use</a> and <a href="#" className="text-slate-900 underline underline-offset-2">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
