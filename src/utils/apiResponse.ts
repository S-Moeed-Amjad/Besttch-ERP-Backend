import { Response } from "express";

interface PaginationMeta {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
}

export function success(res: Response, data: unknown, message = "OK", status = 200) {
  return res.status(status).json({ success: true, data, message });
}

export function paginated(res: Response, data: unknown[], meta: PaginationMeta, status = 200) {
  return res.status(status).json({
    success: true,
    data,
    meta: {
      current_page: meta.currentPage,
      per_page: meta.perPage,
      total: meta.total,
      last_page: meta.lastPage,
    },
  });
}

export function failure(
  res: Response,
  status: number,
  message: string,
  errors?: Record<string, string[]>
) {
  return res.status(status).json({ success: false, message, ...(errors ? { errors } : {}) });
}
