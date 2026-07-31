import Food from "../models/Food.js";
import StockLog from "../models/StockLog.js";
import mongoose from "mongoose";

export const createFoodService = async (foodData) => {
  if (foodData.images && foodData.images.length > 0 && !foodData.image) {
    foodData.image = foodData.images[0];
  }
  const food = await Food.create(foodData);
  return food;
};

export const getAllFoodsService = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 5, 1), 50);
  const skip = (page - 1) * limit;

  const filter = {};

  if (query.keyword) {
    filter.name = {
      $regex: query.keyword,
      $options: "i",
    };
  }
  if (query.category) {
    filter.category = { $in: query.category.split(",") };
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.minRating) filter.rating = { $gte: Number(query.minRating) };

  if (query.restaurant) {
    filter.restaurant = query.restaurant;
  }

  if (query.brand) {
    filter.brand = query.brand;
  }

  if (query.isAvailable !== undefined) {
    filter.isAvailable = query.isAvailable === "true";
  }

  if (query.isFeatured !== undefined) {
    filter.isFeatured = query.isFeatured === "true";
  }

  if (query.onSale === "true") {
    filter.discountPrice = { $ne: null, $gt: 0 };
  }

  if (query.lowStock === "true") {
    filter.stock = { $lte: Number(query.lowStockThreshold) || 10 };
  }

  let sort = {};
  if (query.sort === "price") {
    sort.price = 1;
  } else if (query.sort === "-price") {
    sort.price = -1;
  } else if (query.sort === "name") {
    sort.name = 1;
  } else if (query.sort === "-name") {
    sort.name = -1;
  } else if (query.sort === "rating") {
    sort.rating = -1;
  } else if (query.sort === "sold") {
    sort.soldCount = -1;
  } else if (query.sort === "new") {
    sort.createdAt = -1;
  } else {
    sort.createdAt = -1;
  }

  const total = await Food.countDocuments(filter);

  const foods = await Food.find(filter)
    .populate("restaurant", "name address phone")
    .populate("brand", "name logo")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return {
    foods,
    total,
    page,
    limit,
  };
};

export const getAllFoodsAdminService = async (query = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.keyword) {
    filter.$or = [
      { name: { $regex: query.keyword, $options: "i" } },
      { category: { $regex: query.keyword, $options: "i" } },
    ];
  }
  if (query.lowStock === "true") {
    filter.stock = { $lte: Number(query.lowStockThreshold) || 10 };
  }
  if (query.isAvailable !== undefined) {
    filter.isAvailable = query.isAvailable === "true";
  }
  if (query.category) filter.category = query.category;

  const [foods, total] = await Promise.all([
    Food.find(filter)
      .populate("restaurant", "name")
      .populate("brand", "name logo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Food.countDocuments(filter),
  ]);

  const lowStockCount = await Food.countDocuments({
    stock: { $lte: Number(query.lowStockThreshold) || 10 },
  });
  const outOfStockCount = await Food.countDocuments({ stock: 0 });

  return { foods, total, page, limit, lowStockCount, outOfStockCount };
};

export const getRecommendedFoodsService = async (query) => {
  const filter = { isAvailable: true };
  if (query.category) filter.category = query.category;
  if (query.exclude) filter._id = { $ne: query.exclude };

  return Food.find(filter)
    .populate("restaurant", "name address phone")
    .populate("brand", "name logo")
    .sort({ rating: -1, createdAt: -1 })
    .limit(Math.min(Number(query.limit) || 6, 12));
};

export const getFoodByIdService = async (id) => {
  return Food.findById(id)
    .populate("restaurant", "name address phone")
    .populate("brand", "name logo");
};

export const updateFoodService = async (id, foodData) => {
  if (foodData.images && foodData.images.length > 0) {
    foodData.image = foodData.image || foodData.images[0];
  }
  return await Food.findByIdAndUpdate(id, foodData, {
    returnDocument: "after",
    runValidators: true,
  });
};

export const deleteFoodService = async (id) => {
  const food = await Food.findByIdAndDelete(id);
  return food;
};

export const duplicateFoodService = async (id) => {
  const food = await Food.findById(id);
  if (!food) throw new Error("Không tìm thấy món ăn");

  const clone = food.toObject();
  delete clone._id;
  delete clone.createdAt;
  delete clone.updatedAt;
  clone.name = `${food.name} (Bản sao)`;
  clone.soldCount = 0;

  return Food.create(clone);
};

export const adjustStockService = async (id, { quantity, type, note }, userId) => {
  if (!mongoose.isValidObjectId(id)) throw new Error("ID không hợp lệ");
  if (!["import", "export", "adjust", "return"].includes(type)) {
    throw new Error("Loại thao tác không hợp lệ");
  }

  const food = await Food.findById(id);
  if (!food) throw new Error("Không tìm thấy món ăn");

  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty === 0) throw new Error("Số lượng không hợp lệ");

  let newStock;
  if (type === "import" || type === "return") {
    newStock = food.stock + qty;
  } else if (type === "export") {
    if (food.stock < qty) throw new Error("Tồn kho không đủ để xuất");
    newStock = food.stock - qty;
  } else {
    newStock = qty;
    if (newStock < 0) throw new Error("Tồn kho không thể âm");
  }

  food.stock = newStock;
  await food.save();

  await StockLog.create({
    food: id,
    type,
    quantity: type === "adjust" ? qty : qty,
    note: note || "",
    user: userId || null,
  });

  return food;
};

export const getStockLogsService = async (query = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.foodId) filter.food = query.foodId;
  if (query.type) filter.type = query.type;

  const [logs, total] = await Promise.all([
    StockLog.find(filter)
      .populate("food", "name image")
      .populate("user", "fullName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    StockLog.countDocuments(filter),
  ]);

  return { logs, total, page, limit };
};
