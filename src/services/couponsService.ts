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
  validateCoupon: async (couponData: ValidateCouponData): Promise<ValidateCouponResponse> => {
    const { data } = await apiClient.post<ApiResponse<ValidateCouponResponse>>(
      '/coupons/validate',
      couponData
    );
    return data.data;
  },

  getAllCoupons: async (): Promise<{ coupons: Coupon[]; total: number }> => {
    const { data } =
      await apiClient.get<ApiResponse<{ coupons: Coupon[]; total: number }>>('/coupons');
    return data.data;
  },

  createCoupon: async (couponData: CreateCouponData): Promise<Coupon> => {
    const { data } = await apiClient.post<ApiResponse<Coupon>>('/coupons', couponData);
    return data.data;
  },

  updateCoupon: async (id: string, couponData: UpdateCouponData): Promise<Coupon> => {
    const { data } = await apiClient.put<ApiResponse<Coupon>>(`/coupons/${id}`, couponData);
    return data.data;
  },

  deleteCoupon: async (id: string): Promise<void> => {
    await apiClient.delete(`/coupons/${id}`);
  },

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
