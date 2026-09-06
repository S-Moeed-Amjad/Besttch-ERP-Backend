import { Prisma } from "@prisma/client";

import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { AuthUser } from "../types/express";

interface ListWarehousesParams {
  search?: string;
  isActive?: boolean;
  page: number;
  perPage: number;
}

interface CreateWarehouseInput {
  name: string;
  code: string;
  address?: string | null;
  isActive?: boolean;
}

interface UpdateWarehouseInput {
  name?: string;
  code?: string;
  address?: string | null;
  isActive?: boolean;
}

const warehouseSelect = {
  id: true,
  name: true,
  code: true,
  address: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,

  _count: {
    select: {
      items: {
        where: {
          status: "in_stock",
        },
      },
    },
  },
} satisfies Prisma.WarehouseSelect;

function formatWarehouse(warehouse: any) {
  const { _count, ...data } = warehouse;

  return {
    ...data,

    itemCount: _count?.items ?? 0,
  };
}

/**
 * GET ALL / SEARCH WAREHOUSES
 */
export async function listWarehouses(params: ListWarehousesParams) {
  const search = params.search?.trim();

  const conditions: Prisma.WarehouseWhereInput[] = [];

  if (search) {
    conditions.push(
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },

      {
        code: {
          contains: search,
          mode: "insensitive",
        },
      },

      {
        address: {
          contains: search,
          mode: "insensitive",
        },
      }
    );

    if (/^\d+$/.test(search)) {
      conditions.push({
        id: Number(search),
      });
    }
  }

  const where: Prisma.WarehouseWhereInput = {
    ...(params.isActive !== undefined
      ? {
          isActive: params.isActive,
        }
      : {}),

    ...(conditions.length
      ? {
          OR: conditions,
        }
      : {}),
  };

  const [total, warehouses] = await Promise.all([
    prisma.warehouse.count({
      where,
    }),

    prisma.warehouse.findMany({
      where,

      select: warehouseSelect,

      orderBy: {
        createdAt: "desc",
      },

      skip: (params.page - 1) * params.perPage,

      take: params.perPage,
    }),
  ]);

  return {
    warehouses: warehouses.map(formatWarehouse),

    meta: {
      currentPage: params.page,

      perPage: params.perPage,

      total,

      lastPage: Math.max(1, Math.ceil(total / params.perPage)),
    },
  };
}

/**
 * GET WAREHOUSE BY ID
 */
export async function getWarehouseById(id: number) {
  const warehouse = await prisma.warehouse.findUnique({
    where: {
      id,
    },

    select: warehouseSelect,
  });

  if (!warehouse) {
    throw ApiError.notFound("Warehouse not found");
  }

  return formatWarehouse(warehouse);
}

/**
 * GET WAREHOUSE BY CODE
 */
export async function getWarehouseByCode(code: string) {
  const warehouse = await prisma.warehouse.findUnique({
    where: {
      code,
    },

    select: warehouseSelect,
  });

  if (!warehouse) {
    throw ApiError.notFound("Warehouse not found");
  }

  return formatWarehouse(warehouse);
}

/**
 * CREATE WAREHOUSE
 */
export async function createWarehouse(input: CreateWarehouseInput) {
  await assertCodeAvailable(input.code);

  const warehouse = await prisma.warehouse.create({
    data: {
      name: input.name,

      code: input.code,

      address: input.address ?? null,

      isActive: input.isActive ?? true,
    },

    select: warehouseSelect,
  });

  return formatWarehouse(warehouse);
}

/**
 * UPDATE WAREHOUSE
 */
export async function updateWarehouse(id: number, input: UpdateWarehouseInput) {
  const existing = await prisma.warehouse.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw ApiError.notFound("Warehouse not found");
  }

  if (input.code && input.code !== existing.code) {
    await assertCodeAvailable(input.code, id);
  }

  const warehouse = await prisma.warehouse.update({
    where: {
      id,
    },

    data: {
      ...(input.name !== undefined
        ? {
            name: input.name,
          }
        : {}),

      ...(input.code !== undefined
        ? {
            code: input.code,
          }
        : {}),

      ...(input.address !== undefined
        ? {
            address: input.address,
          }
        : {}),

      ...(input.isActive !== undefined
        ? {
            isActive: input.isActive,
          }
        : {}),
    },

    select: warehouseSelect,
  });

  return formatWarehouse(warehouse);
}

/**
 * DELETE / DEACTIVATE WAREHOUSE
 *
 * We don't physically delete the warehouse.
 *
 * Only manager/admin can do this.
 */
export async function deleteWarehouse(id: number, actingUser: AuthUser) {
  if (!["manager", "admin"].includes(actingUser.roleName)) {
    throw ApiError.forbidden("Only managers and admins can delete warehouses");
  }

  const warehouse = await prisma.warehouse.findUnique({
    where: {
      id,
    },
  });

  if (!warehouse) {
    throw ApiError.notFound("Warehouse not found");
  }

  /**
   * Do not deactivate a warehouse
   * while physical stock is inside it.
   */
  const inStockItems = await prisma.item.count({
    where: {
      warehouseId: id,
      status: "in_stock",
    },
  });

  if (inStockItems > 0) {
    throw ApiError.unprocessable("Warehouse cannot be deleted", {
      warehouse: [`Warehouse still contains ${inStockItems} item(s) in stock`],
    });
  }

  return prisma.warehouse.update({
    where: {
      id,
    },

    data: {
      isActive: false,
    },

    select: warehouseSelect,
  });
}

/**
 * CHECK UNIQUE CODE
 */
async function assertCodeAvailable(code: string, excludeId?: number) {
  const existing = await prisma.warehouse.findFirst({
    where: {
      code,

      ...(excludeId
        ? {
            NOT: {
              id: excludeId,
            },
          }
        : {}),
    },
  });

  if (existing) {
    throw ApiError.unprocessable("Validation failed", {
      code: ["Warehouse code is already in use"],
    });
  }
}
