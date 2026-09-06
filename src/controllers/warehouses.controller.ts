import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";

import { paginated, success } from "../utils/apiResponse";

import { ApiError } from "../utils/ApiError";

import {
  createWarehouseSchema,
  updateWarehouseSchema,
  listWarehousesQuerySchema,
} from "../validators/warehouses.validator";

import { parseOrThrow } from "../validators/validate";

import * as warehousesService from "../services/warehouses.service";

/**
 * LIST / SEARCH
 */
export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = parseOrThrow(listWarehousesQuerySchema, req.query);

  const { warehouses, meta } = await warehousesService.listWarehouses({
    search: query.search,

    isActive:
      query.isActive !== undefined ? query.isActive === "true" : undefined,

    page: query.page,

    perPage: query.per_page,
  });

  paginated(res, warehouses, meta);
});

/**
 * GET BY ID
 */
export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const warehouse = await warehousesService.getWarehouseById(
    Number(req.params.id)
  );

  success(res, warehouse);
});

/**
 * GET BY CODE
 */
export const getByCode = asyncHandler(async (req: Request, res: Response) => {
  const warehouse = await warehousesService.getWarehouseByCode(req.params.code);

  success(res, warehouse);
});

/**
 * CREATE
 */
export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = parseOrThrow(createWarehouseSchema, req.body);

  const warehouse = await warehousesService.createWarehouse(input);

  success(res, warehouse, "Warehouse created successfully", 201);
});

/**
 * UPDATE
 */
export const update = asyncHandler(async (req: Request, res: Response) => {
  const input = parseOrThrow(updateWarehouseSchema, req.body);

  const warehouse = await warehousesService.updateWarehouse(
    Number(req.params.id),
    input
  );

  success(res, warehouse, "Warehouse updated successfully");
});

/**
 * DELETE / DEACTIVATE
 */
export const remove = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const warehouse = await warehousesService.deleteWarehouse(
    Number(req.params.id),
    req.user
  );

  success(res, warehouse, "Warehouse deactivated successfully");
});
