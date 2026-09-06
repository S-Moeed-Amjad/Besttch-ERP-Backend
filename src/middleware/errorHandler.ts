import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { failure } from "../utils/apiResponse";

export function notFoundHandler(req: Request, res: Response) {
  failure(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    failure(res, err.status, err.message, err.errors);
    return;
  }

  console.error(err);
  failure(res, 500, "Internal server error");
}
