import dotenv from "dotenv";
import dns from "node:dns";
dotenv.config();

// Gmail SMTP chỉ hỗ trợ IPv4; Railway có thể resolve ra IPv6 -> buộc dùng IPv4
dns.setDefaultResultOrder("ipv4first");

import { webcrypto } from "node:crypto";
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

import app from "./app.js";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import { seedDatabase } from "./utils/seeder.js";

const PORT = process.env.PORT || 5000;

await connectDB();

const userCount = await User.countDocuments();
if (userCount === 0) {
  console.log("🌱 DB trống, seed demo data...");
  await seedDatabase();
}

app.listen(PORT, () => {
  console.log(`🚀 Server dang chay o ${PORT}`);
});