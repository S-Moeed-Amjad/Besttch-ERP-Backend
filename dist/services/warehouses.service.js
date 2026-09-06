"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listWarehouses = listWarehouses;
exports.getWarehouseById = getWarehouseById;
exports.getWarehouseByCode = getWarehouseByCode;
exports.createWarehouse = createWarehouse;
exports.updateWarehouse = updateWarehouse;
exports.deleteWarehouse = deleteWarehouse;
const prisma_1 = require("../config/prisma");
const ApiError_1 = require("../utils/ApiError");
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
};
function formatWarehouse(warehouse) {
    const { _count, ...data } = warehouse;
    return {
        ...data,
        itemCount: _count?.items ?? 0,
    };
}
/**
 * GET ALL / SEARCH WAREHOUSES
 */
async function listWarehouses(params) {
    const search = params.search?.trim();
    const conditions = [];
    if (search) {
        conditions.push({
            name: {
                contains: search,
                mode: "insensitive",
            },
        }, {
            code: {
                contains: search,
                mode: "insensitive",
            },
        }, {
            address: {
                contains: search,
                mode: "insensitive",
            },
        });
        if (/^\d+$/.test(search)) {
            conditions.push({
                id: Number(search),
            });
        }
    }
    const where = {
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
        prisma_1.prisma.warehouse.count({
            where,
        }),
        prisma_1.prisma.warehouse.findMany({
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
async function getWarehouseById(id) {
    const warehouse = await prisma_1.prisma.warehouse.findUnique({
        where: {
            id,
        },
        select: warehouseSelect,
    });
    if (!warehouse) {
        throw ApiError_1.ApiError.notFound("Warehouse not found");
    }
    return formatWarehouse(warehouse);
}
/**
 * GET WAREHOUSE BY CODE
 */
async function getWarehouseByCode(code) {
    const warehouse = await prisma_1.prisma.warehouse.findUnique({
        where: {
            code,
        },
        select: warehouseSelect,
    });
    if (!warehouse) {
        throw ApiError_1.ApiError.notFound("Warehouse not found");
    }
    return formatWarehouse(warehouse);
}
/**
 * CREATE WAREHOUSE
 */
async function createWarehouse(input) {
    await assertCodeAvailable(input.code);
    const warehouse = await prisma_1.prisma.warehouse.create({
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
async function updateWarehouse(id, input) {
    const existing = await prisma_1.prisma.warehouse.findUnique({
        where: {
            id,
        },
    });
    if (!existing) {
        throw ApiError_1.ApiError.notFound("Warehouse not found");
    }
    if (input.code && input.code !== existing.code) {
        await assertCodeAvailable(input.code, id);
    }
    const warehouse = await prisma_1.prisma.warehouse.update({
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
async function deleteWarehouse(id, actingUser) {
    if (!["manager", "admin"].includes(actingUser.roleName)) {
        throw ApiError_1.ApiError.forbidden("Only managers and admins can delete warehouses");
    }
    const warehouse = await prisma_1.prisma.warehouse.findUnique({
        where: {
            id,
        },
    });
    if (!warehouse) {
        throw ApiError_1.ApiError.notFound("Warehouse not found");
    }
    /**
     * Do not deactivate a warehouse
     * while physical stock is inside it.
     */
    const inStockItems = await prisma_1.prisma.item.count({
        where: {
            warehouseId: id,
            status: "in_stock",
        },
    });
    if (inStockItems > 0) {
        throw ApiError_1.ApiError.unprocessable("Warehouse cannot be deleted", {
            warehouse: [`Warehouse still contains ${inStockItems} item(s) in stock`],
        });
    }
    return prisma_1.prisma.warehouse.update({
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
async function assertCodeAvailable(code, excludeId) {
    const existing = await prisma_1.prisma.warehouse.findFirst({
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
        throw ApiError_1.ApiError.unprocessable("Validation failed", {
            code: ["Warehouse code is already in use"],
        });
    }
}
//# sourceMappingURL=warehouses.service.js.map