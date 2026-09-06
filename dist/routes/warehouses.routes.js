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
const express_1 = require("express");
const warehousesController = __importStar(require("../controllers/warehouses.controller"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /warehouses:
 *   get:
 *     tags:
 *       - Warehouses
 *     summary: Get all warehouses
 *     description: Search warehouses by name, code, address or warehouse ID.
 *
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: Main
 *
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 20
 *
 *     responses:
 *       200:
 *         description: Warehouses retrieved successfully
 */
router.get("/", auth_1.requireAuth, warehousesController.list);
/**
 * @openapi
 * /warehouses:
 *   post:
 *     tags:
 *       - Warehouses
 *     summary: Create a warehouse
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - name
 *               - code
 *
 *             properties:
 *               name:
 *                 type: string
 *                 example: Main Warehouse
 *
 *               code:
 *                 type: string
 *                 example: MAIN
 *
 *               address:
 *                 type: string
 *                 nullable: true
 *                 example: 10 Industrial Road, Birmingham
 *
 *               isActive:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       201:
 *         description: Warehouse created successfully
 *
 *       422:
 *         description: Validation failed
 */
router.post("/", auth_1.requireAuth, warehousesController.create);
/**
 * @openapi
 * /warehouses/code/{code}:
 *   get:
 *     tags:
 *       - Warehouses
 *     summary: Find warehouse by code
 *
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         example: MAIN
 *
 *     responses:
 *       200:
 *         description: Warehouse found
 *
 *       404:
 *         description: Warehouse not found
 */
router.get("/code/:code", auth_1.requireAuth, warehousesController.getByCode);
/**
 * @openapi
 * /warehouses/{id}:
 *   get:
 *     tags:
 *       - Warehouses
 *     summary: Get warehouse by ID
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Warehouse retrieved successfully
 *
 *       404:
 *         description: Warehouse not found
 */
router.get("/:id", auth_1.requireAuth, warehousesController.getOne);
/**
 * @openapi
 * /warehouses/{id}:
 *   put:
 *     tags:
 *       - Warehouses
 *     summary: Update a warehouse
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               name:
 *                 type: string
 *                 example: Birmingham Main Warehouse
 *
 *               code:
 *                 type: string
 *                 example: BHM-MAIN
 *
 *               address:
 *                 type: string
 *                 nullable: true
 *                 example: Birmingham, UK
 *
 *               isActive:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: Warehouse updated successfully
 *
 *       404:
 *         description: Warehouse not found
 *
 *       422:
 *         description: Validation failed
 */
router.put("/:id", auth_1.requireAuth, warehousesController.update);
/**
 * @openapi
 * /warehouses/{id}:
 *   delete:
 *     tags:
 *       - Warehouses
 *     summary: Delete a warehouse
 *     description: >
 *       Deactivates the warehouse instead of physically deleting it.
 *       Only managers and admins can perform this action.
 *       A warehouse cannot be deactivated while it contains in-stock items.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         description: Warehouse deactivated successfully
 *
 *       403:
 *         description: Only manager or admin can delete warehouse
 *
 *       404:
 *         description: Warehouse not found
 *
 *       422:
 *         description: Warehouse still contains stock
 */
router.delete("/:id", auth_1.requireAuth, warehousesController.remove);
exports.default = router;
//# sourceMappingURL=warehouses.routes.js.map