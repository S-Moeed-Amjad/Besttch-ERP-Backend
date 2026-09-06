"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Luggage Storage API",
            version: "1.0.0",
            description: "API documentation for the Luggage Storage backend",
        },
        servers: [
            {
                url: "/api",
                description: "API Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        tags: [
            {
                name: "Users",
                description: "User management",
            },
            {
                name: "Authentication",
                description: "Authentication endpoints",
            },
            {
                name: "Roles",
                description: "Role management",
            },
            {
                name: "Dashboard",
                description: "Dashboard endpoints",
            },
            {
                name: "Products",
                description: "Product management",
            },
            {
                name: "Items",
                description: "Individual inventory item management",
            },
            {
                name: "Warehouses",
                description: "Warehouse management",
            },
            {
                name: "Health",
                description: "Server health",
            },
        ],
        paths: {
            "/health": {
                get: {
                    tags: ["Health"],
                    summary: "Check API health",
                    responses: {
                        "200": {
                            description: "API is running",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                example: true,
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    status: {
                                                        type: "string",
                                                        example: "ok",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/routes/*.ts", "./src/routes/**/*.ts"],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
//# sourceMappingURL=swagger.js.map