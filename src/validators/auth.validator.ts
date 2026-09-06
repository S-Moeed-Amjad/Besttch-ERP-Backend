import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("A valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const updateProfileSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(150).optional(),
    phone: z.string().max(30).optional().nullable(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8, "Password must be at least 8 characters").optional(),
  })
  .refine((data) => !data.newPassword || !!data.currentPassword, {
    message: "Current password is required to set a new password",
    path: ["currentPassword"],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
