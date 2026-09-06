import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
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

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
