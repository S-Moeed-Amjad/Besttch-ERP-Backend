"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const warehouses_routes_1 = __importDefault(require("./warehouses.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const roles_routes_1 = __importDefault(require("./roles.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const products_routes_1 = __importDefault(require("./products.routes"));
const items_routes_1 = __importDefault(require("./items.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/users", users_routes_1.default);
router.use("/roles", roles_routes_1.default);
router.use("/dashboard", dashboard_routes_1.default);
router.use("/products", products_routes_1.default);
router.use("/items", items_routes_1.default);
router.use("/warehouses", warehouses_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map