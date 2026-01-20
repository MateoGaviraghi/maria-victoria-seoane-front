# 🌐 FASE 05 - Páginas Públicas

## 📋 Objetivos de esta Fase

En esta fase vamos a:

1. ✅ Crear la Landing Page (página de inicio)
2. ✅ Crear la página de catálogo de cursos
3. ✅ Crear la página de detalle de curso
4. ✅ Crear las páginas de autenticación (Login, Register, Verificar Email)
5. ✅ Crear la página de carrito de compras
6. ✅ Crear la página de checkout

---

## 1️⃣ Landing Page (Home)

### `src/app/(public)/page.tsx`

```typescript
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users, Briefcase, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
      description: 'En todas las esferas, legislativas, ejecutivas, locales, provinciales y nacionales.',
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
        className="relative isolate overflow-hidden"
        style={{ backgroundImage: "url('/home/hero.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#031926]/70" />
        <div className="container relative z-10 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#F4E9CD] md:text-5xl">
              Curso de Oratoria y Media Training
            </h1>
            <p className="mb-8 text-lg text-[#F4E9CD]/90">
              Este curso ha sido diseñado para ayudarte a desarrollar habilidades efectivas de comunicación verbal y no verbal, así como también mejorar tu capacidad de presentación en público y manejo de los medios de comunicación.
              <br />
              Durante el curso, aprenderás técnicas para vencer el miedo escénico, comunicar con claridad y persuasión, utilizar tu lenguaje corporal de manera efectiva, entre otros aspectos esenciales para lograr una excelente presentación en público.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="bg-[#77ACA2] text-[#031926] hover:bg-[#9DBEBB]" asChild>
                <Link href="/cursos">
                  Quiero el curso
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="border-[#F4E9CD] text-[#F4E9CD] hover:bg-[#F4E9CD] hover:text-[#031926]" asChild>
                <Link href="/auth/register">Registrarme</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Para quién es este curso */}
      <section className="bg-[#F4E9CD] py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Para quién es este curso</h2>
            <p className="mt-2 text-[#468189]">Registrate y accede a todos los cursos disponibles.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {audience.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="border-[#9DBEBB]/40">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#031926]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-[#468189]">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Conoce a la cliente */}
      <section className="bg-[#9DBEBB] py-16">
        <div className="container grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#F4E9CD]">
            <Image
              src="/home/cliente.jpg"
              alt="María Victoria Seoane"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="mb-3 inline-block rounded-full bg-[#031926] px-3 py-1 text-xs font-semibold text-[#F4E9CD]">
              APRENDE SOBRE CÓMO COMUNICARTE
            </div>
            <h2 className="mb-4 text-3xl font-bold text-[#031926]">
              Curso de oratoria y media training.
            </h2>
            <p className="text-[#031926]">
              La docente María Victoria Seoane tiene 20 años de experiencia en el sector. Sostiene que la oratoria y el entrenamiento para hablar en público o en redes sociales son clave para los candidatos y funcionarios políticos. Todo lo que decimos con nuestro cuerpo es esencial a quienes nos escuchan y ven nuestro contenido, aprender a demostrar y enviar las señales adecuadas a nuestro público es muy importante.
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
```

---

## 🧩 Componente PublicHeader

### `src/components/layout/PublicHeader.tsx`

```typescript
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const PublicHeader = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="bg-[#031926] text-[#F4E9CD]">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/diseño-web/logo.png"
            alt="María Victoria Seoane"
            width={140}
            height={40}
          />
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <span className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </span>
          ) : (
            <>
              <Button variant="ghost" className="text-[#F4E9CD]" asChild>
                <Link href="/auth/login">Iniciar sesión</Link>
              </Button>
              <Button className="bg-[#77ACA2] text-[#031926] hover:bg-[#9DBEBB]" asChild>
                <Link href="/auth/register">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
```

---

## 🧩 Componente PublicFooter

### `src/components/layout/PublicFooter.tsx`

```typescript
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const PublicFooter = () => {
  return (
    <footer className="mt-auto bg-[#031926] text-[#F4E9CD]">
      <div className="container grid gap-8 py-12 md:grid-cols-3">
        <div>
          <Image
            src="/diseño-web/logo.png"
            alt="María Victoria Seoane"
            width={160}
            height={44}
          />
          <p className="mt-3 text-sm text-[#9DBEBB]">
            Formación en comunicación política y media training.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Navegación</h3>
          <ul className="space-y-2 text-sm text-[#9DBEBB]">
            <li><Link href="/cursos">Cursos</Link></li>
            <li><Link href="/auth/login">Iniciar sesión</Link></li>
            <li><Link href="/auth/register">Registrarse</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Seguinos</h3>
          <div className="flex items-center gap-4 text-[#F4E9CD]">
            <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5" /></Link>
            <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5" /></Link>
            <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></Link>
            <Link href="#" aria-label="YouTube"><Youtube className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[#468189]/40 py-4 text-center text-xs text-[#9DBEBB]">
        © {new Date().getFullYear()} María Victoria Seoane. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default PublicFooter;
```

---

## 2️⃣ Página de Catálogo de Cursos

### `src/app/(public)/cursos/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useCourses, useCategories } from '@/hooks/useCourses';
import CourseCard from '@/components/curso/CourseCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import { BookOpen } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CoursesPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { courses, meta, isLoading, error } = useCourses({ page, limit: 12 });
  const { categories } = useCategories();

  // Filtrar cursos por búsqueda y categoría (en producción esto debería hacerse en el backend)
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      course.categories?.some((category) => category.id === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (error) {
    return (
      <div className="container py-12">
        <ErrorMessage message="Error al cargar los cursos" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">
          Catálogo de Cursos
        </h1>
        <p className="text-lg text-muted-foreground">
          Encuentra el curso perfecto para ti
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 md:max-w-md">
          <SearchBar
            placeholder="Buscar cursos..."
            onSearch={setSearchQuery}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-12 w-12" />}
          title="No se encontraron cursos"
          description="Intenta con otros términos de búsqueda o filtros"
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-12">
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
  );
}
```

---

## 3️⃣ Componente CourseCard

### `src/components/curso/CourseCard.tsx`

```typescript
import Link from 'next/link';
import Image from 'next/image';
import { Clock, BarChart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Course } from '@/types/course';
import { formatCurrency } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
}

const CourseLevelBadge = ({ level }: { level?: string | null }) => {
  if (!level) return null;

  const variants: Record<string, string> = {
    Principiante: 'bg-green-100 text-green-800',
    Intermedio: 'bg-yellow-100 text-yellow-800',
    Avanzado: 'bg-red-100 text-red-800',
  };

  return <Badge className={variants[level] || ''}>{level}</Badge>;
};

const CourseCard = ({ course }: CourseCardProps) => {
  const thumbnailUrl = course.thumbnailUrl
    ? `${process.env.NEXT_PUBLIC_API_URL}${course.thumbnailUrl}`
    : '/images/placeholder-course.jpg';

  const durationInHours = course.duration
    ? Math.ceil(course.duration / 60)
    : 0;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/cursos/${course.slug}`}>
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <CourseLevelBadge level={course.level} />
          {course.categories?.[0] && (
            <span className="text-xs text-muted-foreground">
              {course.categories[0].name}
            </span>
          )}
        </div>

        <Link href={`/cursos/${course.slug}`}>
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold hover:text-primary">
            {course.title}
          </h3>
        </Link>

        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {course.shortDescription}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{durationInHours}h</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>{course.modulesCount || 0} módulos</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="text-2xl font-bold">{formatCurrency(course.price)}</div>
        <Button asChild>
          <Link href={`/cursos/${course.slug}`}>Ver Curso</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
```

---

## 4️⃣ Página de Detalle de Curso

### `src/app/(public)/cursos/[slug]/page.tsx`

```typescript
'use client';

import { use } from 'react';
import { useCourseBySlug } from '@/hooks/useCourses';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import Image from 'next/image';
import { Clock, BarChart, PlayCircle, ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import VideoPlayer from '@/components/curso/VideoPlayer';

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { course, isLoading, error } = useCourseBySlug(slug);
  const { addToCart, isAddingToCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container py-12">
        <ErrorMessage message="No se pudo cargar el curso" />
      </div>
    );
  }

  const thumbnailUrl = course.thumbnailUrl
    ? `${process.env.NEXT_PUBLIC_API_URL}${course.thumbnailUrl}`
    : '/images/placeholder-course.jpg';

  const videoPreviewUrl = course.previewVideoUrl
    ? `${process.env.NEXT_PUBLIC_API_URL}${course.previewVideoUrl}`
    : null;

  const durationInHours = course.duration ? Math.ceil(course.duration / 60) : 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login';
      return;
    }
    addToCart({ courseId: course.id });
  };

  return (
    <div className="container py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Video Preview or Thumbnail */}
          <div className="mb-8">
            {videoPreviewUrl ? (
              <VideoPlayer url={videoPreviewUrl} />
            ) : (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={thumbnailUrl}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Course Info */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {course.categories?.[0] && (
                <Badge variant="secondary">{course.categories[0].name}</Badge>
              )}
              {course.level && <Badge>{course.level}</Badge>}
            </div>

            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              {course.title}
            </h1>

            <p className="text-lg text-muted-foreground">
              {course.longDescription}
            </p>
          </div>

          <Separator className="my-8" />

          {/* Course Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{durationInHours}h</div>
                  <div className="text-sm text-muted-foreground">
                    Duración total
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <BarChart className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">
                    {course.lessonsCount || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Lecciones</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <PlayCircle className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">Online</div>
                  <div className="text-sm text-muted-foreground">
                    A tu ritmo
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />

          {/* Modules & Lessons List */}
          <div>
            <h2 className="mb-4 text-2xl font-bold">Contenido del Curso</h2>
            <div className="space-y-6">
              {course.modules?.map((module, moduleIndex) => (
                <div key={module.id}>
                  <h3 className="mb-3 text-lg font-semibold">
                    Módulo {moduleIndex + 1}: {module.title}
                  </h3>
                  <div className="space-y-2">
                    {module.lessons?.map((lesson, lessonIndex) => (
                      <Card key={lesson.id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                              {lessonIndex + 1}
                            </div>
                            <div>
                              <h3 className="font-medium">{lesson.title}</h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.isFree && (
                              <Badge variant="outline">Gratis</Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {lesson.duration ?? 0} min
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <div className="mb-6 text-center">
                <div className="mb-2 text-4xl font-bold">
                  {formatCurrency(course.price)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Pago único - Acceso de por vida
                </p>
              </div>

              <Button
                size="lg"
                className="mb-4 w-full"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Agregar al Carrito
              </Button>

              <Separator className="my-6" />

              <div className="space-y-3">
                <h3 className="font-semibold">Este curso incluye:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{durationInHours} horas de contenido en video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Acceso de por vida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Certificado de finalización</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Aprende a tu propio ritmo</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

---

## 5️⃣ Componente VideoPlayer

### `src/components/curso/VideoPlayer.tsx`

```typescript
'use client';

import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
  controls?: boolean;
  playing?: boolean;
}

const VideoPlayer = ({
  url,
  controls = true,
  playing = false,
}: VideoPlayerProps) => {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      <ReactPlayer
        url={url}
        controls={controls}
        playing={playing}
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default VideoPlayer;
```

---

## 6️⃣ Página de Login

### `src/app/(public)/auth/login/page.tsx`

```typescript
import LoginForm from '@/components/forms/LoginForm';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/register" className="text-primary hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 7️⃣ Componente LoginForm

### `src/components/forms/LoginForm.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginForm = () => {
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoggingIn}>
        {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
};

export default LoginForm;
```

---

## 8️⃣ Página de Registro

### `src/app/(public)/auth/register/page.tsx`

```typescript
import RegisterForm from '@/components/forms/RegisterForm';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Completa el formulario para registrarte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 9️⃣ Componente RegisterForm

### `src/components/forms/RegisterForm.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RegisterForm = () => {
  const { register: registerUser, isRegistering } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            id="firstName"
            placeholder="Juan"
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            placeholder="Pérez"
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isRegistering}>
        {isRegistering ? 'Registrando...' : 'Registrarse'}
      </Button>
    </form>
  );
};

export default RegisterForm;
```

---

## 🔟 Página de Verificación de Email

### `src/app/(public)/auth/verificar-email/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail, isVerifyingEmail } = useAuth();

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  if (!token) {
    return (
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-destructive" />
              Token Inválido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              El enlace de verificación no es válido.
            </p>
            <Button asChild>
              <Link href="/auth/login">Ir al Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isVerifyingEmail) {
    return (
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground">
              Verificando tu email...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Email Verificado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Tu email ha sido verificado exitosamente.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/login">Iniciar Sesión</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🎯 Checklist de Verificación - Fase 5

Verificar que todos los archivos estén creados:

### Páginas Públicas

- [ ] `src/app/(public)/page.tsx` (Home/Landing)
- [ ] `src/app/(public)/cursos/page.tsx` (Catálogo)
- [ ] `src/app/(public)/cursos/[slug]/page.tsx` (Detalle)
- [ ] `src/app/(public)/auth/login/page.tsx`
- [ ] `src/app/(public)/auth/register/page.tsx`
- [ ] `src/app/(public)/auth/verificar-email/page.tsx`

### Componentes de Cursos

- [ ] `src/components/curso/CourseCard.tsx`
- [ ] `src/components/curso/VideoPlayer.tsx`

### Formularios

- [ ] `src/components/forms/LoginForm.tsx`
- [ ] `src/components/forms/RegisterForm.tsx`

### Dependencias

- [ ] Instalar `react-player`: `npm install react-player`

### Comandos para verificar:

```bash
# Instalar react-player
npm install react-player

# Verificar que no hay errores de TypeScript
npm run type-check

# Verificar ESLint
npm run lint

# Ejecutar en desarrollo
npm run dev
```

---

## 📋 Resumen de lo Creado

En esta fase hemos creado:

1. **Landing Page** con hero, stats, features y CTA
2. **Página de Catálogo** con búsqueda, filtros y paginación
3. **Página de Detalle de Curso** con video preview, descripción y listado de lecciones
4. **Páginas de Autenticación** (Login, Register, Verificar Email)
5. **Componentes de Cursos** (CourseCard, VideoPlayer)
6. **Formularios** con validación (Login, Register)

Todas las páginas públicas están **listas y funcionales** con sus respectivos componentes.

---

## 🚀 Siguiente Paso

Una vez completados todos los archivos de esta fase:

**✅ FASE 5 COMPLETA - Continuar con → [FASE 06 - Carrito y Checkout](./FRONTEND-06-CARRITO-CHECKOUT.md)**
