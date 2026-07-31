import express from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import {
  createReview,
  deleteReview,
  getReviews,
  updateReview,
  getAllReviewsAdmin,
  approveReview,
  deleteReviewAdmin,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/", getReviews);
router.get("/all", protect, adminOnly, getAllReviewsAdmin);
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.patch("/:id/approve", protect, adminOnly, approveReview);
router.delete("/:id/admin", protect, adminOnly, deleteReviewAdmin);
router.delete("/:id", protect, deleteReview);

export default router;
