'use client';

import { useState } from 'react';
import { useCourses } from '@/hooks/useCourses';
import CourseCard from '@/components/curso/CourseCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import { BookOpen } from 'lucide-react';

export default function CoursesPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { courses, meta, isLoading, error } = useCourses({ page, limit: 12 });

  // Filtrar cursos por búsqueda
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="container py-12">
        <ErrorMessage message="Error al cargar los cursos" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4E9CD]">
      {/* Hero Section */}
      <div className="bg-[#F4E9CD] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="mb-3 text-4xl font-bold text-[#031926] md:text-5xl">
              Catálogo de Cursos
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-[#468189]">
              Encuentra el curso perfecto para ti
            </p>
          </div>
        </div>
      </div>

      {/* Cards Section con fondo azul */}
      <div className="bg-[#031926] py-12">
        <div className="container mx-auto px-4">
          {/* Search & Filters */}
          <div className="mx-auto mb-12 max-w-4xl">
            <div className="mb-6">
              <SearchBar placeholder="Buscar cursos..." onSearch={setSearchQuery} />
            </div>
            {/* Filtros */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button className="border border-[#77ACA2] px-4 py-2 text-sm font-medium text-[#F4E9CD] transition-all hover:bg-[#77ACA2] hover:text-[#031926]">
                Todos
              </button>
              <button className="border border-[#77ACA2]/50 px-4 py-2 text-sm font-medium text-[#9DBEBB] transition-all hover:border-[#77ACA2] hover:bg-[#77ACA2] hover:text-[#031926]">
                Principiante
              </button>
              <button className="border border-[#77ACA2]/50 px-4 py-2 text-sm font-medium text-[#9DBEBB] transition-all hover:border-[#77ACA2] hover:bg-[#77ACA2] hover:text-[#031926]">
                Intermedio
              </button>
              <button className="border border-[#77ACA2]/50 px-4 py-2 text-sm font-medium text-[#9DBEBB] transition-all hover:border-[#77ACA2] hover:bg-[#77ACA2] hover:text-[#031926]">
                Avanzado
              </button>
            </div>
          </div>

          {/* Courses Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-12 w-12" />}
              title="No se encontraron cursos"
              description="Intenta con otros términos de búsqueda"
            />
          ) : (
            <>
              {/* Contador centrado */}
              <div className="mb-10 text-center">
                <div className="inline-block border-b-2 border-[#77ACA2] pb-2">
                  <span className="text-2xl font-bold text-[#F4E9CD]">
                    {filteredCourses.length}
                  </span>
                  <span className="ml-2 text-sm font-medium tracking-wider text-[#9DBEBB] uppercase">
                    {filteredCourses.length === 1 ? 'Curso Encontrado' : 'Cursos Encontrados'}
                  </span>
                </div>
              </div>

              {/* Grid centrado directamente sin flex wrapper */}
              <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="mt-16">
                  <Pagination
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
