import Cart from "../models/Cart.js";
import Food from "../models/Food.js";

export const addToCartService = async (userId, foodId, quantity) => {
  const foodExists = await Food.findById(foodId);
  if (!foodExists) {
    throw new Error("Món ăn không tồn tại");
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
    select:"name price image restaurant",
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
      totalPrice += item.food.price * item.quantity;
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