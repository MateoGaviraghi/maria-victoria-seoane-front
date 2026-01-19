# Fase 8: Panel de Administración

## 📋 Objetivos de esta Fase

En esta fase crearemos el **Panel de Administración** con un dashboard completo que incluye:

- ✅ Dashboard con estadísticas principales
- ✅ Gráficos de ventas e ingresos
- ✅ Últimas órdenes
- ✅ Cursos más vendidos
- ✅ Componentes de estadísticas reutilizables
- ✅ Protección de rutas administrativas
- ✅ Layout admin con navegación

---

## 🎯 Lo que Construiremos

### Páginas

1. **Dashboard Admin** (`app/admin/page.tsx`)

### Componentes

1. **StatCard** - Tarjeta de estadística con icono
2. **RevenueChart** - Gráfico de ingresos (Recharts)
3. **RecentOrders** - Lista de últimas órdenes
4. **TopCourses** - Cursos más vendidos
5. **AdminHeader** - Header específico del admin

### Middleware

1. **Protección de rutas admin** (`middleware.ts`)

---

## 📁 Estructura de Archivos

```
src/
├── app/
│   └── admin/
│       ├── layout.tsx                    # Layout admin (ya existe de Fase 4)
│       └── page.tsx                      # ⭐ Dashboard principal
│
├── components/
│   └── admin/
│       ├── StatCard.tsx                  # ⭐ Tarjeta de estadística
│       ├── RevenueChart.tsx              # ⭐ Gráfico de ingresos
│       ├── RecentOrders.tsx              # ⭐ Últimas órdenes
│       ├── TopCourses.tsx                # ⭐ Cursos más vendidos
│       └── AdminHeader.tsx               # ⭐ Header del dashboard
│
├── lib/
│   └── services/
│       └── statsService.ts               # ⭐ Servicio de estadísticas (ya existe de Fase 2)
│
└── middleware.ts                         # ⭐ Protección de rutas
```

---

## 🔨 Implementación

### 1️⃣ Servicio de Estadísticas

Ya tenemos `statsService.ts` de la Fase 2, pero vamos a verificar que tenga todo lo necesario:

**Archivo:** `src/lib/services/statsService.ts`

```typescript
import api from './axios';
import { AxiosResponse } from 'axios';

// Tipos para estadísticas
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalStudents: number;
  totalCourses: number;
  revenueGrowth: number;
  ordersGrowth: number;
  studentsGrowth: number;
  coursesGrowth: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopCourseData {
  id: string;
  title: string;
  thumbnail: string;
  totalSales: number;
  revenue: number;
  enrollments: number;
}

export interface RecentOrderData {
  id: string;
  orderNumber: string;
  studentName: string;
  studentEmail: string;
  total: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  items: number;
}

export interface StatsFilters {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}

class StatsService {
  /**
   * Obtener estadísticas generales del dashboard
   */
  async getDashboardStats(filters?: StatsFilters): Promise<DashboardStats> {
    const response: AxiosResponse<DashboardStats> = await api.get(
      '/stats/dashboard',
      {
        params: filters,
      },
    );
    return response.data;
  }

  /**
   * Obtener datos de ingresos por período
   */
  async getRevenueData(filters?: StatsFilters): Promise<RevenueData[]> {
    const response: AxiosResponse<RevenueData[]> = await api.get(
      '/stats/revenue',
      {
        params: filters,
      },
    );
    return response.data;
  }

  /**
   * Obtener cursos más vendidos
   */
  async getTopCourses(limit: number = 5): Promise<TopCourseData[]> {
    const response: AxiosResponse<TopCourseData[]> = await api.get(
      '/stats/top-courses',
      {
        params: { limit },
      },
    );
    return response.data;
  }

  /**
   * Obtener últimas órdenes
   */
  async getRecentOrders(limit: number = 10): Promise<RecentOrderData[]> {
    const response: AxiosResponse<RecentOrderData[]> = await api.get(
      '/stats/recent-orders',
      {
        params: { limit },
      },
    );
    return response.data;
  }

  /**
   * Exportar estadísticas a Excel
   */
  async exportStats(filters?: StatsFilters): Promise<Blob> {
    const response: AxiosResponse<Blob> = await api.get('/stats/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  }
}

export const statsService = new StatsService();
export default statsService;
```

---

### 2️⃣ Custom Hooks para Estadísticas

**Archivo:** `src/lib/hooks/useStats.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { statsService, StatsFilters } from '@/lib/services/statsService';

/**
 * Hook para obtener estadísticas del dashboard
 */
export function useDashboardStats(filters?: StatsFilters) {
  return useQuery({
    queryKey: ['dashboard-stats', filters],
    queryFn: () => statsService.getDashboardStats(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obtener datos de ingresos
 */
export function useRevenueData(filters?: StatsFilters) {
  return useQuery({
    queryKey: ['revenue-data', filters],
    queryFn: () => statsService.getRevenueData(filters),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para obtener cursos más vendidos
 */
export function useTopCourses(limit: number = 5) {
  return useQuery({
    queryKey: ['top-courses', limit],
    queryFn: () => statsService.getTopCourses(limit),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para obtener últimas órdenes
 */
export function useRecentOrders(limit: number = 10) {
  return useQuery({
    queryKey: ['recent-orders', limit],
    queryFn: () => statsService.getRecentOrders(limit),
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 30 * 1000, // Refetch cada 30 segundos
  });
}
```

---

### 3️⃣ Componente StatCard

**Archivo:** `src/components/admin/StatCard.tsx`

```typescript
'use client';

import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  iconColor?: string;
  iconBgColor?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100',
}: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{value}</h3>
            {trend && (
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        <div className={cn('rounded-full p-3', iconBgColor)}>
          <Icon className={cn('h-6 w-6', iconColor)} />
        </div>
      </div>
    </Card>
  );
}
```

---

### 4️⃣ Componente RevenueChart

Primero, instala Recharts si no lo tienes:

```bash
npm install recharts
```

**Archivo:** `src/components/admin/RevenueChart.tsx`

```typescript
'use client';

import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { RevenueData } from '@/lib/services/statsService';
import { Loader2 } from 'lucide-react';

interface RevenueChartProps {
  data: RevenueData[];
  isLoading?: boolean;
}

export default function RevenueChart({ data, isLoading }: RevenueChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ingresos del Período</h3>
        <div className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ingresos del Período</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No hay datos disponibles</p>
        </div>
      </Card>
    );
  }

  // Formatear datos para el gráfico
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
    }),
    revenue: item.revenue,
    orders: item.orders,
  }));

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Ingresos del Período</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-muted-foreground">Ingresos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-muted-foreground">Órdenes</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e0e0e0' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'revenue') {
                return [`$${value.toLocaleString()}`, 'Ingresos'];
              }
              return [value, 'Órdenes'];
            }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
```

---

### 5️⃣ Componente RecentOrders

**Archivo:** `src/components/admin/RecentOrders.tsx`

```typescript
'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RecentOrderData } from '@/lib/services/statsService';
import { ArrowRight, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface RecentOrdersProps {
  orders: RecentOrderData[];
  isLoading?: boolean;
}

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Completado', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Fallido', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Reembolsado', color: 'bg-gray-100 text-gray-800' },
};

export default function RecentOrders({ orders, isLoading }: RecentOrdersProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Últimas Órdenes</h3>
        <div className="h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Últimas Órdenes</h3>
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">No hay órdenes recientes</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Últimas Órdenes</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/ordenes">
            Ver todas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusConfig[order.status];
          return (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    href={`/admin/ordenes/${order.id}`}
                    className="font-medium hover:underline"
                  >
                    #{order.orderNumber}
                  </Link>
                  <Badge className={status.color}>{status.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {order.studentName} • {order.studentEmail}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(order.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
              </div>

              <div className="text-right ml-4">
                <p className="font-semibold">${order.total.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {order.items} {order.items === 1 ? 'curso' : 'cursos'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
```

---

### 6️⃣ Componente TopCourses

**Archivo:** `src/components/admin/TopCourses.tsx`

```typescript
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TopCourseData } from '@/lib/services/statsService';
import { ArrowRight, Loader2, TrendingUp, Users } from 'lucide-react';

interface TopCoursesProps {
  courses: TopCourseData[];
  isLoading?: boolean;
}

export default function TopCourses({ courses, isLoading }: TopCoursesProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cursos Más Vendidos</h3>
        <div className="h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cursos Más Vendidos</h3>
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">No hay datos disponibles</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Cursos Más Vendidos</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/cursos">
            Ver todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            {/* Ranking */}
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 text-primary font-bold rounded-full">
              {index + 1}
            </div>

            {/* Thumbnail */}
            <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
              <Image
                src={course.thumbnail || '/placeholder-course.jpg'}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/admin/cursos/${course.id}`}
                className="font-medium hover:underline line-clamp-1"
              >
                {course.title}
              </Link>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{course.enrollments} estudiantes</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{course.totalSales} ventas</span>
                </div>
              </div>
            </div>

            {/* Revenue */}
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-green-600">
                ${course.revenue.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">ingresos</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
```

---

### 7️⃣ Componente AdminHeader

**Archivo:** `src/components/admin/AdminHeader.tsx`

```typescript
'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { CalendarDays } from 'lucide-react';

export default function AdminHeader() {
  const user = useAuthStore((state) => state.user);

  const currentDate = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">
        Hola, {user?.firstName || 'Admin'} 👋
      </h1>
      <div className="flex items-center gap-2 mt-2 text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
        <p className="text-sm capitalize">{currentDate}</p>
      </div>
    </div>
  );
}
```

---

### 8️⃣ Página del Dashboard

**Archivo:** `src/app/admin/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import StatCard from '@/components/admin/StatCard';
import RevenueChart from '@/components/admin/RevenueChart';
import RecentOrders from '@/components/admin/RecentOrders';
import TopCourses from '@/components/admin/TopCourses';
import {
  useDashboardStats,
  useRevenueData,
  useRecentOrders,
  useTopCourses,
} from '@/lib/hooks/useStats';
import { DollarSign, ShoppingCart, Users, BookOpen } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatsFilters } from '@/lib/services/statsService';

export default function AdminDashboard() {
  const [period, setPeriod] = useState<StatsFilters['period']>('month');

  // Queries
  const { data: stats, isLoading: statsLoading } = useDashboardStats({ period });
  const { data: revenueData, isLoading: revenueLoading } = useRevenueData({ period });
  const { data: recentOrders, isLoading: ordersLoading } = useRecentOrders(10);
  const { data: topCourses, isLoading: coursesLoading } = useTopCourses(5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <AdminHeader />

        <Select
          value={period}
          onValueChange={(value) => setPeriod(value as StatsFilters['period'])}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Hoy</SelectItem>
            <SelectItem value="week">Esta semana</SelectItem>
            <SelectItem value="month">Este mes</SelectItem>
            <SelectItem value="year">Este año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ingresos Totales"
          value={`$${stats?.totalRevenue.toLocaleString() || '0'}`}
          icon={DollarSign}
          trend={
            stats
              ? {
                  value: stats.revenueGrowth,
                  isPositive: stats.revenueGrowth >= 0,
                }
              : undefined
          }
          description="vs. período anterior"
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />

        <StatCard
          title="Órdenes"
          value={stats?.totalOrders.toLocaleString() || '0'}
          icon={ShoppingCart}
          trend={
            stats
              ? {
                  value: stats.ordersGrowth,
                  isPositive: stats.ordersGrowth >= 0,
                }
              : undefined
          }
          description="vs. período anterior"
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />

        <StatCard
          title="Estudiantes"
          value={stats?.totalStudents.toLocaleString() || '0'}
          icon={Users}
          trend={
            stats
              ? {
                  value: stats.studentsGrowth,
                  isPositive: stats.studentsGrowth >= 0,
                }
              : undefined
          }
          description="vs. período anterior"
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />

        <StatCard
          title="Cursos Activos"
          value={stats?.totalCourses.toLocaleString() || '0'}
          icon={BookOpen}
          trend={
            stats
              ? {
                  value: stats.coursesGrowth,
                  isPositive: stats.coursesGrowth >= 0,
                }
              : undefined
          }
          description="vs. período anterior"
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* Revenue Chart */}
      <RevenueChart data={revenueData || []} isLoading={revenueLoading} />

      {/* Recent Orders & Top Courses */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RecentOrders orders={recentOrders || []} isLoading={ordersLoading} />
        <TopCourses courses={topCourses || []} isLoading={coursesLoading} />
      </div>
    </div>
  );
}
```

---

### 9️⃣ Middleware para Protección de Rutas

**Archivo:** `middleware.ts` (en la raíz del proyecto)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isAuthRoute =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/registro');

  // Redirigir a login si no hay token y se intenta acceder a rutas protegidas
  if (!token && isAdminRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si hay token y está en rutas de auth, redirigir al dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/registro',
    '/mi-cuenta/:path*',
    '/mis-cursos/:path*',
    '/mis-ordenes/:path*',
  ],
};
```

---

### 🔟 Actualizar Layout Admin

Verificar que el layout admin esté correctamente configurado (ya lo creamos en Fase 4):

**Archivo:** `src/app/admin/layout.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import Sidebar from '@/components/layout/Sidebar';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }

    // Verificar que el usuario tenga rol de admin
    if (user && !['SUPER_ADMIN', 'OWNER'].includes(user.role)) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !['SUPER_ADMIN', 'OWNER'].includes(user.role)) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <DashboardNavbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30 p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
```

---

## 📊 Integración con Backend

El backend debe tener estos endpoints en el controlador de estadísticas:

```typescript
// Backend endpoints necesarios
GET /api/stats/dashboard?period=month
GET /api/stats/revenue?period=month
GET /api/stats/top-courses?limit=5
GET /api/stats/recent-orders?limit=10
GET /api/stats/export?period=month
```

**Ejemplo de respuesta de `/api/stats/dashboard`:**

```json
{
  "totalRevenue": 125000,
  "totalOrders": 342,
  "totalStudents": 1823,
  "totalCourses": 45,
  "revenueGrowth": 15.5,
  "ordersGrowth": 8.2,
  "studentsGrowth": 12.3,
  "coursesGrowth": 2.1
}
```

---

## 🎨 Estilos y Componentes shadcn/ui Necesarios

Asegúrate de tener instalados estos componentes de shadcn/ui:

```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add button
npx shadcn-ui@latest add select
```

---

## 🧪 Testing del Dashboard

### Verificación Manual

1. **Acceder al dashboard:**

   ```
   http://localhost:3000/admin
   ```

2. **Verificar protección de rutas:**
   - Sin login → redirige a `/login`
   - Usuario STUDENT → redirige a `/`
   - Usuario ADMIN → acceso permitido

3. **Probar filtros de período:**
   - Cambiar entre: Hoy, Esta semana, Este mes, Este año
   - Verificar que los gráficos y stats se actualicen

4. **Verificar componentes:**
   - StatCards muestran valores correctos
   - Gráfico de ingresos se renderiza
   - Últimas órdenes aparecen
   - Top cursos se muestran

### Ejemplo de Test

**Archivo:** `src/app/admin/__tests__/page.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminDashboard from '../page';

const queryClient = new QueryClient();

describe('Admin Dashboard', () => {
  it('renders dashboard header', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AdminDashboard />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Hola/i)).toBeInTheDocument();
  });

  it('renders all stat cards', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AdminDashboard />
      </QueryClientProvider>
    );

    expect(screen.getByText('Ingresos Totales')).toBeInTheDocument();
    expect(screen.getByText('Órdenes')).toBeInTheDocument();
    expect(screen.getByText('Estudiantes')).toBeInTheDocument();
    expect(screen.getByText('Cursos Activos')).toBeInTheDocument();
  });
});
```

---

## 🐛 Troubleshooting

### Problema: Gráfico no se renderiza

**Solución:**

```bash
# Reinstalar recharts
npm install recharts --force
```

### Problema: Middleware no protege rutas

**Solución:**
Verificar que el archivo `middleware.ts` esté en la raíz del proyecto (no en `/src`)

### Problema: Stats no se actualizan

**Solución:**

```typescript
// Forzar refetch en el hook
const { data, refetch } = useDashboardStats();

// Llamar refetch() cuando sea necesario
```

---

## ✅ Checklist de Implementación

### Servicios y Hooks

- [ ] `statsService.ts` con todos los métodos
- [ ] `useStats.ts` con hooks personalizados
- [ ] Tipos TypeScript para estadísticas

### Componentes

- [ ] `StatCard.tsx` - Tarjeta de estadística
- [ ] `RevenueChart.tsx` - Gráfico de ingresos
- [ ] `RecentOrders.tsx` - Últimas órdenes
- [ ] `TopCourses.tsx` - Cursos más vendidos
- [ ] `AdminHeader.tsx` - Header del dashboard

### Páginas

- [ ] `app/admin/page.tsx` - Dashboard principal
- [ ] `app/admin/layout.tsx` - Layout admin (verificar)

### Configuración

- [ ] `middleware.ts` - Protección de rutas
- [ ] Recharts instalado
- [ ] shadcn/ui componentes instalados

### Testing

- [ ] Dashboard se renderiza correctamente
- [ ] Stats cards muestran datos
- [ ] Gráfico funciona
- [ ] Filtros de período funcionan
- [ ] Protección de rutas activa
- [ ] Links a otras páginas admin

---

## 📚 Recursos Adicionales

- [Recharts Documentation](https://recharts.org/)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [React Query - Queries](https://tanstack.com/query/latest/docs/react/guides/queries)
- [shadcn/ui - Card](https://ui.shadcn.com/docs/components/card)

---

## 🎯 Próximos Pasos

Con el dashboard admin completo, en la **Fase 9** implementaremos:

- ✅ CRUD completo de cursos
- ✅ Gestión de módulos y lecciones
- ✅ Upload de imágenes y videos
- ✅ Editor de contenido
- ✅ Gestión de categorías

---

## 📝 Resumen de la Fase 8

En esta fase hemos creado:

✅ **Dashboard administrativo** con estadísticas en tiempo real  
✅ **4 StatCards** con tendencias y comparativas  
✅ **Gráfico de ingresos** con Recharts (dual axis)  
✅ **Últimas órdenes** con estados y enlaces  
✅ **Top 5 cursos** más vendidos con métricas  
✅ **Middleware** para protección de rutas admin  
✅ **Filtros de período** (día, semana, mes, año)  
✅ **Hooks personalizados** para todas las estadísticas

**Resultado:** Panel de administración completamente funcional con visualización de datos, métricas clave y navegación rápida a otras secciones administrativas.

---

**¡Fase 8 completada! 🎉**
