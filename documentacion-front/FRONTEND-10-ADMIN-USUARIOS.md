# Fase 10: Gestión de Usuarios (Admin)

## 📋 Objetivos de esta Fase

En esta fase crearemos el **sistema completo de gestión de usuarios** para el panel admin:

- ✅ Lista de usuarios con filtros y búsqueda
- ✅ Ver detalle completo de usuario
- ✅ Crear nuevo usuario
- ✅ Editar usuario existente
- ✅ Asignar y cambiar roles
- ✅ Activar/desactivar usuarios
- ✅ Ver historial de compras del usuario
- ✅ Ver cursos enrollados del usuario
- ✅ Eliminar usuarios

---

## 🎯 Lo que Construiremos

### Páginas

1. **Lista de Usuarios** (`app/admin/usuarios/page.tsx`)
2. **Detalle de Usuario** (`app/admin/usuarios/[id]/page.tsx`)
3. **Crear Usuario** (`app/admin/usuarios/nuevo/page.tsx`)
4. **Editar Usuario** (`app/admin/usuarios/[id]/editar/page.tsx`)

### Componentes

1. **UsersTable** - Tabla de usuarios con acciones
2. **UserForm** - Formulario de usuario (crear/editar)
3. **UserFilters** - Filtros de búsqueda
4. **UserStats** - Estadísticas del usuario
5. **UserOrders** - Historial de órdenes
6. **UserCourses** - Cursos del usuario
7. **RoleSelector** - Selector de rol con descripción

---

## 📁 Estructura de Archivos

```
src/
├── app/
│   └── admin/
│       └── usuarios/
│           ├── page.tsx                      # ⭐ Lista de usuarios
│           ├── nuevo/
│           │   └── page.tsx                  # ⭐ Crear usuario
│           └── [id]/
│               ├── page.tsx                  # ⭐ Detalle de usuario
│               └── editar/
│                   └── page.tsx              # ⭐ Editar usuario
│
├── components/
│   └── admin/
│       └── users/
│           ├── UsersTable.tsx                # ⭐ Tabla de usuarios
│           ├── UserForm.tsx                  # ⭐ Formulario principal
│           ├── UserFilters.tsx               # ⭐ Filtros de búsqueda
│           ├── UserStats.tsx                 # ⭐ Estadísticas
│           ├── UserOrders.tsx                # ⭐ Historial de compras
│           ├── UserCourses.tsx               # ⭐ Cursos enrollados
│           └── RoleSelector.tsx              # ⭐ Selector de roles
│
└── lib/
    ├── hooks/
    │   └── useUsers.ts                       # Ya existe (Fase 3)
    └── validations/
        └── userSchemas.ts                    # Ya existe (Fase 2)
```

---

## 🔨 Implementación

### 1️⃣ Custom Hooks para Administración de Usuarios

**Archivo:** `src/lib/hooks/useUserAdmin.ts`

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/lib/services/usersService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

/**
 * Hook para obtener un usuario por ID
 */
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersService.getUserById(userId),
    enabled: !!userId,
  });
}

/**
 * Hook para obtener todos los usuarios (admin)
 */
export function useUsers(filters?: {
  search?: string;
  role?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersService.getUsers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para crear usuario
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: usersService.createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado exitosamente');
      router.push(`/admin/usuarios/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear el usuario');
    },
  });
}

/**
 * Hook para actualizar usuario
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      usersService.updateUser(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
      toast.success('Usuario actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al actualizar el usuario',
      );
    },
  });
}

/**
 * Hook para eliminar usuario
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: usersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario eliminado exitosamente');
      router.push('/admin/usuarios');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al eliminar el usuario',
      );
    },
  });
}

/**
 * Hook para toggle status del usuario
 */
export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      usersService.updateUser(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
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
 * Hook para cambiar rol del usuario
 */
export function useChangeUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      usersService.updateUser(id, { role }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
      toast.success('Rol actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al cambiar el rol');
    },
  });
}

/**
 * Hook para obtener órdenes de un usuario
 */
export function useUserOrders(userId: string) {
  return useQuery({
    queryKey: ['user-orders', userId],
    queryFn: () => usersService.getUserOrders(userId),
    enabled: !!userId,
  });
}

/**
 * Hook para obtener cursos enrollados de un usuario
 */
export function useUserEnrollments(userId: string) {
  return useQuery({
    queryKey: ['user-enrollments', userId],
    queryFn: () => usersService.getUserEnrollments(userId),
    enabled: !!userId,
  });
}
```

---

### 2️⃣ Componente UserFilters

**Archivo:** `src/components/admin/users/UserFilters.tsx`

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

interface UserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export default function UserFilters({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Role Filter */}
      <Select value={role} onValueChange={onRoleChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Todos los roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los roles</SelectItem>
          <SelectItem value="STUDENT">Estudiantes</SelectItem>
          <SelectItem value="OWNER">Propietarios</SelectItem>
          <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
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

### 3️⃣ Componente RoleSelector

**Archivo:** `src/components/admin/users/RoleSelector.tsx`

```typescript
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Crown } from 'lucide-react';

interface RoleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const roles = [
  {
    value: 'STUDENT',
    label: 'Estudiante',
    description: 'Puede comprar y acceder a cursos',
    icon: User,
    color: 'bg-blue-100 text-blue-800',
  },
  {
    value: 'OWNER',
    label: 'Propietario',
    description: 'Puede gestionar cursos y ver estadísticas',
    icon: Shield,
    color: 'bg-purple-100 text-purple-800',
  },
  {
    value: 'SUPER_ADMIN',
    label: 'Super Admin',
    description: 'Acceso total al sistema',
    icon: Crown,
    color: 'bg-red-100 text-red-800',
  },
];

export default function RoleSelector({
  value,
  onChange,
  disabled,
}: RoleSelectorProps) {
  const selectedRole = roles.find((r) => r.value === value);

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue>
            {selectedRole && (
              <div className="flex items-center gap-2">
                <selectedRole.icon className="h-4 w-4" />
                <span>{selectedRole.label}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <SelectItem key={role.value} value={role.value}>
                <div className="flex items-start gap-3 py-2">
                  <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{role.label}</p>
                      <Badge className={role.color} variant="secondary">
                        {role.value}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {role.description}
                    </p>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {selectedRole && (
        <p className="text-sm text-muted-foreground">
          {selectedRole.description}
        </p>
      )}
    </div>
  );
}
```

---

### 4️⃣ Componente UsersTable

**Archivo:** `src/components/admin/users/UsersTable.tsx`

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '@/lib/types/user';
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
import { MoreVertical, Edit, Trash, Eye, Power, Shield } from 'lucide-react';
import { useDeleteUser, useToggleUserStatus } from '@/lib/hooks/useUserAdmin';
import { formatDate } from '@/lib/utils';

interface UsersTableProps {
  users: User[];
}

const roleConfig = {
  STUDENT: { label: 'Estudiante', color: 'bg-blue-100 text-blue-800' },
  OWNER: { label: 'Propietario', color: 'bg-purple-100 text-purple-800' },
  SUPER_ADMIN: { label: 'Super Admin', color: 'bg-red-100 text-red-800' },
};

export default function UsersTable({ users }: UsersTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();

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

  if (users.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No se encontraron usuarios</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Avatar</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Registrado</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const role = roleConfig[user.role as keyof typeof roleConfig];
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.firstName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold">
                          {user.firstName[0]}
                          {user.lastName?.[0]}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      {user.phone && (
                        <p className="text-sm text-muted-foreground">
                          {user.phone}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm">{user.email}</code>
                  </TableCell>
                  <TableCell>
                    <Badge className={role?.color}>{role?.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
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
                          <Link href={`/admin/usuarios/${user.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalle
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/usuarios/${user.id}/editar`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleToggleStatus(user.id, user.isActive)
                          }
                        >
                          <Power className="mr-2 h-4 w-4" />
                          {user.isActive ? 'Desactivar' : 'Activar'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(user.id)}
                          className="text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
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
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El usuario será eliminado
              permanentemente junto con todo su historial.
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

### 5️⃣ Componente UserForm

**Archivo:** `src/components/admin/users/UserForm.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import RoleSelector from './RoleSelector';
import { User } from '@/lib/types/user';
import { Loader2 } from 'lucide-react';

const userSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .optional()
    .or(z.literal('')),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  role: z.enum(['STUDENT', 'OWNER', 'SUPER_ADMIN']),
  isActive: z.boolean().default(true),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function UserForm({ user, onSubmit, isLoading }: UserFormProps) {
  const isEditing = !!user;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: user?.email || '',
      password: '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      role: user?.role || 'STUDENT',
      isActive: user?.isActive ?? true,
    },
  });

  const handleSubmit = async (data: UserFormData) => {
    try {
      // Si estamos editando y no hay password, no lo enviamos
      if (isEditing && !data.password) {
        const { password, ...dataWithoutPassword } = data;
        await onSubmit(dataWithoutPassword as UserFormData);
      } else {
        await onSubmit(data);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card className="p-6 space-y-6">
          {/* Grid: Nombre y Apellido */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Juan" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Pérez" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="juan@ejemplo.com"
                    disabled={isEditing}
                  />
                </FormControl>
                {isEditing && (
                  <FormDescription>
                    El email no se puede cambiar una vez creado
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isEditing ? 'Nueva Contraseña' : 'Contraseña *'}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder={isEditing ? 'Dejar vacío para no cambiar' : '••••••'}
                  />
                </FormControl>
                {isEditing && (
                  <FormDescription>
                    Dejar vacío para mantener la contraseña actual
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Teléfono */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="+54 9 11 1234-5678" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rol */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol del Usuario *</FormLabel>
                <FormControl>
                  <RoleSelector value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Estado Activo */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Usuario Activo</FormLabel>
                  <FormDescription>
                    Los usuarios inactivos no pueden iniciar sesión
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
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

---

### 6️⃣ Página Lista de Usuarios

**Archivo:** `src/app/admin/usuarios/page.tsx`

```typescript
'use client';

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import UsersTable from '@/components/admin/users/UsersTable';
import UserFilters from '@/components/admin/users/UserFilters';
import { useUsers } from '@/lib/hooks/useUserAdmin';
import { Skeleton } from '@/components/ui/skeleton';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');

  const { data: users, isLoading } = useUsers();

  // Filtrar usuarios
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user) => {
      // Filtro de búsqueda
      const searchLower = search.toLowerCase();
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);

      // Filtro de rol
      const matchesRole = role === 'all' || user.role === role;

      // Filtro de estado
      const matchesStatus =
        status === 'all' ||
        (status === 'active' && user.isActive) ||
        (status === 'inactive' && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, role, status]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona todos los usuarios de la plataforma
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/usuarios/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Crear Usuario
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <UserFilters
          search={search}
          onSearchChange={setSearch}
          role={role}
          onRoleChange={setRole}
          status={status}
          onStatusChange={setStatus}
        />
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total de Usuarios</p>
          <p className="text-2xl font-bold">{users?.length || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Estudiantes</p>
          <p className="text-2xl font-bold">
            {users?.filter((u) => u.role === 'STUDENT').length || 0}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Activos</p>
          <p className="text-2xl font-bold">
            {users?.filter((u) => u.isActive).length || 0}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Resultados</p>
          <p className="text-2xl font-bold">{filteredUsers.length}</p>
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
        <UsersTable users={filteredUsers} />
      )}
    </div>
  );
}
```

---

### 7️⃣ Página Crear Usuario

**Archivo:** `src/app/admin/usuarios/nuevo/page.tsx`

```typescript
'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import UserForm from '@/components/admin/users/UserForm';
import { useCreateUser } from '@/lib/hooks/useUserAdmin';

export default function CreateUserPage() {
  const createMutation = useCreateUser();

  const handleSubmit = async (data: any) => {
    await createMutation.mutateAsync(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/usuarios">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Crear Nuevo Usuario</h1>
          <p className="text-muted-foreground mt-1">
            Completa la información del usuario
          </p>
        </div>
      </div>

      {/* Form */}
      <UserForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
    </div>
  );
}
```

---

### 8️⃣ Página Editar Usuario

**Archivo:** `src/app/admin/usuarios/[id]/editar/page.tsx`

```typescript
'use client';

import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import UserForm from '@/components/admin/users/UserForm';
import { useUser, useUpdateUser } from '@/lib/hooks/useUserAdmin';

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading } = useUser(userId);
  const updateMutation = useUpdateUser();

  const handleSubmit = async (data: any) => {
    await updateMutation.mutateAsync({ id: userId, data });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Usuario no encontrado</h2>
        <p className="text-muted-foreground mt-2">
          El usuario que buscas no existe o fue eliminado
        </p>
        <Button asChild className="mt-4">
          <Link href="/admin/usuarios">Volver a usuarios</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/usuarios">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Usuario</h1>
          <p className="text-muted-foreground mt-1">
            {user.firstName} {user.lastName}
          </p>
        </div>
      </div>

      {/* Form */}
      <UserForm
        user={user}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
```

---

### 9️⃣ Componente UserStats

**Archivo:** `src/components/admin/users/UserStats.tsx`

```typescript
'use client';

import { Card } from '@/components/ui/card';
import { DollarSign, ShoppingCart, BookOpen, Trophy } from 'lucide-react';

interface UserStatsProps {
  stats: {
    totalSpent: number;
    totalOrders: number;
    coursesEnrolled: number;
    coursesCompleted: number;
  };
}

export default function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full p-3 bg-green-100">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Gastado</p>
            <p className="text-2xl font-bold">
              ${stats.totalSpent.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full p-3 bg-blue-100">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Órdenes</p>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full p-3 bg-purple-100">
            <BookOpen className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cursos</p>
            <p className="text-2xl font-bold">{stats.coursesEnrolled}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full p-3 bg-orange-100">
            <Trophy className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completados</p>
            <p className="text-2xl font-bold">{stats.coursesCompleted}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
```

---

### 🔟 Componente UserOrders

**Archivo:** `src/components/admin/users/UserOrders.tsx`

```typescript
'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
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
import { Eye, Loader2 } from 'lucide-react';
import { useUserOrders } from '@/lib/hooks/useUserAdmin';
import { formatDate } from '@/lib/utils';

interface UserOrdersProps {
  userId: string;
}

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Completado', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Fallido', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Reembolsado', color: 'bg-gray-100 text-gray-800' },
};

export default function UserOrders({ userId }: UserOrdersProps) {
  const { data: orders, isLoading } = useUserOrders(userId);

  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Historial de Órdenes</h3>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Historial de Órdenes</h3>
        <p className="text-center py-12 text-muted-foreground">
          Este usuario aún no tiene órdenes
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Historial de Órdenes</h3>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Orden</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[80px]">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig];
              return (
                <TableRow key={order.id}>
                  <TableCell>
                    <code className="text-sm">#{order.orderNumber}</code>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>{order.items.length} cursos</TableCell>
                  <TableCell className="font-semibold">
                    ${order.total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={status.color}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/ordenes/${order.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
```

---

### 1️⃣1️⃣ Componente UserCourses

**Archivo:** `src/components/admin/users/UserCourses.tsx`

```typescript
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, ExternalLink } from 'lucide-react';
import { useUserEnrollments } from '@/lib/hooks/useUserAdmin';

interface UserCoursesProps {
  userId: string;
}

export default function UserCourses({ userId }: UserCoursesProps) {
  const { data: enrollments, isLoading } = useUserEnrollments(userId);

  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cursos Enrollados</h3>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cursos Enrollados</h3>
        <p className="text-center py-12 text-muted-foreground">
          Este usuario aún no tiene cursos
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Cursos Enrollados</h3>

      <div className="space-y-4">
        {enrollments.map((enrollment) => (
          <div
            key={enrollment.id}
            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            {/* Thumbnail */}
            <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden">
              <Image
                src={enrollment.course.thumbnail || '/placeholder-course.jpg'}
                alt={enrollment.course.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Link
                  href={`/admin/cursos/${enrollment.course.id}/editar`}
                  className="font-medium hover:underline line-clamp-1"
                >
                  {enrollment.course.title}
                </Link>
                <Badge
                  variant={enrollment.isCompleted ? 'default' : 'secondary'}
                >
                  {enrollment.isCompleted ? 'Completado' : 'En progreso'}
                </Badge>
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-medium">{enrollment.progress}%</span>
                </div>
                <Progress value={enrollment.progress} />
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>
                  Enrollado: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </span>
                {enrollment.lastAccessedAt && (
                  <span>
                    Último acceso:{' '}
                    {new Date(enrollment.lastAccessedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Link */}
            <Link
              href={`/cursos/${enrollment.course.slug}`}
              target="_blank"
              className="flex-shrink-0"
            >
              <ExternalLink className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Link>
          </div>
        ))}
      </div>
    </Card>
  );
}
```

---

### 1️⃣2️⃣ Página Detalle de Usuario

**Archivo:** `src/app/admin/usuarios/[id]/page.tsx`

```typescript
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Edit, Mail, Phone, Calendar, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import UserStats from '@/components/admin/users/UserStats';
import UserOrders from '@/components/admin/users/UserOrders';
import UserCourses from '@/components/admin/users/UserCourses';
import { useUser } from '@/lib/hooks/useUserAdmin';
import { formatDate } from '@/lib/utils';

const roleConfig = {
  STUDENT: { label: 'Estudiante', color: 'bg-blue-100 text-blue-800' },
  OWNER: { label: 'Propietario', color: 'bg-purple-100 text-purple-800' },
  SUPER_ADMIN: { label: 'Super Admin', color: 'bg-red-100 text-red-800' },
};

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading } = useUser(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Usuario no encontrado</h2>
        <p className="text-muted-foreground mt-2">
          El usuario que buscas no existe o fue eliminado
        </p>
        <Button asChild className="mt-4">
          <Link href="/admin/usuarios">Volver a usuarios</Link>
        </Button>
      </div>
    );
  }

  const role = roleConfig[user.role as keyof typeof roleConfig];

  // Mock stats - en producción vendrían del backend
  const stats = {
    totalSpent: user.totalSpent || 0,
    totalOrders: user._count?.orders || 0,
    coursesEnrolled: user._count?.enrollments || 0,
    coursesCompleted: user.coursesCompleted || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/usuarios">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Detalle de Usuario</h1>
          <p className="text-muted-foreground mt-1">
            Información completa y actividad
          </p>
        </div>
        <Button asChild>
          <Link href={`/admin/usuarios/${user.id}/editar`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Usuario
          </Link>
        </Button>
      </div>

      {/* User Info Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.firstName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                  {user.firstName[0]}
                  {user.lastName?.[0]}
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <Badge className={role.color}>{role.label}</Badge>
                <Badge variant={user.isActive ? 'default' : 'secondary'}>
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              {user.bio && (
                <p className="text-muted-foreground">{user.bio}</p>
              )}
            </div>

            <Separator />

            <div className="grid gap-3 md:grid-cols-2">
              {/* Email */}
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <code className="text-sm">{user.email}</code>
              </div>

              {/* Phone */}
              {user.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Teléfono:</span>
                  <span>{user.phone}</span>
                </div>
              )}

              {/* Role */}
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Rol:</span>
                <span>{role.label}</span>
              </div>

              {/* Created */}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Registrado:</span>
                <span>{formatDate(user.createdAt)}</span>
              </div>
            </div>

            {/* Additional Info */}
            {user.address && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-1">Dirección</p>
                  <p className="text-sm text-muted-foreground">
                    {user.address}
                    {user.city && `, ${user.city}`}
                    {user.country && `, ${user.country}`}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <UserStats stats={stats} />

      {/* Orders */}
      <UserOrders userId={user.id} />

      {/* Courses */}
      <UserCourses userId={user.id} />
    </div>
  );
}
```

---

## 🔗 Actualizar Servicio de Usuarios

Verificar que el servicio de usuarios tenga todos los métodos necesarios:

**Archivo:** `src/lib/services/usersService.ts` (agregar si faltan)

```typescript
// Agregar estos métodos si no existen

/**
 * Obtener todos los usuarios (admin)
 */
async getUsers(filters?: {
  search?: string;
  role?: string;
  status?: string;
}): Promise<User[]> {
  const response: AxiosResponse<User[]> = await api.get('/users', {
    params: filters,
  });
  return response.data;
}

/**
 * Obtener usuario por ID
 */
async getUserById(id: string): Promise<User> {
  const response: AxiosResponse<User> = await api.get(`/users/${id}`);
  return response.data;
}

/**
 * Crear usuario (admin)
 */
async createUser(data: CreateUserDto): Promise<User> {
  const response: AxiosResponse<User> = await api.post('/users', data);
  return response.data;
}

/**
 * Actualizar usuario
 */
async updateUser(id: string, data: Partial<User>): Promise<User> {
  const response: AxiosResponse<User> = await api.patch(`/users/${id}`, data);
  return response.data;
}

/**
 * Eliminar usuario
 */
async deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}

/**
 * Obtener órdenes de un usuario
 */
async getUserOrders(userId: string): Promise<Order[]> {
  const response: AxiosResponse<Order[]> = await api.get(
    `/users/${userId}/orders`
  );
  return response.data;
}

/**
 * Obtener enrollments de un usuario
 */
async getUserEnrollments(userId: string): Promise<Enrollment[]> {
  const response: AxiosResponse<Enrollment[]> = await api.get(
    `/users/${userId}/enrollments`
  );
  return response.data;
}
```

---

## 🎨 Componentes shadcn/ui Adicionales

Instalar componentes que puedan faltar:

```bash
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add progress
```

---

## 🧪 Testing

### Test del Formulario de Usuario

**Archivo:** `src/components/admin/users/__tests__/UserForm.test.tsx`

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserForm from '../UserForm';

const queryClient = new QueryClient();

describe('UserForm', () => {
  it('renders form fields', () => {
    const mockSubmit = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <UserForm onSubmit={mockSubmit} />
      </QueryClientProvider>
    );

    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rol/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <UserForm onSubmit={mockSubmit} />
      </QueryClientProvider>
    );

    const submitButton = screen.getByRole('button', { name: /crear usuario/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el nombre debe tener/i)).toBeInTheDocument();
    });
  });

  it('does not require password when editing', () => {
    const mockSubmit = jest.fn();
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'STUDENT',
      isActive: true,
    };

    render(
      <QueryClientProvider client={queryClient}>
        <UserForm user={mockUser} onSubmit={mockSubmit} />
      </QueryClientProvider>
    );

    expect(screen.getByText(/dejar vacío/i)).toBeInTheDocument();
  });
});
```

---

## ✅ Checklist de Implementación Fase 10

### Hooks

- [ ] `useUserAdmin.ts` - 8 hooks para gestión de usuarios

### Componentes

- [ ] `UserFilters.tsx` - Filtros de búsqueda
- [ ] `RoleSelector.tsx` - Selector de roles con descripción
- [ ] `UsersTable.tsx` - Tabla con acciones
- [ ] `UserForm.tsx` - Formulario crear/editar
- [ ] `UserStats.tsx` - Tarjetas de estadísticas
- [ ] `UserOrders.tsx` - Historial de órdenes
- [ ] `UserCourses.tsx` - Cursos con progreso

### Páginas

- [ ] `app/admin/usuarios/page.tsx` - Lista de usuarios
- [ ] `app/admin/usuarios/nuevo/page.tsx` - Crear usuario
- [ ] `app/admin/usuarios/[id]/page.tsx` - Detalle de usuario
- [ ] `app/admin/usuarios/[id]/editar/page.tsx` - Editar usuario

### Servicios

- [ ] Métodos de usuarios en usersService
- [ ] getUserOrders implementado
- [ ] getUserEnrollments implementado

### shadcn/ui

- [ ] Separator instalado
- [ ] Progress instalado

### Testing

- [ ] Formulario se renderiza
- [ ] Validaciones funcionan
- [ ] Filtros funcionan
- [ ] CRUD completo funcional
- [ ] Cambio de rol funciona
- [ ] Toggle status funciona

---

## 🐛 Troubleshooting

### Problema: No se muestran las órdenes del usuario

**Solución:**
Verificar que el backend retorne las órdenes con el endpoint `/users/:id/orders`

### Problema: Progress bar no se muestra

**Solución:**

```bash
npx shadcn-ui@latest add progress
```

### Problema: Email no editable

**Solución:**
Esto es intencional por seguridad. El email se usa como identificador único.

---

## 📚 Recursos Adicionales

- [React Hook Form - Conditional Fields](https://react-hook-form.com/advanced-usage#ConditionalFields)
- [shadcn/ui - Progress](https://ui.shadcn.com/docs/components/progress)
- [Next.js - Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)

---

## 📝 Resumen de la Fase 10

En esta fase hemos creado:

✅ **Sistema completo de gestión de usuarios** con CRUD  
✅ **RoleSelector** con descripción visual de cada rol  
✅ **Filtros avanzados** por nombre, email, rol y estado  
✅ **Página de detalle** con avatar, info completa, estadísticas  
✅ **UserStats** - 4 métricas clave del usuario  
✅ **UserOrders** - Historial completo de compras  
✅ **UserCourses** - Cursos con barra de progreso  
✅ **Toggle status** y cambio de rol directo  
✅ **Validaciones** con password opcional en edición

**Resultado:** Panel completo de administración de usuarios con visualización detallada de actividad, compras y progreso en cursos.

---

**¡Fase 10 completada! 🎉**

Ahora puedes gestionar todos los usuarios de la plataforma, ver su actividad, cambiar roles y monitorear su progreso.
