"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listItemsQuerySchema = exports.updateItemSchema = exports.createItemSchema = void 0;
const zod_1 = require("zod");
exports.createItemSchema = zod_1.z.object({
    barcode: zod_1.z
        .string()
        .trim()
        .min(1, "Barcode is required")
        .max(50, "Barcode cannot exceed 50 characters"),
    serialNumber: zod_1.z
        .string()
        .trim()
        .min(1, "Serial number cannot be empty")
        .max(100, "Serial number cannot exceed 100 characters")
        .optional()
        .nullable(),
    itemName: zod_1.z
        .string()
        .trim()
        .max(150, "Item name cannot exceed 150 characters")
        .optional()
        .nullable(),
    price: zod_1.z.coerce
        .number()
        .finite("Price must be a valid number")
        .min(0, "Price cannot be negative"),
    warehouseId: zod_1.z.coerce.number().int().positive("Warehouse is required"),
    /*
     * The fields below are only needed when
     * the barcode does not already belong
     * to an existing product.
     */
    sku: zod_1.z.string().trim().max(50, "SKU cannot exceed 50 characters").optional(),
    productName: zod_1.z
        .string()
        .trim()
        .max(200, "Product name cannot exceed 200 characters")
        .optional(),
    description: zod_1.z.string().trim().optional().nullable(),
    unit: zod_1.z
        .string()
        .trim()
        .max(20, "Unit cannot exceed 20 characters")
        .optional(),
});
exports.updateItemSchema = zod_1.z.object({
    itemName: zod_1.z
        .string()
        .trim()
        .max(150, "Item name cannot exceed 150 characters")
        .optional()
        .nullable(),
    serialNumber: zod_1.z
        .string()
        .trim()
        .max(100, "Serial number cannot exceed 100 characters")
        .optional()
        .nullable(),
    price: zod_1.z.coerce
        .number()
        .finite("Price must be a valid number")
        .min(0, "Price cannot be negative")
        .optional(),
    warehouseId: zod_1.z.coerce
        .number()
        .int()
        .positive("Warehouse is required")
        .optional(),
});
exports.listItemsQuerySchema = zod_1.z.object({
    search: zod_1.z.string().trim().optional(),
    status: zod_1.z.enum(["in_stock", "sold", "removed"]).optional(),
    productId: zod_1.z.coerce.number().int().positive().optional(),
    warehouseId: zod_1.z.coerce.number().int().positive().optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    per_page: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
//# sourceMappingURL=items.validator.js.map