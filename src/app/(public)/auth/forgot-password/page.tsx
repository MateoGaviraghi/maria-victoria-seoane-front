'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    requestPasswordReset(data.email);
    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4E9CD] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 shadow-lg">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-green-100">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-[#031926]">Email Enviado</h1>
              <p className="mb-6 text-[#468189]">
                Te hemos enviado un email con las instrucciones para restablecer tu contraseña. Por
                favor, revisa tu bandeja de entrada.
              </p>
              <Button
                className="w-full bg-[#77ACA2] text-[#031926] hover:bg-[#468189] hover:text-[#F4E9CD]"
                asChild
              >
                <Link href="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Iniciar Sesión
                </Link>
              </Button>
            </div>
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
              <KeyRound className="h-8 w-8 text-[#77ACA2]" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-[#031926]">¿Olvidaste tu Contraseña?</h1>
            <p className="text-[#468189]">
              Ingresa tu email y te enviaremos instrucciones para restablecerla
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#031926]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="border-[#77ACA2]/30 focus:border-[#77ACA2]"
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#77ACA2] py-6 text-base font-semibold text-[#031926] hover:bg-[#468189] hover:text-[#F4E9CD]"
            >
              Enviar Instrucciones
            </Button>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-[#77ACA2] hover:underline"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Volver a Iniciar Sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
