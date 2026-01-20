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

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'U';

  return (
    <header
      className={cn(
        'bg-background sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-6 transition-all',
        isSidebarOpen ? 'md:ml-64' : 'md:ml-16'
      )}
    >
      <div className="flex flex-1 items-center gap-4">
        <form className="flex-1 md:max-w-md">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input type="search" placeholder="Buscar..." className="bg-muted/50 w-full pl-8" />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

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
                <p className="text-sm leading-none font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-muted-foreground text-xs leading-none">{user?.email}</p>
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
