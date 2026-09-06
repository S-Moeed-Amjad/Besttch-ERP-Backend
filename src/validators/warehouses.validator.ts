import { z } from "zod";

export const createWarehouseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Warehouse name must be at least 2 characters")
    .max(150, "Warehouse name cannot exceed 150 characters"),

  code: z
    .string()
    .trim()
    .min(1, "Warehouse code is required")
    .max(30, "Warehouse code cannot exceed 30 characters"),

  address: z.string().trim().optional().nullable(),

  isActive: z.boolean().optional().default(true),
});

export const updateWarehouseSchema = z.object({
  name: z.string().trim().min(2).max(150).optional(),

  code: z.string().trim().min(1).max(30).optional(),

  address: z.string().trim().optional().nullable(),

  isActive: z.boolean().optional(),
});

export const listWarehousesQuerySchema = z.object({
  search: z.string().trim().optional(),

  isActive: z.enum(["true", "false"]).optional(),

  page: z.coerce.number().int().min(1).default(1),

  per_page: z.coerce.number().int().min(1).max(100).default(20),
});
