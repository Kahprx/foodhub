import Banner from "../models/Banner.js";

export const createBannerService = async (data) => {
  return Banner.create(data);
};

export const getAllBannersService = async (query = {}) => {
  const filter = {};
  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";
  if (query.position) filter.position = query.position;

  const banners = await Banner.find(filter).sort({ sortOrder: 1, createdAt: -1 });
  return banners;
};

export const getActiveBannersService = async (position) => {
  const filter = { isActive: true };
  if (position) filter.position = position;
  return Banner.find(filter).sort({ sortOrder: 1, createdAt: -1 });
};

export const getBannerByIdService = async (id) => {
  return Banner.findById(id);
};

export const updateBannerService = async (id, data) => {
  const banner = await Banner.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!banner) throw new Error("Không tìm thấy banner");
  return banner;
};

export const deleteBannerService = async (id) => {
  const banner = await Banner.findByIdAndDelete(id);
  if (!banner) throw new Error("Không tìm thấy banner");
  return banner;
};
