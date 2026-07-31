import express from "express";
import {
  createFood,
  getAllFoods,
  getRecommendedFoods,
  getFoodById,
  updateFood,
  deleteFood,
  getAllFoodsAdmin,
  duplicateFood,
  adjustStock,
  getStockLogs,
  exportFoodsExcel,
  importFoodsExcel,
} from "../controllers/food.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import { uploadMemory } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createFood);
router.get("/", getAllFoods);
router.get("/admin", protect, adminOnly, getAllFoodsAdmin);
router.get("/recommendations", getRecommendedFoods);
router.get("/export", exportFoodsExcel);
router.post("/import", protect, adminOnly, uploadMemory.single("file"), importFoodsExcel);
router.get("/stock-logs", protect, adminOnly, getStockLogs);
router.get("/:id", getFoodById);
router.post("/:id/duplicate", protect, adminOnly, duplicateFood);
router.put("/:id/stock", protect, adminOnly, adjustStock);
router.put("/:id", protect, adminOnly, updateFood);
router.delete("/:id", protect, adminOnly, deleteFood);

export default router;
