import Restaurant from "../models/Restaurant.js";

export const createRestaurantService = async (restaurantData) => {
  const restaurant = await Restaurant.create(restaurantData);

  return restaurant;
};

export const getAllRestaurantsService = async () => {
  const restaurants = await Restaurant.find();

  return restaurants;
};
export const getRestaurantByIdService = async(id) => {
  const restaurant = await Restaurant.findById(id);

  return restaurant;
};
export const updateRestaurantService = async(id , updateData)=>{
  const restaurant = await Restaurant.findByIdAndUpdate(
    id, 
    updateData,
    {
      new : true,
      runValidators: true,
    }
  );
  return restaurant;
};

export const deleteRestaurantService = async (id) => {
  const restaurant = await Restaurant.findByIdAndDelete(id);

  return restaurant;
};