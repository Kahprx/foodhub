import {
  addToWishlistService,
  getWishlistService,
  removeFromWishlistService,
} from "../services/wishlist.service.js";

export const getWishlist = async (req, res) => {
  try {
    const foods = await getWishlistService(req.user.id);
    return res.status(200).json({ success: true, data: foods });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const foods = await addToWishlistService(req.user.id, req.body.foodId);
    return res.status(201).json({ success: true, data: foods });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const foods = await removeFromWishlistService(req.user.id, req.params.foodId);
    return res.status(200).json({ success: true, data: foods });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
