import { apiClient } from '@/lib/api';
import {
  CheckoutData,
  CheckoutResponse,
  CheckoutSummary,
  CheckoutValidationResponse,
} from '@/types/checkout';
import { ApiResponse } from '@/types/api';

export const checkoutService = {
  getSummary: async (): Promise<CheckoutSummary> => {
    const { data } = await apiClient.get<ApiResponse<CheckoutSummary>>('/checkout/summary');
    return data.data;
  },

  validateCheckout: async (payload: {
    dni: string;
    phone: string;
  }): Promise<CheckoutValidationResponse> => {
    const { data } = await apiClient.post<ApiResponse<CheckoutValidationResponse>>(
      '/checkout/validate',
      payload
    );
    return data.data;
  },

  createCheckout: async (checkoutData: CheckoutData): Promise<CheckoutResponse> => {
    const { data } = await apiClient.post<ApiResponse<CheckoutResponse>>('/checkout', checkoutData);
    return data.data;
  },
};
