"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const prisma_1 = require("../config/prisma");
exports.list = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const roles = await prisma_1.prisma.role.findMany({
        select: { id: true, name: true, displayName: true },
        orderBy: { id: "asc" },
    });
    (0, apiResponse_1.success)(res, roles);
});
//# sourceMappingURL=roles.controller.js.map