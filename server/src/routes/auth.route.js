import express from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import {
  register,
  login,
  profile,
  getFavorites,
  toggleFavorite,
  getRecentlyViewed,
  addRecentlyViewed,
  getUsers,
  deleteUser,
  verifyEmail,
  resendVerifyEmail,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  getDeletedUsers,
  restoreUser,
  changeUserRole,
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  addAddress,
  removeAddress,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/resend-verify-email", resendVerifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/profile", protect, profile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/addresses", protect, addAddress);
router.delete("/addresses/:index", protect, removeAddress);

router.get("/favorites", protect, getFavorites);
router.patch("/favorites/:foodId", protect, toggleFavorite);
router.get("/recently-viewed", protect, getRecentlyViewed);
router.post("/recently-viewed/:foodId", protect, addRecentlyViewed);

router.get("/notifications", protect, getMyNotifications);
router.patch("/notifications/read-all", protect, markAllNotificationsRead);
router.patch("/notifications/:id/read", protect, markNotificationRead);

router.get("/users", protect, adminOnly, getUsers);
router.get("/users/deleted", protect, adminOnly, getDeletedUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.put("/users/:id/restore", protect, adminOnly, restoreUser);
router.patch("/users/:id/role", protect, adminOnly, changeUserRole);

export default router;
