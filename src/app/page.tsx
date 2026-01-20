'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users, Briefcase, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

export default function HomePage() {
  const audience = [
    {
      icon: Briefcase,
      title: 'Equipos de campaña',
      description: 'Directores, integrantes o participantes de campañas electorales.',
    },
    {
      icon: Users,
      title: 'Candidatos/as',
      description:
        'En todas las esferas, legislativas, ejecutivas, locales, provinciales y nacionales.',
    },
    {
      icon: Layers,
      title: 'Amantes de la ComPol',
      description: 'Estudiantes, profesores o entusiastas de la comunicación política.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F4E9CD] text-[#031926]">
      <PublicHeader />

      {/* Hero */}
      <section
        className="relative isolate flex min-h-screen items-center overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/home/foto-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#031926]/70" />
        <div className="relative z-10 container">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div className="ml-0 max-w-2xl px-4 md:ml-8">
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-[#F4E9CD] md:text-4xl lg:text-5xl">
                Curso de Oratoria y Media Training
              </h1>
              <p className="mb-6 text-base text-[#F4E9CD]/90 md:text-lg">
                Este curso ha sido diseñado para ayudarte a desarrollar habilidades efectivas de
                comunicación verbal y no verbal, así como también mejorar tu capacidad de
                presentación en público y manejo de los medios de comunicación.
              </p>
              <p className="mb-8 hidden text-lg text-[#F4E9CD]/90 md:block">
                Durante el curso, aprenderás técnicas para vencer el miedo escénico, comunicar con
                claridad y persuasión, utilizar tu lenguaje corporal de manera efectiva, entre otros
                aspectos esenciales para lograr una excelente presentación en público.
              </p>
              <Button className="bg-[#77ACA2] text-[#031926] hover:bg-[#9DBEBB]" asChild>
                <Link href="/cursos" className="flex items-center gap-2">
                  Quiero el curso
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center lg:justify-end lg:pr-16">
              <button className="group flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#F4E9CD] transition-all hover:scale-110 hover:border-[#77ACA2] hover:bg-[#F4E9CD]/10 md:h-20 md:w-20 lg:h-24 lg:w-24">
                <svg
                  className="ml-1 h-6 w-6 text-[#F4E9CD] transition-colors group-hover:text-[#77ACA2] md:h-8 md:w-8 lg:h-10 lg:w-10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Para quién es este curso */}
      <section className="bg-[#F4E9CD] py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold">Para quién es este curso</h2>
            <p className="mt-3 text-lg text-[#468189]">
              Registrate y accede a todos los cursos disponibles.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {audience.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group flex flex-col items-center p-8 text-center transition-all duration-500 hover:-translate-y-2"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`,
                  }}
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#031926] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-3 text-center text-xl font-semibold">{item.title}</h3>
                  <p className="text-center text-base text-[#468189]">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Conoce a la cliente */}
      <section className="bg-[#9DBEBB] py-16">
        <div className="container grid gap-10 px-4 md:grid-cols-2 md:items-center">
          <div className="relative mx-auto flex aspect-4/5 w-full max-w-xs overflow-hidden md:max-w-md">
            <Image
              src="/home/foto-cliente-sin -fondo.png"
              alt="María Victoria Seoane"
              fill
              sizes="(max-width: 768px) 320px, 448px"
              className="object-contain"
            />
          </div>
          <div className="px-4 md:px-0">
            <div className="mb-3 inline-block rounded-full bg-[#031926] px-3 py-1 text-xs font-semibold text-[#F4E9CD]">
              APRENDE SOBRE CÓMO COMUNICARTE
            </div>
            <h2 className="mb-4 text-2xl font-bold text-[#031926] md:text-3xl">
              Curso de oratoria y media training.
            </h2>
            <p className="text-sm text-[#031926] md:text-base">
              La docente María Victoria Seoane tiene 20 años de experiencia en el sector. Sostiene
              que la oratoria y el entrenamiento para hablar en público o en redes sociales son
              clave para los candidatos y funcionarios políticos. Todo lo que decimos con nuestro
              cuerpo es esencial a quienes nos escuchan y ven nuestro contenido, aprender a
              demostrar y enviar las señales adecuadas a nuestro público es muy importante.
            </p>
            <Button className="mt-6 bg-[#031926] text-[#F4E9CD] hover:bg-[#468189]" asChild>
              <Link href="/cursos">Quiero el curso</Link>
            </Button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
