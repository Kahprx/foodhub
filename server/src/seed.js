import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { seedDatabase } from "./utils/seeder.js";

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected MongoDB");
  await seedDatabase();
  await mongoose.disconnect();
  console.log("✅ Seed hoàn tất (disconnected)");
}

seed().catch((err) => {
  console.error("❌ Seed lỗi:", err);
  process.exit(1);
});
