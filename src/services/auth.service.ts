import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { AuthUser } from "../types/express";

export async function login(email: string, password: string) {
  const user = await prisma.user.findFirst({
    where: { email, deletedAt: null },
    include: { role: true },
  });

  if (!user || user.status !== "active") {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const payload: AuthUser = { id: user.id, email: user.email, roleId: user.roleId, roleName: user.role.name };
  const token = jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as SignOptions);

  return { token, user: toSafeUser(user) };
}

export async function updateOwnProfile(
  userId: number,
  input: { name?: string; phone?: string | null; currentPassword?: string; newPassword?: string }
) {
  const user = await prisma.user.findFirst({ where: { id: userId, deletedAt: null }, include: { role: true } });
  if (!user) {
    throw ApiError.unauthorized("Session user no longer exists");
  }

  if (input.newPassword) {
    const currentMatches = await bcrypt.compare(input.currentPassword ?? "", user.password);
    if (!currentMatches) {
      throw ApiError.unprocessable("Validation failed", { currentPassword: ["Current password is incorrect"] });
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.name ? { name: input.name } : {}),
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
      ...(input.newPassword ? { password: await bcrypt.hash(input.newPassword, 10) } : {}),
    },
    include: { role: true },
  });

  return toSafeUser(updated);
}

export async function getCurrentUser(userId: number) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    include: { role: true },
  });

  if (!user) {
    throw ApiError.unauthorized("Session user no longer exists");
  }

  return toSafeUser(user);
}

function toSafeUser(user: {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  status: string;
  lastLoginAt: Date | null;
  createdAt: Date;
  role: { id: number; name: string; displayName: string };
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    status: user.status,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    role: { id: user.role.id, name: user.role.name, displayName: user.role.displayName },
  };
}
