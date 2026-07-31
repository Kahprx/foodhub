import {
  createBrandService,
  getAllBrandsService,
  getBrandByIdService,
  updateBrandService,
  deleteBrandService,
} from "../services/brand.service.js";

export const createBrand = async (req, res) => {
  try {
    const brand = await createBrandService(req.body);
    return res.status(201).json({ success: true, message: "Tạo thương hiệu thành công", data: brand });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const brands = await getAllBrandsService(req.query);
    return res.status(200).json({ success: true, count: brands.length, data: brands });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBrandById = async (req, res) => {
  try {
    const brand = await getBrandByIdService(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: "Không tìm thấy thương hiệu" });
    }
    return res.status(200).json({ success: true, data: brand });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const brand = await updateBrandService(req.params.id, req.body);
    return res.status(200).json({ success: true, message: "Cập nhật thương hiệu thành công", data: brand });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const brand = await deleteBrandService(req.params.id);
    return res.status(200).json({ success: true, message: "Xóa thương hiệu thành công", data: brand });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
