import { apiClient } from '@/lib/api';
import {
  AddToCartData,
  ApplyCouponData,
  Cart,
  CartItemAddedResponse,
  CartItemRemovedResponse,
  CouponAppliedResponse,
} from '@/types/cart';
import { ApiResponse } from '@/types/api';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const { data } = await apiClient.get<ApiResponse<Cart>>('/cart');
    return data.data;
  },

  addToCart: async (cartData: AddToCartData): Promise<CartItemAddedResponse> => {
    const { data } = await apiClient.post<ApiResponse<CartItemAddedResponse>>('/cart', cartData);
    return data.data;
  },

  removeFromCart: async (courseId: string): Promise<CartItemRemovedResponse> => {
    const { data } = await apiClient.delete<ApiResponse<CartItemRemovedResponse>>(
      `/cart/${courseId}`
    );
    return data.data;
  },

  clearCart: async (): Promise<Cart> => {
    const { data } = await apiClient.delete<ApiResponse<Cart>>('/cart');
    return data.data;
  },

  applyCoupon: async (couponData: ApplyCouponData): Promise<CouponAppliedResponse> => {
    const { data } = await apiClient.post<ApiResponse<CouponAppliedResponse>>(
      '/cart/apply-coupon',
      couponData
    );
    return data.data;
  },

  getCount: async (): Promise<{ count: number }> => {
    const { data } = await apiClient.get<ApiResponse<{ count: number }>>('/cart/count');
    return data.data;
  },
};
