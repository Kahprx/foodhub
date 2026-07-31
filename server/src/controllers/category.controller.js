import {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/category.service.js";

export const createCategory = async (req, res) => {
  try {
    const category = await createCategoryService(req.body);
    return res.status(201).json({ success: true, message: "Tạo danh mục thành công", data: category });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesService(req.query);
    return res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await getCategoryByIdService(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    }
    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await updateCategoryService(req.params.id, req.body);
    return res.status(200).json({ success: true, message: "Cập nhật danh mục thành công", data: category });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await deleteCategoryService(req.params.id);
    return res.status(200).json({ success: true, message: "Xóa danh mục thành công", data: category });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
