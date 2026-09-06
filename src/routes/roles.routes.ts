import { Router } from "express";
import * as rolesController from "../controllers/roles.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { USER_MANAGER_ROLES } from "../constants/roles";

const router = Router();

/**
 * @openapi
 * /roles:
 *   get:
 *     tags:
 *       - Roles
 *     summary: Get all roles
 *     description: Returns the list of available roles.
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  requireAuth,
  requireRole(...USER_MANAGER_ROLES),
  rolesController.list
);

export default router;
