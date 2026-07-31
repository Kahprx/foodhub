import { registerService, loginService, getUsersService } from "../services/auth.service.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const register = async (req, res)=> {
    try {
        const result = await registerService (req.body);
        
        return res.status(201).json({
            success : true,
            message :"Register successfully",
            data: result,

        });
    
    } catch(error){
        return res.status(400).json({
            success :false,
            message :error.message,
        });
    }
};

export const login = async (req, res) => {
   try{
    const result = await loginService(req.body);

    return res.status(200).json({
        success: true,
        message:"dang nhap thanh cong",
        data: result,
    });
   }catch (error){
    return res.status(400).json({
        success:false,
        message:error.message,
    })
   }
};

export const profile = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};

export const getFavorites = async (req, res) => {
  const user = await User.findById(req.user.id).populate("favorites", "name price image category rating restaurant");
  return res.status(200).json({ success: true, data: user?.favorites || [] });
};

export const toggleFavorite = async (req, res) => {
  const { foodId } = req.params;
  const user = await User.findById(req.user.id);
  const exists = user.favorites.some((id) => id.toString() === foodId);
  user.favorites = exists ? user.favorites.filter((id) => id.toString() !== foodId) : [...user.favorites, foodId];
  await user.save();
  return res.status(200).json({ success: true, data: user.favorites, isFavorite: !exists });
};

export const getRecentlyViewed = async (req, res) => {
  const user = await User.findById(req.user.id).populate("recentlyViewed.food", "name price image category rating restaurant");
  const foods = (user?.recentlyViewed || []).sort((a, b) => b.viewedAt - a.viewedAt).map((item) => item.food).filter(Boolean);
  return res.status(200).json({ success: true, data: foods });
};

export const addRecentlyViewed = async (req, res) => {
  try {
    const { foodId } = req.params;

    if (!mongoose.isValidObjectId(foodId)) {
      return res.status(400).json({ success: false, message: "Food ID is invalid" });
    }

    const foodObjectId = new mongoose.Types.ObjectId(foodId);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      [
        {
          $set: {
            recentlyViewed: {
              $slice: [
                {
                  $concatArrays: [
                    [{ food: foodObjectId, viewedAt: "$$NOW" }],
                    {
                      $filter: {
                        input: { $ifNull: ["$recentlyViewed", []] },
                        as: "item",
                        cond: { $ne: ["$$item.food", foodObjectId] },
                      },
                    },
                  ],
                },
                8,
              ],
            },
          },
        },
      ],
      { returnDocument: "after", updatePipeline: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await getUsersService();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "User already deleted",
      });
    }

    user.isDeleted = true;
    await user.save();

    return res.json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
