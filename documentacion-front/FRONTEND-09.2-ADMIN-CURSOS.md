# Fase 9.2: Gestión de Cursos (Admin) - Continuación

## 📋 Contenido de esta Fase

Esta es la continuación de la Fase 9, donde completamos:

- ✅ ModuleForm - Formulario para crear/editar módulos
- ✅ LessonForm - Formulario para crear/editar lecciones
- ✅ Página Crear Curso
- ✅ Página Editar Curso
- ✅ Gestión de Categorías (CRUD completo)
- ✅ CategoryTable - Tabla de categorías
- ✅ Testing y validación

---

## 🔨 Implementación Continuada

### 9️⃣ Componente ModuleForm

**Archivo:** `src/components/admin/courses/ModuleForm.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCreateModule, useUpdateModule } from '@/lib/hooks/useCourseAdmin';
import { Loader2 } from 'lucide-react';

const moduleSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  order: z.number().min(1, 'El orden debe ser mayor a 0'),
});

type ModuleFormData = z.infer<typeof moduleSchema>;

interface ModuleFormProps {
  courseId: string;
  module?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ModuleForm({
  courseId,
  module,
  open,
  onOpenChange,
}: ModuleFormProps) {
  const isEditing = !!module;
  const createMutation = useCreateModule(courseId);
  const updateMutation = useUpdateModule(courseId);

  const form = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: '',
      description: '',
      order: 1,
    },
  });

  // Resetear form cuando cambia el módulo o se abre/cierra
  useEffect(() => {
    if (open) {
      if (module) {
        form.reset({
          title: module.title,
          description: module.description || '',
          order: module.order,
        });
      } else {
        form.reset({
          title: '',
          description: '',
          order: 1,
        });
      }
    }
  }, [module, open, form]);

  const onSubmit = async (data: ModuleFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          moduleId: module.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error saving module:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Módulo' : 'Crear Módulo'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Título */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: Introducción al Marketing" />
                  </FormControl>
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
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Descripción breve del módulo..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Orden */}
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orden *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

---

### 🔟 Componente LessonForm

**Archivo:** `src/components/admin/courses/LessonForm.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useCreateLesson, useUpdateLesson } from '@/lib/hooks/useCourseAdmin';
import { Loader2 } from 'lucide-react';

const lessonSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  duration: z.number().min(0, 'La duración debe ser mayor o igual a 0').optional(),
  order: z.number().min(1, 'El orden debe ser mayor a 0'),
  isFree: z.boolean().default(false),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface LessonFormProps {
  courseId: string;
  moduleId: string;
  lesson?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LessonForm({
  courseId,
  moduleId,
  lesson,
  open,
  onOpenChange,
}: LessonFormProps) {
  const isEditing = !!lesson;
  const createMutation = useCreateLesson(courseId, moduleId);
  const updateMutation = useUpdateLesson(courseId, moduleId);

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      videoUrl: '',
      duration: 0,
      order: 1,
      isFree: false,
    },
  });

  // Resetear form cuando cambia la lección o se abre/cierra
  useEffect(() => {
    if (open) {
      if (lesson) {
        form.reset({
          title: lesson.title,
          description: lesson.description || '',
          content: lesson.content || '',
          videoUrl: lesson.videoUrl || '',
          duration: lesson.duration || 0,
          order: lesson.order,
          isFree: lesson.isFree || false,
        });
      } else {
        form.reset({
          title: '',
          description: '',
          content: '',
          videoUrl: '',
          duration: 0,
          order: 1,
          isFree: false,
        });
      }
    }
  }, [lesson, open, form]);

  const onSubmit = async (data: LessonFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          lessonId: lesson.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error saving lesson:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Lección' : 'Crear Lección'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Título */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej: Cómo crear tu primera campaña"
                    />
                  </FormControl>
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
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Descripción breve de la lección..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video URL */}
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Video</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://..."
                    />
                  </FormControl>
                  <FormDescription>
                    URL de YouTube, Vimeo u otro proveedor de video
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grid: Duración y Orden */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración (minutos)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orden *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contenido */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenido</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={6}
                      placeholder="Contenido adicional de la lección (texto, apuntes, recursos)..."
                    />
                  </FormControl>
                  <FormDescription>
                    Puedes usar Markdown para formatear el contenido
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lección Gratuita */}
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Lección Gratuita</FormLabel>
                    <FormDescription>
                      Esta lección estará disponible sin comprar el curso
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

---

### 1️⃣1️⃣ Página Crear Curso

**Archivo:** `src/app/admin/cursos/nuevo/page.tsx`

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CourseForm from '@/components/admin/courses/CourseForm';
import { useCreateCourse } from '@/lib/hooks/useCourseAdmin';

export default function CreateCoursePage() {
  const router = useRouter();
  const createMutation = useCreateCourse();

  const handleSubmit = async (data: any) => {
    await createMutation.mutateAsync(data);
    // La redirección se maneja en el hook
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/cursos">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Crear Nuevo Curso</h1>
          <p className="text-muted-foreground mt-1">
            Completa la información básica del curso
          </p>
        </div>
      </div>

      {/* Form */}
      <CourseForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
    </div>
  );
}
```

---

### 1️⃣2️⃣ Página Editar Curso

**Archivo:** `src/app/admin/cursos/[id]/editar/page.tsx`

```typescript
'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CourseForm from '@/components/admin/courses/CourseForm';
import { useCourse } from '@/lib/hooks/useCourses';
import { useUpdateCourse } from '@/lib/hooks/useCourseAdmin';

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const router = useRouter();

  const { data: course, isLoading } = useCourse(courseId);
  const updateMutation = useUpdateCourse();

  const handleSubmit = async (data: any) => {
    await updateMutation.mutateAsync({ id: courseId, data });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Curso no encontrado</h2>
        <p className="text-muted-foreground mt-2">
          El curso que buscas no existe o fue eliminado
        </p>
        <Button asChild className="mt-4">
          <Link href="/admin/cursos">Volver a cursos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/cursos">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Curso</h1>
          <p className="text-muted-foreground mt-1">{course.title}</p>
        </div>
      </div>

      {/* Form */}
      <CourseForm
        course={course}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
```

---

### 1️⃣3️⃣ Hooks para Categorías

**Archivo:** `src/lib/hooks/useCategoryAdmin.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '@/lib/services/categoriesService';
import { toast } from 'sonner';

/**
 * Hook para crear categoría
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoría creada exitosamente');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al crear la categoría',
      );
    },
  });
}

/**
 * Hook para actualizar categoría
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      categoriesService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoría actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al actualizar la categoría',
      );
    },
  });
}

/**
 * Hook para eliminar categoría
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoría eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al eliminar la categoría',
      );
    },
  });
}
```

---

### 1️⃣4️⃣ Componente CategoryForm

**Archivo:** `src/components/admin/courses/CategoryForm.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCreateCategory, useUpdateCategory } from '@/lib/hooks/useCategoryAdmin';
import { Loader2 } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(2, 'El slug es requerido'),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CategoryForm({
  category,
  open,
  onOpenChange,
}: CategoryFormProps) {
  const isEditing = !!category;
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (category) {
        form.reset({
          name: category.name,
          slug: category.slug,
          description: category.description || '',
        });
      } else {
        form.reset({
          name: '',
          slug: '',
          description: '',
        });
      }
    }
  }, [category, open, form]);

  // Generar slug automáticamente
  const handleNameChange = (value: string) => {
    form.setValue('name', value);
    if (!isEditing) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: category.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Categoría' : 'Crear Categoría'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nombre */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Ej: Marketing Digital"
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
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="marketing-digital" />
                  </FormControl>
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
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Descripción de la categoría..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

---

### 1️⃣5️⃣ Componente CategoryTable

**Archivo:** `src/components/admin/courses/CategoryTable.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Category } from '@/lib/types/course';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { MoreVertical, Edit, Trash } from 'lucide-react';
import { useDeleteCategory } from '@/lib/hooks/useCategoryAdmin';
import { formatDate } from '@/lib/utils';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

export default function CategoryTable({
  categories,
  onEdit,
}: CategoryTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteMutation = useDeleteCategory();

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  if (categories.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No hay categorías creadas</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Cursos</TableHead>
              <TableHead>Creada</TableHead>
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {category.slug}
                  </code>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {category.description || '-'}
                </TableCell>
                <TableCell>
                  {category._count?.courses || 0} cursos
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(category.createdAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(category)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(category.id)}
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
              Esta acción no se puede deshacer. La categoría será eliminada
              permanentemente.
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

### 1️⃣6️⃣ Página de Categorías

**Archivo:** `src/app/admin/categorias/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CategoryTable from '@/components/admin/courses/CategoryTable';
import CategoryForm from '@/components/admin/courses/CategoryForm';
import { useCategories } from '@/lib/hooks/useCategories';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesPage() {
  const [openForm, setOpenForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const { data: categories, isLoading } = useCategories();

  const handleCreate = () => {
    setEditingCategory(null);
    setOpenForm(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setOpenForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categorías</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las categorías de los cursos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Categoría
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total de Categorías</p>
          <p className="text-2xl font-bold">{categories?.length || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Cursos Categorizados</p>
          <p className="text-2xl font-bold">
            {categories?.reduce((acc, cat) => acc + (cat._count?.courses || 0), 0) || 0}
          </p>
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
        <CategoryTable categories={categories || []} onEdit={handleEdit} />
      )}

      {/* Form Dialog */}
      <CategoryForm
        category={editingCategory}
        open={openForm}
        onOpenChange={setOpenForm}
      />
    </div>
  );
}
```

---

## 🎨 Componentes shadcn/ui Adicionales

Instalar componentes que puedan faltar:

```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add collapsible
npx shadcn-ui@latest add skeleton
```

---

## 🔗 Actualizar Servicios de Cursos

Verificar que el servicio de cursos tenga todos los métodos necesarios:

**Archivo:** `src/lib/services/coursesService.ts` (agregar si faltan)

```typescript
// Agregar estos métodos si no existen

/**
 * Crear módulo
 */
async createModule(courseId: string, data: CreateModuleDto): Promise<CourseModule> {
  const response: AxiosResponse<CourseModule> = await api.post(
    `/courses/${courseId}/modules`,
    data
  );
  return response.data;
}

/**
 * Actualizar módulo
 */
async updateModule(
  courseId: string,
  moduleId: string,
  data: Partial<CreateModuleDto>
): Promise<CourseModule> {
  const response: AxiosResponse<CourseModule> = await api.patch(
    `/courses/${courseId}/modules/${moduleId}`,
    data
  );
  return response.data;
}

/**
 * Eliminar módulo
 */
async deleteModule(courseId: string, moduleId: string): Promise<void> {
  await api.delete(`/courses/${courseId}/modules/${moduleId}`);
}

/**
 * Crear lección
 */
async createLesson(
  courseId: string,
  moduleId: string,
  data: CreateLessonDto
): Promise<Lesson> {
  const response: AxiosResponse<Lesson> = await api.post(
    `/courses/${courseId}/modules/${moduleId}/lessons`,
    data
  );
  return response.data;
}

/**
 * Actualizar lección
 */
async updateLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
  data: Partial<CreateLessonDto>
): Promise<Lesson> {
  const response: AxiosResponse<Lesson> = await api.patch(
    `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
    data
  );
  return response.data;
}

/**
 * Eliminar lección
 */
async deleteLesson(
  courseId: string,
  moduleId: string,
  lessonId: string
): Promise<void> {
  await api.delete(
    `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`
  );
}
```

---

## 📤 API de Upload de Imágenes

Necesitarás crear un endpoint para subir imágenes:

**Archivo:** `src/app/api/upload/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convertir el archivo a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar nombre único
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/\s/g, '-')}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

    // Guardar archivo
    await writeFile(filepath, buffer);

    // Retornar URL
    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 },
    );
  }
}
```

**Crear carpeta de uploads:**

```bash
mkdir -p public/uploads
```

**Agregar a .gitignore:**

```
public/uploads/*
!public/uploads/.gitkeep
```

---

## 🧪 Testing

### Test del Formulario de Curso

**Archivo:** `src/components/admin/courses/__tests__/CourseForm.test.tsx`

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CourseForm from '../CourseForm';

const queryClient = new QueryClient();

describe('CourseForm', () => {
  it('renders form fields', () => {
    const mockSubmit = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <CourseForm onSubmit={mockSubmit} />
      </QueryClientProvider>
    );

    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <CourseForm onSubmit={mockSubmit} />
      </QueryClientProvider>
    );

    const submitButton = screen.getByRole('button', { name: /crear curso/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el título debe tener/i)).toBeInTheDocument();
    });
  });
});
```

---

## ✅ Checklist de Implementación Fase 9.2

### Componentes

- [ ] `ModuleForm.tsx` - Formulario de módulos
- [ ] `LessonForm.tsx` - Formulario de lecciones
- [ ] `CategoryForm.tsx` - Formulario de categorías
- [ ] `CategoryTable.tsx` - Tabla de categorías

### Páginas

- [ ] `app/admin/cursos/nuevo/page.tsx` - Crear curso
- [ ] `app/admin/cursos/[id]/editar/page.tsx` - Editar curso
- [ ] `app/admin/categorias/page.tsx` - Gestión de categorías

### Hooks

- [ ] `useCourseAdmin.ts` - Hooks para CRUD de cursos
- [ ] `useCategoryAdmin.ts` - Hooks para CRUD de categorías

### API

- [ ] `app/api/upload/route.ts` - Endpoint de upload
- [ ] Carpeta `public/uploads` creada
- [ ] Métodos de módulos/lecciones en coursesService

### shadcn/ui

- [ ] Dialog instalado
- [ ] Dropdown Menu instalado
- [ ] Alert Dialog instalado
- [ ] Switch instalado
- [ ] Tabs instalado
- [ ] Collapsible instalado

### Testing

- [ ] Formularios se renderizan correctamente
- [ ] Validaciones funcionan
- [ ] CRUD de cursos funcional
- [ ] CRUD de categorías funcional
- [ ] Upload de imágenes funciona
- [ ] Módulos y lecciones se crean/editan/eliminan

---

## 🐛 Troubleshooting

### Problema: Upload de imágenes no funciona

**Solución:**

```bash
# Verificar que existe la carpeta
mkdir -p public/uploads

# Crear archivo .gitkeep
touch public/uploads/.gitkeep
```

### Problema: Tabs no cambian

**Solución:**
Verificar que el estado `activeTab` se está actualizando correctamente en CourseForm.

### Problema: Form no resetea después de crear

**Solución:**
Asegúrate de llamar `form.reset()` después del éxito en los diálogos.

---

## 📚 Recursos Adicionales

- [React Hook Form - Zod Resolver](https://react-hook-form.com/get-started#SchemaValidation)
- [shadcn/ui - Dialog](https://ui.shadcn.com/docs/components/dialog)
- [Next.js - File Upload](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [React Query - Mutations](https://tanstack.com/query/latest/docs/react/guides/mutations)

---

## 📝 Resumen de la Fase 9.2

En esta fase completamos:

✅ **ModuleForm** - Formulario para gestionar módulos  
✅ **LessonForm** - Formulario completo para lecciones con video, duración, contenido  
✅ **Páginas de Crear/Editar** - Flujo completo de gestión de cursos  
✅ **Gestión de Categorías** - CRUD completo con tabla y formulario  
✅ **Upload de Imágenes** - Sistema de subida de archivos  
✅ **Hooks Admin** - useCourseAdmin y useCategoryAdmin  
✅ **Validaciones** - Zod schemas para todos los formularios

**Resultado:** Sistema completo de gestión de cursos con módulos, lecciones, categorías y upload de imágenes totalmente funcional.

---

**¡Fase 9 + 9.2 completadas! 🎉**

Ahora puedes crear, editar, eliminar cursos con toda su estructura de módulos y lecciones desde el panel admin.
