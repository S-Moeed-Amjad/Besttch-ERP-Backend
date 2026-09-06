import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { ROLES } from "../constants/roles";
import { AuthUser } from "../types/express";

interface ListUsersParams {
  search?: string;
  role?: string;
  status?: "active" | "inactive";
  page: number;
  perPage: number;
  sort: "name" | "email" | "createdAt" | "lastLoginAt";
  direction: "asc" | "desc";
}

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
} satisfies Prisma.UserSelect;

export async function listUsers(params: ListUsersParams) {
  const where: Prisma.UserWhereInput = {
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
    prisma.user.count({
      where,
    }),

    prisma.user.findMany({
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

export async function getUserById(id: number) {
  const user = await prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: userSelect,
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return user;
}

export async function createUser(input: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleId: number;
  password: string;
  status?: "active" | "inactive";
}) {
  await assertRoleExists(input.roleId);
  await assertEmailAvailable(input.email);

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const fullName = `${input.firstName.trim()} ${input.lastName.trim()}`;

  return prisma.user.create({
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

export async function updateUser(
  id: number,
  input: {
    name?: string;
    email?: string;
    password?: string;
    roleId?: number;
    phone?: string | null;
    status?: "active" | "inactive";
  },
  actingUser: AuthUser
) {
  const target = await findEditableTargetOrThrow(id, actingUser);

  if (input.roleId) {
    await assertRoleExists(input.roleId);
  }

  if (input.email && input.email.toLowerCase() !== target.email.toLowerCase()) {
    await assertEmailAvailable(input.email);
  }

  return prisma.user.update({
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
            password: await bcrypt.hash(input.password, 10),
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

export async function deleteUser(id: number, actingUser: AuthUser) {
  await findEditableTargetOrThrow(id, actingUser);

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function setUserStatus(
  id: number,
  status: "active" | "inactive",
  actingUser: AuthUser
) {
  await findEditableTargetOrThrow(id, actingUser);

  return prisma.user.update({
    where: {
      id,
    },

    data: {
      status,
    },

    select: userSelect,
  });
}

async function assertRoleExists(roleId: number) {
  const role = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
  });

  if (!role) {
    throw ApiError.unprocessable("Validation failed", {
      roleId: ["Selected role does not exist"],
    });
  }
}

async function assertEmailAvailable(email: string) {
  const existing = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase(),
      deletedAt: null,
    },
  });

  if (existing) {
    throw ApiError.unprocessable("Validation failed", {
      email: ["Email is already in use"],
    });
  }
}

// Admins may not modify Super Admin accounts.
// Super Admin has no such restriction.
async function findEditableTargetOrThrow(id: number, actingUser: AuthUser) {
  const target = await prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },

    include: {
      role: true,
    },
  });

  if (!target) {
    throw ApiError.notFound("User not found");
  }

  if (
    actingUser.roleName === ROLES.ADMIN &&
    target.role.name === ROLES.SUPER_ADMIN
  ) {
    throw ApiError.forbidden("Admins cannot modify Super Admin accounts");
  }

  return target;
}
