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
exports.returnItem = exports.remove = exports.sell = exports.update = exports.getByCode = exports.getBySerial = exports.getOne = exports.create = exports.list = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const items_validator_1 = require("../validators/items.validator");
const validate_1 = require("../validators/validate");
const itemsService = __importStar(require("../services/items.service"));
exports.list = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const query = (0, validate_1.parseOrThrow)(items_validator_1.listItemsQuerySchema, req.query);
    const { items, meta } = await itemsService.listItems({
        search: query.search,
        status: query.status,
        productId: query.productId,
        warehouseId: query.warehouseId,
        page: query.page,
        perPage: query.per_page,
    });
    (0, apiResponse_1.paginated)(res, items, meta);
});
exports.create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = (0, validate_1.parseOrThrow)(items_validator_1.createItemSchema, req.body);
    const item = await itemsService.createItem(input);
    (0, apiResponse_1.success)(res, item, "Item added successfully", 201);
});
exports.getOne = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const item = await itemsService.getItemById(Number(req.params.id));
    (0, apiResponse_1.success)(res, item);
});
exports.getBySerial = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const item = await itemsService.getItemBySerial(req.params.serialNumber);
    (0, apiResponse_1.success)(res, item);
});
exports.getByCode = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const item = await itemsService.getItemByCode(req.params.itemCode);
    (0, apiResponse_1.success)(res, item);
});
exports.update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = (0, validate_1.parseOrThrow)(items_validator_1.updateItemSchema, req.body);
    const item = await itemsService.updateItem(Number(req.params.id), input);
    (0, apiResponse_1.success)(res, item, "Item updated successfully");
});
exports.sell = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const item = await itemsService.sellItem(Number(req.params.id));
    (0, apiResponse_1.success)(res, item, "Item sold successfully");
});
exports.remove = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const item = await itemsService.removeItem(Number(req.params.id));
    (0, apiResponse_1.success)(res, item, "Item removed from inventory");
});
exports.returnItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const item = await itemsService.returnItem(Number(req.params.id));
    (0, apiResponse_1.success)(res, item, "Item returned to inventory");
});
//# sourceMappingURL=items.controller.js.map