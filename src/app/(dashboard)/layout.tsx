'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { isSidebarOpen } = useUIStore();

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/auth/login');
    }

    if (user?.role !== 'OWNER' && user?.role !== 'SUPER_ADMIN') {
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
          className={`bg-muted/20 flex-1 overflow-y-auto p-6 transition-all ${
            isSidebarOpen ? 'md:ml-64' : 'md:ml-16'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
