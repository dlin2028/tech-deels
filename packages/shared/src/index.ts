import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const dealSubmitSchema = z.object({
  title: z.string().min(10).max(200),
  url: z.string().url(),
  price: z.coerce.number().positive(),
  originalPrice: z.coerce.number().positive().optional(),
  shippingCost: z.coerce.number().min(0).default(0),
  currency: z.string().default('USD'),
  description: z.string().max(2000).optional(),
  categoryId: z.coerce.number().int().positive(),
  merchantId: z.coerce.number().int().positive().optional(),
});

export const commentSchema = z.object({
  body: z.string().min(1).max(5000),
  dealId: z.coerce.number().int().positive(),
  parentId: z.coerce.number().int().positive().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type DealSubmitInput = z.infer<typeof dealSubmitSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
