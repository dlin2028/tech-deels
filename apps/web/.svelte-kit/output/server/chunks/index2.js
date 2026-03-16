import { z } from "zod";
const registerSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8).max(100)
});
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
const dealSubmitSchema = z.object({
  title: z.string().min(10).max(200),
  url: z.string().url(),
  price: z.coerce.number().positive(),
  originalPrice: z.coerce.number().positive().optional(),
  shippingCost: z.coerce.number().min(0).default(0),
  currency: z.string().default("USD"),
  description: z.string().max(2e3).optional(),
  categoryId: z.coerce.number().int().positive(),
  merchantId: z.coerce.number().int().positive().optional()
});
const commentSchema = z.object({
  body: z.string().min(1).max(5e3),
  dealId: z.coerce.number().int().positive(),
  parentId: z.coerce.number().int().positive().optional()
});
export {
  commentSchema as c,
  dealSubmitSchema as d,
  loginSchema as l,
  registerSchema as r
};
