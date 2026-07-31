import express from "express";
import healthRoute from "./health.route.js";
import authRoute from "./auth.route.js";
import restaurantRoute from "./restaurant.route.js";
import foodRoutes from "./food.route.js";
import cartRoutes from "./cart.route.js";
import orderRoutes from "./order.route.js";
import wishlistRoutes from "./wishlist.route.js";
import reviewRoutes from "./review.routes.js";
import categoryRoutes from "./category.route.js";
import brandRoutes from "./brand.route.js";
import couponRoutes from "./coupon.route.js";
import bannerRoutes from "./banner.route.js";
import settingRoutes from "./setting.route.js";
import uploadRoutes from "./upload.route.js";
import reportRoutes from "./report.route.js";
import paymentRoutes from "./payment.route.js";
import subscriberRoutes from "./subscriber.route.js";

const router = express.Router();

// Health Check
router.use("/health", healthRoute);
router.use("/auth", authRoute);
router.use("/restaurants", restaurantRoute);
router.use("/foods", foodRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/reviews", reviewRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/coupons", couponRoutes);
router.use("/banners", bannerRoutes);
router.use("/settings", settingRoutes);
router.use("/upload", uploadRoutes);
router.use("/reports", reportRoutes);
router.use("/payment", paymentRoutes);
router.use("/subscribers", subscriberRoutes);

export default router;
