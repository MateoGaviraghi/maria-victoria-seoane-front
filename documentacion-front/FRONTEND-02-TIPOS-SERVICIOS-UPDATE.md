# 🔧 FASE 02 - Tipos TypeScript y Servicios Base

## 📋 Objetivos de esta Fase

En esta fase vamos a:

1. ✅ Definir todos los tipos TypeScript (interfaces y types) del proyecto
2. ✅ Crear los schemas de validación con Zod
3. ✅ Implementar servicios base para comunicación con el backend
4. ✅ Configurar React Query (TanStack Query)
5. ✅ Crear utilidades de manejo de errores

---

## 1️⃣ Tipos TypeScript - Interfaces Base

### `src/types/user.ts`

```typescript
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OWNER = 'OWNER',
  STUDENT = 'STUDENT',
}

export enum StudentStatus {
  REGISTERED = 'REGISTERED',
  IN_CART = 'IN_CART',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  dni?: string | null;
  role: Role;
  studentStatus: StudentStatus;
  authProvider: AuthProvider;
  googleId?: string | null;
  birthDate?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
```

### `src/types/course.ts`

```typescript
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  duration?: number; // minutos
  order: number;
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessons?: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  discountPrice?: number;
  thumbnailUrl?: string | null;
  previewVideoUrl?: string | null;
  duration?: number | null; // minutos
  level?: string | null;
  language: string;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
  categories?: Category[];
  modules?: Module[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  discountPrice?: number;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  duration?: number;
  level?: string;
  language?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  order?: number;
  categoryIds?: string[];
}

export interface UpdateCourseData {
  title?: string;
  shortDescription?: string;
  longDescription?: string;
  price?: number;
  discountPrice?: number;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  duration?: number;
  level?: string;
  language?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  order?: number;
  categoryIds?: string[];
}
```

### `src/types/cart.ts`

```typescript
export interface CartItem {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  courseThumbnail?: string;
  price: number;
  discountPrice?: number;
  addedAt: string;
}

export interface CartCoupon {
  code: string;
  type: string;
  value: number;
  discountAmount: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  coupon?: CartCoupon;
  discount: number;
  total: number;
  currency: string;
}

export interface AddToCartData {
  courseId: string;
}

export interface ApplyCouponData {
  code: string;
}

export interface CartItemAddedResponse {
  message: string;
  item: CartItem;
  cart: Cart;
}

export interface CartItemRemovedResponse {
  message: string;
  cart: Cart;
}

export interface CouponAppliedResponse {
  message: string;
  coupon: CartCoupon;
  cart: Cart;
}
```

### `src/types/coupon.ts`

```typescript
export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  maxUses?: number;
  maxUsesPerUser: number;
  currentUses: number;
  validFrom: string;
  validUntil?: string | null;
  isActive: boolean;
  description?: string | null;
  courses?: { id: string; title: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponData {
  code: string;
  type: CouponType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  validFrom?: string;
  validUntil?: string;
  description?: string;
  courseIds?: string[];
}

export interface UpdateCouponData {
  code?: string;
  type?: CouponType;
  value?: number;
  minPurchase?: number;
  maxDiscount?: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  validFrom?: string;
  validUntil?: string;
  isActive?: boolean;
  description?: string;
  courseIds?: string[];
}

export interface ValidateCouponData {
  code: string;
  courseIds?: string[];
  subtotal?: number;
}

export interface ValidateCouponResponse {
  valid: boolean;
  code: string;
  type: CouponType;
  value: number;
  maxDiscount?: number;
  discountAmount?: number;
  message?: string;
}
```

### `src/types/order.ts`

```typescript
export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface OrderItem {
  id: string;
  courseId: string;
  title: string;
  price: number;
}

export interface OrderPayment {
  id: string;
  status: OrderStatus;
  amount: number;
  paymentMethod?: string | null;
  paymentType?: string | null;
  installments?: number | null;
  paidAt?: string | null;
}

export interface OrderUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface Order {
  id: string;
  userId: string;
  user?: OrderUser;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  total: number;
  currency: string;
  couponCode?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerDni?: string | null;
  items: OrderItem[];
  payment?: OrderPayment;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilterParams {
  status?: OrderStatus;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}
```

### `src/types/checkout.ts`

```typescript
export interface CheckoutData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
  birthDate?: string;
  couponCode?: string;
  notes?: string;
}

export interface CheckoutSummaryItem {
  courseId: string;
  title: string;
  price: number;
}

export interface CheckoutSummary {
  items: CheckoutSummaryItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  currency: string;
}

export interface CheckoutResponse {
  orderId: string;
  paymentUrl: string;
  preferenceId: string;
  summary: CheckoutSummary;
}

export interface CheckoutValidationResponse {
  valid: boolean;
  canProceed: boolean;
  errors?: string[];
  summary?: CheckoutSummary;
}
```

### `src/types/email.ts`

```typescript
export interface EmailLog {
  id: string;
  to: string;
  type: EmailType;
  subject: string;
  status: EmailStatus;
  sentAt?: string | null;
  openedAt?: string | null;
  clickedAt?: string | null;
  error?: string | null;
  createdAt: string;
}

export interface EmailStats {
  totalSent: number;
  pending: number;
  failed: number;
  openRate: number;
  clickRate: number;
  byType: Record<string, number>;
}

export enum EmailType {
  VERIFICATION = 'VERIFICATION',
  WELCOME = 'WELCOME',
  PURCHASE_CONFIRMED = 'PURCHASE_CONFIRMED',
  COURSE_ACCESS = 'COURSE_ACCESS',
  PASSWORD_RESET = 'PASSWORD_RESET',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  CART_ABANDONED_1H = 'CART_ABANDONED_1H',
  CART_ABANDONED_24H = 'CART_ABANDONED_24H',
  CART_ABANDONED_72H = 'CART_ABANDONED_72H',
  NEW_COUPON = 'NEW_COUPON',
  COUPON_EXPIRING = 'COUPON_EXPIRING',
  BIRTHDAY = 'BIRTHDAY',
  NEW_COURSE = 'NEW_COURSE',
  RECOMPRA = 'RECOMPRA',
  ADMIN_NEW_SALE = 'ADMIN_NEW_SALE',
  ADMIN_NEW_USER = 'ADMIN_NEW_USER',
  ADMIN_NEW_MESSAGE = 'ADMIN_NEW_MESSAGE',
}

export enum EmailStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  OPENED = 'OPENED',
  CLICKED = 'CLICKED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
}

export interface EmailConfig {
  cartAbandoned1hHours: number;
  cartAbandoned24hHours: number;
  cartAbandoned72hHours: number;
  firstCouponDiscount: number;
  secondCouponDiscount: number;
  cartAbandonedEnabled: boolean;
  birthdayEmailsEnabled: boolean;
}

export interface UpdateEmailConfigData {
  cartAbandoned1hHours?: number;
  cartAbandoned24hHours?: number;
  cartAbandoned72hHours?: number;
  firstCouponDiscount?: number;
  secondCouponDiscount?: number;
  cartAbandonedEnabled?: boolean;
  birthdayEmailsEnabled?: boolean;
}
```

### `src/types/api.ts`

```typescript
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

```

---

## 2️⃣ Schemas de Validación con Zod

### `src/lib/validations/auth.ts`

```typescript
import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
  });

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: passwordSchema,
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: passwordSchema,
});

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .optional(),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
```

### `src/lib/validations/course.ts`

```typescript
import { z } from 'zod';
export const createCourseSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  shortDescription: z
    .string()
    .min(10, 'La descripción corta debe tener al menos 10 caracteres'),
  longDescription: z
    .string()
    .min(50, 'La descripción larga debe tener al menos 50 caracteres'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  discountPrice: z.number().min(0).optional(),
  thumbnailUrl: z.string().url().optional(),
  previewVideoUrl: z.string().url().optional(),
  duration: z.number().min(0).optional(),
  level: z.string().optional(),
  language: z.string().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  order: z.number().min(0).optional(),
  categoryIds: z.array(z.string()).optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export type CreateCourseFormData = z.infer<typeof createCourseSchema>;
export type UpdateCourseFormData = z.infer<typeof updateCourseSchema>;
```

### `src/lib/validations/coupon.ts`

```typescript
import { z } from 'zod';
import { CouponType } from '@/types/coupon';

export const createCouponSchema = z.object({
  code: z
    .string()
    .min(3, 'El código debe tener al menos 3 caracteres')
    .max(20, 'El código no puede tener más de 20 caracteres')
    .toUpperCase(),
  type: z.nativeEnum(CouponType),
  value: z.number().min(0, 'El descuento debe ser mayor o igual a 0'),
  minPurchase: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  maxUses: z.number().min(1).optional(),
  maxUsesPerUser: z.number().min(1).optional(),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
  description: z.string().optional(),
  courseIds: z.array(z.string()).optional(),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1, 'Ingresa un código de cupón'),
});

export type CreateCouponFormData = z.infer<typeof createCouponSchema>;
export type ValidateCouponFormData = z.infer<typeof validateCouponSchema>;
```

---

## 3️⃣ Configuración de React Query

### `src/lib/react-query.ts`

```typescript
import { QueryClient, DefaultOptions } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
```

### `src/app/layout.tsx` - Actualizar con QueryClientProvider

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/react-query';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'María Victoria Seoane - Plataforma de Cursos',
  description: 'Aprende con los mejores cursos online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

---

## 4️⃣ Servicios de API - Auth

### `src/services/authService.ts`

```typescript
import { apiClient } from '@/lib/api';
import {
  User,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
} from '@/types/user';
import { ApiResponse } from '@/types/api';

export const authService = {
  // Login
  login: async (
    credentials: LoginCredentials,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
    const { data } = await apiClient.post<
      ApiResponse<{ accessToken: string; refreshToken: string; user: User }>
    >('/auth/login', credentials);
    return data.data;
  },

  // Registro
  register: async (
    userData: RegisterData,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
    const { data } = await apiClient.post<
      ApiResponse<{ accessToken: string; refreshToken: string; user: User }>
    >('/auth/register', userData);
    return data.data;
  },

  // Obtener perfil actual
  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<{ user: User }>>(
      '/auth/me',
    );
    return data.data.user;
  },

  // Actualizar perfil
  updateProfile: async (profileData: UpdateProfileData): Promise<User> => {
    const { data } = await apiClient.put<ApiResponse<User>>(
      '/users/me',
      profileData,
    );
    return data.data;
  },

  // Cambiar contraseña
  changePassword: async (
    passwordData: ChangePasswordData,
  ): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/change-password',
      passwordData,
    );
    return data.data;
  },

  // Reenviar email de verificación
  resendVerificationEmail: async (): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/resend-verification',
    );
    return data.data;
  },

  // Verificar email
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/verify-email',
      { token },
    );
    return data.data;
  },

  // Logout (limpiar token del cliente)
  logout: () => {
    localStorage.removeItem('access_token');
  },
};
```

---

## 5️⃣ Servicios de API - Courses

### `src/services/coursesService.ts`

```typescript
import { apiClient } from '@/lib/api';
import {
  Course,
  Category,
  CreateCourseData,
  UpdateCourseData,
} from '@/types/course';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

export const coursesService = {
  // Obtener todos los cursos (público)
  getCourses: async (
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Course>> => {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<Course>>
    >('/courses', {
      params,
    });
    return data.data;
  },

  // Obtener curso por ID (público)
  getCourseById: async (id: string, includeModules?: boolean): Promise<Course> => {
    const { data } = await apiClient.get<ApiResponse<Course>>(`/courses/${id}`, {
      params: { includeModules },
    });
    return data.data;
  },

  // Obtener curso por slug (público)
  getCourseBySlug: async (slug: string): Promise<Course> => {
    const { data } = await apiClient.get<ApiResponse<Course>>(
      `/courses/slug/${slug}`,
    );
    return data.data;
  },

  // Crear curso (SUPER_ADMIN/OWNER)
  createCourse: async (courseData: CreateCourseData): Promise<Course> => {
    const { data } = await apiClient.post<ApiResponse<Course>>(
      '/courses',
      courseData,
    );
    return data.data;
  },

  // Actualizar curso (SUPER_ADMIN/OWNER)
  updateCourse: async (
    id: string,
    courseData: UpdateCourseData,
  ): Promise<Course> => {
    const { data } = await apiClient.put<ApiResponse<Course>>(
      `/courses/${id}`,
      courseData,
    );
    return data.data;
  },

  // Eliminar curso (ADMIN)
  deleteCourse: async (id: string): Promise<void> => {
    await apiClient.delete(`/courses/${id}`);
  },

  // Cursos destacados (público)
  getFeaturedCourses: async (limit?: number): Promise<Course[]> => {
    const { data } = await apiClient.get<ApiResponse<Course[]>>(
      '/courses/featured',
      {
        params: { limit },
      },
    );
    return data.data;
  },

  // Publicar/Despublicar
  togglePublish: async (id: string): Promise<Course> => {
    const { data } = await apiClient.patch<ApiResponse<Course>>(
      `/courses/${id}/toggle-publish`,
    );
    return data.data;
  },

  // Destacar/Quitar destacado
  toggleFeatured: async (id: string): Promise<Course> => {
    const { data } = await apiClient.patch<ApiResponse<Course>>(
      `/courses/${id}/toggle-featured`,
    );
    return data.data;
  },

  // Reordenar cursos
  reorderCourses: async (orderedIds: string[]): Promise<{ message: string }> => {
    const { data } = await apiClient.put<ApiResponse<{ message: string }>>(
      '/courses/reorder/batch',
      { orderedIds },
    );
    return data.data;
  },

  // ===== CATEGORÍAS =====

  // Obtener todas las categorías
  getCategories: async (params?: {
    includeCoursesCount?: boolean;
    onlyWithCourses?: boolean;
  }): Promise<Category[]> => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>(
      '/categories',
      { params },
    );
    return data.data;
  },
};
```

---

## 6️⃣ Servicios de API - Cart & Checkout

### `src/services/cartService.ts`

```typescript
import { apiClient } from '@/lib/api';
import {
  Cart,
  CartItemAddedResponse,
  CartItemRemovedResponse,
  CouponAppliedResponse,
  AddToCartData,
  ApplyCouponData,
} from '@/types/cart';
import { ApiResponse } from '@/types/api';

export const cartService = {
  // Obtener carrito actual
  getCart: async (): Promise<Cart> => {
    const { data } = await apiClient.get<ApiResponse<Cart>>('/cart');
    return data.data;
  },

  // Agregar curso al carrito
  addToCart: async (cartData: AddToCartData): Promise<CartItemAddedResponse> => {
    const { data } = await apiClient.post<ApiResponse<CartItemAddedResponse>>(
      '/cart',
      cartData,
    );
    return data.data;
  },

  // Eliminar curso del carrito
  removeFromCart: async (courseId: string): Promise<CartItemRemovedResponse> => {
    const { data } = await apiClient.delete<ApiResponse<CartItemRemovedResponse>>(
      `/cart/${courseId}`,
    );
    return data.data;
  },

  // Vaciar carrito
  clearCart: async (): Promise<Cart> => {
    const { data } = await apiClient.delete<ApiResponse<Cart>>('/cart');
    return data.data;
  },

  // Aplicar cupón
  applyCoupon: async (
    couponData: ApplyCouponData,
  ): Promise<CouponAppliedResponse> => {
    const { data } = await apiClient.post<ApiResponse<CouponAppliedResponse>>(
      '/cart/apply-coupon',
      couponData,
    );
    return data.data;
  },

  // Obtener cantidad de items
  getCount: async (): Promise<{ count: number }> => {
    const { data } = await apiClient.get<ApiResponse<{ count: number }>>(
      '/cart/count',
    );
    return data.data;
  },
};
```

### `src/services/checkoutService.ts`

```typescript
import { apiClient } from '@/lib/api';
import {
  CheckoutData,
  CheckoutSummary,
  CheckoutValidationResponse,
  CheckoutResponse,
} from '@/types/checkout';
import { ApiResponse } from '@/types/api';

export const checkoutService = {
  // Obtener resumen de checkout
  getSummary: async (): Promise<CheckoutSummary> => {
    const { data } = await apiClient.get<ApiResponse<CheckoutSummary>>(
      '/checkout/summary',
    );
    return data.data;
  },

  // Validar checkout
  validateCheckout: async (
    payload: { dni: string; phone: string },
  ): Promise<CheckoutValidationResponse> => {
    const { data } = await apiClient.post<
      ApiResponse<CheckoutValidationResponse>
    >('/checkout/validate', payload);
    return data.data;
  },

  // Crear checkout
  createCheckout: async (checkoutData: CheckoutData): Promise<CheckoutResponse> => {
    const { data } = await apiClient.post<ApiResponse<CheckoutResponse>>(
      '/checkout',
      checkoutData,
    );
    return data.data;
  },
};
```

---

## 7️⃣ Servicios de API - Orders

### `src/services/ordersService.ts`

```typescript
import { apiClient } from '@/lib/api';
import { Order, OrderFilterParams } from '@/types/order';
import { ApiResponse } from '@/types/api';

export const ordersService = {
  // Obtener mis órdenes
  getMyOrders: async (
    params?: OrderFilterParams,
  ): Promise<{ orders: Order[]; total: number; page: number; limit: number; totalPages: number }> => {
    const { data } = await apiClient.get<
      ApiResponse<{ orders: Order[]; total: number; page: number; limit: number; totalPages: number }>
    >('/orders/my', { params });
    return data.data;
  },

  // Obtener orden por ID
  getOrderById: async (id: string): Promise<Order> => {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return data.data;
  },

  // Cancelar orden
  cancelOrder: async (id: string): Promise<Order> => {
    const { data } = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${id}/cancel`,
    );
    return data.data;
  },

  // Obtener todas las órdenes (ADMIN)
  getAllOrders: async (
    params?: OrderFilterParams,
  ): Promise<{ orders: Order[]; total: number; page: number; limit: number; totalPages: number }> => {
    const { data } = await apiClient.get<
      ApiResponse<{ orders: Order[]; total: number; page: number; limit: number; totalPages: number }>
    >('/orders', { params });
    return data.data;
  },

  // Estadísticas (ADMIN)
  getStats: async (): Promise<{
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> => {
    const { data } = await apiClient.get<
      ApiResponse<{
        totalOrders: number;
        completedOrders: number;
        pendingOrders: number;
        totalRevenue: number;
        averageOrderValue: number;
      }>
    >('/orders/admin/stats');
    return data.data;
  },
};
```

---

## 8️⃣ Servicios de API - Coupons

### `src/services/couponsService.ts`

```typescript
import { apiClient } from '@/lib/api';
import {
  Coupon,
  CreateCouponData,
  UpdateCouponData,
  ValidateCouponData,
  ValidateCouponResponse,
} from '@/types/coupon';
import { ApiResponse } from '@/types/api';

export const couponsService = {
  // Validar cupón
  validateCoupon: async (
    couponData: ValidateCouponData,
  ): Promise<ValidateCouponResponse> => {
    const { data } = await apiClient.post<ApiResponse<ValidateCouponResponse>>(
      '/coupons/validate',
      couponData,
    );
    return data.data;
  },

  // Obtener todos los cupones (ADMIN)
  getAllCoupons: async (): Promise<{ coupons: Coupon[]; total: number }> => {
    const { data } = await apiClient.get<
      ApiResponse<{ coupons: Coupon[]; total: number }>
    >('/coupons');
    return data.data;
  },

  // Crear cupón (ADMIN)
  createCoupon: async (couponData: CreateCouponData): Promise<Coupon> => {
    const { data } = await apiClient.post<ApiResponse<Coupon>>(
      '/coupons',
      couponData,
    );
    return data.data;
  },

  // Actualizar cupón (ADMIN)
  updateCoupon: async (
    id: string,
    couponData: UpdateCouponData,
  ): Promise<Coupon> => {
    const { data } = await apiClient.put<ApiResponse<Coupon>>(
      `/coupons/${id}`,
      couponData,
    );
    return data.data;
  },

  // Eliminar cupón (ADMIN)
  deleteCoupon: async (id: string): Promise<void> => {
    await apiClient.delete(`/coupons/${id}`);
  },

  // Estadísticas (ADMIN)
  getStats: async (): Promise<{
    totalCoupons: number;
    activeCoupons: number;
    totalUses: number;
    totalDiscount: number;
  }> => {
    const { data } = await apiClient.get<
      ApiResponse<{
        totalCoupons: number;
        activeCoupons: number;
        totalUses: number;
        totalDiscount: number;
      }>
    >('/coupons/stats');
    return data.data;
  },
};
```

---

## 🔟 Servicios de API - Users (Admin)

### `src/services/usersService.ts`

```typescript
import { apiClient } from '@/lib/api';
import { User, UpdateProfileData } from '@/types/user';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

export const usersService = {
  // Obtener mi perfil
  getMyProfile: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>('/users/me');
    return data.data;
  },

  // Actualizar mi perfil
  updateMyProfile: async (payload: UpdateProfileData): Promise<User> => {
    const { data } = await apiClient.put<ApiResponse<User>>(
      '/users/me',
      payload,
    );
    return data.data;
  },

  // Obtener todos los usuarios (ADMIN)
  getAllUsers: async (
    params?: PaginationParams,
  ): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(
      '/users',
      {
        params,
      },
    );
    return data.data;
  },

  // Obtener usuario por ID (ADMIN)
  getUserById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return data.data;
  },

  // Actualizar rol de usuario (SUPER_ADMIN)
  updateUserRole: async (id: string, role: string): Promise<User> => {
    const { data } = await apiClient.put<ApiResponse<User>>(
      `/users/${id}/role`,
      { role },
    );
    return data.data;
  },

  // Eliminar usuario (SUPER_ADMIN)
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  // Activar usuario (OWNER/SUPER_ADMIN)
  activateUser: async (id: string): Promise<User> => {
    const { data } = await apiClient.put<ApiResponse<User>>(
      `/users/${id}/activate`,
    );
    return data.data;
  },
};
```

---

## 1️⃣1️⃣ Servicios de API - Emails (Admin)

### `src/services/emailsService.ts`

```typescript
import { apiClient } from '@/lib/api';
import {
  EmailLog,
  EmailStats,
  EmailConfig,
  UpdateEmailConfigData,
  EmailType,
} from '@/types/email';
import { ApiResponse, PaginationParams, PaginatedResponse } from '@/types/api';

export const emailsService = {
  // Obtener logs de emails (ADMIN)
  getEmailLogs: async (
    params?: PaginationParams,
  ): Promise<PaginatedResponse<EmailLog>> => {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<EmailLog>>
    >('/emails/logs', {
      params,
    });
    return data.data;
  },

  // Obtener estadísticas de emails (ADMIN)
  getEmailStats: async (): Promise<EmailStats> => {
    const { data } = await apiClient.get<ApiResponse<EmailStats>>('/emails/stats');
    return data.data;
  },

  // Enviar email de prueba (ADMIN)
  sendTestEmail: async (payload: { to: string; type: EmailType }) => {
    const { data } = await apiClient.post<ApiResponse<any>>(
      '/emails/test',
      payload,
    );
    return data.data;
  },

  // Obtener configuración de emails (SUPER_ADMIN)
  getEmailConfig: async (): Promise<EmailConfig> => {
    const { data } = await apiClient.get<ApiResponse<EmailConfig>>(
      '/site-config/emails/settings',
    );
    return data.data;
  },

  // Actualizar configuración de emails (SUPER_ADMIN)
  updateEmailConfig: async (
    configData: UpdateEmailConfigData,
  ): Promise<EmailConfig> => {
    const { data } = await apiClient.put<ApiResponse<EmailConfig>>(
      '/site-config/emails/settings',
      configData,
    );
    return data.data;
  },
};
```

---

---

## 1️⃣3️⃣ Utilidades de Manejo de Errores

### `src/lib/error-handler.ts`

```typescript
import { AxiosError } from 'axios';
import { ApiError } from '@/types/api';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    return new AppError(
      apiError?.message || 'Ocurrió un error inesperado',
      apiError?.statusCode || error.response?.status || 500,
    );
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError('Ocurrió un error inesperado');
};

export const getErrorMessage = (error: unknown): string => {
  const appError = handleApiError(error);
  return appError.message;
};
```

### Actualizar `src/lib/api.ts` con manejo de errores

```typescript
import axios, { AxiosError } from 'axios';
import { handleApiError } from './error-handler';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(handleApiError(error));
  },
);

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(handleApiError(error));
  },
);
```

---

## 🎯 Checklist de Verificación - Fase 2

Verificar que todos los archivos estén creados:

### Tipos TypeScript

- [ ] `src/types/user.ts`
- [ ] `src/types/course.ts`
- [ ] `src/types/cart.ts`
- [ ] `src/types/coupon.ts`
- [ ] `src/types/order.ts`
- [ ] `src/types/email.ts`
- [ ] `src/types/api.ts`
- [ ] `src/types/checkout.ts`

### Validaciones Zod

- [ ] `src/lib/validations/auth.ts`
- [ ] `src/lib/validations/course.ts`
- [ ] `src/lib/validations/coupon.ts`

### Servicios de API

- [ ] `src/services/authService.ts`
- [ ] `src/services/coursesService.ts`
- [ ] `src/services/cartService.ts`
- [ ] `src/services/checkoutService.ts`
- [ ] `src/services/ordersService.ts`
- [ ] `src/services/couponsService.ts`
- [ ] `src/services/usersService.ts`
- [ ] `src/services/emailsService.ts`

### Configuración

- [ ] `src/lib/react-query.ts`
- [ ] `src/lib/error-handler.ts`
- [ ] `src/lib/api.ts` actualizado
- [ ] `src/app/layout.tsx` actualizado con QueryClientProvider

### Comandos para verificar:

```bash
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

1. **8 archivos de tipos TypeScript** con todas las interfaces del proyecto
2. **3 archivos de validación Zod** para formularios
3. **8 servicios de API** con métodos completos para comunicación con el backend
4. **Configuración de React Query** para manejo de estado del servidor
5. **Sistema de manejo de errores** centralizado
6. **Cliente HTTP Axios** con interceptores

Todos los servicios están **listos para ser utilizados** en los hooks personalizados que crearemos en la Fase 3.

---

## 🚀 Siguiente Paso

Una vez completados todos los archivos de esta fase:

**✅ FASE 2 COMPLETA - Continuar con → [FASE 03 - Stores Zustand y Custom Hooks](./FRONTEND-03-STORES-HOOKS.md)**
