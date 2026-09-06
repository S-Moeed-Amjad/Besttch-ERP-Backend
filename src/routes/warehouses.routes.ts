import { Router } from "express";

import * as warehousesController from "../controllers/warehouses.controller";

import { requireAuth } from "../middleware/auth";

const router = Router();

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
router.get("/", requireAuth, warehousesController.list);

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
router.post("/", requireAuth, warehousesController.create);

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
router.get("/code/:code", requireAuth, warehousesController.getByCode);

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
router.get("/:id", requireAuth, warehousesController.getOne);

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
router.put("/:id", requireAuth, warehousesController.update);

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
router.delete("/:id", requireAuth, warehousesController.remove);

export default router;
