import Brand from "../models/Brand.js";
import Food from "../models/Food.js";

export const createBrandService = async (data) => {
  const existing = await Brand.findOne({ name: data.name });
  if (existing) throw new Error("Thương hiệu đã tồn tại");
  return Brand.create(data);
};

export const getAllBrandsService = async (query = {}) => {
  const filter = {};
  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";

  const brands = await Brand.find(filter).sort({ name: 1 });

  const withCount = await Promise.all(
    brands.map(async (brand) => {
      const count = await Food.countDocuments({ brand: brand._id, isAvailable: true });
      return { ...brand.toObject(), foodCount: count };
    })
  );

  return withCount;
};

export const getBrandByIdService = async (id) => {
  return Brand.findById(id);
};

export const updateBrandService = async (id, data) => {
  const brand = await Brand.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!brand) throw new Error("Không tìm thấy thương hiệu");
  return brand;
};

export const deleteBrandService = async (id) => {
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) throw new Error("Không tìm thấy thương hiệu");
  return brand;
};
