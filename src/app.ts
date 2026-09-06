import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import apiRoutes from "./routes";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  /*
   * Swagger
   *
   * Swagger is mounted before Helmet because Swagger UI can be affected
   * by Helmet's default Content Security Policy.
   */
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
        withCredentials: true,
      },
      customSiteTitle: "BestTch API",
    })
  );

  /*
   * Raw Swagger JSON
   */
  app.get("/api-docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  /*
   * Security
   */
  app.use(helmet());

  /*
   * CORS
   */
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    })
  );

  /*
   * Body parsers
   */
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /*
   * Cookie parser
   */
  app.use(cookieParser());

  /*
   * Health check
   */
  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      success: true,
      data: {
        status: "ok",
      },
    });
  });

  /*
   * Main API routes
   */
  app.use("/api", apiRoutes);

  /*
   * 404 handler
   */
  app.use(notFoundHandler);

  /*
   * Global error handler
   */
  app.use(errorHandler);

  return app;
}
