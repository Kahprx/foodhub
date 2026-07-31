import {
  createReviewService,
  deleteReviewService,
  getReviewsService,
  updateReviewService,
  getAllReviewsAdminService,
  approveReviewService,
  deleteReviewAdminService,
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
    return res.status(201).json({
      success: true,
      message: "Đánh giá của bạn đang chờ admin duyệt",
      data: result.review,
    });
  } catch (error) {
    const isDuplicate = error?.code === 11000;
    return res.status(isDuplicate ? 409 : 400).json({
      success: false,
      message: isDuplicate ? "Bạn đã đánh giá sản phẩm này rồi" : error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const result = await updateReviewService(req.user.id, req.params.id, req.body);
    return res.status(200).json({ success: true, data: result.review });
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

export const getAllReviewsAdmin = async (req, res) => {
  try {
    const result = await getAllReviewsAdminService(req.query);
    return res.status(200).json({
      success: true,
      total: result.total,
      pendingCount: result.pendingCount,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
      data: result.reviews,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    const review = await approveReviewService(id, isApproved !== false);
    return res.status(200).json({
      success: true,
      message: review.isApproved ? "Đã duyệt đánh giá" : "Đã ẩn đánh giá",
      data: review,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteReviewAdmin = async (req, res) => {
  try {
    const summary = await deleteReviewAdminService(req.params.id);
    return res.status(200).json({ success: true, message: "Xóa đánh giá thành công", summary });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
