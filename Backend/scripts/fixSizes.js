// scripts/fixSizes.js
import mongoose from "mongoose";
import Product from "../models/Product.js";

const DEFAULT_SIZES = ["XS","S","M","L","XL"]; // or your full ROSHARA_SIZES

await mongoose.connect(process.env.MONGO_URI);

await Product.updateMany(
  { $or: [{ sizes: { $exists: false } }, { sizes: { $size: 0 } }] },
  { $set: { sizes: DEFAULT_SIZES } }
);

console.log("Sizes normalized");
process.exit(0);
