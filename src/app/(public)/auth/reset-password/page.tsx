'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Link from 'next/link';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Token de restablecimiento inválido');
      return;
    }

    resetPassword({
      token,
      newPassword: data.password,
    });
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4E9CD] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 text-center shadow-lg">
            <h1 className="mb-4 text-2xl font-bold text-[#031926]">Token Inválido</h1>
            <p className="mb-6 text-[#468189]">
              El enlace de restablecimiento es inválido o ha expirado.
            </p>
            <Button
              className="w-full bg-[#77ACA2] text-[#031926] hover:bg-[#468189] hover:text-[#F4E9CD]"
              asChild
            >
              <Link href="/auth/forgot-password">Solicitar Nuevo Enlace</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4E9CD] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-[#031926]">
              <Lock className="h-8 w-8 text-[#77ACA2]" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-[#031926]">Nueva Contraseña</h1>
            <p className="text-[#468189]">Ingresa tu nueva contraseña</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#031926]">
                Nueva Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="border-[#77ACA2]/30 pr-10 focus:border-[#77ACA2]"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#468189] hover:text-[#77ACA2]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#031926]">
                Confirmar Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="border-[#77ACA2]/30 pr-10 focus:border-[#77ACA2]"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#468189] hover:text-[#77ACA2]"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#77ACA2] py-6 text-base font-semibold text-[#031926] hover:bg-[#468189] hover:text-[#F4E9CD]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Restableciendo...
                </>
              ) : (
                'Restablecer Contraseña'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F4E9CD]">
          <Loader2 className="h-8 w-8 animate-spin text-[#031926]" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
