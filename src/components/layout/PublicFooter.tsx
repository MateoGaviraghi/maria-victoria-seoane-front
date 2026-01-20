import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const PublicFooter = () => {
  return (
    <footer className="mt-auto bg-[#031926] text-[#F4E9CD]">
      <div className="container mx-auto grid max-w-6xl gap-12 py-12 md:grid-cols-3">
        <div className="flex justify-center md:justify-center">
          <Image
            src="/diseño-web/logo-web-Photoroom.png"
            alt="María Victoria Seoane"
            width={240}
            height={72}
          />
        </div>
        <div className="text-center">
          <h3 className="mb-4 font-sans text-base font-semibold">Navegacion</h3>
          <ul className="space-y-3 text-base text-[#9DBEBB]">
            <li>
              <Link href="/cursos" className="transition-colors hover:text-[#F4E9CD]">
                Cursos
              </Link>
            </li>
            <li>
              <Link href="/auth/login" className="transition-colors hover:text-[#F4E9CD]">
                Iniciar sesion
              </Link>
            </li>
            <li>
              <Link href="/auth/register" className="transition-colors hover:text-[#F4E9CD]">
                Registrarse
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-center md:pr-8 md:text-right">
          <h3 className="mb-4 font-sans text-base font-semibold">Seguime</h3>
          <div className="flex items-center justify-center gap-5 text-[#F4E9CD] md:justify-end">
            <Link
              href="#"
              aria-label="Instagram"
              className="transition-colors hover:text-[#77ACA2]"
            >
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Facebook" className="transition-colors hover:text-[#77ACA2]">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Twitter" className="transition-colors hover:text-[#77ACA2]">
              <Twitter className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="YouTube" className="transition-colors hover:text-[#77ACA2]">
              <Youtube className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[#468189]/40 py-5 text-center text-sm text-[#9DBEBB]">
        © {new Date().getFullYear()} Maria Victoria Seoane. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default PublicFooter;
