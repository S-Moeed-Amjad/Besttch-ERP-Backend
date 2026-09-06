"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const apiResponse_1 = require("../utils/apiResponse");
exports.loginRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        (0, apiResponse_1.failure)(res, 429, "Too many login attempts. Please wait a minute and try again.");
    },
});
//# sourceMappingURL=rateLimit.js.map