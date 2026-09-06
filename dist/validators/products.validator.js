"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProductsQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    sku: zod_1.z.string().trim().min(1, "SKU is required").max(50),
    barcode: zod_1.z.string().trim().min(1, "Barcode is required").max(50),
    name: zod_1.z.string().trim().min(2, "Product name is required").max(200),
    description: zod_1.z.string().trim().optional().nullable(),
    unit: zod_1.z.string().trim().max(20).default("piece"),
    isActive: zod_1.z.boolean().optional().default(true),
});
exports.updateProductSchema = zod_1.z.object({
    sku: zod_1.z.string().trim().min(1).max(50).optional(),
    barcode: zod_1.z.string().trim().min(1).max(50).optional(),
    name: zod_1.z.string().trim().min(2).max(200).optional(),
    description: zod_1.z.string().trim().optional().nullable(),
    unit: zod_1.z.string().trim().max(20).optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.listProductsQuerySchema = zod_1.z.object({
    search: zod_1.z.string().trim().optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    per_page: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
//# sourceMappingURL=products.validator.js.map