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
exports.remove = exports.update = exports.create = exports.getBySku = exports.getByBarcode = exports.getOne = exports.list = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const ApiError_1 = require("../utils/ApiError");
const products_validator_1 = require("../validators/products.validator");
const validate_1 = require("../validators/validate");
const productsService = __importStar(require("../services/products.service"));
exports.list = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const query = (0, validate_1.parseOrThrow)(products_validator_1.listProductsQuerySchema, req.query);
    const { products, meta } = await productsService.listProducts({
        search: query.search,
        page: query.page,
        perPage: query.per_page,
    });
    (0, apiResponse_1.paginated)(res, products, meta);
});
exports.getOne = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await productsService.getProductById(Number(req.params.id));
    (0, apiResponse_1.success)(res, product);
});
exports.getByBarcode = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await productsService.getProductByBarcode(req.params.barcode);
    (0, apiResponse_1.success)(res, product);
});
exports.getBySku = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await productsService.getProductBySku(req.params.sku);
    (0, apiResponse_1.success)(res, product);
});
exports.create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = (0, validate_1.parseOrThrow)(products_validator_1.createProductSchema, req.body);
    const product = await productsService.createProduct(input);
    (0, apiResponse_1.success)(res, product, "Product created successfully", 201);
});
exports.update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = (0, validate_1.parseOrThrow)(products_validator_1.updateProductSchema, req.body);
    const product = await productsService.updateProduct(Number(req.params.id), input);
    (0, apiResponse_1.success)(res, product, "Product updated successfully");
});
exports.remove = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw ApiError_1.ApiError.unauthorized();
    }
    await productsService.deleteProduct(Number(req.params.id), req.user);
    res.status(204).send();
});
//# sourceMappingURL=products.controller.js.map