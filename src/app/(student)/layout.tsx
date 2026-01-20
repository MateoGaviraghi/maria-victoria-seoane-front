'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/auth/login');
    }
  }, [isAuthenticated]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="bg-muted/20 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
