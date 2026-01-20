import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Course } from '@/types/course';
import { formatCurrency } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [imageError, setImageError] = React.useState(false);

  // Determinar la URL del thumbnail (puede ser absoluta o relativa)
  const getThumbnailUrl = () => {
    if (!course.thumbnailUrl || imageError) return '/course/foto-card.jpg';

    // Si ya es una URL completa (http:// o https://), usarla tal cual
    if (course.thumbnailUrl.startsWith('http://') || course.thumbnailUrl.startsWith('https://')) {
      return course.thumbnailUrl;
    }

    // Si es una ruta relativa, concatenar con la URL del backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    return `${apiUrl}${course.thumbnailUrl}`;
  };

  const thumbnailUrl = getThumbnailUrl();
  const durationInHours = course.duration ? Math.ceil(course.duration / 60) : 0;
  const isExternalImage = thumbnailUrl.startsWith('http');

  return (
    <div className="group bg-white transition-all duration-300 hover:shadow-2xl">
      <Link href={`/cursos/${course.slug}`}>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#031926]">
          <Image
            src={thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={isExternalImage}
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#031926]/60 to-transparent" />
          {course.level && (
            <div className="absolute top-4 right-4 bg-[#031926]/90 px-3 py-1.5">
              <span className="text-xs font-semibold tracking-wide text-[#F4E9CD] uppercase">
                {course.level}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        {course.categories?.[0] && (
          <div className="mb-2 text-xs font-medium tracking-wider text-[#77ACA2] uppercase">
            {course.categories[0].name}
          </div>
        )}

        <Link href={`/cursos/${course.slug}`}>
          <h3 className="mb-3 line-clamp-2 text-xl font-bold text-[#031926] transition-colors group-hover:text-[#77ACA2]">
            {course.title}
          </h3>
        </Link>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#468189]">
          {course.shortDescription}
        </p>

        <div className="mb-6 flex items-center gap-6 border-t border-[#F4E9CD] pt-4 text-sm text-[#468189]">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{durationInHours}h</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="font-medium">{course.modules?.length || 0} módulos</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-[#031926]">{formatCurrency(course.price)}</div>
          <Button
            className="bg-[#77ACA2] px-6 py-2 text-sm font-semibold text-[#031926] transition-all hover:bg-[#031926] hover:text-[#F4E9CD]"
            asChild
          >
            <Link href={`/cursos/${course.slug}`}>Ver Curso</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
