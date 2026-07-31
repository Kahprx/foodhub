import {
  createReviewService,
  deleteReviewService,
  getReviewsService,
  updateReviewService,
} from "../services/review.service.js";

export const getReviews = async (req, res) => {
  try {
    const { foodId, page, limit } = req.query;
    if (!foodId) {
      return res.status(400).json({ success: false, message: "foodId is required" });
    }

    const result = await getReviewsService(foodId, page, limit);
    return res.status(200).json({
      success: true,
      data: result.reviews,
      summary: result.summary,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const result = await createReviewService(req.user.id, req.body);
    return res.status(201).json({ success: true, data: result.review, summary: result.summary });
  } catch (error) {
    const isDuplicate = error?.code === 11000;
    return res.status(isDuplicate ? 409 : 400).json({
      success: false,
      message: isDuplicate ? "You have already reviewed this food" : error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const result = await updateReviewService(req.user.id, req.params.id, req.body);
    return res.status(200).json({ success: true, data: result.review, summary: result.summary });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const summary = await deleteReviewService(req.user.id, req.params.id);
    return res.status(200).json({ success: true, summary });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
