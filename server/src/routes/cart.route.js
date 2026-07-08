import express from "express";
import { addToCart, getCart,updateCartItem,removeCartItem,clearCart } from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/", protect, updateCartItem);
router.delete("/:foodId", protect , removeCartItem);
router.delete("/", protect, clearCart);
export default router;