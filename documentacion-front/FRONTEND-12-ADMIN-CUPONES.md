# 🎟️ Fase 12 - Gestión de Cupones (Admin)

> **Documentación Frontend - Maria Victoria Seoane**  
> Sistema completo de cupones de descuento con validaciones, estadísticas y aplicabilidad por curso

---

## 📋 Contenido

1. [Introducción](#introducción)
2. [Hooks de Cupones](#hooks-de-cupones)
3. [Componente CouponFilters](#componente-couponfilters)
4. [Componente CouponsTable](#componente-couponstable)
5. [Componente CouponForm](#componente-couponform)
6. [Componente CouponStats](#componente-couponstats)
7. [Componente CourseSelector](#componente-courseselector)
8. [Página Lista de Cupones](#página-lista-de-cupones)
9. [Página Crear Cupón](#página-crear-cupón)
10. [Página Editar Cupón](#página-editar-cupón)
11. [Validación de Cupones](#validación-de-cupones)
12. [Servicios](#servicios)
13. [Testing](#testing)
14. [Checklist](#checklist)

---

## 🎯 Introducción

En esta fase implementaremos el **sistema de cupones de descuento**, permitiendo:

- ✅ **Crear cupones** con porcentaje o monto fijo
- ✅ **Validar cupones** por fecha, uso y cursos aplicables
- ✅ **Estadísticas** de uso y conversión
- ✅ **Aplicar a cursos específicos** o todos los cursos
- ✅ **Límite de usos** globales y por usuario
- ✅ **Activar/Desactivar** cupones fácilmente
- ✅ **Ver historial** de usos por cupón

---

## 1️⃣ Hooks de Cupones

**Archivo:** `src/lib/hooks/useCouponAdmin.ts`

```typescript
'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { couponsService } from '@/lib/services/couponsService';
import { toast } from 'sonner';
import type {
  Coupon,
  CreateCouponDto,
  CouponStats,
  CouponUsage,
} from '@/types';

/**
 * Hook para obtener todos los cupones (admin)
 */
export function useCoupons(filters?: {
  search?: string;
  status?: string;
  discountType?: string;
}): UseQueryResult<Coupon[]> {
  return useQuery({
    queryKey: ['coupons', 'admin', filters],
    queryFn: () => couponsService.getCoupons(filters),
  });
}

/**
 * Hook para obtener un cupón por ID
 */
export function useCoupon(couponId: string): UseQueryResult<Coupon> {
  return useQuery({
    queryKey: ['coupons', couponId],
    queryFn: () => couponsService.getCouponById(couponId),
    enabled: !!couponId,
  });
}

/**
 * Hook para obtener estadísticas de cupones
 */
export function useCouponStats(): UseQueryResult<CouponStats> {
  return useQuery({
    queryKey: ['coupons', 'stats'],
    queryFn: () => couponsService.getCouponStats(),
  });
}

/**
 * Hook para obtener usos de un cupón
 */
export function useCouponUsages(
  couponId: string,
): UseQueryResult<CouponUsage[]> {
  return useQuery({
    queryKey: ['coupons', couponId, 'usages'],
    queryFn: () => couponsService.getCouponUsages(couponId),
    enabled: !!couponId,
  });
}

/**
 * Hook para crear cupón
 */
export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCouponDto) => couponsService.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Cupón creado correctamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear cupón');
    },
  });
}

/**
 * Hook para actualizar cupón
 */
export function useUpdateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateCouponDto>;
    }) => couponsService.updateCoupon(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      queryClient.invalidateQueries({ queryKey: ['coupons', variables.id] });
      toast.success('Cupón actualizado correctamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar cupón');
    },
  });
}

/**
 * Hook para eliminar cupón
 */
export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => couponsService.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Cupón eliminado correctamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar cupón');
    },
  });
}

/**
 * Hook para toggle status de cupón
 */
export function useToggleCouponStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => couponsService.toggleCouponStatus(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      queryClient.invalidateQueries({ queryKey: ['coupons', id] });
      toast.success('Estado del cupón actualizado');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al actualizar estado',
      );
    },
  });
}

/**
 * Hook para validar cupón (usado en checkout)
 */
export function useValidateCoupon() {
  return useMutation({
    mutationFn: ({ code, courseIds }: { code: string; courseIds?: string[] }) =>
      couponsService.validateCoupon(code, courseIds),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Cupón inválido o expirado');
    },
  });
}
```

---

## 2️⃣ Componente CouponFilters

**Archivo:** `src/components/admin/coupons/CouponFilters.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, X, Filter } from 'lucide-react';

interface CouponFiltersProps {
  onFiltersChange: (filters: {
    search?: string;
    status?: string;
    discountType?: string;
  }) => void;
}

export default function CouponFilters({ onFiltersChange }: CouponFiltersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [discountType, setDiscountType] = useState('');

  const handleApplyFilters = () => {
    onFiltersChange({
      search: search || undefined,
      status: status || undefined,
      discountType: discountType || undefined,
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setDiscountType('');
    onFiltersChange({});
  };

  const hasActiveFilters = search || status || discountType;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
          />
        </div>
        <Button onClick={handleApplyFilters}>
          <Filter className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" onClick={handleClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
              <SelectItem value="expired">Expirado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Discount Type */}
        <div className="space-y-2">
          <Label htmlFor="discountType">Tipo de Descuento</Label>
          <Select value={discountType} onValueChange={setDiscountType}>
            <SelectTrigger id="discountType">
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="percentage">Porcentaje</SelectItem>
              <SelectItem value="fixed">Monto Fijo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
```

---

## 3️⃣ Componente CouponsTable

**Archivo:** `src/components/admin/coupons/CouponsTable.tsx`

```typescript
'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  Edit,
  MoreHorizontal,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Copy,
} from 'lucide-react';
import {
  useDeleteCoupon,
  useToggleCouponStatus,
} from '@/lib/hooks/useCouponAdmin';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Coupon } from '@/types';

interface CouponsTableProps {
  coupons: Coupon[];
}

export default function CouponsTable({ coupons }: CouponsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { mutate: deleteCoupon, isPending: isDeleting } = useDeleteCoupon();
  const { mutate: toggleStatus, isPending: isToggling } = useToggleCouponStatus();

  const handleDelete = () => {
    if (deleteId) {
      deleteCoupon(deleteId);
      setDeleteId(null);
    }
  };

  const handleToggleStatus = (id: string) => {
    toggleStatus(id);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Código copiado al portapapeles');
  };

  const getCouponStatus = (coupon: Coupon) => {
    if (!coupon.isActive) {
      return { label: 'Inactivo', color: 'bg-gray-100 text-gray-800' };
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { label: 'Expirado', color: 'bg-red-100 text-red-800' };
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return { label: 'Agotado', color: 'bg-orange-100 text-orange-800' };
    }
    return { label: 'Activo', color: 'bg-green-100 text-green-800' };
  };

  if (coupons.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No se encontraron cupones</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descuento</TableHead>
              <TableHead>Usos</TableHead>
              <TableHead>Válido Hasta</TableHead>
              <TableHead>Cursos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => {
              const status = getCouponStatus(coupon);

              return (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-bold">
                        {coupon.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopyCode(coupon.code)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    {coupon.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {coupon.description}
                      </p>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className="font-semibold">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}%`
                        : `$${coupon.discountValue}`}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm">
                      {coupon.usedCount}
                      {coupon.maxUses && ` / ${coupon.maxUses}`}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm">
                    {coupon.expiresAt ? (
                      formatDate(coupon.expiresAt)
                    ) : (
                      <span className="text-muted-foreground">Sin límite</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {coupon.applicableCourses?.length ? (
                      <Badge variant="outline">
                        {coupon.applicableCourses.length} cursos
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Todos
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge className={status.color}>{status.label}</Badge>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isDeleting || isToggling}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                          <Link href={`/admin/cupones/${coupon.id}/editar`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(coupon.id)}
                        >
                          {coupon.isActive ? (
                            <>
                              <ToggleLeft className="mr-2 h-4 w-4" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <ToggleRight className="mr-2 h-4 w-4" />
                              Activar
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => setDeleteId(coupon.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cupón?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El cupón será eliminado
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
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

## 4️⃣ Componente CouponForm

**Archivo:** `src/components/admin/coupons/CouponForm.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import CourseSelector from './CourseSelector';
import type { Coupon } from '@/types';

const couponSchema = z.object({
  code: z
    .string()
    .min(3, 'El código debe tener al menos 3 caracteres')
    .max(20, 'El código no puede exceder 20 caracteres')
    .regex(/^[A-Z0-9-_]+$/, 'Solo mayúsculas, números, guiones y guión bajo'),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.coerce
    .number()
    .min(1, 'El descuento debe ser mayor a 0')
    .refine(
      (val, ctx) => {
        if (ctx.parent.discountType === 'percentage' && val > 100) {
          return false;
        }
        return true;
      },
      { message: 'El porcentaje no puede ser mayor a 100' }
    ),
  maxUses: z.coerce.number().optional(),
  maxUsesPerUser: z.coerce.number().optional(),
  expiresAt: z.date().optional(),
  isActive: z.boolean().default(true),
  applicableCourseIds: z.array(z.string()).optional(),
});

type CouponFormData = z.infer<typeof couponSchema>;

interface CouponFormProps {
  coupon?: Coupon;
  onSubmit: (data: CouponFormData) => void;
  isPending?: boolean;
}

export default function CouponForm({
  coupon,
  onSubmit,
  isPending,
}: CouponFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: coupon
      ? {
          code: coupon.code,
          description: coupon.description || '',
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          maxUses: coupon.maxUses || undefined,
          maxUsesPerUser: coupon.maxUsesPerUser || undefined,
          expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt) : undefined,
          isActive: coupon.isActive,
          applicableCourseIds: coupon.applicableCourses?.map((c) => c.id) || [],
        }
      : {
          discountType: 'percentage',
          isActive: true,
          applicableCourseIds: [],
        },
  });

  const discountType = watch('discountType');
  const expiresAt = watch('expiresAt');
  const isActive = watch('isActive');
  const applicableCourseIds = watch('applicableCourseIds') || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Code */}
      <div className="space-y-2">
        <Label htmlFor="code">
          Código del Cupón <span className="text-red-500">*</span>
        </Label>
        <Input
          id="code"
          {...register('code')}
          placeholder="VERANO2025"
          className="font-mono uppercase"
          onChange={(e) => {
            e.target.value = e.target.value.toUpperCase();
            register('code').onChange(e);
          }}
        />
        {errors.code && (
          <p className="text-sm text-red-600">{errors.code.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Solo mayúsculas, números, guiones y guión bajo
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Descuento de verano para nuevos estudiantes"
          rows={3}
        />
      </div>

      {/* Discount Type & Value */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="discountType">
            Tipo de Descuento <span className="text-red-500">*</span>
          </Label>
          <Select
            value={discountType}
            onValueChange={(value: any) => setValue('discountType', value)}
          >
            <SelectTrigger id="discountType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Porcentaje (%)</SelectItem>
              <SelectItem value="fixed">Monto Fijo ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountValue">
            Valor del Descuento <span className="text-red-500">*</span>
          </Label>
          <Input
            id="discountValue"
            type="number"
            {...register('discountValue')}
            placeholder={discountType === 'percentage' ? '10' : '5000'}
          />
          {errors.discountValue && (
            <p className="text-sm text-red-600">
              {errors.discountValue.message}
            </p>
          )}
        </div>
      </div>

      {/* Max Uses */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="maxUses">Usos Máximos Totales</Label>
          <Input
            id="maxUses"
            type="number"
            {...register('maxUses')}
            placeholder="100 (vacío = ilimitado)"
          />
          <p className="text-xs text-muted-foreground">
            Dejar vacío para usos ilimitados
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxUsesPerUser">Usos Máximos por Usuario</Label>
          <Input
            id="maxUsesPerUser"
            type="number"
            {...register('maxUsesPerUser')}
            placeholder="1 (vacío = ilimitado)"
          />
          <p className="text-xs text-muted-foreground">
            Cuántas veces puede usar un mismo usuario
          </p>
        </div>
      </div>

      {/* Expires At */}
      <div className="space-y-2">
        <Label>Fecha de Expiración</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {expiresAt ? (
                format(expiresAt, 'PPP', { locale: es })
              ) : (
                <span className="text-muted-foreground">
                  Sin fecha de expiración
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={expiresAt}
              onSelect={(date) => setValue('expiresAt', date)}
              locale={es}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
        <p className="text-xs text-muted-foreground">
          Dejar vacío para que no expire
        </p>
      </div>

      {/* Applicable Courses */}
      <div className="space-y-2">
        <Label>Cursos Aplicables</Label>
        <CourseSelector
          selectedCourseIds={applicableCourseIds}
          onChange={(ids) => setValue('applicableCourseIds', ids)}
        />
        <p className="text-xs text-muted-foreground">
          Dejar vacío para aplicar a todos los cursos
        </p>
      </div>

      {/* Is Active */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-0.5">
          <Label htmlFor="isActive">Estado del Cupón</Label>
          <p className="text-sm text-muted-foreground">
            {isActive
              ? 'El cupón está activo y puede ser usado'
              : 'El cupón está inactivo y no puede ser usado'}
          </p>
        </div>
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setValue('isActive', checked)}
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Guardando...' : coupon ? 'Actualizar Cupón' : 'Crear Cupón'}
        </Button>
      </div>
    </form>
  );
}
```

---

## 5️⃣ Componente CouponStats

**Archivo:** `src/components/admin/coupons/CouponStats.tsx`

```typescript
'use client';

import { Card } from '@/components/ui/card';
import { Ticket, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useCouponStats } from '@/lib/hooks/useCouponAdmin';
import { Loader2 } from 'lucide-react';

export default function CouponStats() {
  const { data: stats, isLoading } = useCouponStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Cupones',
      value: stats.totalCoupons.toString(),
      icon: Ticket,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Cupones Activos',
      value: stats.activeCoupons.toString(),
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Usado',
      value: stats.totalUsages.toString(),
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Descuento Total',
      value: `$${stats.totalDiscountAmount.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-full p-3 ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
```

---

## 6️⃣ Componente CourseSelector

**Archivo:** `src/components/admin/coupons/CourseSelector.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Search } from 'lucide-react';
import { useCourses } from '@/lib/hooks/useCourseAdmin';

interface CourseSelectorProps {
  selectedCourseIds: string[];
  onChange: (courseIds: string[]) => void;
}

export default function CourseSelector({
  selectedCourseIds,
  onChange,
}: CourseSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: courses } = useCourses({ search });

  const handleToggle = (courseId: string) => {
    if (selectedCourseIds.includes(courseId)) {
      onChange(selectedCourseIds.filter((id) => id !== courseId));
    } else {
      onChange([...selectedCourseIds, courseId]);
    }
  };

  const handleRemove = (courseId: string) => {
    onChange(selectedCourseIds.filter((id) => id !== courseId));
  };

  const selectedCourses =
    courses?.filter((c) => selectedCourseIds.includes(c.id)) || [];

  return (
    <div className="space-y-2">
      {/* Selected Courses */}
      {selectedCourses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCourses.map((course) => (
            <Badge key={course.id} variant="secondary" className="gap-1">
              {course.title}
              <button
                type="button"
                onClick={() => handleRemove(course.id)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {selectedCourses.length > 0
              ? 'Agregar más cursos'
              : 'Seleccionar cursos'}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[600px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Seleccionar Cursos</DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cursos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Course List */}
          <div className="space-y-2">
            {courses?.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50"
              >
                <Checkbox
                  checked={selectedCourseIds.includes(course.id)}
                  onCheckedChange={() => handleToggle(course.id)}
                />
                <div className="flex-1">
                  <p className="font-medium">{course.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {course.category?.name} • ${course.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={() => setOpen(false)} className="w-full">
            Confirmar Selección
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

## 7️⃣ Página Lista de Cupones

**Archivo:** `src/app/admin/cupones/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CouponFilters from '@/components/admin/coupons/CouponFilters';
import CouponsTable from '@/components/admin/coupons/CouponsTable';
import CouponStats from '@/components/admin/coupons/CouponStats';
import { useCoupons } from '@/lib/hooks/useCouponAdmin';
import { Loader2 } from 'lucide-react';

export default function CouponsPage() {
  const [filters, setFilters] = useState({});

  const { data: coupons, isLoading } = useCoupons(filters);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Cupones</h1>
          <p className="text-muted-foreground mt-1">
            Crea y administra cupones de descuento para tus cursos
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/cupones/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cupón
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <CouponStats />

      {/* Filters */}
      <CouponFilters onFiltersChange={setFilters} />

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 border rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : coupons ? (
        <CouponsTable coupons={coupons} />
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No se encontraron cupones</p>
        </div>
      )}
    </div>
  );
}
```

---

## 8️⃣ Página Crear Cupón

**Archivo:** `src/app/admin/cupones/nuevo/page.tsx`

```typescript
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CouponForm from '@/components/admin/coupons/CouponForm';
import { useCreateCoupon } from '@/lib/hooks/useCouponAdmin';

export default function CreateCouponPage() {
  const router = useRouter();
  const { mutate: createCoupon, isPending } = useCreateCoupon();

  const handleSubmit = (data: any) => {
    createCoupon(data, {
      onSuccess: () => {
        router.push('/admin/cupones');
      },
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/cupones">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Crear Cupón</h1>
          <p className="text-muted-foreground mt-1">
            Configura un nuevo cupón de descuento
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <CouponForm onSubmit={handleSubmit} isPending={isPending} />
      </Card>
    </div>
  );
}
```

---

## 9️⃣ Página Editar Cupón

**Archivo:** `src/app/admin/cupones/[id]/editar/page.tsx`

```typescript
'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CouponForm from '@/components/admin/coupons/CouponForm';
import { useCoupon, useUpdateCoupon } from '@/lib/hooks/useCouponAdmin';

export default function EditCouponPage() {
  const params = useParams();
  const router = useRouter();
  const couponId = params.id as string;

  const { data: coupon, isLoading } = useCoupon(couponId);
  const { mutate: updateCoupon, isPending } = useUpdateCoupon();

  const handleSubmit = (data: any) => {
    updateCoupon(
      { id: couponId, data },
      {
        onSuccess: () => {
          router.push('/admin/cupones');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Cupón no encontrado</h2>
        <Button asChild className="mt-4">
          <Link href="/admin/cupones">Volver a cupones</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/cupones">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Cupón</h1>
          <p className="text-muted-foreground mt-1">
            Modifica la configuración del cupón
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <CouponForm
          coupon={coupon}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </Card>
    </div>
  );
}
```

---

## 🔟 Validación de Cupones (Checkout)

**Archivo:** `src/components/checkout/CouponInput.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Tag, X } from 'lucide-react';
import { useValidateCoupon } from '@/lib/hooks/useCouponAdmin';
import type { Coupon } from '@/types';

interface CouponInputProps {
  courseIds: string[];
  onCouponApplied: (coupon: Coupon) => void;
  onCouponRemoved: () => void;
  appliedCoupon?: Coupon;
}

export default function CouponInput({
  courseIds,
  onCouponApplied,
  onCouponRemoved,
  appliedCoupon,
}: CouponInputProps) {
  const [code, setCode] = useState('');
  const { mutate: validate, isPending } = useValidateCoupon();

  const handleApply = () => {
    if (!code.trim()) return;

    validate(
      { code: code.toUpperCase(), courseIds },
      {
        onSuccess: (coupon) => {
          onCouponApplied(coupon);
          setCode('');
        },
      }
    );
  };

  const handleRemove = () => {
    onCouponRemoved();
    setCode('');
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <Tag className="h-4 w-4 text-green-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-900">
            Cupón aplicado: {appliedCoupon.code}
          </p>
          <p className="text-xs text-green-700">
            {appliedCoupon.discountType === 'percentage'
              ? `${appliedCoupon.discountValue}% de descuento`
              : `$${appliedCoupon.discountValue} de descuento`}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Código de cupón"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        disabled={isPending}
      />
      <Button
        type="button"
        onClick={handleApply}
        disabled={isPending || !code.trim()}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          'Aplicar'
        )}
      </Button>
    </div>
  );
}
```

---

## 1️⃣1️⃣ Servicios Completos

**Archivo:** `src/lib/services/couponsService.ts`

```typescript
import api from './api';
import type { AxiosResponse } from 'axios';
import type {
  Coupon,
  CreateCouponDto,
  CouponStats,
  CouponUsage,
} from '@/types';

export const couponsService = {
  /**
   * Obtener todos los cupones (admin)
   */
  async getCoupons(filters?: {
    search?: string;
    status?: string;
    discountType?: string;
  }): Promise<Coupon[]> {
    const response: AxiosResponse<Coupon[]> = await api.get('/coupons', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Obtener cupón por ID
   */
  async getCouponById(id: string): Promise<Coupon> {
    const response: AxiosResponse<Coupon> = await api.get(`/coupons/${id}`);
    return response.data;
  },

  /**
   * Obtener estadísticas de cupones
   */
  async getCouponStats(): Promise<CouponStats> {
    const response: AxiosResponse<CouponStats> =
      await api.get('/coupons/stats');
    return response.data;
  },

  /**
   * Obtener usos de un cupón
   */
  async getCouponUsages(couponId: string): Promise<CouponUsage[]> {
    const response: AxiosResponse<CouponUsage[]> = await api.get(
      `/coupons/${couponId}/usages`,
    );
    return response.data;
  },

  /**
   * Crear cupón
   */
  async createCoupon(data: CreateCouponDto): Promise<Coupon> {
    const response: AxiosResponse<Coupon> = await api.post('/coupons', data);
    return response.data;
  },

  /**
   * Actualizar cupón
   */
  async updateCoupon(
    id: string,
    data: Partial<CreateCouponDto>,
  ): Promise<Coupon> {
    const response: AxiosResponse<Coupon> = await api.patch(
      `/coupons/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Eliminar cupón
   */
  async deleteCoupon(id: string): Promise<void> {
    await api.delete(`/coupons/${id}`);
  },

  /**
   * Toggle status de cupón
   */
  async toggleCouponStatus(id: string): Promise<Coupon> {
    const response: AxiosResponse<Coupon> = await api.patch(
      `/coupons/${id}/toggle`,
    );
    return response.data;
  },

  /**
   * Validar cupón (usado en checkout)
   */
  async validateCoupon(code: string, courseIds?: string[]): Promise<Coupon> {
    const response: AxiosResponse<Coupon> = await api.post(
      '/coupons/validate',
      { code, courseIds },
    );
    return response.data;
  },
};
```

---

## 🎨 Tipos Adicionales

**Archivo:** `src/types/index.ts` (agregar)

```typescript
export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  applicableCourses?: Course[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponDto {
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  expiresAt?: Date;
  isActive: boolean;
  applicableCourseIds?: string[];
}

export interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  totalUsages: number;
  totalDiscountAmount: number;
}

export interface CouponUsage {
  id: string;
  coupon: Coupon;
  user: User;
  order: Order;
  discountApplied: number;
  createdAt: string;
}
```

---

## 🧪 Testing

**Archivo:** `src/components/admin/coupons/__tests__/CouponForm.test.tsx`

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CouponForm from '../CouponForm';

const queryClient = new QueryClient();

describe('CouponForm', () => {
  it('validates code format', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <CouponForm onSubmit={mockSubmit} />
      </QueryClientProvider>
    );

    const codeInput = screen.getByLabelText(/código del cupón/i);
    await user.type(codeInput, 'invalid code');

    const submitButton = screen.getByRole('button', { name: /crear cupón/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/solo mayúsculas/i)).toBeInTheDocument();
    });
  });

  it('converts code to uppercase', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <CouponForm onSubmit={mockSubmit} />
      </QueryClientProvider>
    );

    const codeInput = screen.getByLabelText(/código del cupón/i);
    await user.type(codeInput, 'verano2025');

    expect(codeInput).toHaveValue('VERANO2025');
  });

  it('validates percentage max value', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <CouponForm onSubmit={mockSubmit} />
      </QueryClientProvider>
    );

    const discountInput = screen.getByLabelText(/valor del descuento/i);
    await user.type(discountInput, '150');

    const submitButton = screen.getByRole('button', { name: /crear cupón/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/no puede ser mayor a 100/i)
      ).toBeInTheDocument();
    });
  });
});
```

---

## 🎨 Componentes shadcn/ui Adicionales

```bash
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add alert-dialog
```

---

## ✅ Checklist de Implementación Fase 12

### Hooks

- [ ] `useCouponAdmin.ts` - 8 hooks completos

### Componentes

- [ ] `CouponFilters.tsx` - Filtros por estado y tipo
- [ ] `CouponsTable.tsx` - Tabla con copiar código y acciones
- [ ] `CouponForm.tsx` - Formulario con validaciones Zod
- [ ] `CouponStats.tsx` - 4 métricas de cupones
- [ ] `CourseSelector.tsx` - Selector múltiple de cursos
- [ ] `CouponInput.tsx` - Input para checkout

### Páginas

- [ ] `app/admin/cupones/page.tsx` - Lista con stats y filtros
- [ ] `app/admin/cupones/nuevo/page.tsx` - Crear cupón
- [ ] `app/admin/cupones/[id]/editar/page.tsx` - Editar cupón

### Servicios

- [ ] couponsService completo con validación

### Backend

- [ ] Endpoint `/coupons/validate` implementado
- [ ] Endpoint `/coupons/stats` funcionando
- [ ] Validaciones de fecha y usos

### shadcn/ui

- [ ] Checkbox instalado
- [ ] AlertDialog instalado

### Testing

- [ ] Validación de formato de código
- [ ] Conversión a mayúsculas funciona
- [ ] Límite de porcentaje (100%)
- [ ] Validación en checkout

---

## 🐛 Troubleshooting

### Problema: Código no se convierte a mayúsculas

**Solución:**
Verificar que el `onChange` esté transformando el valor:

```typescript
onChange={(e) => {
  e.target.value = e.target.value.toUpperCase();
  register('code').onChange(e);
}}
```

### Problema: Cupón no se aplica en checkout

**Solución:**
Verificar que los `courseIds` se estén enviando correctamente en la validación.

---

## 📚 Recursos Adicionales

- [Zod - Custom Refinements](https://zod.dev/?id=refine)
- [React Hook Form - Conditional Validation](https://react-hook-form.com/advanced-usage#ConditionalValidation)
- [Coupon Best Practices](https://www.shopify.com/blog/discount-codes)

---

## 📝 Resumen de la Fase 12

En esta fase hemos creado:

✅ **Sistema completo de cupones** con validaciones avanzadas  
✅ **CouponForm** - Formulario con Zod, tipo porcentaje/fijo, límites  
✅ **CourseSelector** - Selector múltiple con búsqueda  
✅ **CouponStats** - Métricas de uso y descuentos  
✅ **CouponsTable** - Tabla con copiar código, toggle status  
✅ **Validación en checkout** - Input con aplicación en tiempo real  
✅ **Fechas de expiración** - Calendar picker con validación  
✅ **Límites de uso** - Global y por usuario  
✅ **Aplicabilidad** - Por curso específico o todos

**Resultado:** Sistema completo de cupones con validaciones robustas, estadísticas detalladas y aplicación flexible.

---

**¡Fase 12 completada! 🎉**

Ahora puedes crear cupones de descuento, validarlos en el checkout y monitorear su uso y efectividad.
