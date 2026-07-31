import express from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import {
  getDashboardStats,
  getTopSellingProducts,
  getTopCustomers,
  getLowStockProducts,
  getSalesAnalytics,
  getTopBrands,
  getConversionAnalytics,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", protect, adminOnly, getDashboardStats);
router.get("/top-selling", protect, adminOnly, getTopSellingProducts);
router.get("/top-customers", protect, adminOnly, getTopCustomers);
router.get("/low-stock", protect, adminOnly, getLowStockProducts);
router.get("/analytics", protect, adminOnly, getSalesAnalytics);
router.get("/top-brands", protect, adminOnly, getTopBrands);
router.get("/conversion", protect, adminOnly, getConversionAnalytics);

export default router;
