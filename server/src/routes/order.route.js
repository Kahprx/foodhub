import express from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getRevenue,
  getAllOrders,
  getRevenueChart,
  getOrderStatus,
  getRecentOrders,
  checkCoupon,
  exportOrdersExcel,
  exportOrderPdf,
  updateShipping,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/revenue", protect, getRevenue);
router.get("/revenue/chart", protect, getRevenueChart);

router.get("/status/chart", protect, adminOnly, getOrderStatus);

router.get("/all", protect, adminOnly, getAllOrders);

router.get("/export", protect, adminOnly, exportOrdersExcel);

router.get("/", protect, getMyOrders);
router.get("/recent", protect, adminOnly, getRecentOrders);

router.get("/coupon/:code", protect, checkCoupon);

router.get("/:id", protect, getOrderById);
router.get("/:id/pdf", protect, adminOnly, exportOrderPdf);

router.put("/:id/status", protect, adminOnly, updateOrderStatus);

router.put("/:id/shipping", protect, adminOnly, updateShipping);

router.put("/:id/cancel", protect, cancelOrder);

export default router;
