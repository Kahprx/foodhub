import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { register,login, profile } from "../controllers/auth.controller.js";

const router = express.Router();
// router dang ky
router.post("/register" , register);
//router dang nhap
router.post("/login", login);
//router thong tin
router.get("/profile", protect,profile);

export  default router;