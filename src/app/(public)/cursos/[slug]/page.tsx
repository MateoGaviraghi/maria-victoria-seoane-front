'use client';

import { use } from 'react';
import Image from 'next/image';
import { useCourseBySlug } from '@/hooks/useCourses';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Clock, BarChart, BookOpen, PlayCircle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default function CoursePage({ params }: CoursePageProps) {
  const { slug } = use(params);
  const { course, isLoading, error } = useCourseBySlug(slug);
  const [imageError, setImageError] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container py-12">
        <ErrorMessage message="Curso no encontrado" />
      </div>
    );
  }

  const getThumbnailUrl = () => {
    if (!course.thumbnailUrl || imageError) return '/course/foto-card.jpg';

    if (course.thumbnailUrl.startsWith('http://') || course.thumbnailUrl.startsWith('https://')) {
      return course.thumbnailUrl;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    return `${apiUrl}${course.thumbnailUrl}`;
  };

  const thumbnailUrl = getThumbnailUrl();
  const isExternalImage = thumbnailUrl.startsWith('http');
  const durationInHours = course.duration ? Math.ceil(course.duration / 60) : 0;
  const totalLessons =
    course.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#F4E9CD]">
      {/* Hero Section con imagen */}
      <section className="relative h-[600px] w-full overflow-hidden bg-[#031926]">
        <Image
          src={thumbnailUrl}
          alt={course.title}
          fill
          className="object-cover opacity-40"
          unoptimized={isExternalImage}
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031926] via-[#031926]/80 to-transparent" />

        <div className="relative container mx-auto flex h-full items-end px-4 pb-12">
          <div className="max-w-3xl">
            {course.categories?.[0] && (
              <div className="mb-3 inline-block bg-[#77ACA2] px-4 py-1.5">
                <span className="text-xs font-semibold tracking-wider text-[#031926] uppercase">
                  {course.categories[0].name}
                </span>
              </div>
            )}
            <h1 className="mb-4 text-4xl font-bold text-[#F4E9CD] md:text-5xl">{course.title}</h1>
            <p className="text-lg text-[#9DBEBB]">{course.shortDescription}</p>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Columna principal - Contenido */}
          <div className="lg:col-span-2">
            {/* Descripción */}
            <div className="mb-8 bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-[#031926]">Descripción del Curso</h2>
              <p className="leading-relaxed whitespace-pre-line text-[#468189]">
                {course.longDescription}
              </p>
            </div>

            {/* Video de presentación */}
            {course.previewVideoUrl && (
              <div className="mb-8 bg-white p-8 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-[#031926]">
                  <PlayCircle className="h-6 w-6 text-[#77ACA2]" />
                  Video de Presentación
                </h2>
                <div className="aspect-video w-full overflow-hidden bg-[#031926]">
                  <video
                    src={course.previewVideoUrl}
                    controls
                    className="h-full w-full"
                    poster={thumbnailUrl}
                  >
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
              </div>
            )}

            {/* Módulos y lecciones */}
            {course.modules && course.modules.length > 0 && (
              <div className="bg-white p-8 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-[#031926]">
                  <BookOpen className="h-6 w-6 text-[#77ACA2]" />
                  Contenido del Curso
                </h2>
                <div className="space-y-4">
                  {course.modules.map((module, index) => (
                    <div key={module.id} className="border-l-4 border-[#77ACA2] bg-[#F4E9CD] p-6">
                      <h3 className="mb-3 text-lg font-bold text-[#031926]">
                        Módulo {index + 1}: {module.title}
                      </h3>
                      {module.description && (
                        <p className="mb-4 text-sm text-[#468189]">{module.description}</p>
                      )}
                      {module.lessons && module.lessons.length > 0 && (
                        <ul className="space-y-2">
                          {module.lessons.map((lesson) => (
                            <li key={lesson.id} className="flex items-start gap-3 text-sm">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#77ACA2]" />
                              <span className="text-[#468189]">{lesson.title}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Información y CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-8 shadow-lg">
              <div className="mb-6 text-center">
                <div className="mb-2 text-4xl font-bold text-[#031926]">
                  {formatCurrency(course.price)}
                </div>
                {course.level && (
                  <div className="inline-block bg-[#031926] px-4 py-1.5">
                    <span className="text-xs font-semibold tracking-wider text-[#F4E9CD] uppercase">
                      Nivel: {course.level}
                    </span>
                  </div>
                )}
              </div>

              <Button
                className="mb-6 w-full bg-[#77ACA2] py-6 text-base font-semibold text-[#031926] hover:bg-[#468189] hover:text-[#F4E9CD]"
                size="lg"
              >
                Agregar al Carrito
              </Button>

              {/* Información del curso */}
              <div className="space-y-4 border-t border-[#F4E9CD] pt-6">
                <div className="flex items-center gap-3 text-[#468189]">
                  <Clock className="h-5 w-5 text-[#77ACA2]" />
                  <div>
                    <div className="text-xs font-medium tracking-wide text-[#77ACA2] uppercase">
                      Duración
                    </div>
                    <div className="font-semibold">{durationInHours} horas</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[#468189]">
                  <BarChart className="h-5 w-5 text-[#77ACA2]" />
                  <div>
                    <div className="text-xs font-medium tracking-wide text-[#77ACA2] uppercase">
                      Módulos
                    </div>
                    <div className="font-semibold">{course.modules?.length || 0} módulos</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[#468189]">
                  <PlayCircle className="h-5 w-5 text-[#77ACA2]" />
                  <div>
                    <div className="text-xs font-medium tracking-wide text-[#77ACA2] uppercase">
                      Lecciones
                    </div>
                    <div className="font-semibold">{totalLessons} lecciones</div>
                  </div>
                </div>
              </div>

              {/* Características adicionales */}
              <div className="mt-6 space-y-2 border-t border-[#F4E9CD] pt-6">
                <div className="flex items-start gap-2 text-sm text-[#468189]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#77ACA2]" />
                  <span>Acceso de por vida</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-[#468189]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#77ACA2]" />
                  <span>Certificado de finalización</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-[#468189]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#77ACA2]" />
                  <span>Soporte del instructor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
