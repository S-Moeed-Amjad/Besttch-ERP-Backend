import { Router } from "express";

import * as itemsController from "../controllers/items.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

/**
 * @openapi
 * /items:
 *   get:
 *     tags:
 *       - Items
 *     summary: Get all items
 *     description: >
 *       Returns individual physical inventory items.
 *       Search supports item ID, item name, item code,
 *       serial number, product name, SKU and barcode.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: ABC001
 *
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - in_stock
 *             - sold
 *             - removed
 *
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *
 *       - in: query
 *         name: warehouseId
 *         schema:
 *           type: integer
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
 *         description: Items retrieved successfully
 */
router.get("/", requireAuth, itemsController.list);

/**
 * @openapi
 * /items:
 *   post:
 *     tags:
 *       - Items
 *     summary: Add a physical item
 *     description: >
 *       The backend first searches for an existing product
 *       using the barcode. If the product already exists,
 *       the new physical item is added underneath that product.
 *       If the product does not exist, a new product is created
 *       before creating the item.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - barcode
 *               - price
 *               - warehouseId
 *
 *             properties:
 *               barcode:
 *                 type: string
 *                 example: "5099206027275"
 *
 *               serialNumber:
 *                 type: string
 *                 nullable: true
 *                 example: M185-ABC001
 *
 *               itemName:
 *                 type: string
 *                 nullable: true
 *                 example: Logitech Mouse Unit
 *
 *               price:
 *                 type: number
 *                 format: double
 *                 minimum: 0
 *                 example: 29.99
 *
 *               warehouseId:
 *                 type: integer
 *                 example: 1
 *
 *               sku:
 *                 type: string
 *                 description: >
 *                   Used when the product does not already
 *                   exist. If omitted, the backend generates
 *                   an SKU from the barcode.
 *                 example: MOUSE-M185
 *
 *               productName:
 *                 type: string
 *                 description: >
 *                   Required when no product exists with
 *                   the supplied barcode.
 *                 example: Logitech M185 Wireless Mouse
 *
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Wireless optical mouse
 *
 *               unit:
 *                 type: string
 *                 example: piece
 *
 *     responses:
 *       201:
 *         description: Item created successfully
 *
 *       422:
 *         description: Validation failed
 */
router.post("/", requireAuth, itemsController.create);

/**
 * @openapi
 * /items/serial/{serialNumber}:
 *   get:
 *     tags:
 *       - Items
 *     summary: Find item by serial number
 *     description: >
 *       Finds the exact physical item and returns its item
 *       information, price, product information, barcode,
 *       SKU and warehouse.
 *
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         schema:
 *           type: string
 *         example: M185-ABC001
 *
 *     responses:
 *       200:
 *         description: Item found
 *
 *       404:
 *         description: Item not found
 */
router.get("/serial/:serialNumber", requireAuth, itemsController.getBySerial);

/**
 * @openapi
 * /items/code/{itemCode}:
 *   get:
 *     tags:
 *       - Items
 *     summary: Find item by internal item code
 *
 *     parameters:
 *       - in: path
 *         name: itemCode
 *         required: true
 *         schema:
 *           type: string
 *         example: BT-550e8400-e29b-41d4-a716-446655440000
 *
 *     responses:
 *       200:
 *         description: Item found
 *
 *       404:
 *         description: Item not found
 */
router.get("/code/:itemCode", requireAuth, itemsController.getByCode);

/**
 * @openapi
 * /items/{id}:
 *   get:
 *     tags:
 *       - Items
 *     summary: Get item by ID
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
 *         description: Item retrieved successfully
 *
 *       404:
 *         description: Item not found
 */
router.get("/:id", requireAuth, itemsController.getOne);

/**
 * @openapi
 * /items/{id}:
 *   put:
 *     tags:
 *       - Items
 *     summary: Update an item
 *     description: >
 *       Update the individual item's name, serial number,
 *       price or warehouse.
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
 *               itemName:
 *                 type: string
 *                 nullable: true
 *                 example: Logitech Mouse Unit
 *
 *               serialNumber:
 *                 type: string
 *                 nullable: true
 *                 example: M185-ABC001
 *
 *               price:
 *                 type: number
 *                 format: double
 *                 minimum: 0
 *                 example: 24.99
 *
 *               warehouseId:
 *                 type: integer
 *                 example: 1
 *
 *     responses:
 *       200:
 *         description: Item updated successfully
 *
 *       404:
 *         description: Item not found
 *
 *       422:
 *         description: Validation failed
 */
router.put("/:id", requireAuth, itemsController.update);

/**
 * @openapi
 * /items/{id}/sell:
 *   post:
 *     tags:
 *       - Items
 *     summary: Mark item as sold
 *     description: >
 *       Changes an item's status from in_stock to sold.
 *       Product quantity decreases automatically because
 *       quantity is calculated from in-stock items.
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
 *         description: Item sold successfully
 *
 *       404:
 *         description: Item not found
 *
 *       422:
 *         description: Item is not currently in stock
 */
router.post("/:id/sell", requireAuth, itemsController.sell);

/**
 * @openapi
 * /items/{id}/remove:
 *   post:
 *     tags:
 *       - Items
 *     summary: Remove item from inventory
 *     description: >
 *       Changes an item's status from in_stock to removed.
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
 *         description: Item removed successfully
 *
 *       404:
 *         description: Item not found
 *
 *       422:
 *         description: Item is not currently in stock
 */
router.post("/:id/remove", requireAuth, itemsController.remove);

/**
 * @openapi
 * /items/{id}/return:
 *   post:
 *     tags:
 *       - Items
 *     summary: Return item to inventory
 *     description: >
 *       Changes a sold or removed item's status
 *       back to in_stock.
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
 *         description: Item returned successfully
 *
 *       404:
 *         description: Item not found
 *
 *       422:
 *         description: Item is already in stock
 */
router.post("/:id/return", requireAuth, itemsController.returnItem);

export default router;
