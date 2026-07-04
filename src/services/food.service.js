import Food from "../models/Food.js";

export const createFoodService = async (foodData) => {
  const food = await Food.create(foodData);
  return food;
};
export const getAllFoodsService = async()=>{
  const food = await Food.find();
  return food;
};

export const getFoodByIdService = async(id)=>{
  const food = await Food.findById(id);
  return food;
}