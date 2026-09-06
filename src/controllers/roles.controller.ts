import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { prisma } from "../config/prisma";

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const roles = await prisma.role.findMany({
    select: { id: true, name: true, displayName: true },
    orderBy: { id: "asc" },
  });
  success(res, roles);
});
