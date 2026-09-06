import { Request, Response } from "express";
import { env } from "../config/env";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { loginSchema, updateProfileSchema } from "../validators/auth.validator";
import { parseOrThrow } from "../validators/validate";
import * as authService from "../services/auth.service";
import { ApiError } from "../utils/ApiError";

const cookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "lax" as const,
  maxAge: 24 * 60 * 60 * 1000,
};

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = parseOrThrow(loginSchema, req.body);
  const { token, user } = await authService.login(email, password);

  res.cookie(env.cookieName, token, cookieOptions);
  success(res, user, "Logged in successfully");
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(env.cookieName, { httpOnly: true, secure: env.isProduction, sameSite: "lax" });
  success(res, null, "Logged out successfully");
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const user = await authService.getCurrentUser(req.user.id);
  success(res, user);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const input = parseOrThrow(updateProfileSchema, req.body);
  const user = await authService.updateOwnProfile(req.user.id, input);
  success(res, user, "Profile updated successfully");
});
