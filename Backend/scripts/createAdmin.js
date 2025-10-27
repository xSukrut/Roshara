// Backend/scripts/createAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/userModel.js";

// Debug traps so we SEE errors
process.on("unhandledRejection", (e) => { console.error("UNHANDLED REJECTION:", e); process.exit(1); });
process.on("uncaughtException", (e) => { console.error("UNCAUGHT EXCEPTION:", e); process.exit(1); });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("▶️  Starting createAdmin.js");
console.log("   cwd:", process.cwd());
console.log("   __dirname:", __dirname);

// Load .env from Backend/.env explicitly
dotenv.config({ path: path.join(__dirname, "..", ".env") });
console.log("   MONGO_URI present?", Boolean(process.env.MONGO_URI));

async function run() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MISSING MONGO_URI in Backend/.env");
      process.exit(1);
    }

    console.log("🔗 Connecting to MongoDB…");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const email = "admin@roshara.com";
    const password = "Admin@123";

    console.log("🔍 Looking for user:", email);
    const existing = await User.findOne({ email });

    if (existing) {
      console.log("♻️  User exists. Updating to admin and resetting password…");
      existing.password = password;           // pre-save hook will hash it
      existing.role = "admin";
      await existing.save();
      console.log("✅ Updated existing user to admin:", email);
    } else {
      console.log("➕ Creating new admin user…");
      await User.create({
        name: "Admin User",
        email,
        password,                             // pre-save hook will hash it
        role: "admin",
      });
      console.log("✅ Created new admin:", email);
    }

    console.log("➡️  Credentials you can log in with now:");
    console.log("    Email   :", email);
    console.log("    Password:", password);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

run();
