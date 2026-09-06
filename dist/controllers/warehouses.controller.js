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
exports.remove = exports.update = exports.create = exports.getByCode = exports.getOne = exports.list = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const ApiError_1 = require("../utils/ApiError");
const warehouses_validator_1 = require("../validators/warehouses.validator");
const validate_1 = require("../validators/validate");
const warehousesService = __importStar(require("../services/warehouses.service"));
/**
 * LIST / SEARCH
 */
exports.list = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const query = (0, validate_1.parseOrThrow)(warehouses_validator_1.listWarehousesQuerySchema, req.query);
    const { warehouses, meta } = await warehousesService.listWarehouses({
        search: query.search,
        isActive: query.isActive !== undefined ? query.isActive === "true" : undefined,
        page: query.page,
        perPage: query.per_page,
    });
    (0, apiResponse_1.paginated)(res, warehouses, meta);
});
/**
 * GET BY ID
 */
exports.getOne = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const warehouse = await warehousesService.getWarehouseById(Number(req.params.id));
    (0, apiResponse_1.success)(res, warehouse);
});
/**
 * GET BY CODE
 */
exports.getByCode = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const warehouse = await warehousesService.getWarehouseByCode(req.params.code);
    (0, apiResponse_1.success)(res, warehouse);
});
/**
 * CREATE
 */
exports.create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = (0, validate_1.parseOrThrow)(warehouses_validator_1.createWarehouseSchema, req.body);
    const warehouse = await warehousesService.createWarehouse(input);
    (0, apiResponse_1.success)(res, warehouse, "Warehouse created successfully", 201);
});
/**
 * UPDATE
 */
exports.update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = (0, validate_1.parseOrThrow)(warehouses_validator_1.updateWarehouseSchema, req.body);
    const warehouse = await warehousesService.updateWarehouse(Number(req.params.id), input);
    (0, apiResponse_1.success)(res, warehouse, "Warehouse updated successfully");
});
/**
 * DELETE / DEACTIVATE
 */
exports.remove = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw ApiError_1.ApiError.unauthorized();
    }
    const warehouse = await warehousesService.deleteWarehouse(Number(req.params.id), req.user);
    (0, apiResponse_1.success)(res, warehouse, "Warehouse deactivated successfully");
});
//# sourceMappingURL=warehouses.controller.js.map