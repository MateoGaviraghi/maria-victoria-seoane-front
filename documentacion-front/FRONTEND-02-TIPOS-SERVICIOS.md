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
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum SubscriptionType {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  birthDate?: string | null;
  emailVerified: boolean;
  subscriptionType: SubscriptionType;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
```

### `src/types/course.ts`

```typescript
export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration: number; // en segundos
  orderIndex: number;
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: CourseLevel;
  price: number;
  thumbnail?: string;
  videoPreview?: string;
  duration: number; // duración total en segundos
  categoryId: string;
  category?: CourseCategory;
  lessons?: Lesson[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  level: CourseLevel;
  price: number;
  categoryId: string;
  thumbnail?: File;
  videoPreview?: File;
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  level?: CourseLevel;
  price?: number;
  categoryId?: string;
  isActive?: boolean;
  thumbnail?: File;
  videoPreview?: File;
}

export interface CreateLessonData {
  title: string;
  description?: string;
  orderIndex: number;
  isFree: boolean;
  video: File;
}

export interface UpdateLessonData {
  title?: string;
  description?: string;
  orderIndex?: number;
  isFree?: boolean;
  video?: File;
}
```

### `src/types/cart.ts`

```typescript
import { Course } from './course';

export interface CartItem {
  id: string;
  userId: string;
  courseId: string;
  course?: Course;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  discount: number;
  subtotal: number;
}

export interface AddToCartData {
  courseId: string;
}
```

### `src/types/coupon.ts`

```typescript
export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  discount: number;
  expiresAt?: string | null;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponData {
  code: string;
  type: CouponType;
  discount: number;
  expiresAt?: string;
  usageLimit?: number;
}

export interface ValidateCouponData {
  code: string;
  total: number;
}

export interface ValidateCouponResponse {
  valid: boolean;
  discount: number;
  message?: string;
}
```

### `src/types/order.ts`

```typescript
import { Course } from './course';
import { User } from './user';

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  MERCADOPAGO = 'MERCADOPAGO',
}

export interface OrderItem {
  id: string;
  orderId: string;
  courseId: string;
  course?: Course;
  price: number;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  total: number;
  discount: number;
  finalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  mercadoPagoId?: string | null;
  couponCode?: string | null;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  couponCode?: string;
}

export interface MercadoPagoPreferenceResponse {
  preferenceId: string;
  initPoint: string;
}
```

### `src/types/enrollment.ts`

```typescript
import { Course } from './course';
import { Lesson } from './course';

export interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  lesson?: Lesson;
  completed: boolean;
  watchedDuration: number; // segundos vistos
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  course?: Course;
  progress: number; // 0-100 porcentaje
  enrolledAt: string;
  completedAt?: string | null;
  lessonProgress?: LessonProgress[];
}

export interface UpdateLessonProgressData {
  lessonId: string;
  watchedDuration: number;
  completed: boolean;
}
```

### `src/types/email.ts`

```typescript
export interface EmailLog {
  id: string;
  userId: string;
  type: string;
  subject: string;
  to: string;
  status: 'sent' | 'failed';
  sentAt: string;
  error?: string | null;
}

export interface EmailConfig {
  cartAbandonedEnabled: boolean;
  birthdayEmailsEnabled: boolean;
  cartAbandoned1hHours: number;
  cartAbandoned24hHours: number;
  cartAbandoned72hHours: number;
  firstCouponDiscount: number;
  secondCouponDiscount: number;
}

export interface UpdateEmailConfigData {
  cartAbandonedEnabled?: boolean;
  birthdayEmailsEnabled?: boolean;
  cartAbandoned1hHours?: number;
  cartAbandoned24hHours?: number;
  cartAbandoned72hHours?: number;
  firstCouponDiscount?: number;
  secondCouponDiscount?: number;
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

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalStudents: number;
  totalCourses: number;
  revenueGrowth: number; // porcentaje
  ordersGrowth: number;
  studentsGrowth: number;
}

export interface SalesChartData {
  date: string;
  revenue: number;
  orders: number;
}
```

---

## 2️⃣ Schemas de Validación con Zod

### `src/lib/validations/auth.ts`

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
    birthDate: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
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
  birthDate: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Contraseña actual requerida'),
    newPassword: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmNewPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
```

### `src/lib/validations/course.ts`

```typescript
import { z } from 'zod';
import { CourseLevel } from '@/types/course';

export const createCourseSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres'),
  level: z.nativeEnum(CourseLevel),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
});

export const updateCourseSchema = createCourseSchema.partial();

export const createLessonSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  orderIndex: z.number().min(0),
  isFree: z.boolean(),
});

export const updateLessonSchema = createLessonSchema.partial();

export type CreateCourseFormData = z.infer<typeof createCourseSchema>;
export type UpdateCourseFormData = z.infer<typeof updateCourseSchema>;
export type CreateLessonFormData = z.infer<typeof createLessonSchema>;
export type UpdateLessonFormData = z.infer<typeof updateLessonSchema>;
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
  discount: z.number().min(0, 'El descuento debe ser mayor o igual a 0'),
  expiresAt: z.string().optional(),
  usageLimit: z.number().min(1).optional(),
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
  ): Promise<{ accessToken: string; user: User }> => {
    const { data } = await apiClient.post<
      ApiResponse<{ accessToken: string; user: User }>
    >('/auth/login', credentials);
    return data.data;
  },

  // Registro
  register: async (userData: RegisterData): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/register',
      userData,
    );
    return data.data;
  },

  // Obtener perfil actual
  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>('/auth/profile');
    return data.data;
  },

  // Actualizar perfil
  updateProfile: async (profileData: UpdateProfileData): Promise<User> => {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      '/auth/profile',
      profileData,
    );
    return data.data;
  },

  // Cambiar contraseña
  changePassword: async (
    passwordData: ChangePasswordData,
  ): Promise<{ message: string }> => {
    const { data } = await apiClient.patch<ApiResponse<{ message: string }>>(
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
      `/auth/verify-email/${token}`,
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
  Lesson,
  CourseCategory,
  CreateCourseData,
  UpdateCourseData,
  CreateLessonData,
  UpdateLessonData,
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
  getCourseById: async (id: string): Promise<Course> => {
    const { data } = await apiClient.get<ApiResponse<Course>>(`/courses/${id}`);
    return data.data;
  },

  // Obtener curso por slug (público)
  getCourseBySlug: async (slug: string): Promise<Course> => {
    const { data } = await apiClient.get<ApiResponse<Course>>(
      `/courses/slug/${slug}`,
    );
    return data.data;
  },

  // Crear curso (ADMIN/TEACHER)
  createCourse: async (courseData: CreateCourseData): Promise<Course> => {
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('description', courseData.description);
    formData.append('level', courseData.level);
    formData.append('price', courseData.price.toString());
    formData.append('categoryId', courseData.categoryId);

    if (courseData.thumbnail) {
      formData.append('thumbnail', courseData.thumbnail);
    }
    if (courseData.videoPreview) {
      formData.append('videoPreview', courseData.videoPreview);
    }

    const { data } = await apiClient.post<ApiResponse<Course>>(
      '/courses',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return data.data;
  },

  // Actualizar curso (ADMIN/TEACHER)
  updateCourse: async (
    id: string,
    courseData: UpdateCourseData,
  ): Promise<Course> => {
    const formData = new FormData();

    if (courseData.title) formData.append('title', courseData.title);
    if (courseData.description)
      formData.append('description', courseData.description);
    if (courseData.level) formData.append('level', courseData.level);
    if (courseData.price !== undefined)
      formData.append('price', courseData.price.toString());
    if (courseData.categoryId)
      formData.append('categoryId', courseData.categoryId);
    if (courseData.isActive !== undefined)
      formData.append('isActive', courseData.isActive.toString());
    if (courseData.thumbnail)
      formData.append('thumbnail', courseData.thumbnail);
    if (courseData.videoPreview)
      formData.append('videoPreview', courseData.videoPreview);

    const { data } = await apiClient.patch<ApiResponse<Course>>(
      `/courses/${id}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return data.data;
  },

  // Eliminar curso (ADMIN)
  deleteCourse: async (id: string): Promise<void> => {
    await apiClient.delete(`/courses/${id}`);
  },

  // ===== LECCIONES =====

  // Obtener lecciones de un curso
  getCourseLessons: async (courseId: string): Promise<Lesson[]> => {
    const { data } = await apiClient.get<ApiResponse<Lesson[]>>(
      `/courses/${courseId}/lessons`,
    );
    return data.data;
  },

  // Crear lección (ADMIN/TEACHER)
  createLesson: async (
    courseId: string,
    lessonData: CreateLessonData,
  ): Promise<Lesson> => {
    const formData = new FormData();
    formData.append('title', lessonData.title);
    if (lessonData.description)
      formData.append('description', lessonData.description);
    formData.append('orderIndex', lessonData.orderIndex.toString());
    formData.append('isFree', lessonData.isFree.toString());
    formData.append('video', lessonData.video);

    const { data } = await apiClient.post<ApiResponse<Lesson>>(
      `/courses/${courseId}/lessons`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return data.data;
  },

  // Actualizar lección (ADMIN/TEACHER)
  updateLesson: async (
    courseId: string,
    lessonId: string,
    lessonData: UpdateLessonData,
  ): Promise<Lesson> => {
    const formData = new FormData();

    if (lessonData.title) formData.append('title', lessonData.title);
    if (lessonData.description)
      formData.append('description', lessonData.description);
    if (lessonData.orderIndex !== undefined)
      formData.append('orderIndex', lessonData.orderIndex.toString());
    if (lessonData.isFree !== undefined)
      formData.append('isFree', lessonData.isFree.toString());
    if (lessonData.video) formData.append('video', lessonData.video);

    const { data } = await apiClient.patch<ApiResponse<Lesson>>(
      `/courses/${courseId}/lessons/${lessonId}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return data.data;
  },

  // Eliminar lección (ADMIN/TEACHER)
  deleteLesson: async (courseId: string, lessonId: string): Promise<void> => {
    await apiClient.delete(`/courses/${courseId}/lessons/${lessonId}`);
  },

  // ===== CATEGORÍAS =====

  // Obtener todas las categorías
  getCategories: async (): Promise<CourseCategory[]> => {
    const { data } =
      await apiClient.get<ApiResponse<CourseCategory[]>>('/categories');
    return data.data;
  },
};
```

---

## 6️⃣ Servicios de API - Cart & Checkout

### `src/services/cartService.ts`

```typescript
import { apiClient } from '@/lib/api';
import { Cart, CartItem, AddToCartData } from '@/types/cart';
import { ApiResponse } from '@/types/api';

export const cartService = {
  // Obtener carrito actual
  getCart: async (): Promise<Cart> => {
    const { data } = await apiClient.get<ApiResponse<Cart>>('/cart');
    return data.data;
  },

  // Agregar curso al carrito
  addToCart: async (cartData: AddToCartData): Promise<CartItem> => {
    const { data } = await apiClient.post<ApiResponse<CartItem>>(
      '/cart',
      cartData,
    );
    return data.data;
  },

  // Eliminar curso del carrito
  removeFromCart: async (itemId: string): Promise<void> => {
    await apiClient.delete(`/cart/${itemId}`);
  },

  // Vaciar carrito
  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart');
  },
};
```

### `src/services/checkoutService.ts`

```typescript
import { apiClient } from '@/lib/api';
import { CreateOrderData, MercadoPagoPreferenceResponse } from '@/types/order';
import { ApiResponse } from '@/types/api';

export const checkoutService = {
  // Crear preferencia de MercadoPago
  createMercadoPagoPreference: async (
    orderData: CreateOrderData,
  ): Promise<MercadoPagoPreferenceResponse> => {
    const { data } = await apiClient.post<
      ApiResponse<MercadoPagoPreferenceResponse>
    >('/checkout/mercadopago/create-preference', orderData);
    return data.data;
  },
};
```

---

## 7️⃣ Servicios de API - Orders

### `src/services/ordersService.ts`

```typescript
import { apiClient } from '@/lib/api';
import { Order } from '@/types/order';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

export const ordersService = {
  // Obtener mis órdenes
  getMyOrders: async (
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Order>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>(
      '/orders/my',
      {
        params,
      },
    );
    return data.data;
  },

  // Obtener orden por ID
  getOrderById: async (id: string): Promise<Order> => {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return data.data;
  },

  // Obtener todas las órdenes (ADMIN)
  getAllOrders: async (
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Order>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>(
      '/orders',
      {
        params,
      },
    );
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
  getAllCoupons: async (): Promise<Coupon[]> => {
    const { data } = await apiClient.get<ApiResponse<Coupon[]>>('/coupons');
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

  // Eliminar cupón (ADMIN)
  deleteCoupon: async (id: string): Promise<void> => {
    await apiClient.delete(`/coupons/${id}`);
  },

  // Activar/Desactivar cupón (ADMIN)
  toggleCoupon: async (id: string): Promise<Coupon> => {
    const { data } = await apiClient.patch<ApiResponse<Coupon>>(
      `/coupons/${id}/toggle`,
    );
    return data.data;
  },
};
```

---

## 9️⃣ Servicios de API - Enrollments

### `src/services/enrollmentsService.ts`

```typescript
import { apiClient } from '@/lib/api';
import {
  Enrollment,
  UpdateLessonProgressData,
  LessonProgress,
} from '@/types/enrollment';
import { ApiResponse } from '@/types/api';

export const enrollmentsService = {
  // Obtener mis inscripciones
  getMyEnrollments: async (): Promise<Enrollment[]> => {
    const { data } =
      await apiClient.get<ApiResponse<Enrollment[]>>('/enrollments/my');
    return data.data;
  },

  // Obtener inscripción específica con progreso
  getEnrollmentById: async (id: string): Promise<Enrollment> => {
    const { data } = await apiClient.get<ApiResponse<Enrollment>>(
      `/enrollments/${id}`,
    );
    return data.data;
  },

  // Actualizar progreso de lección
  updateLessonProgress: async (
    enrollmentId: string,
    progressData: UpdateLessonProgressData,
  ): Promise<LessonProgress> => {
    const { data } = await apiClient.patch<ApiResponse<LessonProgress>>(
      `/enrollments/${enrollmentId}/progress`,
      progressData,
    );
    return data.data;
  },
};
```

---

## 🔟 Servicios de API - Users (Admin)

### `src/services/usersService.ts`

```typescript
import { apiClient } from '@/lib/api';
import { User } from '@/types/user';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

export const usersService = {
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
    const { data } = await apiClient.patch<ApiResponse<User>>(
      `/users/${id}/role`,
      { role },
    );
    return data.data;
  },

  // Eliminar usuario (SUPER_ADMIN)
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
```

---

## 1️⃣1️⃣ Servicios de API - Emails (Admin)

### `src/services/emailsService.ts`

```typescript
import { apiClient } from '@/lib/api';
import { EmailLog, EmailConfig, UpdateEmailConfigData } from '@/types/email';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

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

## 1️⃣2️⃣ Servicios de API - Dashboard (Admin)

### `src/services/dashboardService.ts`

```typescript
import { apiClient } from '@/lib/api';
import { DashboardStats, SalesChartData } from '@/types/api';
import { ApiResponse } from '@/types/api';

export const dashboardService = {
  // Obtener estadísticas del dashboard (ADMIN)
  getStats: async (): Promise<DashboardStats> => {
    const { data } =
      await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return data.data;
  },

  // Obtener datos de ventas para gráficos (ADMIN)
  getSalesData: async (days: number = 30): Promise<SalesChartData[]> => {
    const { data } = await apiClient.get<ApiResponse<SalesChartData[]>>(
      '/dashboard/sales',
      {
        params: { days },
      },
    );
    return data.data;
  },
};
```

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
- [ ] `src/types/enrollment.ts`
- [ ] `src/types/email.ts`
- [ ] `src/types/api.ts`

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
- [ ] `src/services/enrollmentsService.ts`
- [ ] `src/services/usersService.ts`
- [ ] `src/services/emailsService.ts`
- [ ] `src/services/dashboardService.ts`

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
3. **10 servicios de API** con métodos completos para comunicación con el backend
4. **Configuración de React Query** para manejo de estado del servidor
5. **Sistema de manejo de errores** centralizado
6. **Cliente HTTP Axios** con interceptores

Todos los servicios están **listos para ser utilizados** en los hooks personalizados que crearemos en la Fase 3.

---

## 🚀 Siguiente Paso

Una vez completados todos los archivos de esta fase:

**✅ FASE 2 COMPLETA - Continuar con → [FASE 03 - Stores Zustand y Custom Hooks](./FRONTEND-03-STORES-HOOKS.md)**
