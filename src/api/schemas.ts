import { z } from 'zod';

/**
 * Response contracts. Parsing responses through these catches breaking API changes
 * (missing / renamed / retyped fields) that status-code checks alone would miss.
 */
export const LoginResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
});

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number().nonnegative(),
});

export const ProductListSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const ErrorSchema = z.object({ message: z.string() });

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type User = z.infer<typeof UserSchema>;
export type Product = z.infer<typeof ProductSchema>;
