import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
 
export const createOrderService = async (
  userId,
  deliveryAddress,
  paymentMethod
) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.food");

  if (!cart || cart.items.length === 0) {
    throw new Error("Giỏ hàng trống");
  }

  const validItems = cart.items.filter(item => item.food);
  if (validItems.length === 0) {
    throw new Error("Giỏ hàng chứa món ăn không tồn tại, vui lòng cập nhật giỏ hàng");
  }

  const restaurant = validItems[0].food.restaurant;

  const items = validItems.map((item) => ({
    food: item.food._id,
    quantity: item.quantity,
    price: item.food.price,
  }));

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    user: userId,
    restaurant,
    items,
    totalPrice,
    paymentMethod,
    deliveryAddress,
  });


  // Xóa giỏ hàng sau khi đặt
  cart.items = [];
  await cart.save();

  return order;
};
export const getMyOrdersService = async (userId) =>{
  return await Order.find({user :userId})
  .populate("restaurant" , "name address")
  .sort({createdAt : -1});

};
export const getOrderByIdService = async (orderId) =>{
  return await Order.findById(orderId)
  .populate("restaurant" , "name address")
  .populate("user", "fullName email")
  .populate("items.food", "name price image");
};
export const updateOrderStatusService = async(orderId, status) =>{
  return await Order.findByIdAndUpdate(
    orderId,
    {status},
    {new : true}
  )
  .populate("restaurant" , "name address")
  .populate("user", "fullName email")
  .populate("items.food", "name price");
};
export const cancelOrderService = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  if (order.status === "Completed") {
    throw new Error("Không thể hủy đơn hàng đã hoàn thành");
  }

  order.status = "Cancelled";

  await order.save();

  return order;
};
export const getRevenueService = async () => {
  const result = await Order.aggregate([
    {
      $match: {
        status: "Completed",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  return result[0] || {
    totalRevenue: 0,
    totalOrders: 0,
  };
};
export const getAllOrdersService = async () => {
  return await Order.find()
    .populate("user", "fullName email")
    .populate("restaurant", "name address")
    .populate("items.food", "name price image")
    .sort({ createdAt: -1 });
};