import express from "express";
import healthRoute from "./health.route.js";

const router = express.Router();

// Health Check
router.use("/health", healthRoute);

export default router;