"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const ApiError_1 = require("../utils/ApiError");
const apiResponse_1 = require("../utils/apiResponse");
function notFoundHandler(req, res) {
    (0, apiResponse_1.failure)(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
}
function errorHandler(err, _req, res, _next) {
    if (err instanceof ApiError_1.ApiError) {
        (0, apiResponse_1.failure)(res, err.status, err.message, err.errors);
        return;
    }
    console.error(err);
    (0, apiResponse_1.failure)(res, 500, "Internal server error");
}
//# sourceMappingURL=errorHandler.js.map