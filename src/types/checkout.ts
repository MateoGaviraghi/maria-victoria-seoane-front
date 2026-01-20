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
