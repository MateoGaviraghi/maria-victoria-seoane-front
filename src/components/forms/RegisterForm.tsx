'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* First Name */}
      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-[#031926]">
          Nombre
        </Label>
        <Input
          id="firstName"
          type="text"
          placeholder="Juan"
          className="border-[#77ACA2]/30 focus:border-[#77ACA2]"
          {...register('firstName')}
        />
        {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
      </div>

      {/* Last Name */}
      <div className="space-y-2">
        <Label htmlFor="lastName" className="text-[#031926]">
          Apellido
        </Label>
        <Input
          id="lastName"
          type="text"
          placeholder="Pérez"
          className="border-[#77ACA2]/30 focus:border-[#77ACA2]"
          {...register('lastName')}
        />
        {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
      </div>

      {/* Email */}
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

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#031926]">
          Contraseña
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
          Confirmar contraseña
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
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
            Registrando...
          </>
        ) : (
          'Crear Cuenta'
        )}
      </Button>

      {/* Login Link */}
      <p className="text-center text-sm text-[#468189]">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/auth/login" className="font-semibold text-[#77ACA2] hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
