import dotenv from "dotenv";
dotenv.config();

import { webcrypto } from "node:crypto";
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

console.log(
  "DIAG node:",
  process.version,
  "| crypto:",
  typeof globalThis.crypto,
  "| mongoHost:",
  process.env.MONGODB_URI?.split("@")[1] || "unset"
);

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server dang chay o ${PORT}`);
});