'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail, resendVerification, isResendingVerification } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<
    'loading' | 'success' | 'error' | 'pending'
  >(token ? 'loading' : 'pending');
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    if (token && !hasVerifiedRef.current) {
      hasVerifiedRef.current = true;
      verifyEmail(token);
      // Esperamos que el onSuccess del hook maneje el éxito
      const timer = setTimeout(() => setVerificationStatus('success'), 1000);
      return () => clearTimeout(timer);
    }
  }, [token, verifyEmail]);

  const handleResend = () => {
    resendVerification();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4E9CD] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 shadow-lg">
          {/* Loading State */}
          {verificationStatus === 'loading' && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-[#031926]">
                <Loader2 className="h-8 w-8 animate-spin text-[#77ACA2]" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-[#031926]">Verificando...</h1>
              <p className="text-[#468189]">Por favor espera mientras verificamos tu email</p>
            </div>
          )}

          {/* Success State */}
          {verificationStatus === 'success' && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-[#031926]">¡Email Verificado!</h1>
              <p className="mb-6 text-[#468189]">
                Tu cuenta ha sido verificada exitosamente. Ya puedes iniciar sesión.
              </p>
              <Button
                className="w-full bg-[#77ACA2] text-[#031926] hover:bg-[#468189] hover:text-[#F4E9CD]"
                asChild
              >
                <Link href="/auth/login">Ir a Iniciar Sesión</Link>
              </Button>
            </div>
          )}

          {/* Error State */}
          {verificationStatus === 'error' && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-red-100">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-[#031926]">Error en la Verificación</h1>
              <p className="mb-6 text-[#468189]">
                El enlace de verificación es inválido o ha expirado.
              </p>
              <Button
                onClick={handleResend}
                disabled={isResendingVerification}
                className="w-full bg-[#77ACA2] text-[#031926] hover:bg-[#468189] hover:text-[#F4E9CD]"
              >
                {isResendingVerification ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Reenviar Email de Verificación'
                )}
              </Button>
            </div>
          )}

          {/* Pending State (no token in URL) */}
          {verificationStatus === 'pending' && !token && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-[#031926]">
                <Mail className="h-8 w-8 text-[#77ACA2]" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-[#031926]">Verifica tu Email</h1>
              <p className="mb-6 text-[#468189]">
                Te hemos enviado un email con un enlace de verificación. Por favor, revisa tu
                bandeja de entrada.
              </p>
              <Button
                onClick={handleResend}
                disabled={isResendingVerification}
                variant="outline"
                className="w-full border-[#77ACA2] text-[#031926] hover:bg-[#77ACA2]/10"
              >
                {isResendingVerification ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Reenviar Email'
                )}
              </Button>
              <div className="mt-4">
                <Link href="/auth/login" className="text-sm text-[#77ACA2] hover:underline">
                  Volver a Iniciar Sesión
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F4E9CD]">
          <Loader2 className="h-8 w-8 animate-spin text-[#031926]" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
