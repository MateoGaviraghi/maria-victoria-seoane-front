# 🎨 FASE 04 - Componentes de Layout

## 📋 Objetivos de esta Fase

En esta fase vamos a:

1. ✅ Crear el layout principal (Root Layout)
2. ✅ Crear componentes de navegación (Header, Footer, Navbar)
3. ✅ Crear layouts específicos (Public, Dashboard, Student)
4. ✅ Implementar Sidebar para el panel de administración
5. ✅ Crear componentes comunes reutilizables

---

## 1️⃣ Root Layout Principal

Ya existe en `src/app/layout.tsx` pero lo vamos a mejorar:

### `src/app/layout.tsx` - Actualizado

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/react-query';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'María Victoria Seoane - Plataforma de Cursos',
    template: '%s | María Victoria Seoane',
  },
  description: 'Aprende con los mejores cursos online de desarrollo profesional',
  keywords: ['cursos online', 'educación', 'aprendizaje', 'desarrollo profesional'],
  authors: [{ name: 'María Victoria Seoane' }],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://mariavictoriaseoane.com',
    title: 'María Victoria Seoane - Plataforma de Cursos',
    description: 'Aprende con los mejores cursos online',
    siteName: 'María Victoria Seoane',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-right" richColors closeButton />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

---

## 2️⃣ Layout Público

### `src/app/(public)/layout.tsx`

```typescript
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

---

## 3️⃣ Componente Header

### `src/components/layout/Header.tsx`

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/cursos', label: 'Cursos' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">María Victoria Seoane</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link href="/carrito" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/mi-cuenta">Mi Cuenta</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mis-cursos">Mis Cursos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mis-ordenes">Mis Órdenes</Link>
                </DropdownMenuItem>
                {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Panel de Admin</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex md:gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Registrarse</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="container flex flex-col space-y-3 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
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

export default Header;
```

---

## 4️⃣ Componente Footer

### `src/components/layout/Footer.tsx`

```typescript
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">María Victoria Seoane</h3>
            <p className="text-sm text-muted-foreground">
              Plataforma de cursos online para tu desarrollo profesional.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Plataforma</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/cursos"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cursos
                </Link>
              </li>
              <li>
                <Link
                  href="/mis-cursos"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Mis Cursos
                </Link>
              </li>
              <li>
                <Link
                  href="/mi-cuenta"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Mi Cuenta
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Empresa</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} María Victoria Seoane. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

---

## 5️⃣ Layout del Dashboard (Admin)

### `src/app/(dashboard)/layout.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();
  const { isSidebarOpen } = useUIStore();

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/auth/login');
    }

    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      redirect('/');
    }
  }, [isAuthenticated, user]);

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar />
        <main
          className={`flex-1 overflow-y-auto bg-muted/20 p-6 transition-all ${
            isSidebarOpen ? 'md:ml-64' : 'md:ml-16'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## 6️⃣ Componente Sidebar (Dashboard)

### `src/components/layout/Sidebar.tsx`

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ShoppingBag,
  Tag,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const Sidebar = () => {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuth();

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/cursos-admin',
      label: 'Cursos',
      icon: BookOpen,
    },
    {
      href: '/usuarios',
      label: 'Usuarios',
      icon: Users,
    },
    {
      href: '/ordenes',
      label: 'Órdenes',
      icon: ShoppingBag,
    },
    {
      href: '/cupones',
      label: 'Cupones',
      icon: Tag,
    },
    {
      href: '/emails',
      label: 'Emails',
      icon: Mail,
    },
  ];

  // Solo SUPER_ADMIN puede ver configuración
  if (user?.role === 'SUPER_ADMIN') {
    menuItems.push({
      href: '/configuracion',
      label: 'Configuración',
      icon: Settings,
    });
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300',
        isSidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {isSidebarOpen && (
            <span className="text-lg font-semibold">Admin Panel</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(!isSidebarOpen && 'mx-auto')}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    !isSidebarOpen && 'justify-center'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {isSidebarOpen && <span>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
```

---

## 7️⃣ Componente DashboardNavbar

### `src/components/layout/DashboardNavbar.tsx`

```typescript
'use client';

import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  const { isSidebarOpen } = useUIStore();

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : 'U';

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 transition-all',
        isSidebarOpen ? 'md:ml-64' : 'md:ml-16'
      )}
    >
      {/* Search Bar */}
      <div className="flex flex-1 items-center gap-4">
        <form className="flex-1 md:max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="w-full bg-muted/50 pl-8"
            />
          </div>
        </form>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">Ver Sitio</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/mi-cuenta">Mi Cuenta</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Cerrar Sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardNavbar;
```

---

## 8️⃣ Layout de Estudiante

### `src/app/(student)/layout.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/auth/login');
    }
  }, [isAuthenticated]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/20">{children}</main>
      <Footer />
    </div>
  );
}
```

---

## 9️⃣ Componentes Comunes - LoadingSpinner

### `src/components/common/LoadingSpinner.tsx`

```typescript
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
    </div>
  );
};

export default LoadingSpinner;
```

---

## 🔟 Componentes Comunes - ErrorMessage

### `src/components/common/ErrorMessage.tsx`

```typescript
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorMessageProps {
  title?: string;
  message: string;
}

const ErrorMessage = ({
  title = 'Error',
  message,
}: ErrorMessageProps) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default ErrorMessage;
```

---

## 1️⃣1️⃣ Componentes Comunes - Pagination

### `src/components/common/Pagination.tsx`

```typescript
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          size="icon"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
```

---

## 1️⃣2️⃣ Componentes Comunes - SearchBar

### `src/components/common/SearchBar.tsx`

```typescript
'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect, useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  delay?: number;
}

const SearchBar = ({
  placeholder = 'Buscar...',
  onSearch,
  delay = 500,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default SearchBar;
```

---

## 1️⃣3️⃣ Componentes Comunes - EmptyState

### `src/components/common/EmptyState.tsx`

```typescript
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-4 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
};

export default EmptyState;
```

---

## 🎯 Checklist de Verificación - Fase 4

Verificar que todos los archivos estén creados:

### Layouts

- [ ] `src/app/layout.tsx` (actualizado)
- [ ] `src/app/(public)/layout.tsx`
- [ ] `src/app/(dashboard)/layout.tsx`
- [ ] `src/app/(student)/layout.tsx`

### Componentes de Layout

- [ ] `src/components/layout/Header.tsx`
- [ ] `src/components/layout/Footer.tsx`
- [ ] `src/components/layout/Sidebar.tsx`
- [ ] `src/components/layout/DashboardNavbar.tsx`

### Componentes Comunes

- [ ] `src/components/common/LoadingSpinner.tsx`
- [ ] `src/components/common/ErrorMessage.tsx`
- [ ] `src/components/common/Pagination.tsx`
- [ ] `src/components/common/SearchBar.tsx`
- [ ] `src/components/common/EmptyState.tsx`

### Comandos para verificar:

```bash
# Verificar que no hay errores de TypeScript
npm run type-check

# Verificar ESLint
npm run lint

# Ejecutar en desarrollo
npm run dev
```

---

## 📋 Resumen de lo Creado

En esta fase hemos creado:

1. **4 layouts diferentes** para diferentes secciones de la app
2. **4 componentes de navegación** (Header, Footer, Sidebar, DashboardNavbar)
3. **5 componentes comunes** reutilizables (LoadingSpinner, ErrorMessage, Pagination, SearchBar, EmptyState)
4. **Sistema de navegación completo** con menús dropdown y responsive
5. **Protección de rutas** por autenticación y roles

Todos los componentes están **listos para ser utilizados** en las páginas que crearemos en las siguientes fases.

---

## 💡 Ejemplos de Uso

### Usar LoadingSpinner en una página:

```typescript
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function MyPage() {
  const { data, isLoading } = useQuery(...);

  if (isLoading) return <LoadingSpinner size="lg" />;

  return <div>{/* contenido */}</div>;
}
```

### Usar Pagination:

```typescript
import Pagination from '@/components/common/Pagination';

export default function CoursesPage() {
  const [page, setPage] = useState(1);
  const { courses, meta } = useCourses({ page, limit: 10 });

  return (
    <div>
      {/* lista de cursos */}
      <Pagination
        currentPage={meta.page}
        totalPages={meta.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
```

---

## 🚀 Siguiente Paso

Una vez completados todos los archivos de esta fase:

**✅ FASE 4 COMPLETA - Continuar con → [FASE 05 - Páginas Públicas](./FRONTEND-05-PAGINAS-PUBLICAS.md)**
