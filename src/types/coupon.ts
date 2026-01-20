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
