'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '@/services/ordersService';
import { OrderFilterParams } from '@/types/order';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-handler';

export const useMyOrders = (params?: OrderFilterParams) => {
  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['my-orders', params],
    queryFn: () => ordersService.getMyOrders(params),
  });

  return {
    orders: ordersData?.orders || [],
    meta: ordersData
      ? {
          total: ordersData.total,
          page: ordersData.page,
          limit: ordersData.limit,
          totalPages: ordersData.totalPages,
        }
      : undefined,
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

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersService.cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      toast.success('Orden cancelada');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useAllOrders = (params?: OrderFilterParams) => {
  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['all-orders', params],
    queryFn: () => ordersService.getAllOrders(params),
  });

  return {
    orders: ordersData?.orders || [],
    meta: ordersData
      ? {
          total: ordersData.total,
          page: ordersData.page,
          limit: ordersData.limit,
          totalPages: ordersData.totalPages,
        }
      : undefined,
    isLoading,
    error,
  };
};
