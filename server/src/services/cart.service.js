import Cart from "../models/cart.js";
import Food from "../models/Food.js";

// Gom các cart trùng của 1 user (do race lúc tạo trước đây) thành 1 cart duy nhất,
// gộp items và xóa các cart thừa. Trả về cart được giữ lại.
export const mergeAndDedupeCarts = async (userId) => {
  const carts = await Cart.find({ user: userId }).sort({ updatedAt: 1 });
  if (carts.length === 0) return null;

  const keep = carts.find((c) => c.items.length > 0) || carts[0];
  const rest = carts.filter((c) => c._id.toString() !== keep._id.toString());

  for (const other of rest) {
    for (const item of other.items) {
      const existing = keep.items.find(
        (i) => i.food && item.food && i.food.toString() === item.food.toString()
      );
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        keep.items.push(item);
      }
    }
    await Cart.deleteOne({ _id: other._id });
  }

  await keep.save();
  return keep;
};

// Tìm (hoặc tạo atomically) cart của user - tránh race tạo ra cart trùng lặp.
export const getOrCreateCart = async (userId) => {
  return Cart.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { user: userId, items: [] } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

// Dọn toàn bộ cart trùng lặp trong DB (chạy lúc khởi động server).
export const cleanupAllDuplicateCarts = async () => {
  const groups = await Cart.aggregate([
    { $group: { _id: "$user", count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);

  for (const group of groups) {
    if (!group._id) continue;
    await mergeAndDedupeCarts(group._id);
  }
};

export const addToCartService = async (userId, foodId, quantity) => {
  const foodExists = await Food.findById(foodId);
  if (!foodExists) {
    throw new Error("Món ăn không tồn tại");
  }
  if (!foodExists.isAvailable) {
    throw new Error(`"${foodExists.name}" hiện không khả dụng`);
  }

  const cart = await getOrCreateCart(userId);

  const item = cart.items.find(
    (i) => i.food.toString() === foodId
  );

  const requested = (item ? item.quantity : 0) + quantity;
  if (foodExists.stock < requested) {
    throw new Error(
      `"${foodExists.name}" chỉ còn ${foodExists.stock} sản phẩm trong kho`
    );
  }

  if (item) {
    item.quantity += quantity;
  } else {
    cart.items.push({
      food: foodId,
      quantity,
    });
  }

  await cart.save();

  return cart;
};

export const getCarService = async (userId) => {
  await mergeAndDedupeCarts(userId);

  const cart = await Cart.findOne({ user: userId })
    .populate({
      path: "items.food",
      select: "name price discountPrice image stock isAvailable restaurant",
      populate: {
        path: "restaurant",
        select: "name address",
      },
    });

  if (!cart) {
    return null;
  }

  // Lọc các món đã bị xóa khỏi hệ thống (populate trả null)
  cart.items = cart.items.filter((item) => item.food);

  let totalPrice = 0;
  cart.items.forEach((item) => {
    if (item.food) {
      const unitPrice = item.food.discountPrice > 0 ? item.food.discountPrice : item.food.price;
      totalPrice += unitPrice * item.quantity;
    }
  });

  return {
    cart,
    totalPrice,
  };
};

export const updateCartItemService = async (userId, foodId, quantity) => {
  await mergeAndDedupeCarts(userId);

  const cart = await Cart.findOne({ user: userId });

  if (!cart) return null;

  const item = cart.items.find(
    (item) => item.food.toString() === foodId
  );

  if (!item) return null;

  const foodExists = await Food.findById(foodId);
  if (foodExists && !foodExists.isAvailable) {
    throw new Error(`"${foodExists.name}" hiện không khả dụng`);
  }
  if (foodExists && quantity > foodExists.stock) {
    throw new Error(
      `"${foodExists.name}" chỉ còn ${foodExists.stock} sản phẩm trong kho`
    );
  }

  item.quantity = quantity;

  await cart.save();

  return cart;
};

export const removeCartItemService = async (userId, foodId) => {
  await mergeAndDedupeCarts(userId);

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return null;
  }

  cart.items = cart.items.filter(
    (item) => item.food.toString() !== foodId
  );
  await cart.save();

  return cart;
};

export const clearCartService = async (userId) => {
  await mergeAndDedupeCarts(userId);

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return null;
  }

  cart.items = [];
  await cart.save();

  return cart;
};
