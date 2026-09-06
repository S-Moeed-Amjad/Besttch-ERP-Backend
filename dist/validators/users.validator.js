"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleStatusSchema = exports.listUsersQuerySchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(75, "First name must not exceed 75 characters"),
    lastName: zod_1.z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(75, "Last name must not exceed 75 characters"),
    email: zod_1.z
        .string()
        .trim()
        .email("A valid email is required")
        .transform((email) => email.toLowerCase()),
    phoneNumber: zod_1.z
        .string()
        .trim()
        .min(1, "Phone number is required")
        .max(30, "Phone number must not exceed 30 characters"),
    roleId: zod_1.z.coerce.number().int().positive("A role is required"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    status: zod_1.z.enum(["active", "inactive"]).optional(),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(150).optional(),
    email: zod_1.z
        .string()
        .email()
        .transform((email) => email.toLowerCase())
        .optional(),
    password: zod_1.z.string().min(8).optional(),
    roleId: zod_1.z.coerce.number().int().positive().optional(),
    phone: zod_1.z.string().max(30).optional().nullable(),
    status: zod_1.z.enum(["active", "inactive"]).optional(),
});
exports.listUsersQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    role: zod_1.z.string().optional(),
    status: zod_1.z.enum(["active", "inactive"]).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    per_page: zod_1.z.coerce.number().int().min(1).max(100).default(15),
    sort: zod_1.z
        .enum(["name", "email", "createdAt", "lastLoginAt"])
        .default("createdAt"),
    direction: zod_1.z.enum(["asc", "desc"]).default("desc"),
});
exports.toggleStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["active", "inactive"]),
});
//# sourceMappingURL=users.validator.js.map