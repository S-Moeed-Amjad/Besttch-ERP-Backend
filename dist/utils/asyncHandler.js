"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = asyncHandler;
// Wraps async route handlers so rejected promises reach the error middleware
// instead of crashing the process.
function asyncHandler(handler) {
    return (req, res, next) => {
        handler(req, res, next).catch(next);
    };
}
//# sourceMappingURL=asyncHandler.js.map