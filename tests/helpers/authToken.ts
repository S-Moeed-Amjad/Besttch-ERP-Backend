import jwt from "jsonwebtoken";
import { env } from "../../src/config/env";
import { AuthUser } from "../../src/types/express";

export function makeAuthCookie(user: AuthUser): string {
  const token = jwt.sign(user, env.jwtSecret, { expiresIn: "1h" });
  return `${env.cookieName}=${token}`;
}

export const FAKE_SUPER_ADMIN: AuthUser = { id: 1, email: "admin@besttech.com", roleId: 1, roleName: "super_admin" };
export const FAKE_ADMIN: AuthUser = { id: 2, email: "manager@besttech.com", roleId: 2, roleName: "admin" };
export const FAKE_STAFF: AuthUser = { id: 3, email: "staff@besttech.com", roleId: 3, roleName: "staff" };
