"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(status, message, errors) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
    static badRequest(message, errors) {
        return new ApiError(400, message, errors);
    }
    static unauthorized(message = "Unauthorized") {
        return new ApiError(401, message);
    }
    static forbidden(message = "Forbidden") {
        return new ApiError(403, message);
    }
    static notFound(message = "Not found") {
        return new ApiError(404, message);
    }
    static unprocessable(message, errors) {
        return new ApiError(422, message, errors);
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map