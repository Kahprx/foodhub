import dotenv from "dotenv";
import dns from "node:dns";
dotenv.config();

// Gmail SMTP chỉ hỗ trợ IPv4; Railway có thể resolve ra IPv6 -> buộc dùng IPv4
dns.setDefaultResultOrder("ipv4first");

import { webcrypto } from "node:crypto";
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

import { createServer } from "node:http";
import app from "./app.js";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import { seedDatabase } from "./utils/seeder.js";
import { initSocket } from "./services/socket.service.js";
import { cleanupAllDuplicateCarts } from "./services/cart.service.js";

const PORT = process.env.PORT || 5000;

await connectDB();

// Dọn các cart bị duplicate (do race tạo ra trước khi có fix) trước khi phục vụ
cleanupAllDuplicateCarts()
  .then(() => console.log("🧹 Da don xong cart trung lap (neu co)"))
  .catch((err) => console.error("Loi don cart trung lap:", err.message));

const userCount = await User.countDocuments();
if (userCount === 0) {
  console.log("🌱 DB trống, seed demo data...");
  await seedDatabase();
}

const server = createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server dang chay o ${PORT}`);
});