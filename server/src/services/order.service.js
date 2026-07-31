import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Food from "../models/Food.js";
import Coupon from "../models/Coupon.js";
import StockLog from "../models/StockLog.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";
import { sendOrderStatusEmail } from "./email.service.js";

const VALID_STATUS = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Delivering",
  "Completed",
  "Cancelled",
];

export const calculateCouponDiscount = async (subtotal, couponCode) => {
  if (!couponCode) return { discount: 0, coupon: null };

  const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
  if (!coupon) throw new Error("Mã giảm giá không tồn tại hoặc không hoạt động");
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new Error("Mã giảm giá đã hết hạn");
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Mã giảm giá đã hết lượt sử dụng");
  }
  if (subtotal < coupon.minOrder) {
    throw new Error(`Đơn tối thiểu ${coupon.minOrder.toLocaleString("vi-VN")}đ để dùng mã này`);
  }

  let discount = 0;
  if (coupon.type === "percent") {
    discount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = Math.min(coupon.value, subtotal);
  }

  return { discount, coupon };
};

export const createOrderService = async (
  userId,
  deliveryAddress,
  paymentMethod,
  options = {}
) => {
  const { couponCode, shippingProvider } = options;

  const cart = await Cart.findOne({ user: userId }).populate("items.food");

  if (!cart || cart.items.length === 0) {
    throw new Error("Giỏ hàng trống");
  }

  const validItems = cart.items.filter((item) => item.food);
  if (validItems.length === 0) {
    throw new Error("Giỏ hàng chứa món ăn không tồn tại, vui lòng cập nhật giỏ hàng");
  }

  // Kiểm tra tồn kho trước khi đặt
  for (const item of validItems) {
    if (!item.food.isAvailable) {
      throw new Error(`"${item.food.name}" hiện không khả dụng`);
    }
    if (item.food.stock < item.quantity) {
      throw new Error(`"${item.food.name}" chỉ còn ${item.food.stock} sản phẩm trong kho`);
    }
  }

  const restaurant = validItems[0].food.restaurant;

  const items = validItems.map((item) => ({
    food: item.food._id,
    quantity: item.quantity,
    price: item.food.discountPrice ?? item.food.price,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let shippingFee = 0;
  if (options.shippingFee !== undefined) {
    shippingFee = Number(options.shippingFee) || 0;
  }

  let discount = 0;
  let coupon = null;
  if (couponCode) {
    const result = await calculateCouponDiscount(subtotal, couponCode);
    discount = result.discount;
    coupon = result.coupon;
  }

  const totalPrice = subtotal + shippingFee - discount;

  const order = await Order.create({
    user: userId,
    restaurant,
    items,
    subtotal,
    shippingFee,
    discountAmount: discount,
    coupon: coupon ? { code: coupon.code, discount } : undefined,
    totalPrice,
    paymentMethod,
    deliveryAddress,
    shippingProvider,
    statusHistory: [{ status: "Pending", note: "Đơn hàng được tạo" }],
  });

  // Trừ stock + cập nhật soldCount
  await Promise.all(
    items.map(async (item) => {
      await Food.findByIdAndUpdate(item.food, {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      });
      await StockLog.create({
        food: item.food,
        type: "sale",
        quantity: -item.quantity,
        note: `Đơn hàng #${order._id.toString().slice(-6)}`,
      });
    })
  );

  // Tăng lượt dùng coupon
  if (coupon) {
    await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
  }

  // Tạo thông báo cho admin
  try {
    await Notification.create({
      type: "order",
      title: "Đơn hàng mới",
      message: `Khách hàng vừa đặt đơn #${order._id.toString().slice(-6)}`,
      link: `/admin/orders`,
      isGlobal: true,
    });
  } catch {
    // không chặn việc tạo đơn
  }

  // Xóa giỏ hàng sau khi đặt
  cart.items = [];
  await cart.save();

  return order;
};

export const getMyOrdersService = async (userId) => {
  return await Order.find({ user: userId })
    .populate("restaurant", "name address")
    .populate("items.food", "name price image images")
    .sort({ createdAt: -1 });
};

export const getOrderByIdService = async (orderId) => {
  return await Order.findById(orderId)
    .populate("restaurant", "name address")
    .populate("user", "fullName email")
    .populate("items.food", "name price image images");
};

export const updateOrderStatusService = async (orderId, status, byUserId = null, note = "") => {
  if (!VALID_STATUS.includes(status)) {
    throw new Error("Trạng thái không hợp lệ");
  }

  const order = await Order.findById(orderId);
  if (!order) throw new Error("Không tìm thấy đơn hàng");

  const prevStatus = order.status;

  // Hủy đơn: hoàn stock
  if (status === "Cancelled" && prevStatus !== "Cancelled") {
    await Promise.all(
      order.items.map(async (item) => {
        await Food.findByIdAndUpdate(item.food, {
          $inc: { stock: item.quantity, soldCount: -item.quantity },
        });
      })
    );
  }

  // Hoàn tác hủy đơn -> trừ lại stock
  if (prevStatus === "Cancelled" && status !== "Cancelled" && status !== "Completed") {
    await Promise.all(
      order.items.map(async (item) => {
        await Food.findByIdAndUpdate(item.food, {
          $inc: { stock: -item.quantity, soldCount: item.quantity },
        });
      })
    );
  }

  order.status = status;
  order.statusHistory.push({
    status,
    note: note || "",
    changedAt: new Date(),
    by: byUserId,
  });
  await order.save();

  // Thông báo cho admin khi trạng thái thay đổi
  try {
    await Notification.create({
      type: "order",
      title: "Cập nhật đơn hàng",
      message: `Đơn #${orderId.toString().slice(-6)} chuyển sang "${status}"`,
      link: `/admin/orders/${orderId}`,
      isGlobal: true,
    });
  } catch {
    // không chặn
  }

  // Gửi mail thông báo (nếu có cấu hình)
  try {
    if (order.user && order.paymentMethod) {
      const user = await order.populate("user", "email");
      if (user.user?.email && process.env.SMTP_USER) {
        await sendOrderStatusEmail(user.user.email, orderId, status).catch(() => {});
      }
    }
  } catch {
    // không chặn
  }

  return Order.findById(orderId)
    .populate("restaurant", "name address")
    .populate("user", "fullName email")
    .populate("items.food", "name price image");
};

export const cancelOrderService = async (orderId, userId = null) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  if (order.status === "Completed") {
    throw new Error("Không thể hủy đơn hàng đã hoàn thành");
  }

  if (order.status === "Cancelled") {
    throw new Error("Đơn hàng đã bị hủy trước đó");
  }

  order.status = "Cancelled";
  order.statusHistory.push({
    status: "Cancelled",
    note: "Đơn hàng bị hủy",
    changedAt: new Date(),
    by: userId,
  });
  await order.save();

  // Hoàn stock
  await Promise.all(
    order.items.map(async (item) => {
      await Food.findByIdAndUpdate(item.food, {
        $inc: { stock: item.quantity, soldCount: -item.quantity },
      });
    })
  );

  return order;
};

export const getRevenueService = async () => {
  const result = await Order.aggregate([
    { $match: { status: "Completed" } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" }, totalOrders: { $sum: 1 } } },
  ]);

  return (
    result[0] || {
      totalRevenue: 0,
      totalOrders: 0,
    }
  );
};

export const getAllOrdersService = async (query = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }
  if (query.keyword) {
    filter.$or = [
      { "items.food": { $in: await getFoodIdsByKeyword(query.keyword) } },
      { _id: isValidOrderId(query.keyword) ? query.keyword : null },
    ];
  }
  if (query.startDate && query.endDate) {
    filter.createdAt = {
      $gte: new Date(query.startDate),
      $lte: new Date(new Date(query.endDate).setHours(23, 59, 59, 999)),
    };
  }
  if (query.paymentMethod) {
    filter.paymentMethod = query.paymentMethod;
  }
  if (query.minPrice || query.maxPrice) {
    filter.totalPrice = {};
    if (query.minPrice) filter.totalPrice.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.totalPrice.$lte = Number(query.maxPrice);
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "fullName email")
      .populate("restaurant", "name address")
      .populate("items.food", "name price image images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  return { orders, total, page, limit };
};

const isValidOrderId = (id) => {
  return mongoose.isValidObjectId(id);
};

const getFoodIdsByKeyword = async (keyword) => {
  const foods = await Food.find({ name: { $regex: keyword, $options: "i" } }).select("_id");
  return foods.map((f) => f._id);
};

export const getRevenueChartService = async () => {
  return await Order.aggregate([
    { $match: { status: "Completed" } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
  ]);
};

export const getOrderStatusService = async () => {
  return await Order.aggregate([
    { $group: { _id: "$status", value: { $sum: 1 } } },
    { $project: { _id: 0, name: "$_id", value: 1 } },
  ]);
};

export const getRecentOrdersService = async () => {
  return await Order.find()
    .populate("user", "fullName")
    .sort({ createdAt: -1 })
    .limit(5);
};
