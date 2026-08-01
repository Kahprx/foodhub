import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, "../../templates");

const compileTemplate = async (name, context) => {
  const source = await readFile(path.join(TEMPLATES_DIR, `${name}.hbs`), "utf-8");
  return Handlebars.compile(source)(context);
};

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const config = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  };

  transporter = nodemailer.createTransport(config);
  return transporter;
};

export const isEmailConfigured = () => Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

export const sendMail = async ({ to, subject, html, text }) => {
  if (!isEmailConfigured()) {
    console.warn("[EmailService] SMTP chưa được cấu hình, bỏ qua gửi mail tới:", to);
    return { skipped: true };
  }

  try {
    const info = await getTransporter().sendMail({
      from: `"HappyHomes" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });
    return { skipped: false, messageId: info.messageId };
  } catch (error) {
    console.error("[EmailService] Lỗi gửi mail:", error.message);
    throw error;
  }
};

export const sendVerifyEmail = (to, token) => {
  const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const link = `${baseUrl}/verify-email?token=${token}`;
  return sendMail({
    to,
    subject: "Xác thực email - HappyHomes",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="margin: 0 0 12px; color: #111827;">Chào mừng đến HappyHomes! 🎉</h2>
        <p style="color: #374151; line-height: 1.6;">Vui lòng nhấn nút bên dưới để xác thực email của bạn:</p>
        <a href="${link}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #f97316; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold;">Xác thực email</a>
        <p style="color: #6b7280; font-size: 13px;">Hoặc copy link: <a href="${link}">${link}</a></p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">Link hết hạn sau 24 giờ.</p>
      </div>
    `,
  });
};

export const sendResetPasswordEmail = async (to, resetToken, name = "") => {
  const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
  const username = name || to;
  const year = new Date().getFullYear();

  const context = {
    USERNAME: username,
    TOKEN: resetToken,
    RESET_URL: resetUrl,
    YEAR: year,
  };
  const html = await compileTemplate("forgot-password", context);

  return sendMail({
    to,
    subject: "Đặt lại mật khẩu",
    html,
    text: `Xin chào ${username},\n\nChúng tôi nhận được yêu cầu đặt lại mật khẩu của bạn. Nhấn nút bên dưới để tạo mật khẩu mới:\n\n${resetUrl}\n\nLink này có hiệu lực trong 15 phút.\nNếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n© ${year} Your Company. Bảo lưu mọi quyền.`,
  });
};

export const sendOrderStatusEmail = (to, orderId, status) => {
  const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const statusLabel = {
    Pending: "Đang chờ xử lý",
    Confirmed: "Đã xác nhận",
    Preparing: "Đang chuẩn bị",
    Delivering: "Đang giao hàng",
    Completed: "Đã hoàn thành",
    Cancelled: "Đã hủy",
  }[status] || status;

  return sendMail({
    to,
    subject: `Đơn hàng #${orderId.slice(-6)} cập nhật trạng thái - HappyHomes`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="margin: 0 0 12px; color: #111827;">Cập nhật đơn hàng 📦</h2>
        <p style="color: #374151; line-height: 1.6;">Đơn hàng <strong>#${orderId.slice(-6)}</strong> của bạn hiện đang ở trạng thái: <strong>${statusLabel}</strong></p>
        <a href="${baseUrl}/orders" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #f97316; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold;">Xem đơn hàng</a>
      </div>
    `,
  });
};
