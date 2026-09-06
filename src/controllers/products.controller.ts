import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { paginated, success } from "../utils/apiResponse";

import { ApiError } from "../utils/ApiError";

import {
  createProductSchema,
  listProductsQuerySchema,
  updateProductSchema,
} from "../validators/products.validator";

import { parseOrThrow } from "../validators/validate";
import * as productsService from "../services/products.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = parseOrThrow(listProductsQuerySchema, req.query);

  const { products, meta } = await productsService.listProducts({
    search: query.search,
    page: query.page,
    perPage: query.per_page,
  });

  paginated(res, products, meta);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const product = await productsService.getProductById(Number(req.params.id));

  success(res, product);
});

export const getByBarcode = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await productsService.getProductByBarcode(
      req.params.barcode
    );

    success(res, product);
  }
);

export const getBySku = asyncHandler(async (req: Request, res: Response) => {
  const product = await productsService.getProductBySku(req.params.sku);

  success(res, product);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = parseOrThrow(createProductSchema, req.body);

  const product = await productsService.createProduct(input);

  success(res, product, "Product created successfully", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const input = parseOrThrow(updateProductSchema, req.body);

  const product = await productsService.updateProduct(
    Number(req.params.id),
    input
  );

  success(res, product, "Product updated successfully");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  await productsService.deleteProduct(Number(req.params.id), req.user);

  res.status(204).send();
});
