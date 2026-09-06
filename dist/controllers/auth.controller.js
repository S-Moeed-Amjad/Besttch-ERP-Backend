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
exports.updateProfile = exports.me = exports.logout = exports.login = void 0;
const env_1 = require("../config/env");
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const auth_validator_1 = require("../validators/auth.validator");
const validate_1 = require("../validators/validate");
const authService = __importStar(require("../services/auth.service"));
const ApiError_1 = require("../utils/ApiError");
const cookieOptions = {
    httpOnly: true,
    secure: env_1.env.isProduction,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
};
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = (0, validate_1.parseOrThrow)(auth_validator_1.loginSchema, req.body);
    const { token, user } = await authService.login(email, password);
    res.cookie(env_1.env.cookieName, token, cookieOptions);
    (0, apiResponse_1.success)(res, user, "Logged in successfully");
});
exports.logout = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    res.clearCookie(env_1.env.cookieName, { httpOnly: true, secure: env_1.env.isProduction, sameSite: "lax" });
    (0, apiResponse_1.success)(res, null, "Logged out successfully");
});
exports.me = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw ApiError_1.ApiError.unauthorized();
    }
    const user = await authService.getCurrentUser(req.user.id);
    (0, apiResponse_1.success)(res, user);
});
exports.updateProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw ApiError_1.ApiError.unauthorized();
    }
    const input = (0, validate_1.parseOrThrow)(auth_validator_1.updateProfileSchema, req.body);
    const user = await authService.updateOwnProfile(req.user.id, input);
    (0, apiResponse_1.success)(res, user, "Profile updated successfully");
});
//# sourceMappingURL=auth.controller.js.map