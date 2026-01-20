import RegisterForm from '@/components/forms/RegisterForm';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4E9CD] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-[#031926]">
              <UserPlus className="h-8 w-8 text-[#77ACA2]" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-[#031926]">Crear Cuenta</h1>
            <p className="text-[#468189]">Comienza tu viaje de aprendizaje hoy</p>
          </div>

          {/* Form */}
          <RegisterForm />
        </div>

        {/* Footer text */}
        <p className="mt-6 text-center text-sm text-[#468189]">
          Al registrarte, aceptas nuestros{' '}
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
