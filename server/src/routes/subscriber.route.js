import express from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import {
  subscribe,
  unsubscribe,
  getAllSubscribers,
  getSubscriberCount,
} from "../controllers/subscriber.controller.js";

const router = express.Router();

router.post("/", subscribe);
router.get("/", protect, adminOnly, getAllSubscribers);
router.get("/count", protect, adminOnly, getSubscriberCount);
router.delete("/:email", unsubscribe);

export default router;
