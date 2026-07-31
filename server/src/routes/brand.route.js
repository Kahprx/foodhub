import express from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from "../controllers/brand.controller.js";

const router = express.Router();

router.post("/", protect, adminOnly, createBrand);
router.get("/", getAllBrands);
router.get("/:id", getBrandById);
router.put("/:id", protect, adminOnly, updateBrand);
router.delete("/:id", protect, adminOnly, deleteBrand);

export default router;
