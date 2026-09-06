import { z } from "zod";

export const createItemSchema = z.object({
  barcode: z
    .string()
    .trim()
    .min(1, "Barcode is required")
    .max(50, "Barcode cannot exceed 50 characters"),

  serialNumber: z
    .string()
    .trim()
    .min(1, "Serial number cannot be empty")
    .max(100, "Serial number cannot exceed 100 characters")
    .optional()
    .nullable(),

  itemName: z
    .string()
    .trim()
    .max(150, "Item name cannot exceed 150 characters")
    .optional()
    .nullable(),

  price: z.coerce
    .number()
    .finite("Price must be a valid number")
    .min(0, "Price cannot be negative"),

  warehouseId: z.coerce.number().int().positive("Warehouse is required"),

  /*
   * The fields below are only needed when
   * the barcode does not already belong
   * to an existing product.
   */

  sku: z.string().trim().max(50, "SKU cannot exceed 50 characters").optional(),

  productName: z
    .string()
    .trim()
    .max(200, "Product name cannot exceed 200 characters")
    .optional(),

  description: z.string().trim().optional().nullable(),

  unit: z
    .string()
    .trim()
    .max(20, "Unit cannot exceed 20 characters")
    .optional(),
});

export const updateItemSchema = z.object({
  itemName: z
    .string()
    .trim()
    .max(150, "Item name cannot exceed 150 characters")
    .optional()
    .nullable(),

  serialNumber: z
    .string()
    .trim()
    .max(100, "Serial number cannot exceed 100 characters")
    .optional()
    .nullable(),

  price: z.coerce
    .number()
    .finite("Price must be a valid number")
    .min(0, "Price cannot be negative")
    .optional(),

  warehouseId: z.coerce
    .number()
    .int()
    .positive("Warehouse is required")
    .optional(),
});

export const listItemsQuerySchema = z.object({
  search: z.string().trim().optional(),

  status: z.enum(["in_stock", "sold", "removed"]).optional(),

  productId: z.coerce.number().int().positive().optional(),

  warehouseId: z.coerce.number().int().positive().optional(),

  page: z.coerce.number().int().min(1).default(1),

  per_page: z.coerce.number().int().min(1).max(100).default(20),
});
