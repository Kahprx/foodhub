import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { createRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant,deleteRestaurant,} from "../controllers/restaurant.controller.js";


const router = express.Router();

router.post("/", protect, createRestaurant);

router.get("/", getAllRestaurants);

router.get("/:id", getRestaurantById);

router.put("/:id", protect, updateRestaurant);

router.delete("/:id", protect, deleteRestaurant);
export default router;
