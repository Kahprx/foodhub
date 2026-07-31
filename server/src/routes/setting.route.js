import express from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import {
  getAllSettings,
  getSetting,
  updateSettings,
} from "../controllers/setting.controller.js";

const router = express.Router();

router.get("/", getAllSettings);
router.get("/:key", getSetting);
router.put("/", protect, adminOnly, updateSettings);

export default router;
