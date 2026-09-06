import { Router } from "express";

import * as productsController from "../controllers/products.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products
 *     description: Returns all products with quantity calculated from in-stock items. Supports search by product name, SKU, barcode or product ID.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, SKU, barcode or ID
 *         example: Logitech
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */
router.get("/", requireAuth, productsController.list);

/**
 * @openapi
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sku
 *               - barcode
 *               - name
 *             properties:
 *               sku:
 *                 type: string
 *                 example: MOUSE-M185
 *               barcode:
 *                 type: string
 *                 example: "5099206027275"
 *               name:
 *                 type: string
 *                 example: Logitech M185 Wireless Mouse
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Wireless optical mouse
 *               unit:
 *                 type: string
 *                 example: piece
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Product created successfully
 *       422:
 *         description: Validation failed
 */
router.post("/", requireAuth, productsController.create);

/**
 * @openapi
 * /products/barcode/{barcode}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Find product by barcode
 *     parameters:
 *       - in: path
 *         name: barcode
 *         required: true
 *         schema:
 *           type: string
 *         example: "5099206027275"
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/barcode/:barcode", requireAuth, productsController.getByBarcode);

/**
 * @openapi
 * /products/sku/{sku}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Find product by SKU
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         example: MOUSE-M185
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/sku/:sku", requireAuth, productsController.getBySku);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get("/:id", requireAuth, productsController.getOne);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sku:
 *                 type: string
 *                 example: MOUSE-M185
 *               barcode:
 *                 type: string
 *                 example: "5099206027275"
 *               name:
 *                 type: string
 *                 example: Logitech M185 Wireless Mouse
 *               description:
 *                 type: string
 *                 nullable: true
 *               unit:
 *                 type: string
 *                 example: piece
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       422:
 *         description: Validation failed
 */
router.put("/:id", requireAuth, productsController.update);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete a product
 *     description: Soft deletes the product. Only manager and admin users can delete a product. Product cannot be deleted while items are still in stock.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       403:
 *         description: Only manager or admin can delete the product
 *       404:
 *         description: Product not found
 *       422:
 *         description: Product still has items in stock
 */
router.delete("/:id", requireAuth, productsController.remove);

export default router;
