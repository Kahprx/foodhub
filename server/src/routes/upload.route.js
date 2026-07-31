import express from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import {
  uploadImage,
  uploadMultipleImages,
} from "../controllers/upload.controller.js";
import { uploadSingle, uploadMultiple } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/image", protect, uploadSingle("file"), uploadImage);
router.post("/images", protect, uploadMultiple("files", 8), uploadMultipleImages);

export default router;
