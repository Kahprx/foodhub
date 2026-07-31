import {
  registerService,
  loginService,
  getUsersService,
  getDeletedUsersService,
  restoreUserService,
  changeUserRoleService,
  verifyEmailService,
  refreshTokenService,
  logoutService,
  forgotPasswordService,
  resetPasswordService,
  updateProfileService,
  changePasswordService,
} from "../services/auth.service.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import Notification from "../models/Notification.js";

const publicUserFields = "-password -refreshToken -verifyToken -resetToken -verifyTokenExpires -resetTokenExpires";

export const register = async (req, res) => {
  try {
    const result = await registerService(req.body);

    return res.status(201).json({
      success: true,
      message: "Register successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const result = await verifyEmailService(req.body.token);
    return res.status(200).json({
      success: true,
      message: "Xác thực email thành công",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const resendVerifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) throw new Error("Vui lòng nhập email");

    const user = await User.findOne({ email });
    if (!user) throw new Error("Email không tồn tại");
    if (user.isVerified) throw new Error("Email đã được xác thực");

    const { sendVerifyEmail } = await import("../services/email.service.js");
    await sendVerifyEmail(email, user.verifyToken);

    return res.status(200).json({ success: true, message: "Đã gửi lại email xác thực" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginService(req.body);

    return res.status(200).json({
      success: true,
      message: "dang nhap thanh cong",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await refreshTokenService(refreshToken);

    return res.status(200).json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await logoutService(refreshToken);
    return res.status(200).json({ success: true, message: "Đăng xuất thành công" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body.email);
    return res.status(200).json({
      success: true,
      message: result.emailSent
        ? "Link đặt lại mật khẩu đã được gửi qua email"
        : "SMTP chưa cấu hình, sử dụng link trả về trong dev mode",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    await resetPasswordService(req.body.token, req.body.newPassword);
    return res.status(200).json({
      success: true,
      message: "Đặt lại mật khẩu thành công",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const profile = async (req, res) => {
  const user = await User.findById(req.user.id).select(publicUserFields);
  return res.status(200).json({
    success: true,
    data: user,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const user = await updateProfileService(req.user.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Cập nhật hồ sơ thành công",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    if (!address || !String(address).trim()) {
      return res.status(400).json({ success: false, message: "Địa chỉ không được để trống" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });

    const cleaned = String(address).trim();
    if (!user.addresses.includes(cleaned)) {
      user.addresses.push(cleaned);
      await user.save();
    }

    return res.status(200).json({ success: true, message: "Đã thêm địa chỉ", data: user.addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeAddress = async (req, res) => {
  try {
    const { index } = req.params;
    const idx = Number(index);

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    if (!Number.isInteger(idx) || idx < 0 || idx >= (user.addresses || []).length) {
      return res.status(400).json({ success: false, message: "Chỉ số địa chỉ không hợp lệ" });
    }

    user.addresses.splice(idx, 1);
    await user.save();

    return res.status(200).json({ success: true, message: "Đã xóa địa chỉ", data: user.addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    await changePasswordService(req.user.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getFavorites = async (req, res) => {
  const user = await User.findById(req.user.id).populate("favorites", "name price image images category rating restaurant stock discountPrice");
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
  const user = await User.findById(req.user.id).populate("recentlyViewed.food", "name price image images category rating restaurant");
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
    const result = await getUsersService(req.query);
    return res.status(200).json({
      success: true,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
      data: result.users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDeletedUsers = async (req, res) => {
  try {
    const users = await getDeletedUsersService();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const restoreUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await restoreUserService(id);
    return res.status(200).json({
      success: true,
      message: "Khôi phục người dùng thành công",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await changeUserRoleService(id, role);
    return res.status(200).json({
      success: true,
      message: "Cập nhật vai trò thành công",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
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

export const getMyNotifications = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const filter = {
      $or: [{ recipient: req.user.id }, { isGlobal: true }],
    };

    const [notifications, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(filter),
    ]);

    const unread = await Notification.countDocuments({
      $or: [{ recipient: req.user.id }, { isGlobal: true }],
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      total,
      unread,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { returnDocument: "after" }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: "Không tìm thấy thông báo" });
    }
    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        $or: [{ recipient: req.user.id }, { isGlobal: true }],
        isRead: false,
      },
      { isRead: true }
    );
    return res.status(200).json({ success: true, message: "Đã đánh dấu tất cả đã đọc" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
