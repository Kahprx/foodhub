import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", protect, getDashboardStats);

export default router;