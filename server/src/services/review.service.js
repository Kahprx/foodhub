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
    { $match: { food: new mongoose.Types.ObjectId(foodId), isApproved: true } },
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
  const filter = { food: foodId, isApproved: true };

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

export const createReviewService = async (userId, { foodId, rating, comment, images }) => {
  await ensureFoodExists(foodId);

  const review = await Review.create({
    user: userId,
    food: foodId,
    rating,
    comment,
    images: images || [],
    isApproved: false,
  });
  await review.populate("user", "fullName avatar");

  return { review };
};

export const updateReviewService = async (userId, reviewId, { rating, comment, images }) => {
  validateObjectId(reviewId, "Review");
  const update = {};
  if (rating !== undefined) update.rating = rating;
  if (comment !== undefined) update.comment = comment;
  if (images !== undefined) update.images = images;

  const review = await Review.findOneAndUpdate(
    { _id: reviewId, user: userId },
    update,
    { returnDocument: "after", runValidators: true }
  ).populate("user", "fullName avatar");

  if (!review) throw new Error("Review not found or you do not have permission");

  return { review };
};

export const deleteReviewService = async (userId, reviewId) => {
  validateObjectId(reviewId, "Review");
  const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });

  if (!review) throw new Error("Review not found or you do not have permission");
  const summary = await syncFoodRating(review.food);

  return summary;
};

export const getAllReviewsAdminService = async (query = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.isApproved !== undefined) filter.isApproved = query.isApproved === "true";
  if (query.status === "pending") filter.isApproved = false;
  if (query.rating) filter.rating = Number(query.rating);

  const [reviews, total, pendingCount] = await Promise.all([
    Review.find(filter)
      .populate("user", "fullName avatar email")
      .populate("food", "name image price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments(filter),
    Review.countDocuments({ isApproved: false }),
  ]);

  return { reviews, total, pendingCount, page, limit };
};

export const approveReviewService = async (reviewId, isApproved) => {
  validateObjectId(reviewId, "Review");
  const review = await Review.findByIdAndUpdate(
    reviewId,
    { isApproved },
    { returnDocument: "after" }
  ).populate("user", "fullName avatar").populate("food", "name image");

  if (!review) throw new Error("Không tìm thấy đánh giá");

  if (isApproved) {
    await syncFoodRating(review.food);
  }

  return review;
};

export const deleteReviewAdminService = async (reviewId) => {
  validateObjectId(reviewId, "Review");
  const review = await Review.findByIdAndDelete(reviewId);
  if (!review) throw new Error("Không tìm thấy đánh giá");
  const summary = await syncFoodRating(review.food);
  return summary;
};
