import express from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import { createOrder , 
    getMyOrders, 
    getOrderById,
    updateOrderStatus,
    cancelOrder
    ,getRevenue
    ,getAllOrders,
 getRevenueChart,
  getOrderStatus,
  getRecentOrders
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/revenue", protect, getRevenue);
router.get("/revenue/chart", protect, getRevenueChart);

router.get(
    "/status/chart",
    protect,
    adminOnly,
    getOrderStatus
);

router.get("/all", protect, getAllOrders);  

router.get("/", protect, getMyOrders);
router.get(
  "/recent",
  protect,
  adminOnly,
  getRecentOrders
);
router.get("/:id", protect, getOrderById);

router.put("/:id/status", protect, updateOrderStatus);

router.put("/:id/cancel", protect, cancelOrder);
export default router;