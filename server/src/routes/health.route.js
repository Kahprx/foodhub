import express from "express";
import { healthCheck } from "../controllers/health.controller.js";

const router = express.Router();

// GET /api/v1/health
router.get("/", healthCheck);

export default router;  