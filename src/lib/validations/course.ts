import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  shortDescription: z.string().min(10, 'La descripción corta debe tener al menos 10 caracteres'),
  longDescription: z.string().min(50, 'La descripción larga debe tener al menos 50 caracteres'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  discountPrice: z.number().min(0).optional(),
  thumbnailUrl: z.string().url().optional(),
  previewVideoUrl: z.string().url().optional(),
  duration: z.number().min(0).optional(),
  level: z.string().optional(),
  language: z.string().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  order: z.number().min(0).optional(),
  categoryIds: z.array(z.string()).optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export type CreateCourseFormData = z.infer<typeof createCourseSchema>;
export type UpdateCourseFormData = z.infer<typeof updateCourseSchema>;
