import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { createOrder , getMyOrders, getOrderById,updateOrderStatus,cancelOrder,getRevenue,getAllOrders} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/revenue", protect, getRevenue);

router.get("/all", protect, getAllOrders);  

router.get("/", protect, getMyOrders);

router.get("/:id", protect, getOrderById);

router.put("/:id/status", protect, updateOrderStatus);

router.put("/:id/cancel", protect, cancelOrder);
export default router;