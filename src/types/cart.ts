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
