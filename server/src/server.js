import dotenv from "dotenv";
dotenv.config();

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