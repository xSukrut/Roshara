import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "../routes/authRoutes.js";
import productRoutes from '../routes/productRoutes.js';
import collectionRoutes from '../routes/collectionRoutes.js';
import orderRoutes from "../routes/orderRoutes.js";
import couponRoutes from "../routes/couponRoutes.js";
import path from "path";
import uploadRoutes from "../routes/uploadRoutes.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not set. Create Backend/.env");
  process.exit(1);
}


const app = express();

// Middleware to parse JSON
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors({
  origin: frontendOrigin,
  credentials: true, 
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000, // 15s timeout
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/orders", orderRoutes)
app.use("/api/coupons", couponRoutes);
app.use("/api/upload", uploadRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
