import mongoose from "mongoose";
import Food from "../models/Food.js";
import Wishlist from "../models/Wishlist.js";

const ensureFoodExists = async (foodId) => {
  if (!mongoose.isValidObjectId(foodId)) {
    throw new Error("Food ID is invalid");
  }

  const food = await Food.findById(foodId);
  if (!food) {
    throw new Error("Food not found");
  }
};

export const getWishlistService = async (userId) => {
  const wishlist = await Wishlist.findOne({ user: userId }).populate(
    "foods",
    "name description price image category rating restaurant"
  );

  return wishlist?.foods || [];
};

export const addToWishlistService = async (userId, foodId) => {
  await ensureFoodExists(foodId);

  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    { $addToSet: { foods: foodId } },
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
  ).populate("foods", "name description price image category rating restaurant");

  return wishlist.foods;
};

export const removeFromWishlistService = async (userId, foodId) => {
  if (!mongoose.isValidObjectId(foodId)) {
    throw new Error("Food ID is invalid");
  }

  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    { $pull: { foods: foodId } },
    { returnDocument: "after" }
  ).populate("foods", "name description price image category rating restaurant");

  return wishlist?.foods || [];
};
