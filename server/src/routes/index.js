import express from "express";
import healthRoute from "./health.route.js";
import authRoute from "./auth.route.js";
import restaurantRoute from "./restaurant.route.js"
import foodRoutes from "./food.route.js";
import cartRoutes from "./cart.route.js";
import orderRoutes from "./order.route.js";
const router = express.Router();

// Health Check
router.use("/health", healthRoute);
router.use("/auth", authRoute);
router.use ("/restaurants",restaurantRoute);
router.use("/foods", foodRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
export default router;