"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOrThrow = parseOrThrow;
const ApiError_1 = require("../utils/ApiError");
// Pin only the Output generic (not ZodSchema<T>, which pins Input = Output = T
// and breaks inference for schemas with .default()/.coerce, where they differ).
function parseOrThrow(schema, input) {
    const result = schema.safeParse(input);
    if (!result.success) {
        const errors = {};
        for (const issue of result.error.issues) {
            const field = issue.path.join(".") || "_";
            errors[field] = [...(errors[field] ?? []), issue.message];
        }
        throw ApiError_1.ApiError.unprocessable("Validation failed", errors);
    }
    return result.data;
}
//# sourceMappingURL=validate.js.map