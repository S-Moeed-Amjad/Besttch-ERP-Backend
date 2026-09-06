"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = success;
exports.paginated = paginated;
exports.failure = failure;
function success(res, data, message = "OK", status = 200) {
    return res.status(status).json({ success: true, data, message });
}
function paginated(res, data, meta, status = 200) {
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
function failure(res, status, message, errors) {
    return res.status(status).json({ success: false, message, ...(errors ? { errors } : {}) });
}
//# sourceMappingURL=apiResponse.js.map