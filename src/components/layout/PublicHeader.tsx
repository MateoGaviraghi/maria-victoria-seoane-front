'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#031926] text-[#F4E9CD]">
      {/* Desktop layout */}
      <div className="container hidden items-center justify-between gap-8 py-3 md:flex">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 transition-transform duration-300 hover:scale-110"
        >
          <Image
            src="/diseño-web/logo-web-Photoroom.png"
            alt="María Victoria Seoane"
            width={160}
            height={48}
            style={{ height: 'auto' }}
          />
        </Link>

        {/* Botón Cursos (centro) */}
        <nav className="absolute left-1/2 -translate-x-1/2">
          <Link
            href="/cursos"
            className="relative inline-block py-2 text-base text-[#F4E9CD] after:absolute after:bottom-1 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-[#F4E9CD] after:transition-all after:duration-300 hover:after:w-[calc(100%-1rem)]"
          >
            Cursos
          </Link>
        </nav>

        {/* Botones de autenticación o usuario autenticado (derecha) */}
        <div className="ml-auto flex shrink-0 items-center gap-3 pl-6">
          {user ? (
            <>
              {/* Carrito */}
              <Link
                href="/carrito"
                className="relative p-2 text-[#F4E9CD] transition-colors hover:text-[#77ACA2]"
              >
                <ShoppingCart className="h-5 w-5" />
              </Link>

              {/* Dropdown del usuario */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium text-[#F4E9CD] transition-colors hover:bg-[#F4E9CD]/10">
                    <User className="h-4 w-4" />
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white">
                  <DropdownMenuItem asChild>
                    <Link href="/carrito" className="flex cursor-pointer items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Carrito</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/cursos" className="flex cursor-pointer items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Cursos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex cursor-pointer items-center gap-2 text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-sm text-[#F4E9CD] hover:bg-[#F4E9CD]/10 hover:text-[#77ACA2]"
                asChild
              >
                <Link href="/auth/login">Iniciar sesión</Link>
              </Button>
              <Button className="bg-[#77ACA2] text-sm text-[#031926] hover:bg-[#9DBEBB]" asChild>
                <Link href="/auth/register">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="container flex items-center justify-center py-3 md:hidden">
        {/* Logo centrado */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 transition-transform duration-300 hover:scale-110"
        >
          <Image
            src="/diseño-web/logo-web-Photoroom.png"
            alt="María Victoria Seoane"
            width={160}
            height={48}
            style={{ height: 'auto' }}
          />
        </Link>

        {/* Botón menú hamburguesa */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="absolute right-4 p-2 text-[#F4E9CD]"
          aria-label="Menú"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="border-t border-[#468189]/40 bg-[#031926] md:hidden">
          <nav className="container flex flex-col gap-4 py-6">
            <Link
              href="/cursos"
              className="text-center text-base text-[#F4E9CD] transition-colors hover:text-[#77ACA2]"
              onClick={() => setIsMenuOpen(false)}
            >
              Cursos
            </Link>
            {user ? (
              <>
                <Link
                  href="/carrito"
                  className="text-center text-base text-[#F4E9CD] transition-colors hover:text-[#77ACA2]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Carrito
                </Link>
                <Link
                  href="/cursos"
                  className="text-center text-base text-[#F4E9CD] transition-colors hover:text-[#77ACA2]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cursos
                </Link>
                <div className="text-center text-sm text-[#9DBEBB]">
                  {user.firstName} {user.lastName}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="mx-auto w-full max-w-xs rounded bg-red-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-center text-base text-[#F4E9CD] transition-colors hover:text-[#77ACA2]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="mx-auto w-full max-w-xs rounded bg-[#77ACA2] px-4 py-2 text-center text-sm font-medium text-[#031926] transition-colors hover:bg-[#9DBEBB]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
