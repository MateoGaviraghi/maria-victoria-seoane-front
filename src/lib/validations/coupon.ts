import { z } from 'zod';
import { CouponType } from '@/types/coupon';

export const createCouponSchema = z.object({
  code: z
    .string()
    .min(3, 'El código debe tener al menos 3 caracteres')
    .max(20, 'El código no puede tener más de 20 caracteres')
    .toUpperCase(),
  type: z.nativeEnum(CouponType),
  value: z.number().min(0, 'El descuento debe ser mayor o igual a 0'),
  minPurchase: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  maxUses: z.number().min(1).optional(),
  maxUsesPerUser: z.number().min(1).optional(),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
  description: z.string().optional(),
  courseIds: z.array(z.string()).optional(),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1, 'Ingresa un código de cupón'),
});

export type CreateCouponFormData = z.infer<typeof createCouponSchema>;
export type ValidateCouponFormData = z.infer<typeof validateCouponSchema>;
