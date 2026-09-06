"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
function required(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
exports.env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 4000),
    databaseUrl: required("DATABASE_URL"),
    jwtSecret: required("JWT_SECRET"),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
    corsOrigin: (process.env.CORS_ORIGIN ?? "http://localhost:5173").split(","),
    cookieName: process.env.COOKIE_NAME ?? "besttech_token",
    isProduction: process.env.NODE_ENV === "production",
};
//# sourceMappingURL=env.js.map