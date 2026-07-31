import Food from "../models/Food.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalFoods = await Food.countDocuments();

    const totalUsers = await User.countDocuments();

    const totalOrders = await Order.countDocuments();

    const revenue = await Order.aggregate([
      {
        $match: {
          status: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalFoods,
        totalUsers,
        totalOrders,
        revenue: revenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};