'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cartService';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-handler';
import { AddToCartData } from '@/types/cart';

export const useCart = () => {
  const queryClient = useQueryClient();
  const { setCartData, clearCart: clearCartStore } = useCartStore();

  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const cartData = await cartService.getCart();
      setCartData(cartData.itemCount, cartData.total, cartData.discount);
      return cartData;
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: (data: AddToCartData) => cartService.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Curso agregado al carrito');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (courseId: string) => cartService.removeFromCart(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Curso eliminado del carrito');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      clearCartStore();
      toast.success('Carrito vaciado');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    cart,
    isLoading,
    error,
    addToCart: addToCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    removeFromCart: removeFromCartMutation.mutate,
    isRemovingFromCart: removeFromCartMutation.isPending,
    clearCart: clearCartMutation.mutate,
    isClearingCart: clearCartMutation.isPending,
  };
};
