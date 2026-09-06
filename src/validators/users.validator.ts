import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(75, "First name must not exceed 75 characters"),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(75, "Last name must not exceed 75 characters"),

  email: z
    .string()
    .trim()
    .email("A valid email is required")
    .transform((email) => email.toLowerCase()),

  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(30, "Phone number must not exceed 30 characters"),

  roleId: z.coerce.number().int().positive("A role is required"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  status: z.enum(["active", "inactive"]).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(150).optional(),

  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase())
    .optional(),

  password: z.string().min(8).optional(),

  roleId: z.coerce.number().int().positive().optional(),

  phone: z.string().max(30).optional().nullable(),

  status: z.enum(["active", "inactive"]).optional(),
});

export const listUsersQuerySchema = z.object({
  search: z.string().optional(),

  role: z.string().optional(),

  status: z.enum(["active", "inactive"]).optional(),

  page: z.coerce.number().int().min(1).default(1),

  per_page: z.coerce.number().int().min(1).max(100).default(15),

  sort: z
    .enum(["name", "email", "createdAt", "lastLoginAt"])
    .default("createdAt"),

  direction: z.enum(["asc", "desc"]).default("desc"),
});

export const toggleStatusSchema = z.object({
  status: z.enum(["active", "inactive"]),
});
