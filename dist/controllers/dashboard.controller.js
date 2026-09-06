"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stats = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const prisma_1 = require("../config/prisma");
exports.stats = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const [totalUsers, activeUsers, totalRoles, totalProducts, totalWarehouses] = await Promise.all([
        prisma_1.prisma.user.count({ where: { deletedAt: null } }),
        prisma_1.prisma.user.count({ where: { deletedAt: null, status: "active" } }),
        prisma_1.prisma.role.count(),
        prisma_1.prisma.product.count({ where: { deletedAt: null } }),
        prisma_1.prisma.warehouse.count(),
    ]);
    (0, apiResponse_1.success)(res, {
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
//# sourceMappingURL=dashboard.controller.js.map