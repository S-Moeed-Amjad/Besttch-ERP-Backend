import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { INTERNAL_ROLES } from "../constants/roles";

const router = Router();

/**
 * @openapi
 * /dashboard/stats:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get dashboard statistics
 *     description: Returns dashboard statistics for authorised internal users.
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied
 *       500:
 *         description: Internal server error
 */
router.get(
  "/stats",
  requireAuth,
  requireRole(...INTERNAL_ROLES),
  dashboardController.stats
);

export default router;
