import Restaurant from "../models/Restaurant.js";

export const createRestaurantService = async (restaurantData) => {
  const restaurant = await Restaurant.create(restaurantData);

  return restaurant;
};
export const getAllRestaurantsService = async (
  keyword,
  page = 1,
  limit = 10,
  sort = "-createdAt"
) => {
  let filter = {};

  if (keyword) {
    filter = {
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          address: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    };
  }

  const skip = (page - 1) * limit;

  const restaurants = await Restaurant.find(filter)
    .populate("owner", "fullName email role")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Restaurant.countDocuments(filter);

  return {
    restaurants,
    total,
  };
};
export const getRestaurantByIdService = async(id) => {
 const restaurant = await Restaurant.findById(id).populate(
        "owner",
        "fullName email role"
    );

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