'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Mail,
  Settings,
  ShoppingBag,
  Tag,
  Users,
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
        'bg-background fixed top-0 left-0 z-40 h-screen border-r transition-all duration-300',
        isSidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b px-4">
          {isSidebarOpen && <span className="text-lg font-semibold">Admin Panel</span>}
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
