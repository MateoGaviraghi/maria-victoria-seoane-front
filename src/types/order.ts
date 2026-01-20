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
