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
let sort = {};

if (query.sort === "price") {
  sort.price = 1;
} else if (query.sort === "-price") {
  sort.price = -1;
} else if (query.sort === "name") {
  sort.name = 1;
} else if (query.sort === "-name") {
  sort.name = -1;
} else {
  sort.createdAt = -1; // Mặc định mới nhất
}
  const total = await Food.countDocuments(filter);

  const foods = await Food.find(filter)
    .populate("restaurant", "name address phone")
    .skip(skip)
    .limit(limit);

  return {
    foods,
    total,
    page,
    limit,
  };
  
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
      new: true,
      runValidators: true,
    }
  );
  return food;
};
export const deleteFoodService = async(id) =>{
  const food = await Food.findByIdAndDelete(id);

  return food;
}