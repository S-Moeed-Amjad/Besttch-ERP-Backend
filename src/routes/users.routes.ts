import { Router } from "express";

import * as usersController from "../controllers/users.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { USER_MANAGER_ROLES } from "../constants/roles";

const router = Router();

/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     description: Creates a new ERP user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNumber
 *               - roleId
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@besttch.com
 *               phoneNumber:
 *                 type: string
 *                 example: "+447123456789"
 *               roleId:
 *                 type: integer
 *                 example: 2
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied
 *       422:
 *         description: Validation failed
 */

router.get(
  "/",
  requireAuth,
  requireRole(...USER_MANAGER_ROLES),
  usersController.list
);

router.post(
  "/",
  requireAuth,
  requireRole(...USER_MANAGER_ROLES),
  usersController.create
);

/**
 * @openapi
 * /users/{id}/status:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Change user status
 *     description: Updates the status of an existing user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied
 *       404:
 *         description: User not found
 */
router.patch(
  "/:id/status",
  requireAuth,
  requireRole(...USER_MANAGER_ROLES),
  usersController.setStatus
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied
 *       404:
 *         description: User not found
 *
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied
 *       404:
 *         description: User not found
 *
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied
 *       404:
 *         description: User not found
 */
router.get(
  "/:id",
  requireAuth,
  requireRole(...USER_MANAGER_ROLES),
  usersController.getOne
);

router.put(
  "/:id",
  requireAuth,
  requireRole(...USER_MANAGER_ROLES),
  usersController.update
);

router.delete(
  "/:id",
  requireAuth,
  requireRole(...USER_MANAGER_ROLES),
  usersController.remove
);

export default router;
