import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { paginated, success } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";
import {
  createUserSchema,
  listUsersQuerySchema,
  toggleStatusSchema,
  updateUserSchema,
} from "../validators/users.validator";
import { parseOrThrow } from "../validators/validate";
import * as usersService from "../services/users.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = parseOrThrow(listUsersQuerySchema, req.query);
  const { users, meta } = await usersService.listUsers({
    search: query.search,
    role: query.role,
    status: query.status,
    page: query.page,
    perPage: query.per_page,
    sort: query.sort,
    direction: query.direction,
  });
  paginated(res, users, meta);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const user = await usersService.getUserById(Number(req.params.id));
  success(res, user);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = parseOrThrow(createUserSchema, req.body);
  const user = await usersService.createUser(input);
  success(res, user, "User created successfully", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const input = parseOrThrow(updateUserSchema, req.body);
  const user = await usersService.updateUser(Number(req.params.id), input, req.user);
  success(res, user, "User updated successfully");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  await usersService.deleteUser(Number(req.params.id), req.user);
  res.status(204).send();
});

export const setStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const { status } = parseOrThrow(toggleStatusSchema, req.body);
  const user = await usersService.setUserStatus(Number(req.params.id), status, req.user);
  success(res, user, "User status updated");
});
