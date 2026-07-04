import express from "express";
import healthRoute from "./health.route.js";
import authRoute from "./auth.route.js";
import restaurantRoute from "./restaurant.route.js"

const router = express.Router();

// Health Check
router.use("/health", healthRoute);
router.use("/auth", authRoute);
router.use ("/restaurants",restaurantRoute);
export default router;