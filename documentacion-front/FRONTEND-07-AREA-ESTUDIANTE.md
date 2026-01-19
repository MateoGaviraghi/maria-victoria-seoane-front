# 👤 FASE 07 - Área de Estudiante

## 📋 Objetivos de esta Fase

En esta fase vamos a:

1. ✅ Crear la página de Mi Cuenta (perfil del usuario)
2. ✅ Crear la página de Mis Cursos (cursos comprados)
3. ✅ Crear la página de Mis Órdenes (historial de compras)
4. ✅ Crear componentes de perfil (ProfileForm, ChangePasswordForm)

**Nota:** Esta es la plataforma de **COMPRA** de cursos. El acceso real a los videos y contenido educativo estaría en una plataforma LMS separada (ej: `campus.mariavictoriaseoane.com`).

---

## 1️⃣ Página Mi Cuenta

### `src/app/(student)/mi-cuenta/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileForm from '@/components/forms/ProfileForm';
import ChangePasswordForm from '@/components/forms/ChangePasswordForm';
import { User, Lock, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MyAccountPage() {
  const { user, profile, isLoadingProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (isLoadingProfile) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Mi Cuenta</h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardContent className="flex items-center gap-6 p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {user?.firstName[0]}
              {user?.lastName[0]}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant={user?.emailVerified ? 'default' : 'secondary'}>
                  {user?.emailVerified ? (
                    <>
                      <Mail className="mr-1 h-3 w-3" />
                      Email Verificado
                    </>
                  ) : (
                    'Email No Verificado'
                  )}
                </Badge>
                <Badge variant="outline">{user?.subscriptionType}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="password">
              <Lock className="mr-2 h-4 w-4" />
              Seguridad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Actualiza tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm user={profile || user!} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cambiar Contraseña</CardTitle>
                <CardDescription>
                  Actualiza tu contraseña para mantener tu cuenta segura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChangePasswordForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
```

---

## 2️⃣ Componente ProfileForm

### `src/components/forms/ProfileForm.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, UpdateProfileFormData } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types/user';

interface ProfileFormProps {
  user: User;
}

const ProfileForm = ({ user }: ProfileFormProps) => {
  const { updateProfile, isUpdatingProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate || undefined,
    },
  });

  const onSubmit = (data: UpdateProfileFormData) => {
    updateProfile(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input id="firstName" {...register('firstName')} />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input id="lastName" {...register('lastName')} />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={user.email} disabled />
        <p className="text-sm text-muted-foreground">
          El email no se puede cambiar
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
        <Input id="birthDate" type="date" {...register('birthDate')} />
        {errors.birthDate && (
          <p className="text-sm text-destructive">{errors.birthDate.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isUpdatingProfile}>
        {isUpdatingProfile ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
    </form>
  );
};

export default ProfileForm;
```

---

## 3️⃣ Componente ChangePasswordForm

### `src/components/forms/ChangePasswordForm.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordFormData } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ChangePasswordForm = () => {
  const { changePassword, isChangingPassword } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Contraseña Actual</Label>
        <Input
          id="currentPassword"
          type="password"
          placeholder="••••••••"
          {...register('currentPassword')}
        />
        {errors.currentPassword && (
          <p className="text-sm text-destructive">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">Nueva Contraseña</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="••••••••"
          {...register('newPassword')}
        />
        {errors.newPassword && (
          <p className="text-sm text-destructive">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</Label>
        <Input
          id="confirmNewPassword"
          type="password"
          placeholder="••••••••"
          {...register('confirmNewPassword')}
        />
        {errors.confirmNewPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmNewPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isChangingPassword}>
        {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
```

---

## 4️⃣ Página Mis Cursos (Cursos Comprados)

### `src/app/(student)/mis-cursos/page.tsx`

```typescript
'use client';

import { useMyEnrollments } from '@/hooks/useEnrollments';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import EnrolledCourseCard from '@/components/curso/EnrolledCourseCard';
import { BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyCoursesPage() {
  const router = useRouter();
  const { enrollments, isLoading } = useMyEnrollments();

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="container py-12">
        <h1 className="mb-8 text-3xl font-bold">Mis Cursos</h1>
        <EmptyState
          icon={<BookOpen className="h-16 w-16" />}
          title="No tienes cursos aún"
          description="Comienza tu viaje de aprendizaje explorando nuestro catálogo de cursos"
          action={{
            label: 'Explorar Cursos',
            onClick: () => router.push('/cursos'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Mis Cursos</h1>
        <p className="text-muted-foreground">
          Tienes {enrollments.length} curso{enrollments.length !== 1 ? 's' : ''}{' '}
          adquirido{enrollments.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((enrollment) => (
          <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
        ))}
      </div>
    </div>
  );
}
```

---

## 5️⃣ Componente EnrolledCourseCard

### `src/components/curso/EnrolledCourseCard.tsx`

```typescript
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Enrollment } from '@/types/enrollment';
import { formatDate } from '@/lib/utils';

interface EnrolledCourseCardProps {
  enrollment: Enrollment;
}

const EnrolledCourseCard = ({ enrollment }: EnrolledCourseCardProps) => {
  const course = enrollment.course;

  if (!course) return null;

  const thumbnailUrl = course.thumbnail
    ? `${process.env.NEXT_PUBLIC_API_URL}${course.thumbnail}`
    : '/images/placeholder-course.jpg';

  // URL a la plataforma educativa externa
  const campusUrl = `https://campus.mariavictoriaseoane.com/curso/${course.id}`;

  const isCompleted = enrollment.progress === 100;

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image src={thumbnailUrl} alt={course.title} fill className="object-cover" />
        {isCompleted && (
          <div className="absolute right-2 top-2">
            <Badge className="bg-green-600">
              <CheckCircle className="mr-1 h-3 w-3" />
              Completado
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{course.title}</h3>

        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-medium">{enrollment.progress}%</span>
          </div>
          <Progress value={enrollment.progress} className="h-2" />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Inscrito el {formatDate(enrollment.enrolledAt)}</span>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <Button asChild className="w-full">
          <a href={campusUrl} target="_blank" rel="noopener noreferrer">
            Acceder al Curso
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EnrolledCourseCard;
```

---

## 6️⃣ Página Mis Órdenes (Historial de Compras)

### `src/app/(student)/mis-ordenes/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useMyOrders } from '@/hooks/useOrders';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import OrderCard from '@/components/order/OrderCard';
import Pagination from '@/components/common/Pagination';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyOrdersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { orders, meta, isLoading } = useMyOrders({ page, limit: 10 });

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container py-12">
        <h1 className="mb-8 text-3xl font-bold">Mis Órdenes</h1>
        <EmptyState
          icon={<ShoppingBag className="h-16 w-16" />}
          title="No tienes órdenes aún"
          description="Cuando realices una compra, aparecerá aquí tu historial"
          action={{
            label: 'Explorar Cursos',
            onClick: () => router.push('/cursos'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Mis Órdenes</h1>
        <p className="text-muted-foreground">
          Historial completo de tus compras
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
```

---

## 7️⃣ Componente OrderCard

### `src/components/order/OrderCard.tsx`

```typescript
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface OrderCardProps {
  order: Order;
}

const OrderStatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, { variant: any; label: string }> = {
    PENDING: { variant: 'secondary', label: 'Pendiente' },
    COMPLETED: { variant: 'default', label: 'Completado' },
    CANCELLED: { variant: 'destructive', label: 'Cancelado' },
  };

  const config = variants[status] || variants.PENDING;

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Order Info */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Orden</p>
                <p className="font-mono text-sm font-medium">#{order.id.slice(0, 8)}</p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p className="text-sm font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="mb-2 text-sm font-medium">
                {order.items?.length || 0} curso{order.items?.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-1">
                {order.items?.slice(0, 2).map((item) => (
                  <p key={item.id} className="line-clamp-1 text-sm text-muted-foreground">
                    • {item.course?.title}
                  </p>
                ))}
                {order.items && order.items.length > 2 && (
                  <p className="text-sm text-muted-foreground">
                    y {order.items.length - 2} más...
                  </p>
                )}
              </div>
            </div>

            {/* Prices */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total: </span>
                <span className="font-semibold">{formatCurrency(order.total)}</span>
              </div>
              {order.discount > 0 && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <div>
                    <span className="text-muted-foreground">Descuento: </span>
                    <span className="font-semibold text-green-600">
                      -{formatCurrency(order.discount)}
                    </span>
                  </div>
                </>
              )}
              <span className="text-muted-foreground">•</span>
              <div>
                <span className="text-muted-foreground">Final: </span>
                <span className="text-lg font-bold">{formatCurrency(order.finalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="flex-shrink-0">
            <Button variant="outline" asChild>
              <Link href={`/mis-ordenes/${order.id}`}>
                Ver Detalles
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
```

---

## 8️⃣ Página de Detalle de Orden

### `src/app/(student)/mis-ordenes/[id]/page.tsx`

```typescript
'use client';

import { use } from 'react';
import { useOrder } from '@/hooks/useOrders';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { order, isLoading, error } = useOrder(id);

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-12">
        <ErrorMessage message="No se pudo cargar la orden" />
      </div>
    );
  }

  const statusConfig: Record<string, { variant: any; label: string }> = {
    PENDING: { variant: 'secondary', label: 'Pendiente' },
    COMPLETED: { variant: 'default', label: 'Completado' },
    CANCELLED: { variant: 'destructive', label: 'Cancelado' },
  };

  const config = statusConfig[order.status] || statusConfig.PENDING;

  return (
    <div className="container py-12">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/mis-ordenes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Mis Órdenes
          </Link>
        </Button>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold">Orden #{order.id.slice(0, 8)}</h1>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
          <p className="text-muted-foreground">
            Realizada el {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Orden</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">ID de Orden</p>
                <p className="font-mono text-sm font-medium">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Método de Pago</p>
                <p className="text-sm font-medium">{order.paymentMethod}</p>
              </div>
              {order.mercadoPagoId && (
                <div>
                  <p className="text-sm text-muted-foreground">ID MercadoPago</p>
                  <p className="font-mono text-sm font-medium">
                    {order.mercadoPagoId}
                  </p>
                </div>
              )}
              {order.couponCode && (
                <div>
                  <p className="text-sm text-muted-foreground">Cupón Aplicado</p>
                  <Badge variant="outline">{order.couponCode}</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle>Cursos Adquiridos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items?.map((item) => {
                const course = item.course;
                if (!course) return null;

                const thumbnailUrl = course.thumbnail
                  ? `${process.env.NEXT_PUBLIC_API_URL}${course.thumbnail}`
                  : '/images/placeholder-course.jpg';

                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded">
                      <Image
                        src={thumbnailUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {course.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator className="my-6" />

            {/* Price Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.total)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Descuento</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total Pagado</span>
                <span>{formatCurrency(order.finalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## 🎯 Checklist de Verificación - Fase 7

Verificar que todos los archivos estén creados:

### Páginas

- [ ] `src/app/(student)/mi-cuenta/page.tsx`
- [ ] `src/app/(student)/mis-cursos/page.tsx`
- [ ] `src/app/(student)/mis-ordenes/page.tsx`
- [ ] `src/app/(student)/mis-ordenes/[id]/page.tsx`

### Componentes de Perfil

- [ ] `src/components/forms/ProfileForm.tsx`
- [ ] `src/components/forms/ChangePasswordForm.tsx`

### Componentes de Cursos

- [ ] `src/components/curso/EnrolledCourseCard.tsx`

### Componentes de Órdenes

- [ ] `src/components/order/OrderCard.tsx`

### Componentes UI Adicionales

- [ ] Verificar que `Progress` de shadcn/ui esté instalado: `npx shadcn-ui@latest add progress`

### Comandos para verificar:

```bash
# Agregar componente Progress si no lo tienes
npx shadcn-ui@latest add progress

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

1. **Página Mi Cuenta** con tabs para perfil y seguridad
2. **Formularios de Perfil** (actualizar datos personales y cambiar contraseña)
3. **Página Mis Cursos** mostrando cursos comprados con progreso
4. **Componente EnrolledCourseCard** con enlace a plataforma educativa externa
5. **Página Mis Órdenes** con historial de compras
6. **Página de Detalle de Orden** con información completa
7. **Componente OrderCard** para listar órdenes

Todo el área de estudiante está **completa y funcional** para gestionar cuenta y ver historial de compras.

---

## 💡 Notas Importantes

### Enlace a Plataforma Educativa

En el componente `EnrolledCourseCard.tsx`, el botón "Acceder al Curso" redirige a:

```typescript
const campusUrl = `https://campus.mariavictoriaseoane.com/curso/${course.id}`;
```

Esto asume que existe una **plataforma LMS separada** donde:

- Los usuarios se autentican con las mismas credenciales
- Pueden reproducir videos y ver el contenido completo
- Se trackea el progreso de cada lección

Si la plataforma educativa está en otro dominio, ajusta la URL según corresponda.

---

## 🚀 Siguiente Paso

Una vez completados todos los archivos de esta fase:

**✅ FASE 7 COMPLETA - Continuar con → [FASE 08 - Panel de Administración](./FRONTEND-08-PANEL-ADMIN.md)**
