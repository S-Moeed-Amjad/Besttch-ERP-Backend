"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = listProducts;
exports.getProductById = getProductById;
exports.getProductByBarcode = getProductByBarcode;
exports.getProductBySku = getProductBySku;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const prisma_1 = require("../config/prisma");
const ApiError_1 = require("../utils/ApiError");
const productSelect = {
    id: true,
    sku: true,
    barcode: true,
    name: true,
    description: true,
    unit: true,
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
function formatProduct(product) {
    const { _count, ...data } = product;
    return {
        ...data,
        quantity: _count?.items ?? 0,
    };
}
async function listProducts(params) {
    const search = params.search?.trim();
    const conditions = [];
    if (search) {
        conditions.push({
            name: {
                contains: search,
                mode: "insensitive",
            },
        }, {
            sku: {
                contains: search,
                mode: "insensitive",
            },
        }, {
            barcode: {
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
        deletedAt: null,
        ...(conditions.length
            ? {
                OR: conditions,
            }
            : {}),
    };
    const [total, products] = await Promise.all([
        prisma_1.prisma.product.count({ where }),
        prisma_1.prisma.product.findMany({
            where,
            select: productSelect,
            orderBy: {
                createdAt: "desc",
            },
            skip: (params.page - 1) * params.perPage,
            take: params.perPage,
        }),
    ]);
    return {
        products: products.map(formatProduct),
        meta: {
            currentPage: params.page,
            perPage: params.perPage,
            total,
            lastPage: Math.max(1, Math.ceil(total / params.perPage)),
        },
    };
}
async function getProductById(id) {
    const product = await prisma_1.prisma.product.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        select: productSelect,
    });
    if (!product) {
        throw ApiError_1.ApiError.notFound("Product not found");
    }
    return formatProduct(product);
}
async function getProductByBarcode(barcode) {
    const product = await prisma_1.prisma.product.findFirst({
        where: {
            barcode,
            deletedAt: null,
        },
        select: productSelect,
    });
    if (!product) {
        throw ApiError_1.ApiError.notFound("Product not found");
    }
    return formatProduct(product);
}
async function getProductBySku(sku) {
    const product = await prisma_1.prisma.product.findFirst({
        where: {
            sku,
            deletedAt: null,
        },
        select: productSelect,
    });
    if (!product) {
        throw ApiError_1.ApiError.notFound("Product not found");
    }
    return formatProduct(product);
}
async function createProduct(input) {
    await assertSkuAvailable(input.sku);
    await assertBarcodeAvailable(input.barcode);
    const product = await prisma_1.prisma.product.create({
        data: {
            sku: input.sku,
            barcode: input.barcode,
            name: input.name,
            description: input.description ?? null,
            unit: input.unit ?? "piece",
            // Existing schema field; not used by API.
            reorderLevel: 0,
            isActive: input.isActive ?? true,
        },
        select: productSelect,
    });
    return formatProduct(product);
}
async function updateProduct(id, input) {
    const existing = await prisma_1.prisma.product.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!existing) {
        throw ApiError_1.ApiError.notFound("Product not found");
    }
    if (input.sku && input.sku !== existing.sku) {
        await assertSkuAvailable(input.sku, id);
    }
    if (input.barcode && input.barcode !== existing.barcode) {
        await assertBarcodeAvailable(input.barcode, id);
    }
    const product = await prisma_1.prisma.product.update({
        where: {
            id,
        },
        data: {
            ...(input.sku !== undefined ? { sku: input.sku } : {}),
            ...(input.barcode !== undefined ? { barcode: input.barcode } : {}),
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.description !== undefined
                ? { description: input.description }
                : {}),
            ...(input.unit !== undefined ? { unit: input.unit } : {}),
            ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
        },
        select: productSelect,
    });
    return formatProduct(product);
}
async function deleteProduct(id, actingUser) {
    // Strictly manager/admin as requested.
    if (!["manager", "admin"].includes(actingUser.roleName)) {
        throw ApiError_1.ApiError.forbidden("Only managers and admins can delete products");
    }
    const product = await prisma_1.prisma.product.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!product) {
        throw ApiError_1.ApiError.notFound("Product not found");
    }
    const availableItems = await prisma_1.prisma.item.count({
        where: {
            productId: id,
            status: "in_stock",
        },
    });
    if (availableItems > 0) {
        throw ApiError_1.ApiError.unprocessable("Product cannot be deleted", {
            product: [`Product still has ${availableItems} item(s) in stock`],
        });
    }
    await prisma_1.prisma.product.update({
        where: {
            id,
        },
        data: {
            isActive: false,
            deletedAt: new Date(),
        },
    });
}
async function assertSkuAvailable(sku, excludeId) {
    const existing = await prisma_1.prisma.product.findFirst({
        where: {
            sku,
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
            sku: ["SKU is already in use"],
        });
    }
}
async function assertBarcodeAvailable(barcode, excludeId) {
    const existing = await prisma_1.prisma.product.findFirst({
        where: {
            barcode,
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
            barcode: ["Barcode is already in use"],
        });
    }
}
//# sourceMappingURL=products.service.js.map