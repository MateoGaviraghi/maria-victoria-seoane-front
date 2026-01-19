# Fase 9: Gestión de Cursos (Admin)

## 📋 Objetivos de esta Fase

En esta fase crearemos el **sistema completo de gestión de cursos** para el panel admin:

- ✅ Lista de cursos con filtros y búsqueda
- ✅ Crear nuevo curso (formulario completo)
- ✅ Editar curso existente
- ✅ Gestión de módulos y lecciones
- ✅ Upload de imágenes (thumbnail)
- ✅ Gestión de categorías (CRUD)
- ✅ Activar/desactivar cursos
- ✅ Eliminar cursos

---

## 🎯 Lo que Construiremos

### Páginas

1. **Lista de Cursos** (`app/admin/cursos/page.tsx`)
2. **Crear Curso** (`app/admin/cursos/nuevo/page.tsx`)
3. **Editar Curso** (`app/admin/cursos/[id]/editar/page.tsx`)
4. **Lista de Categorías** (`app/admin/categorias/page.tsx`)

### Componentes

1. **CoursesTable** - Tabla de cursos con acciones
2. **CourseForm** - Formulario de curso (crear/editar)
3. **CourseModuleManager** - Gestor de módulos y lecciones
4. **ModuleForm** - Formulario para módulos
5. **LessonForm** - Formulario para lecciones
6. **CategoryForm** - Formulario de categorías
7. **ImageUpload** - Componente de subida de imágenes
8. **CourseFilters** - Filtros de cursos

---

## 📁 Estructura de Archivos

```
src/
├── app/
│   └── admin/
│       ├── cursos/
│       │   ├── page.tsx                      # ⭐ Lista de cursos
│       │   ├── nuevo/
│       │   │   └── page.tsx                  # ⭐ Crear curso
│       │   └── [id]/
│       │       └── editar/
│       │           └── page.tsx              # ⭐ Editar curso
│       └── categorias/
│           └── page.tsx                      # ⭐ Gestión de categorías
│
├── components/
│   └── admin/
│       └── courses/
│           ├── CoursesTable.tsx              # ⭐ Tabla de cursos
│           ├── CourseForm.tsx                # ⭐ Formulario principal
│           ├── CourseModuleManager.tsx       # ⭐ Gestor módulos/lecciones
│           ├── ModuleForm.tsx                # ⭐ Formulario de módulo
│           ├── LessonForm.tsx                # ⭐ Formulario de lección
│           ├── CourseFilters.tsx             # ⭐ Filtros de búsqueda
│           ├── ImageUpload.tsx               # ⭐ Upload de imágenes
│           └── CategoryForm.tsx              # ⭐ Formulario de categoría
│
└── lib/
    ├── hooks/
    │   ├── useCourses.ts                     # Ya existe (Fase 3)
    │   └── useCategories.ts                  # Ya existe (Fase 3)
    └── validations/
        └── courseSchemas.ts                  # Ya existe (Fase 2)
```

---

## 🔨 Implementación

### 1️⃣ Tipos para Módulos y Lecciones

Actualizar tipos si es necesario:

**Archivo:** `src/lib/types/course.ts`

```typescript
// Agregar estos tipos si no existen
export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
  courseId: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  duration?: number; // en minutos
  order: number;
  isFree: boolean;
  moduleId: string;
}

export interface CreateModuleDto {
  title: string;
  description?: string;
  order: number;
}

export interface CreateLessonDto {
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  isFree: boolean;
}
```

---

### 2️⃣ Custom Hooks Adicionales

**Archivo:** `src/lib/hooks/useCourseAdmin.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesService } from '@/lib/services/coursesService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

/**
 * Hook para crear curso
 */
export function useCreateCourse() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: coursesService.createCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Curso creado exitosamente');
      router.push(`/admin/cursos/${data.id}/editar`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear el curso');
    },
  });
}

/**
 * Hook para actualizar curso
 */
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      coursesService.updateCourse(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', data.id] });
      toast.success('Curso actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al actualizar el curso',
      );
    },
  });
}

/**
 * Hook para eliminar curso
 */
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coursesService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Curso eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al eliminar el curso',
      );
    },
  });
}

/**
 * Hook para toggle status del curso
 */
export function useToggleCourseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      coursesService.updateCourse(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Estado actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al actualizar el estado',
      );
    },
  });
}

/**
 * Hook para crear módulo
 */
export function useCreateModule(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => coursesService.createModule(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast.success('Módulo creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear el módulo');
    },
  });
}

/**
 * Hook para actualizar módulo
 */
export function useUpdateModule(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, data }: { moduleId: string; data: any }) =>
      coursesService.updateModule(courseId, moduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast.success('Módulo actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al actualizar el módulo',
      );
    },
  });
}

/**
 * Hook para eliminar módulo
 */
export function useDeleteModule(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moduleId: string) =>
      coursesService.deleteModule(courseId, moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast.success('Módulo eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al eliminar el módulo',
      );
    },
  });
}

/**
 * Hook para crear lección
 */
export function useCreateLesson(courseId: string, moduleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      coursesService.createLesson(courseId, moduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast.success('Lección creada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear la lección');
    },
  });
}

/**
 * Hook para actualizar lección
 */
export function useUpdateLesson(courseId: string, moduleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, data }: { lessonId: string; data: any }) =>
      coursesService.updateLesson(courseId, moduleId, lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast.success('Lección actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al actualizar la lección',
      );
    },
  });
}

/**
 * Hook para eliminar lección
 */
export function useDeleteLesson(courseId: string, moduleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: string) =>
      coursesService.deleteLesson(courseId, moduleId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast.success('Lección eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al eliminar la lección',
      );
    },
  });
}
```

---

### 3️⃣ Componente ImageUpload

**Archivo:** `src/components/admin/courses/ImageUpload.tsx`

```typescript
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    try {
      setIsUploading(true);

      // Crear FormData
      const formData = new FormData();
      formData.append('file', file);

      // Subir a tu endpoint de upload
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      onChange('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {value ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={disabled || isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'w-full aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click para subir imagen
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP (máx. 5MB)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### 4️⃣ Componente CourseFilters

**Archivo:** `src/components/admin/courses/CourseFilters.tsx`

```typescript
'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useCategories } from '@/lib/hooks/useCategories';

interface CourseFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export default function CourseFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
}: CourseFiltersProps) {
  const { data: categories } = useCategories();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar cursos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Todas las categorías" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las categorías</SelectItem>
          {categories?.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Todos los estados" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="active">Activos</SelectItem>
          <SelectItem value="inactive">Inactivos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

---

### 5️⃣ Componente CoursesTable

**Archivo:** `src/components/admin/courses/CoursesTable.tsx`

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/lib/types/course';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreVertical, Edit, Trash, Eye, Power } from 'lucide-react';
import { useDeleteCourse, useToggleCourseStatus } from '@/lib/hooks/useCourseAdmin';
import { formatDate } from '@/lib/utils';

interface CoursesTableProps {
  courses: Course[];
}

export default function CoursesTable({ courses }: CoursesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteMutation = useDeleteCourse();
  const toggleStatusMutation = useToggleCourseStatus();

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await toggleStatusMutation.mutateAsync({
      id,
      isActive: !currentStatus,
    });
  };

  if (courses.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No se encontraron cursos</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagen</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div className="relative w-16 h-10 rounded overflow-hidden">
                    <Image
                      src={course.thumbnail || '/placeholder-course.jpg'}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {course.subtitle}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{course.category?.name}</Badge>
                </TableCell>
                <TableCell>
                  {course.price > 0 ? (
                    <span className="font-semibold">
                      ${course.price.toLocaleString()}
                    </span>
                  ) : (
                    <Badge>Gratis</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={course.isActive ? 'default' : 'secondary'}
                  >
                    {course.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(course.createdAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/cursos/${course.slug}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver curso
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/cursos/${course.id}/editar`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleToggleStatus(course.id, course.isActive)
                        }
                      >
                        <Power className="mr-2 h-4 w-4" />
                        {course.isActive ? 'Desactivar' : 'Activar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(course.id)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El curso será eliminado
              permanentemente junto con todos sus módulos y lecciones.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

---

### 6️⃣ Página Lista de Cursos

**Archivo:** `src/app/admin/cursos/page.tsx`

```typescript
'use client';

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CoursesTable from '@/components/admin/courses/CoursesTable';
import CourseFilters from '@/components/admin/courses/CourseFilters';
import { useCourses } from '@/lib/hooks/useCourses';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminCoursesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  const { data: courses, isLoading } = useCourses();

  // Filtrar cursos
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course) => {
      // Filtro de búsqueda
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.subtitle?.toLowerCase().includes(search.toLowerCase());

      // Filtro de categoría
      const matchesCategory =
        category === 'all' || course.categoryId === category;

      // Filtro de estado
      const matchesStatus =
        status === 'all' ||
        (status === 'active' && course.isActive) ||
        (status === 'inactive' && !course.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [courses, search, category, status]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cursos</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona todos los cursos de la plataforma
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/cursos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Crear Curso
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <CourseFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          status={status}
          onStatusChange={setStatus}
        />
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total de Cursos</p>
          <p className="text-2xl font-bold">{courses?.length || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Cursos Activos</p>
          <p className="text-2xl font-bold">
            {courses?.filter((c) => c.isActive).length || 0}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Resultados</p>
          <p className="text-2xl font-bold">{filteredCourses.length}</p>
        </Card>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <CoursesTable courses={filteredCourses} />
      )}
    </div>
  );
}
```

---

### 7️⃣ Componente CourseForm (Parte 1 - Información Básica)

**Archivo:** `src/components/admin/courses/CourseForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ImageUpload from './ImageUpload';
import CourseModuleManager from './CourseModuleManager';
import { useCategories } from '@/lib/hooks/useCategories';
import { Course } from '@/lib/types/course';
import { Loader2 } from 'lucide-react';

const courseSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  subtitle: z.string().optional(),
  slug: z.string().min(3, 'El slug es requerido'),
  description: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  thumbnail: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  discountPrice: z.number().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.number().optional(),
  language: z.string().default('es'),
  requirements: z.string().optional(),
  whatYouWillLearn: z.string().optional(),
  targetAudience: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: CourseFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function CourseForm({
  course,
  onSubmit,
  isLoading,
}: CourseFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const { data: categories } = useCategories();

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title || '',
      subtitle: course?.subtitle || '',
      slug: course?.slug || '',
      description: course?.description || '',
      categoryId: course?.categoryId || '',
      thumbnail: course?.thumbnail || '',
      price: course?.price || 0,
      discountPrice: course?.discountPrice || 0,
      level: course?.level || 'beginner',
      duration: course?.duration || 0,
      language: course?.language || 'es',
      requirements: course?.requirements || '',
      whatYouWillLearn: course?.whatYouWillLearn || '',
      targetAudience: course?.targetAudience || '',
      isActive: course?.isActive ?? true,
      isFeatured: course?.isFeatured ?? false,
    },
  });

  // Generar slug automáticamente desde el título
  const handleTitleChange = (value: string) => {
    form.setValue('title', value);
    if (!course) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug);
    }
  };

  const handleSubmit = async (data: CourseFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="modules" disabled={!course}>
              Módulos y Lecciones
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Información Básica */}
          <TabsContent value="basic" className="space-y-6">
            <Card className="p-6 space-y-6">
              {/* Título */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título del Curso *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Ej: Máster en Marketing Digital"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subtítulo */}
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtítulo</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Breve descripción del curso"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL) *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="master-marketing-digital" />
                    </FormControl>
                    <FormDescription>
                      URL amigable para el curso (se genera automáticamente)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Descripción */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={6}
                        placeholder="Descripción detallada del curso..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Grid: Categoría, Nivel, Idioma */}
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nivel *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Principiante</SelectItem>
                          <SelectItem value="intermediate">Intermedio</SelectItem>
                          <SelectItem value="advanced">Avanzado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idioma</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">Inglés</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Grid: Precio, Descuento, Duración */}
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio ($) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio con Descuento ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duración (horas)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Imagen */}
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagen de Portada</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Switches */}
              <div className="flex gap-6">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Curso Activo</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Curso Destacado</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: Detalles */}
          <TabsContent value="details" className="space-y-6">
            <Card className="p-6 space-y-6">
              {/* Requisitos */}
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requisitos</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder="Lista de requisitos previos (uno por línea)"
                      />
                    </FormControl>
                    <FormDescription>
                      Escribe cada requisito en una línea separada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Qué aprenderás */}
              <FormField
                control={form.control}
                name="whatYouWillLearn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Qué aprenderás?</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={6}
                        placeholder="Lista de objetivos de aprendizaje (uno por línea)"
                      />
                    </FormControl>
                    <FormDescription>
                      Escribe cada objetivo en una línea separada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Audiencia objetivo */}
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Para quién es este curso?</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder="Describe tu audiencia objetivo (uno por línea)"
                      />
                    </FormControl>
                    <FormDescription>
                      Escribe cada perfil en una línea separada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          </TabsContent>

          {/* TAB 3: Módulos y Lecciones */}
          <TabsContent value="modules" className="space-y-6">
            {course ? (
              <CourseModuleManager courseId={course.id} />
            ) : (
              <Card className="p-6 text-center text-muted-foreground">
                Primero guarda el curso para poder agregar módulos y lecciones
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {course ? 'Actualizar Curso' : 'Crear Curso'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

---

**(Continúa en el siguiente mensaje debido a la extensión...)**

### 8️⃣ Componente CourseModuleManager

**Archivo:** `src/components/admin/courses/CourseModuleManager.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, GripVertical, Edit, Trash, ChevronDown, ChevronRight } from 'lucide-react';
import { useCourse } from '@/lib/hooks/useCourses';
import ModuleForm from './ModuleForm';
import LessonForm from './LessonForm';
import { useDeleteModule, useDeleteLesson } from '@/lib/hooks/useCourseAdmin';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface CourseModuleManagerProps {
  courseId: string;
}

export default function CourseModuleManager({ courseId }: CourseModuleManagerProps) {
  const [openModuleForm, setOpenModuleForm] = useState(false);
  const [openLessonForm, setOpenLessonForm] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [deleteModuleId, setDeleteModuleId] = useState<string | null>(null);
  const [deleteLessonId, setDeleteLessonId] = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const { data: course, isLoading } = useCourse(courseId);
  const deleteModuleMutation = useDeleteModule(courseId);
  const deleteLessonMutation = useDeleteLesson(courseId, deleteLessonId?.moduleId || '');

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleCreateModule = () => {
    setEditingModule(null);
    setOpenModuleForm(true);
  };

  const handleEditModule = (module: any) => {
    setEditingModule(module);
    setOpenModuleForm(true);
  };

  const handleDeleteModule = async () => {
    if (!deleteModuleId) return;
    await deleteModuleMutation.mutateAsync(deleteModuleId);
    setDeleteModuleId(null);
  };

  const handleCreateLesson = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setEditingLesson(null);
    setOpenLessonForm(true);
  };

  const handleEditLesson = (moduleId: string, lesson: any) => {
    setSelectedModuleId(moduleId);
    setEditingLesson(lesson);
    setOpenLessonForm(true);
  };

  const handleDeleteLesson = async () => {
    if (!deleteLessonId) return;
    await deleteLessonMutation.mutateAsync(deleteLessonId.lessonId);
    setDeleteLessonId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const modules = course?.modules || [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Módulos y Lecciones</h3>
          <p className="text-sm text-muted-foreground">
            Organiza el contenido del curso en módulos y lecciones
          </p>
        </div>
        <Button onClick={handleCreateModule}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Módulo
        </Button>
      </div>

      {/* Módulos */}
      {modules.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No hay módulos creados. Agrega tu primer módulo para comenzar.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {modules.map((module, index) => (
            <Card key={module.id} className="overflow-hidden">
              <Collapsible
                open={expandedModules.has(module.id)}
                onOpenChange={() => toggleModule(module.id)}
              >
                {/* Module Header */}
                <div className="flex items-center gap-3 p-4 bg-muted/30">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />

                  <CollapsibleTrigger className="flex-1 flex items-center gap-2 text-left">
                    {expandedModules.has(module.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">
                        Módulo {index + 1}: {module.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {module.lessons?.length || 0} lecciones
                      </p>
                    </div>
                  </CollapsibleTrigger>

                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEditModule(module)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteModuleId(module.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {/* Module Content (Lessons) */}
                <CollapsibleContent>
                  <div className="p-4 space-y-2">
                    {module.lessons && module.lessons.length > 0 ? (
                      module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 p-3 bg-background border rounded-lg"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />

                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {lessonIndex + 1}. {lesson.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {lesson.duration} min
                              {lesson.isFree && ' • Lección gratuita'}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditLesson(module.id, lesson)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                setDeleteLessonId({
                                  moduleId: module.id,
                                  lessonId: lesson.id,
                                })
                              }
                            >
                              <Trash className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No hay lecciones en este módulo
                      </p>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleCreateLesson(module.id)}
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      Agregar Lección
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}

      {/* Module Form Dialog */}
      <ModuleForm
        courseId={courseId}
        module={editingModule}
        open={openModuleForm}
        onOpenChange={setOpenModuleForm}
      />

      {/* Lesson Form Dialog */}
      {selectedModuleId && (
        <LessonForm
          courseId={courseId}
          moduleId={selectedModuleId}
          lesson={editingLesson}
          open={openLessonForm}
          onOpenChange={setOpenLessonForm}
        />
      )}

      {/* Delete Module Dialog */}
      <AlertDialog open={!!deleteModuleId} onOpenChange={() => setDeleteModuleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar módulo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el módulo y todas sus lecciones permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteModule}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Lesson Dialog */}
      <AlertDialog open={!!deleteLessonId} onOpenChange={() => setDeleteLessonId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar lección?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLesson}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

Continuaré en el siguiente mensaje con ModuleForm, LessonForm y las páginas de crear/editar curso...
