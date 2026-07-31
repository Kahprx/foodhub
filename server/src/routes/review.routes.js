import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createReview,
  deleteReview,
  getReviews,
  updateReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/", getReviews);
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;
