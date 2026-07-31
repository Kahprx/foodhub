import User from "../models/User.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  sendVerifyEmail,
  sendResetPasswordEmail,
} from "./email.service.js";

const generateTokens = (user) => {
  const payload = { id: user._id, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
  const refreshToken = jwt.sign(
    { id: user._id, type: "refresh" },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  return { accessToken, refreshToken };
};

export const registerService = async (userData) => {
  const { fullName, email, password } = userData;

  if (!fullName || !email || !password) {
    throw new Error("tất cả vừa nhập đều sai hoặc không tỉm thấy thông tin");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email sai vui lòng nhập lại");
  }
  if (password.length < 6) {
    throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email đã tồn tại trên hệ thống ");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const verifyToken = crypto.randomBytes(32).toString("hex");
  user.verifyToken = verifyToken;
  user.verifyTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  if (process.env.SMTP_USER) {
    await sendVerifyEmail(user.email, verifyToken).catch(() => {});
  }

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };
};

export const verifyEmailService = async (token) => {
  const user = await User.findOne({
    verifyToken: token,
    verifyTokenExpires: { $gt: new Date() },
  });
  if (!user) throw new Error("Token xác thực không hợp lệ hoặc đã hết hạn");

  user.isVerified = true;
  user.verifyToken = null;
  user.verifyTokenExpires = null;
  await user.save();

  return { email: user.email };
};

export const loginService = async (userData) => {
  const { email, password } = userData;
  if (!email || !password) {
    throw new Error("Email và password đều sai ");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Email không tồn tại");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("password không đúng");
  }

  const { accessToken, refreshToken } = generateTokens(user);
  user.refreshToken = refreshToken;
  await user.save();

  return {
    token: accessToken,
    refreshToken,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  };
};

export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) throw new Error("Thiếu refresh token");

  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
  } catch {
    throw new Error("Refresh token không hợp lệ");
  }

  if (decoded.type !== "refresh") throw new Error("Sai loại token");

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== refreshToken) {
    throw new Error("Refresh token đã bị thu hồi");
  }

  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return tokens;
};

export const logoutService = async (refreshToken) => {
  if (!refreshToken) return;
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
    await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
  } catch {
    // token không hợp lệ, vẫn coi như đã logout
  }
};

export const forgotPasswordService = async (email) => {
  if (!email || !validator.isEmail(email)) {
    throw new Error("Email không hợp lệ");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email không tồn tại trên hệ thống");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const emailSent = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
  if (emailSent) {
    await sendResetPasswordEmail(user.email, resetToken, user.fullName || user.email);
    return { emailSent: true };
  }

  const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";
  return {
    emailSent: false,
    devMode: true,
    resetLink: `${baseUrl}/reset-password?token=${resetToken}`,
  };
};

export const resetPasswordService = async (token, newPassword) => {
  if (!token) throw new Error("Thiếu token");
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Mật khẩu mới phải có ít nhất 6 ký tự");
  }

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: new Date() },
  });
  if (!user) throw new Error("Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = null;
  user.resetTokenExpires = null;
  user.refreshToken = null;
  await user.save();

  return true;
};

export const updateProfileService = async (userId, data) => {
  const allowed = ["fullName", "phone", "avatar", "address", "addresses", "gender", "birthday"];
  const update = {};
  allowed.forEach((key) => {
    if (data[key] !== undefined) update[key] = data[key];
  });

  if (Array.isArray(update.addresses)) {
    update.addresses = update.addresses
      .map((addr) => String(addr).trim())
      .filter(Boolean);
  }

  const user = await User.findByIdAndUpdate(userId, update, {
    returnDocument: "after",
    runValidators: true,
  }).select("-password");

  if (!user) throw new Error("Không tìm thấy người dùng");
  return user;
};

export const changePasswordService = async (userId, { currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    throw new Error("Vui lòng nhập đầy đủ mật khẩu");
  }
  if (newPassword.length < 6) {
    throw new Error("Mật khẩu mới phải có ít nhất 6 ký tự");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("Không tìm thấy người dùng");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Mật khẩu hiện tại không đúng");

  user.password = await bcrypt.hash(newPassword, 10);
  user.refreshToken = null;
  await user.save();

  return true;
};

export const getUsersService = async (query = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const filter = { isDeleted: { $ne: true } };

  if (query.keyword) {
    filter.$or = [
      { fullName: { $regex: query.keyword, $options: "i" } },
      { email: { $regex: query.keyword, $options: "i" } },
    ];
  }
  if (query.role) {
    filter.role = query.role;
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -refreshToken -verifyToken -resetToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return { users, total, page, limit };
};

export const getDeletedUsersService = async () => {
  return User.find({ isDeleted: true })
    .select("-password")
    .sort({ updatedAt: -1 });
};

export const restoreUserService = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("Không tìm thấy người dùng");
  user.isDeleted = false;
  await user.save();
  return user;
};

export const changeUserRoleService = async (id, role) => {
  const valid = ["customer", "admin", "restaurant"];
  if (!valid.includes(role)) throw new Error("Vai trò không hợp lệ");
  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { returnDocument: "after" }
  ).select("-password");
  if (!user) throw new Error("Không tìm thấy người dùng");
  return user;
};
