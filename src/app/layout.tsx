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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${abrilFatface.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
