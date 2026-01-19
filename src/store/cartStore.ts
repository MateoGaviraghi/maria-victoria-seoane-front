'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  itemCount: number;
  total: number;
  discount: number;
  couponCode: string | null;
  setCartData: (itemCount: number, total: number, discount: number) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      itemCount: 0,
      total: 0,
      discount: 0,
      couponCode: null,

      setCartData: (itemCount, total, discount) => {
        set({ itemCount, total, discount });
      },

      applyCoupon: (code, discount) => {
        set({ couponCode: code, discount });
      },

      removeCoupon: () => {
        set({ couponCode: null, discount: 0 });
      },

      clearCart: () => {
        set({ itemCount: 0, total: 0, discount: 0, couponCode: null });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
