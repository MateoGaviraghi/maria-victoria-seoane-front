'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { checkoutService } from '@/services/checkoutService';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-handler';
import { CheckoutData } from '@/types/checkout';

export const useCheckout = () => {
  const summaryQuery = useQuery({
    queryKey: ['checkout-summary'],
    queryFn: () => checkoutService.getSummary(),
  });

  const createCheckoutMutation = useMutation({
    mutationFn: (checkoutData: CheckoutData) => checkoutService.createCheckout(checkoutData),
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const validateCheckoutMutation = useMutation({
    mutationFn: (payload: { dni: string; phone: string }) =>
      checkoutService.validateCheckout(payload),
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    summary: summaryQuery.data,
    isLoadingSummary: summaryQuery.isLoading,
    createCheckout: createCheckoutMutation.mutate,
    isCreatingCheckout: createCheckoutMutation.isPending,
    checkoutData: createCheckoutMutation.data,
    validateCheckout: validateCheckoutMutation.mutate,
    isValidatingCheckout: validateCheckoutMutation.isPending,
    validationResult: validateCheckoutMutation.data,
  };
};
