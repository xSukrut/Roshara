import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const adminEmail = "admin@example.com";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists, deleting old one...");
      await User.deleteOne({ email: adminEmail });
    }

    console.log("Creating admin user...");

    // 👉 DO NOT manually hash password here
    const adminUser = await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: "Admin@123", // plain password — model will hash it automatically
      role: "admin",
    });

    console.log("✅ Admin created successfully:");
    console.log({
      email: adminUser.email,
      password: "Admin@123",
      role: adminUser.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    process.exit(1);
  }
};

seedAdmin();
