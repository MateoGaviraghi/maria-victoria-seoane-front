# 📦 Fase 11 - Gestión de Órdenes (Admin)

> **Documentación Frontend - Maria Victoria Seoane**  
> Sistema completo de administración de órdenes con filtros, detalle, timeline y exportación

---

## 📋 Contenido

1. [Introducción](#introducción)
2. [Hooks de Órdenes](#hooks-de-órdenes)
3. [Componente OrderFilters](#componente-orderfilters)
4. [Componente OrdersTable](#componente-orderstable)
5. [Componente OrderStats](#componente-orderstats)
6. [Componente OrderTimeline](#componente-ordertimeline)
7. [Componente OrderItems](#componente-orderitems)
8. [Página Lista de Órdenes](#página-lista-de-órdenes)
9. [Página Detalle de Orden](#página-detalle-de-orden)
10. [Exportación de Órdenes](#exportación-de-órdenes)
11. [Servicios](#servicios)
12. [Testing](#testing)
13. [Checklist](#checklist)

---

## 🎯 Introducción

En esta fase implementaremos el **panel de administración de órdenes**, permitiendo:

- ✅ **Ver todas las órdenes** con filtros avanzados
- ✅ **Detalle completo** de cada orden con timeline
- ✅ **Cambiar estado** de las órdenes
- ✅ **Estadísticas** de ventas y conversión
- ✅ **Exportar** órdenes a CSV/Excel
- ✅ **Buscar** por número de orden, usuario o email
- ✅ **Filtrar** por estado, fecha, rango de precios

---

## 1️⃣ Hooks de Órdenes

**Archivo:** `src/lib/hooks/useOrderAdmin.ts`

```typescript
'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { ordersService } from '@/lib/services/ordersService';
import { toast } from 'sonner';
import type { Order, OrderStats, UpdateOrderStatusDto } from '@/types';

/**
 * Hook para obtener todas las órdenes (admin)
 */
export function useOrders(filters?: {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}): UseQueryResult<Order[]> {
  return useQuery({
    queryKey: ['orders', 'admin', filters],
    queryFn: () => ordersService.getOrders(filters),
  });
}

/**
 * Hook para obtener una orden por ID
 */
export function useOrder(orderId: string): UseQueryResult<Order> {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => ordersService.getOrderById(orderId),
    enabled: !!orderId,
  });
}

/**
 * Hook para obtener estadísticas de órdenes
 */
export function useOrderStats(
  period?: 'day' | 'week' | 'month' | 'year',
): UseQueryResult<OrderStats> {
  return useQuery({
    queryKey: ['orders', 'stats', period],
    queryFn: () => ordersService.getOrderStats(period),
  });
}

/**
 * Hook para actualizar estado de orden
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: UpdateOrderStatusDto;
    }) => ordersService.updateOrderStatus(orderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({
        queryKey: ['orders', variables.orderId],
      });
      toast.success('Estado de orden actualizado');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar orden');
    },
  });
}

/**
 * Hook para exportar órdenes
 */
export function useExportOrders() {
  return useMutation({
    mutationFn: (filters?: {
      status?: string;
      startDate?: string;
      endDate?: string;
    }) => ordersService.exportOrders(filters),
    onSuccess: (blob) => {
      // Crear link de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ordenes-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Órdenes exportadas correctamente');
    },
    onError: () => {
      toast.error('Error al exportar órdenes');
    },
  });
}

/**
 * Hook para refund (reembolso)
 */
export function useRefundOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      ordersService.refundOrder(orderId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({
        queryKey: ['orders', variables.orderId],
      });
      toast.success('Reembolso procesado correctamente');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al procesar reembolso',
      );
    },
  });
}
```

---

## 2️⃣ Componente OrderFilters

**Archivo:** `src/components/admin/orders/OrderFilters.tsx`

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OrderFiltersProps {
  onFiltersChange: (filters: {
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
  }) => void;
}

export default function OrderFilters({ onFiltersChange }: OrderFiltersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const handleApplyFilters = () => {
    onFiltersChange({
      search: search || undefined,
      status: status || undefined,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setStartDate(undefined);
    setEndDate(undefined);
    setMinAmount('');
    setMaxAmount('');
    onFiltersChange({});
  };

  const hasActiveFilters =
    search || status || startDate || endDate || minAmount || maxAmount;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número de orden, usuario o email..."
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
      <div className="grid gap-4 md:grid-cols-4">
        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="completed">Completado</SelectItem>
              <SelectItem value="failed">Fallido</SelectItem>
              <SelectItem value="refunded">Reembolsado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label>Desde</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {startDate ? (
                  format(startDate, 'PP', { locale: es })
                ) : (
                  <span className="text-muted-foreground">Seleccionar</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label>Hasta</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {endDate ? (
                  format(endDate, 'PP', { locale: es })
                ) : (
                  <span className="text-muted-foreground">Seleccionar</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Amount Range */}
        <div className="space-y-2">
          <Label>Rango de Precio</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Mín"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Máx"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 3️⃣ Componente OrdersTable

**Archivo:** `src/components/admin/orders/OrdersTable.tsx`

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
import { Eye, MoreHorizontal, RefreshCw, XCircle } from 'lucide-react';
import { useUpdateOrderStatus, useRefundOrder } from '@/lib/hooks/useOrderAdmin';
import { formatDate } from '@/lib/utils';
import type { Order } from '@/types';

interface OrdersTableProps {
  orders: Order[];
}

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Completado', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Fallido', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Reembolsado', color: 'bg-gray-100 text-gray-800' },
};

export default function OrdersTable({ orders }: OrdersTableProps) {
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
  const { mutate: refund, isPending: isRefunding } = useRefundOrder();

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatus({
      orderId,
      data: { status: newStatus },
    });
  };

  const handleRefund = (orderId: string) => {
    if (confirm('¿Estás seguro de procesar este reembolso?')) {
      refund({ orderId, reason: 'Reembolso solicitado por administrador' });
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No se encontraron órdenes</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[80px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig];
            return (
              <TableRow key={order.id}>
                <TableCell>
                  <code className="text-sm font-mono">#{order.orderNumber}</code>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {order.user.firstName} {order.user.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {order.user.email}
                    </span>
                  </div>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isUpdating || isRefunding}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <Link href={`/admin/ordenes/${order.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalle
                        </Link>
                      </DropdownMenuItem>

                      {order.status === 'pending' && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(order.id, 'completed')}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Marcar Completado
                        </DropdownMenuItem>
                      )}

                      {order.status === 'completed' && (
                        <DropdownMenuItem
                          onClick={() => handleRefund(order.id)}
                          className="text-red-600"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Procesar Reembolso
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
```

---

## 4️⃣ Componente OrderStats

**Archivo:** `src/components/admin/orders/OrderStats.tsx`

```typescript
'use client';

import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSign, ShoppingCart, TrendingUp, XCircle } from 'lucide-react';
import { useOrderStats } from '@/lib/hooks/useOrderAdmin';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function OrderStats() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const { data: stats, isLoading } = useOrderStats(period);

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
      title: 'Ingresos Totales',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      trend: stats.revenueTrend,
    },
    {
      title: 'Total Órdenes',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'bg-blue-100 text-blue-600',
      trend: stats.ordersTrend,
    },
    {
      title: 'Tasa de Conversión',
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
      trend: stats.conversionTrend,
    },
    {
      title: 'Reembolsos',
      value: stats.refundedOrders.toString(),
      icon: XCircle,
      color: 'bg-red-100 text-red-600',
      trend: stats.refundsTrend,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Estadísticas</h3>
        <Select
          value={period}
          onValueChange={(value: any) => setPeriod(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Hoy</SelectItem>
            <SelectItem value="week">Esta Semana</SelectItem>
            <SelectItem value="month">Este Mes</SelectItem>
            <SelectItem value="year">Este Año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const isPositive = (stat.trend || 0) >= 0;

          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-full p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.trend !== undefined && (
                      <span
                        className={`text-xs font-medium ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {stat.trend.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 5️⃣ Componente OrderTimeline

**Archivo:** `src/components/admin/orders/OrderTimeline.tsx`

```typescript
'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { OrderEvent } from '@/types';

interface OrderTimelineProps {
  events: OrderEvent[];
}

const eventConfig = {
  created: {
    icon: Clock,
    label: 'Orden Creada',
    color: 'text-blue-500',
  },
  payment_pending: {
    icon: Clock,
    label: 'Pago Pendiente',
    color: 'text-yellow-500',
  },
  payment_completed: {
    icon: CheckCircle2,
    label: 'Pago Completado',
    color: 'text-green-500',
  },
  payment_failed: {
    icon: XCircle,
    label: 'Pago Fallido',
    color: 'text-red-500',
  },
  refunded: {
    icon: RefreshCw,
    label: 'Reembolsado',
    color: 'text-gray-500',
  },
  courses_assigned: {
    icon: CheckCircle2,
    label: 'Cursos Asignados',
    color: 'text-green-500',
  },
};

export default function OrderTimeline({ events }: OrderTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Timeline</h3>
        <p className="text-center py-8 text-muted-foreground">
          No hay eventos registrados
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Timeline</h3>

      <div className="relative space-y-6">
        {/* Vertical Line */}
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border" />

        {/* Events */}
        {events.map((event, index) => {
          const config = eventConfig[event.type as keyof typeof eventConfig] || {
            icon: Clock,
            label: event.type,
            color: 'text-gray-500',
          };
          const Icon = config.icon;

          return (
            <div key={index} className="relative flex gap-4">
              {/* Icon */}
              <div className="relative z-10 flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-border">
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{config.label}</span>
                  <Badge variant="outline" className="text-xs">
                    {formatDate(event.createdAt, true)}
                  </Badge>
                </div>
                {event.description && (
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                )}
                {event.metadata && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <code className="bg-muted px-2 py-1 rounded">
                      {JSON.stringify(event.metadata, null, 2)}
                    </code>
                  </div>
                )}
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

## 6️⃣ Componente OrderItems

**Archivo:** `src/components/admin/orders/OrderItems.tsx`

```typescript
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExternalLink } from 'lucide-react';
import type { OrderItem } from '@/types';

interface OrderItemsProps {
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  total: number;
}

export default function OrderItems({
  items,
  subtotal,
  discount = 0,
  total,
}: OrderItemsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Items de la Orden</h3>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Curso</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead className="w-[80px]">Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="relative w-16 h-10 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={item.course.thumbnail || '/placeholder-course.jpg'}
                        alt={item.course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Title */}
                    <div>
                      <p className="font-medium line-clamp-1">
                        {item.course.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.course.category?.name}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  ${item.price.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/cursos/${item.course.slug}`}
                    target="_blank"
                    className="inline-flex"
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Totales */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal:</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Descuento:</span>
            <span className="text-green-600">-${discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
          <span>Total:</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
}
```

---

## 7️⃣ Página Lista de Órdenes

**Archivo:** `src/app/admin/ordenes/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import OrderFilters from '@/components/admin/orders/OrderFilters';
import OrdersTable from '@/components/admin/orders/OrdersTable';
import OrderStats from '@/components/admin/orders/OrderStats';
import { useOrders, useExportOrders } from '@/lib/hooks/useOrderAdmin';
import { Loader2 } from 'lucide-react';

export default function OrdersPage() {
  const [filters, setFilters] = useState({});

  const { data: orders, isLoading } = useOrders(filters);
  const { mutate: exportOrders, isPending: isExporting } = useExportOrders();

  const handleExport = () => {
    exportOrders(filters);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Órdenes</h1>
          <p className="text-muted-foreground mt-1">
            Administra todas las órdenes y pagos de la plataforma
          </p>
        </div>
        <Button onClick={handleExport} disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Exportar CSV
        </Button>
      </div>

      {/* Stats */}
      <OrderStats />

      {/* Filters */}
      <OrderFilters onFiltersChange={setFilters} />

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 border rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : orders ? (
        <OrdersTable orders={orders} />
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No se encontraron órdenes</p>
        </div>
      )}
    </div>
  );
}
```

---

## 8️⃣ Página Detalle de Orden

**Archivo:** `src/app/admin/ordenes/[id]/page.tsx`

```typescript
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import OrderTimeline from '@/components/admin/orders/OrderTimeline';
import OrderItems from '@/components/admin/orders/OrderItems';
import { useOrder } from '@/lib/hooks/useOrderAdmin';
import { formatDate } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Completado', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Fallido', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Reembolsado', color: 'bg-gray-100 text-gray-800' },
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Orden no encontrada</h2>
        <p className="text-muted-foreground mt-2">
          La orden que buscas no existe
        </p>
        <Button asChild className="mt-4">
          <Link href="/admin/ordenes">Volver a órdenes</Link>
        </Button>
      </div>
    );
  }

  const status = statusConfig[order.status as keyof typeof statusConfig];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/ordenes">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Orden #{order.orderNumber}</h1>
          <p className="text-muted-foreground mt-1">
            Creada el {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge className={status.color}>{status.label}</Badge>
      </div>

      {/* Order Info Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Información de la Orden</h3>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Customer */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Cliente:</span>
              <Link
                href={`/admin/usuarios/${order.user.id}`}
                className="font-medium hover:underline"
              >
                {order.user.firstName} {order.user.lastName}
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Email:</span>
              <code className="text-sm">{order.user.email}</code>
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Fecha:</span>
              <span>{formatDate(order.createdAt, true)}</span>
            </div>

            {order.paymentMethod && (
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Método de Pago:</span>
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
            )}

            {order.mercadoPagoId && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">MercadoPago ID:</span>
                <code className="text-sm">{order.mercadoPagoId}</code>
              </div>
            )}
          </div>
        </div>

        {order.notes && (
          <>
            <Separator className="my-4" />
            <div>
              <p className="text-sm font-medium mb-1">Notas</p>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          </>
        )}
      </Card>

      {/* Items */}
      <OrderItems
        items={order.items}
        subtotal={order.subtotal}
        discount={order.discount}
        total={order.total}
      />

      {/* Timeline */}
      <OrderTimeline events={order.events || []} />
    </div>
  );
}
```

---

## 9️⃣ Exportación de Órdenes

**Archivo:** `src/lib/services/ordersService.ts` (agregar método)

```typescript
/**
 * Exportar órdenes a CSV
 */
async exportOrders(filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Blob> {
  const response = await api.get('/orders/export', {
    params: filters,
    responseType: 'blob',
  });
  return response.data;
}
```

**Backend - Endpoint de Exportación:**

```typescript
// backend/src/orders/orders.controller.ts
@Get('export')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER', 'SUPER_ADMIN')
async exportOrders(
  @Query() filters: FilterOrdersDto,
  @Res() res: Response
) {
  const orders = await this.ordersService.findAll(filters);

  // Convertir a CSV
  const csv = this.convertToCSV(orders);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=ordenes-${new Date().toISOString().split('T')[0]}.csv`
  );
  res.send(csv);
}

private convertToCSV(orders: Order[]): string {
  const header = 'Número,Usuario,Email,Fecha,Items,Total,Estado\n';

  const rows = orders.map((order) => {
    return [
      order.orderNumber,
      `${order.user.firstName} ${order.user.lastName}`,
      order.user.email,
      new Date(order.createdAt).toLocaleDateString(),
      order.items.length,
      order.total,
      order.status,
    ].join(',');
  });

  return header + rows.join('\n');
}
```

---

## 🔟 Servicios Completos

**Archivo:** `src/lib/services/ordersService.ts`

```typescript
import api from './api';
import type { AxiosResponse } from 'axios';
import type { Order, OrderStats, UpdateOrderStatusDto } from '@/types';

export const ordersService = {
  /**
   * Obtener todas las órdenes (admin)
   */
  async getOrders(filters?: {
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
  }): Promise<Order[]> {
    const response: AxiosResponse<Order[]> = await api.get('/orders', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Obtener orden por ID
   */
  async getOrderById(id: string): Promise<Order> {
    const response: AxiosResponse<Order> = await api.get(`/orders/${id}`);
    return response.data;
  },

  /**
   * Obtener estadísticas de órdenes
   */
  async getOrderStats(
    period?: 'day' | 'week' | 'month' | 'year',
  ): Promise<OrderStats> {
    const response: AxiosResponse<OrderStats> = await api.get('/orders/stats', {
      params: { period },
    });
    return response.data;
  },

  /**
   * Actualizar estado de orden
   */
  async updateOrderStatus(
    id: string,
    data: UpdateOrderStatusDto,
  ): Promise<Order> {
    const response: AxiosResponse<Order> = await api.patch(
      `/orders/${id}/status`,
      data,
    );
    return response.data;
  },

  /**
   * Procesar reembolso
   */
  async refundOrder(id: string, reason?: string): Promise<Order> {
    const response: AxiosResponse<Order> = await api.post(
      `/orders/${id}/refund`,
      { reason },
    );
    return response.data;
  },

  /**
   * Exportar órdenes a CSV
   */
  async exportOrders(filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const response = await api.get('/orders/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },
};
```

---

## 🎨 Tipos Adicionales

**Archivo:** `src/types/index.ts` (agregar)

```typescript
export interface OrderEvent {
  id: string;
  type:
    | 'created'
    | 'payment_pending'
    | 'payment_completed'
    | 'payment_failed'
    | 'refunded'
    | 'courses_assigned';
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface OrderStats {
  totalRevenue: number;
  totalOrders: number;
  conversionRate: number;
  refundedOrders: number;
  revenueTrend?: number;
  ordersTrend?: number;
  conversionTrend?: number;
  refundsTrend?: number;
}

export interface UpdateOrderStatusDto {
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}
```

---

## 🧪 Testing

**Archivo:** `src/components/admin/orders/__tests__/OrdersTable.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrdersTable from '../OrdersTable';

const queryClient = new QueryClient();

const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    user: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    },
    items: [{ id: '1' }],
    total: 5000,
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
];

describe('OrdersTable', () => {
  it('renders orders', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersTable orders={mockOrders} />
      </QueryClientProvider>
    );

    expect(screen.getByText('ORD-001')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('$5,000')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <OrdersTable orders={[]} />
      </QueryClientProvider>
    );

    expect(screen.getByText(/no se encontraron órdenes/i)).toBeInTheDocument();
  });
});
```

---

## 🎨 Componentes shadcn/ui Adicionales

```bash
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
```

---

## 📊 Utilidad formatDate

**Archivo:** `src/lib/utils.ts` (agregar)

```typescript
export function formatDate(date: string | Date, includeTime = false): string {
  const d = new Date(date);

  const dateStr = d.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (includeTime) {
    const timeStr = d.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${dateStr} - ${timeStr}`;
  }

  return dateStr;
}
```

---

## ✅ Checklist de Implementación Fase 11

### Hooks

- [ ] `useOrderAdmin.ts` - 6 hooks (useOrders, useOrder, useOrderStats, useUpdateOrderStatus, useExportOrders, useRefundOrder)

### Componentes

- [ ] `OrderFilters.tsx` - Filtros avanzados con fechas y rangos
- [ ] `OrdersTable.tsx` - Tabla con acciones de estado y reembolso
- [ ] `OrderStats.tsx` - 4 métricas con selector de período
- [ ] `OrderTimeline.tsx` - Timeline visual de eventos
- [ ] `OrderItems.tsx` - Tabla de items con thumbnails y totales

### Páginas

- [ ] `app/admin/ordenes/page.tsx` - Lista con stats y filtros
- [ ] `app/admin/ordenes/[id]/page.tsx` - Detalle completo con timeline

### Servicios

- [ ] ordersService con todos los métodos
- [ ] Exportación a CSV implementada

### Backend

- [ ] Endpoint `/orders/export` funcionando
- [ ] Endpoint `/orders/stats` con período
- [ ] Endpoint `/orders/:id/refund` para reembolsos

### shadcn/ui

- [ ] Calendar instalado
- [ ] Popover instalado

### Testing

- [ ] OrdersTable renderiza correctamente
- [ ] Filtros funcionan
- [ ] Exportación descarga CSV
- [ ] Cambio de estado funciona
- [ ] Reembolso requiere confirmación

---

## 🐛 Troubleshooting

### Problema: La exportación no descarga el archivo

**Solución:**
Verificar que el backend retorne `Content-Type: text/csv` y `Content-Disposition` headers correctamente.

### Problema: Calendar no se muestra

**Solución:**

```bash
npx shadcn-ui@latest add calendar
npm install date-fns
```

### Problema: Timeline no tiene línea vertical

**Solución:**
Verificar que el contenedor tenga `relative` y la línea tenga `absolute`.

---

## 📚 Recursos Adicionales

- [date-fns - Formatting](https://date-fns.org/docs/format)
- [CSV Export Best Practices](https://datatracker.ietf.org/doc/html/rfc4180)
- [shadcn/ui - Calendar](https://ui.shadcn.com/docs/components/calendar)

---

## 📝 Resumen de la Fase 11

En esta fase hemos creado:

✅ **Sistema completo de gestión de órdenes** con filtros avanzados  
✅ **OrderStats** - Métricas de ingresos, conversión y reembolsos  
✅ **OrderFilters** - Búsqueda, estado, fechas y rango de precios  
✅ **OrdersTable** - Tabla con acciones de cambio de estado  
✅ **OrderTimeline** - Timeline visual de eventos de la orden  
✅ **OrderItems** - Tabla de cursos comprados con thumbnails  
✅ **Página de detalle** - Vista completa con info del cliente y pago  
✅ **Exportación CSV** - Descarga de órdenes filtradas  
✅ **Reembolsos** - Proceso de refund con confirmación

**Resultado:** Panel completo de administración de órdenes con visualización detallada, estadísticas en tiempo real y herramientas de gestión.

---

**¡Fase 11 completada! 🎉**

Ahora puedes gestionar todas las órdenes de la plataforma, procesar reembolsos, ver estadísticas detalladas y exportar reportes.
