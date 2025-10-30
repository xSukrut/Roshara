// Backend/models/Coupon.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
    value: { type: Number, required: true }, // percentage or fixed amount
    minOrderAmount: { type: Number, default: 0 }, // e.g., 1899
    active: { type: Boolean, default: true },
    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0 },
    expiryDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
