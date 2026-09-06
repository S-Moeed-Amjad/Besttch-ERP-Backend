import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { prisma } from "../config/prisma";

export const stats = asyncHandler(async (_req: Request, res: Response) => {
  const [totalUsers, activeUsers, totalRoles, totalProducts, totalWarehouses] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null, status: "active" } }),
    prisma.role.count(),
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.warehouse.count(),
  ]);

  success(res, {
    totalUsers,
    activeUsers,
    totalRoles,
    // Inventory module isn't built yet (Phase 1) — these reflect the empty schema, not live stock.
    inventory: {
      totalProducts,
      totalWarehouses,
      lowStockItems: 0,
    },
  });
});
