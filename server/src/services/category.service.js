import Category from "../models/Category.js";
import Food from "../models/Food.js";

export const createCategoryService = async (data) => {
  const existing = await Category.findOne({ name: data.name });
  if (existing) throw new Error("Danh mục đã tồn tại");
  return Category.create(data);
};

export const getAllCategoriesService = async (query = {}) => {
  const filter = {};
  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";

  const categories = await Category.find(filter).sort({ sortOrder: 1, name: 1 });

  const withCount = await Promise.all(
    categories.map(async (cat) => {
      const count = await Food.countDocuments({ category: cat.name, isAvailable: true });
      return { ...cat.toObject(), foodCount: count };
    })
  );

  return withCount;
};

export const getCategoryByIdService = async (id) => {
  return Category.findById(id);
};

export const updateCategoryService = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!category) throw new Error("Không tìm thấy danh mục");
  return category;
};

export const deleteCategoryService = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new Error("Không tìm thấy danh mục");
  return category;
};
