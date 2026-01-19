import { apiClient } from '@/lib/api';
import { Order, OrderFilterParams } from '@/types/order';
import { ApiResponse } from '@/types/api';

export const ordersService = {
  getMyOrders: async (
    params?: OrderFilterParams
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const { data } = await apiClient.get<
      ApiResponse<{
        orders: Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>
    >('/orders/my', { params });
    return data.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return data.data;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const { data } = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/cancel`);
    return data.data;
  },

  getAllOrders: async (
    params?: OrderFilterParams
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const { data } = await apiClient.get<
      ApiResponse<{
        orders: Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>
    >('/orders', { params });
    return data.data;
  },

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
