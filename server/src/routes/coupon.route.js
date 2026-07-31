import express from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import {
  createCoupon,
  getAllCoupons,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.post("/", protect, adminOnly, createCoupon);
router.get("/", getAllCoupons);
router.get("/code/:code", getCouponByCode);
router.put("/:id", protect, adminOnly, updateCoupon);
router.delete("/:id", protect, adminOnly, deleteCoupon);

export default router;
