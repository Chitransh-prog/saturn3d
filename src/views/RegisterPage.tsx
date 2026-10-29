import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, UserPlus, Loader2, ArrowLeft, Check, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { authApi, getApiError } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Logo from '@/components/Logo';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      const { token, user } = res.data.data!;
      login(user, token);
      toast.success(`Account created! Welcome, ${user.name}`);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F6F8] flex items-center justify-center p-4 py-20 font-body select-none">
      <div className="w-full max-w-[440px] relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <Logo variant="white" className="h-8 mx-auto" />
          </Link>
          <div className="precision-badge text-[11px] mb-3">
            Operator Registration
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">
            Create an Operator Account
          </h1>
          <p className="text-xs text-[#A3A9B3]">
            Already registered?{' '}
            <Link to="/login" className="text-[#FF5A1F] hover:underline inline-flex items-center gap-1 font-medium">
              Sign in <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="card-precision-dark p-8 sm:p-9 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="font-mono text-xs text-[#A3A9B3] uppercase">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Chief Engineer"
                className="h-10 bg-white/5 border-white/10 text-white rounded-xl text-xs font-mono focus-visible:ring-1 focus-visible:ring-[#FF5A1F]"
                {...register('name')}
              />
              {errors.name && <p className="font-mono text-[11px] text-red-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-mono text-xs text-[#A3A9B3] uppercase">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="engineer@company.com"
                className="h-10 bg-white/5 border-white/10 text-white rounded-xl text-xs font-mono focus-visible:ring-1 focus-visible:ring-[#FF5A1F]"
                {...register('email')}
              />
              {errors.email && <p className="font-mono text-[11px] text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-mono text-xs text-[#A3A9B3] uppercase">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className="h-10 bg-white/5 border-white/10 text-white rounded-xl text-xs font-mono pr-10 focus-visible:ring-1 focus-visible:ring-[#FF5A1F]"
                  {...register('password', {
                    onChange: (e) => setPassword(e.target.value),
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="font-mono text-[11px] text-red-400">{errors.password.message}</p>}
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
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-[11px] text-white/40">
          &copy; {new Date().getFullYear()} Saturn 3D &bull; Govindpura Hub, Bhopal
        </p>
      </div>
    </div>
  );
}
