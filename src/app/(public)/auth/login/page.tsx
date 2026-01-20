import LoginForm from '@/components/forms/LoginForm';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4E9CD] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-[#031926]">
              <LogIn className="h-8 w-8 text-[#77ACA2]" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-[#031926]">Iniciar Sesión</h1>
            <p className="text-[#468189]">Accede a tus cursos y continúa aprendiendo</p>
          </div>

          {/* Form */}
          <LoginForm />
        </div>

        {/* Footer text */}
        <p className="mt-6 text-center text-sm text-[#468189]">
          Al iniciar sesión, aceptas nuestros{' '}
          <a href="#" className="text-[#77ACA2] hover:underline">
            Términos y Condiciones
          </a>{' '}
          y{' '}
          <a href="#" className="text-[#77ACA2] hover:underline">
            Política de Privacidad
          </a>
        </p>
      </div>
    </div>
  );
}
