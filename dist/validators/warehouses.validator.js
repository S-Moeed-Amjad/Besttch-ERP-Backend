"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listWarehousesQuerySchema = exports.updateWarehouseSchema = exports.createWarehouseSchema = void 0;
const zod_1 = require("zod");
exports.createWarehouseSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(2, "Warehouse name must be at least 2 characters")
        .max(150, "Warehouse name cannot exceed 150 characters"),
    code: zod_1.z
        .string()
        .trim()
        .min(1, "Warehouse code is required")
        .max(30, "Warehouse code cannot exceed 30 characters"),
    address: zod_1.z.string().trim().optional().nullable(),
    isActive: zod_1.z.boolean().optional().default(true),
});
exports.updateWarehouseSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(150).optional(),
    code: zod_1.z.string().trim().min(1).max(30).optional(),
    address: zod_1.z.string().trim().optional().nullable(),
    isActive: zod_1.z.boolean().optional(),
});
exports.listWarehousesQuerySchema = zod_1.z.object({
    search: zod_1.z.string().trim().optional(),
    isActive: zod_1.z.enum(["true", "false"]).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    per_page: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
//# sourceMappingURL=warehouses.validator.js.map