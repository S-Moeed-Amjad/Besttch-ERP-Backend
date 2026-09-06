"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const ApiError_1 = require("../utils/ApiError");
function requireAuth(req, _res, next) {
    const token = req.cookies?.[env_1.env.cookieName];
    if (!token) {
        throw ApiError_1.ApiError.unauthorized("You must be logged in to access this resource");
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        req.user = payload;
        next();
    }
    catch {
        throw ApiError_1.ApiError.unauthorized("Invalid or expired session");
    }
}
function requireRole(...allowedRoles) {
    return (req, _res, next) => {
        if (!req.user) {
            throw ApiError_1.ApiError.unauthorized();
        }
        if (!allowedRoles.includes(req.user.roleName)) {
            throw ApiError_1.ApiError.forbidden("You do not have permission to perform this action");
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map