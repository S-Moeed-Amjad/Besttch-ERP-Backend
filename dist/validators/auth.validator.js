"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("A valid email is required"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.updateProfileSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters").max(150).optional(),
    phone: zod_1.z.string().max(30).optional().nullable(),
    currentPassword: zod_1.z.string().optional(),
    newPassword: zod_1.z.string().min(8, "Password must be at least 8 characters").optional(),
})
    .refine((data) => !data.newPassword || !!data.currentPassword, {
    message: "Current password is required to set a new password",
    path: ["currentPassword"],
});
//# sourceMappingURL=auth.validator.js.map