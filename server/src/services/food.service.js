import Food from "../models/Food.js";

export const createFoodService = async (foodData) => {
  const food = await Food.create(foodData);
  return food;
};
export const getAllFoodsService = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 5;
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

// Filter theo restaurant
if (query.restaurant) {
  filter.restaurant = query.restaurant;
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
} else {
  sort.createdAt = -1; // Mặc định mới nhất
}
  const total = await Food.countDocuments(filter);

  const foods = await Food.find(filter)
  .populate("restaurant", "name address phone")
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

export const getRecommendedFoodsService = async (query) => {
  const filter = { isAvailable: true };
  if (query.category) filter.category = query.category;
  if (query.exclude) filter._id = { $ne: query.exclude };

  return Food.find(filter)
    .populate("restaurant", "name address phone")
    .sort({ rating: -1, createdAt: -1 })
    .limit(Math.min(Number(query.limit) || 6, 12));
};

export const getFoodByIdService = async(id)=>{
  return Food.findById(id)
  .populate("restaurant", "name address phone");
}

export const updateFoodService = async (id, foodData) => {
  return await Food.findByIdAndUpdate(
    id,
    foodData,
    {
      returnDocument: "after",
      runValidators: true,
    }
  );
};
export const deleteFoodService = async(id) =>{
  const food = await Food.findByIdAndDelete(id);

  return food;
}
