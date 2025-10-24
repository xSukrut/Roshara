import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "../routes/authRoutes.js";
import productRoutes from '../routes/productRoutes.js';
import collectionRoutes from '../routes/collectionRoutes.js';
import orderRoutes from "../routes/orderRoutes.js";
import couponRoutes from "../routes/couponRoutes.js";

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

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
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/orders", orderRoutes)
app.use("/api/coupons", couponRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
