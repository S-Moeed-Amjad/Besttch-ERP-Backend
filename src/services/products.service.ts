import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { AuthUser } from "../types/express";

interface ListProductsParams {
  search?: string;
  page: number;
  perPage: number;
}

interface ProductInput {
  sku: string;
  barcode: string;
  name: string;
  description?: string | null;
  unit?: string;
  isActive?: boolean;
}

interface UpdateProductInput {
  sku?: string;
  barcode?: string;
  name?: string;
  description?: string | null;
  unit?: string;
  isActive?: boolean;
}

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
} satisfies Prisma.ProductSelect;

function formatProduct(product: any) {
  const { _count, ...data } = product;

  return {
    ...data,
    quantity: _count?.items ?? 0,
  };
}

export async function listProducts(params: ListProductsParams) {
  const search = params.search?.trim();

  const conditions: Prisma.ProductWhereInput[] = [];

  if (search) {
    conditions.push(
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        sku: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        barcode: {
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

  const where: Prisma.ProductWhereInput = {
    deletedAt: null,

    ...(conditions.length
      ? {
          OR: conditions,
        }
      : {}),
  };

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),

    prisma.product.findMany({
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

export async function getProductById(id: number) {
  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: productSelect,
  });

  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  return formatProduct(product);
}

export async function getProductByBarcode(barcode: string) {
  const product = await prisma.product.findFirst({
    where: {
      barcode,
      deletedAt: null,
    },
    select: productSelect,
  });

  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  return formatProduct(product);
}

export async function getProductBySku(sku: string) {
  const product = await prisma.product.findFirst({
    where: {
      sku,
      deletedAt: null,
    },
    select: productSelect,
  });

  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  return formatProduct(product);
}

export async function createProduct(input: ProductInput) {
  await assertSkuAvailable(input.sku);
  await assertBarcodeAvailable(input.barcode);

  const product = await prisma.product.create({
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

export async function updateProduct(id: number, input: UpdateProductInput) {
  const existing = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!existing) {
    throw ApiError.notFound("Product not found");
  }

  if (input.sku && input.sku !== existing.sku) {
    await assertSkuAvailable(input.sku, id);
  }

  if (input.barcode && input.barcode !== existing.barcode) {
    await assertBarcodeAvailable(input.barcode, id);
  }

  const product = await prisma.product.update({
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

export async function deleteProduct(id: number, actingUser: AuthUser) {
  // Strictly manager/admin as requested.
  if (!["manager", "admin"].includes(actingUser.roleName)) {
    throw ApiError.forbidden("Only managers and admins can delete products");
  }

  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  const availableItems = await prisma.item.count({
    where: {
      productId: id,
      status: "in_stock",
    },
  });

  if (availableItems > 0) {
    throw ApiError.unprocessable("Product cannot be deleted", {
      product: [`Product still has ${availableItems} item(s) in stock`],
    });
  }

  await prisma.product.update({
    where: {
      id,
    },

    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });
}

async function assertSkuAvailable(sku: string, excludeId?: number) {
  const existing = await prisma.product.findFirst({
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
    throw ApiError.unprocessable("Validation failed", {
      sku: ["SKU is already in use"],
    });
  }
}

async function assertBarcodeAvailable(barcode: string, excludeId?: number) {
  const existing = await prisma.product.findFirst({
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
    throw ApiError.unprocessable("Validation failed", {
      barcode: ["Barcode is already in use"],
    });
  }
}
