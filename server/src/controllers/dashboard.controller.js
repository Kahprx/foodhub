import Food from "../models/Food.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Review from "../models/review.js";

const startOfDay = (offsetDays = 0) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (offsetDays) d.setDate(d.getDate() + offsetDays);
  return d;
};

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalFoods,
      totalUsers,
      totalOrders,
      pendingOrders,
      cancelledOrders,
      lowStock,
      revenueAgg,
      revenueToday,
      revenueThisWeek,
      revenueThisMonth,
      orderToday,
      orderThisWeek,
      orderThisMonth,
      avgOrderValue,
      recentUsers,
      pendingReviews,
    ] = await Promise.all([
      Food.countDocuments(),
      User.countDocuments({ isDeleted: { $ne: true } }),
      Order.countDocuments(),
      Order.countDocuments({ status: "Pending" }),
      Order.countDocuments({ status: "Cancelled" }),
      Food.countDocuments({ stock: { $lte: 10 } }),
      Order.aggregate([
        { $match: { status: "Completed" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { status: "Completed", createdAt: { $gte: startOfDay() } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        {
          $match: {
            status: "Completed",
            createdAt: { $gte: startOfDay(-6) },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        {
          $match: {
            status: "Completed",
            createdAt: { $gte: new Date(new Date().setDate(1)) },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
      ]),
      Order.countDocuments({ createdAt: { $gte: startOfDay() } }),
      Order.countDocuments({ createdAt: { $gte: startOfDay(-6) } }),
      Order.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(1)) } }),
      Order.aggregate([
        { $match: { status: "Completed" } },
        { $group: { _id: null, avg: { $avg: "$totalPrice" } } },
      ]),
      User.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(5).select("fullName email avatar createdAt"),
      Review.countDocuments({ isApproved: false }),
    ]);

    res.json({
      success: true,
      data: {
        totalFoods,
        totalUsers,
        totalOrders,
        pendingOrders,
        cancelledOrders,
        cancelRate:
          totalOrders > 0
            ? Math.round((cancelledOrders / totalOrders) * 10000) / 100
            : 0,
        lowStock,
        pendingReviews,
        revenue: revenueAgg[0]?.total || 0,
        totalCompletedOrders: revenueAgg[0]?.count || 0,
        avgOrderValue: Math.round(avgOrderValue[0]?.avg || 0),
        revenueToday: revenueToday[0]?.total || 0,
        revenueThisWeek: revenueThisWeek[0]?.total || 0,
        revenueThisMonth: revenueThisMonth[0]?.total || 0,
        orderToday,
        orderThisWeek,
        orderThisMonth,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 5, 20);
    const foods = await Food.find()
      .sort({ soldCount: -1 })
      .limit(limit)
      .populate("brand", "name logo")
      .select("name image price soldCount stock category");

    res.json({ success: true, data: foods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopCustomers = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 5, 20);

    const customers = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          fullName: "$user.fullName",
          email: "$user.email",
          avatar: "$user.avatar",
          totalSpent: 1,
          orderCount: 1,
        },
      },
    ]);

    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 10;
    const foods = await Food.find({ stock: { $lte: threshold } })
      .sort({ stock: 1 })
      .limit(20)
      .select("name image price stock category isAvailable");

    res.json({ success: true, data: foods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopBrands = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 5, 20);
    const brands = await Food.aggregate([
      { $match: { brand: { $ne: null }, soldCount: { $gt: 0 } } },
      { $group: { _id: "$brand", sold: { $sum: "$soldCount" }, revenue: { $sum: { $multiply: ["$soldCount", "$price"] } } } },
      { $sort: { sold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "brands",
          localField: "_id",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      { $unwind: { path: "$brandInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: { $ifNull: ["$brandInfo.name", "$_id"] },
          logo: "$brandInfo.logo",
          sold: 1,
          revenue: 1,
        },
      },
    ]);

    res.json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getConversionAnalytics = async (req, res) => {
  try {
    const days = Math.min(Number(req.query.days) || 30, 365);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [visits, completedOrders, totalOrders] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: since } }),
      Order.countDocuments({ status: "Completed", createdAt: { $gte: since } }),
      Order.countDocuments({ status: { $ne: "Cancelled" }, createdAt: { $gte: since } }),
    ]);

    const sessionCount = Number(req.query.sessions) || Math.max(visits * 3, 100);
    const checkoutRate = totalOrders > 0 ? Math.round((totalOrders / sessionCount) * 10000) / 100 : 0;
    const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 10000) / 100 : 0;

    res.json({
      success: true,
      data: {
        days,
        sessions: sessionCount,
        visits,
        totalOrders,
        completedOrders,
        checkoutRate,
        completionRate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSalesAnalytics = async (req, res) => {
  try {
    const groupBy = ["day", "week", "month"].includes(req.query.groupBy)
      ? req.query.groupBy
      : "month";
    const days = Math.min(Number(req.query.days) || 30, 365);

    const since = new Date();
    since.setDate(since.getDate() - days);

    let dateProject = {};
    if (groupBy === "day") {
      dateProject = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    } else if (groupBy === "week") {
      dateProject = {
        year: { $year: "$createdAt" },
        week: { $isoWeek: "$createdAt" },
      };
    } else {
      dateProject = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
    }

    const [revenueByPeriod, ordersByStatus, categorySales] = await Promise.all([
      Order.aggregate([
        { $match: { status: "Completed", createdAt: { $gte: since } } },
        { $group: { _id: dateProject, revenue: { $sum: "$totalPrice" }, orders: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.week": 1 } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Food.aggregate([
        { $match: { soldCount: { $gt: 0 } } },
        { $group: { _id: "$category", sold: { $sum: "$soldCount" } } },
        { $sort: { sold: -1 } },
        { $limit: 10 },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        groupBy,
        revenueByPeriod,
        ordersByStatus,
        categorySales,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
