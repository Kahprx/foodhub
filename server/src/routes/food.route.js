import express from "express";
import { createFood,getAllFoods,getRecommendedFoods,getFoodById,updateFood,deleteFood } from "../controllers/food.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createFood);
router.get("/", getAllFoods);
router.get("/recommendations", getRecommendedFoods);
router.get("/:id",getFoodById);
router.put("/:id", protect , updateFood);
router.delete("/:id", protect,deleteFood);
export default router;
