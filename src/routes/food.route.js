import express from "express";
import { createFood,getAllFoods,getFoodById } from "../controllers/food.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { getFoodByIdService } from "../services/food.service.js";

const router = express.Router();

router.post("/", protect, createFood);
router.get("/", getAllFoods);
router.get("/:id",getFoodById);
export default router;