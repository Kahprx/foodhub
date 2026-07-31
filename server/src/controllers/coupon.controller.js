import {
  createCouponService,
  getAllCouponsService,
  getCouponByCodeService,
  updateCouponService,
  deleteCouponService,
} from "../services/coupon.service.js";

export const createCoupon = async (req, res) => {
  try {
    const coupon = await createCouponService(req.body);
    return res.status(201).json({ success: true, message: "Tạo mã giảm giá thành công", data: coupon });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const result = await getAllCouponsService(req.query);
    return res.status(200).json({
      success: true,
      total: result.total,
      page: result.page,
      limit: result.limit,
      data: result.coupons,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCouponByCode = async (req, res) => {
  try {
    const coupon = await getCouponByCodeService(req.params.code);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Không tìm thấy mã giảm giá" });
    }
    return res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await updateCouponService(req.params.id, req.body);
    return res.status(200).json({ success: true, message: "Cập nhật mã giảm giá thành công", data: coupon });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await deleteCouponService(req.params.id);
    return res.status(200).json({ success: true, message: "Xóa mã giảm giá thành công", data: coupon });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
