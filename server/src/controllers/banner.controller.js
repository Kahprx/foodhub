import {
  createBannerService,
  getAllBannersService,
  getActiveBannersService,
  getBannerByIdService,
  updateBannerService,
  deleteBannerService,
} from "../services/banner.service.js";

export const createBanner = async (req, res) => {
  try {
    const banner = await createBannerService(req.body);
    return res.status(201).json({ success: true, message: "Tạo banner thành công", data: banner });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllBanners = async (req, res) => {
  try {
    const banners = await getAllBannersService(req.query);
    return res.status(200).json({ success: true, data: banners });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveBanners = async (req, res) => {
  try {
    const banners = await getActiveBannersService(req.query.position);
    return res.status(200).json({ success: true, data: banners });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBannerById = async (req, res) => {
  try {
    const banner = await getBannerByIdService(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Không tìm thấy banner" });
    }
    return res.status(200).json({ success: true, data: banner });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const banner = await updateBannerService(req.params.id, req.body);
    return res.status(200).json({ success: true, message: "Cập nhật banner thành công", data: banner });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await deleteBannerService(req.params.id);
    return res.status(200).json({ success: true, message: "Xóa banner thành công", data: banner });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
