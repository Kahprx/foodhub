import Cart from "../models/cart.js";
import Food from "../models/Food.js";

export const addToCartService = async (userId, foodId, quantity) => {
  const foodExists = await Food.findById(foodId);
  if (!foodExists) {
    throw new Error("Món ăn không tồn tại");
  }
  if (!foodExists.isAvailable) {
    throw new Error(`"${foodExists.name}" hiện không khả dụng`);
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
  user: userId,
  items: [
    {
      food: foodId,
      quantity,
    },
  ],
});

    return cart;
  }

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
export const getCarService = async(userId) => {
  const cart = await Cart.findOne({user : userId})
  .populate({
    path:"items.food",
    select:"name price discountPrice image stock isAvailable restaurant",
    populate:{
      path:"restaurant", 
      select:"name address",
    },
  });
  if(!cart){
    return null;
  }
  let totalPrice = 0;
  cart.items.forEach((item) =>{
    if (item.food){
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
export const removeCartItemService = async (userId, foodId) =>{
  const cart = await Cart.findOne({user : userId});

  if(!cart) {
    return null;
  }

  cart.items = cart.items.filter(
    (item) => item.food.toString() !== foodId
  );
  await cart.save();

  return cart;
}
export const clearCartService = async(userId) =>{
  const cart = await Cart.findOne({user : userId});

  if(!cart) {
    return null;
  }
cart.items = [];
  await cart.save();
  return cart;
};