import Coupon from "../models/Coupon.js";

export const createCouponService = async (data) => {
  if (!data.code) throw new Error("Mã giảm giá là bắt buộc");
  const existing = await Coupon.findOne({ code: data.code.toUpperCase() });
  if (existing) throw new Error("Mã giảm giá đã tồn tại");
  return Coupon.create({ ...data, code: data.code.toUpperCase() });
};

export const getAllCouponsService = async (query = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 50);
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";
  if (query.keyword) {
    filter.code = { $regex: query.keyword, $options: "i" };
  }

  const [coupons, total] = await Promise.all([
    Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Coupon.countDocuments(filter),
  ]);

  return { coupons, total, page, limit };
};

export const getCouponByCodeService = async (code) => {
  return Coupon.findOne({ code: code.toUpperCase(), isActive: true });
};

export const updateCouponService = async (id, data) => {
  const coupon = await Coupon.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!coupon) throw new Error("Không tìm thấy mã giảm giá");
  return coupon;
};

export const deleteCouponService = async (id) => {
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) throw new Error("Không tìm thấy mã giảm giá");
  return coupon;
};
