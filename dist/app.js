"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./config/env");
const swagger_1 = require("./config/swagger");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
function createApp() {
    const app = (0, express_1.default)();
    /*
     * Swagger
     *
     * Swagger is mounted before Helmet because Swagger UI can be affected
     * by Helmet's default Content Security Policy.
     */
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
        explorer: true,
        swaggerOptions: {
            persistAuthorization: true,
            withCredentials: true,
        },
        customSiteTitle: "BestTch API",
    }));
    /*
     * Raw Swagger JSON
     */
    app.get("/api-docs.json", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swagger_1.swaggerSpec);
    });
    /*
     * Security
     */
    app.use((0, helmet_1.default)());
    /*
     * CORS
     */
    app.use((0, cors_1.default)({
        origin: env_1.env.corsOrigin,
        credentials: true,
    }));
    /*
     * Body parsers
     */
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    /*
     * Cookie parser
     */
    app.use((0, cookie_parser_1.default)());
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
    app.use("/api", routes_1.default);
    /*
     * 404 handler
     */
    app.use(errorHandler_1.notFoundHandler);
    /*
     * Global error handler
     */
    app.use(errorHandler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map