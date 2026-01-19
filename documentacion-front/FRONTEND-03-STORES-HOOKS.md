# 🗄️ FASE 03 - Stores Zustand y Custom Hooks

## 📋 Objetivos de esta Fase

En esta fase vamos a:

1. ✅ Crear stores de Zustand para manejo de estado global
2. ✅ Implementar custom hooks con React Query para cada servicio
3. ✅ Crear hooks de utilidad para la UI
4. ✅ Configurar persistencia de estado con localStorage

---

## 1️⃣ Zustand Stores - Auth Store

### `src/store/authStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('access_token', token);
        set({ user, accessToken: token, isAuthenticated: true });
      },

      updateUser: (user) => {
        set({ user });
      },

      logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
```

---

## 2️⃣ Zustand Stores - Cart Store

### `src/store/cartStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  itemCount: number;
  total: number;
  discount: number;
  couponCode: string | null;
  setCartData: (itemCount: number, total: number, discount: number) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      itemCount: 0,
      total: 0,
      discount: 0,
      couponCode: null,

      setCartData: (itemCount, total, discount) => {
        set({ itemCount, total, discount });
      },

      applyCoupon: (code, discount) => {
        set({ couponCode: code, discount });
      },

      removeCoupon: () => {
        set({ couponCode: null, discount: 0 });
      },

      clearCart: () => {
        set({ itemCount: 0, total: 0, discount: 0, couponCode: null });
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
);
```

---

## 3️⃣ Zustand Stores - UI Store

### `src/store/uiStore.ts`

```typescript
import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isLoading: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isLoading: false,

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
```

---

## 4️⃣ Custom Hooks - useAuth

### `src/hooks/useAuth.ts`

```typescript
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
} from '@/types/user';
import { getErrorMessage } from '@/lib/error-handler';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setAuth, updateUser, logout: storeLogout } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success('Inicio de sesión exitoso');
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: () => {
      toast.success(
        'Cuenta creada exitosamente. Revisa tu email para verificar tu cuenta.',
      );
      router.push('/auth/login');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Get profile query
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    enabled: !!user,
    retry: false,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (profileData: UpdateProfileData) =>
      authService.updateProfile(profileData),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Perfil actualizado exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (passwordData: ChangePasswordData) =>
      authService.changePassword(passwordData),
    onSuccess: () => {
      toast.success('Contraseña cambiada exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Resend verification email mutation
  const resendVerificationMutation = useMutation({
    mutationFn: () => authService.resendVerificationEmail(),
    onSuccess: () => {
      toast.success('Email de verificación enviado');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: () => {
      toast.success('Email verificado exitosamente');
      router.push('/auth/login');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Logout
  const logout = () => {
    authService.logout();
    storeLogout();
    queryClient.clear();
    toast.success('Sesión cerrada');
    router.push('/');
  };

  return {
    user,
    profile,
    isLoadingProfile,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
    resendVerification: resendVerificationMutation.mutate,
    isResendingVerification: resendVerificationMutation.isPending,
    verifyEmail: verifyEmailMutation.mutate,
    isVerifyingEmail: verifyEmailMutation.isPending,
    logout,
  };
};
```

---

## 5️⃣ Custom Hooks - useCourses

### `src/hooks/useCourses.ts`

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesService } from '@/services/coursesService';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-handler';
import {
  CreateCourseData,
  UpdateCourseData,
  CreateLessonData,
  UpdateLessonData,
} from '@/types/course';
import { PaginationParams } from '@/types/api';

export const useCourses = (params?: PaginationParams) => {
  const queryClient = useQueryClient();

  // Get all courses
  const {
    data: coursesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['courses', params],
    queryFn: () => coursesService.getCourses(params),
  });

  return {
    courses: coursesData?.data || [],
    meta: coursesData?.meta,
    isLoading,
    error,
  };
};

export const useCourse = (id: string) => {
  const {
    data: course,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesService.getCourseById(id),
    enabled: !!id,
  });

  return { course, isLoading, error };
};

export const useCourseBySlug = (slug: string) => {
  const {
    data: course,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['course', 'slug', slug],
    queryFn: () => coursesService.getCourseBySlug(slug),
    enabled: !!slug,
  });

  return { course, isLoading, error };
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseData: CreateCourseData) =>
      coursesService.createCourse(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Curso creado exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseData }) =>
      coursesService.updateCourse(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', variables.id] });
      toast.success('Curso actualizado exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => coursesService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Curso eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ===== LESSONS HOOKS =====

export const useCourseLessons = (courseId: string) => {
  const {
    data: lessons,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['lessons', courseId],
    queryFn: () => coursesService.getCourseLessons(courseId),
    enabled: !!courseId,
  });

  return { lessons: lessons || [], isLoading, error };
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: CreateLessonData;
    }) => coursesService.createLesson(courseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['lessons', variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ['course', variables.courseId],
      });
      toast.success('Lección creada exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonId,
      data,
    }: {
      courseId: string;
      lessonId: string;
      data: UpdateLessonData;
    }) => coursesService.updateLesson(courseId, lessonId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['lessons', variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ['course', variables.courseId],
      });
      toast.success('Lección actualizada exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonId,
    }: {
      courseId: string;
      lessonId: string;
    }) => coursesService.deleteLesson(courseId, lessonId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['lessons', variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ['course', variables.courseId],
      });
      toast.success('Lección eliminada exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ===== CATEGORIES HOOK =====

export const useCategories = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => coursesService.getCategories(),
  });

  return { categories: categories || [], isLoading, error };
};
```

---

## 6️⃣ Custom Hooks - useCart

### `src/hooks/useCart.ts`

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cartService';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-handler';
import { AddToCartData } from '@/types/cart';

export const useCart = () => {
  const queryClient = useQueryClient();
  const { setCartData, clearCart: clearCartStore } = useCartStore();

  // Get cart
  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const cartData = await cartService.getCart();
      setCartData(cartData.items.length, cartData.total, cartData.discount);
      return cartData;
    },
  });

  // Add to cart
  const addToCartMutation = useMutation({
    mutationFn: (data: AddToCartData) => cartService.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Curso agregado al carrito');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Remove from cart
  const removeFromCartMutation = useMutation({
    mutationFn: (itemId: string) => cartService.removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Curso eliminado del carrito');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Clear cart
  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      clearCartStore();
      toast.success('Carrito vaciado');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    cart,
    isLoading,
    error,
    addToCart: addToCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    removeFromCart: removeFromCartMutation.mutate,
    isRemovingFromCart: removeFromCartMutation.isPending,
    clearCart: clearCartMutation.mutate,
    isClearingCart: clearCartMutation.isPending,
  };
};
```

---

## 7️⃣ Custom Hooks - useCheckout

### `src/hooks/useCheckout.ts`

```typescript
'use client';

import { useMutation } from '@tanstack/react-query';
import { checkoutService } from '@/services/checkoutService';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-handler';
import { CreateOrderData } from '@/types/order';

export const useCheckout = () => {
  const createPreferenceMutation = useMutation({
    mutationFn: (orderData: CreateOrderData) =>
      checkoutService.createMercadoPagoPreference(orderData),
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    createPreference: createPreferenceMutation.mutate,
    isCreatingPreference: createPreferenceMutation.isPending,
    preferenceData: createPreferenceMutation.data,
  };
};
```

---

## 8️⃣ Custom Hooks - useOrders

### `src/hooks/useOrders.ts`

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { ordersService } from '@/services/ordersService';
import { PaginationParams } from '@/types/api';

export const useMyOrders = (params?: PaginationParams) => {
  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['my-orders', params],
    queryFn: () => ordersService.getMyOrders(params),
  });

  return {
    orders: ordersData?.data || [],
    meta: ordersData?.meta,
    isLoading,
    error,
  };
};

export const useOrder = (id: string) => {
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersService.getOrderById(id),
    enabled: !!id,
  });

  return { order, isLoading, error };
};

export const useAllOrders = (params?: PaginationParams) => {
  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['all-orders', params],
    queryFn: () => ordersService.getAllOrders(params),
  });

  return {
    orders: ordersData?.data || [],
    meta: ordersData?.meta,
    isLoading,
    error,
  };
};
```

---

## 9️⃣ Custom Hooks - useCoupons

### `src/hooks/useCoupons.ts`

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { couponsService } from '@/services/couponsService';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-handler';
import { CreateCouponData, ValidateCouponData } from '@/types/coupon';
import { useCartStore } from '@/store/cartStore';

export const useValidateCoupon = () => {
  const { applyCoupon } = useCartStore();

  return useMutation({
    mutationFn: (data: ValidateCouponData) =>
      couponsService.validateCoupon(data),
    onSuccess: (result, variables) => {
      if (result.valid) {
        applyCoupon(variables.code, result.discount);
        toast.success('Cupón aplicado exitosamente');
      } else {
        toast.error(result.message || 'Cupón inválido');
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useAllCoupons = () => {
  const {
    data: coupons,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => couponsService.getAllCoupons(),
  });

  return { coupons: coupons || [], isLoading, error };
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCouponData) => couponsService.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Cupón creado exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => couponsService.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Cupón eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useToggleCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => couponsService.toggleCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Estado del cupón actualizado');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
```

---

## 🔟 Custom Hooks - useEnrollments

### `src/hooks/useEnrollments.ts`

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsService } from '@/services/enrollmentsService';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-handler';
import { UpdateLessonProgressData } from '@/types/enrollment';

export const useMyEnrollments = () => {
  const {
    data: enrollments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentsService.getMyEnrollments(),
  });

  return { enrollments: enrollments || [], isLoading, error };
};

export const useEnrollment = (id: string) => {
  const {
    data: enrollment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['enrollment', id],
    queryFn: () => enrollmentsService.getEnrollmentById(id),
    enabled: !!id,
  });

  return { enrollment, isLoading, error };
};

export const useUpdateLessonProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      enrollmentId,
      data,
    }: {
      enrollmentId: string;
      data: UpdateLessonProgressData;
    }) => enrollmentsService.updateLessonProgress(enrollmentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['enrollment', variables.enrollmentId],
      });
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
```

---

## 1️⃣1️⃣ Custom Hooks - useUsers (Admin)

### `src/hooks/useUsers.ts`

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/usersService';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-handler';
import { PaginationParams } from '@/types/api';

export const useAllUsers = (params?: PaginationParams) => {
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users', params],
    queryFn: () => usersService.getAllUsers(params),
  });

  return {
    users: usersData?.data || [],
    meta: usersData?.meta,
    isLoading,
    error,
  };
};

export const useUser = (id: string) => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
  });

  return { user, isLoading, error };
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      usersService.updateUserRole(id, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      toast.success('Rol actualizado exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
```

---

## 1️⃣2️⃣ Custom Hooks - useEmails (Admin)

### `src/hooks/useEmails.ts`

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emailsService } from '@/services/emailsService';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-handler';
import { PaginationParams } from '@/types/api';
import { UpdateEmailConfigData } from '@/types/email';

export const useEmailLogs = (params?: PaginationParams) => {
  const {
    data: logsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['email-logs', params],
    queryFn: () => emailsService.getEmailLogs(params),
  });

  return {
    logs: logsData?.data || [],
    meta: logsData?.meta,
    isLoading,
    error,
  };
};

export const useEmailConfig = () => {
  const {
    data: config,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['email-config'],
    queryFn: () => emailsService.getEmailConfig(),
  });

  return { config, isLoading, error };
};

export const useUpdateEmailConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEmailConfigData) =>
      emailsService.updateEmailConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-config'] });
      toast.success('Configuración actualizada exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
```

---

## 1️⃣3️⃣ Custom Hooks - useDashboard (Admin)

### `src/hooks/useDashboard.ts`

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';

export const useDashboardStats = () => {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
  });

  return { stats, isLoading, error };
};

export const useSalesData = (days: number = 30) => {
  const {
    data: salesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['sales-data', days],
    queryFn: () => dashboardService.getSalesData(days),
  });

  return { salesData: salesData || [], isLoading, error };
};
```

---

## 1️⃣4️⃣ Custom Hooks - Utilidades UI

### `src/hooks/useToast.ts`

```typescript
'use client';

import { toast as sonnerToast } from 'sonner';

export const useToast = () => {
  const toast = {
    success: (message: string) => {
      sonnerToast.success(message);
    },
    error: (message: string) => {
      sonnerToast.error(message);
    },
    info: (message: string) => {
      sonnerToast.info(message);
    },
    warning: (message: string) => {
      sonnerToast.warning(message);
    },
    loading: (message: string) => {
      return sonnerToast.loading(message);
    },
    dismiss: (toastId?: string | number) => {
      sonnerToast.dismiss(toastId);
    },
  };

  return toast;
};
```

### `src/hooks/useDebounce.ts`

```typescript
'use client';

import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### `src/hooks/useMediaQuery.ts`

```typescript
'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// Helpers comunes
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
```

### `src/hooks/useLocalStorage.ts`

```typescript
'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

---

## 1️⃣5️⃣ Configurar Toast Provider

### Instalar Sonner

```bash
npm install sonner
```

### Actualizar `src/app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
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
          <Toaster position="top-right" richColors />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

---

## 🎯 Checklist de Verificación - Fase 3

Verificar que todos los archivos estén creados:

### Zustand Stores

- [ ] `src/store/authStore.ts`
- [ ] `src/store/cartStore.ts`
- [ ] `src/store/uiStore.ts`

### Custom Hooks - Data Fetching

- [ ] `src/hooks/useAuth.ts`
- [ ] `src/hooks/useCourses.ts`
- [ ] `src/hooks/useCart.ts`
- [ ] `src/hooks/useCheckout.ts`
- [ ] `src/hooks/useOrders.ts`
- [ ] `src/hooks/useCoupons.ts`
- [ ] `src/hooks/useEnrollments.ts`
- [ ] `src/hooks/useUsers.ts`
- [ ] `src/hooks/useEmails.ts`
- [ ] `src/hooks/useDashboard.ts`

### Custom Hooks - Utilidades

- [ ] `src/hooks/useToast.ts`
- [ ] `src/hooks/useDebounce.ts`
- [ ] `src/hooks/useMediaQuery.ts`
- [ ] `src/hooks/useLocalStorage.ts`

### Configuración

- [ ] Sonner instalado (`npm install sonner`)
- [ ] `src/app/layout.tsx` actualizado con Toaster
- [ ] Zustand persist configurado

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

1. **3 Zustand Stores** para estado global (Auth, Cart, UI)
2. **10 grupos de custom hooks** para data fetching con React Query
3. **4 hooks de utilidad** para UI (toast, debounce, media query, localStorage)
4. **Persistencia de estado** con Zustand persist
5. **Sistema de notificaciones** con Sonner

Todos los hooks están **listos para ser utilizados** en los componentes que crearemos en la siguiente fase.

---

## 💡 Ejemplos de Uso

### Uso de useAuth en un componente:

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user, logout, isLoadingProfile } = useAuth();

  if (isLoadingProfile) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Bienvenido, {user?.firstName}</h1>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

### Uso de useCourses en un componente:

```typescript
'use client';

import { useCourses } from '@/hooks/useCourses';

export default function CoursesPage() {
  const { courses, isLoading } = useCourses({ page: 1, limit: 10 });

  if (isLoading) return <div>Cargando cursos...</div>;

  return (
    <div>
      {courses.map((course) => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
}
```

### Uso de useCart en un componente:

```typescript
'use client';

import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, isLoading } = useCart();

  if (isLoading) return <div>Cargando carrito...</div>;

  return (
    <div>
      <h1>Mi Carrito ({cart?.items.length})</h1>
      {cart?.items.map((item) => (
        <div key={item.id}>
          <h3>{item.course?.title}</h3>
          <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
        </div>
      ))}
      <button onClick={clearCart}>Vaciar Carrito</button>
    </div>
  );
}
```

---

## 🚀 Siguiente Paso

Una vez completados todos los archivos de esta fase:

**✅ FASE 3 COMPLETA - Continuar con → [FASE 04 - Componentes de Layout](./FRONTEND-04-LAYOUT.md)**
