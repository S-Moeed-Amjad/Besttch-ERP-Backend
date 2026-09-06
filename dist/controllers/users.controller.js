"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStatus = exports.remove = exports.update = exports.create = exports.getOne = exports.list = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const ApiError_1 = require("../utils/ApiError");
const users_validator_1 = require("../validators/users.validator");
const validate_1 = require("../validators/validate");
const usersService = __importStar(require("../services/users.service"));
exports.list = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const query = (0, validate_1.parseOrThrow)(users_validator_1.listUsersQuerySchema, req.query);
    const { users, meta } = await usersService.listUsers({
        search: query.search,
        role: query.role,
        status: query.status,
        page: query.page,
        perPage: query.per_page,
        sort: query.sort,
        direction: query.direction,
    });
    (0, apiResponse_1.paginated)(res, users, meta);
});
exports.getOne = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await usersService.getUserById(Number(req.params.id));
    (0, apiResponse_1.success)(res, user);
});
exports.create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = (0, validate_1.parseOrThrow)(users_validator_1.createUserSchema, req.body);
    const user = await usersService.createUser(input);
    (0, apiResponse_1.success)(res, user, "User created successfully", 201);
});
exports.update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        throw ApiError_1.ApiError.unauthorized();
    const input = (0, validate_1.parseOrThrow)(users_validator_1.updateUserSchema, req.body);
    const user = await usersService.updateUser(Number(req.params.id), input, req.user);
    (0, apiResponse_1.success)(res, user, "User updated successfully");
});
exports.remove = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        throw ApiError_1.ApiError.unauthorized();
    await usersService.deleteUser(Number(req.params.id), req.user);
    res.status(204).send();
});
exports.setStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        throw ApiError_1.ApiError.unauthorized();
    const { status } = (0, validate_1.parseOrThrow)(users_validator_1.toggleStatusSchema, req.body);
    const user = await usersService.setUserStatus(Number(req.params.id), status, req.user);
    (0, apiResponse_1.success)(res, user, "User status updated");
});
//# sourceMappingURL=users.controller.js.map