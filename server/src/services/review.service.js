import mongoose from "mongoose";
import Food from "../models/Food.js";
import Review from "../models/review.js";

const validateObjectId = (id, label) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error(`${label} ID is invalid`);
  }
};

const ensureFoodExists = async (foodId) => {
  validateObjectId(foodId, "Food");
  const food = await Food.findById(foodId);
  if (!food) throw new Error("Food not found");
};

const getReviewSummary = async (foodId) => {
  const [summary] = await Review.aggregate([
    { $match: { food: new mongoose.Types.ObjectId(foodId) } },
    { $group: { _id: null, averageRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
  ]);

  return {
    averageRating: Number((summary?.averageRating || 0).toFixed(1)),
    totalReviews: summary?.totalReviews || 0,
  };
};

const syncFoodRating = async (foodId) => {
  const summary = await getReviewSummary(foodId);
  await Food.findByIdAndUpdate(foodId, { rating: summary.averageRating });
  return summary;
};

export const getReviewsService = async (foodId, page = 1, limit = 10) => {
  await ensureFoodExists(foodId);
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const filter = { food: foodId };

  const [reviews, total, summary] = await Promise.all([
    Review.find(filter)
      .populate("user", "fullName avatar")
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit),
    Review.countDocuments(filter),
    getReviewSummary(foodId),
  ]);

  return { reviews, total, page: safePage, limit: safeLimit, summary };
};

export const createReviewService = async (userId, { foodId, rating, comment }) => {
  await ensureFoodExists(foodId);

  const review = await Review.create({ user: userId, food: foodId, rating, comment });
  const summary = await syncFoodRating(foodId);
  await review.populate("user", "fullName avatar");

  return { review, summary };
};

export const updateReviewService = async (userId, reviewId, { rating, comment }) => {
  validateObjectId(reviewId, "Review");
  const update = {};
  if (rating !== undefined) update.rating = rating;
  if (comment !== undefined) update.comment = comment;

  const review = await Review.findOneAndUpdate(
    { _id: reviewId, user: userId },
    update,
    { returnDocument: "after", runValidators: true }
  ).populate("user", "fullName avatar");

  if (!review) throw new Error("Review not found or you do not have permission");
  const summary = await syncFoodRating(review.food);

  return { review, summary };
};

export const deleteReviewService = async (userId, reviewId) => {
  validateObjectId(reviewId, "Review");
  const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });

  if (!review) throw new Error("Review not found or you do not have permission");
  const summary = await syncFoodRating(review.food);

  return summary;
};
