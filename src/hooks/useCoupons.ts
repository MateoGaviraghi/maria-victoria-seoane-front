'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { couponsService } from '@/services/couponsService';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-handler';
import { CreateCouponData, UpdateCouponData, ValidateCouponData } from '@/types/coupon';
import { useCartStore } from '@/store/cartStore';

export const useValidateCoupon = () => {
  const { applyCoupon } = useCartStore();

  return useMutation({
    mutationFn: (data: ValidateCouponData) => couponsService.validateCoupon(data),
    onSuccess: (result, variables) => {
      if (result.valid) {
        applyCoupon(variables.code, result.discountAmount || 0);
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

  return {
    coupons: coupons?.coupons || [],
    total: coupons?.total,
    isLoading,
    error,
  };
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

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCouponData }) =>
      couponsService.updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Cupón actualizado');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useCouponStats = () => {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['coupons-stats'],
    queryFn: () => couponsService.getStats(),
  });

  return { stats, isLoading, error };
};
