"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.updateOwnProfile = updateOwnProfile;
exports.getCurrentUser = getCurrentUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../config/prisma");
const env_1 = require("../config/env");
const ApiError_1 = require("../utils/ApiError");
async function login(email, password) {
    const user = await prisma_1.prisma.user.findFirst({
        where: { email, deletedAt: null },
        include: { role: true },
    });
    if (!user || user.status !== "active") {
        throw ApiError_1.ApiError.unauthorized("Invalid email or password");
    }
    const passwordMatches = await bcryptjs_1.default.compare(password, user.password);
    if (!passwordMatches) {
        throw ApiError_1.ApiError.unauthorized("Invalid email or password");
    }
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
    });
    const payload = { id: user.id, email: user.email, roleId: user.roleId, roleName: user.role.name };
    const token = jsonwebtoken_1.default.sign(payload, env_1.env.jwtSecret, { expiresIn: env_1.env.jwtExpiresIn });
    return { token, user: toSafeUser(user) };
}
async function updateOwnProfile(userId, input) {
    const user = await prisma_1.prisma.user.findFirst({ where: { id: userId, deletedAt: null }, include: { role: true } });
    if (!user) {
        throw ApiError_1.ApiError.unauthorized("Session user no longer exists");
    }
    if (input.newPassword) {
        const currentMatches = await bcryptjs_1.default.compare(input.currentPassword ?? "", user.password);
        if (!currentMatches) {
            throw ApiError_1.ApiError.unprocessable("Validation failed", { currentPassword: ["Current password is incorrect"] });
        }
    }
    const updated = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: {
            ...(input.name ? { name: input.name } : {}),
            ...(input.phone !== undefined ? { phone: input.phone } : {}),
            ...(input.newPassword ? { password: await bcryptjs_1.default.hash(input.newPassword, 10) } : {}),
        },
        include: { role: true },
    });
    return toSafeUser(updated);
}
async function getCurrentUser(userId) {
    const user = await prisma_1.prisma.user.findFirst({
        where: { id: userId, deletedAt: null },
        include: { role: true },
    });
    if (!user) {
        throw ApiError_1.ApiError.unauthorized("Session user no longer exists");
    }
    return toSafeUser(user);
}
function toSafeUser(user) {
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
//# sourceMappingURL=auth.service.js.map