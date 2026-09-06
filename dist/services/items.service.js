"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createItem = createItem;
exports.listItems = listItems;
exports.getItemById = getItemById;
exports.getItemBySerial = getItemBySerial;
exports.getItemByCode = getItemByCode;
exports.updateItem = updateItem;
exports.sellItem = sellItem;
exports.removeItem = removeItem;
exports.returnItem = returnItem;
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
const prisma_1 = require("../config/prisma");
const ApiError_1 = require("../utils/ApiError");
const itemSelect = {
    id: true,
    itemCode: true,
    name: true,
    serialNumber: true,
    price: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    product: {
        select: {
            id: true,
            sku: true,
            barcode: true,
            name: true,
            description: true,
            unit: true,
        },
    },
    warehouse: {
        select: {
            id: true,
            name: true,
            code: true,
        },
    },
};
/**
 * ADD A NEW PHYSICAL ITEM
 *
 * 1. Look for existing product using barcode.
 * 2. If found -> add Item underneath it.
 * 3. If not found -> create Product first.
 * 4. Create the physical Item.
 */
async function createItem(input) {
    await assertWarehouseExists(input.warehouseId);
    if (input.serialNumber) {
        await assertSerialAvailable(input.serialNumber);
    }
    return prisma_1.prisma.$transaction(async (tx) => {
        /*
         * Barcode determines whether this
         * product already exists.
         */
        let product = await tx.product.findFirst({
            where: {
                barcode: input.barcode,
                deletedAt: null,
            },
        });
        /*
         * Product doesn't exist.
         * Create product automatically.
         */
        if (!product) {
            if (!input.productName || input.productName.trim() === "") {
                throw ApiError_1.ApiError.unprocessable("Product does not exist", {
                    productName: [
                        "Product name is required when adding the first item of a new product",
                    ],
                });
            }
            /*
             * If SKU wasn't supplied,
             * generate one from the barcode.
             */
            const sku = input.sku?.trim() || `SKU-${input.barcode}`;
            const existingSku = await tx.product.findUnique({
                where: {
                    sku,
                },
            });
            if (existingSku) {
                throw ApiError_1.ApiError.unprocessable("Validation failed", {
                    sku: ["SKU is already in use"],
                });
            }
            product = await tx.product.create({
                data: {
                    sku,
                    barcode: input.barcode,
                    name: input.productName,
                    description: input.description ?? null,
                    unit: input.unit ?? "piece",
                    /*
                     * Reorder is not used by
                     * our current API.
                     */
                    reorderLevel: 0,
                    isActive: true,
                },
            });
        }
        if (!product.isActive) {
            throw ApiError_1.ApiError.unprocessable("Product is inactive");
        }
        /*
         * Generate our own unique ERP
         * identifier for every physical unit.
         */
        const itemCode = `BT-${(0, crypto_1.randomUUID)()}`;
        /*
         * If itemName wasn't provided,
         * use the product name.
         */
        const itemName = input.itemName?.trim() || product.name;
        const item = await tx.item.create({
            data: {
                itemCode,
                name: itemName,
                serialNumber: input.serialNumber ?? null,
                price: new client_1.Prisma.Decimal(input?.price),
                productId: product.id,
                warehouseId: input.warehouseId,
                status: "in_stock",
            },
            select: itemSelect,
        });
        return item;
    });
}
/**
 * GET / SEARCH ALL ITEMS
 *
 * Search supports:
 * - Item ID
 * - Item name
 * - Item code
 * - Serial number
 * - Product name
 * - Product SKU
 * - Product barcode
 */
async function listItems(params) {
    const search = params.search?.trim();
    const searchConditions = [];
    if (search) {
        searchConditions.push({
            itemCode: {
                contains: search,
                mode: "insensitive",
            },
        }, {
            serialNumber: {
                contains: search,
                mode: "insensitive",
            },
        }, {
            name: {
                contains: search,
                mode: "insensitive",
            },
        }, {
            product: {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        }, {
            product: {
                sku: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        }, {
            product: {
                barcode: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        });
        /*
         * Numeric search can also
         * represent Item ID.
         */
        if (/^\d+$/.test(search)) {
            searchConditions.push({
                id: Number(search),
            });
        }
    }
    const where = {
        ...(params.status
            ? {
                status: params.status,
            }
            : {}),
        ...(params.productId
            ? {
                productId: params.productId,
            }
            : {}),
        ...(params.warehouseId
            ? {
                warehouseId: params.warehouseId,
            }
            : {}),
        ...(searchConditions.length
            ? {
                OR: searchConditions,
            }
            : {}),
    };
    const [total, items] = await Promise.all([
        prisma_1.prisma.item.count({
            where,
        }),
        prisma_1.prisma.item.findMany({
            where,
            select: itemSelect,
            orderBy: {
                createdAt: "desc",
            },
            skip: (params.page - 1) * params.perPage,
            take: params.perPage,
        }),
    ]);
    return {
        items,
        meta: {
            currentPage: params.page,
            perPage: params.perPage,
            total,
            lastPage: Math.max(1, Math.ceil(total / params.perPage)),
        },
    };
}
/**
 * GET ITEM BY DATABASE ID
 */
async function getItemById(id) {
    const item = await prisma_1.prisma.item.findUnique({
        where: {
            id,
        },
        select: itemSelect,
    });
    if (!item) {
        throw ApiError_1.ApiError.notFound("Item not found");
    }
    return item;
}
/**
 * GET EXACT PHYSICAL ITEM
 * USING SERIAL NUMBER
 */
async function getItemBySerial(serialNumber) {
    const item = await prisma_1.prisma.item.findUnique({
        where: {
            serialNumber,
        },
        select: itemSelect,
    });
    if (!item) {
        throw ApiError_1.ApiError.notFound("Item not found");
    }
    return item;
}
/**
 * GET EXACT PHYSICAL ITEM
 * USING INTERNAL ERP ITEM CODE
 */
async function getItemByCode(itemCode) {
    const item = await prisma_1.prisma.item.findUnique({
        where: {
            itemCode,
        },
        select: itemSelect,
    });
    if (!item) {
        throw ApiError_1.ApiError.notFound("Item not found");
    }
    return item;
}
/**
 * UPDATE ITEM
 *
 * Supports updating:
 * - item name
 * - serial number
 * - price
 * - warehouse
 */
async function updateItem(id, input) {
    const item = await prisma_1.prisma.item.findUnique({
        where: {
            id,
        },
    });
    if (!item) {
        throw ApiError_1.ApiError.notFound("Item not found");
    }
    /*
     * Check serial uniqueness only when
     * serial is actually changing.
     */
    if (input.serialNumber && input.serialNumber !== item.serialNumber) {
        await assertSerialAvailable(input.serialNumber);
    }
    /*
     * Validate warehouse if it
     * is being changed.
     */
    if (input.warehouseId !== undefined) {
        await assertWarehouseExists(input.warehouseId);
    }
    return prisma_1.prisma.item.update({
        where: {
            id,
        },
        data: {
            ...(input.itemName !== undefined
                ? {
                    name: input.itemName,
                }
                : {}),
            ...(input.serialNumber !== undefined
                ? {
                    serialNumber: input.serialNumber,
                }
                : {}),
            ...(input.price !== undefined
                ? {
                    price: new client_1.Prisma.Decimal(input.price),
                }
                : {}),
            ...(input.warehouseId !== undefined
                ? {
                    warehouseId: input.warehouseId,
                }
                : {}),
        },
        select: itemSelect,
    });
}
/**
 * SELL ITEM
 *
 * Quantity automatically decreases
 * because Product quantity counts only
 * items whose status = in_stock.
 */
async function sellItem(id) {
    return changeStatus(id, "sold");
}
/**
 * REMOVE ITEM
 */
async function removeItem(id) {
    return changeStatus(id, "removed");
}
/**
 * RETURN ITEM TO STOCK
 */
async function returnItem(id) {
    return changeStatus(id, "in_stock");
}
/**
 * INTERNAL STATUS HANDLER
 */
async function changeStatus(id, status) {
    const item = await prisma_1.prisma.item.findUnique({
        where: {
            id,
        },
    });
    if (!item) {
        throw ApiError_1.ApiError.notFound("Item not found");
    }
    /*
     * Selling/removing is only allowed
     * when an item is currently in stock.
     */
    if (status !== "in_stock" && item.status !== "in_stock") {
        throw ApiError_1.ApiError.unprocessable("Item is not currently in stock");
    }
    /*
     * Do not return an already
     * in-stock item.
     */
    if (status === "in_stock" && item.status === "in_stock") {
        throw ApiError_1.ApiError.unprocessable("Item is already in stock");
    }
    return prisma_1.prisma.item.update({
        where: {
            id,
        },
        data: {
            status,
        },
        select: itemSelect,
    });
}
/**
 * CHECK SERIAL NUMBER
 */
async function assertSerialAvailable(serialNumber) {
    const existing = await prisma_1.prisma.item.findUnique({
        where: {
            serialNumber,
        },
    });
    if (existing) {
        throw ApiError_1.ApiError.unprocessable("Validation failed", {
            serialNumber: ["Serial number already exists"],
        });
    }
}
/**
 * CHECK WAREHOUSE
 */
async function assertWarehouseExists(warehouseId) {
    const warehouse = await prisma_1.prisma.warehouse.findUnique({
        where: {
            id: warehouseId,
        },
    });
    if (!warehouse) {
        throw ApiError_1.ApiError.unprocessable("Validation failed", {
            warehouseId: ["Warehouse does not exist"],
        });
    }
    if (!warehouse.isActive) {
        throw ApiError_1.ApiError.unprocessable("Selected warehouse is inactive");
    }
    return warehouse;
}
//# sourceMappingURL=items.service.js.map