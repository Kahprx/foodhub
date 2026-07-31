import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  register,
  login,
  profile,
  getFavorites,
  toggleFavorite,
  getRecentlyViewed,
  addRecentlyViewed,
  getUsers,
  deleteUser
} from "../controllers/auth.controller.js";
const router = express.Router();
// router dang ky
router.post("/register" , register);
//router dang nhap
router.post("/login", login);
//router thong tin
router.get("/profile", protect,profile);
router.get("/favorites", protect, getFavorites);
router.patch("/favorites/:foodId", protect, toggleFavorite);
router.get("/recently-viewed", protect, getRecentlyViewed);
router.post("/recently-viewed/:foodId", protect, addRecentlyViewed);
router.get("/users", protect, getUsers);
router.delete("/users/:id", protect, deleteUser);

export  default router;
