import type { Metadata } from 'next';
import { Abril_Fatface, Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const abrilFatface = Abril_Fatface({
  variable: '--font-abril',
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'María Victoria Seoane - Plataforma de Cursos',
  description: 'Aprende con los mejores cursos online de estética y belleza.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${abrilFatface.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
