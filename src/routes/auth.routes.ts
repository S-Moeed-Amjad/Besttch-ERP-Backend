import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";
import { loginRateLimiter } from "../middleware/rateLimit";

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Authenticate a user using email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@besttech.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: ChangeThisImmediately123!
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Invalid email or password
 *       429:
 *         description: Too many login attempts
 *       500:
 *         description: Internal server error
 */
router.post("/login", loginRateLimiter, authController.login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout user
 *     description: Logs out the currently authenticated user.
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Internal server error
 */
router.post("/logout", authController.logout);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current user
 *     description: Returns the currently authenticated user's profile.
 *     responses:
 *       200:
 *         description: Current user retrieved successfully
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.get("/me", requireAuth, authController.me);

/**
 * @openapi
 * /auth/me:
 *   put:
 *     tags:
 *       - Authentication
 *     summary: Update current user profile
 *     description: Updates profile information for the currently authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             properties:
 *               name:
 *                 type: string
 *                 example: System Administrator
 *               phone:
 *                 type: string
 *                 example: "+441234567890"
 *               avatarUrl:
 *                 type: string
 *                 nullable: true
 *                 example: "https://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.put("/me", requireAuth, authController.updateProfile);

export default router;
