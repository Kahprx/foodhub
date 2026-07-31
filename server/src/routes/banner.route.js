import express from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import {
  createBanner,
  getAllBanners,
  getActiveBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from "../controllers/banner.controller.js";

const router = express.Router();

router.post("/", protect, adminOnly, createBanner);
router.get("/active", getActiveBanners);
router.get("/", getAllBanners);
router.get("/:id", getBannerById);
router.put("/:id", protect, adminOnly, updateBanner);
router.delete("/:id", protect, adminOnly, deleteBanner);

export default router;
