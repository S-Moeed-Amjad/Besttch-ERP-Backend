import { z } from "zod";

export const createProductSchema = z.object({
  sku: z.string().trim().min(1, "SKU is required").max(50),

  barcode: z.string().trim().min(1, "Barcode is required").max(50),

  name: z.string().trim().min(2, "Product name is required").max(200),

  description: z.string().trim().optional().nullable(),

  unit: z.string().trim().max(20).default("piece"),

  isActive: z.boolean().optional().default(true),
});

export const updateProductSchema = z.object({
  sku: z.string().trim().min(1).max(50).optional(),

  barcode: z.string().trim().min(1).max(50).optional(),

  name: z.string().trim().min(2).max(200).optional(),

  description: z.string().trim().optional().nullable(),

  unit: z.string().trim().max(20).optional(),

  isActive: z.boolean().optional(),
});

export const listProductsQuerySchema = z.object({
  search: z.string().trim().optional(),

  page: z.coerce.number().int().min(1).default(1),

  per_page: z.coerce.number().int().min(1).max(100).default(20),
});
