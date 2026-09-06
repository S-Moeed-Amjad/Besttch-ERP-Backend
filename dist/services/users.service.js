"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.setUserStatus = setUserStatus;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../config/prisma");
const ApiError_1 = require("../utils/ApiError");
const roles_1 = require("../constants/roles");
const userSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    avatarUrl: true,
    status: true,
    lastLoginAt: true,
    createdAt: true,
    updatedAt: true,
    role: {
        select: {
            id: true,
            name: true,
            displayName: true,
        },
    },
};
async function listUsers(params) {
    const where = {
        deletedAt: null,
        ...(params.status
            ? {
                status: params.status,
            }
            : {}),
        ...(params.role
            ? {
                role: {
                    name: params.role,
                },
            }
            : {}),
        ...(params.search
            ? {
                OR: [
                    {
                        name: {
                            contains: params.search,
                            mode: "insensitive",
                        },
                    },
                    {
                        email: {
                            contains: params.search,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : {}),
    };
    const [total, users] = await Promise.all([
        prisma_1.prisma.user.count({
            where,
        }),
        prisma_1.prisma.user.findMany({
            where,
            select: userSelect,
            orderBy: {
                [params.sort]: params.direction,
            },
            skip: (params.page - 1) * params.perPage,
            take: params.perPage,
        }),
    ]);
    return {
        users,
        meta: {
            currentPage: params.page,
            perPage: params.perPage,
            total,
            lastPage: Math.max(1, Math.ceil(total / params.perPage)),
        },
    };
}
async function getUserById(id) {
    const user = await prisma_1.prisma.user.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        select: userSelect,
    });
    if (!user) {
        throw ApiError_1.ApiError.notFound("User not found");
    }
    return user;
}
async function createUser(input) {
    await assertRoleExists(input.roleId);
    await assertEmailAvailable(input.email);
    const hashedPassword = await bcryptjs_1.default.hash(input.password, 10);
    const fullName = `${input.firstName.trim()} ${input.lastName.trim()}`;
    return prisma_1.prisma.user.create({
        data: {
            name: fullName,
            email: input.email.toLowerCase(),
            password: hashedPassword,
            roleId: input.roleId,
            phone: input.phoneNumber,
            status: input.status ?? "active",
        },
        select: userSelect,
    });
}
async function updateUser(id, input, actingUser) {
    const target = await findEditableTargetOrThrow(id, actingUser);
    if (input.roleId) {
        await assertRoleExists(input.roleId);
    }
    if (input.email && input.email.toLowerCase() !== target.email.toLowerCase()) {
        await assertEmailAvailable(input.email);
    }
    return prisma_1.prisma.user.update({
        where: {
            id,
        },
        data: {
            ...(input.name
                ? {
                    name: input.name,
                }
                : {}),
            ...(input.email
                ? {
                    email: input.email.toLowerCase(),
                }
                : {}),
            ...(input.password
                ? {
                    password: await bcryptjs_1.default.hash(input.password, 10),
                }
                : {}),
            ...(input.roleId
                ? {
                    roleId: input.roleId,
                }
                : {}),
            ...(input.phone !== undefined
                ? {
                    phone: input.phone,
                }
                : {}),
            ...(input.status
                ? {
                    status: input.status,
                }
                : {}),
        },
        select: userSelect,
    });
}
async function deleteUser(id, actingUser) {
    await findEditableTargetOrThrow(id, actingUser);
    await prisma_1.prisma.user.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}
async function setUserStatus(id, status, actingUser) {
    await findEditableTargetOrThrow(id, actingUser);
    return prisma_1.prisma.user.update({
        where: {
            id,
        },
        data: {
            status,
        },
        select: userSelect,
    });
}
async function assertRoleExists(roleId) {
    const role = await prisma_1.prisma.role.findUnique({
        where: {
            id: roleId,
        },
    });
    if (!role) {
        throw ApiError_1.ApiError.unprocessable("Validation failed", {
            roleId: ["Selected role does not exist"],
        });
    }
}
async function assertEmailAvailable(email) {
    const existing = await prisma_1.prisma.user.findFirst({
        where: {
            email: email.toLowerCase(),
            deletedAt: null,
        },
    });
    if (existing) {
        throw ApiError_1.ApiError.unprocessable("Validation failed", {
            email: ["Email is already in use"],
        });
    }
}
// Admins may not modify Super Admin accounts.
// Super Admin has no such restriction.
async function findEditableTargetOrThrow(id, actingUser) {
    const target = await prisma_1.prisma.user.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            role: true,
        },
    });
    if (!target) {
        throw ApiError_1.ApiError.notFound("User not found");
    }
    if (actingUser.roleName === roles_1.ROLES.ADMIN &&
        target.role.name === roles_1.ROLES.SUPER_ADMIN) {
        throw ApiError_1.ApiError.forbidden("Admins cannot modify Super Admin accounts");
    }
    return target;
}
//# sourceMappingURL=users.service.js.map