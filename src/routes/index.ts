import { Router } from "express";
import warehousesRoutes from "./warehouses.routes";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import rolesRoutes from "./roles.routes";
import dashboardRoutes from "./dashboard.routes";
import productsRoutes from "./products.routes";
import itemsRoutes from "./items.routes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/roles", rolesRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/products", productsRoutes);
router.use("/items", itemsRoutes);
router.use("/warehouses", warehousesRoutes);
export default router;
