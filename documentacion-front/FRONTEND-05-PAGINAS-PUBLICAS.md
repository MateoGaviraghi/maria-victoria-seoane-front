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
import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Cursos de Calidad',
      description: 'Aprende con contenido actualizado y de alta calidad',
    },
    {
      icon: Users,
      title: 'Instructores Expertos',
      description: 'Profesionales con años de experiencia en la industria',
    },
    {
      icon: Award,
      title: 'Certificados',
      description: 'Obtén certificados al completar tus cursos',
    },
    {
      icon: TrendingUp,
      title: 'Crece Profesionalmente',
      description: 'Desarrolla habilidades que impulsan tu carrera',
    },
  ];

  const stats = [
    { label: 'Estudiantes', value: '10,000+' },
    { label: 'Cursos', value: '100+' },
    { label: 'Instructores', value: '50+' },
    { label: 'Satisfacción', value: '98%' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Aprende Habilidades que Impulsan tu{' '}
              <span className="text-primary">Futuro</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Accede a cursos online de alta calidad impartidos por expertos.
              Aprende a tu ritmo y alcanza tus metas profesionales.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/cursos">
                  Explorar Cursos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/register">Comenzar Gratis</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50 py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg text-muted-foreground">
              Descubre las ventajas de aprender con nosotros
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title}>
                  <CardContent className="pt-6">
                    <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Comienza tu viaje de aprendizaje hoy
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Únete a miles de estudiantes que ya están transformando sus
              carreras
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/register">
                Registrarse Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
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
      selectedCategory === 'all' || course.categoryId === selectedCategory;
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

const CourseLevelBadge = ({ level }: { level: string }) => {
  const variants: Record<string, string> = {
    BEGINNER: 'bg-green-100 text-green-800',
    INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
    ADVANCED: 'bg-red-100 text-red-800',
  };

  const labels: Record<string, string> = {
    BEGINNER: 'Principiante',
    INTERMEDIATE: 'Intermedio',
    ADVANCED: 'Avanzado',
  };

  return (
    <Badge className={variants[level] || ''}>{labels[level] || level}</Badge>
  );
};

const CourseCard = ({ course }: CourseCardProps) => {
  const thumbnailUrl = course.thumbnail
    ? `${process.env.NEXT_PUBLIC_API_URL}${course.thumbnail}`
    : '/images/placeholder-course.jpg';

  const durationInHours = Math.floor(course.duration / 3600);

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
          {course.category && (
            <span className="text-xs text-muted-foreground">
              {course.category.name}
            </span>
          )}
        </div>

        <Link href={`/cursos/${course.slug}`}>
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold hover:text-primary">
            {course.title}
          </h3>
        </Link>

        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{durationInHours}h</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>{course.lessons?.length || 0} lecciones</span>
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

  const thumbnailUrl = course.thumbnail
    ? `${process.env.NEXT_PUBLIC_API_URL}${course.thumbnail}`
    : '/images/placeholder-course.jpg';

  const videoPreviewUrl = course.videoPreview
    ? `${process.env.NEXT_PUBLIC_API_URL}${course.videoPreview}`
    : null;

  const durationInHours = Math.floor(course.duration / 3600);

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
              <Badge variant="secondary">{course.category?.name}</Badge>
              <Badge>
                {course.level === 'BEGINNER' && 'Principiante'}
                {course.level === 'INTERMEDIATE' && 'Intermedio'}
                {course.level === 'ADVANCED' && 'Avanzado'}
              </Badge>
            </div>

            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              {course.title}
            </h1>

            <p className="text-lg text-muted-foreground">
              {course.description}
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
                    {course.lessons?.length || 0}
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

          {/* Lessons List */}
          <div>
            <h2 className="mb-4 text-2xl font-bold">Contenido del Curso</h2>
            <div className="space-y-2">
              {course.lessons?.map((lesson, index) => (
                <Card key={lesson.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        {lesson.description && (
                          <p className="text-sm text-muted-foreground">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lesson.isFree && (
                        <Badge variant="outline">Gratis</Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {Math.floor(lesson.duration / 60)} min
                      </span>
                    </div>
                  </CardContent>
                </Card>
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
        <Label htmlFor="birthDate">Fecha de Nacimiento (opcional)</Label>
        <Input
          id="birthDate"
          type="date"
          {...register('birthDate')}
        />
        {errors.birthDate && (
          <p className="text-sm text-destructive">{errors.birthDate.message}</p>
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
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
